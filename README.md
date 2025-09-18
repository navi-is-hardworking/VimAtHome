# VimAtHome

Personal development fork of the codeFlea https://github.com/Richiban/codeflea
This is primarily for personal use and has no built in keybindings or guide.
I would recommend using the original but you are welcome to use this if you wish.

```

"vimAtHome.wordKeys": "em,.jkluiopwrsdfxcv",
"vimAtHome.customWordRegex1": "tempword",
"vimAtHome.customWordRegex2": "[A-Z]*[A-Za-z0-9][a-z0-9]*|[^A-Za-z0-9\\s]+", // subword
"vimAtHome.customWordRegex3":  "(['\"`])(?:(?!\\1).)*\\1", // Whitespace 
"vimAtHome.customWordRegex4":  "[a-zA-Z][^,|&?]+[^\\)\\s{}^,|&?]", // Arguments
"vimAtHome.customWordRegex5": "(!?\\w)(->|[\\w\\._\\-:\\\\\/]|<(?=[^>]*>).*?>|\\(\\)|\\[(?=[^\\]]*\\]).*?\\]|)*", // bigword
"vimAtHome.customWordRegex6": "(!?\\w)(->|[\\w\\._\\-:\\\\\/]|<(?=[^>]*>).*?>|\\([^;()]*\\)|\\[(?=[^\\]]*\\]).*?\\]|)*", // bigword
"vimAtHome.customWordRegex7": "([a-zA-Z][\\w.\\-_>?:]*(?:<[^<>]*>)?(?:\\[(?:[^\\[\\]]|\\[[^\\[\\]]*\\])*\\]|\\((?:[^()]|\\([^()]*\\))*\\))*)",
// "vimAtHome.customWordRegex7": "[^\\s]+",
"vimAtHome.customWordRegex8": "(return)|(yield)",
"vimAtHome.customWordRegex9": "[^;:=\\s][^;:=]+[^;:=\\s]",
// "vimAtHome.customWordRegex10": "[^\\s(),&|?:;]([^(),&|?;]|\\(\\)|[^\\s(][(][^,&|;]+[)])+[^\\s(),&|?;]",
"vimAtHome.customWordRegex10": "[^\\s(),&|?:;]([^(),&|?;]|\\(\\)|[^\\s(][(][^,&|;]+[)])+[^\\s(),&|?;]",
"vimAtHome.customWordRegex11": "-?\\d*\\.?\\d+f?",
"vimAtHome.customWordRegex12": "\\w+[^\\w]+\\w+",
"vimAtHome.customWordRegex13": "[^,()]+",
"vimAtHome.customWordRegex14": "([[^();\\s,&|?:;<=>!]]|\\(\\))+",

"vimAtHome.color.word": "57f7ff",
"vimAtHome.color.customWord1": "3381ff",
"vimAtHome.color.customWord2": "3381ff",
"vimAtHome.color.customWord3": "ffff00",
"vimAtHome.color.customWord4": "cf9700",
"vimAtHome.color.customWord5": "f40000",
"vimAtHome.color.customWord6": "ffff00",
"vimAtHome.color.customWord7": "cf9700",

"vimAtHome.color.command": "#5614d0a0",
// "vimAtHome.color.command": "#641a937a",
// "vimAtHome.color.extend": "#26d24e2b",
"vimAtHome.color.extend": "#008939a0",
"terminal.integrated.shellIntegration.enabled": true,
"GitVision.filterString": "52872",

"workbench.colorCustomizations": { 
    "editor.background": "#101010",
    "editor.selectionBackground": "#3d1cb48e",
    // "editor.selectionBackground": "#1890faf5",
    "editor.inactiveSelectionBackground": "#5614d0a0",
    "editorOverviewRuler.wordHighlightTextForeground": "#1890fa00",
    "editor.wordHighlightBackground": "#1890fa00",
    "editor.wordHighlightStrongBackground": "#1890fa00",
    // "editor.selectionBackground": "#6d0000",
    "tab.border": "#ffffff",
    "tab.activeBorder": "#1469066d",
    "tab.activeBorderTop": "#1469066d",
    "tab.activeBackground": "#39ba2252",
    "tab.inactiveForeground": "#ffffff",
    "tab.inactiveBackground": "#000000",
    "tab.unfocusedActiveBackground": "#75757586",
    "scrollbarSlider.background": "#62a400",
    "editor.findMatchBackground": "#abf1420a",
    "editor.findMatchBorder": "#abf142",
    "editorIndentGuide.background1": "#ffffff85",
    "editorIndentGuide.activeBackground1": "#62ff1e",
},

```

```
"editor.semanticHighlighting.enabled": true,
"editor.tokenColorCustomizations": {
    "textMateRules": [
        {
            "scope": "variable.other.global.cpp",
            "settings": {
                "foreground": "#dfb272"
            }
        },
        {
            "scope": "variable.parameter.cpp",
            "settings": {
                "foreground": "#ac90ff",
            }
        },
        {
            "scope": "entity.name.variable.parameter.cs",
            "settings": {
                "foreground": "#ac90ff",
            }
        },
        {
            "scope": "entity.name.variable.field.cs",
            "settings": {
                "foreground": "#90ffc9",
            }
        },
        {
            "scope": "entity.name.variable",
            "settings": {
                "foreground": "#ac90ff",
            }
        },
        {
            "scope": "variable.other.local.cpp",
            "settings": {
                "foreground": "#8dd5f4"
            }
        },
        {
            "scope": "meta.body.function.definition.cpp",
            "settings": {
                "foreground": "#8dd5f4"
            }
        },
        {
            "scope": [
                "variable.other.property.cpp"
            ],
            "settings": {
                "foreground": "#ade2ce"
            }
        },
        // {
        //     "scope": [
        //         "entity.name.variable.parameter.cs"
        //     ],
        //     "settings": {
        //         "foreground": "#AC90FF",
        //         // "fontStyle": "underline"
        //     }
        // },
        // {
        //     "scope": "variable.parameter",
        //     "settings": {
        //         "foreground": "#a58dff",
        //         "fontStyle": "underline"
        //     }
        // },
        // {
        //     "scope": "variable.declaration",
        //     "settings": {
        //         "foreground": "#a58dff",
        //         "fontStyle": "underline"
        //     }
        // },
        {
            "scope": "variable.other.property",
            "settings": {
                "foreground": "#8793ffe9"
            }
        },
        {
            "scope": "entity.name.type.cs",
            "settings": {
                "foreground": "#4EC9B0"
            }
        },
        {
            "scope": "entity.name.type.class.cs",
            "settings": {
                "foreground": "#4EC9B0",
                "fontStyle": "bold"
            }
        },
        {
            "scope": "entity.name.variable.field.cs",
            "settings": {
                "foreground": "#fd738f"
            }
        },
        {
            "scope": "variable.parameter.preprocessor.cpp",
            "settings": {
                "foreground": "#a58dff"
            }
        },
        {
            "scope": "meta.parens.cpp",
            "settings": {
                "foreground": "#a58dff"
            }
        },
        {
            "scope": "keyword.operator.cast.static_cast.cpp",
            "settings": {
                "foreground": "#c0cd47"
            }
        },
        {
            "scope": "variable.other.object.*",
            "settings": {
                "foreground": "#ff8dbe"
            }
        },
        {
            "scope": "entity.name.function.cs",
            "settings": {
                "foreground": "#c0cd47"
            }
        },
        {
            "scope": "variable.other.object.property.cs",
            "settings": {
                "foreground": "#c94e92"
            }
        },
        {
            "scope": "variable.other.property",
            "settings": {
                "foreground": "#45eb95",
            }
        },
        {
            "scope": "variable.parameter.function-call.python",
            "settings": {
                "foreground": "#45eb95",
            }
        },
        
        {
            "scope": "variable.parameter.ts",
            "settings": {
                "foreground": "#AC90FF"
            }
        },
        {
            "scope": "variable.other.constant.property.ts",
            "settings": {
                "foreground": "#45eb95"
            }
        },
        // {
        //     "scope": "variable.other.constant.object.ts",
        //     "settings": {
        //         "foreground": "#FFFFFF",
        //         "fontStyle": "underline",
        //     }
        // },
        {
            "scope": "variable.other.go",
            "settings": {
                "foreground": "#fd738f"
            }
        }
    ]
},

