import * as vscode from "vscode";
import * as historyCache from "./historyCache";

let outputchannel = vscode.window.createOutputChannel("cacheCommands");

function fuzzyMatch(pattern: string, str: string): { matched: boolean; score: number } {
    const patternLower = pattern.toLowerCase();
    const strLower = str.toLowerCase();
    let score = 0;
    let strIdx = 0;
    for (let patternIdx = 0; patternIdx < patternLower.length; patternIdx++) {
        const char = patternLower[patternIdx];
        const indexInStr = strLower.indexOf(char, strIdx);
        if (indexInStr === -1) {
            return { matched: false, score: 0 };
        }
        score += 1 / (indexInStr - strIdx + 1);
        strIdx = indexInStr + 1;
    }
    return { matched: true, score: score / strLower.length };
}

export const addTextToCache = (text: string) => {
    historyCache.addToCache(text);
};

export const addToCache = (editor: vscode.TextEditor) => {
    const selection = editor.selection;
    const text = editor.document.getText(selection);
    historyCache.addToCache(text);
};

export const parseLines = (text: string) => {
    historyCache.parseToCache(",", text);
}

export const parseToCache = (editor: vscode.TextEditor) => {
    const selection = editor.selection;
    const document = editor.document;

    const isMultiLineSelection = selection.start.line !== selection.end.line;
    const selectedText = isMultiLineSelection
        ? document.getText(selection)
        : document.lineAt(selection.start.line).text;

    const quickPick = vscode.window.createQuickPick();
    quickPick.items = [
        { label: 'i', description: 'Parse subwords' },
        { label: 'o', description: 'Parse words' },
        { label: 'j', description: 'Parse Custom4' },
        { label: 'k', description: 'Parse Custom5' },
        { label: 'l', description: 'Parse Custom6' },
        { label: 'm', description: 'Parse brackets' },
        { label: ',', description: 'Parse line' },
        { label: 'u', description: 'clearCace' }
    ];

    quickPick.onDidChangeValue((value) => {
        if (value.length === 1) {
            quickPick.hide();
            historyCache.parseToCache(value, selectedText);
        }
    });

    quickPick.show();
};

export const pasteFromCache = (editor: vscode.TextEditor) => {
    const items = historyCache.getParsedData();
    const quickPick = vscode.window.createQuickPick();

    quickPick.items = items.slice().map(item => ({ label: item }));
    quickPick.placeholder = "Fuzzy search cached items...";

    quickPick.onDidChangeValue((value) => {
        if (value) {
            const fuzzyResults = items
                .map(item => {
                    const match = fuzzyMatch(value, item);
                    return { item, ...match };
                })
                .filter(result => result.matched)
                .sort((a, b) => b.score - a.score);
                
            quickPick.items = fuzzyResults.map(result => ({ label: result.item }));
        } else {
            quickPick.items = items.slice().map(item => ({ label: item }));
        }
    });

    quickPick.onDidAccept(() => {
        const selectedItem = quickPick.selectedItems[0];
        if (selectedItem) {
            editor.edit(editBuilder => {
                editor.selections.forEach(selection => {
                    editBuilder.replace(selection, selectedItem.label);
                });
            });
        }
        quickPick.hide();
    });

    quickPick.show();
};


export const pasteTop = (editor: vscode.TextEditor) => {
    const items = historyCache.getParsedData();
    if (items.length > 0) {
        editor.edit(editBuilder => {
            editor.selections.forEach(selection => {
                editBuilder.replace(selection, items[0]);
            });
        });
    }
};

export const clearCache = (editor: vscode.TextEditor) => {
    historyCache.clearCache();
}

let copiedLine: string = "";
let copiedBracket: string = "";

export const storeClipboard = (text: string) => {
    if (text === undefined || text.length === 0) return;
    addTextToCache(text);
}

export const copyLine = (text: string) => {
    text = text.trim();
    if (text === "" || text === undefined) return;
    addTextToCache(copiedLine);
    copiedLine = text;
}

export const copyBracket = (text: string) => {
    text = text.trim();
    if (text === "" || text === undefined) return;
    
    let parenStack = [];
    let curlyStack = [];
    let result = "";
    for (let i = 0; i < text.length; i++) {
        if (text[i] === "(") {
            parenStack.push(i);
        } else if (text[i] === "{") {
            curlyStack.push(i);
        } else if (text[i] === ")" && !(parenStack.length === 0)) {
            const tempText = text.substring(parenStack[parenStack.length-1]+1, i);
            parenStack.pop();
            if (tempText.length > result.length) {
                result = tempText;
            }
        } else if (text[i] === "}" && !(curlyStack.length === 0)) {
            const tempText = text.substring(curlyStack[curlyStack.length-1]+1, i);
            curlyStack.pop();
            if (tempText.length > result.length) {
                result = tempText;
            }
        }
    }
    if (result.length > 0) {
        copiedBracket = result;
        addTextToCache(copiedBracket);
    } 
}

