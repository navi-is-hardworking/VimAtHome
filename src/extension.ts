import * as vscode from "vscode";
import { registeredCommands } from "./commands";
import { loadConfig } from "./config";
import * as cache from "./historyCache";
import CodeFleaManager from "./CodeFleaManager";
let outputChannel = vscode.window.createOutputChannel("codeFlea.extension.ts");

export function activate(context: vscode.ExtensionContext) {
    const config = loadConfig();
    const manager = new CodeFleaManager(config);
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

        const selectedText = e.textEditor.document.getText(e.selections[0]);
        if (selectedText !== lastSelectedText && selectedText.length > 0) {
            // outputChannel.appendLine(selectedText);
            lastSelectedText = selectedText;
            cache.cacheContent(selectedText);
            // cache.parseTop("WORD"); 
            // outputChannel.appendLine("cache = " + JSON.stringify(cache.getParsedData()));

        }
        outputChannel.appendLine('---');
    });
    
    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration("codeFlea")) {
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
