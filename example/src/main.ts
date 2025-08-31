import "./style.css";
import { EditorState, Compartment } from "@codemirror/state";
import {
  EditorView,
  keymap,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
} from "@codemirror/view";
import { indentOnInput, bracketMatching } from "@codemirror/language";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { closeBracketsKeymap } from "@codemirror/autocomplete";
import { lintKeymap } from "@codemirror/lint";
import { oneDark } from "@codemirror/theme-one-dark";

// Import our markdown plugin from the workspace (development source)
import { enhancedMarkdown } from "cm-markdown/src";

// Create a compartment for dynamic theme switching
const editorTheme = new Compartment();

// Function to detect if dark mode is active
const isDarkMode = () => {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};

// Function to create editor state with theme
const createEditorState = (isDark: boolean) => {
  const theme = isDark ? oneDark : [];
  return EditorState.create({
    doc: sampleMarkdown,
    extensions: [
      // A line number gutter
      // lineNumbers(),
      // A gutter with code folding markers
      // foldGutter(),
      // Replace non-printable characters with placeholders
      highlightSpecialChars(),
      // The undo history
      history(),
      // Line wrapping
      EditorView.lineWrapping,

      keymap.of([indentWithTab]),

      // Replace native cursor/selection with our own
      drawSelection(),
      // Show a drop cursor when dragging over the editor
      dropCursor(),
      // Allow multiple cursors/selections
      EditorState.allowMultipleSelections.of(true),
      // Re-indent lines when typing specific input
      indentOnInput(),
      // Highlight matching brackets near cursor
      bracketMatching(),
      // Automatically close brackets
      // closeBrackets(),
      // Load the autocompletion system
      // autocompletion(),
      // Allow alt-drag to select rectangular regions
      rectangularSelection(),
      // Change the cursor to a crosshair when holding alt
      crosshairCursor(),
      // Style the current line specially
      // highlightActiveLine(),
      // Style the gutter for current line specially
      // highlightActiveLineGutter(),
      // Highlight text that matches the selected text
      highlightSelectionMatches(),
      // Our enhanced markdown plugin
      enhancedMarkdown,
      // Dynamic theme compartment
      editorTheme.of(theme),
      keymap.of([
        // Closed-brackets aware backspace
        ...closeBracketsKeymap,
        // A large set of basic bindings
        ...defaultKeymap,
        // Search-related keys
        ...searchKeymap,
        // Redo/undo keys
        ...historyKeymap,
        // Code folding bindings
        // ...foldKeymap,
        // Autocompletion keys
        // ...completionKeymap,
        // Keys related to the linter system
        ...lintKeymap,
      ]),
    ],
  });
};

// Function to update theme dynamically
const updateTheme = (isDark: boolean) => {
  const theme = isDark ? oneDark : [];
  if (cm) {
    cm.dispatch({
      effects: editorTheme.reconfigure(theme),
    });
  }
};

// Sample markdown content to demonstrate the plugin
const sampleMarkdown = `# Welcome to cm-markdown

This is an enhanced markdown editor that hides syntax characters when you're not editing them.

## Key Features

- **Hidden Syntax**: Markdown characters like \`#\` are hidden when your cursor is not on that line
- **Clean Interface**: Focus on your content, not the syntax
- **Easy to Use**: Just like a regular markdown editor, but cleaner

### Todo items

- [ ] Implement dark mode support
- [x] Add support for code folding
- [ ] Improve autocompletion functionality

### How It Works

1. Move your cursor to different lines
2. Notice how the \`#\` characters for headings are only visible on the line where your cursor is positioned
3. This creates a distraction-free editing experience

#### Example Lists

- **Bold items** in lists work too
  - sub lists as well!
- *Italic text* is also supported
- \`Inline code\` highlighting
- [Links](https://example.com) are preserved


##### Code Blocks

\`\`\`javascript
// Code blocks are fully supported
function hello() {
  console.log("Hello, markdown!");
}
\`\`\`

###### Deep Headings

Even level 6 headings work with the hidden syntax feature.

---

> Blockquotes are also supported and will show the \`>\` character only when editing.

Try moving your cursor around to see the effect! The markdown syntax characters will appear and disappear based on your cursor position.`;

const cm = new EditorView({
  state: createEditorState(isDarkMode()),
  parent: document.getElementById("editor-container") as HTMLElement,
});

// Listen for system theme changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    updateTheme(e.matches);
  });

// Add manual theme toggle functionality
let currentTheme = isDarkMode();
const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    currentTheme = !currentTheme;
    updateTheme(currentTheme);
    themeToggle.textContent = currentTheme ? "Light Mode" : "Dark Mode";
  });

  // Set initial button text
  themeToggle.textContent = currentTheme ? "Light Mode" : "Dark Mode";
}
