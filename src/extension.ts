import * as vscode from 'vscode';

import {formatFilename, getFileNameFromUser,
        openFile, createFile, postSnippet,
        getDateTime, shouldInsertFrontMatter, setFrontMatter} from './utils';

export function
activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.beLikeJekyll.createPost',
    async (uri: vscode.Uri) => {
      const dirName = uri.fsPath;
      try {
        var filename = await getFileNameFromUser();
      } catch(e) {
        return;
      }
      const userFilePath = formatFilename(filename);
      try {
        let editor = await openFile(await createFile(dirName, userFilePath));
        // Insert snippet only if the user did not provide a template file and
        // a new post file had to be created
        if (shouldInsertFrontMatter()) {
          const snippetStr = postSnippet.replace('YYYY', getDateTime());
          editor.insertSnippet(new vscode.SnippetString(snippetStr));
          setFrontMatter(false);
        }
      } catch (err) {
        vscode.window.showErrorMessage(err);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function
deactivate() {

}
