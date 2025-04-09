import { Config, GetWordWrapColumn, IsWordWrapEnabled } from "./config";
import * as vscode from "vscode";
import { Range } from "vscode";
import { SubjectName } from "./subjects/SubjectName";
import  {outputChannel}  from "./utils/wrapIterator";

export type TextObject = vscode.Range;
export type DirectionOrNearest = Direction | "nearest";
export let lastSkip: Skip | undefined = undefined;
export let column: number = 0;

export let blockCache: vscode.Range[] = [];
export let LazyPassSubjectName: SubjectName | undefined = undefined;

// to avoid triggering managers OnDidSelectionChange which sets decorations and slows things down
export let isTextChanging: boolean = false;

export type SubTextRange = {
    text: string;
    range: { start: number; end: number };
};

export type Change = "greaterThan" | "lessThan";

export const Direction = {
    backwards: "backwards",
    forwards: "forwards",
} as const;

export function OppositeDirection(direction: Direction) {
    return direction === Direction.forwards ? Direction.backwards : Direction.forwards;
}

export type Direction = typeof Direction[keyof typeof Direction];

export const IterationDirection = {
    ...Direction,
    alternate: "alternate",
} as const;

export type IterationDirection =
    typeof IterationDirection[keyof typeof IterationDirection];

export type RelativeIndentation =
    | "more-indentation"
    | "less-indentation"
    | "same-indentation"
    | "no-indentation";

export type IndentationRequest = RelativeIndentation | "any-indentation";

export type JumpPhaseType = "single-phase" | "dual-phase";

export type JumpLocation = {
    jumpCode: string;
    position: vscode.Position;
};

export type Parameter<T> = T extends (arg: infer U) => any ? U : never;

export type ExtensionContext = {
    statusBar: vscode.StatusBarItem;
    config: Config;
    editor: vscode.TextEditor;
};

export type Char = string & { length: 1 };

export function opposite(direction: Direction) {
    return direction === Direction.forwards ? Direction.backwards : Direction.forwards;
}

export function directionToDelta(direction: Direction) {
    return direction === Direction.forwards
        ? (x: number) => x + 1
        : (x: number) => x - 1;
}

export function directionToFactor(direction: Direction) {
    return direction === Direction.forwards ? 1 : -1;
}

export function invert(direction: Direction) {
    return direction === Direction.forwards
        ? Direction.backwards
        : Direction.forwards;
}

export type ColourString = `#${string}`;

export type Skip =
    | {kind: "SkipTo"; char: Char ; subject: SubjectName, direction: Direction;}
    | {kind: "SkipOver"; char?: Char ; subject: SubjectName, direction: Direction;}

export function setLastSkip(skip: Skip | undefined): void {
    lastSkip = skip;
}

export function modifyLastSkip(subject: SubjectName, char: Char): void {
    if (lastSkip === undefined) {
        lastSkip = {
            kind: "SkipTo",
            char: char,
            subject: subject,
            direction: "forwards"
        }
    }
    lastSkip.subject = subject;
    lastSkip.char = char;
}

export function getLastSkip(): Skip | undefined {
    return lastSkip;
}

export function reverseDirection(direction: Direction) {
    return direction === Direction.forwards ? Direction.backwards : Direction.forwards;
}

export function setVirtualColumnNumber(col: number): void {
    column = col;
}

export function getMiddleColumn(range: Range): number {
    return range.start.character + (range.end.character - range.start.character) / 2;
}

export function setVirtualColumn(range: Range): void {
    column = getMiddleColumn(range);
}

export function getVirtualColumn(): number {
    return column;
}

export function cacheBlockRange(range: vscode.Range): void {
    blockCache.push(range);
}

export function popBlockRange(): vscode.Range | undefined {
    return blockCache.pop();
}

export function clearBlockCache(): void {
    blockCache = [];
}

export function setLazyPassSubjectName(subject: SubjectName): void {
    LazyPassSubjectName = subject;
}

export function getLazyPassSubjectName(): SubjectName | undefined {
    return LazyPassSubjectName;
}

export function IsTextChanging(): boolean {
    return isTextChanging;
}

export function SetTextChanging(value: boolean) {
    isTextChanging = value;
}