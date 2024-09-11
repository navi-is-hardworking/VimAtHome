import * as vscode from "vscode";
let outputChannel = vscode.window.createOutputChannel("HistoryCache");

class FixedCache {

    capacity: number;
    cache: string[];
    index: number;

    constructor(capactity: number) {
        this.capacity = capactity;
        this.cache = new Array(capactity);
        this.index = 0;
    }
    push(data: string) {
        this.index += 1;
        this.index %= this.capacity;
        this.cache[this.index] = data;
    }
    peek() {
        return this.cache[this.index];
    }
    get(n: number): string {
        if (n > this.capacity || n < 0)
            return "";
        return this.cache[n];
    }
    getList(): string[] {
        let result = new Array(this.capacity);
        let i = 0;
        let j = this.index;
        while (i < this.capacity) {
            result[i] = this.get(j);
            j =- 1;
            if (j < 0)
                j = this.capacity - 1; 
            i += 1;
        }

        return result;
    }
}

let selectionDump = new FixedCache(26);
let parsedList = new FixedCache(26);

export function cacheContent(content: string): void {
    outputChannel.appendLine("attempting to cache content: " + content);
    selectionDump.push(content);
}

export function parseTop(by: string) {

    let top: string = selectionDump.peek();
    outputChannel.appendLine("top = " + top);
    switch (by) {
        case "sub": {
            parseSubwords(top).forEach(item => addToParsedList(item))
            break;
        }
        case "word": {
            parseWords(top).forEach(item => addToParsedList(item))
            break;
        }
        case "WORD": {
            parseWORDS(top).forEach(item => addToParsedList(item.toUpperCase()))
        }
        case "bracket": {
            break;
        }
        default: {
            top.split(by).forEach(item => addToParsedList(item))
            break;
        }
    }
}

export function getParsedData(): string[] {
    return parsedList.getList();
}

function addToParsedList(content: string): void {
    parsedList.push(content);
}

function parseWords(text: string): string[] {
    return [];
}

function parseWORDS(text: string): string[] {
    return text.trim().split(/\s+/);
}

function parseSubwords(text: string): string[] {
    type CharClass = "wordStart" | "wordCont" | "operator" | "whitespace";

    function getCharClass(char: string): CharClass {
        if (char.match(/[a-z0-9]/)) return "wordCont";
        if (char.match(/[A-Z]/)) return "wordStart";
        if (char.match(/\s/)) return "whitespace";
        return "operator";
    }

    const subwords = new Set<string>();
    // const subwords: string[] = [];
    let currentWord = "";
    let prevCharClass: CharClass | undefined = undefined;

    for (const char of text) {
        const charClass = getCharClass(char);

        if (
            currentWord === "" ||
            prevCharClass === charClass ||
            (prevCharClass === "wordStart" && charClass === "wordCont")
        ) {
            currentWord += char;
        } else {
            if (currentWord && currentWord.length > 1) subwords.add(currentWord);
            currentWord = char;
        }

        prevCharClass = charClass;
    }

    if (currentWord && currentWord.length > 1) subwords.add(currentWord);

    let result = Array.from(subwords);
    outputChannel.appendLine("subwords: " + JSON.stringify(result));
    return Array.from(result);
}

