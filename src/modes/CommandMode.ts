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
import { collapseSelections } from "../utils/selectionsAndRanges";
// import { setWordDefinition, getWordDefinition, getWordDefinitionByIndex } from "../config";
let outputchannel = vscode.window.createOutputChannel("VimAtHome");

export default class CommandMode extends modes.EditorMode {

    readonly cursorStyle = vscode.TextEditorCursorStyle.LineThin;
    readonly lineNumberStyle = vscode.TextEditorLineNumbersStyle.Relative;
    readonly name = "COMMAND";

    readonly decorationType: vscode.TextEditorDecorationType;
    readonly decorationTypeTop: vscode.TextEditorDecorationType;
    readonly decorationTypeMid: vscode.TextEditorDecorationType;
    readonly decorationTypeBottom: vscode.TextEditorDecorationType;

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
        const commandColor = getCommandColor();
        common.setVirtualColumn(this.context.editor.selection);

        this.decorationType = vscode.window.createTextEditorDecorationType({
            dark: {
                backgroundColor: commandColor,
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
                backgroundColor: commandColor,
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
                backgroundColor: commandColor,
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
                    backgroundColor: commandColor,
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
                    const collapsePos = newMode.half === "RIGHT" ? "start" : "end";
                    selections.collapseSelections(this.context.editor, collapsePos);
                }
                
                if (!newMode.subjectName) {
                    return this;
                }
                
                if (newMode.subjectName !== this.subject.name && newMode.half == undefined) {
                    await this.dispose();
                    if (this.subject.name != 'BRACKETS' && this.subject.name != 'BRACKETS_INCLUSIVE' && newMode.subjectName === 'BRACKETS') {
                        let currentLine = this.context.editor.selection.active.line;
                        let cursorChar = this.context.editor.selection.active.character;
                
                        let lineText = this.context.editor.document.lineAt(currentLine).text;
                        let leftSquare = lineText.indexOf('[');  
                        let rightSquare = lineText.indexOf(']');  
                        let leftCurly = lineText.indexOf('{');  
                        let rightCurly = lineText.indexOf('}');  
                        let leftParen = lineText.indexOf('('); 
                        let rightParen = lineText.indexOf(')'); 
                
                        if ((leftSquare != -1 && leftSquare <= cursorChar) ||
                            (leftCurly != -1 && leftCurly <= cursorChar) || 
                            (leftParen != -1 && leftParen <= cursorChar) ||
                            (leftSquare == -1 && rightSquare != -1 && leftCurly != -1 && rightCurly == -1) ||
                            (leftSquare == -1 && rightSquare != -1 && leftParen != -1 && rightParen == -1) ||
                            (leftCurly == -1 && rightCurly != -1 && leftParen != -1 && rightParen == -1) ||
                            (leftParen == -1 && rightParen != -1 && leftCurly != -1 && rightCurly == -1)
                        ) {}
                        else if ((leftSquare != -1) && (leftCurly != -1) && leftParen != -1) {
                            if ((rightSquare != leftSquare + 1) && leftSquare < leftCurly && leftSquare < leftParen) {
                                this.context.editor.selection = new vscode.Selection(currentLine, leftSquare, currentLine, leftSquare);
                            } else if ((rightCurly != leftCurly + 1) && leftCurly < leftParen) {
                                this.context.editor.selection = new vscode.Selection(currentLine, leftCurly, currentLine, leftCurly);
                            } else {
                                this.context.editor.selection = new vscode.Selection(currentLine, leftParen, currentLine, leftParen);
                            }
                        } else if ((leftSquare != -1) && leftCurly != -1) {
                            if ((rightSquare != leftSquare + 1) && leftSquare < leftCurly) {
                                this.context.editor.selection = new vscode.Selection(currentLine, leftSquare, currentLine, leftSquare);
                            } else {
                                this.context.editor.selection = new vscode.Selection(currentLine, leftCurly, currentLine, leftCurly);
                            }
                        } else if ((leftSquare != -1) && leftParen != -1) {
                            if ((rightSquare != leftSquare + 1) && leftSquare < leftParen) {
                                this.context.editor.selection = new vscode.Selection(currentLine, leftSquare, currentLine, leftSquare);
                            } else {
                                this.context.editor.selection = new vscode.Selection(currentLine, leftParen, currentLine, leftParen);
                            }
                        } else if (leftSquare != -1) {
                            this.context.editor.selection = new vscode.Selection(currentLine, leftSquare, currentLine, leftSquare);
                        } else if (leftCurly != -1) {
                            this.context.editor.selection = new vscode.Selection(currentLine, leftCurly, currentLine, leftCurly);
                        } else if (leftParen != -1) {
                            this.context.editor.selection = new vscode.Selection(currentLine, leftParen, currentLine, leftParen);
                        }
                    }
                    
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

    async skip(direction: common.Direction): Promise<void> {
        const combinedRange = this.context.editor.visibleRanges.reduce((acc, range) => acc.union(range));
        const jumpLocations = this.subject
            .iterAll(common.IterationDirection.alternate, combinedRange)
            .map((range) => range.start)
            .toArray();
            
        const jumpInterface = new JumpInterface(this.context);
        let jumpType = this.subject.jumpPhaseType;
        jumpType = "single-phase";

        // if (this.subject.name === "WORD") {
        //     let wordDefinitionIndex = getWordDefinitionIndex();
        //     if (wordDefinitionIndex == 0) {
        //         jumpType = "dual-phase";
        //     } else {
        //         jumpType = "single-phase";
        //     }
        // }
    
        let size: number = this.getSubjectName() === "CHAR" ? 0 : 1;
        common.setLazyPassSubjectName(this.subject.name);
        const jumpPosition = await jumpInterface.jump({
            kind: jumpType,
            locations: seq(jumpLocations)},
        size);
    
        if (jumpPosition) {
            this.context.editor.selection = selections.positionToSelection(jumpPosition);
            common.setVirtualColumn(this.context.editor.selection);
            await this.fixSelection();
        }
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
            
        const jumpInterface = new JumpInterface(this.context);
        let jumpType = this.subject.jumpPhaseType;
        // jumpType = "single-phase";

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
        const jumpPosition = await jumpInterface.jump({
            kind: jumpType,
            locations: seq(jumpLocations)},
        size);
    
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

            const jumpInterface = new JumpInterface(this.context);
            let jumpType = tempSubject.jumpPhaseType;
            if (tempSubject.name === "WORD") {
                let wordDefinitionIndex = getWordDefinitionIndex();
                if (wordDefinitionIndex <= 1) {
                    jumpType = "dual-phase";
                } else {
                    jumpType = "single-phase";
                }
            }
            
        let size: number = this.getSubjectName() === "CHAR" ? 0 : 1;
        common.setLazyPassSubjectName(this.subject.name);
        const jumpPosition = await jumpInterface.jump({
            kind: jumpType,
            locations: seq(jumpLocations)},
        size);

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

        const jumpInterface = new JumpInterface(this.context);

        let jumpType = tempSubject.jumpPhaseType;

        if (tempSubject.name === "WORD") {
            let wordDefinitionIndex = getWordDefinitionIndex();
            if (wordDefinitionIndex <= 1) {
                jumpType = "dual-phase";
            } else {
                jumpType = "single-phase";
            }
        }

        let size: number = this.getSubjectName() === "CHAR" ? 0 : 1;
        common.setLazyPassSubjectName(this.subject.name);
        const jumpPosition = await jumpInterface.jump({
            kind: jumpType,
            locations: seq(jumpLocations)},
        size);

        if (jumpPosition) {
            const currentSelection = this.context.editor.selection;
            const pulledRange = await tempSubject.pullSubject(
                this.context.editor.document,
                jumpPosition,
                currentSelection
            );

            if (pulledRange) {
                this.context.editor.selection = new vscode.Selection(pulledRange.start, pulledRange.end);
                await this.fixSelection();
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
        const jumpInterface = new JumpInterface(this.context);
        const jumpPosition = await jumpInterface.zoomJump({ // testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest
            locations: seq(jumpLocations),
        });
    
        if (jumpPosition) {
            this.context.editor.selection = selections.positionToSelection(jumpPosition);
            await this.fixSelection();
        }
    
        return jumpPosition;
    }
    
    private handleWordMode(document: vscode.TextDocument, selection: vscode.Selection): modes.EditorModeChangeRequest {
        switch (this.subject.name) {
            case "BLOCK":
            case "LINE":
            case "BRACKETS":
            case "BRACKETS_INCLUSIVE":
                setWordDefinition(4);
                return { kind: "COMMAND", subjectName: "WORD" };
            case "WORD": {
                if (getWordDefinitionIndex() === 4 || getWordDefinitionIndex() === 5) {
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
                    
                    const regex1 = getWordDefinitionByIndex(1);
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
                    const regex0 = getWordDefinitionByIndex(1);
                    if (regex0) {
                        regex0.lastIndex = 0;
                        const match0 = regex0.exec(selText);
                        const exactMatch0 = match0 && match0.index === 0 && match0[0].length === selText.length;
                        if (!exactMatch0) {
                            setWordDefinition(1);
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
    
    splitByRegex(regex: RegExp, text: string, selection: vscode.Selection): Array<[vscode.Position, vscode.Position]> {
        const pattern = regex instanceof RegExp ? regex.source : regex;
        const currentRegex = new RegExp(pattern, "g");
        const matches: Array<[vscode.Position, vscode.Position]> = [];
        let match;
        while (match = currentRegex.exec(text)) {
            matches.push([
                new vscode.Position(selection.start.line, selection.start.character + match.index),
                new vscode.Position(selection.start.line, selection.start.character + match.index + match[0].length)
            ]);
        }
        return matches;
    }
    
    async collapseToCenter(): Promise<modes.EditorModeChangeRequest> {
        const editor = this.context.editor;
        const selection = editor.selection;
        const document = editor.document;
        const text = document.getText(selection);
        if (selection.start.line !== selection.end.line) {
            const startLine = Math.min(selection.start.line, selection.end.line);
            const endLine = Math.max(selection.start.line, selection.end.line);
            const middleLine = Math.floor((startLine + endLine) / 2);
            const lineText = document.lineAt(middleLine).text;
            const start = lineText.indexOf(lineText.trim()[0]);
            const comment = lineText.indexOf('//');
            const end = Math.min(lineText.length, comment !== -1 ? comment : lineText.length);
            const mid = Math.floor((start + end) / 2);
            editor.selection = new vscode.Selection(middleLine, mid, middleLine, mid);
            return { kind: "COMMAND", subjectName: "LINE" };
        }
        collapseSelections(editor, "midpoint");
        outputchannel.appendLine("new selection after collapseToCenter: " + editor.selection.start.line + ", " + editor.selection.start.character);
        const ret = this.handleWordMode(document, selection);
        const wordDefinition = getWordDefinition();
        if (!wordDefinition) return ret;
        let matches = this.splitByRegex(wordDefinition, text, selection);
        if (matches.length) {
            const midIndex = Math.floor(matches.length / 2);
            const [start, end] = matches[midIndex];
            editor.selection = new vscode.Selection(
                new vscode.Position(start.line, Math.floor((start.character + end.character + 1) / 2)),
                new vscode.Position(start.line, Math.floor((start.character + end.character + 1) / 2))
            );
        }
        return ret;
    }
    
    async collapseToLeft(): Promise<modes.EditorModeChangeRequest> {
        const editor = this.context.editor;
        const selection = editor.selection;
        const document = editor.document;
        const text = document.getText(selection);
        if (selection.start.line !== selection.end.line) {
            const topLine = Math.min(selection.start.line, selection.end.line);
            const lineText = document.lineAt(topLine).text;
            const start = lineText.indexOf(lineText.trim()[0]);

            editor.selection = new vscode.Selection(topLine, start, topLine, start);
            return { kind: "COMMAND", subjectName: "LINE" };
        }
        const position = selection.start.isBefore(selection.end) ? selection.start : selection.end;
        editor.selection = new vscode.Selection(position, position);
        outputchannel.appendLine("new selection after collapseToLeft: " + editor.selection.start.line + ", " + editor.selection.start.character);
        const ret = this.handleWordMode(document, selection);
        const wordDefinition = getWordDefinition();
        if (!wordDefinition) return ret;
        let matches = this.splitByRegex(wordDefinition, text, selection);
        if (matches.length) {
            const [start, end] = matches[0];  // Take first match instead of last
            editor.selection = new vscode.Selection(
                new vscode.Position(start.line, Math.floor((start.character + end.character + 1) / 2)),
                new vscode.Position(start.line, Math.floor((start.character + end.character + 1) / 2))
            );
        }
        
        return ret;
    }
    
    async collapseToRight(): Promise<modes.EditorModeChangeRequest> {
        const editor = this.context.editor;
        const document = editor.document;
        const selection = editor.selection;
        const text = document.getText(selection);
        if (selection.start.line !== selection.end.line) {
            const bottomLine = Math.max(selection.start.line, selection.end.line);
            const start = document.lineAt(bottomLine).text.indexOf(document.lineAt(bottomLine).text.trim()[0]);
            editor.selection = new vscode.Selection(bottomLine, start, bottomLine, start);
            return { kind: "COMMAND", subjectName: "LINE" };
        }
        const position = selection.start.isAfter(selection.end) ? selection.start : selection.end;
        outputchannel.appendLine("new selection points after collapseToRight: " + editor.selection.start.line + ", " + editor.selection.start.character); 
        editor.selection = new vscode.Selection(position, position);
        const ret = this.handleWordMode(document, selection);
        const wordDefinition = getWordDefinition();
        outputchannel.appendLine("wordDefinition is: " + wordDefinition);
        if (!wordDefinition) return ret;
        let matches = this.splitByRegex(wordDefinition, text, selection);
        if (matches.length) {
            const [start, end] = matches[matches.length - 1];
            editor.selection = new vscode.Selection(
                new vscode.Position(start.line, Math.floor((start.character + end.character + 1) / 2)),
                new vscode.Position(start.line, Math.floor((start.character + end.character + 1) / 2))
            );
        }
        return ret;
    }
}
    

