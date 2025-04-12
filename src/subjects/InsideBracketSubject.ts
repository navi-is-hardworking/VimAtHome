import * as vscode from "vscode";
import * as selections from "../utils/selectionsAndRanges";
import SubjectBase from "./SubjectBase";
import BracketIO from "../io/BracketIO";
import { getBracketColor } from "../config";
import * as EditorUtils from "../utils/editor"

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
            const document = this.context.editor.document;
            const currentLine = selection.active.line;
            let closestOnCurrentLine: vscode.Range | undefined = undefined;
            let closestDistance = Infinity;
            
            const lineLength = document.lineAt(currentLine).text.length;
            for (let character = 0; character < lineLength; character++) {
                const position = new vscode.Position(currentLine, character);
                const range = this.subjectIO.getContainingObjectAt(document, position);
                
                if (range) {
                    if (range.start.line === currentLine && range.end.line === currentLine) {
                        const startDistance = Math.abs(range.start.character - selection.active.character);
                        const endDistance = Math.abs(range.end.character - selection.active.character);
                        const distance = Math.min(startDistance, endDistance);
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestOnCurrentLine = range;
                        }
                    }
                }
            }
            
            const closestRange = closestOnCurrentLine || this.subjectIO.getClosestObjectTo(document, selection.active);
            if (closestRange && closestRange.start.isEqual(closestRange.end)) {
                return new vscode.Selection(closestRange.start, closestRange.start);
            }
            
            const fixedRange =
                half === "LEFT" && closestRange ? new vscode.Range(closestRange.start, selection.start) :
                half === "RIGHT" && closestRange ? new vscode.Range(selection.end, closestRange.end) :
                closestRange;
                
            if (fixedRange && !fixedRange.isEmpty) {
                return new vscode.Selection(fixedRange.end, fixedRange.start);
            }
            
            return selection;
        });
    }
    
    async firstObjectInScope() {
        await EditorUtils.goToNearestSymbol(this.context.editor, "backwards");
        await EditorUtils.goToEndOfLine(this.context.editor);
        await this.fixSelection();
    }
}
