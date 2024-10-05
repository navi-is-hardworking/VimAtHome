import * as vscode from "vscode";

// Create an output channel for debugging purposes
let outputChannel = vscode.window.createOutputChannel("HistoryCache");

// FixedCache class implementing a fixed-size circular buffer
class FixedCache {
    capacity: number;
    cache: string[];
    index: number;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Array(capacity).fill(""); // Initialize with empty strings
        this.index = -1; // Start at -1 since no items are added yet
    }

    push(data: string) {
        this.index = (this.index + 1) % this.capacity;
        this.cache[this.index] = data;
    }

    peek(): string {
        if (this.index === -1) return "";
        return this.cache[this.index];
    }

    get(n: number): string {
        if (n >= this.capacity || n < 0) return "";
        // Calculate the correct index in a circular manner
        let idx = (this.index - n + this.capacity) % this.capacity;
        return this.cache[idx];
    }

    getList(): string[] {
        let result: string[] = [];
        for (let i = 0; i < this.capacity; i++) {
            const item = this.get(i);
            if (item) { // Exclude empty entries
                result.push(item);
            }
        }
        return result;
    }
}

const fixedSize = 26;
let selectionDump = new FixedCache(fixedSize);
let parsedList = new FixedCache(fixedSize);

// Function to cache the content
export function cacheContent(content: string): void {
    outputChannel.appendLine("Attempting to cache content: " + content);
    selectionDump.push(content);

    // Optional: Log the current cache state
    /*
    for (let i = 0; i < fixedSize; i++) {
        outputChannel.appendLine(`cache[${i}] = ${selectionDump.get(i)}`);
    }
    */
}

// Function to parse the top cached selection based on the provided method
export function parseTop(by: string) {
    let top: string = selectionDump.peek();
    outputChannel.appendLine("Top = " + top);

    if (!top) {
        outputChannel.appendLine("No content to parse.");
        return;
    }

    switch (by) {
        case "sub": {
            const subwords = parseSubwords(top);
            subwords.forEach(item => addToParsedList(item));
            break;
        }
        case "word": {
            const words = parseWords(top);
            words.forEach(item => addToParsedList(item));
            break;
        }
        case "WORD": {
            const WORDS = parseWORDS(top);
            WORDS.forEach(item => addToParsedList(item));
            break;
        }
        case "bracket": {
            const brackets = parseBrackets(top);
            brackets.forEach(item => addToParsedList(item));
            break;
        }
        default: {
            const splitItems = top.split(by).map(item => item.trim()).filter(item => item.length > 0);
            splitItems.forEach(item => addToParsedList(item));
            break;
        }
    }

    outputChannel.appendLine("New parsed list = " + JSON.stringify(parsedList.getList()));
}

export function getParsedData(): string[] {
    return parsedList.getList();
}

function addToParsedList(content: string): void {
    parsedList.push(content);
}

// Fix this, should return a list of \w+ words
function parseWords(text: string): string[] {
    
    return text.trim().split(/\s+/).filter(word => word.length > 0);
}

// Fix this, should return a list words defined as not whitespace
function parseWORDS(text: string): string[] {
    return text.trim().split(/\s+/).filter(word => word.length > 0);
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
            if (currentWord.length > 1) subwords.add(currentWord);
            currentWord = char;
        }

        prevCharClass = charClass;
    }

    if (currentWord.length > 1) subwords.add(currentWord);

    return Array.from(subwords);
}

type Bracket = '(' | '{' | '[' | '<';

function parseBrackets(text: string): string[] {
    const bracketContents: string[] = [];
    const stack: Bracket[] = [];
    const brackets: Record<Bracket, string> = {
        '(': ')',
        '{': '}',
        '[': ']',
        '<': '>',
    };

    for (let i = 0; i < text.length; i++) {
        const char = text[i] as string;

        if (Object.keys(brackets).includes(char)) {
            stack.push(char as Bracket);
        } else if (Object.values(brackets).includes(char)) {
            if (stack.length === 0) continue;
            const lastBracket = stack.pop();
            const expectedClosing = lastBracket ? brackets[lastBracket] : '';

            if (char === expectedClosing) {
                const contentStart = i - stack.length; // Adjusted to current position

                const content = text.substring(contentStart, i).trim();
                if (content.length > 0) {
                    bracketContents.push(content);
                }
            }
        }
    }

    return bracketContents;
}
