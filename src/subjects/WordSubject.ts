import WordIO from "../io/WordIO";
import SubjectBase from "./SubjectBase";
import { getWordColor } from "../config";
import * as selections from "../utils/selectionsAndRanges";
import * as vscode from "vscode";
import { Char, Direction, TextObject } from "../common";
import * as editor from "../utils/editor";

export default class WordSubject extends SubjectBase {
    protected subjectIO = new WordIO();

    public readonly outlineColour = {
        dark: `#${getWordColor()}`,
        light: `#${getWordColor()}`,
    } as const;

    public readonly name = "WORD";
    public readonly displayName = "word";
    public readonly jumpPhaseType = "dual-phase";
    
    // async nextObjectDown(virtualColumn = true) {
    //     // selections.tryMap(this.context.editor, (selection) =>
    //     //     this.subjectIO
    //     //         .iterVertically(this.context.editor.document, {
    //     //             startingPosition: selection,
    //     //             direction: Direction.forwards,
    //     //             virtualColumn: virtualColumn,
    //     //         })
    //     //         .tryFirst()
    //     // );
    //     await vscode.commands.executeCommand("cursorDown");
    //     await this.fixSelection();
    // }
    
    // async nextObjectUp(virtualColumn = true) {
    //     // selections.tryMap(this.context.editor, (selection) =>
    //     //     this.subjectIO
    //     //         .iterVertically(this.context.editor.document, {
    //     //             startingPosition: selection,
    //     //             direction: Direction.backwards,
    //     //             virtualColumn: virtualColumn
    //     //         })
    //     //         .tryFirst()
    //     // );
        
    //     await vscode.commands.executeCommand("cursorUp");
    //     await this.fixSelection();
    // }

    // async fixSelection(half?: "LEFT" | "RIGHT"): Promise<void> {
    //     selections.tryMap(this.context.editor, (selection) => {
    //         const startRange = this.subjectIO.getContainingObjectAt(
    //             this.context.editor.document,
    //             selection.start
    //         );

    //         const endRange = this.subjectIO.getContainingObjectAt(
    //             this.context.editor.document,
    //             selection.end
    //         );
            
    //         const fixedRange =
    //             half === "LEFT"  && startRange ? new vscode.Range(startRange.start, selection.start) :
    //             half === "RIGHT" && endRange ? new vscode.Range(selection.end, endRange.end) :
    //             startRange && endRange
    //                 ? startRange.union(endRange)
    //                 : startRange
    //                 ? startRange
    //                 : endRange;

    //         if (fixedRange && !fixedRange.isEmpty) {
    //             return new vscode.Selection(fixedRange.end, fixedRange.start);
    //         }

    //         return this.subjectIO.getClosestObjectTo(
    //             this.context.editor.document,
    //             selection.start,
    //         );
    //     });
    // }
    
    // async swapHorizontally(
    //     document: vscode.TextDocument,
    //     edit: vscode.TextEditorEdit,
    //     currentObject: TextObject,
    //     direction: Direction
    // ): TextObject {
    //     await next
        
    //     editor.swap(document, edit, currentObject, nextObject);

    //     return nextObject;
    // }
    

    // async firstObjectInScope() {
    //     common.SetTextChanging(true);
    //     await this.nextObjectLeft();
    //     await EditorUtils.findNextWhitespace(this.context.editor, "backwards");
    //     this.fixSelection();
    //     common.SetTextChanging(false);
    // }
    
    // async lastObjectInScope() {
    //     common.SetTextChanging(true);
    //     await this.nextObjectRight();
    //     await EditorUtils.findNextWhitespace(this.context.editor, "forwards");
    //     this.fixSelection();
    //     common.SetTextChanging(false);
    // }
    
    
}
