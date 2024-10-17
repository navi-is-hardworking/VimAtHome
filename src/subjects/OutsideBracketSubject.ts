import SubjectBase from "./SubjectBase";
import BracketIO from "../io/BracketIO";
import { getBracketColor } from "../config";

export default class OutsideBracketSubject extends SubjectBase {
    protected subjectIO = new BracketIO(true);
    public readonly outlineColour = {
        dark: `#${getBracketColor()}`,
        light: `#${getBracketColor()}`,
    } as const;
    readonly name = "BRACKETS_INCLUSIVE";
    public readonly displayName = "outside brackets";
    public readonly jumpPhaseType = "single-phase";
}
