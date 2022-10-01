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
  return { lang: "", data: "" };
};

export function activate(context: vscode.ExtensionContext) {
  console.log("Y2J is now active!");
  const disposable = vscode.commands.registerCommand(
    "y2j.toggleFiletype",
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        return;
      }
      const document = activeEditor.document;
      const text = document.getText();
      const convertedText = convert(text);

      const documentPath = path.parse(document.fileName);
      const altFile = !documentPath.ext
        ? document.fileName
        : path.format({
            ...documentPath,
            base: "",
            ext: "." + convertedText.lang,
          });

      fs.writeFileSync(altFile, convertedText.data);
      const tempDocument = await vscode.workspace.openTextDocument(altFile);
      if (documentPath.ext) {
        await vscode.commands.executeCommand(
          "workbench.action.closeActiveEditor"
        );
        fs.rmSync(document.fileName);
      }
      await vscode.languages.setTextDocumentLanguage(
        tempDocument,
        convertedText.lang
      );
      await tempDocument.save();
      await vscode.window.showTextDocument(tempDocument);
    }
  );

  context.subscriptions.push(disposable);
}
