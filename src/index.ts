import { Decoration, EditorView, ViewPlugin, ViewUpdate, type DecorationSet } from '@codemirror/view';
import { type Range } from '@codemirror/state';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { HighlightStyle, LanguageDescription, LanguageSupport, syntaxHighlighting, syntaxTree, TagStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { StrongEmphasis } from './markdown/bold';
import { LinkDecoration } from './markdown/link';
import { ItalicEmphasis } from './markdown/italic';
import { HeadingDecoration } from './markdown/headings';
import { InlineCode } from './markdown/inline-code';
import { Blockquote } from './markdown/blockquote';
import { ListItem } from './markdown/list-item';
import { CodeBlock } from './markdown/code-block';



import { javascriptLanguage } from '@codemirror/lang-javascript';

// Custom highlight style for markdown


// const mixedLanguage = LRLanguage.define({
//   parser: markdownLanguage.parser.
// })
// markdownLanguage.

// // Markdown extensions with custom highlighting
export const markdownExtensions = markdown({
  base: markdownLanguage,
  codeLanguages: (info: string) => {
    if (info.startsWith('js') || info.startsWith('javascript')) {
    
      return LanguageDescription.of(
        {
          name: 'javascript',
          async load() {
            return new LanguageSupport(javascriptLanguage);
          },
        }
      )
    }
      
    
    return null;
  },
  extensions: []
});



const allDecorations = [
  new StrongEmphasis(),
  new LinkDecoration(),
  new ItalicEmphasis(),
  new HeadingDecoration(1),
  new HeadingDecoration(2),
  new HeadingDecoration(3),
  new HeadingDecoration(4),
  new HeadingDecoration(5),
  new HeadingDecoration(6),
  new InlineCode(),
  new Blockquote(),
  new ListItem(),
  new CodeBlock(),
//   Paragraph
// index.ts:76 Emphasis
// 2index.ts:76 EmphasisMark
// index.ts:76 ListItem
// index.ts:76 ListMark
// index.ts:76 Paragraph
// index.ts:76 InlineCode
// 2index.ts:76 CodeMark
// index.ts:76 ListItem
// index.ts:76 ListMark
// index.ts:76 Paragraph
// index.ts:76 Link
// 3index.ts:76 LinkMark
// index.ts:76 URL
// index.ts:76 LinkMark
// index.ts:76 ATXHeading5
// index.ts:76 HeaderMark
// index.ts:76 FencedCode
// index.ts:76 CodeMark
// index.ts:76 CodeInfo
// index.ts:76 CodeText
// index.ts:76 CodeMark
// index.ts:76 ATXHeading6
// index.ts:76 HeaderMark
// index.ts:76 Paragraph
// index.ts:76 HorizontalRule
// index.ts:76 Blockquote
// index.ts:76 QuoteMark
// index.ts:76 Paragraph
// index.ts:76 InlineCode
// 2index.ts:76 CodeMark
// index.ts:76 Paragraph
]

export const customHighlightStyle = HighlightStyle.define([
  ...allDecorations.map(d => d.style).filter(Boolean) as TagStyle[],
  { tag: tags.content, fontFamily: "sans-serif" },
]);

const ALL_NODE_NAMES = new Set(allDecorations.map(d => d.nodeName))
const DECORATION_MAP = Object.fromEntries(allDecorations.map(d => [d.nodeName, d]))

function markdownDecorations(view: EditorView) {
  const selection = view.state.selection;
  let widgets: Range<Decoration>[] = []
  for (let { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: (node) => {
        if (ALL_NODE_NAMES.has(node.name)) {
          const overlaps = node.from <= selection.main.to && node.to >= selection.main.from;
          if (!overlaps) {
            const decoration = DECORATION_MAP[node.name]  
            const text = view.state.sliceDoc(node.from, node.to)
            widgets.push(...decoration.getDecorations(node.from, node.to, text))
          }
        }
      }
    })
  }
  // we need to sort the widgets by from
  widgets.sort((a, b) => a.from - b.from)
  return Decoration.set(widgets)
}

const checkboxPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = markdownDecorations(view)
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged || update.selectionSet ||
      syntaxTree(update.startState) != syntaxTree(update.state))
      this.decorations = markdownDecorations(update.view)
  }
}, {
  decorations: v => v.decorations,

})


// Main plugin that combines all markdown enhancements
export const enhancedMarkdown = [
  syntaxHighlighting(customHighlightStyle),
  markdownExtensions,
  
  // hideMarkdownChars
  checkboxPlugin
];

// Export individual components for custom usage
export { InlineCode } from './markdown/inline-code';
export { Blockquote } from './markdown/blockquote';
