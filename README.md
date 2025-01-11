# VimAtHome

Personal development fork of the codeFlea https://github.com/Richiban/codeflea
This is primarily for personal use and has no built in keybindings or guide.
I would recommend using the original but you are welcome to use this if you wish.

```

"vimAtHome.wordKeys": "em,.jkluiopwrsdfxcv",

"vimAtHome.customWordRegex1": "tempword", // subword
"vimAtHome.customWordRegex2": "[A-Z]*[A-Za-z0-9][a-z0-9]*|[^A-Za-z0-9\\s]+", // subword
"vimAtHome.customWordRegex3":  "(['\"`])(?:(?!\\1).)*\\1", // Whitespace 
"vimAtHome.customWordRegex4":  "[a-zA-Z][^,|&?]+[^\\)\\s{}^,|&?]", // Arguments
"vimAtHome.customWordRegex5": "(!?\\w)(->|[\\w\\._\\-:\\\\\/]|<(?=[^>]*>).*?>|\\(\\)|\\[(?=[^\\]]*\\]).*?\\]|)*", // bigword
"vimAtHome.customWordRegex6": "(!?\\w)(->|[\\w\\._\\-:\\\\\/]|<(?=[^>]*>).*?>|\\([^;()]*\\)|\\[(?=[^\\]]*\\]).*?\\]|)*", // bigword
"vimAtHome.customWordRegex7": "([a-zA-Z][\\w.\\-_>?:]*(?:<[^<>]*>)?(?:\\[(?:[^\\[\\]]|\\[[^\\[\\]]*\\])*\\]|\\((?:[^()]|\\([^()]*\\))*\\))*)",
"vimAtHome.customWordRegex8": "(return)|(yield)",
"vimAtHome.customWordRegex9": "[^;:=\\s][^;:=]+[^;:=\\s]",
"vimAtHome.customWordRegex10": "[^\\s(),&|?:;]([^(),&|?:;]|\\(\\)|[^\\s(][(][^,&|;]+[)])+[^\\s(),&|?:;]",
"vimAtHome.customWordRegex11": "-?\\d*\\.?\\d+f?",
"vimAtHome.customWordRegex12": "\\w+[^\\w]+\\w+",
"vimAtHome.customWordRegex13": "[^,()]+",
"vimAtHome.customWordRegex14": "([[^();\\s,&|?:;<=>!]]|\\(\\))+",

"vimAtHome.color.word": "ffffff",
"vimAtHome.color.customWord1": "3381ff",
"vimAtHome.color.customWord2": "3381ff",
"vimAtHome.color.customWord3": "ffff00",
"vimAtHome.color.customWord4": "cf9700",
"vimAtHome.color.customWord5": "f40000",
"vimAtHome.color.customWord6": "ffff00",
"vimAtHome.color.customWord7": "cf9700",
"vimAtHome.verticalSkipCount": 4,

"vimAtHome.color.command": "#6d0000",
"terminal.integrated.shellIntegration.enabled": true,
"GitVision.filterString": "52872",
"editor.autoClosingBrackets": "never",
"editor.autoClosingQuotes": "never",

"vimAtHome.color.extend": "#09831566",

"workbench.colorCustomizations": { 
    "editor.background": "#101010",
    "editor.selectionBackground": "#1891fa4c",
    "editor.inactiveSelectionBackground": "#65169693",
    "editorOverviewRuler.wordHighlightTextForeground": "#1890fa00",
    "editor.wordHighlightBackground": "#1890fa00",
    "editor.wordHighlightStrongBackground": "#1890fa00",
    // "editor.selectionBackground": "#6d0000",
    "tab.border": "#ffffff",
    "tab.activeBorder": "#ffffff",
    "tab.activeBorderTop": "#ffffff",
    "tab.activeBackground": "#2d2d2d",
    "tab.inactiveForeground": "#ffffff",
    "tab.inactiveBackground": "#000000",
    "scrollbarSlider.background": "#62a400",
    "editor.findMatchBackground": "#abf1420a",
    "editor.findMatchBorder": "#abf142",
},
```

```

