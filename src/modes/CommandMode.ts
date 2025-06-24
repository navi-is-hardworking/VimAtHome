import * as vscode from "vscode";
import * as subjects from "../subjects/subjects";
import InsertMode from "./InsertMode";
import ExtendMode from "./ExtendMode";
import * as modes from "./modes";
import * as editor from "../utils/editor";
import * as selections from "../utils/selectionsAndRanges";
import * as common from "../common";
import SubjectBase from "../subjects/SubjectBase";
import { SubjectAction } from "../subjects/SubjectActions";
import JumpInterface from "../handlers/JumpInterface";
import { SubjectName } from "../subjects/SubjectName";
import { seq } from "../utils/seq";
import { setWordDefinition, getWordDefinition, getCommandColor, getWordDefinitionIndex, setCharDefinition, getWordDefinitionByIndex } from "../config";
import { collapseSelections, splitByRegex } from "../utils/selectionsAndRanges";
import { InlineInput } from '../utils/inlineInput';
import { FirstLetterPreview } from '../utils/firstLetterPreview';

let outputchannel = vscode.window.createOutputChannel("VimAtHome");

export default class CommandMode extends modes.EditorMode {

    readonly cursorStyle = vscode.TextEditorCursorStyle.LineThin;
    readonly lineNumberStyle = vscode.TextEditorLineNumbersStyle.Relative;
    readonly name = "COMMAND";

    readonly decorationType: vscode.TextEditorDecorationType;
    readonly decorationTypeTop: vscode.TextEditorDecorationType;
    readonly decorationTypeMid: vscode.TextEditorDecorationType;
    readonly decorationTypeBottom: vscode.TextEditorDecorationType;
    
    private activeJumpInterface?: JumpInterface;
    private activeInlineInput?: InlineInput;

    get statusBarText(): string {
        const lastSkip = common.getLastSkip();
        const skipString =
            lastSkip?.kind === "SkipTo"
                ? ` | Skip: ${lastSkip.char}`
                : lastSkip?.kind === "SkipOver"
                ? ` | Skip over: ${lastSkip.char || "¶"}`
                : ``;

        return `Command mode (${this.subject.displayName})${skipString}`;
    }

    constructor(
        private readonly context: common.ExtensionContext,
        public readonly subject: SubjectBase
    ) {
        
        vscode.commands.executeCommand(
            "setContext",
            "vimAtHome.subject",
            subject.name
        );
        
        super();
        // // const commandColor = getCommandColor();
        common.setVirtualColumn(this.context.editor.selection);

        this.decorationType = vscode.window.createTextEditorDecorationType({
            dark: {
                // backgroundColor: commandColor,
                borderStyle: "solid",
                borderColor: subject.outlineColour.dark,
                borderWidth: "1.5px",
            },
            light: {
                borderStyle: "solid",
                borderColor: subject.outlineColour.light,
                borderWidth: "1.5px",
            },
        });

        this.decorationTypeTop = vscode.window.createTextEditorDecorationType({
            dark: {
                // backgroundColor: commandColor,
                borderStyle: "solid none none solid",
                borderColor: subject.outlineColour.dark,
                borderWidth: "1.5px",
            },
            light: {
                borderStyle: "solid none none solid",
                borderColor: subject.outlineColour.light,
                borderWidth: "1.5px",
            },
        });

        this.decorationTypeMid = vscode.window.createTextEditorDecorationType({
            dark: {
                // backgroundColor: commandColor,
                borderStyle: "none none none solid",
                borderColor: subject.outlineColour.dark,
                borderWidth: "1.5px",
            },
            light: {
                borderStyle: "none none none solid",
                borderColor: subject.outlineColour.light,
                borderWidth: "1.5px",
            },
        });

        this.decorationTypeBottom =
            vscode.window.createTextEditorDecorationType({
                dark: {
                    // backgroundColor: commandColor,
                    borderStyle: "none none solid solid",
                    borderColor: subject.outlineColour.dark,
                    borderWidth: "1.5px",
                },
                light: {
                    borderStyle: "none none solid solid",
                    borderColor: subject.outlineColour.light,
                    borderWidth: "1.5px",
                },
            });
    }

