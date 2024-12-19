import * as vscode from "vscode";
import { SubjectName } from "../subjects/SubjectName";

class SelectionHistoryEntry {
    constructor(
        public readonly selection: vscode.Selection,
        public readonly timestamp: number,
        public readonly subjectName?: SubjectName
    ) {}

    toString(): string {
        return `Selection(${this.selection.anchor.line}:${this.selection.anchor.character} -> ${this.selection.active.line}:${this.selection.active.character}) Subject: ${this.subjectName || 'none'}`;
    }
}

class FileSelectionHistory {
    private history: SelectionHistoryEntry[] = [];
    private currentIndex: number = -1;
    private maxHistorySize: number = 100;
    private lastNavigationTime: number = 0;

    constructor(private fileUri: string) {}

    public recordSelection(selection: vscode.Selection, subjectName?: SubjectName) {
        if (Date.now() - this.lastNavigationTime < 100) {
            return;
        }

        if (this.currentIndex >= 0) {
            const currentEntry = this.history[this.currentIndex];
            if (this.areSelectionsEqual(currentEntry.selection, selection) && 
                currentEntry.subjectName === subjectName) {
                return;
            }
        }

        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }

        const newEntry = new SelectionHistoryEntry(selection, Date.now(), subjectName);
        this.history.push(newEntry);
        this.currentIndex = this.history.length - 1;

        if (this.history.length > this.maxHistorySize) {
            const removeCount = this.history.length - this.maxHistorySize;
            this.history = this.history.slice(removeCount);
            this.currentIndex = Math.max(0, this.currentIndex - removeCount);
        }

    }

    public goToPreviousSelection(): { selection: vscode.Selection, subjectName?: SubjectName } | undefined {
        if (this.history.length === 0 || this.currentIndex <= 0) {
            return undefined;
        }

        this.currentIndex--;
        this.lastNavigationTime = Date.now();
        const entry = this.history[this.currentIndex];
        
        return {
            selection: entry.selection,
            subjectName: entry.subjectName
        };
    }

    public goToNextSelection(): { selection: vscode.Selection, subjectName?: SubjectName } | undefined {
        if (this.history.length === 0 || this.currentIndex >= this.history.length - 1) {
            return undefined;
        }

        this.currentIndex++;
        this.lastNavigationTime = Date.now();
        const entry = this.history[this.currentIndex];
        
        return {
            selection: entry.selection,
            subjectName: entry.subjectName
        };
    }

    private areSelectionsEqual(a: vscode.Selection, b: vscode.Selection): boolean {
        return a.active.isEqual(b.active) && a.anchor.isEqual(b.anchor);
    }

    public clear() {
        this.history = [];
        this.currentIndex = -1;
    }
    
}

export class SelectionHistoryManager {
    private fileHistories: Map<string, FileSelectionHistory> = new Map();
    
    public recordSelection(editor: vscode.TextEditor, subjectName?: SubjectName) {
        if (editor.selection.active.isEqual(editor.selection.anchor)) {
            return;
        }

        const fileUri = editor.document.uri.toString();
        let fileHistory = this.fileHistories.get(fileUri);
        
        if (!fileHistory) {
            fileHistory = new FileSelectionHistory(fileUri);
            this.fileHistories.set(fileUri, fileHistory);
        }

        const selectedText = editor.document.getText(editor.selection);
        fileHistory.recordSelection(editor.selection, subjectName);
    }

    public goToPreviousSelection(editor: vscode.TextEditor): { selection: vscode.Selection, subjectName?: SubjectName } | undefined {
        const fileHistory = this.fileHistories.get(editor.document.uri.toString());
        if (!fileHistory) {
            return undefined;
        }

        return fileHistory.goToPreviousSelection();
    }

    public goToNextSelection(editor: vscode.TextEditor): { selection: vscode.Selection, subjectName?: SubjectName } | undefined {
        const fileHistory = this.fileHistories.get(editor.document.uri.toString());
        if (!fileHistory) {
            return undefined;
        }

        return fileHistory.goToNextSelection();
    }

    public clearHistoryForFile(fileUri: string) {
        const fileHistory = this.fileHistories.get(fileUri);
        if (fileHistory) {
            fileHistory.clear();
        }
    }

    public clearAllHistory() {
        this.fileHistories.clear();
    }
}