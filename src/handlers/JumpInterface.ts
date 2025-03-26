import * as common from "../common";
import * as editor from "../utils/editor";
import Seq from "../utils/seq";
import * as vscode from "vscode";
import * as ranges from "../utils/selectionsAndRanges";
import { InlineInput } from "../utils/inlineInput"; // Adjust path as needed

type JumpPhase = {
    kind: common.JumpPhaseType;
    locations: Seq<vscode.Position>;
};

export default class JumpInterface implements vscode.Disposable {
    private jumpCodes: string[];
    private inlineInput?: InlineInput;
    private decorationType: vscode.TextEditorDecorationType;
    private codedLocations: (readonly [vscode.Position, string])[] = [];
    private isSecondPhase = false;

    constructor(private readonly context: common.ExtensionContext) {
        this.jumpCodes = context.config.jump.characters.split("");
        this.decorationType = vscode.window.createTextEditorDecorationType({});
    }

    dispose() {
        this.removeDecorations();
        this.inlineInput?.destroy();
        this.decorationType.dispose();
    }

    private async getFoldedRanges(): Promise<vscode.Range[]> {
        const visibleRanges = this.context.editor.visibleRanges;
        const foldedRanges: vscode.Range[] = [];
        
        for (let i = 0; i < visibleRanges.length - 1; i++) {
            const currentRange = visibleRanges[i];
            const nextRange = visibleRanges[i + 1];
            if (currentRange.end.line + 1 < nextRange.start.line) {
                foldedRanges.push(new vscode.Range(currentRange.end, nextRange.start));
            }
        }
        
        return foldedRanges;
    }

    private isPositionInFoldedRange(position: vscode.Position, foldedRanges: vscode.Range[]): boolean {
        return foldedRanges.some(range => range.contains(position));
    }

    private async filterVisibleLocations(locations: Seq<vscode.Position>): Promise<Seq<vscode.Position>> {
        const foldedRanges = await this.getFoldedRanges();
        return locations.filter(position => !this.isPositionInFoldedRange(position, foldedRanges));
    }

    private removeDecorations() {
        this.context.editor.setDecorations(this.decorationType, []);
    }

    private updateActivity(activityState: { active: boolean }, locations?: Seq<vscode.Position>) {
        if (this.inlineInput) {
            const matches = this.isSecondPhase 
                ? this.codedLocations.length 
                : locations?.toArray().length ?? 0;
            const text = this.isSecondPhase ? "Enter jump target" : "Enter first character";
            activityState.active = !activityState.active;
            this.inlineInput.updateStatusBar(text, matches, activityState.active);
        }
    }

