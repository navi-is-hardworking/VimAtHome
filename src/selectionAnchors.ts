import * as vscode from "vscode";

export default class SelectionAnchor {
    private cachedSelection: vscode.Selection | undefined;
    private phantomDecoration: vscode.TextEditorDecorationType;
    private extendModeEnabled: boolean = false;
    
    constructor() {
        this.disposePhantomDecoration();
        this.phantomDecoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: "#09831566",
            border: '1px solid #4444FF40'
        });
    }


    ResetPhantomDecoration() {
        this.disposePhantomDecoration();
        this.phantomDecoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: "#09831566",
            border: '1px solid #4444FF40'
        });
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
        this.cachedSelection = selection;
    }

    SetLineSelectionAnchor(editor: vscode.TextEditor) {
        if (this.extendModeEnabled) return;
        
        const selection = editor.selection;
        if (!selection) return;
        
        const startLine = selection.start.line;
        const endLine = selection.end.line;
        
        const newSelection = new vscode.Selection(
            new vscode.Position(startLine, 0),
            new vscode.Position(endLine, editor.document.lineAt(endLine).text.length)
        );
        
        this.cachedSelection = newSelection;
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

    DeleteToAnchor(editor: vscode.TextEditor) {
        if (this.cachedSelection === undefined) return;
        
        this.SelectToAnchor(editor, true);
        editor.edit(editBuilder => {
            editBuilder.delete(editor.selection);
        });
    }

    SelectToAnchor(editor: vscode.TextEditor, force: boolean = false) {
        if ((!this.IsExtendModeOn() && !force) || this.cachedSelection === undefined) return;
        
        const newSelection = this.GetSelectionRangeFromAnchor(editor.selection);
        if (newSelection instanceof vscode.Range) {
            editor.selection = new vscode.Selection(newSelection.start, newSelection.end);
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
        if (this.phantomDecoration) {
            this.cachedSelection = undefined;
            vscode.window.activeTextEditor?.setDecorations(this.phantomDecoration, []);
        }
    }
    
    // ClearSelectionAnchor() {
    //     if (this.phantomDecoration) {
    //         this.cachedSelection = undefined;
    //         vscode.window.activeTextEditor?.setDecorations(this.phantomDecoration, []);
    //     }
    // }


}