import { Decoration } from '@codemirror/view';
import { HiddenWidget, MarkdownDecoration } from './base';
import { type Range } from '@codemirror/state';

import { tags } from '@lezer/highlight';

export class StrongEmphasis extends MarkdownDecoration {
  nodeName = "StrongEmphasis"

  style = {
    tag: tags.strong,
    fontWeight: "bold",
    fontFamily: "sans-serif"
  }

  getDecorations(from: number, to: number) {
    let widgets: Range<Decoration>[] = []
    // Create decoration for opening **
    let openingDeco = Decoration.replace({
      widget: new HiddenWidget(),
      side: 1
    })
    widgets.push(openingDeco.range(from, from + 2))

    // Create decoration for closing **
    let closingDeco = Decoration.replace({
      widget: new HiddenWidget(),
      side: -1
    })
    widgets.push(closingDeco.range(to - 2, to))
    return widgets;
  }
}