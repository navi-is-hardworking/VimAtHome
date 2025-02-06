import * as vscode from "vscode";
import { SubjectName } from "../subjects/SubjectName";

/*
TODO: rewrite with circular list this is terrible implementation

okay the issue is going back forward causes selections to be written
*/

class SelectionHistoryEntry {
    constructor(
        public readonly selection: vscode.Selection,
        public readonly timestamp: number,
        public readonly subjectName?: SubjectName
    ) {}

    toString(): string {
        return `Selection(${this.selection.anchor.line}:${this.selection.anchor.character} -> ${this.selection.active.line}:${this.selection.active.character}) Subject: ${this.subjectName || 'none'}`;
    }

    equals(other: SelectionHistoryEntry): boolean {
        return (this.selection.active.isEqual(other.selection.active) && 
                this.selection.anchor.isEqual(other.selection.anchor)) ||
               (this.selection.active.isEqual(other.selection.anchor) && 
                this.selection.anchor.isEqual(other.selection.active));
    }
}

class FileSelectionHistory {
    private maxHistorySize: number = 10;
    private history: SelectionHistoryEntry[] = [];
    private currentIndex: number = -1;
    private navigationIndex: number = -1;
    private lastNavigationTime: number = 0;
    
    constructor(private fileUri: string) {
        this.history = new Array(this.maxHistorySize);
        const emptySelection = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 0));
        const emptyHistoryEntry = new SelectionHistoryEntry(emptySelection, Date.now(), undefined) 
        for (var i = 0; i < this.history.length; i++) {
            this.history[i] = emptyHistoryEntry;
        }
    }

    public recordSelection(selection: vscode.Selection, subjectName?: SubjectName) {
        if (Date.now() - this.lastNavigationTime < 100) {
            return;
        }

        const newEntry = new SelectionHistoryEntry(selection, Date.now(), subjectName);
        
        this.currentIndex = (this.currentIndex + 1) % this.maxHistorySize;
        this.history[this.currentIndex] = newEntry;
        this.navigationIndex = this.currentIndex;
    }

    public goToPreviousSelection(): { selection: vscode.Selection, subjectName?: SubjectName } | undefined {
        this.lastNavigationTime = Date.now();
        
        if (this.currentIndex === -1 || !this.history[this.navigationIndex].subjectName) return;
        let newNavigationIndex = (this.navigationIndex - 1) % this.maxHistorySize;
        if (newNavigationIndex < 0) {
            newNavigationIndex = this.maxHistorySize - 1;
        }
        if (newNavigationIndex == this.currentIndex || !this.history[this.navigationIndex].subjectName || !this.history[newNavigationIndex].subjectName) {
            return undefined;
        }
        
        this.navigationIndex = newNavigationIndex;
        const entry = this.history[this.navigationIndex];
        
        return {
            selection: entry.selection,
            subjectName: entry.subjectName
        };
    }

    public goToNextSelection(): { selection: vscode.Selection, subjectName?: SubjectName } | undefined {
        this.lastNavigationTime = Date.now();
        
        if (this.currentIndex === this.navigationIndex) {
            if (!this.history[this.currentIndex].subjectName) return undefined;
            return {
                selection: this.history[this.currentIndex].selection,
                subjectName: this.history[this.currentIndex].subjectName
            };
        }
        
        if (!this.history[this.currentIndex].subjectName) return undefined;
        
        this.navigationIndex = (this.navigationIndex + 1) % this.maxHistorySize;
        const entry = this.history[this.navigationIndex];
        
        if (!entry.subjectName) return undefined;
        return {
            selection: entry.selection,
            subjectName: entry.subjectName
        };
    }

    public clear() {
        this.history = [];
        this.currentIndex = -1;
    }

    public isEmpty(): boolean {
        return this.history.length === 0;
    }

    public getLastAccessTime(): number {
        return this.history.length > 0 ? this.history[this.history.length - 1].timestamp : 0;
    }
}

export class SelectionHistoryManager {
    private fileHistories: Map<string, FileSelectionHistory> = new Map();
    private readonly maxFiles: number = 10;

    public recordSelection(editor: vscode.TextEditor, subjectName?: SubjectName) {
        if (editor.selection.active.isEqual(editor.selection.anchor)) {
            return;
        }

        const fileUri = editor.document.uri.toString();
        let fileHistory = this.fileHistories.get(fileUri);
        
        if (!fileHistory) {
            if (this.fileHistories.size >= this.maxFiles) {
                this.removeOldestHistory();
            }
            
            fileHistory = new FileSelectionHistory(fileUri);
            this.fileHistories.set(fileUri, fileHistory);
        }

        fileHistory.recordSelection(editor.selection, subjectName);
    }

    private removeOldestHistory() {
        let oldestTime = Date.now();
        let oldestUri = '';

        for (const [uri, history] of this.fileHistories.entries()) {
            const lastAccessTime = history.getLastAccessTime();
            if (lastAccessTime < oldestTime) {
                oldestTime = lastAccessTime;
                oldestUri = uri;
            }
        }

        if (oldestUri) {
            this.fileHistories.delete(oldestUri);
        }
    }

    public goToPreviousSelection(editor: vscode.TextEditor): { selection: vscode.Selection, subjectName?: SubjectName } | undefined {
        const fileHistory = this.fileHistories.get(editor.document.uri.toString());
        return fileHistory?.goToPreviousSelection();
    }

    public goToNextSelection(editor: vscode.TextEditor): { selection: vscode.Selection, subjectName?: SubjectName } | undefined {
        const fileHistory = this.fileHistories.get(editor.document.uri.toString());
        return fileHistory?.goToNextSelection();
    }

    public clearHistoryForFile(fileUri: string) {
        const fileHistory = this.fileHistories.get(fileUri);
        if (fileHistory) {
            fileHistory.clear();
            if (fileHistory.isEmpty()) {
                this.fileHistories.delete(fileUri);
            }
        }
    }

    public clearAllHistory() {
        this.fileHistories.clear();
    }
}