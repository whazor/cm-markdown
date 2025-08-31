import { Decoration } from '@codemirror/view';
import { HiddenWidget, MarkdownDecoration } from './base';
import { type Range } from '@codemirror/state';

import { tags } from '@lezer/highlight';

export class ItalicEmphasis extends MarkdownDecoration {
  nodeName = "Emphasis"

  style = {
    tag: tags.emphasis,
    fontStyle: "italic",
    fontFamily: "sans-serif"
  }

  getDecorations(from: number, to: number) {
    let widgets: Range<Decoration>[] = []
    // Create decoration for opening *
    let openingDeco = Decoration.replace({
      widget: new HiddenWidget(),
      side: 1
    })
    widgets.push(openingDeco.range(from, from + 1))

    // Create decoration for closing *
    let closingDeco = Decoration.replace({
      widget: new HiddenWidget(),
      side: -1
    })
    widgets.push(closingDeco.range(to - 1, to))
    return widgets;
  }
}