import * as vscode from "vscode";
import { Config, GetWordWrapColumn, IsWordWrapEnabled } from "./config";
import { goToLine, quickCommandPicker } from "./utils/editor";
import * as quickMenus from "./utils/quickMenus";
import { SubjectAction } from "./subjects/SubjectActions";
import { EditorMode, EditorModeChangeRequest } from "./modes/modes";
import NullMode from "./modes/NullMode";
import InsertMode from "./modes/InsertMode";
import * as common from "./common";
import { SubjectName } from "./subjects/SubjectName";
import * as modifications from "./utils/modifications";
import { splitRange } from "./utils/decorations";
import * as lineUtils from "./utils/lines";
import { getWordDefinition, getVerticalSkipCount, setWordDefinition, getWordDefinitionIndex, getWordDefinitionByIndex } from "./config";
import * as cacheCommands from "./CacheCommands";
import SelectionAnchor from "./selectionAnchors";
import { splitByRegex } from "./utils/selectionsAndRanges";
import * as ncp from 'copy-paste'
import { promisify } from "util";
import { SelectionHistoryManager } from "./handlers/SelectionHistoryManager";
import {Terminal} from "./utils/terminal"
import { createHistogram } from "perf_hooks";

let outputChannel = vscode.window.createOutputChannel("Vah.Manager");

const copyAsync = promisify((text: string) => ncp.copy(text));
let selectionHistory = new SelectionHistoryManager();
let Term = new Terminal();

export default class VimAtHomeManager {
    public mode: EditorMode;
    public statusBar: vscode.StatusBarItem;
    public editor: vscode.TextEditor = undefined!;
    public extendAnchor: SelectionAnchor = new SelectionAnchor();

    constructor(public config: Config) {
        this.statusBar = vscode.window.createStatusBarItem(
            "vimAtHome",
            vscode.StatusBarAlignment.Left,
            0
        );

        this.mode = new NullMode(this);
        this.statusBar.show();
    }

    async changeEditor(editor: vscode.TextEditor | undefined) {
        this.clearSelections();
        cacheCommands.StopCarry();
        this.extendAnchor.EndExtendMode();

        if (!editor) {
            return;
        }

        this.editor = editor;

        if (this.mode instanceof NullMode) {
            await this.changeMode({
                kind: "COMMAND",
                subjectName: "WORD",
            });
        }

        this.setUI();
    }

    clearSelections() {
        if (this.mode.decorationType) {
            this.editor.setDecorations(this.mode.decorationType, []);
        }
        
        if (this.mode.decorationTypeTop) {
            this.editor.setDecorations(this.mode.decorationTypeTop, []);
        }
        
        if (this.mode.decorationTypeMid) {
            this.editor.setDecorations(this.mode.decorationTypeMid, []);
        }
        
        if (this.mode.decorationTypeBottom) {
            this.editor.setDecorations(this.mode.decorationTypeBottom, []);
        }
    }

    async changeMode(newMode: EditorModeChangeRequest) {
        if (newMode.kind === "INSERT") 
        {
            this.extendAnchor.SelectToAnchor(this.editor);
            this.extendAnchor.EndExtendMode();
        }
        
        this.clearSelections();
        this.mode = await this.mode.changeTo(newMode);
        const half = newMode.kind === "INSERT" ? undefined : newMode.half;
        this.setUI();

        await this.mode.fixSelection(half);
        await this.setDecorations();
    }
    
    async changeToWordMode(newMode: EditorModeChangeRequest) {
        if (this.mode.getSubjectName() === "WORD" && getWordDefinitionIndex() === 0) {
            this.extendAnchor.EndExtendMode();
        }
        setWordDefinition(0);
        
        this.clearSelections();
        this.mode = await this.mode.changeTo(newMode);
        const half = newMode.kind === "INSERT" ? undefined : newMode.half;
        this.setUI();
        

        if (this.editor.selection.active.line !== this.editor.selection.anchor.line 
            || lineUtils.lineIsSignificant(this.editor.document.lineAt(this.editor.selection.active.line))) {
            this.mode.fixSelection(half);
        }
        await this.setDecorations();
    }
    
    async executeSubjectCommand(command: SubjectAction) {
        await this.mode.executeSubjectCommand(command);
    }
    
    async executeModifyCommand(command: modifications.ModifyCommand) {
        await modifications.executeModifyCommand(command);
        this.mode.fixSelection();
    }
    
    async onDidChangeTextEditorSelection(
        event: vscode.TextEditorSelectionChangeEvent
    ) {
        if (this.mode.name === "COMMAND")
            selectionHistory.recordSelection(this.editor, this.mode.getSubjectName());

        this.clearSelections();
        this.setDecorations();
        this.extendAnchor.updatePhantomSelection(this.editor);

        if (cacheCommands.IsSelectionChanging()) return;
        if (cacheCommands.IsCarrying()) {
            cacheCommands.SetSelectionChanging(true);

            await this.mode.fixSelection();
            const selectedText = this.editor.document.getText(this.editor.selection);
            await cacheCommands.RestorePreviousSelection(this.editor);
            await cacheCommands.SwapCarry(selectedText, this.editor);
            cacheCommands.SetPreviousSelection(this.editor.selection); // might need to fix
            
            cacheCommands.SetSelectionChanging(false);
        }
        
        if (
            event.kind === vscode.TextEditorSelectionChangeKind.Command 
                ||
            event.kind === undefined
        ) {
            this.editor.revealRange(new vscode.Range(this.editor.selection.active, this.editor.selection.active));
            return;
        }
        
        if (this.mode instanceof InsertMode) return;
        
        if (
            event.kind === vscode.TextEditorSelectionChangeKind.Mouse &&
            event.selections.length === 1 &&
            !event.selections[0].isEmpty
        ) {
            await this.changeMode({ kind: "INSERT" });
            return;
        }
        
        this.mode.fixSelection();
        selectionHistory.recordSelection(this.editor);
        this.setUI();
    }

