import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as converter from "./converter";

const convert = (text: string) => {
  try {
    return { lang: "yaml", data: converter.jtoy(text) };
  } catch (e) {
    console.log(e);
  }
  try {
    return { lang: "json", data: converter.ytoj(text) };
  } catch (e) {
    console.log(e);
  }
  return { lang: "error", data: "" };
};

export const extensionConfig = vscode.workspace.getConfiguration("yjc");

export function activate(context: vscode.ExtensionContext) {
  console.log("YJC is now active!");
  const disposable = vscode.commands.registerCommand(
    "yjc.toggleFiletype",
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
        vscode.window.showErrorMessage(
          "Error writing document.\n" + (e as Error).stack
        );
        return;
      }

      await vscode.commands.executeCommand(
        "workbench.action.closeActiveEditor"
      );
      if (documentPath.ext) {
        try {
          fs.rmSync(document.fileName);
        } catch (e) {
          vscode.window.showErrorMessage(
            "Error removing document.\n" + (e as Error).stack
          );
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
