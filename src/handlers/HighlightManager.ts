import * as vscode from 'vscode';
import { setHighlightRegex } from "../config";

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
    
}