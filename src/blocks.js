var vscode = require("vscode");

/**
 * Get the nearest line below the cursor with the same indents
 * @param {TextEditor} editor The active text editor
 * @returns {TextLine}
 */
function getLineBelow(editor) {
  const document = editor.document;
  var line = editor.selection.active.line;
  var indents = editor.selection.active.character;

  max = document.lineCount - 1;
  var found = false;
  while (line < max) {
    ++line;
    if (document.lineAt(line).text.search(/\S|$/) == indents) {
      found = true;
      break;
    }
  }
  return [found, document.lineAt(line)];
}

/**
 * Get the nearest line above the cursor with the same indents
 * @param {TextEditor} editor The active text editor
 * @returns {TextLine}
 */
function getLineAbove(editor) {
  const document = editor.document;
  var line = editor.selection.active.line;
  var indents = editor.selection.active.character;

  min = 0;
  var found = false;
  while (line > min) {
    --line;
    if (document.lineAt(line).text.search(/\S|$/) == indents) {
      found = true;
      break;
    }
  }
  return [found, document.lineAt(line)];
}

/**
 * Move the cursor to a new position, unselecting selected text.
 * @param {TextEditor} editor The active text editor
 * @param {Position} newPosn The new position
 */
function changeActive(editor, newPosn) {
  var newSelection = new vscode.Selection(newPosn, newPosn);
  editor.selection = newSelection;
  editor.revealRange(new vscode.Range(newPosn, newPosn));
}

/**
 * Move the cursor to a new position, preserving text selection.
 * @param {TextEditor} editor The active text editor
 * @param {Positon} newPosn The new position
 */
function changeActiveSelect(editor, newPosn) {
  const anchor = editor.selection.anchor;
  var newSelection = new vscode.Selection(anchor, newPosn);
  editor.selection = newSelection;
  editor.revealRange(new vscode.Range(newPosn, newPosn));
}

/**
 * Move the cursor down by one `paragraph`.
 * @param {TextEditor} editor The active text editor
 */
function blockTravelDown(editor) {
  const [found, line] = getLineBelow(editor);
  if (!found) {
    vscode.window.showInformationMessage("No line below has the same indents.");
  } else {
    const newPosn = new vscode.Position(
      line.lineNumber,
      line.text.search(/\S|$/)
    ); // Beginning of line, in case is first line
    changeActive(editor, newPosn);
  }
}

/**
 * Move the cursor down by one `paragraph`, selecting text.
 * @param {TextEditor} editor The active text editor
 */
function blockSelectDown(editor) {
  const [found, line] = getLineBelow(editor);
  if (!found) {
    vscode.window.showInformationMessage("No line below has the same indents.");
  } else {
    const newPosn = new vscode.Position(
      line.lineNumber,
      line.text.search(/\S|$/)
    ); // End of line, in case is last line
    changeActiveSelect(editor, newPosn);
  }
}

/**
 * Move the cursor up by one `paragraph`
 * @param {TextEditor} editor The active text editor
 */
function blockTravelUp(editor) {
  const [found, line] = getLineAbove(editor);

  if (!found) {
    vscode.window.showInformationMessage("No line above has the same indents.");
  } else {
    const newPosn = new vscode.Position(
      line.lineNumber,
      line.text.search(/\S|$/)
    );
    changeActive(editor, newPosn);
  }
}

/**
 * Move the cursor up by one `paragraph`, selecting text.
 * @param {TextEditor} editor The active text editor
 */
function blockSelectUp(editor) {
  const [found, line] = getLineAbove(editor);
  if (!found) {
    vscode.window.showInformationMessage("No line above has the same indents.");
  } else {
    const newPosn = new vscode.Position(
      line.lineNumber,
      line.text.search(/\S|$/)
    );
    changeActiveSelect(editor, newPosn);
  }
}

exports.blockTravelUp = blockTravelUp;
exports.blockTravelDown = blockTravelDown;
exports.blockSelectUp = blockSelectUp;
exports.blockSelectDown = blockSelectDown;