    async setDecorations() {
        if (this.mode?.decorationType) {
            const topDecorations: vscode.Range[] = [];
            const midDecorations: vscode.Range[] = [];
            const bottomDecorations: vscode.Range[] = [];
            const singleLineDecorations: vscode.Range[] = [];

            for (const selection of this.editor.selections) {
                const splits = splitRange(this.editor.document, selection);
                if (splits.kind === 'SingleLine') {
                    singleLineDecorations.push(splits.range);
                } else {
                    topDecorations.push(splits.firstLine);
                    midDecorations.push(...splits.middleLines);
                    bottomDecorations.push(splits.lastLine);
                }
            }

            if (singleLineDecorations.length > 0) {
                this.editor.setDecorations(this.mode.decorationType, singleLineDecorations);
            } 
            if (topDecorations.length > 0) {
                this.editor.setDecorations(this.mode.decorationTypeTop ?? this.mode.decorationType, topDecorations);
            }
            if (midDecorations.length > 0) {
                this.editor.setDecorations(this.mode.decorationTypeMid ?? this.mode.decorationType, midDecorations);
            }
            if (bottomDecorations.length > 0) {
                this.editor.setDecorations(this.mode.decorationTypeBottom ?? this.mode.decorationType, bottomDecorations);
            }
        }
    }

    setUI() {
        this.statusBar.text = this.mode.statusBarText;

        if (this.editor) {
            this.editor.options.cursorStyle = this.mode.cursorStyle;
            this.editor.options.lineNumbers = this.mode.lineNumberStyle;
            common.setVirtualColumn(this.editor.selection);
        }

        vscode.commands.executeCommand(
            "setContext",
            "vimAtHome.mode",
            this.mode.name
        );
    }

    async openSpaceMenu() {
        this.extendAnchor.SelectToAnchor(this.editor);
        const choice = await quickCommandPicker(quickMenus.SpaceCommands);

        if (choice) {
            await choice.execute();
        }
    }

    async openSubjectMenu() {
        this.extendAnchor.SelectToAnchor(this.editor);
        const choice = await quickCommandPicker(quickMenus.SubjectChangeCommands);
        if (choice) {
            await choice.execute();
        }
    }

    async openGoToMenu() {
        this.extendAnchor.SelectToAnchor(this.editor);
        const choice = await quickCommandPicker(quickMenus.GoToCommands, {
            label: "Go to line...",
            detail: "Enter a line number",
        });

        if (typeof choice === "string") {
            const parsed = parseInt(choice);

            if (isNaN(parsed)) {
                vscode.window.showErrorMessage(
                    `${choice} is not a valid line number`
                );
            }

            await goToLine(this.editor, parsed - 1);
        } else if (choice) {
            choice.execute();
        }

        this.mode.fixSelection();
    }

    async openModifyMenu() {
        this.extendAnchor.SelectToAnchor(this.editor);

        const choice = await quickCommandPicker(quickMenus.ModifyCommands);
        if (choice) {
            await choice.execute();
        }

        this.mode.fixSelection();
    }

    async openViewMenu() {
        this.extendAnchor.SelectToAnchor(this.editor);
        
        const choice = await quickCommandPicker(quickMenus.ViewCommands);

        if (choice) {
            await choice.execute();
        }
    }
    
    async customVsCodeCommand() {
        const command = await vscode.window.showInputBox({
            prompt: "Custom VS Code command",
        });

        if (command) {
            await vscode.commands.executeCommand(command);
        }
    }

    async undoLastCommand() {
        await vscode.commands.executeCommand("cursorUndo");

        this.mode.fixSelection();
    }

    async undo() {
        await vscode.commands.executeCommand("undo");

        this.mode.fixSelection();
    }

    async skip(direction: common.Direction) {
        this.extendAnchor.SetSelectionAnchor(this.editor);
        await this.mode.skip(direction);
        if (common.getLastSkip()?.subject !== this.mode.getSubjectName()) {
            await this.changeMode({ subjectName: common.getLastSkip()?.subject, kind: "COMMAND" });
        }
        this.setUI();
    }
    
    async skipOver(direction: common.Direction) {
        await this.mode.skipOver(direction);
        this.setUI();
    }
    
    async repeatLastSkip(direction: common.Direction) {
        if (common.getLastSkip()?.subject !== this.mode.getSubjectName()) {
            await this.changeMode({ subjectName: common.getLastSkip()?.subject, kind: "COMMAND" });
        }
        
        await this.mode.repeatLastSkip(direction);
        this.setUI();
    }
    
    async repeatLastSkipOverLine() {
        let lastSkip = common.getLastSkip();
        if (!lastSkip) return;
        
        if (lastSkip.subject !== this.mode.getSubjectName()) {
            await this.changeMode({ subjectName: common.getLastSkip()?.subject, kind: "COMMAND" });
        }
        
        let dir = lastSkip.direction === "forwards" ? 1000 : 1;
        
        let selection = this.editor.selection;
        this.editor.selection = new vscode.Selection(new vscode.Position(selection.active.line, dir), new vscode.Position(selection.active.line, dir));
        
        await this.mode.repeatLastSkip("forwards");
        this.setUI();
    }

    async jump() {
        this.extendAnchor.SetSelectionAnchor(this.editor);
        await this.mode.jump();
    }
    
    async jumpToSubject(subjectName: SubjectName) {
        if (subjectName === "LINE") {
            this.extendAnchor.SetLineSelectionAnchor(this.editor);
        }
        else {
            this.extendAnchor.SetSelectionAnchor(this.editor);
        }
        
        if (this.mode.getSubjectName() === subjectName) {
            await this.mode.jump();
            return;
        }
        const newMode = await this.mode.jumpToSubject(subjectName);
        if (newMode === undefined) return;
        this.clearSelections();
        this.mode = newMode;
        this.setUI();
        this.mode.fixSelection();
        this.setDecorations();
    }

    async pullSubject(subjectName: SubjectName) {
        this.extendAnchor.SelectToAnchor(this.editor);
        const newMode = await this.mode.pullSubject(subjectName);
        if (newMode === undefined) return;
        this.clearSelections();
        this.mode = newMode;
        this.setUI();
        this.mode.fixSelection();
        this.setDecorations();
    }

