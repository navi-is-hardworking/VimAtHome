import * as common from "../common";
import * as editor from "../utils/editor";
import Seq from "../utils/seq";
import * as vscode from "vscode";
import * as ranges from "../utils/selectionsAndRanges";

// const outputChannel = vscode.window.createOutputChannel("JumpInterface");

function createDecorationOption(decorationRange: vscode.Range, text: string) {
    const extraProps = [
        "font-size:0.85em",
        "border-radius: 0.4ch",
        "line-height: 2ch",
        "vertical-align: middle",
        "position: absolute",
        "margin-top: -0.3ch",
    ].join(";");

    return <vscode.DecorationOptions>{
        range: decorationRange,
        renderOptions: {
            before: {
                color: "white",
                backgroundColor: "#0a0042",
                contentText: text,
                // margin: `-0.5ch 0.4ch 0 0`,
                margin: "0 0.4em 0 0",
                padding: `0.25ch 0.5ch`,
                textDecoration: ";" + extraProps,
                border: "1px solid white",
            },
        },
    };
}

const jumpCodeDecorationType = vscode.window.createTextEditorDecorationType({});

export default class JumpInterface {
    private jumpCodes: string[];

    constructor(private readonly context: common.ExtensionContext) {
        this.jumpCodes = context.config.jump.characters.split("");
    }

    async jump(jumpLocations: {
        kind: common.JumpPhaseType;
        locations: Seq<vscode.Position>;
    }): Promise<vscode.Position | undefined> {
        const currentSelection = this.context.editor.selection;
        // const currentText = this.context.editor.document.getText(currentSelection);
        // outputChannel.appendLine(`Current selection: "${currentText}" (${currentSelection.start.line}:${currentSelection.start.character} - ${currentSelection.end.line}:${currentSelection.end.character})`);


        switch (jumpLocations.kind) {
            case "dual-phase": {
                const targetChar = await editor.inputBoxChar("Enter the first character");
                if (!targetChar)
                    return undefined;
                
                const remainingLocations = jumpLocations.locations.filterMap(
                    (p) => {
                        const char = editor.charAt(
                            this.context.editor.document,
                            p
                        );

                        if (char.toLowerCase() === targetChar.toLowerCase()) {
                            return p;
                        }
                    }
                );

                return await this.jump({
                    kind: "single-phase",
                    locations: remainingLocations,
                });
            }
            case "single-phase": {
                const codedLocations = this.assignJumpCodes(jumpLocations.locations, currentSelection.active);
    
                this.drawJumpCodes(codedLocations);
                // this.logJumpLocations(codedLocations);
    
                const targetChar = await editor.inputBoxChar(
                    "Enter the jump character"
                );
    
                this.removeJumpCodes();
    
                if (!targetChar)
                    return undefined;
    
                const selectedLocation = codedLocations.find(([location, jumpCode]) => jumpCode === targetChar)?.[0];
                
                if (selectedLocation) {
                    // const fullSelection = this.getFullSelection(selectedLocation);
                    // outputChannel.appendLine(`Selected jump location: ${selectedLocation.line}:${selectedLocation.character}`);
                    // outputChannel.appendLine(`Full selection: "${fullSelection.text}" (${fullSelection.selection.start.line}:${fullSelection.selection.start.character} - ${fullSelection.selection.end.line}:${fullSelection.selection.end.character})`);
    
                    // Set last skip
                    const direction = selectedLocation.line > currentSelection.active.line ? common.Direction.forwards : common.Direction.backwards;
                    const char = editor.charAt(this.context.editor.document, selectedLocation) as common.Char;
                    
                    let subjectName = common.getLazyPassSubjectName();
                    if (subjectName !== undefined) {
                        common.setLastSkip({
                            kind: "SkipTo",
                            char: char,
                            subject: subjectName,
                            direction: direction
                        });
                    }
                }
    
                return selectedLocation;
            }
        }
    }
    
    private assignJumpCodes(locations: Seq<vscode.Position>, cursorPosition: vscode.Position): (readonly [vscode.Position, string])[] {
        const codedLocations: [vscode.Position, string][] = [];
        const usedCodes = new Set<string>();
        const symbolsBelow = new Set<string>();
        
        for (const position of locations) {
            const char = editor.charAt(this.context.editor.document, position);
            const isBelow = position.line > cursorPosition.line;
            
            if (/[a-zA-Z]/.test(char)) {
                let code = isBelow ? char.toLowerCase() : char.toUpperCase();
                if (!usedCodes.has(code)) {
                    usedCodes.add(code);
                    codedLocations.push([position, code]);
                } else {
                    codedLocations.push([position, '']);
                }
            } else if (isBelow && this.jumpCodes.includes(char) && !symbolsBelow.has(char)) {
                symbolsBelow.add(char);
                usedCodes.add(char);
                codedLocations.push([position, char]);
            } else {
                codedLocations.push([position, '']);
            }
        }
        
        let jumpCodeIndex = 0;
        for (let i = 0; i < codedLocations.length; i++) {
            if (codedLocations[i][1] === '') {
                while (jumpCodeIndex < this.jumpCodes.length && usedCodes.has(this.jumpCodes[jumpCodeIndex])) {
                    jumpCodeIndex++;
                }
                if (jumpCodeIndex < this.jumpCodes.length) {
                    codedLocations[i][1] = this.jumpCodes[jumpCodeIndex];
                    usedCodes.add(this.jumpCodes[jumpCodeIndex]);
                    jumpCodeIndex++;
                } else {
                    codedLocations.splice(i, 1);
                    i--;
                }
            }
        }
        
        return codedLocations;
    }


