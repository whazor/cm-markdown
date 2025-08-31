import { Decoration, EditorView, WidgetType } from "@codemirror/view";
import { MarkdownDecoration } from "./base";
import { type Range } from "@codemirror/state";

class TaskMarkerWidget extends WidgetType {
  constructor(public check: boolean) {
    super();
  }
  eq(other: TaskMarkerWidget) {
    return this.check === other.check;
  }
  toDOM() {
    let wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    wrap.className = "cm-task-checkbox";
    let box = wrap.appendChild(document.createElement("input"));
    box.type = "checkbox";
    box.checked = this.check;
    return wrap;
  }
  ignoreEvent() {
    return false;
  }
}

export class TaskDecoration extends MarkdownDecoration {
  nodeName = "TaskMarker";
  style = undefined;
  getDecorations(from: number, to: number, text: string) {
    // console.log(from, to, text);
    // url looks like [text](url), we just want to show 'text'
    const checked = text.includes("x");
    let widgets: Range<Decoration>[] = [
      Decoration.replace({
        widget: new TaskMarkerWidget(checked),
        side: 1,
      }).range(from, to + 1),
    ];

    return widgets;
  }
}

export function taskMousedown(target: HTMLElement, view: EditorView) {
  if (
    target.nodeName == "INPUT" &&
    target.parentElement!.classList.contains("cm-task-checkbox")
  )
    return toggleBoolean(view, view.posAtDOM(target));

  return false;
}

function toggleBoolean(view: EditorView, pos: number) {
  let before = view.state.doc.sliceString(Math.max(0, pos - 4), pos - 1);
  console.log("toggle", "'" + before + "'", pos);
  let change;
  if (before == "[ ]") change = { from: pos - 4, to: pos - 1, insert: "[x]" };
  else if (before.endsWith("[x]"))
    change = { from: pos - 4, to: pos - 1, insert: "[ ]" };
  else return false;
  view.dispatch({ changes: change });
  return true;
}
