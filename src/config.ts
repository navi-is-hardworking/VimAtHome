
import * as vscode from "vscode";
import { SubjectName } from "./subjects/SubjectName";
import { char } from "./utils/quickMenus";
import { join } from "path";
import * as commands from "./commands";
import type VimAtHomeManager from "./VimAtHomeManager";
import * as common from "./common"
import { addCustomWord } from "./commands";
import { resetSubjectChangeCommands } from "./utils/quickMenus";
import { highlightManager } from "./commands";

export type ColorConfig = {
    char: string;
    subWord: string;
    word: string;
    wordColors: string[];
    line: string;
    block: string;
    bracket: string;
    command: string;
    extend: string;
    insert: string;
}

let colorConfig: ColorConfig;
let wordDefinitions = [] as RegExp[];
let wordKeys: string;
let currentWordDefinition = 0;
let verticalSkipCount = 4;
let customCommandsAdded = 0;

let wordWrapEnabled = false
let wordWrapColumn = 0

export type JumpConfig = {
    characters: string;
};

export type Config = {
    jump: JumpConfig;
    scrollStep: number;
    defaultSubject: SubjectName;
};

export function loadConfig(): Config {
    const config = vscode.workspace.getConfiguration("vimAtHome");
    verticalSkipCount = config.get<number>("verticalSkipCount") || 4;
    colorConfig = {
        char: config.get<string>("color.char") || "ff8000",
        subWord: config.get<string>("color.subWord") || "ff6699",
        word: config.get<string>("color.word") || "964d4d",
        wordColors: [],
        line: config.get<string>("color.line") || "8feb34",
        block: config.get<string>("color.block") || "aba246",
        bracket: config.get<string>("color.bracket") || "9900ff",
        command: config.get<string>("color.command") || "#650000dd",
        extend: config.get<string>("color.extend") || "#006005af",
        insert: config.get<string>("color.insert") || "#00eeff34",
    };
    
    
    const config2 = vscode.workspace.getConfiguration('editor');
    
    let wordWrapConfig = config2.get<string>('wordWrap') || "no";
    if (wordWrapConfig && wordWrapConfig === "wordWrapColumn") {
        wordWrapEnabled = true;
        wordWrapColumn = config2.get<number>('wordWrapColumn') || 500;
    }
    
    wordKeys = config.get<string>("wordKeys", "");
    
    let wordSet = new Set();
    wordSet.add("\\w+");
    for (let i = 1; true; i++) {
        const customRegex = config.get<string>(`customWordRegex${i}`) || null;
        if (customRegex) 
            wordSet.add(customRegex);
        else 
            break;
    }
    wordDefinitions = Array.from(wordSet).map(w => new RegExp(w as string));
    colorConfig.wordColors.push(config.get<string>("color.word") || "ffffff");
    for (let i = 1; i < wordDefinitions.length; i++) {
        colorConfig.wordColors.push(config.get<string>(`color.customWord${i}`) || "ffffff");
    }
    
    resetSubjectChangeCommands()
    commands.popCustomCommands(customCommandsAdded);
    customCommandsAdded = 0;
    
    for (let i = 1; i < wordDefinitions.length; i++) {
        let key = "0"
        if (i - 1 < wordKeys.length) {
            key = wordKeys.charAt(i - 1);
        }
        customCommandsAdded += 1;
        addCustomWord(i, key);
    }

    wordDefinitions[1] = highlightManager.getHighlightRegex();

    
    return {
        jump: config.get<JumpConfig>("jump")!,
        scrollStep: config.get<number>("scrollStep") || 10,
        defaultSubject: config.get<SubjectName>("defaultSubject") ?? "WORD",
    };
}
export function getWordColor(): string { 
    if (currentWordDefinition == -1) {
        return colorConfig.char;
    }

    return colorConfig.wordColors[currentWordDefinition];
}

export function setHighlightRegex(reg: RegExp) {
    wordDefinitions[1] = reg;
}
export function getCharColor(): string { return colorConfig.char; }
export function getSubWordColor(): string { return colorConfig.subWord; }
export function getLineColor(): string { return colorConfig.line; }
export function getBlockColor(): string { return colorConfig.block; }
export function getBracketColor(): string { return colorConfig.bracket; }
export function getCommandColor(): string { return colorConfig.command; }
export function getExtendColor(): string { return colorConfig.extend; }
export function getInsertColor(): string { return colorConfig.insert; }
export function getVerticalSkipCount(): number { return verticalSkipCount; }
export function getWordDefinitionIndex(): number { return currentWordDefinition; }

export function getWordDefinition(includeLineEnds=true): RegExp | undefined { 
    if (!includeLineEnds && currentWordDefinition === 0)
        return undefined;
    if (currentWordDefinition === -1) return /.{1}/;
    return wordDefinitions[currentWordDefinition]; 
}
export function nextWordDefinition(): void {
    currentWordDefinition = (currentWordDefinition + 1) % wordDefinitions.length;
}
export function prevWordDefinition(): void {
    currentWordDefinition -= 1;
    if (currentWordDefinition < 0) currentWordDefinition = wordDefinitions.length - 1;
}

export function setCharDefinition(): void {
    currentWordDefinition = -1;
}

export function setWordDefinition(selection: number): void {
    if (selection >= 0 && selection < wordDefinitions.length)
        currentWordDefinition = selection;
}
export function getWordDefinitionByIndex(index: number): RegExp | undefined {
    if (index == -1) {
        return /.{1}/;
    }
    
    if (index >= 0 && index < wordDefinitions.length) {
        return wordDefinitions[index];
    }
    return undefined;
}

export function IsWordWrapEnabled(): boolean {
    return wordWrapEnabled;
}

export function GetWordWrapColumn(): number {
    return wordWrapColumn;
}
