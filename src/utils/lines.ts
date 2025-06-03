import * as vscode from "vscode";
import * as common from "../common";
import Seq, { seq } from "./seq";
import * as lineUtils from "../utils/lines";
import { rangeToPosition } from "./selectionsAndRanges";
import { IterationOptions } from "../io/SubjectIOBase";
import { Direction, directionToDelta } from "../common";
import { getWordDefinition, IsWordWrapEnabled, GetWordWrapColumn } from "../config";
import  WrapIterator  from "./wrapIterator";
import  {outputChannel}  from "./wrapIterator";

// let outputChannel = vscode.window.createOutputChannel("Vah.lines");

export type LinePair =
    | { prev: undefined; current: vscode.TextLine }
    | { prev: vscode.TextLine; current: undefined }
    | { prev: vscode.TextLine; current: vscode.TextLine };

function changeToDiff(change: common.Change) {
    if (change === "greaterThan") {
        return (x: number, y: number) => x > y;
    }
    return (x: number, y: number) => x < y;
}

export function getNearestSignificantLine(
    document: vscode.TextDocument,
    position: vscode.Position
): vscode.TextLine {
    const currentLine = document.lineAt(position.line);

    if (currentLine.isEmptyOrWhitespace) {
        const lines = lineUtils.iterLinesOutwards(document, position.line);

        for (const { backwardsLine, forwardsLine } of lines) {
            if (backwardsLine && !backwardsLine.isEmptyOrWhitespace) {
                return backwardsLine;
            }

            if (forwardsLine && !forwardsLine.isEmptyOrWhitespace) {
                return forwardsLine;
            }
        }
    }

    return currentLine;
}

export function rangeWithoutIndentation(line: vscode.TextLine) {
    return line.range.with({
        start: line.range.start.with({
            character: line.firstNonWhitespaceCharacterIndex,
        }),
    });
}

export function getNextLineOfChangeOfIndentation(
    change: common.Change,
    direction: common.Direction,
    document: vscode.TextDocument,
    currentLine: vscode.TextLine
) {
    const diff = changeToDiff(change);
    let lastLine = undefined

    for (const line of iterLines(document, {
        startingPosition: currentLine.range.start,
        direction,
        currentInclusive: false,
    })) {
        if (
            line &&
            !line.isEmptyOrWhitespace &&
            diff(
                line.firstNonWhitespaceCharacterIndex,
                currentLine.firstNonWhitespaceCharacterIndex
            )
        ) {
            return line;
        }
        else if (!line.isEmptyOrWhitespace) {
            lastLine = line
        }
    }
    return lastLine
}

export function getRelativeIndentation(
    startingLine: vscode.TextLine,
    targetLine: vscode.TextLine
): common.RelativeIndentation {
    if (targetLine.isEmptyOrWhitespace) {
        return "no-indentation";
    }

    if (
        startingLine.firstNonWhitespaceCharacterIndex >
        targetLine.firstNonWhitespaceCharacterIndex
    ) {
        return "less-indentation";
    }

    if (
        startingLine.firstNonWhitespaceCharacterIndex <
        targetLine.firstNonWhitespaceCharacterIndex
    ) {
        return "more-indentation";
    }

    return "same-indentation";
}

export function getRelativeCommentedIndentation(
    startingLine: vscode.TextLine,
    targetLine: vscode.TextLine
): common.RelativeIndentation {
    if (targetLine.isEmptyOrWhitespace) {
        return "no-indentation";
    }

    if (
        startingLine.firstNonWhitespaceCharacterIndex >
        targetLine.firstNonWhitespaceCharacterIndex
    ) {
        return "less-indentation";
    }

    if (
        startingLine.firstNonWhitespaceCharacterIndex <
        targetLine.firstNonWhitespaceCharacterIndex
    ) {
        return "more-indentation";
    }

    return "same-indentation";
}

