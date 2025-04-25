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
            const startRange = this.subjectIO.getContainingObjectAt(
                this.context.editor.document,
                selection.start
            );
            
            if (startRange) {
                return new vscode.Selection(startRange.end, startRange.start);
            }
        });
    }
    
    async firstObjectInScope() {
        await EditorUtils.goToNearestSymbol(this.context.editor, "backwards");
        await EditorUtils.goToEndOfLine(this.context.editor);
        await this.fixSelection();
    }
}
