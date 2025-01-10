import * as vscode from "vscode";
import { IsWordWrapEnabled, GetWordWrapColumn } from "../config";
import * as common from "../common";


export let outputChannel = vscode.window.createOutputChannel("Vah.lines");


export default class WrapIterator {

    private positions: vscode.Position[];
    private index: number;
    private direction: number;
    private lineLength: number;
    private linePadding: number;
    
    constructor(position: vscode.Position, direction: number, line: vscode.TextLine) {
        this.positions = [];
        this.direction = direction;
        this.lineLength = line.text.length;
        this.linePadding = line.firstNonWhitespaceCharacterIndex
        this.InitializePositions(position, this.lineLength);
        this.index = direction === 1 ? 0 : this.positions.length - 1;
        
        outputChannel.appendLine(`hasnext(): ${this.HasNext()}, positions.length: ${this.positions.length}, index: ${this.index}, direction: ${direction}`);
    }
    
    InitializePositions(position: vscode.Position, lineLength: number) {
        if (!IsWordWrapEnabled() || lineLength <= GetWordWrapColumn()) {
            this.positions = [position]
            outputChannel.appendLine(`Should only be one position ${this.positions.length}`);
            return;
        }
        
        outputChannel.appendLine(`virtual column: ${common.getVirtualColumn()}`);
        
        let numLines = Math.ceil(lineLength / GetWordWrapColumn());
        let posCounter = common.getVirtualColumn();
        for (let i = 0; i < numLines; i++) {
            const charPos = Math.min(Math.max(0, posCounter), lineLength);
            let tempPosition = new vscode.Position(position.line, charPos);
            this.positions.push(tempPosition);
            outputChannel.appendLine(`more than on adding position ${tempPosition.line}, ${tempPosition.character}`);
            posCounter += GetWordWrapColumn();
        }
    }
    
    SetInitialIndex(character: number) {
        this.index = Math.floor(character / GetWordWrapColumn());
        this.index = Math.max(0, this.index);
        this.index = Math.min(this.lineLength, this.index);
    }

    GetNext(): vscode.Position {
        if (this.index < 0 || this.index >= this.positions.length) {
            vscode.window.showErrorMessage(
                    `${this.index} is out of bounds of wrap iterator...`
                );
        }
        
        let retPos = this.positions[this.index];
        this.index += this.direction;
        outputChannel.appendLine(`returning positon ${retPos.line}, ${retPos.character}`);
        return retPos;
    }
    
    HasNext(): boolean {
        return (this.positions.length > 0) && (this.index >= 0) && (this.index < this.positions.length);
    }

}