import * as vscode from 'vscode';
import { getWordDefinition } from '../config';
import * as common from '../common';

let instance: FirstLetterPreview | undefined;

export class FirstLetterPreview {
    private decorationType: vscode.TextEditorDecorationType;
    
    public static getInstance(): FirstLetterPreview {
        if (!instance) {
            instance = new FirstLetterPreview();
        }
        return instance;
    }
    
    private constructor() {
        this.decorationType = vscode.window.createTextEditorDecorationType({
            border: '1.2px solid #1890faf5',
            borderRadius: '2px',
            backgroundColor: 'transparent'
        });
    }

    public async showFirstLettersPreview(editor: vscode.TextEditor, direction: common.Direction) {
        const cursorPosition = editor.selection.active;
        const visibleRanges = editor.visibleRanges;
        const ranges: vscode.Range[] = [];
        const letterPositions = new Map<string, vscode.Position>();

        const wordRegex = getWordDefinition(true);
        if (!wordRegex) return;

        for (const visibleRange of visibleRanges) {
            const text = editor.document.getText(visibleRange);
            const lines = text.split('\n');
            let currentLineOffset = visibleRange.start.line;

            for (const line of lines) {
                if (!line.trim()) {
                    currentLineOffset++;
                    continue;
                }

                const globalWordRegex = new RegExp(wordRegex.source, 'g');
                let match: RegExpExecArray | null;
                
                while ((match = globalWordRegex.exec(line)) !== null) {
                    const pos = new vscode.Position(currentLineOffset, match.index);
                    const word = match[0];
                    const firstChar = word[0].toLowerCase();

                    if (direction === common.Direction.forwards) {
                        if (pos.compareTo(cursorPosition) > 0 && !letterPositions.has(firstChar)) {
                            letterPositions.set(firstChar, pos);
                        }
                    } else {
                        if (pos.compareTo(cursorPosition) < 0) {
                            letterPositions.set(firstChar, pos);
                        }
                    }
                }
                currentLineOffset++;
            }
        }

        for (const pos of letterPositions.values()) {
            ranges.push(new vscode.Range(pos, pos.translate(0, 1)));
        }

        editor.setDecorations(this.decorationType, ranges);
    }

    public clearDecorations(editor: vscode.TextEditor) {
        editor.setDecorations(this.decorationType, []);
    }

    public dispose() {
        this.decorationType.dispose();
    }
}