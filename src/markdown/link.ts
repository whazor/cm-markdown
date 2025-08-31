import { Decoration } from '@codemirror/view';
import { HiddenWidget, MarkdownDecoration } from './base';
import { type Range } from '@codemirror/state';

import { tags } from '@lezer/highlight';


export class LinkDecoration extends MarkdownDecoration {
    nodeName = "Link"
    style = {
      tag: tags.link
    }
    getDecorations(from: number, to: number, text: string) {
      // url looks like [text](url), we just want to show 'text'
      let widgets: Range<Decoration>[] = []
      const urlPattern = /\]\(.*?\)/;
      const match = urlPattern.exec(text);
      if (match) {
        // hide first [
        let openingDeco = Decoration.replace({
          widget: new HiddenWidget(),
          side: 1
        })
        widgets.push(openingDeco.range(from, from + 1))
        // hide last ](...)
        let closingDeco = Decoration.replace({
          widget: new HiddenWidget(),
          side: -1
        })
        widgets.push(closingDeco.range(from + match.index, to))
  
      }
      return widgets;
    }
  }
  