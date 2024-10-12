import * as vscode from "vscode";

let outputChannel = vscode.window.createOutputChannel("HistoryCache");

class FixedCache {
    private capacity: number;
    private cache: string[];
    private index: number;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = [];
        this.index = -1;
    }

    push(data: string) {
        // Remove duplicates
        const existingIndex = this.cache.indexOf(data);
        if (existingIndex !== -1) {
            this.cache.splice(existingIndex, 1);
        }

        if (this.cache.length < this.capacity) {
            this.cache.unshift(data);
            this.index = 0;
        } else {
            this.cache.pop();
            this.cache.unshift(data);
        }
    }

    peek(): string {
        return this.cache[0] || "";
    }

    getList(): string[] {
        return [...this.cache];
    }
}

const fixedSize = 26;
let parsedList = new FixedCache(fixedSize);

export function addToCache(content: string): void {
    outputChannel.appendLine("Adding to cache: " + content);
    parsedList.push(content);
}

export function parseToCache(by: string, content: string) {
    outputChannel.appendLine("Parsing to cache: " + content + " by " + by);

    let parsed: string[];
    switch (by) {
        case "sub":
            parsed = parseSubwords(content);
            break;
        case "word":
            parsed = parseWords(content);
            break;
        case "WORD":
            parsed = parseWORDS(content);
            break;
        case "bracket":
            parsed = parseBrackets(content);
            break;
        default:
            parsed = content.split(by).map(item => item.trim()).filter(item => item.length > 0);
    }

    parsed.forEach(item => parsedList.push(item));
    outputChannel.appendLine("Parsed list: " + JSON.stringify(parsedList.getList()));
}

export function getParsedData(): string[] {
    return parsedList.getList();
}

function parseWords(text: string): string[] {
    return text.match(/\w+/g) || [];
}

function parseWORDS(text: string): string[] {
    return text.match(/\S+/g) || [];
}

function parseSubwords(text: string): string[] {
    const subwords = new Set<string>();
    const regex = /[A-Z]?[a-z]+|[A-Z]+(?=[A-Z][a-z]|\d|\W|$)|\d+/g;
    const matches = text.match(regex) || [];
    matches.forEach(match => subwords.add(match));
    return Array.from(subwords);
}

function parseBrackets(text: string): string[] {
    const bracketContents: string[] = [];
    const stack: string[] = [];
    const brackets: Record<string, string> = {
        '(': ')',
        '{': '}',
        '[': ']',
        '<': '>',
    };

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (Object.keys(brackets).includes(char)) {
            stack.push(char);
        } else if (Object.values(brackets).includes(char)) {
            if (stack.length === 0) continue;
            const lastBracket = stack.pop();
            const expectedClosing = lastBracket ? brackets[lastBracket] : '';

            if (char === expectedClosing) {
                const contentStart = text.lastIndexOf(lastBracket!, i);
                const content = text.substring(contentStart + 1, i).trim();
                if (content.length > 0) {
                    bracketContents.push(content);
                }
            }
        }
    }

    return bracketContents;
}