import * as vscode from "vscode";
import { SubjectName } from "../subjects/SubjectName";

class SelectionHistoryEntry {
    constructor(
        public readonly selection: vscode.Selection,
        public readonly timestamp: number,
        public readonly subjectName?: SubjectName
    ) {}
}

class FileSelectionHistory {
    private history: SelectionHistoryEntry[] = [];
    private currentIndex: number = -1;
    private maxHistorySize: number = 100;
    private isNavigatingHistory: boolean = false;

    constructor(private fileUri: string) {}

    public recordSelection(selection: vscode.Selection, subjectName?: SubjectName) {
        if (this.isNavigatingHistory) {
            return;
        }

        if (this.history.length > 0 && this.currentIndex >= 0 && 
            this.areSelectionsEqual(this.history[this.currentIndex].selection, selection) &&
            this.history[this.currentIndex].subjectName === subjectName) {
            return;
        }

        if (this.currentIndex >= 0 && this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }

        this.history.push(new SelectionHistoryEntry(selection, Date.now(), subjectName));
        
        if (this.history.length > this.maxHistorySize) {
            const removeCount = this.history.length - this.maxHistorySize;
            this.history = this.history.slice(removeCount);
            this.currentIndex = Math.max(0, this.currentIndex - removeCount);
        } else {
            this.currentIndex = this.history.length - 1;
        }
    }

    public goToPreviousSelection(): SelectionHistoryEntry | undefined {
        if (this.currentIndex <= 0 || this.history.length === 0) {
            return undefined;
        }

        this.isNavigatingHistory = true;
        this.currentIndex--;
        const entry = this.history[this.currentIndex];
        this.isNavigatingHistory = false;
        
        return entry;
    }

    public goToNextSelection(): SelectionHistoryEntry | undefined {
        if (this.currentIndex >= this.history.length - 1) {
            return undefined;
        }

        this.isNavigatingHistory = true;
        this.currentIndex++;
        const entry = this.history[this.currentIndex];
        this.isNavigatingHistory = false;

        return entry;
    }

    private areSelectionsEqual(a: vscode.Selection, b: vscode.Selection): boolean {
        return a.active.isEqual(b.active) && 
               a.anchor.isEqual(b.anchor);
    }

    public clear() {
        this.history = [];
        this.currentIndex = -1;
    }
}

export class SelectionHistoryManager {
    private fileHistories: Map<string, FileSelectionHistory> = new Map();
    
    public recordSelection(editor: vscode.TextEditor, subjectName?: SubjectName) {
        if (editor.selection.active.line === editor.selection.anchor.line && 
            editor.selection.active.character === editor.selection.anchor.character) {
            return;
        }

        const fileUri = editor.document.uri.toString();
        let fileHistory = this.fileHistories.get(fileUri);
        
        if (!fileHistory) {
            fileHistory = new FileSelectionHistory(fileUri);
            this.fileHistories.set(fileUri, fileHistory);
        }

        fileHistory.recordSelection(editor.selection, subjectName);
    }

    public goToPreviousSelection(editor: vscode.TextEditor): SubjectName | undefined {
        const fileHistory = this.fileHistories.get(editor.document.uri.toString());
        if (!fileHistory) {
            return undefined;
        }

        const previousEntry = fileHistory.goToPreviousSelection();
        if (previousEntry) {
            editor.selection = previousEntry.selection;
            editor.revealRange(previousEntry.selection, vscode.TextEditorRevealType.Default);
            return previousEntry.subjectName;
        }

        return undefined;
    }

    public goToNextSelection(editor: vscode.TextEditor): SubjectName | undefined {
        const fileHistory = this.fileHistories.get(editor.document.uri.toString());
        if (!fileHistory) {
            return undefined;
        }

        const nextEntry = fileHistory.goToNextSelection();
        if (nextEntry) {
            editor.selection = nextEntry.selection;
            editor.revealRange(nextEntry.selection, vscode.TextEditorRevealType.Default);
            return nextEntry.subjectName;
        }

        return undefined;
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