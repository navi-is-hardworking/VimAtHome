import * as vscode from "vscode";
import * as config from "./config";

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
        data = data.trim();
        if (data.length <= 2) {
            outputChannel.appendLine("data: " + data + " is too short, not pushing");
            return;
        }
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

    clear(): void {
        this.cache = [];
    }
}

const fixedSize = 40;
let parsedCache = new FixedCache(fixedSize);

function safeRegexMatch(text: string, regex: RegExp | undefined, patternName: string): string[] {
    if (!regex) {
        outputChannel.appendLine(`No regex pattern found for ${patternName}`);
        return [];
    }

    try {
        const globalRegex = new RegExp(regex.source, 'g');
        outputChannel.appendLine(`Using regex pattern for ${patternName}: ${globalRegex.source}`);
        
        let matches: string[] = [];
        let match;
        
        while ((match = globalRegex.exec(text)) !== null) {
            if (match[0] && match[0].trim()) {
                matches.push(match[0].trim());
            }
            
            if (match.index === globalRegex.lastIndex) {
                globalRegex.lastIndex++;
            }
        }
        
        outputChannel.appendLine(`Found ${matches.length} matches for ${patternName}`);
        return matches;
    } catch (error) {
        outputChannel.appendLine(`Error with ${patternName} regex: ${error}`);
        return [];
    }
}

export function parseToCache(by: string, content: string) {
    let parsed: string[] = [];

    try {
        switch (by) {
            case "i":
                parsed = parseSubwords(content);
                break;
            case "o":
                parsed = parseWords(content);
                break;
            case "j": {
                const regex = config.getWordDefinitionByIndex(4);
                outputChannel.appendLine("Attempting pattern 4 (bigword)");
                parsed = safeRegexMatch(content, regex, "bigword");
            }
            break;
            case "k": {
                const regex = config.getWordDefinitionByIndex(5);
                outputChannel.appendLine("Attempting pattern 5 (identifier)");
                parsed = safeRegexMatch(content, regex, "identifier");
            }
            break;
            case "l": {
                const regex = config.getWordDefinitionByIndex(6);
                outputChannel.appendLine("Attempting pattern 6 (quoted)");
                parsed = safeRegexMatch(content, regex, "quoted");
            }
            break;
            case "m":
                parsed = parseBrackets(content);
                break;
            case ",":
                parsed = content.split("\n").map(item => item.trim()).filter(item => item.length > 0);
                break;
            case "u":
                parsedCache.clear();
                return;
            default:
                parsed = content.split(by).map(item => item.trim()).filter(item => item.length > 0);
        }

        parsed.forEach(item => {
            if (item && item.trim()) {
                parsedCache.push(item);
            }
        });
    } catch (error) {
        outputChannel.appendLine(`Error in parseToCache: ${error}`);
    }
}

export function addToCache(content: string): void {
    parsedCache.push(content);
}

export function getParsedData(): string[] {
    return parsedCache.getList();
}

function parseWords(text: string): string[] {
    return text.match(/\w+/g) || [];
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

export function clearCache(): void {
    parsedCache.clear();
}