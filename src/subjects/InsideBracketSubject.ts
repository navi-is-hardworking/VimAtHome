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
    
    async firstObjectInScope() {
        await EditorUtils.goToNearestSymbol(this.context.editor, "backwards");
        await EditorUtils.goToEndOfLine(this.context.editor);
        await this.fixSelection();
    }
}
