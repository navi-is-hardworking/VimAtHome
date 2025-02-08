import * as vscode from "vscode";
import SubjectBase from "./SubjectBase";
import BlockIO from "../io/BlockIO";
import { getBlockColor } from "../config";
import * as EditorUtils from "../utils/editor"
import * as lineUtils from "../utils/lines";

export default class BlockSubject extends SubjectBase {
    protected subjectIO = new BlockIO();
    readonly name = "BLOCK";
    readonly displayName = "block";
    public readonly jumpPhaseType = "single-phase";
    public readonly outlineColour = {
        dark: `#${getBlockColor()}`,
        light: `#${getBlockColor()}`,
    } as const;
    
    async firstObjectInScope() {
        await EditorUtils.goToNearestSymbol(this.context.editor, "forwards");
        this.fixSelection();
    }
    
    async lastObjectInScope() {
        let startLine = lineUtils.getNextLineOfChangeOfIndentation(
            "lessThan",
            "backwards",
            this.context.editor.document,
            this.context.editor.document.lineAt(this.context.editor.selection.active.line)
        );
        let endLine = lineUtils.getNextLineOfChangeOfIndentation(
            "lessThan",
            "forwards",
            this.context.editor.document,
            this.context.editor.document.lineAt(this.context.editor.selection.active.line)
        );
        if (startLine && endLine) {
            this.context.editor.selection = new vscode.Selection(
                new vscode.Position(startLine.lineNumber + 1, 0),
                new vscode.Position(endLine.lineNumber - 1, 1000)
            )
        }
        this.fixSelection();
    }
}
