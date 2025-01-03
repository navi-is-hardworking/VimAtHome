import * as vscode from 'vscode';
import { SubjectName } from "../subjects/SubjectName";
import * as path from 'path';
import { InlineInput } from '../utils/inlineInput';

interface Waypoint {
    character: string;
    selection: vscode.Selection;
    filePath: string;
    text: string;
    subjectName?: SubjectName;
}

export class WaypointManager {
    private waypoints: Map<string, Waypoint> = new Map();
    private disposables: vscode.Disposable[] = [];
    private waypointDecorationType: vscode.TextEditorDecorationType;
    private previewDecorationType: vscode.TextEditorDecorationType;

    constructor() {
        this.waypointDecorationType = vscode.window.createTextEditorDecorationType({
            textDecoration: 'underline dotted #888888'
        });

        this.previewDecorationType = vscode.window.createTextEditorDecorationType({
            textDecoration: 'underline #4444AA'
        });

        this.disposables.push(vscode.window.onDidChangeActiveTextEditor(() => {
            this.updateDecorations();
        }));
    }

    private updateDecorations() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const currentFileWaypoints = Array.from(this.waypoints.values())
            .filter(w => w.filePath === editor.document.uri.toString())
            .map(w => w.selection);

        editor.setDecorations(this.waypointDecorationType, currentFileWaypoints);
    }

    public async createWaypoint() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        return new Promise<void>((resolve) => {
            const handleInput = (_: string, char: string) => {
                if (!editor) return;
                
                const selection = editor.selection;
                const text = editor.document.getText(selection).trim();
                
                this.waypoints.set(char, {
                    character: char,
                    selection: selection,
                    filePath: editor.document.uri.toString(),
                    text: text,
                    subjectName: (vscode.workspace.getConfiguration('vimAtHome').get('subject') as SubjectName)
                });

                this.updateDecorations();
                resolve();
            };

            const inlineInput = new InlineInput({
                textEditor: editor,
                onInput: handleInput,
                onCancel: () => resolve()
            });

            inlineInput.updateStatusBar('Enter mark character', 0);
        });
    }

    public async teleportToWaypoint() {
        if (this.waypoints.size === 0) {
            vscode.window.showInformationMessage('No waypoints set');
            return;
        }

        const quickPick = vscode.window.createQuickPick();
        quickPick.matchOnDescription = true;
        quickPick.items = Array.from(this.waypoints.values()).map(waypoint => ({
            label: waypoint.character,
            description: `${path.basename(waypoint.filePath)}: ${waypoint.text.substring(0, 50)}${waypoint.text.length > 50 ? '...' : ''}`,
            waypoint: waypoint
        }));

        let currentEditor = vscode.window.activeTextEditor;
        if (!currentEditor) return;

        const previewWaypoint = (waypoint: Waypoint) => {
            if (currentEditor) {
                currentEditor.setDecorations(this.previewDecorationType, []);

                if (currentEditor.document.uri.toString() === waypoint.filePath) {
                    currentEditor.revealRange(waypoint.selection, vscode.TextEditorRevealType.InCenter);
                    currentEditor.setDecorations(this.previewDecorationType, [waypoint.selection]);
                }
            }
        };

        quickPick.onDidChangeActive(items => {
            const waypoint = (items[0] as any)?.waypoint as Waypoint;
            if (waypoint) {
                previewWaypoint(waypoint);
            }
        });

        return new Promise<void>((resolve) => {
            quickPick.onDidChangeValue(async value => {
                if (value.length === 1) {
                    const waypoint = this.waypoints.get(value);
                    if (waypoint) {
                        quickPick.dispose();
                        await this.jumpToWaypoint(waypoint);
                        resolve();
                    }
                }
            });

            quickPick.onDidAccept(async () => {
                const selected = quickPick.selectedItems[0] as any;
                if (selected?.waypoint) {
                    quickPick.dispose();
                    await this.jumpToWaypoint(selected.waypoint);
                }
                resolve();
            });

            quickPick.onDidHide(() => {
                if (currentEditor) {
                    currentEditor.setDecorations(this.previewDecorationType, []);
                }
                quickPick.dispose();
                resolve();
            });

            quickPick.show();
        });
    }

    private async jumpToWaypoint(waypoint: Waypoint) {
        const document = await vscode.workspace.openTextDocument(vscode.Uri.parse(waypoint.filePath));
        const editor = await vscode.window.showTextDocument(document);
        editor.selection = waypoint.selection;
        editor.revealRange(waypoint.selection, vscode.TextEditorRevealType.InCenter);
        
        if (waypoint.subjectName) {
            await vscode.commands.executeCommand(`vimAtHome.changeTo${waypoint.subjectName}Subject`);
        }
        
        this.updateDecorations();
    }

    public clearWaypoints() {
        this.waypoints.clear();
        this.updateDecorations();
    }

    public dispose() {
        this.disposables.forEach(d => d.dispose());
        this.waypointDecorationType.dispose();
        this.previewDecorationType.dispose();
    }
}