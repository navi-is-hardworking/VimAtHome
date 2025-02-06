import WordIO from "../io/WordIO";
import SubjectBase from "./SubjectBase";
import { getWordColor } from "../config";

export default class WordSubject extends SubjectBase {
    protected subjectIO = new WordIO();

    public readonly outlineColour = {
        dark: `#${getWordColor()}`,
        light: `#${getWordColor()}`,
    } as const;

    public readonly name = "WORD";
    public readonly displayName = "word";
    public readonly jumpPhaseType = "dual-phase";
    
    
}
