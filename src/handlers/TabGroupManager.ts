import * as vscode from 'vscode';

interface TabLayout {
    name: string;
    tabs: EditorTab[];
    timestamp: number;
}

interface EditorTab {
    uri: string;
    viewColumn: number;
    isActive: boolean;
}

export class TabLayoutManager {
    private configFileName = 'editorTabGroups.json';
    
    constructor() {}
    
    private async getStorageUri(): Promise<vscode.Uri | undefined> {
        const folders = vscode.workspace.workspaceFolders;
        if (!folders || folders.length === 0) {
            return undefined;
        }
        
        try {
            const rootFolder = folders[0].uri;
            const vscodeFolder = vscode.Uri.joinPath(rootFolder, '.vscode');
            
            try {
                await vscode.workspace.fs.createDirectory(vscodeFolder);
            } catch (error) {
                return undefined;
            }
            
            return vscode.Uri.joinPath(vscodeFolder, this.configFileName);
        } catch (error) {
            return undefined;
        }
    }
    
    private async ensureStorageFile(): Promise<boolean> {
        const storageUri = await this.getStorageUri();
        if (!storageUri) {
            return false;
        }
        
        try {
            try {
                await vscode.workspace.fs.stat(storageUri);
                return true;
            } catch {
                await vscode.workspace.fs.writeFile(
                    storageUri, 
                    Buffer.from(JSON.stringify([], null, 2))
                );
                return true;
            }
        } catch (error) {
            return false;
        }
    }
    
    private async readLayouts(): Promise<TabLayout[]> {
        try {
            const storageUri = await this.getStorageUri();
            if (!storageUri) {
                return [];
            }
            
            const fileExists = await this.ensureStorageFile();
            if (!fileExists) {
                return [];
            }
            
            const data = await vscode.workspace.fs.readFile(storageUri);
            
            try {
                const layouts = JSON.parse(Buffer.from(data).toString('utf8'));
                
                if (!Array.isArray(layouts)) {
                    await vscode.workspace.fs.writeFile(
                        storageUri, 
                        Buffer.from(JSON.stringify([], null, 2))
                    );
                    return [];
                }
                
                return layouts;
            } catch (parseError) {
                await vscode.workspace.fs.writeFile(
                    storageUri, 
                    Buffer.from(JSON.stringify([], null, 2))
                );
                return [];
            }
        } catch (error) {
            return [];
        }
    }
    
    private async writeLayouts(layouts: TabLayout[]): Promise<boolean> {
        try {
            const storageUri = await this.getStorageUri();
            if (!storageUri) {
                return false;
            }
            
            if (!Array.isArray(layouts)) {
                layouts = [];
            }
            
            await vscode.workspace.fs.writeFile(
                storageUri,
                Buffer.from(JSON.stringify(layouts, null, 2))
            );
            
            return true;
        } catch (error) {
            return false;
        }
    }
    
    getCurrentLayout(): EditorTab[] {
        const tabs: EditorTab[] = [];
        
        try {
            vscode.window.tabGroups.all.forEach(tabGroup => {
                tabGroup.tabs.forEach(tab => {
                    if (tab.input instanceof vscode.TabInputText) {
                        tabs.push({
                            uri: tab.input.uri.toString(),
                            viewColumn: tabGroup.viewColumn || 1,
                            isActive: tab.isActive
                        });
                    }
                });
            });
        } catch (error) { }
        
        return tabs;
    }
    
