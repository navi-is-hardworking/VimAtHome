import * as vscode from "vscode";

 
let outputChannel = vscode.window.createOutputChannel("_VimAtHome");

export function log(message: string) {
  outputChannel.appendLine(message);
}