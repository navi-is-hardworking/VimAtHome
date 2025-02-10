import * as vscode from "vscode";
import * as editor from "./utils/editor";
import VimAtHomeManager from "./VimAtHomeManager";
import { collapseSelections } from "./utils/selectionsAndRanges";
import { Direction } from "./common";
import { setWordDefinition, nextWordDefinition, prevWordDefinition, getWordDefinitionIndex } from "./config";
import * as path from 'path';
import { HighlightManager } from './handlers/HighlightManager';
import * as cacheCommands from "./CacheCommands";
import { addSubjectCommand } from "./utils/quickMenus"
import { WaypointManager } from './handlers/WaypointManager';

export let waypointManager = new WaypointManager();
export let highlightManager = new HighlightManager();

type ExtensionCommand = {
    id: string;
    execute: (manager: VimAtHomeManager, ...args: any[]) => Promise<void>;
};

export let registeredCommands: ExtensionCommand[] = [
    {
        id: "vimAtHome.swapSubjectUp",
        execute: async (manager) => {
            await manager.selectToAnchor();
            await manager.executeSubjectCommand("swapWithObjectAbove");
        },
    },
    {
        id: "vimAtHome.swapSubjectDown",
        execute: async (manager) => {
            await manager.selectToAnchor();
            await manager.executeSubjectCommand("swapWithObjectBelow");
        },
    },
    {
        id: "vimAtHome.swapSubjectLeft",
        execute: async (manager) => {
            await manager.selectToAnchor();
            await manager.executeSubjectCommand("swapWithObjectToLeft");
        },
    },
    {
        id: "vimAtHome.swapSubjectRight",
        execute: async (manager) => {
            await manager.selectToAnchor();
            await manager.executeSubjectCommand("swapWithObjectToRight");
        },
    },
    {
        id: "vimAtHome.addSubjectUp",
        execute: async (manager) => {
            await manager.AddSubjectUp();
        },
    },
    {
        id: "vimAtHome.addSubjectDown",
        execute: async (manager) => {
            await manager.AddSubjectDown();
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
            await manager.nextSubjectUp();
        },
    },
    {
        id: "vimAtHome.nextSubjectDown",
        execute: async (manager) => {
            await manager.nextSubjectDown();
        },
    },
    {
        id: "vimAtHome.deleteSubject",
        execute: async (manager) => {
            manager.selectToAnchor();
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
            await manager.changeToBracketSubject();
        },
    },
    {
        id: "vimAtHome.jumpToBracketSubject",
        execute: async (manager: VimAtHomeManager) => {
            await manager.jumpToSubject('BRACKETS');
        },
    },
    {
        id: "vimAtHome.changeToWordSubject",
        execute: async (manager: VimAtHomeManager) => {
            await manager.changeToWordMode({
                kind: "COMMAND",
                subjectName: "WORD",
            });
        },
    },
    {
        id: "vimAtHome.jumpToWordSubject",
        execute: async (manager: VimAtHomeManager) => {
            await manager.jumpToSubject('WORD');
        },
    },
    {
        id: "vimAtHome.nextWordDefinition",
        execute: async (manager: VimAtHomeManager) => {
            nextWordDefinition();
            await manager.changeMode({
                kind: "COMMAND",
                subjectName: "WORD",
            });
        },
    },
    {
        id: "vimAtHome.prevWordDefinition",
        execute: async (manager: VimAtHomeManager) => {
            prevWordDefinition();
            await manager.changeMode({
                kind: "COMMAND",
                subjectName: "WORD",
            });
        },
    },
    {
        id: "vimAtHome.changeToLineSubject",
        execute: async (manager: VimAtHomeManager) => {
            await manager.changeMode({
                kind: "COMMAND",
                subjectName: "LINE",
            });
        },
    },
    {
        id: "vimAtHome.jumpToLineSubject",
        execute: async (manager: VimAtHomeManager) => {
            await manager.jumpToSubject('LINE');
        },
    },
    {
        id: "vimAtHome.changeToInterwordSubject",
        execute: async (manager: VimAtHomeManager) => {
            await manager.changeMode({
                kind: "COMMAND",
                subjectName: "INTERWORD",
            });
        },
    },
    {
        id: "vimAtHome.changeToSubwordSubject",
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(2);
            await manager.changeMode({
                kind: "COMMAND",
                subjectName: "WORD",
            });
            
        },
    },
    {
        id: "vimAtHome.changeToHalfBracketSubjectRight",
        execute: async (manager: VimAtHomeManager) => {
            await manager.changeMode({
                kind: "COMMAND",
                subjectName: "BRACKETS",
                half: "RIGHT"
            });
            
        },
    },
    {
        id: "vimAtHome.changeToHalfBracketSubjectLeft",
        execute: async (manager: VimAtHomeManager) => {
            await manager.changeMode({
                kind: "COMMAND",
                subjectName: "BRACKETS",
                half: "LEFT"
            });
        },
    },
    {
        id: "vimAtHome.changeToHalfLineSubjectRight",
        execute: async (manager: VimAtHomeManager) => {
            await manager.changeMode({
                kind: "COMMAND",
                subjectName: "LINE",
                half: "RIGHT"
            });
            
        },
    },
    {
        id: "vimAtHome.changeToHalfLineSubjectLeft",
        execute: async (manager: VimAtHomeManager) => {
            await manager.changeMode({
                kind: "COMMAND",
                subjectName: "LINE",
                half: "LEFT"
            });
            
        },
    },
    {
        id: "vimAtHome.changeToCharSubject",
        execute: async (manager: VimAtHomeManager) => {
            await manager.changeMode({
                kind: "COMMAND",
                subjectName: "CHAR",
            });
        },
    },
    {
        id: "vimAtHome.changeToBlockSubject",
        execute: async (manager: VimAtHomeManager) => {
            await manager.changeToBlockSubject({
                kind: "COMMAND",
                subjectName: "BLOCK",
            });
        },
    },
    {
        id: "vimAtHome.changeToBlockSubjectHalfUp",
        execute: async (manager: VimAtHomeManager) => {
            // manager.changeToBlockSubject("forwards");
            await manager.changeToBlockSubject({
                kind: "COMMAND",
                subjectName: "BLOCK",
                half: "LEFT"
            });
        },
    },
    {
        id: "vimAtHome.changeToBlockSubjectHalfDown",
        execute: async (manager: VimAtHomeManager) => {
            await manager.changeToBlockSubject({
                kind: "COMMAND",
                subjectName: "BLOCK",
                half: "RIGHT"
            });
        },
    },
    {
        id: "vimAtHome.jumpToBlockSubject",
        execute: async (manager: VimAtHomeManager) => {
            await manager.jumpToSubject('BLOCK');
        },
    },
    {
        id: "vimAtHome.changeToInsertMode",
        execute: async (manager: VimAtHomeManager) => {
            await manager.changeMode({ kind: "INSERT" });
        },
    },
    {
        id: "vimAtHome.changeToCommandModeDefault",
        execute: async (manager: VimAtHomeManager) => {
            await manager.changeMode({
                kind: "COMMAND",
                subjectName: manager.config.defaultSubject,
            });
        },
    },
    {
        id: "vimAtHome.changeToCommandModeLast",
        execute: async (manager: VimAtHomeManager) => {
            await manager.changeMode({
                kind: "COMMAND",
            });
        },
    },
    {
        id: "vimAtHome.changeToExtendOld",
        execute: async (manager: VimAtHomeManager) => {
            await manager.changeMode({
                kind: "EXTEND",
                subjectName: "WORD",
            });
        },
    },
    {
        id: "vimAtHome.changeToExtendMode",
        execute: async (manager: VimAtHomeManager) => {
            await manager.ToggleExtendMode();  
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
            manager.EndExtendMode();
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
            manager.EndExtendMode();
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
        id: "vimAtHome.repeatLastSkipOverLine",
        execute: async (manager) => {
            // TODO: switch to last mode if not already in it
            await manager.repeatLastSkipOverLine();
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
        id: "vimAtHome.collapseToCenter",
        execute: async (manager) => {
            await manager.collapseToCenter();
        },
    },
    {
        id: "vimAtHome.collapseToLeft",
        execute: async (manager) => {
            await manager.collapseToLeft();
        },
    },
    {
        id: "vimAtHome.collapseToRight",
        execute: async (manager) => {
            await manager.collapseToRight();
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
            await manager.newLineBelow();
        },
    },
    {
        id: "vimAtHome.newLineAbove",
        execute: async (manager) => {
            await manager.newLineAbove();
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
                // abcdefghijklmnopqrstuvwxyz1234567890_()]{}"<>&*/$%^!@#ABCDEFGHIJKLMNOPQRSTUVWXYZ
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
        id: "vimAtHome.deleteLine",
        execute: async (manager: VimAtHomeManager) => {
            await manager.deleteLines();
        },
    },
    {
        id: "vimAtHome.deleteToEndOfLine",
        execute: async (manager: VimAtHomeManager) => {
            await manager.deleteToEndOfLine();
        },
    },
    {
        id: "vimAtHome.deleteToStartOfLine",
        execute: async (manager: VimAtHomeManager) => {
            await manager.deleteToStartOfLine();
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
        id: "vimAtHome.nextWordBlockUp",
        execute: async (manager: VimAtHomeManager) => {
            await manager.nextSignificantBlock(Direction.backwards);
        },
    },
    {
        id: "vimAtHome.nextWordBlockDown",
        execute: async (manager: VimAtHomeManager) => {
            await manager.nextSignificantBlock(Direction.forwards);
        },
    },
    {
        id: "vimAtHome.nextIndentUp",
        execute: async (manager: VimAtHomeManager) => {
            await manager.nextIndentBlock(Direction.backwards);
        },
    },
    {
        id: "vimAtHome.nextIndentDown",
        execute: async (manager: VimAtHomeManager) => {
            await manager.nextIndentBlock(Direction.forwards);
        },
    },
    {
        id: "vimAtHome.downN",
        execute: async (manager: VimAtHomeManager) => {
            await manager.moveVerticalN(Direction.forwards);
        },
    },
    {
        id: "vimAtHome.upN",
        execute: async (manager: VimAtHomeManager) => {
            await manager.moveVerticalN(Direction.backwards);
        },
    },
    {
        id: "vimAtHome.hopVerticalUp",
        execute: async (manager: VimAtHomeManager) => {
            await manager.hopVertical(Direction.backwards);
        },
    },
    {
        id: "vimAtHome.hopVerticalDown",
        execute: async (manager: VimAtHomeManager) => {
            await manager.hopVertical(Direction.forwards);
        },
    },
    {
        id: "vimAtHome.selectOutward",
            execute: async (manager: VimAtHomeManager) => {
            await manager.edgeOut(Direction.forwards);
        },
    },
    {
        id: "vimAtHome.selectInward",
        execute: async (manager: VimAtHomeManager) => {
            await manager.edgeOut(Direction.backwards);
        },
    },

    {
        id: "vimAtHome.deleteLeft",
        execute: async (manager) => {
            await manager.deleteNext("backwards");
        },
    },
    {
        id: "vimAtHome.deleteRight", 
        execute: async (manager) => {
            await manager.deleteNext("forwards");
        },
    },
    {
        id: "vimAtHome.deleteToAnchor", 
        execute: async (manager) => {
            await manager.deleteToAnchor();
        },
    },
    {
        id: "vimAtHome.cutToAnchor", 
        execute: async (manager) => {
            await manager.cutToAnchor();
        },
    },
    {
        id: "vimAtHome.yoinkToAnchor", 
        execute: async (manager) => {
            await manager.yoinkAnchor();
        },
    },
    {
        id: "vimAtHome.downIndentDown", 
        execute: async (manager) => {
            await manager.downIndent("forwards");
        },
    },
    {
        id: "vimAtHome.downIndentUp", 
        execute: async (manager) => {
            await manager.downIndent("backwards");
        },
        
    },
    // {
    //     id: "vimAtHome.upIndentDown", 
    //     execute: async (manager) => {
    //         await manager.upIndent("forwards");
    //     },
    // },
    // {
    //     id: "vimAtHome.upIndentUp", 
    //     execute: async (manager) => {
    //         await manager.upIndent("backwards");
    //     },
        
    // },
    {
        id: "vimAtHome.foldAllAtLevel", 
        execute: async (manager) => {
            await manager.foldAllAtLevel();
        },
    },
    {
        id: "vimAtHome.wordHalfRight", 
        execute: async (manager) => {
            await manager.expandSubject("forwards");
        },
    },
    {
        id: "vimAtHome.wordHalfLeft", 
        execute: async (manager) => {
            await manager.expandSubject("backwards");
        },
    },
    {
        id: "vimAtHome.copy", 
        execute: async (manager) => {
            await manager.copyAll();
        },
    },
    {
        id: "vimAtHome.pasteLine", 
        execute: async (manager) => {
            await manager.pasteLine();
        },
    },
    {
        id: "vimAtHome.pasteBracket", 
        execute: async (manager) => {
            await manager.pasteBracket();
        },
    },
    {
        id: "vimAtHome.pasteSubject", 
        execute: async (manager) => {
            await manager.pasteSubject();
        },
    },
    {
        id: "vimAtHome.yoinkFromSkip", 
        execute: async (manager) => {
            await manager.yoinkAnchor();
        },
    },
    {
        id: "vimAtHome.insertHome", 
        execute: async (manager) => {
            await manager.insertHome();
        },
    },
    {
        id: "vimAtHome.insertEnd", 
        execute: async (manager) => {
            await manager.insertEnd();
        },
    },
    {
        id: "vimAtHome.anchorSwap", 
        execute: async (manager) => {
            await manager.anchorSwap();
        },
    },
    {
        id: "vimAtHome.join",
        execute: async (manager) => {
            await manager.join();
        },
    },
    {
        id: "vimAtHome.split",
        execute: async (manager) => {
            await manager.split();
        },
    },
    {
        id: "vimAtHome.carry", 
        execute: async (manager) => {
            await manager.carry();
        },
    },
    {
        id: "vimAtHome.goPrevSelection", 
        execute: async (manager) => {
            await manager.goPrevSelection();
        },
    },
    {
        id: "vimAtHome.goNextSelection", 
        execute: async (manager) => {
            await manager.goNextSelection();
        },
    },
    {
        id: "vimAtHome.replaceSelectionWithTerminalOutput", 
        execute: async (manager) => {
            await manager.runSelectionAndReplaceWithOutput();
        },
    },
    {
        id: "vimAtHome.runTerminalCommand", 
        execute: async (manager) => {
            await manager.runLineAndAppendOutput();
        },
    },
    {
        id: "vimAtHome.copyDiagnostics", 
        execute: async (manager) => {
            await manager.copyDiagnostics();
        },
    },
    {
        id: "vimAtHome.createWaypoint",
        execute: async () => {
            await waypointManager.createWaypoint();
        },
    },
    {
        id: "vimAtHome.teleportToWaypoint",
        execute: async () => {
            await waypointManager.teleportToWaypoint();
        },
    },
    {
        id: "vimAtHome.clearWaypoints",
        execute: async () => {
            waypointManager.clearWaypoints();
        },
    },
    {
        id: "vimAtHome.findNextExact",
        execute: async (manager) => {
            await manager.findNextExact();
        },
    },
    {
        id: "vimAtHome.findPrevExact",
        execute: async (manager) => {
            await manager.findPrevExact();
        },
    },
    {
        id: "vimAtHome.selectAtCurrentLevel",
        execute: async (manager) => {
            await manager.findPrevExact();
        },
    },
    
    
    // Set selection anchor be before any commands that require selection
    {
        id: "vimAtHome.indentSelection",
        execute: async (manager) => {
            await manager.selectToAnchor();
            await vscode.commands.executeCommand("editor.action.indentLines");
        },
    },
    {
        id: "vimAtHome.outdentSelection",
        execute: async (manager) => {
            await manager.selectToAnchor();
            await vscode.commands.executeCommand("editor.action.outdentLines");
        },
    },
    {
        id: "vimAtHome.moveLinesUp",
        execute: async (manager) => {
            await manager.selectToAnchor();
            await vscode.commands.executeCommand("editor.action.moveLinesUpAction");
        },
    },
    {
        id: "vimAtHome.moveLinesDown",
        execute: async (manager) => {
            await manager.selectToAnchor();
            await vscode.commands.executeCommand("editor.action.moveLinesDownAction");
        },
    },
    {
        id: "vimAtHome.copyLinesDown",
        execute: async (manager) => {
            await manager.selectToAnchor();
            await vscode.commands.executeCommand("editor.action.copyLinesDownAction");
        },
    },
    {
        id: "vimAtHome.copyLinesUp",
        execute: async (manager) => {
            await manager.selectToAnchor();
            await vscode.commands.executeCommand("editor.action.copyLinesUpAction");
        },
    },
    {
        id: "vimAtHome.showSelectToAnchor",
        execute: async (manager) => {
            await manager.showSelectionToAnchor();
        },
    },
    {
        id: "vimAtHome.commentLine",
        execute: async (manager) => {
            await manager.selectToAnchor();
            await vscode.commands.executeCommand("editor.action.commentLine");
        },
    },
    {
        id: "vimAtHome.debugWrapped",
        execute: async (manager) => {
            await manager.DebugWrapped();
        },
    },
    {
        id: "vimAtHome.selectAllMatches",
        execute: async (manager) => {
            await manager.selectToAnchor();
            await vscode.commands.executeCommand("editor.action.selectHighlights");
        },
    },
    {
        id: "vimAtHome.addPrevMatch",
        execute: async (manager) => {
            await manager.metaSelectStart();
        },
    },
    {
        id: "vimAtHome.addNextMatch",
        execute: async (manager) => {
            await manager.metaSelectEnd();
        },
    },
    {
        id: "vimAtHome.bracketize",
        execute: async (manager) => {
            await manager.Bracketize();
        },
    },
    {
        id: "vimAtHome.firstSymbolAbove",
        execute: async (manager) => {
            await manager.goToNearestSymbol("forwards");
        },
    },
    {
        id: "vimAtHome.firstSymbolBelow",
        execute: async (manager) => {
            await manager.goToNearestSymbol("backwards");
        },
    },
    {
        id: "vimAtHome.goToPrevEdit",
        execute: async (manager) => {
            await manager.goToEdit("backwards");
        },
    },
    {
        id: "vimAtHome.goToNextEdit",
        execute: async (manager) => {
            await manager.goToEdit("forwards");
        },
    },
    
    
];


export function popCustomCommands(num: number) {
    for (let i = 0; i < num; i++) {
        registeredCommands.pop();
    }
}

export function addCustomWord(index: number, key: string) {
    const customCommand = `vimAtHome.changeToCustomWord${index}`;
    registeredCommands.push(
    {
        id: customCommand,
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(index);
            manager.changeMode({
                kind: "COMMAND",
                subjectName: "WORD",
            });
        },
    })
    registeredCommands.push(
    {
        id: `vimAtHome.jumpToCustomWord${index}`,
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(index);
            manager.jumpToSubject('WORD');
        },
    })
    registeredCommands.push(
    {
        id: `vimAtHome.pullCustomWord${index}`,
        execute: async (manager: VimAtHomeManager) => {
            setWordDefinition(index);
            manager.pullSubject('WORD');
        },
    })

    addSubjectCommand(customCommand, key, index);
}

export function deactivate() {
    highlightManager.dispose();
}




