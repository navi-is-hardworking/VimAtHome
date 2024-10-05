import * as common from "../common";
import * as editor from "../utils/editor";
import Seq from "../utils/seq";
import * as vscode from "vscode";
import * as ranges from "../utils/selectionsAndRanges";
let outputChannel = vscode.window.createOutputChannel("_Jump");

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
                margin: `-0.5ch 0.4ch 0 0`,
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
    private jumpType: string | undefined

    constructor(private readonly context: common.ExtensionContext) {
        this.jumpCodes = context.config.jump.characters.split("");
        this.jumpType = undefined;
        
    }

    async jump(jumpLocations: {
        kind: common.JumpPhaseType;
        locations: Seq<vscode.Position>;
    }): Promise<vscode.Position | undefined> {

        outputChannel.appendLine("JumpInterface.jump()");
        // What mode am I in?
        switch (jumpLocations.kind) {
            case "dual-phase": {
                const targetChar = await editor.inputBoxChar(
                    "Enter the first character"
                );

                if (!targetChar) {
                    return undefined;
                }

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
                const codedLocations = jumpLocations.locations
                    .zipWith(this.jumpCodes)
                    .toArray();

                this.drawJumpCodes(codedLocations);

                const targetChar = await editor.inputBoxChar(
                    "Enter the jump character"
                );

                this.removeJumpCodes();

                if (!targetChar) {
                    return undefined;
                }

                return codedLocations.find(([location, jumpCode]) => {
                    if (jumpCode === targetChar) {
                        return location;
                    }
                })?.[0];
            }
        }
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

    async zoomJump(jumpLocations: {
        locations: Seq<vscode.Position>;
    }): Promise<vscode.Position | undefined> {
        const codedLocations = jumpLocations.locations
            .zipWith(this.jumpCodes)
            .toArray();

        this.drawZoomJumpCodes(codedLocations);

        const targetChar = await editor.inputBoxChar(
            "Enter the zoom jump character"
        );

        this.removeJumpCodes();

        if (!targetChar) {
            return undefined;
        }

        return codedLocations.find(([location, jumpCode]) => {
            if (jumpCode === targetChar) {
                return location;
            }
        })?.[0];
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

    private removeJumpCodes() {
        this.context.editor.setDecorations(jumpCodeDecorationType, []);
    }


}
