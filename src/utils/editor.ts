import * as vscode from "vscode";
import { char, QuickCommand } from "./quickMenus";
import * as common from "../common";
import * as lineUtils from "../utils/lines";

export function quickCommandPicker(
    commands: QuickCommand[]
): Promise<QuickCommand | undefined>;

export function quickCommandPicker(
    commands: QuickCommand[],
    freeEntryOptions: { label: string; detail: string }
): Promise<QuickCommand | string | undefined>;

export function quickCommandPicker(
    commands: QuickCommand[],
    freeEntryOptions?: { label: string; detail: string }
): Promise<QuickCommand | string | undefined> {
    return new Promise((resolve, reject) => {
        type QuickPickItem = vscode.QuickPickItem & {
            quickKey?: common.Char;
            displayOnly?: true;
        };

        const quickPick = vscode.window.createQuickPick<QuickPickItem>();

        const freeEntryItems = freeEntryOptions
            ? [
                  {
                      label: "",
                      kind: vscode.QuickPickItemKind.Separator,
                      displayOnly: true,
                  },
                  {
                      label: freeEntryOptions.label,
                      alwaysShow: true,
                      detail: freeEntryOptions.detail,
                      displayOnly: true,
                  },
              ]
            : [];

        quickPick.items = commands
            .map<vscode.QuickPickItem>((e) => {
                return {
                    quickKey: e.quickKey,
                    label: `[${e.quickKey}]`,
                    description: e.label,
                    execute: e.execute,
                };
            })
            .concat(...freeEntryItems);

        quickPick.onDidHide(() => {
            resolve(undefined);
            quickPick.dispose();
        });

        quickPick.onDidChangeValue((s) => {
            for (const option of commands) {
                if (option.quickKey === s) {
                    resolve(option);
                    quickPick.dispose();
                    return;
                }
            }

            if (!freeEntryOptions) {
                quickPick.value = "";
            }
        });

        quickPick.onDidAccept(() => {
            const selected = quickPick.selectedItems[0];

            if (selected.displayOnly) {
                if (quickPick.value) {
                    resolve(quickPick.value);
                } else {
                    return;
                }
            }

            for (const option of commands) {
                if (option.quickKey === selected.quickKey) {
                    resolve(option);
                    quickPick.dispose();
                    return;
                }
            }

            quickPick.dispose();
        });

        quickPick.show();
    });
}

export function inputBoxChar(
    placeholder?: string,
    allowEmpty = false
): Promise<common.Char | undefined> {
    return new Promise((resolve) => {
        const inputBox = vscode.window.createInputBox();

        inputBox.placeholder = placeholder;

        inputBox.onDidChangeValue((ch) => {
            resolve(ch[0] as common.Char);
            inputBox.dispose();
        });

        inputBox.onDidAccept(() => {
            if (!allowEmpty) {
                return;
            }
            resolve(undefined);
            inputBox.dispose();
        });

        inputBox.onDidHide(() => {
            resolve(undefined);
            inputBox.dispose();
        });

        inputBox.show();
    });
}

export function scrollEditor(direction: "up" | "down", lines: number) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        return;
    }

    const existingRange = editor.visibleRanges[0];

    const lineToReveal =
        direction === "up"
            ? Math.max(existingRange.start.line - lines, 0)
            : Math.min(
                  existingRange.end.line + lines,
                  editor.document.lineCount - 1
              );

    const newRange = new vscode.Range(lineToReveal, 0, lineToReveal, 0);

    editor.revealRange(newRange);
}

export function swap(
    document: vscode.TextDocument,
    edit: vscode.TextEditorEdit,
    origin: vscode.Range,
    target: vscode.Range
) {
    const originalText = document.getText(origin);
    const targetText = document.getText(target);

    edit.replace(target, originalText);
    edit.replace(origin, targetText);

    return target;
}

export function move(
    document: vscode.TextDocument,
    textEditorEdit: vscode.TextEditorEdit,
    rangeToMove: vscode.Range,
    newLocation: vscode.Position
) {
    const textToMove = document.getText(rangeToMove);

    textEditorEdit.delete(rangeToMove);
    textEditorEdit.insert(newLocation, textToMove);
}

