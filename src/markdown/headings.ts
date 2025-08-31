import { Decoration } from '@codemirror/view';
import { HiddenWidget, MarkdownDecoration } from './base';
import { type Range } from '@codemirror/state';

import { tags } from '@lezer/highlight';
import { TagStyle } from '@codemirror/language';

export class HeadingDecoration extends MarkdownDecoration {
  constructor(level: 1|2|3|4|5|6) {
    super()
    this.level = level
    this.nodeName = `ATXHeading${this.level}`
    switch (this.level) {
      case 1:
        this.style = {
          tag: tags.heading1,
          fontSize: "1.6em",
          fontWeight: "bold",
          fontFamily: "sans-serif"
        };
        return;
      case 2:
        this.style = {
          tag: tags.heading2,
          fontSize: "1.4em",
          fontWeight: "bold",
          fontFamily: "sans-serif"
        };
        return;
      case 3:
        this.style = {
          tag: tags.heading3,
          fontSize: "1.2em",
          fontWeight: "bold",
          fontFamily: "sans-serif"
        };
        return;
      case 4:
        this.style = {
          tag: tags.heading4,
          fontSize: "1.1em",
          fontWeight: "bold",
          fontFamily: "sans-serif"
        };
        return;
      case 5:
        this.style = {
          tag: tags.heading5,
          fontSize: "1em",
          fontWeight: "bold",
          fontFamily: "sans-serif"
        };
        return;
      case 6:
        this.style = {
          tag: tags.heading6,
          fontSize: "0.9em",
          fontWeight: "bold",
          fontFamily: "sans-break"
        };
        return;
    }
    throw new Error(`Invalid heading level: ${this.level}`)
  }
  level: number
  nodeName: string

  style: TagStyle

  getDecorations(from: number, _to: number) {
    let widgets: Range<Decoration>[] = []
    // Create decoration for opening *
    let openingDeco = Decoration.replace({
      widget: new HiddenWidget(),
      side: 1
    })
    widgets.push(openingDeco.range(from, from + this.level + 1))

    return widgets;
  }
}