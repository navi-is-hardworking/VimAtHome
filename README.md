# VimAtHome

"We have Vim at home sweety."

```
//  Place your key bindings in this file to override the defaults
[
    {
        "key": "ctrl+;",
        "command": "findJump.activate",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+;",
        "command": "findJump.activateWithSelection",
        "when": "editorTextFocus"
    },
    {
        "key": "f16",
        "command": "runCommands",
        "args": {
            "commands": [
                // "codeFlea.scrollEditorDown",
                "editor.action.fontZoomReset",
                "workbench.action.zoomReset",
                "codeFlea.scrollToCursor",
            ]

        },
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+up",
        "command": "cursorPageUpSelect",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+down",
        "command": "cursorPageDownSelect",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+f4",
        "command": "workbench.action.navigateBack",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+f6",
        "command": "workbench.action.navigateForward",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+f5",
        "command": "editor.action.revealDefinition",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+alt+right",
        "command": "cursorLineEndSelect",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+left",
        "command": "cursorLineStart",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+alt+left",
        "command": "cursorLineStartSelect",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+l",
        "command": "-center-editor-window.center",
        "when": "editorTextFocus || findWidgetVisible"
    },
    {
        "key": "alt+pageUp",
        "command": "editor.action.insertCursorAbove",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+pageDown",
        "command": "editor.action.insertCursorBelow",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+f11",
        "command": "workbench.action.closeEditorsToTheRight",
        // "when": "editorTextFocus"
    },
    {
        "key": "ctrl+f10",
        "command": "workbench.action.closeEditorsToTheLeft",
        // "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+pageUp",
        "command": "workbench.action.moveEditorLeftInGroup",
        // "when": "editorTextFocus"
    },
    {
        "key": "ctrl+p",
        "command": "workbench.action.quickOpen",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+p",
        "command": "workbench.action.showCommands",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+alt+p",
        "command": "workbench.action.showCommands",
        "when": "editorTextFocus"
    },

    {
        "key": "ctrl+k space",
        "command": "editor.action.goToSelectionAnchor"
    },
    {
        "key": "shift+alt+s",
        "command": "bookmarks.clear"
    },
    {
        "key": "ctrl+alt+i",
        "command": "bookmarks.clearFromAllFiles"
    },
    {
        "key": "ctrl+alt+,",
        "command": "bookmarks.list"
    },
    {
        "key": "ctrl+alt+.",
        "command": "bookmarks.listFromAllFiles"
    },
    


    {
        "key": "alt+i",
        "command": "bookmarks.clear"
    },
    {
        "key": "shift+alt+i",
        "command": "bookmarks.clearFromAllFiles"
    },

    {
        "key": "alt+k",
        "command": "bookmarks.toggle"
    },
    {
        "key": "shift+alt+k",
        "command": "bookmarks.toggle"
    },
    {
        "key": "ctrl+alt+k",
        "command": "bookmarks.toggle"
    },
    {
        "key": "shift+ctrl+alt+k",
        "command": "bookmarks.toggle"
    },

    {
        "key": "ctrl+alt+j",
        "command": "bookmarks.jumpToPrevious"
    },
    {
        "key": "ctrl+alt+l",
        "command": "bookmarks.jumpToNext"
    },
    {
        "key": "ctrl+shift+alt+j",
        "command": "bookmarks.expandSelectionToPrevious"
    },
    {
        "key": "ctrl+shift+alt+l",
        "command": "bookmarks.expandSelectionToNext"
    },
    {
        "key": "ctrl+",
        "command": "gitlens.diffWithPrevious",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+f9",
        "command": "gitlens.diffWithNext",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+f18",
        "command": "workbench.action.search.toggleQueryDetails",
    },
    
    {
        "key": "ctrl+f1",
        "command": "editor.action.showContextMenu"
    },
    {
        "key": "ctrl+f2",
        "command": "editor.action.showHover"
    },

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
        "key": "b",
        "command": "-codeFlea.changeToBlockSubject",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "q",
        "command": "-codeFlea.changeToSubwordSubject",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "`",
        "command": "-codeFlea.changeToCharSubject",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "v",
        "command": "-codeFlea.changeToExtendMode",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND'"
    },
    {
        "key": ",",
        "command": "-codeFlea.changeToInsertMode",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "v",
        "command": "-codeFlea.changeToWordSubject",
        "when": "editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "x",
        "command": "-codeFlea.changeToLineSubject",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "w",
        "command": "-codeFlea.changeToWordSubject",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "backspace",
        "command": "-cursorUndo",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "r",
        "command": "-editor.action.quickFix",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+k",
        "command": "-codeFlea.addSubjectDown",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+down",
        "command": "-codeFlea.addSubjectDown",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+j",
        "command": "-codeFlea.addSubjectLeft",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+left",
        "command": "-codeFlea.addSubjectLeft",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+l",
        "command": "-codeFlea.addSubjectRight",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+right",
        "command": "-codeFlea.addSubjectRight",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+i",
        "command": "-codeFlea.addSubjectUp",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+up",
        "command": "-codeFlea.addSubjectUp",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+a",
        "command": "-codeFlea.appendNewObject",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "c",
        "command": "-codeFlea.change",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "n",
        "command": "-codeFlea.changeToBracketSubject",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "escape",
        "command": "-codeFlea.changeToCommandModeDefault",
        "when": "textInputFocus && !actionWidgetVisible && !cancellableOperation && !editorHasMultipleSelections && !inlineSuggestionVisible && !messageVisible && !notificationToastsVisible && !parameterHintsVisible && codeFlea.mode == 'INSERT'"
    },
    {
        "key": "a",
        "command": "-codeFlea.changeToInsertModeAppend",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "/",
        "command": "-codeFlea.changeToInsertModeMidPoint",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "p",
        "command": "-codeFlea.changeToInsertModePrepend",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+/",
        "command": "-codeFlea.changeToInsertModeSurround",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+c",
        "command": "-codeFlea.changeToLineEnd",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": ".",
        "command": "-codeFlea.customVsCodeCommand",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "d",
        "command": "-codeFlea.deleteSubject",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+d",
        "command": "-codeFlea.duplicateSubject",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+h",
        "command": "-codeFlea.extendToNextOccurrence",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+y",
        "command": "-codeFlea.extendToPrevOccurrence",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "u",
        "command": "-codeFlea.goToFirstSubjectInScope",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "o",
        "command": "-codeFlea.goToLastSubjectInScope",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "h",
        "command": "-codeFlea.goToNextOccurrence",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "y",
        "command": "-codeFlea.goToPrevOccurrence",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "t",
        "command": "-codeFlea.jump",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+;",
        "command": "-codeFlea.newLineAbove",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": ";",
        "command": "-codeFlea.newLineBelow",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "k",
        "command": "-codeFlea.nextSubjectDown",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "j",
        "command": "-codeFlea.nextSubjectLeft",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "l",
        "command": "-codeFlea.nextSubjectRight",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "i",
        "command": "-codeFlea.nextSubjectUp",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "g",
        "command": "-codeFlea.openGoToMenu",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "m",
        "command": "-codeFlea.openModifyMenu",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "z",
        "command": "-codeFlea.openViewMenu",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+p",
        "command": "-codeFlea.prependNewObject",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "enter",
        "command": "-codeFlea.repeatLastSkip",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+enter",
        "command": "-codeFlea.repeatLastSkipBackwards",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "s",
        "command": "-codeFlea.skip",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+s",
        "command": "-codeFlea.skipBackwards",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "f",
        "command": "-codeFlea.skipOver",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+k",
        "command": "-codeFlea.swapSubjectDown",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+j",
        "command": "-codeFlea.swapSubjectLeft",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+l",
        "command": "-codeFlea.swapSubjectRight",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+i",
        "command": "-codeFlea.swapSubjectUp",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },

    {
        "key": "alt+1",
        "command": "-workbench.action.openEditorAtIndex1"
    },
    {
        "key": "alt+2",
        "command": "-workbench.action.openEditorAtIndex2"
    },
    {
        "key": "alt+3",
        "command": "-workbench.action.openEditorAtIndex3"
    },
    {
        "key": "alt+4",
        "command": "-workbench.action.openEditorAtIndex4"
    },
    {
        "key": "alt+5",
        "command": "-workbench.action.openEditorAtIndex5"
    },
    {
        "key": "alt+6",
        "command": "-workbench.action.openEditorAtIndex6"
    },
    {
        "key": "alt+7",
        "command": "-workbench.action.openEditorAtIndex7"
    },
    {
        "key": "alt+8",
        "command": "-workbench.action.openEditorAtIndex8"
    },
    {
        "key": "alt+9",
        "command": "-workbench.action.openEditorAtIndex9"
    },
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // {
    //     "key": "f20",
    //     "command": "codeFlea.changeToInsertMode",
    //     "when": "textInputFocus"
    // },
    {
        "key": "f20",
        "command": "codeFlea.changeToInsertMode",
    },
    {
        "key": "f17",
        "command": "codeFlea.changeToSubwordSubject",
        // "when": "textInputFocus && !actionWidgetVisible && !cancellableOperation && !editorHasMultipleSelections && !inlineSuggestionVisible && !messageVisible && !notificationToastsVisible && !parameterHintsVisible && codeFlea.mode == 'INSERT'"
    },
    
    {
        "key": "shift+down",
        "command": "codeFlea.changeToExtendMode",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' && codeFlea.mode != 'EXTEND'"
    },
    {
        "key": "shift+down",
        "command": "codeFlea.changeToInsertMode",
        "when": "editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    
    {
        "key": "shift+left",
        "command": "codeFlea.changeToInsertModePrepend",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND'"
    },
    {
        "key": "shift+right",
        "command": "codeFlea.changeToInsertModeAppend",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND'"
    },
    {
        "key": "shift+up",
        "command": "codeFlea.changeToInsertMode",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+right",
        "command": "codeFlea.changeToInsertMode",
        "when": "editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+left",
        "command": "codeFlea.changeToInsertMode",
        "when": "editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    // {
    //     "key": "ctrl+left",
    //     "command": "codeFlea.goToFirstSubjectInScope",
    //     "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    // },
    // {
    //     "key": "ctrl+right",
    //     "command": "codeFlea.goToLastSubjectInScope",
    //     "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    // },
    {
        "key": "alt+a",
        "command": "codeFlea.changeToCharSubject",
        // "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "alt+b",
        "command": "codeFlea.changeToSubwordSubject",
        // "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+shift+alt+b",
        "command": "codeFlea.changeToSubwordSubject",
        // "when": "editorTextFocus"
    },
    {
        "key": "alt+c",
        "command": "codeFlea.changeToWordSubject",
        // "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "alt+d",
        "command": "codeFlea.changeToLineSubject",
        // "when": " && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "alt+e",
        "command": "codeFlea.changeToBlockSubject",
        // "when": "codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "alt+f",
        "command": "codeFlea.changeToBracketSubject",
        // "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+shift+alt+e",
        "command": "codeFlea.changeToBlockSubject",
        // "when": "codeFlea.mode == 'COMMAND'"
    },
    {
        "key": "alt+g",
        "command": "codeFlea.changeToExtendMode",
        // "when": "editorTextFocus && codeFlea.mode == 'COMMAND'"
    },
    {
        "key": "alt+h",
        "command": "codeFlea.skip",
        // "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+alt+h",
        "command": "codeFlea.skipBackwards",
        // "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "enter",
        "command": "codeFlea.repeatLastSkip",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+enter",
        "command": "runCommands",
        "args": { 
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.changeToWordSubject",
                "codeFlea.repeatLastSkip",
            ]
        },
        "when": "editorTextFocus && codeFlea.mode != 'COMMAND' || editorTextFocus && codeFlea.mode != 'EXTEND'",
    },
    {
        "key": "shift+enter",
        "command": "codeFlea.repeatLastSkipBackwards",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+;",
        "command": "codeFlea.jump",
        "when": "editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+f16",
        "command": "runCommands",
        "args": { 
            "commands": [
                "editor.action.setSelectionAnchor",
                "cursorLeft",
                "editor.action.selectFromAnchorToCursor"
            ]
        }
    },
    {
        "key": "ctrl+f16",
        "command": "editor.action.smartSelect.shrink",
    },
    {
        "key": "ctrl+shift+alt+up",
        "command": "runCommands",
        "args": { 
            "commands": [
                "codeFlea.changeToWordSubject",
                // "settings.cycle.tempColor"
            ]
        }
    },
    {
        "key": "ctrl+shift+alt+down",
        "command": "runCommands",
        "args": { 
            "commands": [
                "codeFlea.changeToBlockSubject",
                // "settings.cycle.tempColor"
                // "codeFlea.addSubjectDown"
            ]
        }
    },
    {
        "key": "f20",
        "command": "runCommands",
        "args": { 
        "commands": [
                "codeFlea.changeToInsertMode",
                // "settings.cycle.baseColor"
            ]
        }
    },

    {
        "key": "ctrl+enter",
        "command": "codeFlea.newLineBelow",
        "when": "editorTextFocus"
    },
    // {
    //     "key": "shift+enter",
    //     "command": "codeFlea.newLineAbove",
    //     "when": "editorTextFocus"
    // },

    {
        "key": "ctrl+f18",
        "command": "cursorTrail",
        "when": "editorTextFocus"
    },
    {
        "key": "pageUp",  // or any other key combination you prefer
        "command": "runCommands",
        "args": {
            "commands": [
                {
                    "command": "cursorMove",
                    "args": {
                        "to": "up",
                        "by": "line",
                        "value": 25
                    }
                },
                "codeFlea.scrollToCursor",
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "pageDown",  // or any other key combination you prefer
        "command": "runCommands",
        "args": {
            "commands": [
                {
                    "command": "cursorMove",
                    "args": {
                        "to": "down",
                        "by": "line",
                        "value": 25
                    }
                },
                "codeFlea.scrollToCursor",
            ]
        },
        "when": "editorTextFocus"
    },
    // {
    //     "key": "pageDown",  // or any other key combination you prefer
    //     "command": "cursorMove",
    //     "args": {
    //       "to": "down",
    //       "by": "line",
    //       "value": 30
    //     },
    //    "when": "editorTextFocus"
    // },
    // {
    //     "key": "ctrl+f16",  // or any other key combination you prefer

    //    "when": "editorTextFocus"
    // },
    // {
    //     "key": "ctrl+f18",  // or any other key combination you prefer
    //     "command": "cursorPageDown",
    //    "when": "editorTextFocus"
    // },

    // {
    //     "key": "",
    //     "command": "runCommands",
    //     "args": {
    //       "commands": [
    //         "editor.createFoldingRangeFromSelection",
    //         "cursorDown",
    //         "cursorBottomSelect",
    //         "editor.createFoldingRangeFromSelection",
    //         "bookmarks.toggle",
    //         "cursorUp",
    //         "cursorUp",
    //         "cursorTopSelect",
    //         "editor.createFoldingRangeFromSelection",
    //         "cursorDown",
    //         "bookmarks.toggle",
    //         "cursorDown",
    //         "editor.unfoldRecursively",
    //       ]
    //     },
    // },
    // {
    //     "key": "ctrl+f16",  // or any other key combination you prefer

    //    "when": "editorTextFocus"
    // },
    // {
    //     "key": "ctrl+f18",  // or any other key combination you prefer
    //     "command": "cursorPageDown",
    //    "when": "editorTextFocus"
    // },

    // {
    //     "key": "f7",
    //     "command": "runCommands",
    //     "args": {
    //       "commands": [
    //         "editor.createFoldingRangeFromSelection",
    //         "cursorDown",
    //         "cursorBottomSelect",
    //         "editor.createFoldingRangeFromSelection",
    //         "bookmarks.toggle",
    //         "cursorUp",
    //         "cursorUp",
    //         "cursorTopSelect",
    //         "editor.createFoldingRangeFromSelection",
    //         "cursorDown",
    //         "bookmarks.toggle",
    //         "cursorDown",
    //         "editor.unfoldRecursively",
    //       ]
    //     },
    // },
    {
        "key": "shift+alt+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.changeToWordSubject",
                "codeFlea.skip"
            ]
        },
    },
    {
        "key": "ctrl+shift+alt+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.changeToWordSubject",
                "codeFlea.skipBackwards"
            ]
        },
    },
    {
        "key": "ctrl+shift+alt+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                // "codeFlea.changeToWordSubject",
                "codeFlea.skipBackwards"
            ]
        },
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+alt+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.skip"
            ]
        },
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "alt+k",
        "command": "runCommands",
        "args": {
         "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.changeToSubwordSubject",
                // "codeFlea.changeToCharSubject",
                "codeFlea.skip",
            ]
        },
        "when": "editorTextFocus && codeFlea.mode != 'COMMAND' && codeflea.mode != 'EXTEND'"
    },
    {
        "key": "shift+alt+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.skipBackwards"
            ]
        },
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' && codeflea.mode == 'EXTEND'"
    },
    // {
    //     "key": "shift+alt+h",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //               "codeFlea.changeToWordSubject",
    //               "codeFlea.skip"
    //           ]
    //       },
    //     "when": "editorTextFocus && codeFlea.mode != 'COMMAND' && codeflea.mode != 'EXTEND'"
    // },
    // {
    //     "key": "a",
    //     "command": "setContext",
    //     "args": ["myCustomContext", true]
    // },
    // {
    //     "key": "b",
    //     "command": "setContext",
    //     "args": ["secondContext", true], 
    //     "when": "myCustomContext"
    // },
    {
        "key": "ctrl+alt+right",
        "command": "cursorLineEnd"
    },
    {
        "key": "ctrl+alt+left",
        "command": "cursorLineStart",
    },
    {
        "key": "alt+l",
        "command": "-codemap.reveal"
    },
    {
        "key": "shift+f18",
        "command": "bracket-select.select-include",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+a",
        "command": "-bracket-select.select-include",
        "when": "editorTextFocus"
    },
    {
        "key": "shift+f17",
        "command": "bracket-select.undo-select",
        "when": "editorTextFocus"
    },
    
    
    // {
    //     "key": "ctrl+right",
    //     "command": "codeFlea.addSubjectRight",
    //     "when": "editorTextFocus && (codeFlea.mode == 'COMMAND' || codeFlea.mode == 'Extend')"
    // },
    // {
    //     "key": "ctrl+left",
    //     "command": "codeFlea.addSubjectLeft",
    //     "when": "editorTextFocus && (codeFlea.mode == 'COMMAND' || codeFlea.mode == 'Extend')"
    // },
    // {
    //     "key": "delete",
    //     "command": "codeFlea.changeToHalfBracketSubjectLeft",
    //     "when": "editorTextFocus && (codeFlea.mode == 'COMMAND' || codeFlea.mode == 'Extend')"
    // },
    {
        "key": "ctrl+t",
        "command": "UnderScroll.toggleUnderSynchronizedScrolling"
    },
    {
        "key": "ctrl+f5",
        "command": "cursorRedo",
        "when": "editorTextFocus"
    },
    
    {
        "key": "f19",
        "command": "cursorWordEndLeft"
    },
    {
        "key": "f21",
        "command": "cursorWordStartRight"
    },
    {
        "key": "ctrl+f2",
        "command": "codeFlea.openSpaceMenu",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+f1",
        "command": "codeFlea.openViewMenu"
    },
    {
        "key": "ctrl+",
        "command": "codeFlea.changeToWordSubject",
        "when": "editorTextFocus"
    },
    // {
    //     "key": "ctrl+left",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "codeFlea.changeToCharSubject",
    //             // "cursorLeft",
    //         ],
    //     },
    //     "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    // },
    // {
    //     "key": "ctrl+right",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "codeFlea.changeToInsertModeAppend",
    //             "codeFlea.changeToCharSubject"
    //             // "codeFlea.nextWordDefinition",
    //             // "cursorWordEndRight",
    //             // "cursorRight",
    //         ],
    //     },
    //     "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    // },
    {
        "key": "shift+end",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToInsertMode",
                "cursorEndSelect"
            ]
        },
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+home",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToInsertMode",
                "cursorBeginSelect"
            ]
        },
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+home",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToInsertMode",
                "cursorBeginSelect"
            ]
        },
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+l",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToLineSubject",
            ]
        },
        "when": "editorTextFocus"// && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    
    {
        "key": "ctrl+f7",
        "command": "codeFlea.changeToWordSubject",
        "when": "editorTextFocus"
    },
    {
        "key": "f7",
        // "command": "codeFlea.changeToCommandModeDefault",
        "command": "codeFlea.changeToWordSubject",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+f16",
        "command": "codemarks.createMark",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+f17",
        "command": "codemarks.jumpToMark",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+f18",
        "command": "codemarks.selectToMark",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+shift+f16",
        "command": "codemarks.clearAllLocalMarks",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+shift+f17",
        "command": "codemarks.clearAllMarks",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+shift+f17",
        "command": "codemarks.listMarks",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+alt+'",
        "command": "codemarks.listMarks",
        "when": "editorTextFocus"
    },
    // {
    //     "key": "delete",
    //     "command": "codemarks.listMarksDelete",
    //     "when": "editorTextFocus"
    // },
    
    {
        "key": "shift+up",
        "command": "codeFlea.changeToInsertModeMidPoint",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+up",
        "command": "codeFlea.scrollEditorUp",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+down",
        "command": "codeFlea.scrollEditorDown",
        "when": "editorTextFocus"
    },
    {
        "key": "home",
        "command": "codeFlea.goToFirstSubjectInScope",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "end",
        "command": "codeFlea.goToLastSubjectInScope",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+t",
        "command": "welcome.showNewFileEntries"
    },
    {
        "key": ";",
        "command": "codeFlea.jump",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },

    {
        "key": "alt+shift+d",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.changeToCharSubject",
                "editor.action.setSelectionAnchor",
                "codeFlea.jumpToLineSubject"
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "alt+shift+d",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.changeToCharSubject",
                "editor.action.setSelectionAnchor",
                "codeFlea.jumpToLineSubject"
            ]
        },
        "when": "editorTextFocus && codeFlea.mode != 'COMMAND'"
    },
    {
        "key": "alt+shift+e",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.changeToCharSubject",
                "editor.action.setSelectionAnchor",
                "codeFlea.jumpToBlockSubject"
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "alt+shift+f",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.changeToCharSubject",
                "editor.action.setSelectionAnchor",
                "codeFlea.jumpToBracketSubject"
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "alt+shift+d",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.jumpToLineSubject"
            ]
        },
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+alt+f",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.jumpToBlockSubject"
            ]
        },
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "alt+shift+f",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.jumpToBracketSubject"
            ]
        },
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },

    {
        "key": "ctrl+alt+up",
        "command": "codeFlea.addSubjectUp",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+alt+down",
        "command": "codeFlea.addSubjectDown",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },

    {
        "key": "backspace",
        "command": "codeFlea.deleteSubject",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+shift+f17",
        "command": "search.action.focusSearchList",
        // "when": "editorTextFocus"//&& codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    // {
    //     // "key": "ctrl+t",
    //     // "command": "workbench.action.quickOpenPreviousEditor"
    // },
    {
        "key": "ctrl+t",
        "command": "workbench.action.openPreviousEditorFromHistory"
    },

    {
        "key": "alt+ctrl+shift+1",
        "command": "workbench.action.openEditorAtIndex1"
    },
    {
        "key": "alt+ctrl+shift+2",
        "command": "workbench.action.openEditorAtIndex2"
    },
    {
        "key": "alt+ctrl+shift+3",
        "command": "workbench.action.openEditorAtIndex3"
    },
    {
        "key": "alt+ctrl+shift+4",
        "command": "workbench.action.openEditorAtIndex4"
    },
    {
        "key": "alt+ctrl+shift+5",
        "command": "workbench.action.openEditorAtIndex5"
    },
    {
        "key": "alt+ctrl+shift+6",
        "command": "workbench.action.openEditorAtIndex6"
    },
    {
        "key": "alt+ctrl+shift+7",
        "command": "workbench.action.openEditorAtIndex7"
    },
    {
        "key": "alt+ctrl+shift+8",
        "command": "workbench.action.openEditorAtIndex8"
    },
    {
        "key": "alt+ctrl+shift+9",
        "command": "workbench.action.openEditorAtIndex9"
    },
    {
        "key": "ctrl+k ctrl+shift+f1",
        "command": "codeFlea.openGoToMenu"
    },
    {
        "key": "ctrl+k ctrl+shift+f2",
        "command": "codeFlea.openSpaceMenu"
    },
    {
        "key": "ctrl+k ctrl+shift+f3",
        "command": "codeFlea.openViewMenu"
    },

    {
        "key": "ctrl+a",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToInsertMode",
                "editor.action.selectAll",
            ],
        },
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "space",
        "command": "-codeFlea.openSpaceMenu",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || editorTextFocus && codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+w",
        "command": "workbench.action.terminal.kill",
        "when": "terminalFocus"
    },
    {
        "key": "ctrl+t",  // Or any other key combination you prefer
        "command": "workbench.action.terminal.new",
        "when": "terminalFocus"
    },
    {
        "key": "ctrl+;",  // Or any other key combination you prefer
        "command": "codeFlea.openTerminalAtFilePath",
        // "when": "terminalFocus"
    },
    
    {
        "key": "alt+f17",
        "command": "github.copilot.toggleCopilot"
    },

    // {
    //     "key": "ctrl+shift+c",
    //     "command": "codeFlea.pullWord",
    //     "when": "editorTextFocus"
    // },
    // {
    //     "key": "ctrl+shift+alt+a",
    //     "command": "codeFlea.pullCustomWord1",
    //     "when": "editorTextFocus"
    // },
    // {
    //     "key": "ctrl+shift+alt+b",
    //     "command": "codeFlea.pullCustomWord2",
    //     "when": "editorTextFocus"
    // },
    // {
    //     "key": "ctrl+shift+alt+c",
    //     "command": "codeFlea.pullCustomWord3",
    //     "when": "editorTextFocus"
    // },
    // {
    //     "key": "ctrl+alt+d",
    //     "command": "codeFlea.pullLineSubject",
    //     "when": "editorTextFocus"
    // },
    // {
    //     "key": "ctrl+alt+e",
    //     "command": "codeFlea.pullBracketSubject",
    //     "when": "editorTextFocus"
    // },
    // {
    //     "key": "ctrl+alt+f",
    //     "command": "codeFlea.pullBlockSubject",
    //     "when": "editorTextFocus"
    // },
    {
        "key": "ctrl+shift+f7",
        "command": "workbench.action.navigateToLastEditLocation",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+k ctrl+alt+left",
        "command": "workbench.action.navigateBackInEditLocations",
    },
    {
        "key": "ctrl+k ctrl+alt+right",
        "command": "workbench.action.navigateForwardInEditLocations",
    },
    

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // Char 
    {
        "key": "ctrl+j a",
        "command": "codeFlea.changeToCharSubject",
    },
    {
        "key": "ctrl+shift+j a",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.changeToCharSubject",
                "codeFlea.jump",
            ],
        },
    },
    {
        "key": "ctrl+j ctrl+a",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToCharSubject",
                "codeFlea.skip",
                "codeFlea.changeToInsertModeAppend"
                // "codeFlea.changeToInsertModeAppend"
            ],
        },
    },
    {
        "key": "ctrl+shift+j ctrl+a",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToCharSubject",
                "codeFlea.skipBackwards",
                "codeFlea.changeToInsertModePrepend"
            ],
        },
    },
    {
        "key": "ctrl+j alt+a",
        "command": "codeFlea.pullCharSubject"
    },
    
    // Subword (b)
    {
        "key": "ctrl+j b",
        "command": "codeFlea.changeToSubwordSubject",
    },
    {
        "key": "ctrl+shift+j b",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.changeToSubwordSubject",
                "codeFlea.jump",
            ],
        },
    },
    {
        "key": "ctrl+j ctrl+b",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToSubwordSubject",
                "codeFlea.skip",
            ],
        },
    },
    {
        "key": "ctrl+shift+j ctrl+b",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToSubwordSubject",
                "codeFlea.skipBackwards",
            ],
        },
    },
    {
        "key": "ctrl+j alt+b",
        "command": "codeFlea.pullSubword"
    },

    // Word (c)
    {
        "key": "ctrl+j c",
        "command": "codeFlea.changeToWordSubject",
    },
    {
        "key": "ctrl+shift+j c",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.jumpToWordSubject",
            ],
        },
    },
    {
        "key": "ctrl+j ctrl+c",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToWordSubject",
                "codeFlea.skip",
            ],
        },
    },
    {
        "key": "ctrl+shift+j ctrl+c",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToWordSubject",
                "codeFlea.skipBackwards",
            ],
        },
    },
    {
        "key": "ctrl+j alt+c",
        "command": "codeFlea.pullWord"
    },

    // CustomWord1 (d)
    {
        "key": "ctrl+j d",
        "command": "codeFlea.changeToCustomWord1",
    },
    {
        "key": "ctrl+shift+j d",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.jumpToCustomWord1",
            ],
        },
    },
    {
        "key": "ctrl+j ctrl+d",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToCustomWord1",
                "codeFlea.skip",
            ],
        },
    },
    {
        "key": "ctrl+shift+j ctrl+d",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToCustomWord1",
                "codeFlea.skipBackwards",
            ],
        },
    },
    {
        "key": "ctrl+j alt+d",
        "command": "codeFlea.pullCustomWord1"
    },

    // CustomWord2 (e)
    {
        "key": "ctrl+j e",
        "command": "codeFlea.changeToCustomWord2",
    },
    {
        "key": "ctrl+shift+j e",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.jumpToCustomWord2",
            ],
        },
    },
    {
        "key": "ctrl+j ctrl+e",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToCustomWord2",
                "codeFlea.skip",
            ],
        },
    },
    {
        "key": "ctrl+shift+j ctrl+e",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToCustomWord2",
                "codeFlea.skipBackwards",
            ],
        },
    },
    {
        "key": "ctrl+j alt+e",
        "command": "codeFlea.pullCustomWord2"
    },

    // CustomWord3 (f)
    {
        "key": "ctrl+j f",
        "command": "codeFlea.changeToCustomWord3",
    },
    {
        "key": "ctrl+shift+j f",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.jumpToCustomWord3",
            ],
        },
    },
    {
        "key": "ctrl+j ctrl+f",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToCustomWord3",
                "codeFlea.skip",
            ],
        },
    },
    {
        "key": "ctrl+shift+j ctrl+f",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToCustomWord3",
                "codeFlea.skipBackwards",
            ],
        },
    },
    {
        "key": "ctrl+j alt+f",
        "command": "codeFlea.pullCustomWord3"
    },

    // Bracket (g)
    {
        "key": "ctrl+j g",
        "command": "codeFlea.changeToBracketSubject",
    },
    {
        "key": "ctrl+shift+j g",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.jumpToBracketSubject",
            ],
        },
    },
    {
        "key": "ctrl+j ctrl+g",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToBracketSubject",
                "codeFlea.skip",
            ],
        },
    },
    {
        "key": "ctrl+shift+j ctrl+g",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToBracketSubject",
                "codeFlea.skipBackwards",
            ],
        },
    },
    {
        "key": "ctrl+j alt+g",
        "command": "codeFlea.pullBracketSubject"
    },

    // Line (h)
    {
        "key": "ctrl+j h",
        "command": "codeFlea.changeToLineSubject",
    },
    {
        "key": "ctrl+shift+j h",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.jumpToLineSubject",
            ],
        },
    },
    {
        "key": "ctrl+shift+j h",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToLineSubject",
                "editor.action.setSelectionAnchor",
                "codeFlea.jumpToLineSubject",
            ],
        },
        "when": "codeFlea.mode != 'COMMAND' && codeFlea.mode != 'EXTEND'"
    },
    {
        "key": "ctrl+j ctrl+h",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToLineSubject",
                "codeFlea.skip",
            ],
        },
    },
    {
        "key": "ctrl+shift+j ctrl+h",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToLineSubject",
                "codeFlea.skipBackwards",
            ],
        },
    },
    {
        "key": "ctrl+j alt+h",
        "command": "codeFlea.pullLineSubject"
    },

    // File (i)
    {
        "key": "ctrl+j i",
        "command": "codeFlea.changeToBlockSubject",
    },
    {
        "key": "ctrl+shift+j i",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.jumpToBlockSubject",
            ],
        },
    },
    {
        "key": "ctrl+j ctrl+i",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToBlockSubject",
                "codeFlea.skip",
            ],
        },
    },
    {
        "key": "ctrl+shift+j ctrl+i",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToBlockSubject",
                "codeFlea.skipBackwards",
            ],
        },
    },
    {
        "key": "ctrl+j alt+i",
        "command": "codeFlea.pullBlockSubject"
    },
    {
        "key": "alt+;",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.changeToWordSubject",
                "codeFlea.jump",
            ],
        },
        "when": "editorTextFocus && codeFlea.mode != 'COMMAND' && codeflea.mode != 'EXTEND'"
    },
    {
        "key": "alt+;",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.jump",
            ],
        },
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "space",
        "command": "codeFlea.changeToInsertMode",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND'"
    },
    // {
    //     "key": "ctrl+left",
    //     "command": "codeFlea.changeToBlockSubject",
    //     "when": "editorTextFocus && codeFlea.subject == 'CHAR'"
    // },
    // {
    //     "key": "ctrl+left",
    //     "command": "codeFlea.changeToCharSubject",
    //     "when": "editorTextFocus && codeFlea.subject == 'SUBWORD'"
    // },
    {
        "key": "shift+ctrl+left",
        "command": "codeFlea.prevWordDefinition",
        "when": "editorTextFocus && codeFlea.subject == 'WORD' && codeFlea.mode == 'COMMAND'"
    },
    {
        "key": "shift+ctrl+right",
        "command": "codeFlea.nextWordDefinition",
        "when": "editorTextFocus && codeFlea.subject == 'WORD' && codeFlea.mode == 'COMMAND'"
    },
    // {
    //     "key": "ctrl+left",
    //     "command": "codeFlea.changeToWordSubject",
    //     "when": "editorTextFocus && codeFlea.subject == 'BRACKETS'"
    // },
    // {
    //     "key": "ctrl+left",
    //     "command": "codeFlea.changeToBracketSubject",
    //     "when": "editorTextFocus && codeFlea.subject == 'LINE'"
    // },
    // {
    //     "key": "ctrl+left",
    //     "command": "codeFlea.changeToLineSubject",
    //     "when": "editorTextFocus && codeFlea.subject == 'BLOCK'"
    // },
    // {
    //     "key": "ctrl+right",
    //     "command": "codeFlea.changeToSubwordSubject",
    //     "when": "editorTextFocus && codeFlea.subject == 'CHAR'"
    // },
    // {
    //     "key": "ctrl+right",
    //     "command": "codeFlea.changeToWordSubject",
    //     "when": "editorTextFocus && codeFlea.subject == 'SUBWORD'"
    // },
    // {
    //     "key": "ctrl+right",
    //     "command": "codeFlea.changeToBracketSubject",
    //     "when": "editorTextFocus && codeFlea.subject == 'BRACKETS'"
    // },
    // {
    //     "key": "ctrl+right",
    //     "command": "codeFlea.changeToBlockSubject",
    //     "when": "editorTextFocus && codeFlea.subject == 'LINE'"
    // },
    // {
    //     "key": "ctrl+right",
    //     "command": "codeFlea.changeToCharSubject",
    //     "when": "editorTextFocus && codeFlea.subject == 'BLOCK'"
    // },
    {   
        "key": "shift+alt+right",
        "command": "codeFlea.changeToBracketSubject",
        "when": "editorTextFocus && codeFlea.mode != 'EXTEND'"
    },
    {   
        "key": "shift+alt+left",
        "command": "codeFlea.changeToSubwordSubject",
        "when": "editorTextFocus"
    },
    // {
    //     "key": "delete",
    //     "command": "workbench.action.terminal.newWithCwd"
    // }
    // {
    //     "key": "ctrl+shift+\\",
    //     "command": "codeFlea.changeToBracketSubject",
    //     "when": "editorTextFocus"
    // },
    {
        "key": "alt+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.repeatLastSkip",
                "codeFlea.changeToInsertModeAppend"
            ]
        },
        "when": "editorTextFocus && codeFlea.mode != 'COMMAND' && codeFlea.mode != 'EXTEND'"
    },
    {
        "key": "shift+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.goToSelectionAnchor",
                "codeFlea.repeatLastSkipBackwards",
                "codeFlea.changeToInsertModePrepend"
            ]
        },
        "when": "editorTextFocus && codeFlea.mode != 'COMMAND' && codeFlea.mode != 'EXTEND'"
    },
    {
        "key": "ctrl+right",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.nextSubjectRight",
                "codeFlea.nextSubjectRight",
                // "codeFlea.nextSubjectRight"
            ]
        },
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+left",
        "command": "runCommands",
        "args": {
            "commands": [
                // "codeFlea.nextSubjectLeft",
                "codeFlea.nextSubjectLeft",
                "codeFlea.nextSubjectLeft"
            ]
        },
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "down",
        "command": "codeFlea.nextSubjectDown",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "up",
        "command": "codeFlea.nextSubjectUp",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+alt+down",
        "command": "codeFlea.addSubjectDown",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+alt+up",
        "command": "codeFlea.addSubjectUp",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "left",
        "command": "codeFlea.nextSubjectLeft",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "right",
        "command": "codeFlea.nextSubjectRight",
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+u",
        "command": "-editsHistory.createEditAtCursor"
    },
    {
        "key": "f17",
        "command": "codeFlea.changeToExtendMode",
    },
    {
        "key": "shift+up",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToInsertModeMidPoint",
                "codeFlea.changeToWordSubject",
                "codeFlea.changeToWordSubject"
            ]
        },
        "when": "editorTextFocus && codeFlea.subject == 'LINE' && codeFlea.mode == 'COMMAND'"
    },
    {
        "key": "shift+up",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToInsertModeMidPoint",
                "codeFlea.changeToSubwordSubject"
            ]
        },
        "when": "editorTextFocus && codeFlea.subject == 'WORD' && codeFlea.mode == 'COMMAND'"
    },
    {
        "key": "shift+up",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToInsertModeMidPoint",
                "codeFlea.changeToWordSubject"
            ]
        },
        "when": "editorTextFocus && codeFlea.subject == 'BRACKETS' && codeFlea.mode == 'COMMAND'"
    },
    {
        "key": "shift+up",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToInsertModeMidPoint",
                "codeFlea.changeToLineSubject"
            ]
        },
        "when": "editorTextFocus && codeFlea.subject == 'BLOCK' && codeFlea.mode == 'COMMAND'"
    },
    {
        "key": "ctrl+up",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.scrollEditorUp",
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+down",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.scrollEditorDown",
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": ",",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.changeToLineSubject",
                "codeFlea.changeToInsertModeAppend",
                {
                    "command": "type",
                    "args": { "text": "," }
                },
                "editor.action.goToSelectionAnchor",
                "codeFlea.changeToWordSubject"
            ]
        },
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": ";",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "codeFlea.changeToLineSubject",
                "codeFlea.changeToInsertModeAppend",
                {
                    "command": "type",
                    "args": { "text": ";" }
                },
                "editor.action.goToSelectionAnchor",
                "codeFlea.changeToWordSubject"
            ]
        },
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+1",
        "command": "workbench.action.openEditorAtIndex1",
    },
    {
        "key": "ctrl+2",
        "command": "workbench.action.openEditorAtIndex2",
    },
    {
        "key": "ctrl+3",
        "command": "workbench.action.openEditorAtIndex3",
    },
    {
        "key": "ctrl+4",
        "command": "workbench.action.openEditorAtIndex4",
    },
    {
        "key": "ctrl+5",
        "command": "workbench.action.openEditorAtIndex5",
    },
    {
        "key": "ctrl+6",
        "command": "workbench.action.openEditorAtIndex6",
    },
    {
        "key": "ctrl+7",
        "command": "workbench.action.openEditorAtIndex7",
    },
    {
        "key": "ctrl+8",
        "command": "workbench.action.openEditorAtIndex8",
    },
    {
        "key": "ctrl+9",
        "command": "workbench.action.openEditorAtIndex9",
    },
    // {
    //     "key": "f17",
    //     // "command": "editor.action.fontZoomIn"
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "editor.action.fontZoomOut",
    //             "editor.action.fontZoomOut",
    //             "editor.action.fontZoomOut",
    //             "workbench.action.zoomOut",
    //             "workbench.action.zoomOut",
    //             "workbench.action.zoomOut",
                // "codeFlea.scrollToCursor",
    //         ]
    //     },
    //     "when": "editorTextFocus"
    // },
    {
        "key": "ctrl+shift+f7",
        "command": "editor.action.fontZoomIn"
    },
    // {
    //     "key": "delete",
    //     "command": "codeFlea.openModifyMenu",

    // },
    // {
    //     "key": "delete",
    //     "command": "codeFlea.openModifyMenu",

    // },
    {
        "key": "f17",
        "command": "codeFlea.zoomJump",

    },
    {
        "key": "ctrl+alt+p",
        "command": "fuzzySearch.activeTextEditor",
        "when": "editorTextFocus"
    },

    {
        "key": "shift+end",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToInsertModePrepend",
                "codeFlea.changeToHalfLineSubjectRight",
            ]
        },
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    },
    {
        "key": "shift+home",
        "command": "runCommands",
        "args": {
            "commands": [
                "codeFlea.changeToInsertModeAppend",
                "codeFlea.changeToHalfLineSubjectLeft",
            ]
        },
        "when": "editorTextFocus && codeFlea.mode == 'COMMAND' || codeFlea.mode == 'EXTEND'"
    }
]
```