    async jump(jumpLocations: JumpPhase): Promise<vscode.Position | undefined> {
        return new Promise<vscode.Position | undefined>((resolve) => {
            try {
                const currentSelection = this.context.editor.selection;
                const activityState = { active: false };
                let statusInterval: NodeJS.Timer | undefined;
    
                const handleInput = async (_: string, char: common.Char) => {
                    if (jumpLocations.kind === "dual-phase" && !this.isSecondPhase) {
                        const matchingLocations = jumpLocations.locations.filterMap(
                            (p) => {
                                const matchChar = editor.charAt(
                                    this.context.editor.document,
                                    p
                                );
                                if (matchChar.toLowerCase() === char.toLowerCase()) {
                                    return p;
                                }
                            }
                        );
    
                        const remainingLocations = await this.filterVisibleLocations(matchingLocations);
                        this.isSecondPhase = true;
                        this.handleSinglePhase(remainingLocations, currentSelection.active);
                        this.updateActivity(activityState, remainingLocations);
                    } else {
                        if (this.codedLocations) {
                            const selectedLocation: vscode.Position|undefined = this.codedLocations.find(([_, code]) => code === char)?.[0];
                            if (selectedLocation) {
                                
                                let direction: common.Direction = common.Direction.forwards;
                                if (selectedLocation.line <= currentSelection.active.line) {
                                    if (selectedLocation.character < currentSelection.active.character) {
                                        direction = common.Direction.backwards;
                                    }
                                    else if (selectedLocation.line < currentSelection.active.line) {
                                        direction = common.Direction.backwards;
                                    }
                                }
                                
                                const targetChar = editor.charAt(this.context.editor.document, selectedLocation) as common.Char;
                                let subjectName = common.getLazyPassSubjectName();
                                if (subjectName) {
                                    common.setLastSkip({
                                        kind: "SkipTo",
                                        char: targetChar,
                                        subject: subjectName,
                                        direction: direction
                                    });
                                }
                            }
                            if (statusInterval) {
                                clearInterval(statusInterval);
                            }
                            resolve(selectedLocation);
                        }
                    }
                };
    
                const cleanup = () => {
                    if (statusInterval) {
                        clearInterval(statusInterval);
                    }
                    resolve(undefined);
                };
    
                if (jumpLocations.kind === "single-phase") {
                    this.handleSinglePhase(jumpLocations.locations, currentSelection.active);
                }
    
                this.inlineInput = new InlineInput({
                    textEditor: this.context.editor,
                    
                    onInput: handleInput,
                    onCancel: cleanup
                });
    
                this.updateActivity(activityState, jumpLocations.locations);
                statusInterval = setInterval(() => this.updateActivity(activityState, jumpLocations.locations), 800);
    
            } catch (error) {
                console.error(error);
                resolve(undefined);
            }
        }).finally(() => {
            this.dispose();
        });
    }

    private async handleSinglePhase(
        locations: Seq<vscode.Position>, 
        cursorPosition: vscode.Position,
    ) {
        const visibleLocations = await this.filterVisibleLocations(locations);
        this.codedLocations = this.assignJumpCodes(visibleLocations, cursorPosition);
        this.drawJumpCodes(this.codedLocations);
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

    private createDecorationOption(decorationRange: vscode.Range, text: string) {
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

    private drawJumpCodes(jumpLocations: (readonly [vscode.Position, string])[]) {
        const decorations = jumpLocations.map(([position, code]) =>
            this.createDecorationOption(
                ranges.positionToRange(position),
                code.toString()
            )
        );

        this.removeDecorations();
        this.context.editor.setDecorations(this.decorationType, decorations);
    }

    async zoomJump(jumpLocations: { locations: Seq<vscode.Position>; }): Promise<vscode.Position | undefined> {
        return new Promise<vscode.Position | undefined>((resolve) => {
            try {
                this.filterVisibleLocations(jumpLocations.locations).then(visibleLocations => {
                    this.codedLocations = visibleLocations
                        .zipWith(this.jumpCodes)
                        .toArray();

                    this.drawZoomJumpCodes(this.codedLocations);

                    const handleInput = (_: string, char: common.Char) => {
                        const selectedLocation = this.codedLocations.find(([_, code]) => code === char)?.[0];
                        resolve(selectedLocation);
                    };

                    this.inlineInput = new InlineInput({
                        textEditor: this.context.editor,
                        onInput: handleInput,
                        onCancel: () => resolve(undefined)
                    });

                    if (this.inlineInput) {
                        this.inlineInput.updateStatusBar("Enter jump target", this.codedLocations.length, true);
                    }
                });
            } catch (error) {
                console.error(error);
                resolve(undefined);
            }
        }).finally(() => {
            this.dispose();
        });
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

    private drawZoomJumpCodes(jumpLocations: (readonly [vscode.Position, string])[]) {
        const jumpCodeDecorations = jumpLocations.map(([position, code]) =>
            this.createZoomJumpDecorationOption(
                ranges.positionToRange(position),
                code.toString()
            )
        );

        this.removeDecorations();
        this.context.editor.setDecorations(this.decorationType, jumpCodeDecorations);
    }
}