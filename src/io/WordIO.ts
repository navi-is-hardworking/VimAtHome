import * as vscode from "vscode";
import * as common from "../common";
import Seq, { seq } from "../utils/seq";
import * as positions from "../utils/positions";
import * as lineUtils from "../utils/lines";
import {
    positionToRange,
    rangeToPosition,
} from "../utils/selectionsAndRanges";
import * as editor from "../utils/editor";
import SubjectIOBase, { IterationOptions } from "./SubjectIOBase";
import { Direction, TextObject } from "../common";
import { getWordDefinition } from "../config";

function iterVertically(
    document: vscode.TextDocument,
    options: IterationOptions
): Seq<TextObject> {
    return seq(
        (function* () {
            let cont = true;
            let currentPosition = rangeToPosition(
                options.startingPosition,
                options.direction
            );
            
            let column = currentPosition.character;
            if (options.virtualColumn) {
                column = common.getVirtualColumn();
            }
            else if (options.startingPosition instanceof vscode.Range) {
                let range: vscode.Range = options.startingPosition;
                column = common.getMiddleColumn(range);
            }
            
            while (cont) {
                cont = false;
                
                const nextLine = lineUtils.getNextSignificantLine(
                    document,
                    currentPosition,
                    options.direction
                );
                
                if (nextLine) {
                    const newPosition = currentPosition.with(
                        nextLine.lineNumber,
                        column
                    );
                    const wordRange = findWordClosestTo(document, newPosition, {
                            limitToCurrentLine: true,
                            isVertical: true });
                    
                    if (wordRange) {
                        yield wordRange;

                        options.startingPosition = positionToRange(newPosition);
                        cont = true;
                    }
                }
            }
        })
    );
}


function iterHorizontally(
    document: vscode.TextDocument,
    options: IterationOptions
): Seq<TextObject> {
    return seq(function* () {
        if (!(options.startingPosition instanceof vscode.Range))
            return;

        let currentLine = options.startingPosition.start.line;
        let startChar = options.direction === Direction.forwards 
            ? options.startingPosition.end.character 
            : options.startingPosition.start.character;

        while (currentLine >= 0 && currentLine < document.lineCount) {
            const fullLine = document.lineAt(currentLine);

            const wordRegex = getWordDefinition();
            if (!wordRegex) {
                return;
            }

            let match: RegExpMatchArray | null;
            let searchText: string;

            if (options.direction === Direction.forwards) {
                searchText = fullLine.text.slice(startChar);
                match = searchText.match(wordRegex);
            } else {
                searchText = fullLine.text.slice(0, startChar);
                const matches = Array.from(searchText.matchAll(new RegExp(wordRegex, 'g')));
                match = matches.length > 0 ? matches[matches.length - 1] : null;
            }

            if (match) {
                let matchStart: number, matchEnd: number;
                if (options.direction === Direction.forwards) {
                    matchStart = startChar + (match.index || 0);
                    matchEnd = matchStart + match[0].length;
                } else {
                    matchStart = (match.index || 0);
                    matchEnd = matchStart + match[0].length;
                }

                const matchRange = new vscode.Range(currentLine, matchStart, currentLine, matchEnd);

                if (options.direction === Direction.forwards)
                    common.setVirtualColumn(matchRange);
                else
                    common.setVirtualColumn(matchRange);
                yield matchRange;
                return;
            } else {
                
                if (options.direction === Direction.forwards) {
                    if (startChar < fullLine.range.end.character) {
                        const endOfLineRange = new vscode.Range(currentLine, startChar, currentLine, fullLine.range.end.character);
                        common.setVirtualColumn(fullLine.range);
                        yield endOfLineRange;
                        return;
                    }
                    currentLine++;
                    startChar = 0;
                } else {
                    if (startChar > 0) {
                        const startOfLineRange = new vscode.Range(currentLine, 0, currentLine, startChar);
                        common.setVirtualColumn(startOfLineRange);
                        yield startOfLineRange;
                        return;
                    }
                    currentLine--;
                    startChar = document.lineAt(currentLine).range.end.character;
                }
            }
        }

    });
}