"editor.semanticHighlighting.enabled": true,
"editor.tokenColorCustomizations": {
    "textMateRules": [
        {
            "scope": "variable.other.global.cpp",
            "settings": {
                "foreground": "#dfb272"
            }
        },
        {
            "scope": "variable.parameter.cpp",
            "settings": {
                "foreground": "#ac90ff",
            }
        },
        {
            "scope": "entity.name.variable.parameter.cs",
            "settings": {
                "foreground": "#ac90ff",
            }
        },
        {
            "scope": "entity.name.variable.field.cs",
            "settings": {
                "foreground": "#90ffc9",
            }
        },
        {
            "scope": "entity.name.variable",
            "settings": {
                "foreground": "#ac90ff",
            }
        },
        {
            "scope": "variable.other.local.cpp",
            "settings": {
                "foreground": "#8dd5f4"
            }
        },
        {
            "scope": "meta.body.function.definition.cpp",
            "settings": {
                "foreground": "#8dd5f4"
            }
        },
        {
            "scope": [
                "variable.other.property.cpp"
            ],
            "settings": {
                "foreground": "#ade2ce"
            }
        },
        // {
        //     "scope": [
        //         "entity.name.variable.parameter.cs"
        //     ],
        //     "settings": {
        //         "foreground": "#AC90FF",
        //         // "fontStyle": "underline"
        //     }
        // },
        // {
        //     "scope": "variable.parameter",
        //     "settings": {
        //         "foreground": "#a58dff",
        //         "fontStyle": "underline"
        //     }
        // },
        // {
        //     "scope": "variable.declaration",
        //     "settings": {
        //         "foreground": "#a58dff",
        //         "fontStyle": "underline"
        //     }
        // },
        {
            "scope": "variable.other.property",
            "settings": {
                "foreground": "#8793ffe9"
            }
        },
        {
            "scope": "entity.name.type.cs",
            "settings": {
                "foreground": "#4EC9B0"
            }
        },
        {
            "scope": "entity.name.type.class.cs",
            "settings": {
                "foreground": "#4EC9B0",
                "fontStyle": "bold"
            }
        },
        {
            "scope": "entity.name.variable.field.cs",
            "settings": {
                "foreground": "#fd738f"
            }
        },
        {
            "scope": "variable.parameter.preprocessor.cpp",
            "settings": {
                "foreground": "#a58dff"
            }
        },
        {
            "scope": "meta.parens.cpp",
            "settings": {
                "foreground": "#a58dff"
            }
        },
        {
            "scope": "keyword.operator.cast.static_cast.cpp",
            "settings": {
                "foreground": "#c0cd47"
            }
        },
        {
            "scope": "variable.other.object.*",
            "settings": {
                "foreground": "#ff8dbe"
            }
        },
        {
            "scope": "entity.name.function.cs",
            "settings": {
                "foreground": "#c0cd47"
            }
        },
        {
            "scope": "variable.other.object.property.cs",
            "settings": {
                "foreground": "#c94e92"
            }
        },
        {
            "scope": "variable.other.property",
            "settings": {
                "foreground": "#45eb95",
            }
        },
        {
            "scope": "variable.parameter.function-call.python",
            "settings": {
                "foreground": "#45eb95",
            }
        },
        
        {
            "scope": "variable.parameter.ts",
            "settings": {
                "foreground": "#AC90FF"
            }
        },
        {
            "scope": "variable.other.constant.property.ts",
            "settings": {
                "foreground": "#45eb95"
            }
        },
        // {
        //     "scope": "variable.other.constant.object.ts",
        //     "settings": {
        //         "foreground": "#FFFFFF",
        //         "fontStyle": "underline",
        //     }
        // },
        {
            "scope": "variable.other.go",
            "settings": {
                "foreground": "#fd738f"
            }
        }
    ]
},


