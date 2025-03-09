import { config } from "process";
import { getExtendColor } from "./config";
import * as vscode from "vscode";
import * as ranges from "./utils/selectionsAndRanges";

export default class SelectionAnchor {
    private cachedSelection: vscode.Selection | undefined;
    private phantomDecoration: vscode.TextEditorDecorationType;
    private extendModeEnabled: boolean = false;
    private anchorDecorationType: vscode.TextEditorDecorationType;
    private editorChangeDisposable: vscode.Disposable | undefined;
    
    constructor() {
        this.disposePhantomDecoration();
        this.phantomDecoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: getExtendColor(),
            border: '1px solid #4444FF40'
        });
        
        this.anchorDecorationType = vscode.window.createTextEditorDecorationType({
            textDecoration: 'underline dotted green',
        });
        
        this.editorChangeDisposable = vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor && this.cachedSelection) {
                this.restoreDecorations(editor);
            }
        });
    }

    dispose() {
        this.disposePhantomDecoration();
        this.disposeAnchorDecoration();
        if (this.editorChangeDisposable) {
            this.editorChangeDisposable.dispose();
        }
    }

    ResetPhantomDecoration() {
        this.disposePhantomDecoration();
        this.phantomDecoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: getExtendColor(),
            border: '1px solid #4444FF40'
        });
        
        const editor = vscode.window.activeTextEditor;
        if (editor && this.cachedSelection) {
            this.restoreDecorations(editor);
        }
    }
    
    private restoreDecorations(editor: vscode.TextEditor) {
        if (!this.cachedSelection) return;
        
        editor.setDecorations(this.anchorDecorationType, [ranges.selectionToRange(this.cachedSelection)]);
        
        if (this.extendModeEnabled) {
            this.updatePhantomSelection(editor);
        }
    }
    
    EndExtendMode() {
        this.extendModeEnabled = false;
        this.ResetPhantomDecoration();
    }
    
    StartExtendMode() {
        this.extendModeEnabled = true;
        this.ResetPhantomDecoration();
    }
    
    IsExtendModeOn() {
        return this.extendModeEnabled;
    }
    
    IsInitialized() {
        return this.cachedSelection !== undefined;
    }

    disposePhantomDecoration() {
        if (this.phantomDecoration) {
            this.phantomDecoration.dispose();
        }
    }

    disposeAnchorDecoration() {
        if (this.anchorDecorationType) {
            this.anchorDecorationType.dispose();
        }
    }

    updatePhantomSelection(editor: vscode.TextEditor) {
        if (!this.extendModeEnabled || !this.cachedSelection || !this.phantomDecoration) return;

        const currentSelection = editor.selection;
        const phantomRange = this.GetSelectionRangeFromAnchor(currentSelection);
        
        if (phantomRange) {
            editor.setDecorations(this.phantomDecoration, [phantomRange]);
        } else {
            editor.setDecorations(this.phantomDecoration, []);
        }
    }

    SetSelectionAnchor(editor: vscode.TextEditor) {
        if (this.extendModeEnabled) return;
        
        const selection = editor.selection; 
        if (!selection) return;
        
        editor.setDecorations(this.anchorDecorationType, []);
        
        this.cachedSelection = selection;
        editor.setDecorations(this.anchorDecorationType, [ranges.selectionToRange(editor.selection)]);
    }

    SetLineSelectionAnchor(editor: vscode.TextEditor) {
        if (this.extendModeEnabled) return;
        
        const selection = editor.selection;
        if (!selection) return;
        
        editor.setDecorations(this.anchorDecorationType, []);
        
        const startLine = selection.start.line;
        const endLine = selection.end.line;
        
        const newSelection = new vscode.Selection(
            new vscode.Position(startLine, 0),
            new vscode.Position(endLine, editor.document.lineAt(endLine).text.length)
        );
        
        this.cachedSelection = newSelection;
        editor.setDecorations(this.anchorDecorationType, [ranges.selectionToRange(newSelection)]);
        this.updatePhantomSelection(editor);
    }

    MergeSelection(cachedSelection: vscode.Selection, selection: vscode.Selection) {
        let newActive = new vscode.Position(
            Math.min(selection.active.line, selection.anchor.line),
            Math.min(selection.active.character, selection.anchor.character)
        );
        let newAnchor = new vscode.Position(
            Math.max(cachedSelection.active.line, cachedSelection.anchor.line),
            Math.max(cachedSelection.active.character, cachedSelection.anchor.character)
        );

        return [newActive, newAnchor];
    }

    GetSelectionRangeFromAnchor(selection: vscode.Selection): vscode.Range | undefined {
        if (this.cachedSelection === undefined || !selection) return undefined;

        let newActive;
        let newAnchor;
        if (this.cachedSelection.active.line === selection.anchor.line) {
            newActive = new vscode.Position(
                selection.anchor.line, 
                Math.min(this.cachedSelection.active.character,
                this.cachedSelection.anchor.character,
                selection.anchor.character,
                selection.active.character)
            ); 
            newAnchor = new vscode.Position(
                selection.anchor.line, 
                Math.max(this.cachedSelection.active.character,
                this.cachedSelection.anchor.character,
                selection.anchor.character,
                selection.active.character)
            ); 
        } else if (selection.active.line < this.cachedSelection.active.line) {
            [newActive, newAnchor] = this.MergeSelection(this.cachedSelection, selection);
        } else {
            let [tempCachedSelection, tempSelection] = [selection, this.cachedSelection];
            [newActive, newAnchor] = this.MergeSelection(tempCachedSelection, tempSelection);
        }

        return new vscode.Range(newActive, newAnchor);
    }

    async DeleteToAnchor(editor: vscode.TextEditor) {
        if (this.cachedSelection === undefined) return;
        const anchoredRange = this.GetSelectionRangeFromAnchor(editor.selection);
        if (anchoredRange instanceof vscode.Range) {
            let newSelection = new vscode.Selection(anchoredRange.end, anchoredRange.start);
            
            await editor.edit(editBuilder => {
                editBuilder.delete(newSelection);
            });
        }
        editor.selection = new vscode.Selection(
            new vscode.Position(editor.selection.active.line, editor.selection.active.character), 
            new vscode.Position(editor.selection.active.line, editor.selection.active.character)
        );
        this.EndExtendMode();
    }

    async SelectToAnchorIfExtending(editor: vscode.TextEditor, force: boolean = false) {
        if ((!this.IsExtendModeOn() && !force) || this.cachedSelection === undefined) return;
        
        const newSelection = this.GetSelectionRangeFromAnchor(editor.selection);
        if (newSelection instanceof vscode.Range) {
            editor.selection = new vscode.Selection(newSelection.end, newSelection.start);
        }
        
        this.EndExtendMode();
    }
    
    MoveLinesUp(editor: vscode.TextEditor) {
        if (this.cachedSelection === undefined) return;
        
        const newSelection = this.GetSelectionRangeFromAnchor(editor.selection);
        if (newSelection instanceof vscode.Range) {
            editor.edit(editBuilder => {
                editBuilder.delete(newSelection);
                editBuilder.insert(newSelection.start.translate(-1, 0), editor.document.getText(newSelection));
            });
        }
    }
    
    MoveLinesDown(editor: vscode.TextEditor) {
        if (this.cachedSelection === undefined) return;
        
        const newSelection = this.GetSelectionRangeFromAnchor(editor.selection);
        if (newSelection instanceof vscode.Range) {
            editor.edit(editBuilder => {
                editBuilder.delete(newSelection);
                editBuilder.insert(newSelection.end.translate(1, 0), editor.document.getText(newSelection));
            });
        }   
    }
    
    ClearSelectionAnchor() {
        this.cachedSelection = undefined;
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            activeEditor.setDecorations(this.phantomDecoration, []);
            activeEditor.setDecorations(this.anchorDecorationType, []);
        }
    }
    
    GetSelectionAnchor(): vscode.Selection | undefined {
        return this.cachedSelection;
    }
}