    async dispose(): Promise<void> {
        this.decorationType?.dispose();
        this.decorationTypeTop?.dispose();
        this.decorationTypeMid?.dispose();
        this.decorationTypeBottom?.dispose();
    }

    equals(previousMode: modes.EditorMode): boolean {
        return (
            previousMode instanceof CommandMode &&
            previousMode.subject.equals(this.subject)
        );
    }
    
    with(
        args: Partial<{
            context: common.ExtensionContext;
            subject: SubjectBase;
        }>
    ) {
        return new CommandMode(
            args.context ?? this.context,
            args.subject ?? this.subject
        );
    }
    
    async changeTo(
        newMode: modes.EditorModeChangeRequest
    ): Promise<modes.EditorMode> {
    
        
        switch (newMode.kind) {
            case "INSERT": {
                await this.dispose();
                return new InsertMode(this.context, this);
            }
            
            case "EXTEND": {
                await this.dispose();
                return new ExtendMode(this.context, this);
            }
            
            case "COMMAND":
                if (editor) {
                    if (newMode.subjectName === "LINE" || newMode.subjectName === "BLOCK") {
                        const collapsePos = newMode.half === "RIGHT" ? "start" : "end";
                        selections.collapseSelections(this.context.editor, collapsePos);
                    }
                    else {
                        const collapsePos = newMode.half === "RIGHT" ? "end" : "start";
                        selections.collapseSelections(this.context.editor, collapsePos);
                    }
                }
                
                if (!newMode.subjectName) {
                    return this;
                }
                
                if (newMode.subjectName !== this.subject.name) {
                    return this.with({
                        subject: subjects.createFrom(
                            this.context,
                            newMode.subjectName
                        ),
                    });
                }

                // This handles the "cyclable" subjects, e.g. "WORD" -> "INTERWORD" -> "WORD" etc
                switch (newMode.subjectName) {
                    case "WORD":
                        await this.dispose();
                        return this.with({
                            subject: subjects.createFrom(
                                this.context,
                                "WORD",
                            ),
                        });
                    case "INTERWORD":
                        await this.dispose();
                        this.with({
                            subject: subjects.createFrom(this.context, "WORD"),
                        });
                    case "BRACKETS":
                        await this.dispose();
                        return this.with({
                            subject: subjects.createFrom(
                                this.context,
                                "BRACKETS_INCLUSIVE"
                            ),
                        });
                    case "BRACKETS_INCLUSIVE":
                        await this.dispose();
                        return this.with({
                            subject: subjects.createFrom(
                                this.context,
                                "BRACKETS"
                            ),
                        });
                }

                return this;
        }
    }

    async executeSubjectCommand(command: SubjectAction): Promise<void> {
        await this.subject[command]();
    }
    
    async fixSelection(half? : "LEFT" | "RIGHT") {
        await this.subject.fixSelection(half);
    }
    
