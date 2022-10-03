import * as vscode from "vscode";
import * as YAML from "yaml";
import * as fs from "fs";
import * as path from "path";

const convert = (text: string) => {
  try {
    return { lang: "yaml", data: YAML.stringify(JSON.parse(text)) };
  } catch (e) {}
  try {
    return { lang: "json", data: JSON.stringify(YAML.parse(text), null, 2) };
  } catch (e) {}
  return { lang: "error", data: "" };
};

export function activate(context: vscode.ExtensionContext) {
  console.log("Y2J is now active!");
  const disposable = vscode.commands.registerCommand(
    "y2j.toggleFiletype",
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showErrorMessage("Error, no active editor.");
        return;
      }

      const document = activeEditor.document;
      const text = document.getText();
      const convertedText = convert(text);

      if (convertedText.lang === "error") {
        vscode.window.showErrorMessage(
          `Error parsing: ${document.fileName} Are you sure it's valid JSON or YAML?`
        );
        return;
      }
      const documentPath = path.parse(document.fileName);
      const altFile = !documentPath.ext
        ? document.fileName
        : path.format({
            ...documentPath,
            base: "",
            ext: "." + convertedText.lang,
          });

      await document.save();
      try {
        fs.writeFileSync(altFile, convertedText.data);
      } catch (e) {
        vscode.window.showErrorMessage("Error writing document.");
        return;
      }

      await vscode.commands.executeCommand(
        "workbench.action.closeActiveEditor"
      );
      if (documentPath.ext) {
        try {
          fs.rmSync(document.fileName);
        } catch (e) {
          vscode.window.showErrorMessage("Error removing document.");
        }
      }
      const newDocument = await vscode.workspace.openTextDocument(altFile);
      await newDocument.save();
      await vscode.languages.setTextDocumentLanguage(
        newDocument,
        convertedText.lang
      );
      await vscode.window.showTextDocument(newDocument);
    }
  );
  context.subscriptions.push(disposable);
}
