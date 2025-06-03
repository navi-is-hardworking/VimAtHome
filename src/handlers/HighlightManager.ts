import * as vscode from 'vscode';
import * as path from 'path';
import { setHighlightRegex } from "../config";
import { runInThisContext } from 'vm';
import * as EditorUtils from "../utils/editor"

export class HighlightManager {
    private highlightDecorationType: vscode.TextEditorDecorationType;
    private highlightedWords: Map<number, string> = new Map();
    private highlightedIndexs: Map<string, number> = new Map();
    private disposables: vscode.Disposable[] = [];

    constructor() {
        this.highlightDecorationType = vscode.window.createTextEditorDecorationType({
            textDecoration: 'underline yellow',
        });
        
        this.disposables.push(
            vscode.window.onDidChangeActiveTextEditor(() => this.updateHighlights())
        );
        
        this.disposables.push(
            vscode.workspace.onDidChangeTextDocument(() => this.updateHighlights())
        );
    }
    
    public async addHighlight() {
        const word = await vscode.window.showInputBox({
            prompt: 'Enter text to highlight',
            placeHolder: 'Text to highlight'
        });
        
        if (word) {
            const index = this.getNextAvailableIndex();
            if (index !== -1) {
                this.highlightedWords.set(index, word);
                this.updateHighlights();
            } 
        }
    }
    
    public doesHighlightExist(word: string): boolean {
        if (word) {
            let existingIndex: number | undefined;
            for (const [index, existingWord] of this.highlightedWords) {
                if (existingWord === word) {
                    existingIndex = index;
                    return true;
                }
            }
        }
        return false;
    }
    
    public addSelectionAsHighlight(word: string): boolean {
        console.log(`if word: ${word}`);
        if (word) {
            console.log(`processing word: ${word}`);
            let existingIndex: number | undefined;
            for (const [index, existingWord] of this.highlightedWords) {
                if (existingWord === word) {
                    existingIndex = index;
                    break;
                }
            }
            
            if (existingIndex !== undefined) {
                console.log(`deleting word: ${word}`);
                this.highlightedWords.delete(existingIndex);
                return false;
            } else {
                console.log(`adding word: ${word}`);
                const index = this.getNextAvailableIndex();
                if (index !== -1) {
                    this.highlightedWords.set(index, word);
                }
                console.log(`new set: ${this.highlightedWords.size}`);
            }
        }
        return true;
    }
    
    public async manageHighlights() {
        const quickPick = vscode.window.createQuickPick();
        quickPick.items = [
            { label: '0', description: 'Clear all highlights' },
            ...Array.from(this.highlightedWords.entries()).map(([index, word]) => ({
                label: index.toString(),
                description: `Delete: ${word}`
            }))
        ];
        quickPick.placeholder = 'Select an action (0 to clear all, 1-9 to delete specific highlight)';
        
        quickPick.onDidChangeValue(value => {
            const num = parseInt(value);
            if (!isNaN(num) && num >= 0 && num <= 9) {
                quickPick.hide();
                if (num === 0) {
                    this.clearAllHighlights();
                } else {
                    this.removeHighlight(num);
                }
            }
        });
        
        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
    }
    
    public clearAllHighlights() {
        this.highlightedWords.clear();
        this.updateHighlights();
    }
    
    private removeHighlight(index: number) {
        const word = this.highlightedWords.get(index);
        if (word) {
            this.highlightedWords.delete(index);
            this.updateHighlights();
        }
    }
    
    private getNextAvailableIndex(): number {
        for (let i = 1; i <= 9; i++) {
            if (!this.highlightedWords.has(i)) {
                return i;
            }
        }
        return -1;
    }
    
    public updateHighlights() {
        vscode.window.visibleTextEditors.forEach(editor => {
            const text = editor.document.getText();
            const ranges: vscode.Range[] = [];
            
            this.highlightedWords.forEach((word, index) => {
                // Changed from 'gi' to 'g' to make it case sensitive
                const regex = new RegExp(this.escapeRegExp(word), 'g');
                let match;
                while ((match = regex.exec(text))) {
                    const startPos = editor.document.positionAt(match.index);
                    const endPos = editor.document.positionAt(match.index + match[0].length);
                    ranges.push(new vscode.Range(startPos, endPos));
                }
            });
            
            editor.setDecorations(this.highlightDecorationType, ranges);
        });

        setHighlightRegex(this.getHighlightRegex());
    }