export function goToLine(editor: vscode.TextEditor, lineNumber: number) {
    editor.selection = new vscode.Selection(lineNumber, 0, lineNumber, 0);
}

export function scrollToCursorAtCenter(editor: vscode.TextEditor) {
    let tempSelection = editor.selection;
    let start = editor.selection.start.line + 5;
    // outputchannel.appendLine(`start: ${start}`),
    tempSelection = new vscode.Selection(start, editor.selection.start.character, start, editor.selection.start.character);
    editor.revealRange(tempSelection, vscode.TextEditorRevealType.InCenter);
}

export function charAt(
    document: vscode.TextDocument,
    position: vscode.Position
): string {
    return document.getText(
        new vscode.Range(position, position.translate(0, 1))
    );
}

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
}

export async function updateEditorPosition(editor: vscode.TextEditor, lineNumber: number) {
    const virtualColumn = common.getVirtualColumn();
    const newPosition = new vscode.Position(lineNumber, virtualColumn);
    editor.selection = new vscode.Selection(newPosition, newPosition);
}

export async function nextIndentUp(editor: vscode.TextEditor, direction: common.Direction) {
    const document = editor.document;
    const currentPosition = editor.selection.active;
    const currentLine = document.lineAt(currentPosition.line);
    const currentIndentation = currentLine.firstNonWhitespaceCharacterIndex;

    let targetLine: vscode.TextLine | undefined;
    let lineIterator = lineUtils.iterLines(document, {
        startingPosition: currentPosition,
        direction: direction,
        currentInclusive: false,
    });

    for (const line of lineIterator) {
        if (line.text.trim().length >= 1 && line.firstNonWhitespaceCharacterIndex > currentIndentation) {
            targetLine = line;
            break;
        }
    }

    if (targetLine) {
        await updateEditorPosition(editor, targetLine.lineNumber);
    }
}

export function moveToNearestFunctionSymbol(symbols: vscode.DocumentSymbol[], position: vscode.Position): vscode.DocumentSymbol | undefined {
    let closestSymbol: vscode.DocumentSymbol | undefined;
    for (const symbol of symbols) {
        // direciton we want bounto be either <= for up or < + 1
        if (symbol.range.start.line <= position.line && 
            (symbol.kind === vscode.SymbolKind.Function || 
            symbol.kind === vscode.SymbolKind.Method || 
            symbol.kind === vscode.SymbolKind.Constructor)) {
            
            if (!closestSymbol || symbol.range.start.line > closestSymbol.range.start.line) {
                closestSymbol = symbol;
            }
        }

        if (symbol.children?.length) {
            const childSymbol = moveToNearestFunctionSymbol(symbol.children, position);
            if (childSymbol && (!closestSymbol || childSymbol.range.start.line > closestSymbol.range.start.line)) {
                closestSymbol = childSymbol;
            }
        }
    }
    
    return closestSymbol
}

export async function goToNearestSymbol(editor: vscode.TextEditor, direction: common.Direction): Promise<void> {
    const document = editor.document;
    const currentPosition = editor.selection.active;
    
    const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
        'vscode.executeDocumentSymbolProvider',
        document.uri
    );

    if (!symbols?.length) {
        let inc = direction === "forwards" ? 25 : -25;
        editor.selection = new vscode.Selection(
            editor.selection.active.with(editor.selection.active.line+inc), 
            editor.selection.anchor.with(editor.selection.anchor.line+inc)
        );
        return; 
    }
    
    const nearestSymbol = moveToNearestFunctionSymbol(symbols, currentPosition); 
    if (nearestSymbol) {
        const newPosition = direction === "forwards" ? nearestSymbol.range.start : nearestSymbol.range.end;
        editor.selection = new vscode.Selection(newPosition, newPosition);
    }
}

export async function goToEndOfLine(editor: vscode.TextEditor) {
    let lineNumber = editor.selection.active.line;
    editor.selection = new vscode.Selection(new vscode.Position(lineNumber, 1000), new vscode.Position(lineNumber, 1000));
}


