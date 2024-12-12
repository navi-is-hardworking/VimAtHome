import * as vscode from "vscode";

class SelectionHistoryEntry {
    constructor(
        public readonly selection: vscode.Selection,
        public readonly timestamp: number
    ) {}
}

class FileSelectionHistory {
    private history: SelectionHistoryEntry[] = [];
    private currentIndex: number = -1;
    private maxHistorySize: number = 100;
    
    private isNavigatingHistory: boolean = false;

    constructor(private fileUri: string) {}

    public recordSelection(selection: vscode.Selection) {
        if (this.isNavigatingHistory) {
            return;
        }

        if (this.history.length > 0 && 
            this.areSelectionsEqual(this.history[this.currentIndex].selection, selection)) {
            return;
        }

        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }

        this.history.push(new SelectionHistoryEntry(selection, Date.now()));
        
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(this.history.length - this.maxHistorySize);
        }

        this.currentIndex = this.history.length - 1;
    }

    public goToPreviousSelection(): vscode.Selection | undefined {
        if (this.currentIndex <= 0) {
            return undefined;
        }

        this.isNavigatingHistory = true;
        this.currentIndex--;
        const selection = this.history[this.currentIndex].selection;
        this.isNavigatingHistory = false;
        
        return selection;
    }

    public goToNextSelection(): vscode.Selection | undefined {
        if (this.currentIndex >= this.history.length - 1) {
            return undefined;
        }

        this.isNavigatingHistory = true;
        this.currentIndex++;
        const selection = this.history[this.currentIndex].selection;
        this.isNavigatingHistory = false;

        return selection;
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
    
    public recordSelection(editor: vscode.TextEditor) {
        if (editor.selection.active.line === editor.selection.anchor.line && editor.selection.active.character === editor.selection.anchor.character) {
            return;
        }
        
        const fileUri = editor.document.uri.toString();
        let fileHistory = this.fileHistories.get(fileUri);
        
        if (!fileHistory) {
            fileHistory = new FileSelectionHistory(fileUri);
            this.fileHistories.set(fileUri, fileHistory);
        }

        fileHistory.recordSelection(editor.selection);
    }

    public goToPreviousSelection(editor: vscode.TextEditor): boolean {
        const fileHistory = this.fileHistories.get(editor.document.uri.toString());
        if (!fileHistory) {
            return false;
        }

        const previousSelection = fileHistory.goToPreviousSelection();
        if (previousSelection) {
            editor.selection = previousSelection;
            editor.revealRange(previousSelection, vscode.TextEditorRevealType.Default);
            return true;
        }

        return false;
    }

    public goToNextSelection(editor: vscode.TextEditor): boolean {
        const fileHistory = this.fileHistories.get(editor.document.uri.toString());
        if (!fileHistory) {
            return false;
        }

        const nextSelection = fileHistory.goToNextSelection();
        if (nextSelection) {
            editor.selection = nextSelection;
            editor.revealRange(nextSelection, vscode.TextEditorRevealType.Default);
            return true;
        }

        return false;
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