import * as vscode from "vscode";
import { Config } from "./config";
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
import * as cache from "./historyCache";
import * as editorUtils from "./utils/editor";
import * as lineUtils from "./utils/lines";

let outputChannel = vscode.window.createOutputChannel("ManagerOutput");


export default class VimAtHomeManager {
    private mode: EditorMode;
    public statusBar: vscode.StatusBarItem;
    public editor: vscode.TextEditor = undefined!;

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
        this.clearSelections();

        // newMode.kind = this.mode.kind;
        this.mode = await this.mode.changeTo(newMode);
        const half = newMode.kind === "INSERT" ? undefined : newMode.half;

        this.setUI();
        this.mode.fixSelection(half);
        this.setDecorations();
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
        this.clearSelections();
        this.setDecorations();
        const selectedText = this.editor.document.getText(this.editor.selection);
        
        if (
            event.kind === vscode.TextEditorSelectionChangeKind.Command ||
            event.kind === undefined
        ) {
            this.editor.revealRange(this.editor.selection);
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
        this.setUI();
        
    }

    async setDecorations() {
        if (this.mode?.decorationType) {
            for (const selection of this.editor.selections) {
                const splits = splitRange(this.editor.document, selection);

                if (splits.kind === 'SingleLine') {
                    this.editor.setDecorations(
                        this.mode.decorationType,
                        [splits.range]
                    );
                }
                else {
                    this.editor.setDecorations(
                        this.mode.decorationTypeTop ?? this.mode.decorationType,
                        [splits.firstLine]
                    );

                    this.editor.setDecorations(
                        this.mode.decorationTypeMid ?? this.mode.decorationType,
                        splits.middleLines
                    );

                    this.editor.setDecorations(
                        this.mode.decorationTypeBottom ?? this.mode.decorationType,
                        [splits.lastLine]
                    );                
                }
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
        const choice = await quickCommandPicker(quickMenus.SpaceCommands);

        if (choice) {
            await choice.execute();
        }
    }

    async openSubjectMenu() {
        const choice = await quickCommandPicker(quickMenus.SubjectChangeCommands);
        if (choice) {
            await choice.execute();
        }
    }

    async openGoToMenu() {
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
        const choice = await quickCommandPicker(quickMenus.ModifyCommands);

        if (choice) {
            await choice.execute();
        }

        this.mode.fixSelection();
    }

    async openViewMenu() {
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
        await this.mode.skip(direction);
        this.setUI();
    }
    
    async skipOver(direction: common.Direction) {
        await this.mode.skipOver(direction);
        this.setUI();
    }
    
    async repeatLastSkip(direction: common.Direction) {
        await this.mode.repeatLastSkip(direction);
        this.setUI();
    }

    async jump() {
        await this.mode.jump();
    }

    async jumpToSubject(subjectName: SubjectName) {
        // outputChannel.appendLine(`Jumping to subject: ${subjectName}, current subject: ${this.mode.getSubjectName()}`); 

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

        // Add a small delay to ensure the editor has updated
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
            // await this.scrollToCursorAtCenter();
        }
    }

    async scrollToCursorAtCenter() {
        await vscode.commands.executeCommand('revealLine', {
            lineNumber: this.editor.selection.active.line,
            at: 'center'
        });
    }

    async deleteLineAbove() {
        const { editor } = this;
        const document = editor.document;
        
        const originalSelections = editor.selections;
        
        await editor.edit(editBuilder => {
            for (const selection of originalSelections) {
                const lineToDelete = Math.max(selection.start.line - 1, 0);
                if (lineToDelete < selection.start.line) {  // Ensure we're not at the top
                    const rangeToDelete = document.lineAt(lineToDelete).rangeIncludingLineBreak;
                    editBuilder.delete(rangeToDelete);
                }
            }
        });

        // Adjust and reapply selections
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

    async deleteLineBelow() {
        const { editor } = this;
        const document = editor.document;
        
        await editor.edit(editBuilder => {
            for (const selection of editor.selections) {
                const lineToDelete = Math.min(selection.end.line + 1, document.lineCount - 1);
                if (lineToDelete > selection.end.line) {  // Ensure we're not at the bottom
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
    
                if (commentStart !== -1 || pythonCommentStart !== -1 || htmlCommentStart !== -1) {
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

    async nextSignificantBlock(direction: common.Direction) {
        const document = this.editor.document;
        const lineCount = document.lineCount;
        let currentLine = this.editor.selection.active.line;
        const increment = direction === common.Direction.forwards ? 1 : -1;

        while (currentLine >= 0 && currentLine < lineCount) {
            currentLine += increment;
            if (currentLine < 0 || currentLine >= lineCount) break;
            
            const line = document.lineAt(currentLine);
            if (lineUtils.lineIsSignificant(line)) {
                while (currentLine >= 0 && currentLine < lineCount) {
                    const nextLine = document.lineAt(currentLine + increment);
                    if (!lineUtils.lineIsSignificant(nextLine)) {
                        break;
                    }
                    currentLine += increment;
                }
                break;
            }
        }

        await this.updateEditorPosition(currentLine);
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
        const newPosition = new vscode.Position(lineNumber, common.getVirtualColumn());
        this.editor.selection = new vscode.Selection(newPosition, newPosition);
        this.editor.revealRange(new vscode.Range(newPosition, newPosition));
        await this.changeMode({ kind: "COMMAND", subjectName: "WORD" });
    }
}