    async skip(direction: common.Direction, skipSubject: SubjectName | undefined = undefined): Promise<void> {
        
        await new Promise<void>((resolve) => {
            const handleInput = async (_: string, char: common.Char) => {
                let finalDirection = direction;
                if (char >= 'A' && char <= 'Z') {
                    finalDirection = common.reverseDirection(direction);
                }
                
                if (this.subject.name === "WORD" && !/[a-zA-Z0-9_]/.test(char)) {
                    const newMode = await this.changeTo({ kind: "COMMAND", subjectName: "CHAR" });
                    if (newMode instanceof CommandMode) {
                        const skip: common.Skip = {
                            kind: "SkipTo",
                            char,
                            subject: "CHAR" as const,
                            direction: finalDirection
                        };
                        common.setLastSkip(skip);
                        await newMode.subject.skip(finalDirection, skip);
                    }
                } 
                else if (skipSubject && skipSubject != this.subject.name) {
                    const newMode = await this.changeTo({ kind: "COMMAND", subjectName: skipSubject });
                    if (newMode instanceof CommandMode) {
                        const skip: common.Skip = {
                            kind: "SkipTo",
                            char,
                            subject: skipSubject,
                            direction: finalDirection
                        };
                        common.setLastSkip(skip);
                        await newMode.subject.skip(finalDirection, skip);
                    }
                }
                else {
                    const skip: common.Skip = {
                        kind: "SkipTo",
                        char,
                        subject: this.subject.name,
                        direction: finalDirection
                    };
                    common.setLastSkip(skip);
                    await this.subject.skip(finalDirection, skip);
                }
                
                resolve();
            };
            
            this.activeInlineInput = new InlineInput({
                textEditor: this.context.editor,
                onInput: handleInput,
                onCancel: async () => {
                    FirstLetterPreview.getInstance().clearDecorations(this.context.editor);
                    resolve();
                }
            });
            
            this.activeInlineInput.updateStatusBar(
                `Skip ${direction} to ${this.subject.displayName} by first character`,
                0
            );
        });

        this.activeInlineInput = undefined;
    }
    
    async skipOver(direction: common.Direction): Promise<void> {
        const skipChar = await editor.inputBoxChar(
            `Skip ${direction} over the given character to the next ${this.subject.name}`,
            true
        );
        if (skipChar === undefined) {
            return;
        }
        common.setLastSkip({kind: "SkipTo", char: skipChar, subject: this.subject.name, direction: direction});
        await this.subject.skip(direction, {kind: "SkipTo", char: skipChar, subject: this.subject.name, direction: direction});
    }
    
    async repeatLastSkip(direction: common.Direction): Promise<void> {
        const lastSkip = common.getLastSkip();
        if (!lastSkip) {
            return;
        }
        
        // issue is not accounting for subwords
        if (this.subject.name !== lastSkip.subject) {
            await vscode.commands.executeCommand(`vimAtHome.changeTo${lastSkip.subject.charAt(0).toUpperCase() + lastSkip.subject.slice(1).toLowerCase()}Subject`);
        }
        
        let lastDirection = lastSkip.direction;
        if (direction === "backwards") {
            lastDirection = common.reverseDirection(lastDirection);
        }
        
        await this.subject.skip(lastDirection, lastSkip);
    }
    
    
    async jump(): Promise<void> {
        const combinedRange = this.context.editor.visibleRanges.reduce((acc, range) => acc.union(range));
        const jumpLocations = this.subject
            .iterAll(common.IterationDirection.alternate, combinedRange)
            .map((range) => range.start)
            .toArray();
            
        this.activeJumpInterface = new JumpInterface(this.context);
        let jumpType = this.subject.jumpPhaseType;
        
        if (this.subject.name === "WORD") {
            let wordDefinitionIndex = getWordDefinitionIndex();
            if (wordDefinitionIndex == 0) {
                jumpType = "dual-phase";
            } else {
                jumpType = "single-phase";
            }
        }
    
        common.setLazyPassSubjectName(this.subject.name);
        let size: number = this.getSubjectName() === "CHAR" ? 0 : 1;
        const jumpPosition = await this.activeJumpInterface.jump({
            kind: jumpType,
            locations: seq(jumpLocations)},);
    
        if (jumpPosition) {
            this.context.editor.selection = selections.positionToSelection(jumpPosition);
            common.setVirtualColumn(this.context.editor.selection);
            await this.fixSelection();
        }
    }
    
