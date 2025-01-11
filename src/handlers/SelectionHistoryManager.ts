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

    equals(other: SelectionHistoryEntry): boolean {
        return (this.selection.active.isEqual(other.selection.active) && 
                this.selection.anchor.isEqual(other.selection.anchor)) ||
               (this.selection.active.isEqual(other.selection.anchor) && 
                this.selection.anchor.isEqual(other.selection.active));
    }

    getKey(): string {
        const points = [
            [this.selection.anchor.line, this.selection.anchor.character],
            [this.selection.active.line, this.selection.active.character]
        ].sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);
        
        return `${points[0][0]},${points[0][1]}-${points[1][0]},${points[1][1]}`;
    }
}

class FileSelectionHistory {
    private history: SelectionHistoryEntry[] = [];
    private currentIndex: number = -1;
    private maxHistorySize: number = 25;
    private lastNavigationTime: number = 0;
    private seen = new Set<string>();

    constructor(private fileUri: string) {}

    private isDuplicate(entry: SelectionHistoryEntry): boolean {
        return this.seen.has(entry.getKey());
    }

    public recordSelection(selection: vscode.Selection, subjectName?: SubjectName) {
        if (Date.now() - this.lastNavigationTime < 100) {
            return;
        }

        const newEntry = new SelectionHistoryEntry(selection, Date.now(), subjectName);
        const key = newEntry.getKey();

        if (this.isDuplicate(newEntry)) {
            return;
        }

        if (this.currentIndex < this.history.length - 1) {
            for (let i = this.currentIndex + 1; i < this.history.length; i++) {
                this.seen.delete(this.history[i].getKey());
            }
            this.history = this.history.slice(0, this.currentIndex + 1);
        }

        this.history.push(newEntry);
        this.seen.add(key);
        this.currentIndex = this.history.length - 1;

        while (this.history.length > this.maxHistorySize) {
            const removed = this.history.shift();
            if (removed) {
                this.seen.delete(removed.getKey());
            }
            this.currentIndex--;
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

    public clear() {
        this.history = [];
        this.currentIndex = -1;
        this.seen.clear();
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