function iterAll(
    document: vscode.TextDocument,
    options: IterationOptions
): Seq<TextObject> {
    return seq(function* () {
        let searchPosition: vscode.Position | undefined = rangeToPosition(
            options.startingPosition,
            options.direction
        );

        const diff = options.direction === Direction.forwards ? 2 : -2;
        let first = true;

        while (searchPosition && (!options.bounds || options.bounds.contains(searchPosition))) {
            const wordRange = document.getWordRangeAtPosition(searchPosition, getWordDefinition());

            if (wordRange) {
                if (!first || options.currentInclusive) {
                    yield wordRange;
                }

                searchPosition = positions.translateWithWrap(
                    document,
                    wordRange[
                        options.direction === Direction.forwards ? "end" : "start"
                    ],
                    diff
                );
            } else {
                searchPosition = positions.translateWithWrap(
                    document,
                    searchPosition,
                    diff
                );
            }

            first = false;
        }
    });
}

function getContainingWordAt(
    document: vscode.TextDocument,
    position: vscode.Position
): vscode.Range | undefined {
    if (!position)
        return;
    return document.getWordRangeAtPosition(position, getWordDefinition(true));
}

function findWordClosestTo(
    document: vscode.TextDocument,
    position: vscode.Position,
    options: { limitToCurrentLine: boolean, isVertical: boolean },
): vscode.Range {
    const wordUnderCursor = document.getWordRangeAtPosition(position, getWordDefinition());

    if (wordUnderCursor) {
        return wordUnderCursor;
    }

    const iterObjects = options.limitToCurrentLine ? iterScope : iterAll;

    const wordRange = seq([
        iterObjects(document, {
            startingPosition: position,
            direction: Direction.backwards,
            isVertical: options.isVertical,
        }).tryFirst(),
        iterObjects(document, {
            startingPosition: position,
            direction: Direction.forwards,
            isVertical: options.isVertical,
        }).tryFirst(),
    ])
        .filterUndefined()
        .tryMinBy((w) => Math.abs(w.end.line - position.line));

    return wordRange ?? new vscode.Range(position, position);
}

export function swapHorizontally(
    document: vscode.TextDocument,
    edit: vscode.TextEditorEdit,
    range: vscode.Range,
    direction: common.Direction
): vscode.Range {
    const targetWordRange = iterAll(document, {
        startingPosition: range,
        direction,
    }).tryFirst();

    if (targetWordRange) {
        editor.swap(document, edit, range, targetWordRange);

        return targetWordRange;
    }

    return range;
}

export function swapVertically(
    document: vscode.TextDocument,
    edit: vscode.TextEditorEdit,
    range: vscode.Range,
    direction: common.Direction
): vscode.Range {
    const targetWordRange = iterVertically(document, {
        startingPosition: range,
        direction,
    }).tryFirst();

    if (targetWordRange) {
        editor.swap(document, edit, range, targetWordRange);

        return targetWordRange;
    }

    return range;
}

function iterScope(
    document: vscode.TextDocument,
    options: IterationOptions
): Seq<TextObject> {
    return seq(function* () {
        let searchPosition: vscode.Position | undefined = rangeToPosition(
            options.startingPosition,
            options.direction
        );
        if (!searchPosition)
            return;
        const startingLine = searchPosition.line;

        const diff = options.direction === Direction.forwards ? 2 : -2;
        let first = true;

        do {
            const wordRange = document.getWordRangeAtPosition(searchPosition, getWordDefinition());

            if (wordRange) {
                if (options.currentInclusive || !first) {
                    if (!options.isVertical) {
                        common.setVirtualColumn(wordRange);
                    }
                    yield wordRange;
                }
                
                searchPosition = positions.translateWithWrap(
                    document,
                    options.direction === Direction.forwards
                    ? wordRange.end
                    : wordRange.start,
                    diff
                );
            } else {
                searchPosition = positions.translateWithWrap(
                    document,
                    searchPosition,
                    diff
                );
            }
            
            first = false;
        } while (searchPosition && searchPosition.line === startingLine);
    });
}

export default class WordIO extends SubjectIOBase {
    // deletableSeparators = /^[.\,=+\*\/%]+$/;
    deletableSeparators = /^[.\s,=+\*\/%&|!?]+$/;
    defaultSeparationText = " ";

    getContainingObjectAt = getContainingWordAt;

    getClosestObjectTo(
        document: vscode.TextDocument,
        position: vscode.Position
    ) {
        return findWordClosestTo(document, position, {
            limitToCurrentLine: false,
            isVertical: false
        });
    }

    iterAll = iterAll;
    iterVertically = iterVertically;
    iterHorizontally = iterHorizontally;

    swapHorizontally = swapHorizontally;
    swapVertically = swapVertically;
    iterScope = iterScope;
}