    async jumpToSubject(subjectName: SubjectName) {
        const tempSubject = subjects.createFrom(this.context, subjectName);
        const combinedRange = this.context.editor.visibleRanges.reduce((acc, range) => acc.union(range));
        const jumpLocations = tempSubject
            .iterAll(common.IterationDirection.alternate, combinedRange)
            .map((range) => range.start)
            .toArray();
            
            this.activeJumpInterface = new JumpInterface(this.context);
            let jumpType = tempSubject.jumpPhaseType;
            if (tempSubject.name === "WORD") {
                let wordDefinitionIndex = getWordDefinitionIndex();
                if (wordDefinitionIndex <= 1) {
                    jumpType = "dual-phase";
                } else {
                    jumpType = "single-phase";
                }
            }
            
        common.setLazyPassSubjectName(subjectName);
        const jumpPosition = await this.activeJumpInterface.jump({
            kind: jumpType,
            locations: seq(jumpLocations)},);

        if (jumpPosition) {
            this.context.editor.selection =
                selections.positionToSelection(jumpPosition);

            // outputchannel.appendLine(`jumpToSubject: ${subjectName}`);
            return await this.changeTo({ kind: "COMMAND", subjectName });
        }
    }
    
    async pullSubject(subjectName: SubjectName) {
        const tempSubject = subjects.createFrom(this.context, subjectName);
        const combinedRange = this.context.editor.visibleRanges.reduce((acc, range) => acc.union(range));
        const jumpLocations = tempSubject
            .iterAll(common.IterationDirection.alternate, combinedRange)
            .map((range) => range.start)
            .toArray();

        this.activeJumpInterface = new JumpInterface(this.context);
        let jumpType = tempSubject.jumpPhaseType;

        if (tempSubject.name === "WORD") {
            let wordDefinitionIndex = getWordDefinitionIndex();
            if (wordDefinitionIndex <= 1) {
                jumpType = "dual-phase";
            } else {
                jumpType = "single-phase";
            }
        }

        const jumpPosition = await this.activeJumpInterface.jump({
            kind: jumpType,
            locations: seq(jumpLocations)},);

        if (jumpPosition) {
            const currentSelection = this.context.editor.selection;
            const pulledRange = await tempSubject.pullSubject(
                this.context.editor.document,
                jumpPosition,
                currentSelection
            );

            if (pulledRange) {
                this.context.editor.selection = new vscode.Selection(pulledRange.start, pulledRange.end);
                // await this.fixSelection();
            }
        }
        return undefined;
    }

    getSubjectName(): SubjectName {
        return this.subject.name;
    }

    async zoomJump(): Promise<vscode.Position | undefined> {
        const combinedRange = this.context.editor.visibleRanges.reduce((acc, range) => acc.union(range));
        const jumpLocations = this.subject
        .iterAll(common.IterationDirection.alternate, combinedRange)
        .counted()
        .filter(([_, index]) => index % 3 === 0) // Select every 3rd line
        .map(([range, _]) => range.start)
        .toArray();
        // outputchannel.appendLine(`zoomJump: ${jumpLocations.length} locations found`);
        this.activeJumpInterface = new JumpInterface(this.context);
        const jumpPosition = await this.activeJumpInterface.zoomJump({ // testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest
            locations: seq(jumpLocations),
        });
    
        if (jumpPosition) {
            this.context.editor.selection = selections.positionToSelection(jumpPosition);
            await this.fixSelection();
        }
    
        return jumpPosition;
    }
    
