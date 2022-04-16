// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import ace from "ace-builds";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-plain_text";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-rust";

import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";

// ace for request body
let aceRequest: ace.Ace.Editor = ace.edit("request-body");
aceRequest.setShowPrintMargin(false);
aceRequest.setFontSize("12pt");
aceRequest.setTheme("ace/theme/tomorrow_night_eighties");
aceRequest.getSession().setMode("ace/mode/json");

// ace for response body
let aceResponse: ace.Ace.Editor = ace.edit("response-text");
aceResponse.setShowPrintMargin(false);
aceResponse.setReadOnly(true);
aceResponse.setFontSize("12pt");
aceResponse.setTheme("ace/theme/tomorrow_night_eighties");
aceResponse.getSession().setMode("ace/mode/json");

// ace for code body
let aceCode: ace.Ace.Editor = ace.edit("code-body");
aceCode.setShowPrintMargin(false);
aceCode.setReadOnly(true);
aceCode.setFontSize("12pt");
aceCode.setTheme("ace/theme/tomorrow_night_eighties");
aceCode.getSession().setMode("ace/mode/javascript");

export { aceRequest, aceResponse, aceCode };