```

```
[
    {
        "key": "f16",
        "command": "runCommands",
        "args": {
            "commands": [
                "closeFindWidget",
                "vimAtHome.scrollToCursor",
            ]
        },
        "when": "editorTextFocus && !terminalFocus"
    },
    {
        "key": "f16",
        "command": "runCommands",
        "args": {
            "commands": [
                "closeFindWidget",
                "workbench.action.focusFirstEditorGroup",
                "vimAtHome.scrollToCursor",
            ]
        },
        "when": "!editorTextFocus && !terminalFocus"
    },
    {
        "key": "shift+f19",
        "command": "runCommands",
        "args": {
            "commands": [
                "search.action.focusSearchList",
            ]
        },
    },
    {
        "key": "ctrl+k ctrl+k",
        "command": "runCommands",
        "args": {
            "commands": [
                "workbench.action.toggleMaximizedPanel",
            ]
        },
        "when": "terminalFocus"
    },
    {
        "key": "ctrl+shift+up",
        "command": "ctrl+upSelect",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+down",
        "command": "cursorctrl+downSelect",
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
        "command": "vimAtHome.addSubjectRight",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+alt+left",
        "command": "cursorLineStart",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+alt+left",
        "command": "vimAtHome.addSubjectLeft",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'",
    },
    {
        "key": "ctrl+l",
        "command": "-center-editor-window.center",
        "when": "editorTextFocus || findWidgetVisible"
    },
    {
        "key": "alt+ctrl+up",
        "command": "editor.action.insertCursorAbove",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+ctrl+down",
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
        "key": "ctrl+shift+ctrl+up",
        "command": "workbench.action.moveEditorLeftInGroup",
        // "when": "editorTextFocus"
    },
    {
        "key": "ctrl+p",
        "command": "runCommands",
        "args": {
            "commands": [
                "workbench.action.quickOpen",
                "vimAtHome.changeToInsertModePrepend",
            ]
        },
        "when": "vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+shift+p",
        "command": "runCommands",
        "args": {
            "commands": [
                // "workbench.action.showCommands",
                // "vimAtHome.changeToInsertModePrepend",
                // "vimAtHome.saveEditorLayout",
            ]
        },
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
        "command": "GitVision.highlightCommits"
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
    {
        "key": "b",
        "command": "-vimAtHome.changeToBlockSubject",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "q",
        "command": "-vimAtHome.changeToSubwordSubject",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "`",
        "command": "-vimAtHome.changeToCharSubject",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "v",
        "command": "-vimAtHome.changeToExtendMode",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": ",",
        "command": "-vimAtHome.changeToInsertMode",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "v",
        "command": "-vimAtHome.changeToWordSubject",
        "when": "editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "x",
        "command": "-vimAtHome.changeToLineSubject",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "w",
        "command": "-vimAtHome.changeToWordSubject",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "backspace",
        "command": "-cursorUndo",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "r",
        "command": "-editor.action.quickFix",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+k",
        "command": "-vimAtHome.addSubjectDown",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+down",
        "command": "-vimAtHome.addSubjectDown",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+j",
        "command": "-vimAtHome.addSubjectLeft",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+left",
        "command": "-vimAtHome.addSubjectLeft",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+l",
        "command": "-vimAtHome.addSubjectRight",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+i",
        "command": "-vimAtHome.addSubjectUp",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+up",
        "command": "-vimAtHome.addSubjectUp",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+a",
        "command": "-vimAtHome.appendNewObject",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "c",
        "command": "-vimAtHome.change",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "n",
        "command": "-vimAtHome.changeToBracketSubject",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "escape",
        "command": "-vimAtHome.changeToCommandModeDefault",
        "when": "textInputFocus && !actionWidgetVisible && !cancellableOperation && !editorHasMultipleSelections && !inlineSuggestionVisible && !messageVisible && !notificationToastsVisible && !parameterHintsVisible && vimAtHome.mode == 'INSERT'"
    },
    {
        "key": "a",
        "command": "-vimAtHome.changeToInsertModeAppend",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "/",
        "command": "-vimAtHome.changeToInsertModeMidPoint",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "p",
        "command": "-vimAtHome.changeToInsertModePrepend",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+/",
        "command": "-vimAtHome.changeToInsertModeSurround",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+c",
        "command": "-vimAtHome.changeToLineEnd",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": ".",
        "command": "-vimAtHome.customVsCodeCommand",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "d",
        "command": "-vimAtHome.deleteSubject",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+d",
        "command": "-vimAtHome.duplicateSubject",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+h",
        "command": "-vimAtHome.extendToNextOccurrence",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+y",
        "command": "-vimAtHome.extendToPrevOccurrence",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "u",
        "command": "-vimAtHome.goToFirstSubjectInScope",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "o",
        "command": "-vimAtHome.goToLastSubjectInScope",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "h",
        "command": "-vimAtHome.goToNextOccurrence",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "y",
        "command": "-vimAtHome.goToPrevOccurrence",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "t",
        "command": "-vimAtHome.jump",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+;",
        "command": "-vimAtHome.newLineAbove",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": ";",
        "command": "-vimAtHome.newLineBelow",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "k",
        "command": "-vimAtHome.nextSubjectDown",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "j",
        "command": "-vimAtHome.nextSubjectLeft",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "l",
        "command": "-vimAtHome.nextSubjectRight",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "i",
        "command": "-vimAtHome.nextSubjectUp",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "g",
        "command": "-vimAtHome.openGoToMenu",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "m",
        "command": "-vimAtHome.openModifyMenu",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "z",
        "command": "-vimAtHome.openViewMenu",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+p",
        "command": "-vimAtHome.prependNewObject",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "enter",
        "command": "-vimAtHome.",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+enter",
        "command": "-vimAtHome.repeatLastSkipBackwards",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "s",
        "command": "-vimAtHome.skip",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+s",
        "command": "-vimAtHome.skipBackwards",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "f",
        "command": "-vimAtHome.skipOver",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+k",
        "command": "-vimAtHome.swapSubjectDown",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    // {
    //     "key": "ctrl+j",
    //     "command": "-vimAtHome.swapSubjectLeft",
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    // },
    {
        "key": "ctrl+l",
        "command": "-vimAtHome.swapSubjectRight",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+i",
        "command": "-vimAtHome.swapSubjectUp",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
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
    // {
    //     "key": "shift+left",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "vimAtHome.changeToInsertModePrepend",
    //             "cursorRight",
    //             "vimAtHome.changeToCustomWord1"
    //         ]
    //     },
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    // },
    // {
    //     "key": "shift+right",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "vimAtHome.changeToInsertModeAppend",
    //             "vimAtHome.changeToCustomWord1"
    //         ]
    //     },
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    // },
    // {
    //     "key": "shift+up",
    //     "command": "vimAtHome.changeToInsertMode",
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    // },
    // {
    //     "key": "ctrl+left",
    //     "command": "vimAtHome.goToFirstSubjectInScope",
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    // },
    // {
    //     "key": "ctrl+right",
    //     "command": "vimAtHome.goToLastSubjectInScope",
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    // },
    {
        "key": "alt+a",
        "command": "vimAtHome.changeToCharSubject",
        // "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "alt+b",
        "command": "vimAtHome.changeToSubwordSubject",
        // "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+shift+alt+b",
        "command": "vimAtHome.changeToSubwordSubject",
        // "when": "editorTextFocus"
    },
    // {
    //     "key": "alt+c",
    //     "command": "vimAtHome.changeToWordSubject",
    //     // "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    // },
    {
        "key": "alt+d",
        "command": "vimAtHome.changeToLineSubject",
        // "when": " && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "alt+e",
        "command": "vimAtHome.changeToBlockSubject",
        // "when": "vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "alt+f",
        "command": "vimAtHome.changeToBracketSubject",
        // "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+shift+alt+e",
        "command": "vimAtHome.changeToBlockSubject",
        // "when": "vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "alt+g",
        "command": "vimAtHome.changeToExtendMode",
        // "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "alt+h",
        "command": "vimAtHome.skip",
        // "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+alt+h",
        "command": "vimAtHome.skipBackwards",
        // "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "enter",
        "command": "vimAtHome.repeatLastSkip",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    // {
    //     "key": "shift+enter",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "vimAtHome.repeatLastSkipBackwards",
    //             // "vimAtHome.repeatLastSkip",
    //             // "vimAtHome.repeatLastSkip",
    //             // "vimAtHome.repeatLastSkipOverLine"
    //         ]
    //     },
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    // },
    {
        "key": "ctrl+;",
        "command": "vimAtHome.jump",
        "when": "editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+f16",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
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
                "vimAtHome.changeToWordSubject",
                // "settings.cycle.tempColor"
            ]
        }
    },
    {
        "key": "ctrl+shift+alt+down",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToBlockSubject",
                // "settings.cycle.tempColor"
                // "vimAtHome.addSubjectDown"
            ]
        }
    },
    {
        "key": "f20",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToInsertMode",
            ]
        }
    },
    {
        "key": "f19 left",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToInsertModePrepend",
            ]
        }
    },
    {
        "key": "f19 right",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToInsertModeAppend",
            ]
        }
    },
    {
        "key": "f19 up",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToInsertModeMidPoint",
                "cursorUp"
            ]
        }
    },
    {
        "key": "f19 down",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToInsertModeMidPoint",
                "cursorDown"
            ]
        }
    },
    // {
    //     "key": "shift+f20",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "vimAtHome.changeToInsertModePrepend",
    //         ]
    //     }
    // },
    // {
    //     "key": "ctrl+f20",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "vimAtHome.changeToInsertModeAppend",
    //         ]
    //     }
    // },
    {
        "key": "ctrl+enter",
        "command": "vimAtHome.newLineBelow",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+f18",
        "command": "cursorTrail",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+alt+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.skipBackwards"
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+shift+alt+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.changeToWordSubject",
                "vimAtHome.skipBackwards"
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'INSERT'"
    },
    {
        "key": "shift+alt+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.skip"
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+alt+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.changeToWordSubject",
                "vimAtHome.skip"
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'INSERT'"
    },
    {
        "key": "shift+alt+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.jump"
            ]
        },
        "when": "editorTextFocus && (vimAtHome.subject == 'LINE' || vimAtHome.subject == 'BRACKETS' || vimAtHome.subject == 'BLOCK')"
    },
    {
        "key": "ctrl+shift+alt+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.jump"
            ]
        },
        "when": "editorTextFocus && (vimAtHome.subject == 'LINE' || vimAtHome.subject == 'BRACKETS' || vimAtHome.subject == 'BLOCK')"
    },
    {
        "key": "alt+k",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.changeToSubwordSubject",
                // "vimAtHome.changeToCharSubject",
                "vimAtHome.skip",
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode != 'COMMAND' && vimAtHome.mode != 'EXTEND'"
    },
    // {
    //     "key": "shift+alt+enter",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
                // "editor.action.setSelectionAnchor",
    //             "vimAtHome.skipBackwards"
    //         ]
    //     },
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' && vimAtHome.mode == 'EXTEND'"
    // },
    // {
    //     "key": "shift+alt+h",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //               "vimAtHome.changeToWordSubject",
    //               "vimAtHome.skip"
    //           ]
    //       },
    //     "when": "editorTextFocus && vimAtHome.mode != 'COMMAND' && vimAtHome.mode != 'EXTEND'"
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
    // {
    //     "key": "shift+f17",
    //     "command": "bracket-select.undo-select",
    //     "when": "editorTextFocus"
    // },
    // {
    //     "key": "ctrl+right",
    //     "command": "vimAtHome.addSubjectRight",
    //     "when": "editorTextFocus && (vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'Extend')"
    // },
    // {
    //     "key": "ctrl+left",
    //     "command": "vimAtHome.addSubjectLeft",
    //     "when": "editorTextFocus && (vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'Extend')"
    // },
    // {
    //     "key": "delete",
    //     "command": "vimAtHome.changeToHalfBracketSubjectLeft",
    //     "when": "editorTextFocus && (vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'Extend')"
    // },
    {
        "key": "ctrl+t",
        "command": "UnderScroll.toggleUnderSynchronizedScrolling"
    },
    // {
    //     "key": "f19",
    //     "command": "cursorWordEndLeft"
    // },
    {
        "key": "f21",
        "command": "cursorWordStartRight"
    },
    {
        "key": "ctrl+f2",
        "command": "vimAtHome.openSpaceMenu",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+f1",
        "command": "vimAtHome.openViewMenu"
    },
    {
        "key": "shift+end",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToInsertMode",
                "cursorEndSelect"
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+home",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToInsertMode",
                "cursorBeginSelect"
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "shift+home",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToInsertMode",
                "cursorBeginSelect"
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+l",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToLineSubject",
            ]
        },
        "when": "editorTextFocus" // && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+f7",
        "command": "vimAtHome.changeToBlockSubject",
        "when": "editorTextFocus"
    },
    {
        "key": "f7",
        // "command": "vimAtHome.changeToCommandModeDefault",
        "command": "vimAtHome.changeToBlockSubject",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+f16",
        "command": "vimAtHome.swapSubjectLeft",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+f18",
        "command": "vimAtHome.swapSubjectRight",
        "when": "editorTextFocus"
    },
    // {
    //     "key": "alt+f18",
    //     "command": "codemarks.selectToMark",
    //     "when": "editorTextFocus"
    // },
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
        "command": "vimAtHome.changeToInsertModeMidPoint",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+down",
        "command": "vimAtHome.scrollEditorDown",
        "when": "editorTextFocus"
    },
    {
        "key": "end",
        "command": "runCommands",
        "args": {
            "commands": [
                // "vimAtHome.changeToInsertMode",
                "cursorEnd"
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "home",
        "command": "runCommands",
        "args": {
            "commands": [
                // "vimAtHome.changeToInsertMode",
                "cursorHome"
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+t",
        "command": "welcome.showNewFileEntries"
    },
    // {
    //     "key": ";",
    //     "command": "vimAtHome.jump",
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    // },
    {
        "key": "alt+shift+d",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.changeToCharSubject",
                // "editor.action.setSelectionAnchor",
                "vimAtHome.jumpToLineSubject"
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "alt+shift+d",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.changeToCharSubject",
                // "editor.action.setSelectionAnchor",
                "vimAtHome.jumpToLineSubject"
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode != 'COMMAND'"
    },
    {
        "key": "alt+shift+e",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.changeToCharSubject",
                // "editor.action.setSelectionAnchor",
                "vimAtHome.jumpToBlockSubject"
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "alt+shift+f",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.changeToCharSubject",
                // "editor.action.setSelectionAnchor",
                "vimAtHome.jumpToBracketSubject"
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "alt+shift+d",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.jumpToLineSubject"
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+alt+f",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.jumpToBlockSubject"
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "alt+shift+f",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.jumpToCustomWord6"
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "backspace",
        "command": "vimAtHome.deleteSubject",
        "when": "editorTextFocus && (vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND')"
    },
    {
        "key": "ctrl+shift+f17",
        "command": "search.action.focusSearchList",
        // "when": "editorTextFocus"//&& vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    // {
    //     // "key": "ctrl+t",
    //     // "command": "workbench.action.quickOpenPreviousEditor"
    // },
    {
        "key": "ctrl+t",
        "command": "workbench.action.openPreviousEditorFromHistory"
    },
    // {
    //     "key": "alt+ctrl+shift+1",
    //     "command": "workbench.action.openEditorAtIndex1"
    // },
    // {
    //     "key": "alt+ctrl+shift+2",
    //     "command": "workbench.action.openEditorAtIndex2"
    // },
    // {
    //     "key": "alt+ctrl+shift+3",
    //     "command": "workbench.action.openEditorAtIndex3"
    // },
    // {
    //     "key": "alt+ctrl+shift+4",
    //     "command": "workbench.action.openEditorAtIndex4"
    // },
    // {
    //     "key": "alt+ctrl+shift+5",
    //     "command": "workbench.action.openEditorAtIndex5"
    // },
    // {
    //     "key": "alt+ctrl+shift+6",
    //     "command": "workbench.action.openEditorAtIndex6"
    // },
    // {
    //     "key": "alt+ctrl+shift+7",
    //     "command": "workbench.action.openEditorAtIndex7"
    // },
    // {
    //     "key": "alt+ctrl+shift+8",
    //     "command": "workbench.action.openEditorAtIndex8"
    // },
    // {
    //     "key": "alt+ctrl+shift+9",
    //     "command": "workbench.action.openEditorAtIndex9"
    // },
    {
        "key": "ctrl+shift+f1",
        "command": "vimAtHome.openGoToMenu"
    },
    {
        "key": "ctrl+shift+f2",
        "command": "vimAtHome.openSpaceMenu"
    },
    {
        "key": "shift+ctrl+f9",
        "command": "vimAtHome.openViewMenu"
    },
    {
        "key": "ctrl+shift+f4",
        "command": "vimAtHome.openModifyMenu"
    },
    {
        "key": "ctrl+shift+f8",
        "command": "vimAtHome.openPullMenu"
    },
    {
        "key": "ctrl+a",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToInsertMode",
                "editor.action.selectAll",
            ],
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "space",
        "command": "-vimAtHome.openSpaceMenu",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+w",
        "command": "workbench.action.terminal.kill",
        "when": "terminalFocus"
    },
    {
        "key": "ctrl+t", // Or any other key combination you prefer
        "command": "workbench.action.terminal.new",
        "when": "terminalFocus"
    },
    {
        "key": "ctrl+;", // Or any other key combination you prefer
        "command": "vimAtHome.openTerminalAtFilePath",
        // "when": "terminalFocus"
    },
    {
        "key": "alt+f17",
        "command": "codemarks.jumpToMark"
    },
    // {
    //     "key": "ctrl+shift+c",
    //     "command": "vimAtHome.pullWord",
    //     "when": "editorTextFocus"
    // },
    // {
    //     "key": "ctrl+shift+alt+a",
    //     "command": "vimAtHome.pullCustomWord1",
    //     "when": "editorTextFocus"
    // },
    // {
    //     "key": "ctrl+shift+alt+c",
    //     "command": "vimAtHome.pullCustomWord3",
    //     "when": "editorTextFocus"
    // },
    // {
    //     "key": "ctrl+alt+d",
    //     "command": "vimAtHome.pullLineSubject",
    //     "when": "editorTextFocus"
    // },
    // {
    //     "key": "ctrl+alt+e",
    //     "command": "vimAtHome.pullBracketSubject",
    //     "when": "editorTextFocus"
    // },
    // {
    //     "key": "ctrl+alt+f",
    //     "command": "vimAtHome.pullBlockSubject",
    //     "when": "editorTextFocus"
    // },
    {
        "key": "ctrl+shift+f7",
        "command": "workbench.action.navigateToLastEditLocation",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+j a",
        "command": "vimAtHome.changeToCharSubject",
    },
    {
        "key": "ctrl+shift+j a",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.changeToCharSubject",
                "vimAtHome.jump",
            ],
        },
    },
    {
        "key": "ctrl+o",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.skipToChar"
                // "vimAtHome.changeToInsertModePrepend",
                // "vimAtHome.changeToCharSubject",
                // "vimAtHome.skip"
            ],
        },
        // "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+i",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.skipToCharReverse"
                // "vimAtHome.changeToInsertModeAppend",
                // "cursorLeft",
                // "vimAtHome.changeToCharSubject",
                // "vimAtHome.skipBackwards"
            ],
        },
        // "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+j alt+a",
        "command": "vimAtHome.pullCharSubject"
    },
    // Subword (b)
    {
        "key": "ctrl+j b",
        "command": "vimAtHome.changeToSubwordSubject",
    },
    {
        "key": "ctrl+shift+j b",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.changeToSubwordSubject",
                "vimAtHome.jump",
            ],
        },
    },
    {
        "key": "ctrl+j ctrl+b",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToInsertModePrepend",
                "vimAtHome.changeToSubwordSubject",
                "vimAtHome.skip",
            ],
        },
    },
    {
        "key": "ctrl+shift+j ctrl+b",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToSubwordSubject",
                "vimAtHome.skipBackwards",
            ],
        },
    },
    {
        "key": "ctrl+j alt+b",
        "command": "vimAtHome.pullSubword"
    },
    // Word (c)
    {
        "key": "ctrl+j c",
        "command": "vimAtHome.changeToWordSubject",
    },
    {
        "key": "ctrl+shift+j c",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.jumpToWordSubject",
            ],
        },
    },
    {
        "key": "ctrl+j ctrl+c",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToWordSubject",
                "vimAtHome.skip",
            ],
        },
    },
    {
        "key": "ctrl+shift+j ctrl+c",
        "command": "runCommands",
        "args": {
            "commands": [
                "-.changeToWordSubject",
                "vimAtHome.skipBackwards",
            ],
        },
    },
    {
        "key": "ctrl+j alt+c",
        "command": "vimAtHome.pullWord"
    },
    {
        "key": "ctrl+j e",
        "command": "vimAtHomeopullCustomWord4",

    },
    {
        "key": "ctrl+j alt+e",
        "command": "vimAtHome.pullCustomWord5"
    },
    // CustomWord3 (f)
    {
        "key": "ctrl+j f",
        "command": "vimAtHome.changeToCustomWord3",
    },
    {
        "key": "ctrl+shift+j f",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.jumpToCustomWord3",
            ],
        },
    },
    {
        "key": "ctrl+j ctrl+f",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToCustomWord3",
                "vimAtHome.skip",
            ],
        },
    },
    {
        "key": "ctrl+shift+j ctrl+f",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToCustomWord3",
                "vimAtHome.skipBackwards",
            ],
        },
    },
    {
        "key": "ctrl+j alt+f",
        "command": "vimAtHome.pullCustomWord6"
    },
    // Bracket (g)
    {
        "key": "ctrl+j g",
        "command": "vimAtHome.changeToBracketSubject",
    },
    {
        "key": "ctrl+shift+j g",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.jumpToBracketSubject",
            ],
        },
    },
    {
        "key": "ctrl+j ctrl+g",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToBracketSubject",
                "vimAtHome.skip",
            ],
        },
    },
    {
        "key": "ctrl+shift+j ctrl+g",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToBracketSubject",
                "vimAtHome.skipBackwards",
            ],
        },
    },
    {
        "key": "ctrl+j alt+g",
        "command": "vimAtHome.pullBracketSubject"
    },
    // Line (h)
    {
        "key": "ctrl+j h",
        "command": "vimAtHome.changeToLineSubject",
    },
    {
        "key": "ctrl+shift+j h",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.jumpToLineSubject",
            ],
        },
    },
    {
        "key": "ctrl+shift+j h",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToLineSubject",
                // "editor.action.setSelectionAnchor",
                "vimAtHome.jumpToLineSubject",
            ],
        },
        "when": "vimAtHome.mode != 'COMMAND' && vimAtHome.mode != 'EXTEND'"
    },
    {
        "key": "ctrl+j ctrl+h",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToLineSubject",
                "vimAtHome.skip",
            ],
        },
    },
    {
        "key": "ctrl+shift+j ctrl+h",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToLineSubject",
                "vimAtHome.skipBackwards",
            ],
        },
    },
    {
        "key": "ctrl+j alt+h",
        "command": "vimAtHome.pullLineSubject"
    },
    // File (i)
    {
        "key": "ctrl+j i",
        "command": "vimAtHome.changeToBlockSubject",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+shift+j i",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.jumpToBlockSubject",
            ],
        },
    },
    {
        "key": "ctrl+j ctrl+i",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToBlockSubject",
                "vimAtHome.skip",
            ],
        },
    },
    {
        "key": "ctrl+shift+j ctrl+i",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToBlockSubject",
                "vimAtHome.skipBackwards",
            ],
        },
    },
    {
        "key": "ctrl+j alt+i",
        "command": "vimAtHome.pullBlockSubject"
    },
    {
        "key": "alt+j",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.setSelectionAnchor",
                "vimAtHome.jumpToWordSubject",
            ],
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    // {
    //     "key": "alt+;",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
                // "editor.action.setSelectionAnchor",
    //             "vimAtHome.changeToWordSubject",
    //             "vimAtHome.jump",
    //         ],
    //     },
    //     "when": "editorTextFocus && (vimAtHome.mode != 'COMMAND' && vimAtHome.mode != 'EXTEND' || vimAtHome.subject == 'LINE' || vimAtHome.subject == 'BLOCK' || vimAtHome.subject == 'BRACKETS')"
    // },
    // {
    //     "key": "space",
    //     "command": "vimAtHome.changeToInsertMode",
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    // },
    // {
    //     "key": "ctrl+left",
    //     "command": "vimAtHome.changeToBlockSubject",
    //     "when": "editorTextFocus && vimAtHome.subject == 'CHAR'"
    // },
    // {
    //     "key": "ctrl+left",
    //     "command": "vimAtHome.changeToCharSubject",
    //     "when": "editorTextFocus && vimAtHome.subject == 'SUBWORD'"
    // },
    // {
    //     "key": "shift+ctrl+left",
    //     "command": "vimAtHome.prevWordDefinition",
    //     "when": "editorTextFocus && vimAtHome.subject == 'WORD' && vimAtHome.mode == 'COMMAND'"
    // },
    // {
    //     "key": "shift+ctrl+right",
    //     "command": "vimAtHome.nextWordDefinition",
    //     "when": "editorTextFocus && vimAtHome.subject == 'WORD'"
    // },
    // {
    //     "key": "ctrl+left",
    //     "command": "vimAtHome.changeToWordSubject",
    //     "when": "editorTextFocus && vimAtHome.subject == 'BRACKETS'"
    // },
    // {
    //     "key": "ctrl+left",
    //     "command": "vimAtHome.changeToBracketSubject",
    //     "when": "editorTextFocus && vimAtHome.subject == 'LINE'"
    // },
    // {
    //     "key": "ctrl+left",
    //     "command": "vimAtHome.changeToLineSubject",
    //     "when": "editorTextFocus && vimAtHome.subject == 'BLOCK'"
    // },
    // {
    //     "key": "ctrl+right",
    //     "command": "vimAtHome.changeToSubwordSubject",
    //     "when": "editorTextFocus && vimAtHome.subject == 'CHAR'"
    // },
    // {
    //     "key": "ctrl+right",
    //     "command": "vimAtHome.changeToWordSubject",
    //     "when": "editorTextFocus && vimAtHome.subject == 'SUBWORD'"
    // },
    // {
    //     "key": "ctrl+right",
    //     "command": "vimAtHome.changeToBracketSubject",
    //     "when": "editorTextFocus && vimAtHome.subject == 'BRACKETS'"
    // },
    // {
    //     "key": "ctrl+right",
    //     "command": "vimAtHome.changeToBlockSubject",
    //     "when": "editorTextFocus && vimAtHome.subject == 'LINE'"
    // },
    // {
    //     "key": "ctrl+right",
    //     "command": "vimAtHome.changeToCharSubject",
    //     "when": "editorTextFocus && vimAtHome.subject == 'BLOCK'"
    // },
    // {
    //     "key": "delete",
    //     "command": "workbench.action.terminal.newWithCwd"
    // }
    // {
    //     "key": "ctrl+shift+\\",
    //     "command": "vimAtHome.changeToBracketSubject",
    //     "when": "editorTextFocus"
    // },
    {
        "key": "alt+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.repeatLastSkip",
                "vimAtHome.changeToInsertModeAppend"
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode != 'COMMAND' && vimAtHome.mode != 'EXTEND'"
    },
    {
        "key": "shift+enter",
        "command": "runCommands",
        "args": {
            "commands": [
                // "editor.action.goToSelectionAnchor",
                // "vimAtHome.repeatLastSkipBackwards",
                "vimAtHome.goPrevSelection",
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    // {
    //     "key": "shift+enter",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             // "editor.action.goToSelectionAnchor",
    //             "vimAtHome.goPrevSelection",
    //         ]
    //     },
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' && vimAtHome.subject == 'BRACKETS'"
    // },
    {
        "key": "ctrl+right",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.nextWordDefinition",
                // "vimAtHome.nextSubjectRight",
                // "vimAtHome.nextSubjectRight"
            ]
        },
        "when": "editorTextFocus && vimAtHome.subject == 'WORD' && vimAtHome.mode != 'INSERT'"
    },
    {
        "key": "ctrl+left",
        "command": "runCommands",
        "args": {
            "commands": [
                // "vimAtHome.nextSubjectLeft",
                "vimAtHome.prevWordDefinition",
                // "vimAtHome.nextSubjectLeft"
            ]
        },
        "when": "editorTextFocus && vimAtHome.subject == 'WORD' && vimAtHome.mode != 'INSERT'"
    },
    // {
    //     "key": "ctrl+right",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "vimAtHome.nextSubjectRight",
    //             "vimAtHome.nextSubjectRight"
    //         ]
    //     },
    //     "when": "editorTextFocus && vimAtHome.subject == 'WORD' && vimAtHome.mode != 'INSERT'"
    // },
    {
        "key": "ctrl+left",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.nextSubjectLeft",
                "vimAtHome.nextSubjectLeft"
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "down",
        "command": "vimAtHome.nextSubjectDown",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'",
        "args": { "logicalLine": true },
    },
    {
        "key": "up",
        "command": "vimAtHome.nextSubjectUp",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+alt+down",
        "command": "vimAtHome.addSubjectDown",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
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
    // {
    //     "key": "ctrl+down",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             // "scrollEditorDown",
    //             "scrollLineDown",
    //             "scrollLineDown",
    //             "scrollLineDown",
    //             "scrollLineDown",
    //             "scrollLineDown",
    //             "scrollLineDown",
    //             "scrollLineDown",
    //             "scrollLineDown",
    //             "scrollLineDown",
    //             "scrollLineDown",
    //         ]
    //     },
    //     "when": "editorTextFocus"
    // },
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
    // {
    //     "key": "right",
    //     "command": "editor.action.inlineSuggest.acceptNextWord",
    //     "when": "inlineSuggestionVisible && !editorReadonly"
    // },
    // {
    //     "key": "tab",
    //     "command": "editor.action.inlineSuggest.acceptNextWord",
    //     "when": "inlineSuggestionVisible && !editorReadonly"
    // },
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
        "key": "ctrl+shift+ctrl+up",
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
                // "editor.action.setSelectionAnchor",
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
                // "vimAtHome.jumpToLineSubject",
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
                "vimAtHome.addSubjectLeft",
            ],
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "shift+end",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.addSubjectRight"
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
        "command": "vimAtHome.duplicateSubject",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "shift+alt+right",
        "command": "vimAtHome.duplicateSubject",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
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
        "key": "shift+ctrl+up",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToBlockSubjectHalfUp",
            ]
        },
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },

    {
        "key": "shift+ctrl+down",
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
        // "when": "listFocus && !inputFocus && !inQuickOpen"
        "when": "listFocus"
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
        // "when": "listFocus && !inputFocus && !inQuickOpen"
        "when": "listFocus"
    },
    {
        "key": "ctrl+up",
        "command": "runCommands",
        "args": {
            "commands": [
                "selectPrevSuggestion",
                "selectPrevSuggestion",
                "selectPrevSuggestion",
                "selectPrevSuggestion",
                "selectPrevSuggestion"
            ]
        },
        "when": "suggestWidgetVisible && textInputFocus"
    },
    {
        "key": "ctrl+down",
        "command": "runCommands",
        "args": {
            "commands": [
                "selectNextSuggestion",
                "selectNextSuggestion",
                "selectNextSuggestion",
                "selectNextSuggestion",
                "selectNextSuggestion"
            ]
        },
        "when": "suggestWidgetVisible && textInputFocus"
    },
    // {
    //     "key": "right",
    //     "command": "acceptSelectedSuggestion",
    //     "when": "suggestWidgetVisible && textInputFocus"
    // },
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
        "key": "ctrl+shift+\\",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.anchorSwap",
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+y",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToInsertModePrepend",
                "vimAtHome.changeToCharSubject",
                // "editor.action.setSelectionAnchor",
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
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
    },
    {
        "key": "ctrl+left",
        "command": "vimAtHome.goToFirstSubjectInScope",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND'"
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
        "when": "editorTextFocus"
    },
    // {
    //     "key": "left",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "vimAtHome.changeToWordSubject"
    //         ]
    //     },
    //     "when": "suggestWidgetVisible"
    // },
    // {
    //     "key": "right",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "vimAtHome.changeToWordSubject"
    //         ]
    //     },
    //     "when": "suggestWidgetVisible"
    // },
    {
        "key": "f24",
        "command": "runCommands",
        "args": {
            "commands": [
                // "closeFindWidget",
                "vimAtHome.changeToWordSubject"
            ]
        },
        "when": "findWidgetVisible"
    },
    {
        "key": "ctrl+shift+[",
        "command": "vimAtHome.foldAllAtLevel"
    },
    {
        "key": "ctrl+shift+]",
        "command": "editor.unfoldRecursively"
    },
    // {
    //     "key": "alt+f20",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "vimAtHome.changeToInsertModeMidPoint",
    //             "cursorUp"
    //         ]
    //     }
    // },
    // {
    //     "key": "alt+shift+f20",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "vimAtHome.changeToInsertModeMidPoint",
    //             "cursorDown"
    //         ]
    //     }
    // },
    {
        "key": "alt+shift+f20",
        "when": "editorTextFocus && EXTEND == 'COMMAND' && vimAtHome.mode == 'EXTEND'",
    },
    {
        "key": "ctrl+f",
        "command": "runCommands",
        "args": {
            "commands": [
                "actions.find",
                "vimAtHome.changeToInsertMode"
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
        "command": "vimAtHome.pasteFromCache",
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
        "command": "vimAtHome.pageUp",
        "when": "editorTextFocus"
    },
    {
        "key": "pageDown",
        "command": "vimAtHome.pageDown",
        "when": "editorTextFocus"
    },
    // {
    //     "key": "ctrl+down",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             {
    //                 "command": "cursorMove",
    //                 "args": {
    //                     "to": "down",
    //                     "by": "line",
    //                     "value": 25
    //                 }
    //             },
    //             // "vimAtHome.scrollToCursor",
    //         ]
    //     },
    //    "when": "editorTextFocus"
    // },
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
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND' || vimAtHome.mode == 'EXTEND' || inlineSuggestionVisible"
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
        "key": "ctrl+x",
        "command": "vimAtHome.cutToAnchor",
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
        "command": "vimAtHome.pasteFromCache",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+alt+delete",
        "command": "cursorUndo",
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
        "key": "ctrl+m",
        "command": "vimAtHome.createWaypoint",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+m",
        "command": "vimAtHome.teleportToWaypoint",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+shift+'",
        "command": "vimAtHome.clearWaypoints",
        "when": "editorTextFocus"
    },

    // {
    //     "key": "ctrl+f3",
    //     "command": "vimAtHome.findNextExact",
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    // },
    // {
    //     "key": "ctrl+shift+f3",
    //     "command": "vimAtHome.findPrevExact",
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    // },

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
        "command": "vimAtHome.showSelectToAnchor",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+/",
        "command": "vimAtHome.commentLine",
        "when": "editorTextFocus"
    },
    {
        "key": "shift+f16",
        "command": "editor.Action.addSelectionToPreviousFindMatch",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+l",
        "command": "vimAtHome.selectAllMatches",
    },
    {
        "key": "ctrl+1",
        "command": "workbench.action.openEditorAtIndex1"
    },
    {
        "key": "ctrl+2",
        "command": "workbench.action.openEditorAtIndex2"
    },
    {
        "key": "ctrl+3",
        "command": "workbench.action.openEditorAtIndex3"
    },
    {
        "key": "ctrl+shift+d",
        "command": "vimAtHome.addPrevMatch"
    },
    {
        "key": "ctrl+d",
        "command": "vimAtHome.addNextMatch"
    },
    {
        "key": "f",
        "command": "vimAtHome.skip",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "k",
        "command": "vimAtHome.skipBackwards",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "f18",
        "command": "runCommands",
        "args": {
            "commands": [
                "vimAtHome.changeToBlockSubject",
            ]
        },
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+k ctrl+alt+left",
        "command": "workbench.action.navigateBackInEditLocations"

    },
    {
        "key": "ctrl+k ctrl+alt+right",
        "command": "workbench.action.navigateForwardInEditLocations",
    },
    {
        "key": "ctrl+e",
        "command": "vimAtHome.goToLastEdit",
    },
    // {
    //     "key": "ctrl+up",
    //     "command": "vimAtHome.firstSymbolAbove"
    // },
    // {
    //     "key": "ctrl+down",
    //     "command": "vimAtHome.firstSymbolBelow"
    // },
    // {
    //     "key": "ctrl+k ctrl+alt+left",
    //     "command": "vimAtHome.goToNextEdit",
    //     "when": "editorTextFocus"
    // },
    // {
    //     "key": "ctrl+k ctrl+alt+right",
    //     "command": "vimAtHome.goToPrevEdit",
    //     "when": "editorTextFocus"
    // },
    // {
    //     "key": "f17",
    //     "command": "vimAtHome.openPullMenu",
    //     "when": "editorTextFocus"
    // },
    {
        "key": "ctrl+alt+shift+g",
        "command": "workbench.action.compareEditor.nextChange",
        "when": "textCompareEditorVisible"
    },
    {
        "key": "ctrl+alt+l",
        "command": "workbench.action.compareEditor.nextChange",
        "when": "textCompareEditorVisible"
    },
    {
        "key": "ctrl+alt+j",
        "command": "workbench.action.compareEditor.previousChange",
        "when": "textCompareEditorVisible"
    },
    {
        "key": "ctrl+alt+shift+g",
        "command": "vimAtHome.addSelectionToHighlights",
    },
    {
        "key": "ctrl+shift+p",
        "command": "vimAtHome.openTabLayoutMenu",
    },
    {
        "key": "escape",
        "command": "runCommands",
        "args": {
            "commands": [
                "closeFindWidget",
                "workbench.action.closeQuickOpen",
                "vimAtHome.changeToWordSubject"
            ]
        },
        "when": "findWidgetVisible || inQuickOpen"
    },
    {
        "key": "ctrl+shift+f3",
        "command": "vimAtHome.addSelectionToHighlights",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "ctrl+f3",
        "command": "vimAtHome.highlightSelection",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "b",
        "command": "vimAtHome.jumpToBlockSubject",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "b",
        "command": "vimAtHome.jumpToBlockSubject",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "r",
        "command": "vimAtHome.jumpToBracketSubject",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "shift+[",
        "command": "vimAtHome.goToStartOfFunction",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "shift+]",
        "command": "vimAtHome.goToEndOfFunction",
        "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    },
    {
        "key": "ctrl+;",
        "command": "vimAtHome.jumpToWordSubject",
        "when": "editorTextFocus"
    },
    {
        "key": "shift+enter",
        "command": "editor.action.inlineSuggest.trigger",
        "when": "editorTextFocus && vimAtHome.mode != 'COMMAND'"
    },
    // {
    //     "key": "ctrl+r",
    //     "command": "jupyter.runcurrentcell",
    //     "when": "editorTextFocus"
    // },
    {
        "key": "f9",
        "command": "-editor.debug.action.toggleBreakpoint",
        "when": "debuggersAvailable && disassemblyViewFocus || debuggersAvailable && editorTextFocus"
    },
    {
        "key": "shift+f9",
        "command": "-editor.debug.action.toggleInlineBreakpoint",
        "when": "editorTextFocus"
    },
    {
        "key": "tab",
        "command": "-editor.action.inlineSuggest.commit",
        "when": "inlineEditIsVisible && tabShouldAcceptInlineEdit && !editorHoverFocused && !editorTabMovesFocus && !suggestWidgetVisible || inlineSuggestionHasIndentationLessThanTabSize && inlineSuggestionVisible && !editorHoverFocused && !editorTabMovesFocus && !suggestWidgetVisible || inlineEditIsVisible && inlineSuggestionHasIndentationLessThanTabSize && inlineSuggestionVisible && !editorHoverFocused && !editorTabMovesFocus && !suggestWidgetVisible || inlineEditIsVisible && inlineSuggestionVisible && tabShouldAcceptInlineEdit && !editorHoverFocused && !editorTabMovesFocus && !suggestWidgetVisible"
    },
    {
        "key": "tab",
        "command": "-editor.action.inlineSuggest.commit",
        "when": "inInlineEditsPreviewEditor"
    },
    // {
    //     "key": "shift+enter",
    //     "command": "editor.action.inlineSuggest.commit",
    //     "when": "vimAtHome.mode == 'INSERT'"
    // },
    // {
    //     "key": "shift+enter",
    //     "command": "acceptSelectedSuggestion",
    //     "when": "suggestWidgetHasFocusedSuggestion && suggestWidgetVisible && textInputFocus"
    // },
    {
        "key": "tab",
        "command": "-acceptSelectedSuggestion",
        "when": "suggestWidgetHasFocusedSuggestion && suggestWidgetVisible && textInputFocus"
    },
    {
        "key": "ctrl+m",
        "command": "-editor.action.toggleTabFocusMode"
    },
    {
        "key": "ctrl+shift+t",
        "command": "-mergeEditor.toggleBetweenInputs",
        "when": "isMergeEditor"
    },
    {
        "key": "ctrl+shift+t",
        "command": "-workbench.action.reopenClosedEditor"
    },
    // {
    //     "key": "delete",
    //     "command": "vimAtHome.findAllHighlights",
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    // },
    // {
    //     "key": "f",
    //     "command": "vimAtHome.splitBy",
    //     "when": "editorTextFocus && vimAtHome.mode == 'COMMAND'"
    // },
    // {
    //     "key": "ctrl+`",
    //     "command": "runCommands",
    //     "args": {
    //         "commands": [
    //             "workbench.action.closeQuickOpen",
    //             "vimAtHome.changeToWordSubject"
    //         ]
    //     },
    //     "when": "findWidgetVisible || inQuickOpen"
    // },

]






```