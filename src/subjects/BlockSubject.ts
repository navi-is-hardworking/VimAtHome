import SubjectBase from "./SubjectBase";
import BlockIO from "../io/BlockIO";
import { getBlockColor } from "../config";

export default class BlockSubject extends SubjectBase {
    protected subjectIO = new BlockIO();
    readonly name = "BLOCK";
    readonly displayName = "block";
    public readonly jumpPhaseType = "single-phase";
    public readonly outlineColour = {
        dark: `#${getBlockColor()}`,
        light: `#${getBlockColor()}`,
    } as const;
}
