import * as vscode from "vscode";
import * as historyCache from "./historyCache";

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

export const addToCache = (editor: vscode.TextEditor) => {
    const selection = editor.selection;
    const text = editor.document.getText(selection);
    historyCache.addToCache(text);
};

export const parseToCache = (editor: vscode.TextEditor) => {
    const selection = editor.selection;
    const text = editor.document.getText(selection);
    
    const quickPick = vscode.window.createQuickPick();
    quickPick.items = [
        { label: 'a', description: 'Parse subwords' },
        { label: 's', description: 'Parse words' },
        { label: 'd', description: 'Parse WORDS' },
        { label: 'f', description: 'Parse brackets' }
    ];
    quickPick.onDidChangeValue((value) => {
        if (value.length === 1) {
            quickPick.hide();
            switch (value) {
                case 'a':
                    historyCache.parseToCache('sub', text);
                    break;
                case 's':
                    historyCache.parseToCache('word', text);
                    break;
                case 'd':
                    historyCache.parseToCache('WORD', text);
                    break;
                case 'f':
                    historyCache.parseToCache('bracket', text);
                    break;
            }
        }
    });
    quickPick.show();
};

export const pasteFromCache = (editor: vscode.TextEditor) => {
    const items = historyCache.getParsedData();
    const quickPick = vscode.window.createQuickPick();
    quickPick.items = items.map(item => ({ label: item }));
    quickPick.placeholder = "Type to fuzzy search cached items...";

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
            quickPick.items = items.map(item => ({ label: item }));
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