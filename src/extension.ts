import * as vscode from "vscode";
import { registeredCommands } from "./commands";
import { loadConfig } from "./config";
import * as cache from "./historyCache";
import VimAtHomeManager from "./VimAtHomeManager";
let outputChannel = vscode.window.createOutputChannel("vimAtHome.extension.ts");

export function activate(context: vscode.ExtensionContext) {
    const config = loadConfig();
    const manager = new VimAtHomeManager(config);
    const editor = vscode.window.activeTextEditor;
    
    
    if (editor) {
        manager.changeEditor(editor);
    }

    vscode.window.onDidChangeActiveTextEditor(async (editor) => {
        await manager.changeEditor(editor);
    });

    let lastSelectedText = '';

    vscode.window.onDidChangeTextEditorSelection(async (e) => {
        await manager.onDidChangeTextEditorSelection(e);

        // const selectedText = e.textEditor.document.getText(e.selections[0]);
        // if (selectedText !== lastSelectedText && selectedText.length > 0) {
        //     lastSelectedText = selectedText;
        // }

        // outputChannel.appendLine('---');
    });
    
    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration("vimAtHome")) {
            loadConfig();
        }
    });

    for (const command of registeredCommands) {
        context.subscriptions.push(
            vscode.commands.registerCommand(command.id, (...args) =>
                command.execute(manager, ...args)
            )
        );
    }

}
