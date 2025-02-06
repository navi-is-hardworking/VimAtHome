import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/*
TODO: rewrite to just store last edit location in file. this is terrible implementation
*/

interface EditPosition {
    line: number;
    character: number;
    timestamp: number;
}

interface FileEditHistory {
    positions: EditPosition[];
    currentIndex: number;
}

interface SerializedEditHistory {
    [filePath: string]: EditPosition[];
}

export class EditHistoryManager {
    
    private fileHistories: Map<string, FileEditHistory> = new Map(); 
    private maxPositionsPerFile: number = 10;
    private debounceTimeout: NodeJS.Timeout | undefined;
    private lastEditTime = 0;
    private readonly debounceDelay = 300;
    private historyChanged = false; 
    private static instance: EditHistoryManager;
    
    public static getInstance(): EditHistoryManager {
    
        if (!EditHistoryManager.instance) {
            EditHistoryManager.instance = new EditHistoryManager();
        }
        return EditHistoryManager.instance;
    }

    constructor() {
        this.loadHistory();

        vscode.workspace.onDidChangeTextDocument(event => {
            this.handleDocumentChange(event);
        });

        setInterval(() => {
            if (this.historyChanged) {
                this.historyChanged = false;
                this.saveHistory();
            }
        }, 30000);
    }

    private handleDocumentChange(event: vscode.TextDocumentChangeEvent) {
        const now = Date.now();
        if (now - this.lastEditTime < this.debounceDelay && this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }

        this.debounceTimeout = setTimeout(() => {
            this.recordEdits(event.document, event.contentChanges); 
            console.log(`file history: ${JSON.stringify(this.fileHistories)}, ${this.fileHistories.size}`);
        }, this.debounceDelay);

        this.lastEditTime = now;
    }

    private recordEdits(
        document: vscode.TextDocument,
        changes: readonly vscode.TextDocumentContentChangeEvent[]
    ) {
        const filePath = document.uri.fsPath;

        if (!this.fileHistories.has(filePath)) {
            this.fileHistories.set(filePath, { positions: [], currentIndex: -1 });
        }
        
        const fh = this.fileHistories.get(filePath)!;
        this.historyChanged = true;
        
        changes.forEach(change => {
            const startPos = change.range.start;
            console.log(`Recording edit on line ${startPos.line} (file: ${filePath}).`);
            
            // TODO: Need to remove old lines and replace with new
            fh.positions = fh.positions.filter(
                (pos) => pos.line !== startPos.line
            );
            
            const newPosition: EditPosition = {
                line: startPos.line,
                character: startPos.character,
                timestamp: Date.now()
            };

            fh.positions.push(newPosition);
            console.log(`Pushign ${JSON.stringify(newPosition)}`);
            fh.currentIndex = fh.positions.length - 1;

            if (fh.positions.length > this.maxPositionsPerFile) {
                fh.positions = fh.positions.slice(-this.maxPositionsPerFile);
                fh.currentIndex = fh.positions.length - 1;
            }
        });
    }

    public async goToPreviousEdit(editor: vscode.TextEditor): Promise<void> {
        const filePath = editor.document.uri.fsPath;
        const fileHistory = this.fileHistories.get(filePath);
        console.log(`gotoprev: filehisto- ${JSON.stringify(fileHistory)}, ${fileHistory?.positions.length}`);
        if (!fileHistory) {
            console.log(`No history found for file: ${filePath}.`);
            
            return;
        }

        
        if (fileHistory.currentIndex <= 0) {
            console.log('Already at the earliest edit location for this file.');
        }
        else {
            fileHistory.currentIndex--;
            console.log(`changing to index ${fileHistory.currentIndex}`);
        }
        
        const position = fileHistory.positions[fileHistory.currentIndex];
        const newPosition = new vscode.Position(position.line, position.character);
        

        editor.selection = new vscode.Selection(newPosition, newPosition);
        editor.revealRange(
            new vscode.Range(newPosition, newPosition),
            vscode.TextEditorRevealType.InCenter
        );

        console.log(`Moved to previous edit: line ${position.line}, index ${fileHistory.currentIndex}`);
    }

    public async goToNextEdit(editor: vscode.TextEditor): Promise<void> {
        const filePath = editor.document.uri.fsPath;
        const fileHistory = this.fileHistories.get(filePath);
        
        if (!fileHistory) {
            console.log(`No history found for file: ${filePath}.`);
            return;
        }
        
        if (fileHistory.currentIndex >= fileHistory.positions.length - 1) {
            console.log('Already at the latest edit location for this file.');
        }
        else {
            fileHistory.currentIndex++;
            console.log(`changing to index ${fileHistory.currentIndex}`);
        }
        
        const position = fileHistory.positions[fileHistory.currentIndex];
        const newPosition = new vscode.Position(position.line, position.character);
        
        editor.selection = new vscode.Selection(newPosition, newPosition);
        editor.revealRange(
            new vscode.Range(newPosition, newPosition),
            vscode.TextEditorRevealType.InCenter
        );

        console.log(`Moved to next edit: line ${position.line}, index ${fileHistory.currentIndex}`);
    }

    private async saveHistory() {
        const workspaceFolderPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        console.log(`saving edit history to ${workspaceFolderPath}`);
        
        if (!workspaceFolderPath) {
            console.log('No workspace folder open, skipping save.');
            return;
        }

        const serialized: SerializedEditHistory = {};
        this.fileHistories.forEach((history, pathKey) => {
            serialized[pathKey] = history.positions;
        });

        try {
            const historyFilePath = path.join(workspaceFolderPath, '.vscode', 'EditHistory.json');
            fs.mkdirSync(path.dirname(historyFilePath), { recursive: true });
            fs.writeFileSync(historyFilePath, JSON.stringify(serialized, null, 2), 'utf8');
            console.log(`Edit history saved to ${historyFilePath}`);
        } catch (err) {
            console.error('Failed to save EditHistory.json:', err);
            
        }
    }

    private async loadHistory() {
        const workspaceFolderPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspaceFolderPath) {
            console.log('No workspace folder open, skipping load.');
            return;
        }

        const historyFilePath = path.join(workspaceFolderPath, '.vscode', 'EditHistory.json');
        if (!fs.existsSync(historyFilePath)) {
            console.log('No EditHistory.json to load.');
            return;
        }

        try {
            const fileContents = fs.readFileSync(historyFilePath, 'utf8');
            const saved = JSON.parse(fileContents) as SerializedEditHistory;

            for (const [filePath, positions] of Object.entries(saved)) {
                this.fileHistories.set(filePath, {
                    positions,
                    currentIndex: positions.length - 1
                });
            }
            console.log(`Loaded edit history from ${historyFilePath}`);
            
        } catch (err) {
            console.error('Failed to load EditHistory.json:', err);
        }
    }
    
    public dispose() {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
        this.saveHistory();
    }
}
