import * as vscode from "vscode";
import * as child_process from 'child_process';
import * as os from 'os';
import * as path from 'path';

export class Terminal {
    private working_directory: string | null;
    
    constructor() {
        this.working_directory = vscode.workspace.workspaceFolders ? 
            vscode.workspace.workspaceFolders[0].uri.fsPath.replace(/\\/g, '/') : null;
    }

    private async executeCommand(command: string): Promise<{stdout: string, pwd: string}> {
        return new Promise((resolve, reject) => {
            const isWindows = os.platform() === 'win32';
            const commandWithPwd = `${command} && pwd`;
            const wslCommand = isWindows ? 
                `wsl bash -c "cd ${this.working_directory} && ${commandWithPwd}"` : 
                commandWithPwd;

            child_process.exec(wslCommand, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }

                const outputLines = stdout.trim().split('\n');
                const pwd = outputLines.pop() || '';
                const commandOutput = outputLines.join('\n');

                resolve({
                    stdout: commandOutput,
                    pwd: pwd.trim()
                });
            });
        });
    }

    async runLineAndAppendOutput() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        
        const document = editor.document;
        const commandLine = document.lineAt(editor.selection.anchor.line);
        
        const rawCommand = commandLine.text.trim();
        const command = rawCommand.startsWith('>') ? rawCommand.substring(1).trim() : rawCommand;
        
        const initialState = {
            command: command,
            indent: commandLine.text.match(/^\s*/)?.[0] || "",
            line: editor.selection.anchor.line
        };

        try {
            let { stdout, pwd } = await this.executeCommand(initialState.command);
            this.working_directory = pwd;
            
            await editor.edit(editBuilder => {
                const lastLine = document.lineCount - 1;
                const lastLineText = document.lineAt(lastLine).text;
                const endPosition = new vscode.Position(lastLine, lastLineText.length);
                
                const needsNewline = lastLineText.length > 0;
                const outputText = (needsNewline ? '\n' : '') +
                    (stdout ? this.formatOutput(stdout) + '\n\n' : '') +
                    `pwd: ${pwd}\n` +
                    '> ';
                
                editBuilder.insert(endPosition, outputText);
            });

            const newLastLine = document.lineCount - 1;
            const newPosition = new vscode.Position(newLastLine, 2);
            editor.selection = new vscode.Selection(newPosition, newPosition);
            
        } catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error executing command: ${error.message}`);
            }
        }
    }

    private formatOutput(output: string): string {
        return output.trim()
            .split('\n')
            .map(line => '    ' + line)
            .join('\n');
    }
    
    async runSelectionAndReplaceWithOutput() {
        if (!this.working_directory) {
            vscode.window.showErrorMessage(`Error executing command working_directory: ${this.working_directory} not found`);
            return;
        }
        
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No editor is active.');
            return;
        }
    
        const document = editor.document;
        const commandLine = editor.document.getText(editor.selection);
        
        const isWindows = os.platform() === 'win32';
        const command = commandLine.trim();
        
        const wslCommand = isWindows ? `wsl bash -c "cd ${this.working_directory} && ${command}"` : command;
    
        child_process.exec(wslCommand, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(`Error executing command: ${error.message}`);
                return;
            }
    
            editor.edit(editBuilder => {
                editBuilder.replace(editor.selection, stdout.trim());
            });
        });
    }
}