    private escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    public dispose() {
        this.disposables.forEach(d => d.dispose());
    }
    
    public countHighlights() {
        return this.highlightedWords.size;
    }

    public getHighlightRegex(): RegExp {
        const escapedWords = Array.from(this.highlightedWords.values())
            .map(word => this.escapeRegExp(word));
        const regString = escapedWords.join("|");
        if (regString.length === 0) {
            return new RegExp("");
        }
        return new RegExp(regString);
    }
    
    public async FindAll(blockSize: number) {
        if (this.highlightedWords.size === 0) {
            vscode.window.showInformationMessage('No highlighted terms to search for.');
            return;
        }

        const activeEditor = vscode.window.activeTextEditor;
        const cursorPosition = activeEditor?.selection.active;
        const activeDocumentUri = activeEditor?.document.uri;

        const highlightedTerms = Array.from(this.highlightedWords.values());
        const allResults: Array<{
            document: vscode.TextDocument;
            range: vscode.Range;
            text: string;
            distanceToCursor: number;
        }> = [];
        
        for (const tabGroup of vscode.window.tabGroups.all) {
            for (const tab of tabGroup.tabs) {
                if (tab.input instanceof vscode.TabInputText) {
                    let document = await vscode.workspace.openTextDocument(tab.input.uri);
                    const text = document.getText();
                    let allOccurrences: Array<{
                        term: string;
                        startPos: vscode.Position;
                        endPos: vscode.Position;
                    }> = [];
                    
                    const termPatterns = highlightedTerms.map(term => `\\b${this.escapeRegExp(term)}\\b`);
                    const combinedRegex = new RegExp(`(${termPatterns.join('|')})`, 'g');
                    
                    let match;
                    while ((match = combinedRegex.exec(text)) !== null) {
                        const matchedText = match[0];
                        const startPos = document.positionAt(match.index);
                        const endPos = document.positionAt(match.index + matchedText.length);
                        
                        for (const term of highlightedTerms) {
                            if (term === matchedText) {
                                allOccurrences.push({
                                    term: term,
                                    startPos: startPos,
                                    endPos: endPos
                                });
                                break;
                            }
                        }
                    }
                    
                    if (allOccurrences.length === 0) {
                        continue;
                    }
                    
                    let windowStart = 0;
                    let windowEnd = 0;
                    let termCounts = new Map<string, number>();
                    let distinctTermCount = 0;
                    
                    if (windowStart < allOccurrences.length) {
                        termCounts.set(allOccurrences[0].term, 1);
                        distinctTermCount = 1;
                    }
                    
                    while (windowStart < allOccurrences.length) {
                        const startLine = allOccurrences[windowStart].startPos.line;
                        const maxEndLine = startLine + blockSize - 1;
                        
                        while (windowEnd + 1 < allOccurrences.length && 
                            distinctTermCount < highlightedTerms.length && 
                            allOccurrences[windowEnd + 1].startPos.line <= maxEndLine) {
                            windowEnd++;
                            const term = allOccurrences[windowEnd].term;
                            const count = termCounts.get(term) || 0;
                            
                            if (count === 0) {
                                distinctTermCount++;
                            }
                            
                            termCounts.set(term, count + 1);
                        }
                        
                        while (windowEnd + 1 < allOccurrences.length && 
                            allOccurrences[windowEnd + 1].startPos.line <= maxEndLine) {
                            windowEnd++;
                            const term = allOccurrences[windowEnd].term;
                            const count = termCounts.get(term) || 0;
                            termCounts.set(term, count + 1);
                        }
                        
                        if (distinctTermCount === highlightedTerms.length) {
                            const range = new vscode.Range(
                                allOccurrences[windowStart].startPos,
                                allOccurrences[windowEnd].endPos
                            );
                            
                            let distanceToCursor = Number.MAX_SAFE_INTEGER;
                            if (activeDocumentUri && cursorPosition && 
                                document.uri.toString() === activeDocumentUri.toString()) {
                                distanceToCursor = Math.abs(range.start.line - cursorPosition.line);
                            }
                            
                            allResults.push({
                                document: document,
                                range: range,
                                text: document.getText(range),
                                distanceToCursor: distanceToCursor
                            });
                            
                            const lastWindowEnd = windowEnd;
                            
                            while (windowStart <= lastWindowEnd) {
                                const term = allOccurrences[windowStart].term;
                                const count = termCounts.get(term) || 0;
                                termCounts.set(term, count - 1);
                                
                                if (count === 1) {
                                    distinctTermCount--;
                                }
                                windowStart++;
                            }
                            
                            if (windowEnd < windowStart) {
                                windowEnd = windowStart;
                                
                                if (windowStart < allOccurrences.length) {
                                    const term = allOccurrences[windowStart].term;
                                    termCounts.set(term, 1);
                                    distinctTermCount = 1;
                                }
                            }
                        } else {
                            const term = allOccurrences[windowStart].term;
                            const count = termCounts.get(term) || 0;
                            termCounts.set(term, count - 1);
                            if (count === 1) {
                                distinctTermCount--;
                            }
                            
                            windowStart++;
                            if (windowStart > windowEnd && windowStart < allOccurrences.length) {
                                windowEnd = windowStart;
                                const term = allOccurrences[windowStart].term;
                                termCounts.set(term, 1);
                                distinctTermCount = 1;
                            }
                        }
                    }
                }
            }
        }
        
        allResults.sort((a, b) => {
            if (a.document.fileName !== b.document.fileName) {
                return a.document.fileName.localeCompare(b.document.fileName);
            }
            return a.range.start.line - b.range.start.line;
        });
        
        if (allResults.length === 0) {
            vscode.window.showInformationMessage('No blocks found containing all highlighted terms.');
            return;
        }
        
        let closestResultIndex = 0;
        let minDistance = Number.MAX_SAFE_INTEGER;
        
        for (let i = 0; i < allResults.length; i++) {
            if (allResults[i].distanceToCursor < minDistance) {
                minDistance = allResults[i].distanceToCursor;
                closestResultIndex = i;
            }
        }
        
        const quickPick = vscode.window.createQuickPick();
        quickPick.title = `Found ${allResults.length} blocks containing all highlighted terms`;
        quickPick.placeholder = "Navigate with arrow keys to preview (Enter to select)";
        
        const items = allResults.map((result, index) => {
            const fileName = path.basename(result.document.fileName);
            return {
                label: `${fileName}:${result.range.start.line + 1}`,
                description: "",
                resultIndex: index
            };
        });
        
        quickPick.items = items;
        
        const highlightDecoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: new vscode.ThemeColor('editor.findMatchHighlightBackground'),
            border: '1px solid',
            borderColor: new vscode.ThemeColor('editor.findMatchBorder')
        });
        
        quickPick.onDidChangeActive(selection => {
            if (selection.length > 0) {
                const selectedItem = selection[0] as any;
                const resultIndex = selectedItem.resultIndex;
                const result = allResults[resultIndex];
                
                for (const editor of vscode.window.visibleTextEditors) {
                    editor.setDecorations(highlightDecoration, []);
                }
                vscode.window.showTextDocument(result.document, {
                    viewColumn: undefined,
                    preserveFocus: true,
                    preview: true
                }).then(editor => {
                    editor.revealRange(result.range, vscode.TextEditorRevealType.InCenter);
                    editor.setDecorations(highlightDecoration, [result.range]);
                });
            }
        });
        
        quickPick.onDidAccept(() => {
            const selection = quickPick.activeItems;
            if (selection.length > 0) {
                const selectedItem = selection[0] as any;
                const resultIndex = selectedItem.resultIndex;
                const result = allResults[resultIndex];
                for (const editor of vscode.window.visibleTextEditors) {
                    editor.setDecorations(highlightDecoration, []);
                }
                
                vscode.window.showTextDocument(result.document, {
                    viewColumn: undefined,
                    selection: result.range
                }).then(editor => {
                    editor.selection = new vscode.Selection(result.range.start, result.range.end);
                });
                
                quickPick.hide();
            }
        });
        
        quickPick.onDidHide(() => {
            for (const editor of vscode.window.visibleTextEditors) {
                editor.setDecorations(highlightDecoration, []);
            }
            
            highlightDecoration.dispose();
            quickPick.dispose();
        });
        
        quickPick.activeItems = [quickPick.items[closestResultIndex]];
        quickPick.show();
    }
    
    public async FindAllFunctionBlocks() {
        if (this.highlightedWords.size === 0) {
            vscode.window.showInformationMessage('No highlighted terms to search for.');
            return;
        }

        const activeEditor = vscode.window.activeTextEditor;
        const cursorPosition = activeEditor?.selection.active;
        const activeDocumentUri = activeEditor?.document.uri;

        const highlightedTerms = Array.from(this.highlightedWords.values());
        const allResults: Array<{
            document: vscode.TextDocument;
            range: vscode.Range;
            text: string;
            functionName: string;
            termOccurrences: Array<vscode.Range>;
            distanceToCursor: number;
        }> = [];
        
        for (const tabGroup of vscode.window.tabGroups.all) {
            for (const tab of tabGroup.tabs) {
                if (tab.input instanceof vscode.TabInputText) {
                    let document = await vscode.workspace.openTextDocument(tab.input.uri);
                    const text = document.getText();
                    
                    let allOccurrences: Array<{
                        term: string;
                        startPos: vscode.Position;
                        endPos: vscode.Position;
                    }> = [];
                    
                    const termPatterns = highlightedTerms.map(term => `\\b${this.escapeRegExp(term)}\\b`);
                    const combinedRegex = new RegExp(`(${termPatterns.join('|')})`, 'g');
                    
                    let match;
                    while ((match = combinedRegex.exec(text)) !== null) {
                        const matchedText = match[0];
                        const startPos = document.positionAt(match.index);
                        const endPos = document.positionAt(match.index + matchedText.length);
                        
                        for (const term of highlightedTerms) {
                            if (term === matchedText) {
                                allOccurrences.push({
                                    term: term,
                                    startPos: startPos,
                                    endPos: endPos
                                });
                                break;
                            }
                        }
                    }
                    
                    if (allOccurrences.length === 0) {
                        continue;
                    }
                    
                    const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
                        'vscode.executeDocumentSymbolProvider',
                        document.uri
                    );
                    
                    if (!symbols?.length) {
                        continue;
                    }
                    
                    const functionSymbols = this.getAllFunctionSymbols(symbols);
                    for (const functionSymbol of functionSymbols) {
                        const functionRange = functionSymbol.range;
                        const occurrencesInFunction = allOccurrences.filter((occurrence: {
                            term: string;
                            startPos: vscode.Position;
                            endPos: vscode.Position;
                        }) => 
                            functionRange.contains(occurrence.startPos) && 
                            functionRange.contains(occurrence.endPos)
                        );
                        
                        const termsInFunction = new Set<string>();
                        for (const occurrence of occurrencesInFunction) {
                            termsInFunction.add(occurrence.term);
                        }
                        
                        let containsAllTerms = true;
                        for (const term of highlightedTerms) {
                            if (!termsInFunction.has(term)) {
                                containsAllTerms = false;
                                break;
                            }
                        }
                        
                        if (containsAllTerms) {
                            const termRanges = occurrencesInFunction.map((occurrence: {
                                term: string;
                                startPos: vscode.Position;
                                endPos: vscode.Position;
                            }) => new vscode.Range(occurrence.startPos, occurrence.endPos));
                            
                            let distanceToCursor = Number.MAX_SAFE_INTEGER;
                            if (activeDocumentUri && cursorPosition && 
                                document.uri.toString() === activeDocumentUri.toString()) {
                                distanceToCursor = Math.abs(functionRange.start.line - cursorPosition.line);
                            }
                            
                            allResults.push({
                                document: document,
                                range: functionRange,
                                text: document.getText(functionRange),
                                functionName: functionSymbol.name,
                                termOccurrences: termRanges,
                                distanceToCursor: distanceToCursor
                            });
                        }
                    }
                }
            }
        }
        
        allResults.sort((a, b) => {
            if (a.document.fileName !== b.document.fileName) {
                return a.document.fileName.localeCompare(b.document.fileName);
            }
            return a.range.start.line - b.range.start.line;
        });
        
        if (allResults.length === 0) {
            vscode.window.showInformationMessage('No functions found containing all highlighted terms.');
            return;
        }
        
        let closestResultIndex = 0;
        let minDistance = Number.MAX_SAFE_INTEGER;
        
        for (let i = 0; i < allResults.length; i++) {
            if (allResults[i].distanceToCursor < minDistance) {
                minDistance = allResults[i].distanceToCursor;
                closestResultIndex = i;
            }
        }
        
        const quickPick = vscode.window.createQuickPick();
        quickPick.title = `Found ${allResults.length} functions containing all highlighted terms`;
        quickPick.placeholder = "Navigate with arrow keys to preview (Enter to select)";
        
        const items = allResults.map((result, index) => {
            const fileName = path.basename(result.document.fileName);
            return {
                label: `${fileName}: ${result.functionName} (line ${result.range.start.line + 1})`,
                description: "",
                resultIndex: index
            };
        });
        
        quickPick.items = items;
        
        const highlightDecoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: new vscode.ThemeColor('editor.findMatchHighlightBackground'),
            border: '1px solid',
            borderColor: new vscode.ThemeColor('editor.findMatchBorder')
        });
        
        const termHighlightDecoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: new vscode.ThemeColor('editor.findMatchBackground'),
            border: '1px solid',
            borderColor: new vscode.ThemeColor('editor.findMatchBorder')
        });
        
        quickPick.onDidChangeActive(selection => {
            if (selection.length > 0) {
                const selectedItem = selection[0] as any;
                const resultIndex = selectedItem.resultIndex;
                const result = allResults[resultIndex];
                
                for (const editor of vscode.window.visibleTextEditors) {
                    editor.setDecorations(highlightDecoration, []);
                    editor.setDecorations(termHighlightDecoration, []);
                }
                
                vscode.window.showTextDocument(result.document, {
                    viewColumn: undefined,
                    preserveFocus: true,
                    preview: true
                }).then(editor => {
                    editor.revealRange(result.range, vscode.TextEditorRevealType.InCenter);
                    editor.setDecorations(highlightDecoration, [result.range]);
                    editor.setDecorations(termHighlightDecoration, result.termOccurrences);
                });
            }
        });
        
        quickPick.onDidAccept(() => {
            const selection = quickPick.activeItems;
            if (selection.length > 0) {
                const selectedItem = selection[0] as any;
                const resultIndex = selectedItem.resultIndex;
                const result = allResults[resultIndex];
                
                for (const editor of vscode.window.visibleTextEditors) {
                    editor.setDecorations(highlightDecoration, []);
                    editor.setDecorations(termHighlightDecoration, []);
                }
                
                vscode.window.showTextDocument(result.document, {
                    viewColumn: undefined,
                    selection: result.range
                }).then(editor => {
                    editor.selection = new vscode.Selection(result.range.start, result.range.end);
                    editor.setDecorations(termHighlightDecoration, result.termOccurrences);
                });
                
                quickPick.hide();
            }
        });
        
        quickPick.onDidHide(() => {
            for (const editor of vscode.window.visibleTextEditors) {
                editor.setDecorations(highlightDecoration, []);
                editor.setDecorations(termHighlightDecoration, []);
            }
            
            highlightDecoration.dispose();
            termHighlightDecoration.dispose();
            quickPick.dispose();
        });
        
        quickPick.activeItems = [quickPick.items[closestResultIndex]];
        quickPick.show();
    }

    private getAllFunctionSymbols(symbols: vscode.DocumentSymbol[]): vscode.DocumentSymbol[] {
        let functionSymbols: vscode.DocumentSymbol[] = [];
        
        for (const symbol of symbols) {
            if (symbol.kind === vscode.SymbolKind.Function ||
                symbol.kind === vscode.SymbolKind.Method ||
                symbol.kind === vscode.SymbolKind.Constructor) {
                functionSymbols.push(symbol);
            }
            
            if (symbol.children?.length) {
                functionSymbols = functionSymbols.concat(this.getAllFunctionSymbols(symbol.children));
            }
        }
        
        return functionSymbols;
    }

}