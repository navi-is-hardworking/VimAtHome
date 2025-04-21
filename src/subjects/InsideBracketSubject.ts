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
                selection.start,
            );

            const endRange = this.subjectIO.getContainingObjectAt(
                this.context.editor.document,
                selection.end
            );

            const fixedRange =
                // happening here because it sees a right bracket first
                half === "LEFT"  && startRange ? new vscode.Range(startRange.start, selection.start) :
                half === "RIGHT" && endRange ? new vscode.Range(selection.end, endRange.end) :
                startRange && endRange
                    ? startRange.union(endRange)
                    : startRange
                    ? startRange
                    : endRange;

            if (fixedRange && !fixedRange.isEmpty) {
                return new vscode.Selection(fixedRange.end, fixedRange.start);
            }

            return this.subjectIO.getClosestObjectTo(
                this.context.editor.document,
                selection.start
            );
        });
    }
    
    async firstObjectInScope() {
        await EditorUtils.goToNearestSymbol(this.context.editor, "backwards");
        await EditorUtils.goToEndOfLine(this.context.editor);
        await this.fixSelection();
    }
}
