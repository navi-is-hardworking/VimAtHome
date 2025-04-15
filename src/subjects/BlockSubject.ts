import * as vscode from "vscode";
import SubjectBase from "./SubjectBase";
import BlockIO from "../io/BlockIO";
import { getBlockColor } from "../config";
import * as EditorUtils from "../utils/editor"
import * as lineUtils from "../utils/lines";
import { swapVertically } from "../io/WordIO";

export default class BlockSubject extends SubjectBase {
    protected subjectIO = new BlockIO();
    readonly name = "BLOCK";
    readonly displayName = "block";
    public readonly jumpPhaseType = "single-phase";
    public readonly outlineColour = {
        dark: `#${getBlockColor()}`,
        light: `#${getBlockColor()}`,
    } as const;
    
    // first block in scope is not usefull, so this command will just be to select the whole function
    async firstObjectInScope() {
        // maybe change keep iterating prev until found whitepace above start line?
        await EditorUtils.goToNearestSymbol(this.context.editor, "backwards");
        this.fixSelection();
    }
    
    async swapWithObjectToLeft(): Promise<void> {
        await this.swapWithObjectAbove();
    }
    
    async swapWithObjectToRight(): Promise<void> {
        await this.swapWithObjectBelow();
    }
    
    // last block in scope is not usefull, so this command will just be to select all blocks on indentation level
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
                new vscode.Position(endLine.lineNumber - 1, this.context.editor.document.lineAt(endLine.lineNumber-1).text.length)
            )
        }
        
        // this.fixSelection();
    }
}