    private handleWordCollapse(document: vscode.TextDocument, selection: vscode.Selection): modes.EditorModeChangeRequest {
        switch (this.subject.name) {
            case "BLOCK":
            case "LINE":
            case "BRACKETS":
            case "BRACKETS_INCLUSIVE":
                setWordDefinition(0);
                return { kind: "COMMAND", subjectName: "WORD" };
            case "WORD": {
                if (getWordDefinitionIndex() === 5 || getWordDefinitionIndex() === 6) {
                    const selText = document.getText(selection);
                    
                    const regex0 = getWordDefinitionByIndex(0);
                    if (regex0) {
                        regex0.lastIndex = 0;
                        const match0 = regex0.exec(selText);
                        const exactMatch0 = match0 && match0.index === 0 && match0[0].length === selText.length;
                        if (!exactMatch0) {
                            setWordDefinition(0);
                            return { kind: "COMMAND", subjectName: "WORD" };
                        }
                    }
                    
                    const regex1 = getWordDefinitionByIndex(2);
                    if (regex1) {
                        regex1.lastIndex = 0;
                        const match1 = regex1.exec(selText);
                        const exactMatch1 = match1 && match1.index === 0 && match1[0].length === selText.length;
                        if (!exactMatch1) {
                            setWordDefinition(1);
                            return { kind: "COMMAND", subjectName: "WORD" };
                        }
                    }
                    
                    setCharDefinition();
                    return { kind: "COMMAND", subjectName: "WORD" };
                } else if (getWordDefinitionIndex() === 0) {
                    const selText = document.getText(selection);
                    const regex0 = getWordDefinitionByIndex(2);
                    if (regex0) {
                        regex0.lastIndex = 0;
                        const match0 = regex0.exec(selText);
                        const exactMatch0 = match0 && match0.index === 0 && match0[0].length === selText.length;
                        if (!exactMatch0) {
                            setWordDefinition(2);
                            return { kind: "COMMAND", subjectName: "WORD" };
                        }
                    }

                    setCharDefinition();
                    return { kind: "COMMAND", subjectName: "WORD" };
                } else {
                    setCharDefinition();
                    return { kind: "COMMAND", subjectName: "WORD" };
                }
            }
            case "SUBWORD":
                return { kind: "COMMAND", subjectName: "CHAR" };
        }
        return { kind: "COMMAND", subjectName: "CHAR" };
    }
    
    async collapseToCenter(): Promise<modes.EditorModeChangeRequest> {
        common.SetTextChanging(true);
        try {
            let ret: modes.EditorModeChangeRequest = { kind: "COMMAND", subjectName: "LINE" };
            const editor = this.context.editor;
            const document = editor.document;
            let new_selections: vscode.Selection[] = []
            let previous_word_definition = getWordDefinitionIndex();
            
            editor.selections.forEach(selection => {
                setWordDefinition(previous_word_definition);
                let new_selection = selection;
                let text = document.getText(selection);
                if (selection.start.line !== selection.end.line) {
                    const startLine = Math.min(selection.start.line, selection.end.line);
                    const endLine = Math.max(selection.start.line, selection.end.line);
                    const middleLine = Math.floor((startLine + endLine) / 2);
                    const lineText = document.lineAt(middleLine).text;
                    const start = lineText.indexOf(lineText.trim()[0]);
                    const comment = lineText.indexOf('//');
                    const end = Math.min(lineText.length, comment !== -1 ? comment : lineText.length);
                    const mid = Math.floor((start + end) / 2);
                    new_selection = new vscode.Selection(middleLine, mid, middleLine, mid);
                    ret = { kind: "COMMAND", subjectName: "LINE" };
                }
                else {
                    ret = this.handleWordCollapse(document, selection);
                    const wordDefinition = getWordDefinition();
                    const selectedText = document.getText(selection);
                    if (wordDefinition && selectedText && selectedText.trim().length != 0) {
                        let matches = splitByRegex(wordDefinition, text, selection);
                        if (matches.length) {
                            const midIndex = Math.floor((matches.length) / 2);
                            const [start, end] = matches[midIndex];
                            new_selection = new vscode.Selection(
                                new vscode.Position(start.line, Math.floor((start.character + end.character + 1) / 2)),
                                new vscode.Position(start.line, Math.floor((start.character + end.character + 1) / 2))
                            );
                        }
                    }
                }
                new_selections.push(new_selection)
            });
            
            editor.selections = new_selections
            common.SetTextChanging(false);
            return ret;
        }
        catch (error) {
            common.SetTextChanging(false);
            return { kind: "COMMAND", subjectName: "WORD" };
        }
    }
    
