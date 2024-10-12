import * as vscode from 'vscode';

export class HighlightManager {
    private highlightDecorationType: vscode.TextEditorDecorationType;
    private highlightedWords: Map<number, string> = new Map();
    private disposables: vscode.Disposable[] = [];

    constructor() {
        this.highlightDecorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(255, 255, 0, 0.3)',
            border: '1px solid yellow',
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
                vscode.window.showInformationMessage(`Highlight ${index}: "${word}" added.`);
            } else {
                vscode.window.showWarningMessage('Maximum number of highlights (9) reached.');
            }
        }
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
        vscode.window.showInformationMessage('All highlights cleared.');
    }

    private removeHighlight(index: number) {
        const word = this.highlightedWords.get(index);
        if (word) {
            this.highlightedWords.delete(index);
            this.updateHighlights();
            vscode.window.showInformationMessage(`Highlight ${index}: "${word}" removed.`);
        } else {
            vscode.window.showInformationMessage(`No highlight at index ${index}.`);
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
                const regex = new RegExp(this.escapeRegExp(word), 'gi');
                let match;
                while ((match = regex.exec(text))) {
                    const startPos = editor.document.positionAt(match.index);
                    const endPos = editor.document.positionAt(match.index + match[0].length);
                    ranges.push(new vscode.Range(startPos, endPos));
                }
            });

            editor.setDecorations(this.highlightDecorationType, ranges);
        });
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

}