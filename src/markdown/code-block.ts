import { Decoration } from '@codemirror/view';
import { HiddenWidget, MarkdownDecoration } from './base';
import { type Range } from '@codemirror/state';
import { tags } from '@lezer/highlight';

export class CodeBlock extends MarkdownDecoration {
  nodeName = "FencedCode"

//   style = undefined;
  style = {
    tag: tags.docComment
//     tag: tags.literal,
//     fontFamily: "monospace",
//     backgroundColor: "#f6f8fa",
//     padding: "2px 4px",
//     borderRadius: "3px",
//     fontSize: "0.9em"
  }

  getDecorations(from: number, to: number, text: string) {
    let widgets: Range<Decoration>[] = []
    console.log(text)
    
    // parse first line to get language
    const language = text.split('\n')[0];
    console.log(language);


    // Create decoration for opening backtick
    let openingDeco = Decoration.replace({
      widget: new HiddenWidget(),
      side: 1
    })
    widgets.push(openingDeco.range(from, from + language.length))

    // Create decoration for closing backtick
    let closingDeco = Decoration.replace({
      widget: new HiddenWidget(),
      side: -1
    })
    widgets.push(closingDeco.range(to - 3, to))
    
    return widgets;
  }
}