export function iterLinePairs(
    document: vscode.TextDocument,
    options: IterationOptions
): Seq<LinePair> {
    return (iterLines(document, { ...options, currentInclusive: true })
        .pairwise() as Seq<[vscode.TextLine, vscode.TextLine]>)
        .map(([a, b]) =>
            options.direction === Direction.forwards
                ? { prev: a, current: b }
                : { prev: b, current: a }
        );
}

export function getNextSignificantLine(
    document: vscode.TextDocument,
    position: vscode.Position,
    direction: common.Direction,
    foldMap: boolean[] | undefined = undefined
): vscode.TextLine | undefined {
    const wordRegex = getWordDefinition(true);
    if (!wordRegex) return undefined;

    for (const line of iterLines(document, {
        startingPosition: position,
        direction,
        currentInclusive: false,
    })) {
        if (wordRegex.test(line.text)) {
            if (foldMap && foldMap.length > 0 && isLineInFoldedRange(line.lineNumber, foldMap)) {
                continue;
            }
            return line;
        }
    }
}

export function getNextSignificantPosition(
    document: vscode.TextDocument,
    position: vscode.Position,
    direction: common.Direction,
    foldMap: boolean[] | undefined = undefined
): vscode.Position | undefined {
    const wordRegex = getWordDefinition(true);
    if (!wordRegex) return undefined;

    outputChannel.appendLine(`starting position ${position.line}, ${position.character}`);
    for (const [line, character] of iterPosition(document, {
        startingPosition: position,
        direction,
        currentInclusive: false,
    })) {
        if (wordRegex.test(line.text)) {
            if (foldMap && foldMap.length > 0 && isLineInFoldedRange(line.lineNumber, foldMap)) {
                continue;
            }
            
            return new vscode.Position(line.lineNumber, character); 
        }
    }
    return undefined;
}

export function lineIsSignificant(line: vscode.TextLine, ) {
    const wordRegex = getWordDefinition(true);
    return wordRegex ? wordRegex.test(line.text) : false;
}

/** A "stop line" is one that is either blank or
 *  contains only punctuation */
export function lineIsStopLine(line: vscode.TextLine) {
    return !/[a-zA-Z0-9]/.test(line.text);
}

function moveToChangeOfIndentation(
    editor: vscode.TextEditor,
    cursorPosition: vscode.Position,
    change: common.Change,
    direction: common.DirectionOrNearest
) {
    if (cursorPosition && editor.document) {
        let line: vscode.TextLine | undefined;
        const currentLine = editor.document.lineAt(cursorPosition.line);

        switch (direction) {
            case "nearest": {
                line = getNearestLineOfChangeOfIndentation(
                    editor.document,
                    editor.document.lineAt(cursorPosition.line),
                    change
                );
                break;
            }
            case Direction.backwards:
            case Direction.forwards: {
                line = lineUtils.getNextLineOfChangeOfIndentation(
                    change,
                    direction,
                    editor.document,
                    currentLine
                );
                break;
            }
        }

        if (line) {
            editor.selection = new vscode.Selection(
                line.range.start,
                line.range.start
            );
        }
    }
}

export function iterLines(
    document: vscode.TextDocument,
    options: IterationOptions
): Seq<vscode.TextLine> {
    
    const advance = directionToDelta(options.direction);
    let currentLineNumber = rangeToPosition(
        options.startingPosition,
        options.direction
    ).line;

    const withinBounds = () =>
        currentLineNumber >= 0 &&
        (!options.bounds || currentLineNumber >= options.bounds.start.line) &&
        (!options.bounds || currentLineNumber <= options.bounds.end.line) &&
        currentLineNumber < document.lineCount;

    return seq(
        function* () {
            while (withinBounds()) {
                const newLine = document.lineAt(currentLineNumber);
                yield newLine;
                currentLineNumber = advance(currentLineNumber);
            }
        }
    ).skip(options.currentInclusive ? 0 : 1);
}

