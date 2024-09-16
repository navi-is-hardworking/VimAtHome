import * as vscode from "vscode";
import * as common from "../common";
import ExtendMode from "./ExtendMode";
import { EditorMode, EditorModeChangeRequest } from "./modes";
import CommandMode from "./CommandMode";
import * as subjects from "../subjects/subjects";
import { SubjectName } from "../subjects/SubjectName";
import JumpInterface from "../handlers/JumpInterface";
import { getCommandColor, setSelectionBackground } from "../config";

export default class InsertMode extends EditorMode {
    private keySequenceStarted: boolean = false;
    readonly cursorStyle = vscode.TextEditorCursorStyle.Line;
    readonly lineNumberStyle = vscode.TextEditorLineNumbersStyle.On;
    readonly decorationType = undefined;
    readonly decorationTypeTop = undefined;
    readonly decorationTypeMid = undefined;
    readonly decorationTypeBottom = undefined;
    readonly name = "INSERT";
    readonly statusBarText = "Insert";

    constructor(
        private readonly context: common.ExtensionContext,
        private previousNavigateMode: CommandMode
    ) {
        // setSelectionBackground(getCommandColor());
        super();
    }

    equals(previousMode: EditorMode): boolean {
        return (
            previousMode instanceof InsertMode &&
            previousMode.keySequenceStarted === this.keySequenceStarted
        );
    }

    async changeTo(newMode: EditorModeChangeRequest): Promise<EditorMode> {
        switch (newMode.kind) {
            case "INSERT":
                return this;
            case "EXTEND":
                return new ExtendMode(this.context, this.previousNavigateMode);

            case "COMMAND":
                if (!newMode.subjectName) {
                    return this.previousNavigateMode;
                } else {
                    const subject = subjects.createFrom(
                        this.context,
                        newMode.subjectName
                    );

                    return new CommandMode(this.context, subject);
                }
        }
    }

    async executeSubjectCommand() {}
    async repeatLastSkip(direction: common.Direction): Promise<void> {
        // outputchannel.appendLine("repeatLastSkip");
        const lastSkip = common.getLastSkip();
        if (!lastSkip) {
            return;
        }
        // outputchannel.appendLine(`lastSkip: ${lastSkip.char}`);
        // outputchannel.appendLine(`lastSkip: ${lastSkip.subject}`);
        // outputchannel.appendLine(`lastSkip: ${lastSkip.kind}`);
        // if (this.subject.name !== lastSkip.subject) {
        const skipSubject = lastSkip.subject.charAt(0).toUpperCase() + lastSkip.subject.slice(1).toLowerCase();
        const tempCommandMode = new CommandMode(this.context, subjects.createFrom(this.context, lastSkip.subject));
        await vscode.commands.executeCommand(`codeFlea.changeTo${skipSubject}Subject`);
        // }

        let lastDirection = lastSkip.direction;
        if (direction === "backwards") {
            lastDirection = common.reverseDirection(lastDirection);
        }

        await tempCommandMode.repeatLastSkip(lastDirection);
        // await tempCommandMode.skip(lastDirection);
    }
    async skip() {}
    async skipOver() {}
    async jump() {}
    
    async jumpToSubject(subjectName: SubjectName): Promise<EditorMode | undefined> {
        const tempCommandMode = new CommandMode(this.context, subjects.createFrom(this.context, subjectName));
        const result = await tempCommandMode.jumpToSubject(subjectName);
        if (result) {
            // Preserve the cursor position after jump
            const jumpPosition = this.context.editor.selection.active;
            this.context.editor.selection = new vscode.Selection(jumpPosition, jumpPosition);
            return this;  // Stay in insert mode after jump
        }
        return undefined;
    }
    
    async pullSubject(subjectName: SubjectName) {
        const tempSubject = subjects.createFrom(this.context, subjectName);

        const jumpLocations = tempSubject
            .iterAll(
                common.IterationDirection.alternate,
                this.context.editor.visibleRanges[0]
            )
            .map((range) => range.start);

        const jumpInterface = new JumpInterface(this.context);

        const jumpPosition = await jumpInterface.jump({
            kind: tempSubject.jumpPhaseType,
            locations: jumpLocations,
        });

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
    
    getSubjectName(): SubjectName | undefined {
        return undefined;
    }

    async zoomJump(): Promise<vscode.Position | undefined> {
        // const jumpLocations = subjects.getJumpLocations(this.context);

        // const jumpInterface = new JumpInterface(this.context);

        // return await jumpInterface.zoomJump({
        //     locations: jumpLocations,
        // });
        return undefined;
    }
}
