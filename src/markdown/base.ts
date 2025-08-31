import { Decoration, WidgetType } from "@codemirror/view"
import { TagStyle } from "@codemirror/language"
import { type Range } from '@codemirror/state';

export class HiddenWidget extends WidgetType {
  constructor() { super() }

  eq(_other: HiddenWidget) { return true }

  toDOM() {
    let wrap = document.createElement("span")
    wrap.style.width = "0"
    wrap.style.display = "inline-block"
    return wrap
  }

  ignoreEvent() { return false }
}

export abstract class MarkdownDecoration {
  constructor() { }

  abstract nodeName: string
  abstract style?: TagStyle

  abstract getDecorations(from: number, to: number, text: string): Range<Decoration>[]
}
