import WordIO from "../io/WordIO";
import SubjectBase from "./SubjectBase";
import { getWordColor } from "../config";
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