    // KJDFLSAHGIONURVCWEXMBPTYZ
    async zoomJump() {
        const zoomOutCommands = [
            "vimAtHome.changeToLineSubject",
            "editor.action.fontZoomOut",
            "editor.action.fontZoomOut",
            "editor.action.fontZoomOut",
            "workbench.action.zoomOut",
            "workbench.action.zoomOut",
            "workbench.action.zoomOut",
            "vimAtHome.scrollToCursor"
        ];

        await vscode.commands.executeCommand('runCommands', { commands: zoomOutCommands });

        await new Promise(resolve => setTimeout(resolve, 100));

        const jumpPosition = await this.mode.zoomJump();

        const zoomInCommands = [
            "editor.action.fontZoomIn",
            "editor.action.fontZoomIn",
            "editor.action.fontZoomIn",
            "workbench.action.zoomIn",
            "workbench.action.zoomIn",
            "workbench.action.zoomIn",
            "vimAtHome.scrollToCursor"
        ];

        await vscode.commands.executeCommand('runCommands', { commands: zoomInCommands });

        if (jumpPosition) {
            this.editor.selection = new vscode.Selection(jumpPosition, jumpPosition);
        }
    }

    async scrollToCursorAtCenter() {
        await vscode.commands.executeCommand('revealLine', {
            lineNumber: this.editor.selection.active.line,
            at: 'center'
        });
    }

    async deleteLineAbove() {
        this.extendAnchor.SelectToAnchor(this.editor);
        
        const { editor } = this;
        const document = editor.document;
        
        const originalSelections = editor.selections;
        
        await editor.edit(editBuilder => {
            for (const selection of originalSelections) {
                const lineToDelete = Math.max(selection.start.line - 1, 0);
                if (lineToDelete < selection.start.line) {
                    const rangeToDelete = document.lineAt(lineToDelete).rangeIncludingLineBreak;
                    editBuilder.delete(rangeToDelete);
                }
            }
        });

        editor.selections = originalSelections.map(selection => {
            const newStart = new vscode.Position(
                Math.max(selection.start.line - 1, 0),
                selection.start.character
            );
            const newEnd = new vscode.Position(
                Math.max(selection.end.line - 1, 0),
                selection.end.character
            );
            return new vscode.Selection(newStart, newEnd);
        });
    }

    async deleteLines() {
        this.extendAnchor.SelectToAnchor(this.editor);
        vscode.commands.executeCommand( "editor.action.deleteLines" );
    }
    
    async deleteLineBelow() {
        this.extendAnchor.SelectToAnchor(this.editor);
        
        const { editor } = this;
        const document = editor.document;
        
        await editor.edit(editBuilder => {
            for (const selection of editor.selections) {
                const lineToDelete = Math.min(selection.end.line + 1, document.lineCount - 1);
                if (lineToDelete > selection.end.line) {
                    const rangeToDelete = document.lineAt(lineToDelete).rangeIncludingLineBreak;
                    editBuilder.delete(rangeToDelete);
                }
            }
        });

    }

    async toggleCommentAtEndOfLine(): Promise<void> {
        const document = this.editor.document;
        const selection = this.editor.selection;
    
        let commentAdded = false;
    
        await this.editor.edit(editBuilder => {
            for (let i = selection.start.line; i <= selection.end.line; i++) {
                const line = document.lineAt(i);
                const lineText = line.text;
    
                const commentStart = lineText.indexOf('//');
                const pythonCommentStart = lineText.indexOf('#');
                const htmlCommentStart = lineText.indexOf('<!--');
    
                if (commentStart !== -1 
                    || pythonCommentStart !== -1 
                    || htmlCommentStart !== -1) {
                    let commentStartIndex = Math.min(
                        commentStart !== -1 ? commentStart : Infinity,
                        pythonCommentStart !== -1 ? pythonCommentStart : Infinity,
                        htmlCommentStart !== -1 ? htmlCommentStart : Infinity
                    );
                    
                    while (commentStartIndex > 0 && lineText[commentStartIndex - 1] === ' ') {
                        commentStartIndex--;
                    }
    
                    editBuilder.delete(new vscode.Range(i, commentStartIndex, i, lineText.length));
                } else {
                    const lineEnd = line.range.end;
    
                    let textToInsert = '';
                    if (!line.isEmptyOrWhitespace && !lineText.endsWith(' ')) {
                        textToInsert += ' ';
                    }
                    
                    const languageId = document.languageId;
                    switch (languageId) {
                        case 'python':
                        case 'yaml':
                        case 'shellscript':
                            textToInsert += '# ';
                            break;
                        case 'html':
                        case 'xml':
                            textToInsert += '<!-- ';
                            break;
                        default:
                            textToInsert += '// ';
                    }
    
                    editBuilder.insert(lineEnd, textToInsert);
                    commentAdded = true;
                }
            }
        });
    
        const endPosition = document.lineAt(this.editor.selection.end.line).range.end;
        if (commentAdded) {
            this.editor.selection = new vscode.Selection(endPosition, endPosition);
            await this.changeMode({ kind: "INSERT" });
        }
    }
    
    async collapseToCenter() {
        let changeRequest = await this.mode.collapseToCenter();
        if (changeRequest)
            this.changeMode(changeRequest)
    }
    
    async collapseToLeft() {
        let changeRequest = await this.mode.collapseToLeft();
        if (changeRequest)
            this.changeMode(changeRequest)
    }
    
    async collapseToRight() {
        let changeRequest = await this.mode.collapseToRight();
        if (changeRequest)
            this.changeMode(changeRequest)
    }

    async getNthVerticalLine(direction: common.Direction, distance: number) {
        const document = this.editor.document;
        const lineCount = document.lineCount;
        let currentLine = this.editor.selection.active.line;
        const increment = direction === common.Direction.forwards ? 1 : -1;
        let n = 0;
    
        const foldedMap = lineUtils.getLineToFoldedMap();
    
        while (currentLine >= 0 && currentLine < lineCount && n < distance) {
            currentLine += increment;
            if (currentLine < 0 || currentLine >= lineCount) break;
            
            const line = document.lineAt(currentLine);
            
            if (lineUtils.lineIsSignificant(line) && !lineUtils.isLineInFoldedRange(currentLine, foldedMap)) {
                n += 1;
            }
        }

        return currentLine;
    }
    