    async saveLayout(name: string): Promise<void> {
        try {
            if (!name || name.trim() === '') {
                vscode.window.showErrorMessage('Layout name cannot be empty');
                return;
            }
            
            const layouts = await this.readLayouts();
            const existingIndex = layouts.findIndex(l => l.name === name);
            
            const newLayout: TabLayout = {
                name,
                tabs: this.getCurrentLayout(),
                timestamp: Date.now()
            };
            
            if (existingIndex >= 0) {
                layouts[existingIndex] = newLayout;
            } else {
                layouts.push(newLayout);
            }
            
            const success = await this.writeLayouts(layouts);
            
            if (!success) {
                vscode.window.showErrorMessage(`Failed to save tab layout "${name}"`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error saving layout: ${error}`);
        }
    }
    
    async deleteLayout(name: string): Promise<void> {
        try {
            if (!name || name.trim() === '') {
                vscode.window.showErrorMessage('Layout name cannot be empty');
                return;
            }
            
            let layouts = await this.readLayouts();
            const initialCount = layouts.length;
            
            layouts = layouts.filter(l => l.name !== name);
            
            if (layouts.length < initialCount) {
                const success = await this.writeLayouts(layouts);
                
                if (!success) {
                    vscode.window.showErrorMessage(`Failed to delete tab layout "${name}"`);
                }
            } else {
                vscode.window.showErrorMessage(`Tab layout "${name}" not found`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error deleting layout: ${error}`);
        }
    }
    
    async restoreLayout(name: string): Promise<void> {
        try {
            if (!name || name.trim() === '') {
                vscode.window.showErrorMessage('Layout name cannot be empty');
                return;
            }
            
            const layouts = await this.readLayouts();
            const layout = layouts.find(l => l.name === name);
            
            if (!layout) {
                vscode.window.showErrorMessage(`Tab layout "${name}" not found`);
                return;
            }
            
            if (!layout.tabs || !Array.isArray(layout.tabs) || layout.tabs.length === 0) {
                vscode.window.showErrorMessage(`Tab layout "${name}" contains no tabs`);
                return;
            }
            
            await vscode.commands.executeCommand('workbench.action.closeAllEditors');
            
            for (const tab of layout.tabs) {
                try {
                    if (!tab.uri) continue;
                    
                    const document = await vscode.workspace.openTextDocument(vscode.Uri.parse(tab.uri));
                    await vscode.window.showTextDocument(document, { 
                        viewColumn: tab.viewColumn, 
                        preview: false 
                    });
                } catch (error) { }
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error restoring layout: ${error}`);
        }
    }
    
    private async showSaveDialog(): Promise<void> {
        try {
            const name = await vscode.window.showInputBox({
                placeHolder: 'Enter name to save current layout',
                prompt: 'Save current tab layout as...',
                validateInput: (value) => {
                    return value && value.trim() !== '' ? null : 'Layout name cannot be empty';
                }
            });
            
            if (name) {
                await this.saveLayout(name);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error in save dialog: ${error}`);
        }
    }
    
    private async showDeleteDialog(): Promise<void> {
        try {
            const layouts = await this.readLayouts();
            
            if (!layouts || layouts.length === 0) {
                vscode.window.showErrorMessage('No saved layouts to delete');
                return;
            }
            
            const items = layouts.map(layout => ({
                label: layout.name,
                description: new Date(layout.timestamp).toLocaleString(),
                detail: `${layout.tabs ? layout.tabs.length : 0} tab(s)`
            }));
            
            const selected = await vscode.window.showQuickPick(items, {
                placeHolder: 'Select a layout to delete'
            });
            
            if (selected) {
                await this.deleteLayout(selected.label);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error in delete dialog: ${error}`);
        }
    }
    
    async openTabLayoutMenu(): Promise<void> {
        try {
            const layouts = await this.readLayouts();
            
            const quickPick = vscode.window.createQuickPick();
            quickPick.placeholder = 'Select to restore, $ to save, % to delete';
            
            if (layouts && layouts.length > 0) {
                const items = layouts.map(layout => ({
                    label: layout.name,
                    description: new Date(layout.timestamp).toLocaleString(),
                    detail: `${layout.tabs ? layout.tabs.length : 0} tab(s)`
                }));
                quickPick.items = items;
            } else {
                quickPick.items = [{ 
                    label: 'No saved layouts', 
                    description: 'Type $ to save your current layout' 
                }];
            }
            
            quickPick.onDidChangeValue((value: string) => {
                if (value === '$') {
                    quickPick.hide();
                    this.showSaveDialog();
                } else if (value === '%') {
                    quickPick.hide();
                    this.showDeleteDialog();
                }
            });
            
            quickPick.onDidAccept(async () => {
                const selected = quickPick.selectedItems[0];
                const value = quickPick.value;
                
                quickPick.hide();
                
                try {
                    if (value.startsWith('$')) {
                        const name = value.substring(1).trim();
                        if (name) {
                            await this.saveLayout(name);
                        }
                    } else if (value.startsWith('%')) {
                        const name = value.substring(1).trim();
                        if (name) {
                            await this.deleteLayout(name);
                        }
                    } else if (selected && selected.label !== 'No saved layouts') {
                        await this.restoreLayout(selected.label);
                    } else if (value.trim() && value !== '$' && value !== '%') {
                        await this.restoreLayout(value.trim());
                    }
                } catch (error) {
                    vscode.window.showErrorMessage(`Error processing selection: ${error}`);
                }
            });
            
            quickPick.show();
        } catch (error) {
            vscode.window.showErrorMessage(`Error opening tab layout menu: ${error}`);
        }
    }
}