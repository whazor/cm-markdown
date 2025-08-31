# cm-markdown

A CodeMirror plugin for enhanced markdown editing with hidden markdown syntax characters.

## Features

- **Hidden Markdown Syntax**: Automatically hides markdown syntax characters (like `#` for headings) when the cursor is not on that line
- **Custom Highlighting**: Enhanced syntax highlighting for markdown elements
- **Focus-based Visibility**: Markdown syntax is only visible on the line where the cursor is positioned
- **Seamless Integration**: Easy to integrate with existing CodeMirror setups

## TODO

- [ ] code blocks style need language support, which is something codemirror already supports but i was not able to configure it yet
- [ ] tables
- [ ] blockquotes look a bit ugly
- [ ] horizontal rule
- [ ] images

Also overall battletesting and bug fixing.

## Project Structure

This is a pnpm workspace with the following packages:

- `src/` - The main plugin package (`cm-markdown`)
- `example/` - Example usage and demo

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd cm-markdown

# Install dependencies
pnpm install

# Build the plugin
pnpm build

# Run the example
pnpm dev
```

## Usage

### Basic Usage

```typescript
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { minimalSetup } from 'codemirror';
import { enhancedMarkdown } from 'cm-markdown';

const state = EditorState.create({
  doc: '# Hello World\n\nThis is **bold** text.',
  extensions: [
    minimalSetup,
    enhancedMarkdown
  ]
});

const view = new EditorView({
  state,
  parent: document.querySelector('#editor')
});
```

### Advanced Usage

You can also use individual components for more customization:

```typescript
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { minimalSetup } from 'codemirror';
import { 
  markdownExtensions, 
  customHighlightStyle, 
  hideMarkdownChars,
  syntaxHighlighting 
} from 'cm-markdown';

const state = EditorState.create({
  doc: '# My Document\n\n## Section\n\nContent here.',
  extensions: [
    minimalSetup,
    markdownExtensions,
    syntaxHighlighting(customHighlightStyle),
    hideMarkdownChars
  ]
});
```

### CSS Styling

Add this CSS to hide the markdown syntax characters:

```css
.hidden {
  display: none;
}
```

## API Reference

### `enhancedMarkdown`

The main plugin that combines all markdown enhancements. This is the recommended way to use the plugin.

### `markdownExtensions`

Enhanced markdown language support with custom configuration.

### `customHighlightStyle`

Custom highlight style for markdown elements:
- Level 1 headings: 1.6em, bold
- Level 2 headings: 1.4em, bold
- Bold text: bold weight
- Italic text: italic style

### `hideMarkdownChars`

Plugin that hides markdown syntax characters when the cursor is not on the current line.

### `HiddenWidget`

Widget class used internally to create hidden elements.

## How It Works

The plugin uses CodeMirror's `ViewPlugin` and `MatchDecorator` to:

1. Detect markdown syntax patterns (like `# ` for headings)
2. Track the current cursor line
3. Hide syntax characters on lines where the cursor is not positioned
4. Show syntax characters only on the line where the cursor is active

This creates a clean, distraction-free editing experience while maintaining the ability to see and edit markdown syntax when needed.

## Development

### Workspace Commands

```bash
# Install all dependencies
pnpm install

# Build the plugin
pnpm build

# Run the example in development mode
pnpm dev

# Build all packages
pnpm build:all

# Run all packages in development mode
pnpm dev:all

# Clean all build artifacts
pnpm clean
```

### Individual Package Commands

```bash
# Build just the plugin
pnpm --filter cm-markdown build

# Run just the example
pnpm --filter example dev

# Build the plugin in watch mode
pnpm --filter cm-markdown dev
```

## Example

The `example/` package contains a complete demonstration of the plugin. To run it:

```bash
pnpm dev
```

Then open your browser to see the plugin in action. Move your cursor around the editor to see the markdown syntax characters appear and disappear.

## License

MIT