    async moveVerticalN(direction: common.Direction) {
        const currentLine = await this.getNthVerticalLine(direction, getVerticalSkipCount());
        await this.updateEditorPosition(currentLine);
    }
    
    async getNextSignificantBlockLocation(direction: common.Direction) {
        const document = this.editor.document;
        const lineCount = document.lineCount;
        let currentLine = this.editor.selection.active.line;
        const increment = direction === common.Direction.forwards ? 1 : -1;

        while (((direction === common.Direction.forwards && currentLine < lineCount - 1) || (direction === common.Direction.backwards && currentLine > 0)) 
                && !lineUtils.lineIsSignificant(document.lineAt(currentLine + increment))) {
            currentLine += increment;
        }
        
        while (((direction === common.Direction.forwards && currentLine < lineCount - 1) || (direction === common.Direction.backwards && currentLine > 0)) 
                && lineUtils.lineIsSignificant(document.lineAt(currentLine + increment))) {
            currentLine += increment;
        }
        
        return currentLine
    }
    
    async nextSignificantBlock(direction: common.Direction) {
        const currentLine = await this.getNextSignificantBlockLocation(direction);
        await this.updateEditorPosition(currentLine);
    }
    
    async hopVertical(direction: common.Direction) {
        if (this.mode.getSubjectName() === "LINE") {
            await this.sameIntentBlockAfterIndentChange(direction);
        }
        else {
            let nextN = await this.getNthVerticalLine(direction, 2);
            let nextBlockLine = await this.getNextSignificantBlockLocation(direction);
            let newLine = 0;
            if (direction === common.Direction.forwards) {
                newLine = nextN > nextBlockLine ? nextN : nextBlockLine;
            } else if (direction === common.Direction.backwards) {
                newLine = nextN < nextBlockLine ? nextN : nextBlockLine;
            }
            await this.updateEditorPosition(newLine);
        }
        
    }
    
    async nextIndentUp(direction: common.Direction) {
        const document = this.editor.document;
        const currentPosition = this.editor.selection.active;
        const currentLine = document.lineAt(currentPosition.line);
        const currentIndentation = currentLine.firstNonWhitespaceCharacterIndex;

        let targetLine: vscode.TextLine | undefined;
        let lineIterator = lineUtils.iterLines(document, {
            startingPosition: currentPosition,
            direction: direction,
            currentInclusive: false,
        });

        for (const line of lineIterator) {
            if (line.text.trim().length >= 1 && line.firstNonWhitespaceCharacterIndex > currentIndentation) {
                targetLine = line;
                break;
            }
        }

        if (targetLine)
            await this.updateEditorPosition(targetLine.lineNumber);
    }

    async sameIntentBlockAfterIndentChange(direction: common.Direction) {
        const document = this.editor.document;
        const currentPosition = this.editor.selection.active;
        const currentLine = document.lineAt(currentPosition.line);
        const currentIndentation = currentLine.firstNonWhitespaceCharacterIndex;

        let nextLine = lineUtils.getNextSignificantLine(document, currentPosition, direction);
        if (!nextLine) return;

        let targetIndentation = nextLine.firstNonWhitespaceCharacterIndex;
        if (targetIndentation === currentIndentation) {
            let lineIterator = lineUtils.iterLines(document, {
                startingPosition: currentPosition,
                direction: direction,
                currentInclusive: false,
            });
            let lastSignificantLine = nextLine;
            for (const line of lineIterator) {
                if (line.text.trim().length > 0 && line.firstNonWhitespaceCharacterIndex !== targetIndentation) break;
                lastSignificantLine = line;
            }
            await this.updateEditorPosition(lastSignificantLine.lineNumber);
            return;
        } else {
            let lineIterator = lineUtils.iterLines(document, {
                startingPosition: currentPosition,
                direction: direction,
                currentInclusive: false,
            });
            let targetLine: vscode.TextLine | undefined;
            for (const line of lineIterator) {
                if (line.text.trim().length > 0 && line.firstNonWhitespaceCharacterIndex === currentIndentation) {
                    targetLine = line;
                    break;
                }
            }
            if (targetLine)
                await this.updateEditorPosition(targetLine.lineNumber);
            return;
        }
    }

    async nextIndentBlock(direction: common.Direction) {
        const document = this.editor.document;
        const currentPosition = this.editor.selection.active;
        const currentLine = document.lineAt(currentPosition.line);
        const currentIndentation = currentLine.firstNonWhitespaceCharacterIndex;

        let targetLine: vscode.TextLine | undefined;
        let lineIterator = lineUtils.iterLines(document, {
            startingPosition: currentPosition,
            direction: direction,
            currentInclusive: false,
        });

        for (const line of lineIterator) {
            if (lineUtils.lineIsSignificant(line) && line.firstNonWhitespaceCharacterIndex !== currentIndentation) {
                targetLine = line;
                break;
            }
        }

        if (!targetLine) return;

        const targetIndentation = targetLine.firstNonWhitespaceCharacterIndex;

        let lastSignificantLine = targetLine;
        for (const line of lineIterator) {
            if (!lineUtils.lineIsSignificant(line)) continue;
            if (line.firstNonWhitespaceCharacterIndex !== targetIndentation) break;
            lastSignificantLine = line;
        }

        await this.updateEditorPosition(lastSignificantLine.lineNumber);
    }

    private async updateEditorPosition(lineNumber: number) {
        const virtualColumn = common.getVirtualColumn();
        const newPosition = new vscode.Position(lineNumber, virtualColumn);
        this.editor.selection = new vscode.Selection(newPosition, newPosition);
        // await this.changeMode({ kind: "COMMAND", subjectName: "WORD" });
        await this.mode.fixSelection();
    }

    async edgeOut(direction: common.Direction): Promise<void> {
        const editor = this.editor;
        editor.selections = editor.selections.map(selection => {
            const line = editor.document.lineAt(selection.start.line).text;
            
            if (direction === common.Direction.forwards && selection.end.character < line.length) {
                return new vscode.Selection(
                    selection.start,
                    selection.end.translate(0, 1)
                );
            } else if (direction === common.Direction.backwards && selection.start.character > 0) {
                return new vscode.Selection(
                    selection.start.translate(0, -1),
                    selection.end
                );
            }
            return selection;
        });
    }