export const pasteLine = ()  => {
    return copiedLine; 
}

export const pasteBracket = ()  => {
    return copiedBracket; 
}

let cachedSelection: vscode.Selection | undefined;
export function SetSelectionAnchor(editor: vscode.TextEditor) {
    const selection = editor.selection; 
    if (!selection) return;
    let selectionString: string = editor.document.getText(selection);
    outputchannel.appendLine(`setting anchor ${selectionString}`);
    cachedSelection = selection;
}

export function MergeSelection(cachedSelection: vscode.Selection, selection: vscode.Selection) {
    let newActive = new vscode.Position(
        Math.min(selection.active.line, selection.anchor.line),
        Math.min(selection.active.character, selection.anchor.character)
    );
    let newAnchor = new vscode.Position(
        Math.max(cachedSelection.active.line, cachedSelection.anchor.line),
        Math.max(cachedSelection.active.character, cachedSelection.anchor.character)
    );

    return [newActive, newAnchor]
}

export function SelectFromAnchor(selection: vscode.Selection) {
    if (cachedSelection === undefined || !selection) return; 

    let newActive;
    let newAnchor;
    if (cachedSelection.active.line === selection.anchor.line) {
        newActive = new vscode.Position(
            selection.anchor.line, 
            Math.min(cachedSelection.active.character,
            cachedSelection.anchor.character,
            selection.anchor.character,
            selection.active.character)
        ); 
        newAnchor = new vscode.Position(
            selection.anchor.line, 
            Math.max(cachedSelection.active.character,
            cachedSelection.anchor.character,
            selection.anchor.character,
            selection.active.character)
        ); 
    } else if (selection.active.line < cachedSelection.active.line) {
        [newActive, newAnchor] = MergeSelection(cachedSelection, selection);
    } else {
        let [tempCachedSelection, tempSelection] = [selection, cachedSelection];
        [newActive, newAnchor] = MergeSelection(tempCachedSelection, tempSelection);
    }

    return new vscode.Range(newActive, newAnchor)
}

export function DeleteToAnchor(editor: vscode.TextEditor) {
    if (cachedSelection === undefined) return;
    
    let cachedText = editor.document.getText(cachedSelection);
    outputchannel.appendLine(`deleting to anchor ${cachedText}`);
    
    const newSelection = SelectFromAnchor(editor.selection);
    if (newSelection instanceof vscode.Range) {
        editor.edit(editBuilder => {
            editBuilder.delete(newSelection);
        });
    }
}

export function ClearSelectionAnchor() {
    outputchannel.appendLine("clearing anchor");
    cachedSelection = undefined;
}

let prevText = "";
let carriedSelection = "";
let prevSelection: vscode.Selection;
let selectionChanging = false;

export function StopCarry() {
    carriedSelection = "";
    prevText = "";
}

export function DidSelectionChange(text: string) {
    return text !== prevText;
}

export function IsSelectionChanging() {
    return selectionChanging;
}

export function SetPreviousSelection(selection:vscode.Selection) {
    prevSelection = selection
}

export function SetSelectionChanging(value: boolean) {
    selectionChanging = value;
}

export function Carry(text: string, selection: vscode.Selection) {
    if (IsCarrying()) {
        carriedSelection = "";
        prevText = "";
    } else {
        outputchannel.appendLine(`carried text ${text}`);
        carriedSelection = text;
        prevText = text;
        prevSelection = selection;
    }
}

export async function SwapCarry(newTemp: string, editor: vscode.TextEditor) {
    prevText = newTemp;
    outputchannel.appendLine(`prevText: ${prevText}, prevSelection ${editor.document.getText(prevSelection)}`);
    outputchannel.appendLine(`swapping: ${editor.document.getText(editor.selection)} <-> ${carriedSelection}`);
    await editor.edit(editBuilder => {
        (editBuilder.replace(editor.selection, carriedSelection));
    });
}

export async function RestorePreviousSelection(editor: vscode.TextEditor) {
    outputchannel.appendLine(`prevText: ${prevText}, prevSelection: ${editor.document.getText(prevSelection)}`);
    await editor.edit(editBuilder => {
        if (prevText.length > 0) 
            editBuilder.replace(prevSelection, prevText);
        else {
            editBuilder.delete(prevSelection);
        }
    });
}


export function IsCarrying() {
    return !(carriedSelection.length === 0);
}

export function GetCarry() {
    return carriedSelection;
}

export function GetTempSelection() {
    return prevText;
}