key": "up",
        "command": "vimAtHome.nextSubjectUp",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    // {
    //     "key": "ctrl+alt+down",
    //     "command": "vimAtHome.addSubjectDown",
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    // },
    {
        "key": "ctrl+alt+up",
        "command": "vimAtHome.addSubjectUp",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "left",
        "command": "vimAtHome.nextSubjectLeft",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "right",
        "command": "vimAtHome.nextSubjectRight",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+u",
        "command": "-editsHistory.createEditAtCursor"
    },
    // {
    //     "key": "shift+up",
    //     "command": "vimAtHome.collapseToCenter",
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    // },
    {
        "key": "shift+up",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.collapseToCenter"
            ]
        },
        "when": "editorTextFocus && vimAtHome.subject == 'LINE' && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "shift+up",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToInsertModeMidPoint",
                // "vimAtHome.changeToSubwordSubject"
            ]
        },
        "when": "editorTextFocus && vimAtHome.subject == 'WORD' && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "shift+up",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.collapseToCenter"
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    // {
    //     "key": "shift+up",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "vimAtHome.changeToInsertModeMidPoint",
    //             "vimAtHome.changeToLineSubject"
    //         ]
    //     },
    //     "when": "editorTextFocus && vimAtHome.subject == 'BLOCK' && vimAtHome.mode == 'COMMAND'"
    // },
    {
        "key": "ctrl+up",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.scrollEditorUp",
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+down",
        "command": "runCommands",
        "args": {
            "commands": [
                // "scrollEditorDown",
                "scrollLineDown",
                "scrollLineDown",
                "scrollLineDown",
                "scrollLineDown",
                "scrollLineDown",
                "scrollLineDown",
                "scrollLineDown",
                "scrollLineDown",
                "scrollLineDown",
                "scrollLineDown",
            ]
        },
        "when": "editorTextFocus"
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
        "key": "ctrl+shift+f7",
        "command": "editor.action.fontZoomIn"
    },
    {
        "key": "ctrl+alt+p",
        "command": "workbench.action.gotoSymbol",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+right",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToInsertMode",
                "cursorWordRightSelect",
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+shift+left",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToInsertMode",
                "cursorWordLeftSelect",
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+shift+right",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToHalfLineSubjectRight",
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "ctrl+shift+left",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToHalfLineSubjectLeft",
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "alt+delete",
        "command": "vimAtHome.deleteLineAbove",
        "when": "editorTextFocus"
    },
    {
        "key": "shift+alt+delete",
        "command": "vimAtHome.deleteLineBelow",
        "when": "editorTextFocus"
    },
    {
        "key": "right",
        "command": "editor.action.inlineSuggest.acceptNextWord",
        "when": "inlineSuggestionVisible && !editorReadonly"
    },
    {
        "key": "end",
        "command": "editor.action.inlineSuggest.acceptNextLine",
        "when": "inlineSuggestionVisible && !editorReadonly"
    },
    // {
    //     "key": "shift+f18",
    //     "command": "editor.action.inlineSuggest.acceptNextLine",
    //     "when": "inlineSuggestionVisible && !editorReadonly"
    // },
    // {
    //     "key": "end",
    //     "command": "editor.action.inlineSuggest.acceptNextLine",
    //     "when": "inlineSuggestionVisible && !editorReadonly"
    // },
    // {
    //          vimAtHome.change
    //     vimAtHome.addSubjectRight
    //     vimAtHome.appendNewObject
    // }
    {
        "key": "ctrl+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.newLineBelow",
                "vimAtHome.changeToInsertMode",
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.newLineBelow",
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.newLineAbove",
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+j",
        "command": "GitVision.jumpToPrevChange",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+l",
        "command": "GitVision.jumpToNextChange",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+pageUp",
        "command": "workbench.action.moveTerminalEditorLeftInGroup",
        "when": "terminalEditorFocus"
    },
    {
        "key": "ctrl+j ctrl+f",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToSubject",
                "vimAtHome.changeToExtendMode",
                "vimAtHome.skip",
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "shift+alt+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.setSelectionAnchor",
                "vimAtHome.skip"
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+space",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToBlockSubject"
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "f17",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.jumpToLineSubject",
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+f21",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToLineSubject",
                "vimAtHome.changeToExtendMode",
                "vimAtHome.jumpToLineSubject",
            ],
        },
        "when": "editorTextFocus"
    },
    {
        "key": "alt+shift+h",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.joinLines",
            ],
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "alt+shift+p",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.addHighlight",
            ],
        },
        "when": "editorTextFocus"
    },
    {
        "key": "shift+home",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToHalfLineSubjectLeft",
            ],
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "shift+end",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToHalfLineSubjectRight"
            ],
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "alt+c",
        "command": "vimAtHome.parseToCache",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+v",
        "command": "vimAtHome.pasteFromCache",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+v",
        "command": "vimAtHome.pasteFromCache",
        "when": "editorTextFocus"
    },
    {
        "key": "shift+f21",
        "command": "vimAtHome.changeToExtendMode",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+f6",
        "command": "vimAtHome.openSubjectMenu",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+up",
        "command": "vimAtHome.hopVerticalUp",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+down",
        "command": "vimAtHome.hopVerticalDown",
        "when": "editorTextFocus"
    },
    // {
    //     "key": "ctrl+right",
    //     "command": "vimAtHome.selectOutward",
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    // },
    // {
    //     "key": "ctrl+left",
    //     "command": "vimAtHome.selectInward",
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    // },
    {
        "key": "shift+down",
        "command": "vimAtHome.changeToBracketSubject",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "shift+alt+left",
        "command": "vimAtHome.changeToHalfBracketSubjectLeft",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "shift+alt+right",
        "command": "vimAtHome.changeToHalfBracketSubjectRight",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    // {
    //     "key": "shift+left",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "vimAtHome.changeToInsertModePrepend",
    //             "cursorRight",
    //             "vimAtHome.changeToCustomWord1",
    //         ]
    //     },
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' && vimAtHome.subject == 'WORD'"
    // },
    {
        "key": "shift+left",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.collapseToLeft",
            ]
        },
        // "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' && vimAtHome.subject != 'WORD' && vimAtHome.subject != 'SUBWORD' && vimAtHome.subject != 'CHAR'"
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "shift+right",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.collapseToRight",
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "ctrl+shift+up",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToBlockSubjectHalfUp",
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    
    {
        "key": "ctrl+shift+down",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToBlockSubjectHalfDown",
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    
    {
        "key": "ctrl+shift+up",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.nextSubjectUp",
                "vimAtHome.nextSubjectUp",
                "vimAtHome.nextSubjectUp",
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+shift+down",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.nextSubjectDown",
                "vimAtHome.nextSubjectDown",
                "vimAtHome.nextSubjectDown",
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    // {
    //     "key": "ctrl+f20",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "cursorRight",
    //         ]
    //     },
    //     "when": "editorTextFocus && vimAtHome.mode != 'COMMAND' && vimAtHome.mode != 'EXTEND'"
    // },
    // {
    //     "key": "shift+f20",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "cursorLeft",
    //         ]
    //     },
    //     "when": "editorTextFocus && vimAtHome.mode != 'COMMAND' && vimAtHome.mode != 'EXTEND'"
    // },
    // {
    //     "key": "shift+f20",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "cursorLeft",
    //         ]
    //     },
    //     "when": "editorTextFocus && vimAtHome.mode != 'COMMAND' && vimAtHome.mode != 'EXTEND'"
    // },
    {
        "key": "ctrl+x",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.clipboardCopyAction",
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+up",
        "command": "runCommands",
        "args": {
            "commands": [
                "workbench.action.quickOpenSelectPrevious",
                "workbench.action.quickOpenSelectPrevious",
                "workbench.action.quickOpenSelectPrevious",
                "workbench.action.quickOpenSelectPrevious"
            ]
        },
        "when": "inQuickOpen"
    },
    {
        "key": "ctrl+down",
        "command": "runCommands",
        "args": {
            "commands": [
                "workbench.action.quickOpenSelectNext",
                "workbench.action.quickOpenSelectNext",
                "workbench.action.quickOpenSelectNext",
                "workbench.action.quickOpenSelectNext"
            ]
        },
        "when": "inQuickOpen"
    },
    {
        "key": "ctrl+up",
        "command": "runCommands",
        "args": {
            "commands": [
                "list.focusUp",
                "list.focusUp",
                "list.focusUp",
                "list.focusUp"
            ]
        },
        "when": "listFocus && !inputFocus && !inQuickOpen"
    },
    {
        "key": "ctrl+down",
        "command": "runCommands",
        "args": {
            "commands": [
                "list.focusDown",
                "list.focusDown",
                "list.focusDown",
                "list.focusDown"
            ]
        },
        "when": "listFocus && !inputFocus && !inQuickOpen"
    },
    {
        "key": "ctrl+backspace",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.deleteLeft"
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+delete",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.deleteRight"
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+shift+up",
        "command": "runCommands",
        "args": {
            "commands": [
                "scrollLineUp",
                "scrollLineUp",
                "scrollLineUp",
                "scrollLineUp",
                "scrollLineUp",
                "scrollLineUp",
                "scrollLineUp",
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+shift+down",
        "command": "runCommands",
        "args": {
            "commands": [
                "scrollLineDown",
                "scrollLineDown",
                "scrollLineDown",
                "scrollLineDown",
                "scrollLineDown",
                "scrollLineDown",
                "scrollLineDown",
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "alt+r",
        "command": "runCommands",
        "args": {
            "commands": [
                "toggleSearchEditorRegex",
            ]
        },
        "when": "editorTextFocus"
    },
    // {
    //     "key": "shift+alt+f16",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "vimAtHome.downIndentUp",
    //         ]
    //     },
    //     "when": "editorTextFocus"
    // },
    {
        "key": "shift+alt+f18",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.downIndentDown",
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "shift+alt+f18",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.downIndentDown",
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+k ctrl+k",
        "command": "runCommands",
        "args": {
            "commands": [
                "editor.action.selectFromAnchorToCursor",
                // "editor.action.clipboardCopyAction",
                // "vimAtHome.yoinkFromSkip"
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "shift+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.repeatLastSkipBackwards",
                "editor.action.clipboardCopyAction",
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'EXTEND' && vimAtHome.subject == CHAR"
    },
    {
        "key": "ctrl+alt+y",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToInsertModePrepend",
                "vimAtHome.changeToCharSubject",
                "editor.action.setSelectionAnchor",
                "vimAtHome.skip",
                "editor.action.selectFromAnchorToCursor",
                "editor.action.clipboardCopyAction",
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "shift+down",
        "command": "-cursorColumnSelectDown",
        "when": "editorColumnSelection && textInputFocus"
    },
    // {
    //     "key": "ctrl+right",
    //     "command": "vimAtHome.wordHalfRight",
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' && vimAtHome.subject == 'WORD'"
    // },
    // {
    //     "key": "ctrl+left",
    //     "command": "vimAtHome.wordHalfLeft",
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' && vimAtHome.subject == 'WORD'"
    // },
    {
        "key": "ctrl+right",
        "command": "vimAtHome.goToLastSubjectInScope",
        "when": "(editorTextFocus && vimAtHome.subject != 'CHAR') && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+left",
        "command": "vimAtHome.goToFirstSubjectInScope",
        "when": "(editorTextFocus && vimAtHome.subject != 'CHAR') &&vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+alt+y",
        "command": "vimAtHome.copy",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+k",
        "command": "vimAtHome.deleteLine"
    },
    {
        "key": "ctrl+alt+c",
        "command": "undo"
    },
    {
        "key": "f24",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToWordSubject"
            ]
        },
    },
    {
        "key": "ctrl+shift+[",
        "command": "vimAtHome.foldAllAtLevel"
    },
    {
        "key": "ctrl+shift+]",
        "command": "editor.unfoldRecursively"
    },
    {
        "key": "alt+f20",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToInsertModeMidPoint",
                "cursorUp"
            ]
        }
    },
    {
        "key": "alt+shift+f20",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToInsertModeMidPoint",
                "cursorDown"
            ]
        }
    },
    {
        "key": "alt+shift+f20",
        "when": "editorTextFocus && EXTEND == 'COMMAND' && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+f",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToInsertMode",
                "actions.find"
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "f23",
        "command": "vimAtHome.pasteSubject",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+f23 ctrl+v",
        "command": "vimAtHome.pasteLine",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+f23 ctrl+c",
        "command": "vimAtHome.yoinkToAnchor",
        "when": "editorTextFocus"
    },
    {
        "key": "shift+f23",
        "command": "vimAtHome.pasteBracket",
        "when": "editorTextFocus"
    },

    {
        "key": "shift+f23",
        "command": "vimAtHome.pasteBracket",
        "when": "editorTextFocus"
    },

    {
        "key": "pageUp",
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
                "vimAtHome.scrollToCursor",
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "pageDown",
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
                "vimAtHome.scrollToCursor",
            ]
        },
       "when": "editorTextFocus"
    },
    {
        "key": "ctrl+c",
        "command": "vimAtHome.copy",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+v",
        "command": "vimAtHome.pasteSubject",
        "when": "editorTextFocus"
    },
    {
        "key": "escape",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToInsertMode",
                "removeSecondaryCursors",
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },

    {
        "key": "alt+up",
        "command": "vimAtHome.swapSubjectUp",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "alt+down",
        "command": "vimAtHome.swapSubjectDown",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' && vimAtHome.subject == 'BLOCK'"
    },
    {
        "key": "ctrl+shift+delete",
        "command": "vimAtHome.deleteToEndOfLine",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+backspace",
        "command": "vimAtHome.deleteToStartOfLine",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+backspace",
        "command": "vimAtHome.replaceSelectionWithTerminalOutput",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+delete",
        "command": "vimAtHome.runTerminalCommand",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+x",
        "command": "vimAtHome.deleteToAnchor",
        "when": "editorTextFocus"
    },
    // {
    //     "key": "ctrl+k ctrl+k",
    //     "command": "vimAtHome.yoinkToAnchor",
    //     "when": "editorTextFocus"
    // },
    {
        "key": "ctrl+f23 ctrl+c",
        "command": "vimAtHome.yoinkToAnchor",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+f23 ctrl+v",
        "command": "vimAtHome.pasteLine",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+alt+delete",
        "command": "vimAtHome.goPrevSelection",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "delete",
        "command": "vimAtHome.join",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "alt+m",
        "command": "codemarks.createMark",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+u",
        "command": "vimAtHome.goPrevSelection",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+u",
        "command": "vimAtHome.goNextSelection",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+m",
        "command": "vimAtHome.createWaypoint",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+f17",
        "command": "vimAtHome.teleportToWaypoint",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+shift+'",
        "command": "vimAtHome.clearWaypoints",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+f3",
        "command": "vimAtHome.findNextExact",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "ctrl+shift+f3",
        "command": "vimAtHome.findPrevExact",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    
    {
        //[
        "key": "ctrl+]",
        "command": "vimAtHome.indentSelection",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+[", // ]
        "command": "vimAtHome.outdentSelection",
        "when": "editorTextFocus"
    },
    
    {
        "key": "alt+up",
        "command": "vimAtHome.moveLinesUp",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+down",
        "command": "vimAtHome.moveLinesDown",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+shift+up",
        "command": "vimAtHome.copyLinesUp",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+shift+down",
        "command": "vimAtHome.copyLinesDown",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+k ctrl+k",
        "command": "vimAtHome.selectToAnchor",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+/",
        "command": "vimAtHome.commentLine",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+enter",
        "command": "vimAtHome.split",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' && vimAtHome.subject == 'CHAR'"
    },
    {
        "key": "ctrl+w",
        "command": "workbench.action.terminal.killEditor",
    },
    // {
    //     "key": "down",
    //     "command": "cursorDown",
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'",
    //     "args": {
    //         "by": "wrappedLine",
    //         "value": 1
    //     }
    // }
    
]


```