    async deleteNext(direction: common.Direction): Promise<void> {
        this.extendAnchor.SelectToAnchor(this.editor);
        
        const { editor } = this;
    
        await editor.edit(editBuilder => {
            for (const selection of editor.selections) {
                const wordDefinition = this.mode.name === "INSERT" ? getWordDefinitionByIndex(2) : getWordDefinition();
                if (!wordDefinition) return;
                
                
                if (direction === common.Direction.backwards) {
                    let leftOfSelection = new vscode.Range(new vscode.Position(selection.start.line, 0), new vscode.Position(selection.start.line, selection.start.character));
                    let leftSelection = new vscode.Selection(leftOfSelection.start, leftOfSelection.end);
                    let leftText = editor.document.getText(leftOfSelection);
                    let leftMatches = splitByRegex(wordDefinition, leftText, leftSelection);
                    if (leftMatches.length > 0) {
                        let lastMatch = leftMatches[leftMatches.length - 1];
                        editBuilder.delete(new vscode.Range(
                            new vscode.Position(selection.start.line, lastMatch[0].character),
                            selection.start
                        ));
                    }
                }
                else {
                    let rightOfSelection = new vscode.Range(new vscode.Position(selection.end.line, selection.end.character), new vscode.Position(selection.end.line, editor.document.lineAt(selection.end.line).text.length));
                    let rightSelection = new vscode.Selection(rightOfSelection.start, rightOfSelection.end);

                    let rightText = editor.document.getText(rightOfSelection);
                    let rightMatches = splitByRegex(wordDefinition, rightText, rightSelection);
                    if (rightMatches.length > 0) {
                        let firstMatch = rightMatches[0];
                        editBuilder.delete(new vscode.Range(
                            selection.end,
                            new vscode.Position(selection.end.line, firstMatch[1].character)
                        ));
                    }
                }

            }
        });
    }
    
    async deleteToAnchor(): Promise<void> {
        this.extendAnchor.DeleteToAnchor(this.editor);
    }
    
    async downIndent(direction: common.Direction) {
        const document = this.editor.document;
        const currentPosition = this.editor.selection.active;
        const currentLine = document.lineAt(currentPosition.line);
        const currentIndentation = currentLine.firstNonWhitespaceCharacterIndex;

        let targetLine: vscode.TextLine | undefined;
        let lineIterator = lineUtils.iterLines(document, {
            startingPosition: currentPosition,
            direction: direction,
            currentInclusive: false,
        });

        for (const line of lineIterator) {
            if (line.text.trim().length >= 1 && line.firstNonWhitespaceCharacterIndex < currentIndentation) {
                targetLine = line;
                break;
            }
        }

        if (!targetLine) return;

        const targetIndentation = targetLine.firstNonWhitespaceCharacterIndex;

        let lastSignificantLine = targetLine;
        for (const line of lineIterator) {
            if (!lineUtils.lineIsSignificant(line)) continue;
            if (line.firstNonWhitespaceCharacterIndex !== targetIndentation) break;
            lastSignificantLine = line;
        }

        await this.updateEditorPosition(lastSignificantLine.lineNumber);
    }

    async foldAllAtLevel() {
        const document = this.editor.document;
        const currentPosition = this.editor.selection.active;
        const currentLine = document.lineAt(currentPosition.line);
        const tabSize = this.editor.options.tabSize as number;
        const indentText = currentLine.text.substring(0, currentLine.firstNonWhitespaceCharacterIndex);
        const usesTabs = this.editor.options.insertSpaces === false;
        
        let indentationLevel;
        if (usesTabs) {
            indentationLevel = (indentText.split('\t').length - 1) + 1;
        } else {
            indentationLevel = Math.floor(indentText.length / tabSize) + 1;
        }
        if (indentationLevel >= 1 && indentationLevel <= 7) {
            await vscode.commands.executeCommand(`editor.foldLevel${indentationLevel}`);
            await vscode.commands.executeCommand("editor.fold");
        }
    }

    async expandSubject(direction: common.Direction) {
        const selection = this.editor.selection;
        const dir = direction == "forwards" ? "RIGHT" : "LEFT";
        if (getWordDefinitionIndex() === 5) {
            const command = direction === "forwards" ? "nextObjectRight" : "nextObjectLeft";
            await this.executeSubjectCommand(command);
            return;
        }
        
        setWordDefinition(4);
        await this.changeMode({
            kind: "COMMAND",
            subjectName: "WORD",
            half: dir
        });
        
        let newSelection = this.editor.selection;
        
        if (selection.isEqual(newSelection)) {
            setWordDefinition(5);
            await this.changeMode({
                kind: "COMMAND",
                subjectName: "WORD",
                half: dir
            });
        }

        newSelection = this.editor.selection;
        if (selection.isEqual(newSelection)) {
            const command = direction === "forwards" ? "nextObjectRight" : "nextObjectLeft";
            await this.executeSubjectCommand(command);
        }
    }
    
    async copyAll() {
        if (this.extendAnchor.IsExtendModeOn()) {
            this.yoinkAnchor();
            return;
        }
        
        const selections = this.editor.selections;
        const texts = selections.map(selection => 
            this.editor.document.getText(selection)
        );
        const joinedText = texts.join('\n');
        
        this.copyLine();
        this.copyBracket();
        if (joinedText.length <= 1) { // if selected text is only one character then no point in copying one character, so its probably in char mode, just select to anchor.
            this.yoinkAnchor();
        } else {
            this.copySelection(joinedText);
        }
    }

    async copyLine() {
        this.extendAnchor.SelectToAnchor(this.editor);
        cacheCommands.copyLine(this.editor.document.lineAt(this.editor.selection.active).text);
    }
    
    async copyBracket() {
        this.extendAnchor.SelectToAnchor(this.editor);
        cacheCommands.copyBracket(this.editor.document.lineAt(this.editor.selection.active).text);
    }

    async copySelection(text: string) {
        if (text !== null && text.length > 0) {
            cacheCommands.storeClipboard(text);
            await copyAsync(text);
        } else {
            await copyAsync(cacheCommands.pasteLine());
        }
    }

