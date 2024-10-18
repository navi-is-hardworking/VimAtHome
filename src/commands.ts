import * as vscode from "vscode";
import * as editor from "./utils/editor";
import type VimAtHomeManager from "./VimAtHomeManager";
import { collapseSelections } from "./utils/selectionsAndRanges";
import { Direction } from "./common";
import { setWordDefinition, nextWordDefinition, prevWordDefinition } from "./config";
import * as path from 'path';
import { HighlightManager } from './handlers/HighlightManager';
import * as cacheCommands from "./CacheCommands";


const highlightManager = new HighlightManager();

function fuzzyMatch(pattern: string, str: string): { matched: boolean; score: number } {
    let score = 0;
    let patternIdx = 0;
    let strIdx = 0;
    let patternLength = pattern.length;
    let strLength = str.length;

    while (patternIdx < patternLength && strIdx < strLength) {
        if (pattern[patternIdx].toLowerCase() === str[strIdx].toLowerCase()) {
            score += 1 / (strIdx + 1);  // Higher score for earlier matches
            patternIdx++;
        }
        strIdx++;
    }

    return {
        matched: patternIdx === patternLength,
        score: score,
    };
}

type ExtensionCommand = {
    id: string;
    execute: (manager: VimAtHomeManager, ...args: any[]) => Promise<void>;
};

