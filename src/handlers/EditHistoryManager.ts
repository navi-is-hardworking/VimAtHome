import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Just single last edit cursor location but persistant within workspace
export class EditHistoryManager {
    private static instance: EditHistoryManager;
    private editHistory: Map<string, vscode.Position>;
    private historyFile: string | undefined;
    private disposables: vscode.Disposable[] = [];

    public static getInstance(): EditHistoryManager {
        if (!EditHistoryManager.instance) {
            EditHistoryManager.instance = new EditHistoryManager();
        }
        return EditHistoryManager.instance;
    }

    private constructor() {
        this.editHistory = new Map<string, vscode.Position>();
        this.setupWorkspace();
        this.registerEventListeners();
    }

    private setupWorkspace(): void {
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
            const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
            const vscodeFolder = path.join(workspaceFolder, '.vscode');
            
            if (!fs.existsSync(vscodeFolder)) {
                fs.mkdirSync(vscodeFolder, { recursive: true });
            }
            
            this.historyFile = path.join(vscodeFolder, 'edit-history.json');
            this.loadEditHistory();
        }
    }

    private registerEventListeners(): void {
        this.disposables.push(
            vscode.workspace.onDidChangeTextDocument(event => {
                if (event.contentChanges.length > 0 && vscode.window.activeTextEditor) {
                    const editor = vscode.window.activeTextEditor;
                    
                    if (editor.document.uri.toString() === event.document.uri.toString()) {
                        setTimeout(() => {
                            const filePath = event.document.uri.fsPath;
                            const position = editor.selection.active;
                            this.editHistory.set(filePath, position);
                            this.saveEditHistory();
                        }, 10);
                    }
                }
            })
        );

        this.disposables.push(
            vscode.workspace.onDidChangeWorkspaceFolders(() => {
                this.setupWorkspace();
            })
        );
    }

    public moveToLastEditLocation(): void {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor found.');
            return;
        }

        const filePath = editor.document.uri.fsPath;
        const lastPosition = this.editHistory.get(filePath);

        if (lastPosition) {
            editor.selection = new vscode.Selection(lastPosition, lastPosition);
            
            editor.revealRange(
                new vscode.Range(lastPosition, lastPosition),
                vscode.TextEditorRevealType.InCenter
            );
        } else {
            vscode.window.showInformationMessage('No edit history found for this file.');
        }
    }

    private loadEditHistory(): void {
        if (!this.historyFile || !fs.existsSync(this.historyFile)) {
            return;
        }

        try {
            const data = fs.readFileSync(this.historyFile, 'utf8');
            const historyData = JSON.parse(data);
            
            this.editHistory.clear();
            
            for (const [filePath, position] of Object.entries(historyData)) {
                const pos = position as { line: number, character: number };
                this.editHistory.set(filePath, new vscode.Position(pos.line, pos.character));
            }
        } catch (error) {
            console.error('Failed to load edit history:', error);
        }
    }

    private saveEditHistory(): void {
        if (!this.historyFile) {
            return;
        }

        try {
            const historyData: Record<string, { line: number, character: number }> = {};
            
            this.editHistory.forEach((position, filePath) => {
                historyData[filePath] = {
                    line: position.line,
                    character: position.character
                };
            });
            
            fs.writeFileSync(this.historyFile, JSON.stringify(historyData, null, 2), 'utf8');
        } catch (error) {
            console.error('Failed to save edit history:', error);
        }
    }
    
    public clearHistory(): void {
        this.editHistory.clear();
        this.saveEditHistory();
    }

    public dispose(): void {
        this.disposables.forEach(d => d.dispose());
        this.disposables = [];
    }
}