    async pasteLine() {
        const newText = cacheCommands.pasteLine();
        this.editor.edit(editBuilder => {
            for (let i = 0; i < this.editor.selections.length; i++) {
                const selection = this.editor.selections[i];
                editBuilder.replace(selection, newText);
            }
        });
    }

    async pasteBracket() {
        const newText = cacheCommands.pasteBracket();
        this.editor.edit(editBuilder => {
            for (let i = 0; i < this.editor.selections.length; i++) {
                const selection = this.editor.selections[i];
                editBuilder.replace(selection, newText);
            }
        });
    }

    async pasteSubject() {
        this.extendAnchor.SelectToAnchor(this.editor);
        
        const clipText = await vscode.env.clipboard.readText();
        const currentSelections = this.editor.selections.length;

        this.editor.edit(editBuilder => {
            if (currentSelections === 1) {
                editBuilder.replace(this.editor.selections[0], clipText);
            } else {
                const texts = clipText.split(/\r?\n/);
                if (texts.length === currentSelections) {
                    for (let i = 0; i < currentSelections; i++) {
                        editBuilder.replace(this.editor.selections[i], texts[i]);
                    }
                } else {
                    for (const selection of this.editor.selections) {
                        editBuilder.replace(selection, clipText);
                    }
                }
            }
        });
    }

    async changeToBracketSubject() {
        if (this.editor.selection.active.line == this.editor.selection.anchor.line) {
            let line = this.editor.document.lineAt(this.editor.selection.active.line).text;
            let index = 1;
            if (line) 
                for (index = this.editor.selection.active.character; index > 0; index--) {
                    if ("({[".includes(line[index])) {
                        let position = new vscode.Position(this.editor.selection.active.line, index);
                        this.editor.selection = new vscode.Selection(position, position);
                        break;
                    }
                }
                for (index = this.editor.selection.active.character; index < line.length; index++) {
                    if ("({[".includes(line[index])) {
                        let position = new vscode.Position(this.editor.selection.active.line, index);
                        this.editor.selection = new vscode.Selection(position, position);
                        break;
                    }
                }
        }
        await this.changeMode({
            kind: "COMMAND",
            subjectName: "BRACKETS",
        });
    }

    async changeToBlockSubject(newMode: EditorModeChangeRequest) {
        let selection = this.editor.selection;
        if ((this.mode.getSubjectName() === 'BRACKETS' 
                || this.mode.getSubjectName() === 'BRACKETS_INCLUSIVE') && selection.active.line !== selection.anchor.line) {
            let start = this.editor.selection.active;
            start = start.with(start.line, this.editor.document.lineAt(start.line).firstNonWhitespaceCharacterIndex);
            let end = this.editor.selection.anchor 
            end = end.with(end.line, this.editor.document.lineAt(end.line).text.length);
            this.editor.selection = new vscode.Selection(start, end);
        } else {
            this.changeMode(newMode);
        }
    }
    
    async insertHome() {
        await this.changeMode({
            kind: "INSERT",
        });
        
        const position = this.editor.selection.active;
        const newPosition = position.with(position.line, this.editor.document.lineAt(position.line).firstNonWhitespaceCharacterIndex);
        const newSelection = new vscode.Selection(newPosition, newPosition);
        this.editor.selection = newSelection;
    }
    
    async insertEnd() {
        await this.changeMode({
            kind: "INSERT",
        });
    
        const position = this.editor.selection.active;
        const newPosition = position.with(position.line, this.editor.document.lineAt(position.line).text.length);
        const newSelection = new vscode.Selection(newPosition, newPosition);
        this.editor.selection = newSelection;
    }
    
    async yoinkAnchor(): Promise<void> {
        const tempRange = this.extendAnchor.GetSelectionRangeFromAnchor(this.editor.selection);
        if (tempRange) {
            const text = this.editor.document.getText(tempRange);
            this.copySelection(text);
        }
    }

    async changeToWord() {
        try {
            if (this.mode.name === "EXTEND" || this.mode.name === "INSERT" || this.mode.getSubjectName() === "CHAR" || this.mode.getSubjectName() === "SUBWORD" || 
                    (this.mode.getSubjectName() === "WORD" && getWordDefinitionIndex() != 0)){
                setWordDefinition(0);
                await this.changeMode({ kind: "COMMAND", subjectName: "WORD" });
                return;
            }

            if (this.mode.getSubjectName() === "WORD") {
                const currentSelection = this.editor.selection;
                this.mode.fixSelection();
                if (
                    this.editor.selection.start.line !== currentSelection.start.line ||
                    this.editor.selection.start.character !== currentSelection.start.character ||
                    this.editor.selection.end.character !== currentSelection.end.character ||
                    this.editor.selection.end.line !== currentSelection.end.line
                )
                return;
            }
            
            let changeRequest;
            switch (this.mode.getSubjectName()) {
                case "BLOCK": 
                case "LINE": 
                case "BRACKETS": 
                    changeRequest = await this.mode.collapseToCenter();
                    if (changeRequest) await this.changeMode(changeRequest)
                    if (this.mode.getSubjectName() != "WORD") {
                        changeRequest = await this.mode.collapseToCenter();
                        if (changeRequest) await this.changeMode(changeRequest)
                    } 
                break;
                default:
                    if (getWordDefinitionIndex() !== 0) {
                        changeRequest = await this.mode.collapseToCenter();
                        if (changeRequest) await this.changeMode(changeRequest)
                    } else {
                        let line = this.editor.document.lineAt(this.editor.selection.active.line).text
                        const start = line.search(/\S/);
                        const end = line.length;
                        let active = new vscode.Position(this.editor.selection.active.line, start); 
                        let anchor = new vscode.Position(this.editor.selection.active.line, end); 
                        let selection = new vscode.Selection(active, anchor);
                        let text = this.editor.document.getText(selection);

                        const wordDefinition = getWordDefinition();
                        const selectedText = this.editor.document.getText(selection);
                        if (!wordDefinition || !selectedText || selectedText.trim().length == 0) return;
                        let matches = splitByRegex(wordDefinition, text, selection);
                        if (matches.length) {
                            const midIndex = Math.floor((matches.length) / 2);
                            const [start, end] = matches[midIndex];
                            this.editor.selection = new vscode.Selection(
                                new vscode.Position(start.line, Math.floor((start.character + end.character + 1) / 2)),
                                new vscode.Position(start.line, Math.floor((start.character + end.character + 1) / 2))
                            );
                        }

                        this.changeMode({ kind: "COMMAND", subjectName: "WORD" });
                    }
                break;
            }
        } catch (exception) {

        }

    }

