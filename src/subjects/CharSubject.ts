import CharIO from "../io/CharIO";
import SubjectBase from "./SubjectBase";
import { getCharColor } from "../config";

export default class CharSubject extends SubjectBase {
    protected subjectIO = new CharIO();
    public outlineColour = { 
        dark: `#${getCharColor()}`,
        light: `#${getCharColor()}`,
    } as const;
    public readonly name = "CHAR";
    public readonly displayName = "char";
    public readonly jumpPhaseType = "dual-phase";
}