    async collapseToLeft(): Promise<modes.EditorModeChangeRequest> {
        common.SetTextChanging(true);
        
        let ret: modes.EditorModeChangeRequest = { kind: "COMMAND", subjectName: "LINE" };
        
        const editor = this.context.editor;
        const document = editor.document;
        let new_selections: vscode.Selection[] = []
        let previous_word_definition = getWordDefinitionIndex();
        
        editor.selections.forEach(selection => {
            setWordDefinition(previous_word_definition);
            let new_selection = selection;
            let text = document.getText(selection);
            if (selection.start.line !== selection.end.line) {
                const topLine = Math.min(selection.start.line, selection.end.line);
                const lineText = document.lineAt(topLine).text;
                const start = lineText.indexOf(lineText.trim()[0]);
                new_selection = new vscode.Selection(topLine, start, topLine, start);
                ret = { kind: "COMMAND", subjectName: "LINE" };
            }
            else {
                const position = selection.start.isBefore(selection.end) ? selection.start : selection.end;
                outputchannel.appendLine("new selection after collapseToLeft: " + selection.start.line + ", " + selection.start.character);
                ret = this.handleWordCollapse(document, selection);
                new_selection = new vscode.Selection(position, position);
                const wordDefinition = getWordDefinition();
                if (wordDefinition) {
                    let matches = splitByRegex(wordDefinition, text, selection);
                    if (matches.length) {
                        const [start, end] = matches[0];
                        new_selection = new vscode.Selection(
                            new vscode.Position(start.line, Math.floor((start.character + end.character + 1) / 2)),
                            new vscode.Position(start.line, Math.floor((start.character + end.character + 1) / 2))
                        );
                    }
                }
            }
            new_selections.push(new_selection)
        });
        
        editor.selections = new_selections
        
        common.SetTextChanging(false);
        return ret;
        }
    
    async collapseToRight(): Promise<modes.EditorModeChangeRequest> {
        common.SetTextChanging(true);
        
        let ret: modes.EditorModeChangeRequest = { kind: "COMMAND", subjectName: "LINE" };
        
        const editor = this.context.editor;
        const document = editor.document;
        let new_selections: vscode.Selection[] = []
        let previous_word_definition = getWordDefinitionIndex();
        
        editor.selections.forEach(selection => {
            setWordDefinition(previous_word_definition);
            let new_selection = selection;
            let text = document.getText(selection);
            if (selection.start.line !== selection.end.line) {
                const bottomLine = Math.max(selection.start.line, selection.end.line);
                const start = document.lineAt(bottomLine).text.indexOf(document.lineAt(bottomLine).text.trim()[0]);
                new_selection = new vscode.Selection(bottomLine, start, bottomLine, start)
                ret = { kind: "COMMAND", subjectName: "LINE" };
            }
            else {
                const position = selection.start.isAfter(selection.end) ? selection.start : selection.end;
                outputchannel.appendLine("new selection points after collapseToRight: " + selection.start.line + ", " + selection.start.character); 
                ret = this.handleWordCollapse(document, selection);
                new_selection = new vscode.Selection(position, position)
                const wordDefinition = getWordDefinition();
                outputchannel.appendLine("wordDefinition is: " + wordDefinition);
                if (wordDefinition) {
                    let matches = splitByRegex(wordDefinition, text, selection);
                    if (matches.length) {
                        const [start, end] = matches[matches.length - 1];
                        selection = (new vscode.Selection(
                        new vscode.Position(start.line, Math.floor((start.character + end.character + 1) / 2)),
                            new vscode.Position(start.line, Math.floor((start.character + end.character + 1) / 2))
                        ))
                    }
                }
            }
            new_selections.push(new_selection)
        });
        
        editor.selections = new_selections
        
        common.SetTextChanging(false);
        return ret;
    }
    
    cancelActiveJumpOrSkip() {
        if (this.activeJumpInterface) {
            this.activeJumpInterface.cancel();
            this.activeJumpInterface = undefined;
        }
        if (this.activeInlineInput) {
            this.activeInlineInput.destroy();
            this.activeInlineInput = undefined;
            FirstLetterPreview.getInstance().clearDecorations(this.context.editor);
        }
        
        // vscode.commands.executeCommand('workbench.action.closeQuickOpen');
    }
}
    