    async carry() {
        const text = this.editor.document.getText(this.editor.selection);
        cacheCommands.Carry(text, this.editor.selection);
    }
    
    async anchorSwap() {
        let active = this.editor.selection.anchor;
        let anchor = this.editor.selection.active;
        this.editor.selection = new vscode.Selection(anchor, active);
    }

        async join() {
        const { editor } = this;
        const document = editor.document;
        const originalSelections = editor.selections;
        
        await editor.edit(editBuilder => {
            for (const selection of originalSelections) {
                const currentLine = document.lineAt(selection.start.line);
                
                if (currentLine.lineNumber >= document.lineCount - 1) {
                    continue;
                }
                
                const nextLine = document.lineAt(currentLine.lineNumber + 1);
                const nextLineText = nextLine.text.trim();
                
                if (nextLineText.length > 0) {
                    const deleteRange = new vscode.Range(
                        currentLine.range.end,
                        nextLine.range.start
                    );
                    editBuilder.replace(deleteRange, " ");
                    
                    const leadingWhitespaceRange = new vscode.Range(
                        nextLine.range.start,
                        nextLine.range.start.translate(0, nextLine.firstNonWhitespaceCharacterIndex)
                    );
                    editBuilder.delete(leadingWhitespaceRange);
                }
            }
        });

        editor.selections = originalSelections;
    }

    async split() {
        const { editor } = this;
        const document = editor.document;
        const originalSelections = editor.selections;
        
        await editor.edit(editBuilder => {
            for (const selection of originalSelections) {
                const currentLine = document.lineAt(selection.start.line);
                const indentation = currentLine.text.substring(0, currentLine.firstNonWhitespaceCharacterIndex);
                
                const textBeforeCursor = document.getText(new vscode.Range(
                    currentLine.range.start,
                    selection.start
                ));
                const textAfterCursor = document.getText(new vscode.Range(
                    selection.start,
                    currentLine.range.end
                ));

                editBuilder.replace(currentLine.range, textBeforeCursor);
                
                editBuilder.insert(
                    currentLine.range.end,
                    '\n' + indentation + textAfterCursor.trim()
                );
            }
        });

        editor.selections = originalSelections.map(selection => {
            const newPos = new vscode.Position(selection.start.line + 1, 
                document.lineAt(selection.start.line + 1).firstNonWhitespaceCharacterIndex);
            return new vscode.Selection(newPos, newPos);
        });
    }
    
    async goPrevSelection() {
        const result = selectionHistory.goToPreviousSelection(this.editor);
        
        if (result !== undefined) {
            await this.changeMode({ kind: "COMMAND", subjectName: result.subjectName });
            this.editor.selection = result.selection;
            this.editor.revealRange(result.selection, vscode.TextEditorRevealType.Default);
        }
    }

    async goNextSelection() {
        const result = selectionHistory.goToNextSelection(this.editor);
        if (result !== undefined) {
            await this.changeMode({ kind: "COMMAND", subjectName: result.subjectName });
            this.editor.selection = result.selection;
            this.editor.revealRange(result.selection, vscode.TextEditorRevealType.Default);
        }
    }

    async newLineBelow(): Promise<void> {
        this.extendAnchor.SelectToAnchor(this.editor);
        
        const document = this.editor.document; // 
        const selection = this.editor.selection;
        const currentLine = document.lineAt(selection.anchor.line);
        const indentMatch = currentLine.text.match(/^(\s*)/);
        const currentIndent = indentMatch ? indentMatch[1] : '';
        const insertPosition = currentLine.range.end;
        const newLineText = '\n' + currentIndent;

        await this.editor.edit(editBuilder => {
            editBuilder.insert(insertPosition, newLineText);
        });

        const newPosition = new vscode.Position(
            selection.anchor.line + 1,
            currentIndent.length
        );
        this.editor.selection = new vscode.Selection(newPosition, newPosition);

        await this.changeMode({ kind: "INSERT" });
    }
    
    async newLineAbove(): Promise<void> {
        this.extendAnchor.SelectToAnchor(this.editor);
        
        const document = this.editor.document;
        const selection = this.editor.selection;
        const currentLine = document.lineAt(selection.active.line);
        const indentMatch = currentLine.text.match(/^(\s*)/);
        const currentIndent = indentMatch ? indentMatch[1] : '';
        
        const insertPosition = currentLine.range.start;
        const newLineText = currentIndent + '\n';

        await this.editor.edit(editBuilder => {
            editBuilder.insert(insertPosition, newLineText);
        });

        const newPosition = new vscode.Position(
            selection.active.line,
            currentIndent.length
        );
        this.editor.selection = new vscode.Selection(newPosition, newPosition);

        await this.changeMode({ kind: "INSERT" });
    }
    
    async deleteToEndOfLine(): Promise<void> {
        const document = this.editor.document;
        const selection = this.editor.selection;
        const currentLine = document.lineAt(selection.anchor.line);

        await this.editor.edit(editBuilder => {
            const rangeToDelete = new vscode.Range(
                selection.anchor,
                currentLine.range.end
            );
            editBuilder.delete(rangeToDelete);
        });
    }
    
    async deleteToStartOfLine(): Promise<void> {
        const document = this.editor.document;
        const selection = this.editor.selection;
        const currentLine = document.lineAt(selection.active.line);

        await this.editor.edit(editBuilder => {
            const rangeToDelete = new vscode.Range(
                new vscode.Position(selection.active.line, currentLine.firstNonWhitespaceCharacterIndex),
                selection.active
            );
            editBuilder.delete(rangeToDelete);
        });
    }
    
    async runSelectionAndReplaceWithOutput() {
        await Term.runSelectionAndReplaceWithOutput();
    }
    
    async runLineAndAppendOutput() {
        await Term.runLineAndAppendOutput();
    }
    
