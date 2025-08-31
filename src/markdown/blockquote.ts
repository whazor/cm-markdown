import { Decoration, WidgetType } from '@codemirror/view';
import { HiddenWidget, MarkdownDecoration } from './base';
import { type Range } from '@codemirror/state';
import { tags } from '@lezer/highlight';

class BlockquoteWidget extends WidgetType {
  constructor() { super() }

  eq(other: BlockquoteWidget) { return true }

  toDOM() {
    let wrap = document.createElement("span")
    wrap.className = "cm-blockquote-marker"
    wrap.style.borderLeft = "4px solid var(--cm-blockquote-border-color, currentColor)"
    wrap.style.paddingLeft = "16px"
    wrap.style.marginLeft = "0"
    wrap.style.display = "inline-block"
    wrap.style.width = "0"
    wrap.style.height = "1em"
    wrap.style.lineHeight = "1"
    wrap.style.paddingTop = "-4px"
    wrap.style.paddingBottom = "-4px"
    return wrap
  }

  ignoreEvent() { return false }
}

export class Blockquote extends MarkdownDecoration {
  style = {
    tag: tags.quote,
    fontStyle: "italic"
  };
  nodeName = "Blockquote"

  getDecorations(from: number, to: number, text: string) {
    let widgets: Range<Decoration>[] = []
    
    // Find all '> ' patterns in the text
    let currentIndex = 0
    while (true) {
      const gtSpaceIndex = text.indexOf('> ', currentIndex)
      if (gtSpaceIndex === -1) break
      
      // Create decoration for this '> ' part with styling widget
      let quoteDeco = Decoration.replace({
        widget: new BlockquoteWidget(),
        side: 1
      })
      widgets.push(quoteDeco.range(from + gtSpaceIndex, from + gtSpaceIndex + 2))
      
      // Move to next position to find more '> ' patterns
      currentIndex = gtSpaceIndex + 2
    }
    
    return widgets;
  }
} 