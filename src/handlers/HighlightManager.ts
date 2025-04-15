import * as vscode from 'vscode';
import * as path from 'path';
import { setHighlightRegex } from "../config";
import { runInThisContext } from 'vm';

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
    
    public async addSelectionAsHighlight(word: string): Promise<boolean>  {
        if (word) {
            let existingIndex: number | undefined;
            for (const [index, existingWord] of this.highlightedWords) {
                if (existingWord === word) {
                    existingIndex = index;
                    break;
                }
            }
            if (existingIndex !== undefined) {
                this.highlightedWords.delete(existingIndex);
                this.updateHighlights();
                return false;
            } else {
                const index = this.getNextAvailableIndex();
                if (index !== -1) {
                    this.highlightedWords.set(index, word);
                    this.updateHighlights();
                }
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
    
    private clearAllHighlights() {
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
    
    public clearAllHighlightsDirectly() {
        this.highlightedWords.clear();
        this.updateHighlights();
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

        const highlightedTerms = Array.from(this.highlightedWords.values());
        const allEditors = vscode.window.visibleTextEditors;
        console.log(`Found ${allEditors.length} editors to search`);
        
        if (allEditors.length === 0) {
            vscode.window.showInformationMessage('No open editors to search in.');
            return;
        }
        
        const allResults: Array<{
            editor: vscode.TextEditor;
            range: vscode.Range;
            text: string;
        }> = [];
        
        for (const editor of allEditors) {
            const document = editor.document;
            const text = document.getText();
            
            let allOccurrences: Array<{
                term: string;
                startPos: vscode.Position;
                endPos: vscode.Position;
            }> = [];
            
            for (const term of highlightedTerms) {
                const regex = new RegExp(`\\b${this.escapeRegExp(term)}\\b`, 'g');
                let match;
                
                while ((match = regex.exec(text)) !== null) {
                    const startPos = document.positionAt(match.index);
                    const endPos = document.positionAt(match.index + match[0].length);
                    
                    allOccurrences.push({
                        term: term,
                        startPos: startPos,
                        endPos: endPos
                    });
                }
            }
            
            allOccurrences.sort((a, b) => {
                if (a.startPos.line !== b.startPos.line) {
                    return a.startPos.line - b.startPos.line;
                }
                return a.startPos.character - b.startPos.character;
            });
            
            if (allOccurrences.length === 0) {
                continue;
            }
            
            for (let startIndex = 0; startIndex < allOccurrences.length; startIndex++) {
                const start = allOccurrences[startIndex];
                const seenTerms = new Set<string>([start.term]);
                for (let endIndex = startIndex + 1; endIndex < allOccurrences.length; endIndex++) {
                    const end = allOccurrences[endIndex];
                    seenTerms.add(end.term);
                    if (seenTerms.size === highlightedTerms.length) {
                        const range = new vscode.Range(start.startPos, end.endPos);
                        const text = document.getText(range);
                        
                        const wordCount = text.split(/\s+/).length;
                        if (wordCount <= blockSize) {
                            allResults.push({
                                editor: editor,
                                range: range,
                                text: text
                            });
                        }
                        
                        break;
                    }
                }
            }
        }
        
        allResults.sort((a, b) => {
            if (a.editor.document.fileName !== b.editor.document.fileName) {
                return a.editor.document.fileName.localeCompare(b.editor.document.fileName);
            }
            return a.range.start.line - b.range.start.line;
        });
        
        if (allResults.length === 0) {
            vscode.window.showInformationMessage('No blocks found containing all highlighted terms.');
            return;
        }
        
        const quickPick = vscode.window.createQuickPick();
        quickPick.title = `Found ${allResults.length} blocks containing all highlighted terms`;
        quickPick.placeholder = "Navigate with arrow keys to preview (Enter to select)";
        
        const items = allResults.map((result, index) => {
            const fileName = path.basename(result.editor.document.fileName);
            return {
                label: `${fileName}:${result.range.start.line + 1}`,
                description: "", // Keep it clean as requested
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
                
                vscode.window.showTextDocument(result.editor.document, {
                    viewColumn: result.editor.viewColumn,
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
                
                vscode.window.showTextDocument(result.editor.document, {
                    viewColumn: result.editor.viewColumn,
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
        
        quickPick.show();
    }
    
}