    async SetSelectionAnchor() {
        this.extendAnchor.SetSelectionAnchor(this.editor);
    }
    
    async deleteSubject() {
    }
    
    async copyDiagnostics() {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const currentFileDiagnostics = vscode.languages.getDiagnostics(activeEditor.document.uri);
            const errorDiagnostics = currentFileDiagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error);
            const messages = errorDiagnostics.map(d => d.message).join('\n');
            this.copySelection(messages);
        }
    }
    
    async mockRepeatSkip(direction: common.Direction) {
        
        outputChannel.appendLine(`Mocking repeat skip to`);
        
        let char = this.editor.document.getText(
            new vscode.Range(
                new vscode.Position(this.editor.selection.active.line, this.editor.selection.active.character), 
                new vscode.Position(this.editor.selection.active.line, this.editor.selection.active.character + 1)
            )
        );
        
        outputChannel.appendLine(`Mocking repeat skip to ${char}`);
        
        if (char.length !== 1) return;
        
        const skip: common.Skip = {
            kind: "SkipTo",
            char: char as common.Char,
            subject: "CHAR" as const,
            direction: direction
        };
        common.setLastSkip(skip);
        await this.repeatLastSkip(direction);
    }
    
    async createAndSetLastSkip(char: string, direction: common.Direction) {
        const subjectName = this.mode.getSubjectName();
        if (subjectName === undefined) return;
        
        const skip: common.Skip = {
            kind: "SkipTo",
            char: char as common.Char,
            subject: subjectName,
            direction: direction
        };
        
        common.setLastSkip(skip);
    }
    
    async findNextExact() {
        this.extendAnchor.SelectToAnchor(this.editor);
        
        const currentText = this.editor.document.getText(this.editor.selection);
        if (!currentText) return;
        
        this.createAndSetLastSkip(currentText, "forwards");
        
        const startOffset = this.editor.document.offsetAt(this.editor.selection.end);
        const endOffset = this.editor.document.getText().length;
        const textToSearch = this.editor.document.getText().substring(startOffset, endOffset);
        
        const nextIndex = textToSearch.indexOf(currentText);
        if (nextIndex >= 0) {
            const absoluteIndex = startOffset + nextIndex;
            const newPosition = this.editor.document.positionAt(absoluteIndex);
            const newSelection = new vscode.Selection(
                newPosition,
                this.editor.document.positionAt(absoluteIndex + currentText.length)
            );
            this.editor.selection = newSelection;
            this.editor.revealRange(newSelection, vscode.TextEditorRevealType.Default);
        }
    }

    async findPrevExact() {
        this.extendAnchor.SelectToAnchor(this.editor);
        
        const currentText = this.editor.document.getText(this.editor.selection);
        if (!currentText) return;
        
        this.createAndSetLastSkip(currentText, "backwards");
        
        const endOffset = this.editor.document.offsetAt(this.editor.selection.start);
        const textToSearch = this.editor.document.getText().substring(0, endOffset);
        
        const prevIndex = textToSearch.lastIndexOf(currentText);
        if (prevIndex >= 0) {
            const newPosition = this.editor.document.positionAt(prevIndex);
            const newSelection = new vscode.Selection(
                newPosition,
                this.editor.document.positionAt(prevIndex + currentText.length)
            );
            this.editor.selection = newSelection;
            this.editor.revealRange(newSelection, vscode.TextEditorRevealType.Default);
        }
    }
    
    async nextSubjectUp() {
        if (this.editor.selection.active.line - 1 < 0) return;
        
        if (IsWordWrapEnabled()) {
            const curLineLength = this.editor.document.lineAt(this.editor.selection.active.line).text.length;
            const lineAboveLength = this.editor.document.lineAt(this.editor.selection.active.line - 1).text.length;
            
            if (curLineLength > GetWordWrapColumn() || lineAboveLength > GetWordWrapColumn()) {
                await vscode.commands.executeCommand("cursorUp");
                return;
            }
        }
        
        await this.executeSubjectCommand("nextObjectUp");
    }
    
    async nextSubjectDown() {
        if (this.editor.selection.active.line + 1 >= this.editor.document.lineCount) return;
        
        if (IsWordWrapEnabled()) {
            const curLineLength = this.editor.document.lineAt(this.editor.selection.active.line).text.length;
            const lineBelowLength = this.editor.document.lineAt(this.editor.selection.active.line + 1).text.length;
            
            if (curLineLength > GetWordWrapColumn() || lineBelowLength > GetWordWrapColumn()) {
                await vscode.commands.executeCommand("cursorDown");
                return;
            }
        }
        
        await this.executeSubjectCommand("nextObjectDown");
    }
    
    async EndExtendMode() {
        this.extendAnchor.EndExtendMode();
    }
    
    async StartExtendMode() {
        this.extendAnchor.SetSelectionAnchor(this.editor);
        this.extendAnchor.StartExtendMode();
        this.extendAnchor.updatePhantomSelection(this.editor);
    }
    
    async ToggleExtendMode() {
        if (this.extendAnchor.IsExtendModeOn()) {
            this.extendAnchor.SelectToAnchor(this.editor);
            return;
        }
        else {
            this.StartExtendMode();
        }
    }
    
    async JumpToExtendMode() {
        this.extendAnchor.SelectToAnchor(this.editor);
        await vscode.commands.executeCommand("editor.action.indentLines");
    }
    
    async selectToAnchor() {
        this.extendAnchor.SelectToAnchor(this.editor);
    }
    
    async showSelectionToAnchor() {
        this.extendAnchor.StartExtendMode();
        this.extendAnchor.SelectToAnchor(this.editor);
        this.extendAnchor.StartExtendMode();
    }
    
    async AddSubjectDown() {
        // this.extendAnchor.SelectToAnchor(this.editor);
        await this.executeSubjectCommand("addObjectBelow");
    }
    
    async AddSubjectUp() {
        // this.extendAnchor.SelectToAnchor(this.editor);
        await this.executeSubjectCommand("addObjectAbove");
    }
    
    async DebugWrapped() {
        let editor = this.editor;
        const visibleRanges = editor.visibleRanges;
        for (const range of visibleRanges) {
            const text = editor.document.getText(range);
            console.log(`(${text})`);
        }
    }

}

