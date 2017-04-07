var vscode = require('vscode');
var prettydiff = require("./libs/prettydiff");
var fs = require("fs");
function activate(context) {

    var vscodePrettydiff = vscode
        .commands
        .registerCommand('extension.prettyDiff', function () {
            var editor = vscode.window.activeTextEditor;
            if (!editor) {
                return; // No open text editor
            }

            var source = editor
                .document
                .getText();
            var args = {
                source: source,
                mode: "beautify",
                lang: "auto"
            };
            var output = prettydiff(args);
            var path = editor.document.uri.path;
            console.log(path);
            fs.writeFile(path, output, (err) => {
                if (err) 
                    throw err;
                }
            );
            var document = editor.document;
            var lastLine = document.lineAt(document.lineCount - 1);
            var start = new vscode.Position(0, 0);
            var end = new vscode.Position(document.lineCount - 1, lastLine.text.length);
            editor.edit(function (builder) {
                builder.replace(new vscode.Range(start, end), output);
            });

        });

    context
        .subscriptions
        .push(vscodePrettydiff);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;