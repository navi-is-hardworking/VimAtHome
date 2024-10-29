import * as common from "../common";
import * as editor from "../utils/editor";
import Seq from "../utils/seq";
import * as vscode from "vscode";
import * as ranges from "../utils/selectionsAndRanges";

const jumpDecorationTypes = {
    regular: vscode.window.createTextEditorDecorationType({}),
    zoom: vscode.window.createTextEditorDecorationType({})
};

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
                margin: "0 0.4em 0 0",
                padding: `0.25ch 0.5ch`,
                textDecoration: ";" + extraProps,
                border: "1px solid white",
            },
        },
    };
}

export default class JumpInterface implements vscode.Disposable {
    private jumpCodes: string[];

    constructor(private readonly context: common.ExtensionContext) {
        this.jumpCodes = context.config.jump.characters.split("");
    }

    dispose() {
        this.removeDecorations();
        jumpDecorationTypes.regular.dispose();
        jumpDecorationTypes.zoom.dispose();
    }

    private async getFoldedRanges(): Promise<vscode.Range[]> {
        const visibleRanges = this.context.editor.visibleRanges;
        const foldedRanges: vscode.Range[] = [];
        
        for (let i = 0; i < visibleRanges.length - 1; i++) {
            const currentRange = visibleRanges[i];
            const nextRange = visibleRanges[i + 1];
            if (currentRange.end.line + 1 < nextRange.start.line) {
                foldedRanges.push(new vscode.Range(
                    currentRange.end,
                    nextRange.start
                ));
            }
        }
        
        return foldedRanges;
    }

    private isPositionInFoldedRange(position: vscode.Position, foldedRanges: vscode.Range[]): boolean {
        if (!foldedRanges.length) return false;
        return foldedRanges.some(range => range.contains(position));
    }

    private async filterVisibleLocations(locations: Seq<vscode.Position>): Promise<Seq<vscode.Position>> {
        const foldedRanges = await this.getFoldedRanges();
        return locations.filter(position => !this.isPositionInFoldedRange(position, foldedRanges));
    }

    private removeDecorations() {
        this.context.editor.setDecorations(jumpDecorationTypes.regular, []);
        this.context.editor.setDecorations(jumpDecorationTypes.zoom, []);
    }

    async jump(jumpLocations: {
        kind: common.JumpPhaseType;
        locations: Seq<vscode.Position>;
    }): Promise<vscode.Position | undefined> {
        try {
            const currentSelection = this.context.editor.selection;

            switch (jumpLocations.kind) {
                case "dual-phase": {
                    const targetChar = await editor.inputBoxChar("Enter the first character");
                    if (!targetChar)
                        return undefined;
                    
                    const matchingLocations = jumpLocations.locations.filterMap(
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

                    const remainingLocations = await this.filterVisibleLocations(matchingLocations);

                    return await this.jump({
                        kind: "single-phase",
                        locations: remainingLocations
                    });
                }
                case "single-phase": {
                    const visibleLocations = await this.filterVisibleLocations(jumpLocations.locations);
                    const codedLocations = this.assignJumpCodes(visibleLocations, currentSelection.active);
        
                    this.drawJumpCodes(codedLocations);
        
                    const targetChar = await editor.inputBoxChar(
                        "Enter the jump character"
                    );
        
                    if (!targetChar)
                        return undefined;
        
                    const selectedLocation = codedLocations.find(([location, jumpCode]) => jumpCode === targetChar)?.[0];
                    
                    if (selectedLocation) {
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
        } finally {
            this.removeDecorations();
        }
    }
    
    private assignJumpCodes(locations: Seq<vscode.Position>, cursorPosition: vscode.Position): (readonly [vscode.Position, string])[] {
        const codedLocations: [vscode.Position, string][] = [];
        const usedCodes = new Set<string>();
        const symbolsBelow = new Set<string>();
        
        for (const position of locations) {
            const char = editor.charAt(this.context.editor.document, position);
            const isBelow = position.line > cursorPosition.line || 
                            (position.line === cursorPosition.line && position.character > cursorPosition.character);
            
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

    private drawJumpCodes(
        jumpLocations: (readonly [vscode.Position, string])[]
    ) {
        const decorations = jumpLocations.map(([position, code]) =>
            createDecorationOption(
                ranges.positionToRange(position),
                code.toString()
            )
        );

        this.removeDecorations();
        this.context.editor.setDecorations(jumpDecorationTypes.regular, decorations);
    }

    async zoomJump(jumpLocations: {
        locations: Seq<vscode.Position>;
    }): Promise<vscode.Position | undefined> {
        try {
            const visibleLocations = await this.filterVisibleLocations(jumpLocations.locations);
            const codedLocations = visibleLocations
                .zipWith(this.jumpCodes)
                .toArray();

            this.drawZoomJumpCodes(codedLocations);

            const targetChar = await editor.inputBoxChar(
                "Enter the zoom jump character"
            );

            if (!targetChar) {
                return undefined;
            }

            return codedLocations.find((value: readonly [vscode.Position, string]) => value[1] === targetChar)?.[0];
        } finally {
            this.removeDecorations();
        }
    }

    private createZoomJumpDecorationOption(decorationRange: vscode.Range, text: string) {
        const extraProps = [
            "font-size:2em",
            "border-radius: 0.5ch",
            "line-height: 2.5ch",
            "position: absolute",
            "left: 0",
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

        this.removeDecorations();
        this.context.editor.setDecorations(jumpDecorationTypes.zoom, jumpCodeDecorations);
    }
}