export function iterPosition(
    document: vscode.TextDocument,
    options: IterationOptions
): Seq<[vscode.TextLine, number]> {
    let currentPosition = rangeToPosition(options.startingPosition, options.direction);
    const lineDelta = options.direction === "forwards" ? 1 : -1;
    let wrapIter = new WrapIterator(currentPosition, lineDelta, document.lineAt(currentPosition.line));
    wrapIter.SetInitialIndex(currentPosition.character);
    
    const withinBounds = () => currentPosition.line >= 0 &&
        (!options.bounds || currentPosition.line >= options.bounds.start.line) &&
        (!options.bounds || currentPosition.line <= options.bounds.end.line) &&
        currentPosition.line < document.lineCount;

    return seq<[vscode.TextLine, number]>(function* () {
        while (withinBounds()) {
            
            if (!wrapIter.HasNext()) {
                currentPosition = new vscode.Position(currentPosition.line + lineDelta, common.getVirtualColumn());
                const nextLine = document.lineAt(currentPosition.line);
                wrapIter = new WrapIterator(currentPosition, lineDelta, nextLine);
                if (!wrapIter.HasNext()) {
                    return;
                }
            }
            
            const newPosition = wrapIter.GetNext(); 
            const newLine = document.lineAt(newPosition.line);
            yield [newLine, newPosition.character];
        }
    }).skip(options.currentInclusive ? 0 : 1);
}

function getNearestLineOfChangeOfIndentation(
    document: vscode.TextDocument,
    currentLine: vscode.TextLine,
    change: common.Change
) {
    const diff = changeToDiff(change);

    for (const { backwardsLine, forwardsLine } of iterLinesOutwards(
        document,
        currentLine.lineNumber
    )) {
        if (
            forwardsLine &&
            !forwardsLine.isEmptyOrWhitespace &&
            diff(
                forwardsLine.firstNonWhitespaceCharacterIndex,
                currentLine.firstNonWhitespaceCharacterIndex
            )
        ) {
            return forwardsLine;
        }

        if (
            backwardsLine &&
            !backwardsLine.isEmptyOrWhitespace &&
            diff(
                backwardsLine.firstNonWhitespaceCharacterIndex,
                currentLine.firstNonWhitespaceCharacterIndex
            )
        ) {
            return backwardsLine;
        }
    }
}

export function* iterLinesOutwards(
    document: vscode.TextDocument,
    currentLineNumber: number
) {
    let forwardsPointer = currentLineNumber + 1;
    let backwardsPointer = currentLineNumber - 1;

    while (forwardsPointerInBounds() && backwardsPointerInBounds()) {
        const backwardsLine = backwardsPointerInBounds()
            ? document.lineAt(backwardsPointer)
            : undefined;
        const forwardsLine = forwardsPointerInBounds()
            ? document.lineAt(forwardsPointer)
            : undefined;

        yield { backwardsLine, forwardsLine };

        forwardsPointer++;
        backwardsPointer--;
    }

    function forwardsPointerInBounds() {
        return forwardsPointer <= document.lineCount;
    }

    function backwardsPointerInBounds() {
        return backwardsPointer >= 0;
    }
}

export function getLineToFoldedMap(
): boolean[] {
    const editor = vscode.window.activeTextEditor; 
    if (!editor) {
        return [];
    }

    const lineCount = editor.document.lineCount;
    const foldedMap = new Array(lineCount).fill(false);
    const ranges = editor.visibleRanges;
    for (let i = 0; i < ranges.length - 1; i++) {
        const currentRange = ranges[i];
        const nextRange = ranges[i + 1];
        for (let line = currentRange.end.line + 1; line < nextRange.start.line; line++) {
            foldedMap[line] = true;
        }
    }
    
    return foldedMap;
}

export function isLineInFoldedRange(lineNumber: number, foldedMap: boolean[]): boolean {
    return foldedMap[lineNumber] || false;
}