export const registeredCommands: ExtensionCommand[] = [
    {
        id: "vimAtHome.swapSubjectUp",
        execute: async (manager) => {
            await manager.executeSubjectCommand("swapWithObjectAbove");
        },
    },
    {
        id: "vimAtHome.swapSubjectDown",
        execute: async (manager) => {
            await manager.executeSubjectCommand("swapWithObjectBelow");
        },
    },
    {
        id: "vimAtHome.swapSubjectLeft",
        execute: async (manager) => {
            await manager.executeSubjectCommand("swapWithObjectToLeft");
        },
    },
    {
        id: "vimAtHome.swapSubjectRight",
        execute: async (manager) => {
            await manager.executeSubjectCommand("swapWithObjectToRight");
        },
    },
    {
        id: "vimAtHome.addSubjectUp",
        execute: async (manager) => {
            await manager.executeSubjectCommand("addObjectAbove");
        },
    },
    {
        id: "vimAtHome.addSubjectDown",
        execute: async (manager) => {
            await manager.executeSubjectCommand("addObjectBelow");
        },
    },
    {
        id: "vimAtHome.addSubjectLeft",
        execute: async (manager) => {
            await manager.executeSubjectCommand("addObjectToLeft");
        },
    },
    {
        id: "vimAtHome.addSubjectRight",
        execute: async (manager) => {
            await manager.executeSubjectCommand("addObjectToRight");
        },
    },
    {
        id: "vimAtHome.nextSubjectRight",
        execute: async (manager) => {
            await manager.executeSubjectCommand("nextObjectRight");
        },
    },
    {
        id: "vimAtHome.nextSubjectLeft",
        execute: async (manager) => {
            await manager.executeSubjectCommand("nextObjectLeft");
        },
    },
    {
        id: "vimAtHome.nextSubjectUp",
        execute: async (manager) => {
            await manager.executeSubjectCommand("nextObjectUp");
        },
    },
    {
        id: "vimAtHome.nextSubjectDown",
        execute: async (manager) => {
            await manager.executeSubjectCommand("nextObjectDown");
        },
    },
    {
        id: "vimAtHome.deleteSubject",
        execute: async (manager) => {
            await manager.executeSubjectCommand("deleteObject");
        },
    },
    {
        id: "vimAtHome.duplicateSubject",
        execute: async (manager) => {
            await manager.executeSubjectCommand("duplicateObject");
        },
    },
    {
        id: "vimAtHome.changeToPreviousSubject",
        execute: async (manager) => {},
    },
    {
        id: "vimAtHome.changeToBracketSubject",
        execute: async (manager) => {
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "BRACKETS",
            });
        },
    },
    {
        id: "vimAtHome.jumpToBracketSubject",
        execute: async (manager: VimAtHomeManager) => {
            manager.jumpToSubject('BRACKETS');
        },
    },
    {
        id: "vimAtHome.changeToWordSubject",
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(0);
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "WORD",
                subjectRegex: 0,
            });
        },
    },
    {
        id: "vimAtHome.jumpToWordSubject",
        execute: async (manager: VimAtHomeManager) => {
            manager.jumpToSubject('WORD');
        },
    },
    {
        id: "vimAtHome.nextWordDefinition",
        execute: async (manager: VimAtHomeManager) => {
            nextWordDefinition();
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "WORD",
            });
        },
    },
    {
        id: "vimAtHome.prevWordDefinition",
        execute: async (manager: VimAtHomeManager) => {
            prevWordDefinition();
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "WORD",
            });
        },
    },
    {
        id: "vimAtHome.changeToCustomWord1",
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(1);
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "WORD",
            });
        },
    },
    {
        id: "vimAtHome.jumpToCustomWord1",
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(1);
            manager.jumpToSubject('WORD');
        },
    },
    {
        id: "vimAtHome.changeToCustomWord2",
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(2);
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "WORD",
            });
        },
    },
    {
        id: "vimAtHome.jumpToCustomWord2",
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(2);
            manager.jumpToSubject('WORD');
        },
    },
    {
        id: "vimAtHome.changeToCustomWord3",
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(3);
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "WORD",
            });
        },
    },
    {
        id: "vimAtHome.jumpToCustomWord3",
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(3);
            manager.jumpToSubject('WORD');
        },
    },

    {
        id: "vimAtHome.changeToCustomWord4",
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(4);
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "WORD",
            });
        },
    },
    {
        id: "vimAtHome.jumpToCustomWord4",
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(4);
            manager.jumpToSubject('WORD');
        },
    },
    {
        id: "vimAtHome.changeToCustomWord5",
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(5);
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "WORD",
            });
        },
    },
    {
        id: "vimAtHome.jumpToCustomWord5",
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(5);
            manager.jumpToSubject('WORD');
        },
    },
    {
        id: "vimAtHome.changeToCustomWord6",
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(6);
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "WORD",
            });
        },
    },
    {
        id: "vimAtHome.jumpToCustomWord6",
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(6);
            manager.jumpToSubject('WORD');
        },
    },

    {
        id: "vimAtHome.changeToLineSubject",
        execute: async (manager: VimAtHomeManager) => {
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "LINE",
            });
        },
    },
    {
        id: "vimAtHome.jumpToLineSubject",
        execute: async (manager: VimAtHomeManager) => {
            manager.jumpToSubject('LINE');
        },
    },
    {
        id: "vimAtHome.changeToInterwordSubject",
        execute: async (manager: VimAtHomeManager) => {
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "INTERWORD",
            });
        },
    },
    {
        id: "vimAtHome.changeToSubwordSubject",
        execute: async (manager: VimAtHomeManager) => {
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "SUBWORD",
            });
        },
    },
    {
        id: "vimAtHome.changeToHalfBracketSubjectRight",
        execute: async (manager: VimAtHomeManager) => {
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "BRACKETS",
                half: "RIGHT"
            });
        },
    },
    {
        id: "vimAtHome.changeToHalfBracketSubjectLeft",
        execute: async (manager: VimAtHomeManager) => {
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "BRACKETS",
                half: "LEFT"
            });
        },
    },
    {
        id: "vimAtHome.changeToHalfLineSubjectRight",
        execute: async (manager: VimAtHomeManager) => {
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "LINE",
                half: "RIGHT"
            });
        },
    },
    {
        id: "vimAtHome.changeToHalfLineSubjectLeft",
        execute: async (manager: VimAtHomeManager) => {
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "LINE",
                half: "LEFT"
            });
        },
    },
    {
        id: "vimAtHome.changeToCharSubject",
        execute: async (manager: VimAtHomeManager) => {
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "CHAR",
            });
        },
    },
    {
        id: "vimAtHome.changeToBlockSubject",
        execute: async (manager: VimAtHomeManager) => {
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "BLOCK",
            });
        },
    },
    {
        id: "vimAtHome.jumpToBlockSubject",
        execute: async (manager: VimAtHomeManager) => {
            manager.jumpToSubject('BLOCK');
        },
    },
    {
        id: "vimAtHome.changeToInsertMode",
        execute: async (manager: VimAtHomeManager) => {
            manager.changeMode({ kind: "INSERT" });
        },
    },
    {
        id: "vimAtHome.changeToCommandModeDefault",
        execute: async (manager: VimAtHomeManager) => {
            manager.changeMode({
                kind: "COMMAND",
                subjectName: manager.config.defaultSubject,
            });
        },
    },
    {
        id: "vimAtHome.changeToCommandModeLast",
        execute: async (manager: VimAtHomeManager) => {
            manager.changeMode({
                kind: "COMMAND",
            });
        },
    },
    {
        id: "vimAtHome.changeToExtendMode",
        execute: async (manager: VimAtHomeManager) => {
            manager.changeMode({
                kind: "EXTEND",
                subjectName: "WORD",
            });
        },
    },
    {
        id: "vimAtHome.jump",
        execute: async (manager: VimAtHomeManager) => {
            manager.jump();
        },
    },
    {
        id: "vimAtHome.scrollToCursor",
        execute: async (manager: VimAtHomeManager) => {
            editor.scrollToCursorAtCenter(manager.editor);
        },
    },
    {
        id: "vimAtHome.changeToInsertModeAppend",
        execute: async (manager) => {
            collapseSelections(manager.editor, "end");
            return manager.changeMode({ kind: "INSERT" });
        },
    },
    {
        id: "vimAtHome.appendNewObject",
        execute: async (manager) => {
            await manager.executeSubjectCommand("appendNew");
            await manager.changeMode({ kind: "INSERT" });
        },
    },
    {
        id: "vimAtHome.prependNewObject",
        execute: async (manager) => {
            await manager.executeSubjectCommand("prependNew");
            await manager.changeMode({ kind: "INSERT" });
        },
    },
    {
        id: "vimAtHome.changeToInsertModeMidPoint",
        execute: async (manager) => {
            collapseSelections(manager.editor, "midpoint");
            manager.changeMode({ kind: "INSERT" });
        },
    },
    {
        id: "vimAtHome.changeToInsertModeSurround",
        execute: async (manager) => {
            collapseSelections(manager.editor, "surround");
            manager.changeMode({ kind: "INSERT" });
        },
    },
    {
        id: "vimAtHome.changeToInsertModePrepend",
        execute: async (manager) => {
            collapseSelections(manager.editor, "start");
            manager.changeMode({ kind: "INSERT" });
        },
    },
    {
        id: "vimAtHome.repeatLastSkip",
        execute: async (manager) => {
            // TODO: switch to last mode if not already in it
            await manager.repeatLastSkip(Direction.forwards);
        },
    },
    {
        id: "vimAtHome.repeatLastSkipBackwards",
        execute: async (manager) => {
            // TODO: switch to last mode if not already in it
            await manager.repeatLastSkip(Direction.backwards);
        },
    },
    {
        id: "vimAtHome.skip",
        execute: async (manager) => {
            // TODO: cache direction
            await manager.skip(Direction.forwards);
        },
    },
    {
        id: "vimAtHome.skipBackwards",
        execute: async (manager) => {
            // TODO: cache direction
            await manager.skip(Direction.backwards);
        },
    },
    {
        id: "vimAtHome.skipOver",
        execute: async (manager) => {
            await manager.skipOver(Direction.forwards);
        },
    },
    {
        id: "vimAtHome.skipToCenterWord",
        execute: async (manager) => {
            await manager.skipToCenterWord();
        },
    },
    {
        id: "vimAtHome.skipOverBackwards",
        execute: async (manager) => {
            await manager.skipOver(Direction.backwards);
        },
    },
    {
        id: "vimAtHome.openSpaceMenu",
        execute: async (manager) => {
            await manager.openSpaceMenu();
        },
    },
    {
        id: "vimAtHome.openGoToMenu",
        execute: async (manager) => {
            await manager.openGoToMenu();
        },
    },
    {
        id: "vimAtHome.openSubjectMenu",
        execute: async (manager) => {
            await manager.openSubjectMenu();
        },
    },
    {
        id: "vimAtHome.goToFirstSubjectInScope",
        execute: async (manager) => {
            await manager.executeSubjectCommand("firstObjectInScope");
        },
    },
    {
        id: "vimAtHome.goToLastSubjectInScope",
        execute: async (manager) => {
            await manager.executeSubjectCommand("lastObjectInScope");
        },
    },
    {
        id: "vimAtHome.customVsCodeCommand",
        execute: async (manager) => {
            await manager.customVsCodeCommand();
        },
    },
    {
        id: "vimAtHome.change",
        execute: async (manager) => {
            await manager.changeMode({ kind: "INSERT" });
            await vscode.commands.executeCommand("deleteLeft");
        },
    },
    {
        id: "vimAtHome.changeToLineEnd",
        execute: async (manager) => {
            collapseSelections(manager.editor, "start");
            await vscode.commands.executeCommand("deleteAllRight");
        },
    },
    {
        id: "vimAtHome.scrollEditorUp",
        execute: async (manager: VimAtHomeManager) => {
            editor.scrollEditor("up", manager.config.scrollStep);
        },
    },
    {
        id: "vimAtHome.scrollEditorDown",
        execute: async (manager: VimAtHomeManager) => {
            editor.scrollEditor("down", manager.config.scrollStep);
        },
    },
    {
        id: "vimAtHome.newLineBelow",
        execute: async (manager) => {
            collapseSelections(manager.editor, "end");
            manager.changeMode({ kind: "INSERT" });
            await vscode.commands.executeCommand(
                "editor.action.insertLineAfter"
            );
        },
    },
    {
        id: "vimAtHome.newLineAbove",
        execute: async (manager) => {
            collapseSelections(manager.editor, "start");
            manager.changeMode({ kind: "INSERT" });
            await vscode.commands.executeCommand(
                "editor.action.insertLineBefore"
            );
        },
    },
    {
        id: "vimAtHome.goToPrevOccurrence",
        execute: async (manager: VimAtHomeManager) => {
            manager.executeSubjectCommand("prevOccurrenceOfObject");
        },
    },
    {
        id: "vimAtHome.goToNextOccurrence",
        execute: async (manager: VimAtHomeManager) => {
            manager.executeSubjectCommand("nextOccurrenceOfObject");
        },
    },
    {
        id: "vimAtHome.extendToPrevOccurrence",
        execute: async (manager: VimAtHomeManager) => {
            manager.executeSubjectCommand("extendPrevOccurrenceOfObject");
        },
    },
    {
        id: "vimAtHome.extendToNextOccurrence",
        execute: async (manager: VimAtHomeManager) => {
            manager.executeSubjectCommand("extendNextOccurrenceOfObject");
        },
    },
    {
        id: "vimAtHome.openModifyMenu",
        execute: async (manager) => {
            await manager.openModifyMenu();
        },
    },
    {
        id: "vimAtHome.openViewMenu",
        execute: async (manager) => {
            await manager.openViewMenu();
        },
    },
    {
        id: "vimAtHome.undoCursorCommand",
        execute: async (manager) => {
            await manager.undoLastCommand();
        },
    },
    {
        id: "vimAtHome.undoCommand",
        execute: async (manager) => {
            await manager.undo();
        },
    },
    {
        id: "vimAtHome.flipCaseFirstCharacter",
        execute: async (manager) => {
            await manager.executeModifyCommand("flipCaseFirstCharacter");
        },
    },
    {
        id: "vimAtHome.transformToCamelCase",
        execute: async (manager) => {
            await manager.executeModifyCommand("transformToCamelCase");
        },
    },

    {
        id: "vimAtHome.pullSubword",
        execute: async (manager: VimAtHomeManager) => {
            manager.pullSubject('SUBWORD');
        },
    },
    {
        id: "vimAtHome.pullWord",
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(0);
            manager.pullSubject('WORD');
        },
    },
    {
        id: "vimAtHome.pullCustomWord1",
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(1);
            manager.pullSubject('WORD');
        },
    },
    {
        id: "vimAtHome.pullCustomWord2",
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(2);
            manager.pullSubject('WORD');
        },
    },
    {
        id: "vimAtHome.pullCustomWord3",
        execute: async (manager: VimAtHomeManager) => { // 
            setWordDefinition(3);
            manager.pullSubject('WORD');
        },
    },
    {
        id: "vimAtHome.pullBracketSubject",
        execute: async (manager: VimAtHomeManager) => {
            manager.pullSubject('BRACKETS');
        },
    },
    {
        id: "vimAtHome.pullLineSubject",
        execute: async (manager: VimAtHomeManager) => {
            manager.pullSubject('LINE');
        },
    },
    {
        id: "vimAtHome.pullBlockSubject",
        execute: async (manager: VimAtHomeManager) => {
            manager.pullSubject('BLOCK');
        },
    },
    {
        id: "vimAtHome.openTerminalAtFilePath",
        execute: async () => {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor) {
                const filePath = activeEditor.document.uri.fsPath;
                const dirPath = path.dirname(filePath);
                const unixDirPath = dirPath.replace(/\\/g, '/');
                const terminal = vscode.window.createTerminal({
                    name: "File Directory Terminal"
                });
                terminal.show();
                terminal.sendText(`cd "${unixDirPath}" && pwd`, true);
            }
        },
    },
    {
        id: "vimAtHome.zoomJump",
        execute: async (manager: VimAtHomeManager) => {
            await manager.zoomJump();
        },
    },
    {
        id: "vimAtHome.deleteLineAbove",
        execute: async (manager: VimAtHomeManager) => {
            await manager.deleteLineAbove();
        },
    },
    {
        id: "vimAtHome.deleteLineBelow",
        execute: async (manager: VimAtHomeManager) => {
            await manager.deleteLineBelow();
        },
    },
    {
        id: "vimAtHome.toggleCommentAtEndOfLine",
        execute: async (manager: VimAtHomeManager) => {
            await manager.toggleCommentAtEndOfLine();
        },
    },
    {
        id: "vimAtHome.addHighlight",
        execute: async () => {
            await highlightManager.addHighlight();
        },
    },
    {
        id: "vimAtHome.manageHighlights",
        execute: async () => {
            await highlightManager.manageHighlights();
        },
    },
    {
        id: "vimAtHome.clearAllHighlights",
        execute: async () => {
            highlightManager.clearAllHighlightsDirectly();
        },
    },

    {
        id: "vimAtHome.addToCache",
        execute: async (manager: VimAtHomeManager) => {
            cacheCommands.addToCache(manager.editor);
        },
    },
    {
        id: "vimAtHome.parseToCache",
        execute: async (manager: VimAtHomeManager) => {
            cacheCommands.parseToCache(manager.editor);
        },
    },
    {
        id: "vimAtHome.pasteFromCache",
        execute: async (manager: VimAtHomeManager) => {
            cacheCommands.pasteFromCache(manager.editor);
        },
    },
    {
        id: "vimAtHome.pasteTop",
        execute: async (manager: VimAtHomeManager) => {
            cacheCommands.pasteTop(manager.editor);
        },
    },
    {
        id: "vimAtHome.join",
        execute: async (manager: VimAtHomeManager) => {
            cacheCommands.pasteTop(manager.editor);
        },
    },
    {
        id: "vimAtHome.unjoin",
        execute: async (manager: VimAtHomeManager) => {
            cacheCommands.pasteTop(manager.editor);
        },
    },
    
];

export function deactivate() {
    highlightManager.dispose();
}
