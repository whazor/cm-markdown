import { Decoration, WidgetType } from '@codemirror/view';
import { MarkdownDecoration } from './base';
import { type Range } from '@codemirror/state';
import { tags } from '@lezer/highlight';

class ListItemWidget extends WidgetType {
  constructor(private level: number = 0) { 
    super() 
  }

  eq(other: ListItemWidget) { 
    return this.level === other.level 
  }

  toDOM() {
    let wrap = document.createElement("span")
    wrap.className = "cm-list-item-marker"
    wrap.style.display = "inline-block"
    wrap.style.width = "16px"
    wrap.style.height = "1em"
    wrap.style.lineHeight = "1"
    wrap.style.position = "relative"
    wrap.style.fontSize = "0.8em"
    
    // Create the bullet element
    const bullet = document.createElement("span")
    bullet.style.position = "absolute"
    bullet.style.left = "4px"
    bullet.style.top = "50%"
    bullet.style.transform = "translateY(-50%)"
    bullet.style.width = "6px"
    bullet.style.height = "6px"
    bullet.style.display = "block"
    
    // Style based on level - using CSS custom properties for theme compatibility
    switch (this.level) {
      case 0: // Top level - filled circle
        bullet.style.backgroundColor = "var(--cm-list-bullet-color, currentColor)"
        bullet.style.borderRadius = "50%"
        break
      case 1: // First sublevel - hollow circle
        bullet.style.backgroundColor = "transparent"
        bullet.style.border = "1.5px solid var(--cm-list-bullet-border-color, currentColor)"
        bullet.style.borderRadius = "50%"
        break
      case 2: // Second sublevel - filled square
        bullet.style.backgroundColor = "var(--cm-list-bullet-color, currentColor)"
        bullet.style.borderRadius = "1px"
        break
      default: // Deep levels - hollow square
        bullet.style.backgroundColor = "transparent"
        bullet.style.border = "1px solid var(--cm-list-bullet-border-color, currentColor)"
        bullet.style.borderRadius = "1px"
        break
    }
    
    wrap.appendChild(bullet)
    return wrap
  }

  ignoreEvent() { return false }
}

export class ListItem extends MarkdownDecoration {
  style = {
    tag: tags.list,
  };
  nodeName = "ListItem"

  getDecorations(from: number, to: number, text: string) {
    let widgets: Range<Decoration>[] = []
    
    // Find all '- ' patterns in the text
    let currentIndex = 0
    while (true) {
      const dashSpaceIndex = text.indexOf('- ', currentIndex)
      if (dashSpaceIndex === -1) break
      
      // Calculate indentation level by counting leading spaces/tabs
      const lineStart = text.lastIndexOf('\n', dashSpaceIndex) + 1
      const lineContent = text.substring(lineStart, dashSpaceIndex)
      const indentationLevel = Math.floor(lineContent.length / 2) // Assuming 2 spaces per level
      
      // Create decoration for this '- ' part with dot widget
      let listDeco = Decoration.replace({
        widget: new ListItemWidget(indentationLevel),
        side: 1
      })
      widgets.push(listDeco.range(from + dashSpaceIndex, from + dashSpaceIndex + 2))
      
      // Move to next position to find more '- ' patterns
      currentIndex = dashSpaceIndex + 2
    }
    
    return widgets;
  }
} 