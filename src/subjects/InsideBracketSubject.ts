import * as vscode from "vscode";
import * as selections from "../utils/selectionsAndRanges";
import SubjectBase from "./SubjectBase";
import BracketIO from "../io/BracketIO";
import { getBracketColor } from "../config";
import * as EditorUtils from "../utils/editor"
import { Direction, TextObject } from "../common";

export default class InsideBracketSubject extends SubjectBase {
    protected subjectIO = new BracketIO(false);
    public outlineColour = { 
        dark: `#${getBracketColor()}`,
        light: `#${getBracketColor()}`,
    } as const;
    readonly name = "BRACKETS";
    public readonly displayName = "inside brackets";
    public readonly jumpPhaseType = "single-phase";
    
    async fixSelection(half?: "LEFT" | "RIGHT"): Promise<void> {
        selections.tryMap(this.context.editor, (selection) => {
            if (!half) {
                const startRange = this.subjectIO.getContainingObjectAt(
                    this.context.editor.document,
                    selection.start
                );
                if (startRange) {
                    return new vscode.Selection(startRange.end, startRange.start);
                }
            }
            else if (half === "LEFT") {
                const startRange = this.subjectIO.getContainingObjectAt(
                    this.context.editor.document,
                    selection.start
                );
                let fixedRange = undefined;
                if (startRange) {
                    fixedRange = new vscode.Range(startRange.start, selection.start)
                }
                if (fixedRange && !fixedRange.isEmpty) {
                    return new vscode.Selection(fixedRange.end, fixedRange.start);
                }
            }
            else if (half === "RIGHT") {
                const endRange = this.subjectIO.getContainingObjectAt(
                    this.context.editor.document,
                    selection.end
                );
                let fixedRange = undefined;
                if (endRange)
                    fixedRange = new vscode.Range(selection.end, endRange.end)
                if (fixedRange && !fixedRange.isEmpty) {
                    return new vscode.Selection(fixedRange.end, fixedRange.start);
                }
            }
        });
        
    }
    
    async firstObjectInScope() {
        await EditorUtils.goToNearestSymbol(this.context.editor, "backwards");
        await EditorUtils.goToEndOfLine(this.context.editor);
        await this.fixSelection();
    }
}
