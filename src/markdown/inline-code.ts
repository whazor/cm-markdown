import { Decoration } from '@codemirror/view';
import { HiddenWidget, MarkdownDecoration } from './base';
import { type Range } from '@codemirror/state';
import { tags } from '@lezer/highlight';

export class InlineCode extends MarkdownDecoration {
  nodeName = "InlineCode"

  style = {
    tag: tags.literal,
    fontFamily: "monospace",
    fontSize: "0.9em"
  }

  getDecorations(from: number, to: number, _text: string) {
    let widgets: Range<Decoration>[] = []
    
    // Create decoration for opening backtick
    let openingDeco = Decoration.replace({
      widget: new HiddenWidget(),
      side: 1
    })
    widgets.push(openingDeco.range(from, from + 1))

    // Create decoration for closing backtick
    let closingDeco = Decoration.replace({
      widget: new HiddenWidget(),
      side: -1
    })
    widgets.push(closingDeco.range(to - 1, to))
    
    return widgets;
  }
}