    private removeJumpCodes() {
        this.context.editor.setDecorations(jumpCodeDecorationType, []);
    }

    private drawJumpCodes(
        jumpLocations: (readonly [vscode.Position, string])[]
    ) {
        const decorations = jumpLocations.map(([position, code]) =>
            createDecorationOption(
                ranges.positionToRange(position),
                code.toString()
            )
        );

        this.context.editor.setDecorations(jumpCodeDecorationType, decorations);
    }

    // private logJumpLocations(
    //     jumpLocations: (readonly [vscode.Position, string])[]
    // ) {
    //     // outputChannel.appendLine("Jump Locations:");
    //     const currentSelection = this.context.editor.selection;

    //     jumpLocations.forEach(([position, code]) => {
    //         const relativePosition = this.getRelativePosition(currentSelection.active, position);
    //         const fullSelection = this.getFullSelection(position);
    //         // outputChannel.appendLine(`${code}: "${fullSelection.text}" (${position.line}:${position.character}, ${relativePosition})`);
    //     });
    // }

    // private getRelativePosition(current: vscode.Position, target: vscode.Position): string {
    //     const lineDiff = target.line - current.line;
    //     const charDiff = target.character - current.character;
    //     return `${lineDiff} lines, ${charDiff} characters`;
    // }

    getFullSelection(position: vscode.Position): { selection: vscode.Selection; text: string } {
        const wordRange = this.context.editor.document.getWordRangeAtPosition(position);
        let selection: vscode.Selection;
        let text: string;

        if (wordRange) {
            selection = new vscode.Selection(wordRange.start, wordRange.end);
            text = this.context.editor.document.getText(wordRange);
        } else {
            selection = new vscode.Selection(position, position);
            text = this.context.editor.document.getText(new vscode.Range(position, position.translate(0, 1)));
        }

        return { selection, text };
    }

    async zoomJump(jumpLocations: {
        locations: Seq<vscode.Position>;
    }): Promise<vscode.Position | undefined> {
        const codedLocations = jumpLocations.locations
            .zipWith(this.jumpCodes)
            .toArray();

        this.drawZoomJumpCodes(codedLocations);
        // this.logJumpLocations(codedLocations);

        const targetChar = await editor.inputBoxChar(
            "Enter the zoom jump character"
        );

        this.removeJumpCodes();

        if (!targetChar) {
            return undefined;
        }

        const selectedLocation = codedLocations.find(([location, jumpCode]) => jumpCode === targetChar)?.[0];

        if (selectedLocation) {
            // const fullSelection = this.getFullSelection(selectedLocation);
            // outputChannel.appendLine(`Selected zoom jump location: ${selectedLocation.line}:${selectedLocation.character}`);
            // outputChannel.appendLine(`Full selection: "${fullSelection.text}" (${fullSelection.selection.start.line}:${fullSelection.selection.start.character} - ${fullSelection.selection.end.line}:${fullSelection.selection.end.character})`);
        }

        return selectedLocation;
    }

    private createZoomJumpDecorationOption(decorationRange: vscode.Range, text: string) {
        const extraProps = [
            "font-size:2em",
            "border-radius: 0.5ch",
            "line-height: 2.5ch",
            "position: absolute",
            "left: 0",  // Align to the left
        ].join(";");

        return <vscode.DecorationOptions>{
            range: decorationRange,
            renderOptions: {
                before: {
                    color: "white",
                    backgroundColor: "blue",
                    contentText: text,
                    margin: `0`,
                    padding: `0 0.5ch`,
                    textDecoration: ";" + extraProps,
                    border: "2px solid white",
                },
            },
        };
    }

    private drawZoomJumpCodes(
        jumpLocations: (readonly [vscode.Position, string])[]
    ) {
        const jumpCodeDecorations = jumpLocations.map(([position, code]) =>
            this.createZoomJumpDecorationOption(
                ranges.positionToRange(position),
                code.toString()
            )
        );

        this.context.editor.setDecorations(jumpCodeDecorationType, jumpCodeDecorations);
    }
}