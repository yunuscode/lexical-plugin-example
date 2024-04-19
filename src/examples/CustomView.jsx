// This is a hook that allows you to get access to the LexicalComposerContext (Getting sibling components, and eth);
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

// DecoratorBlockNode is made for making custom elements. It can be anything.
import { DecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";

import React, { useEffect } from "react";

// This function helps to insert your custom elements to the editor area.
import { $insertNodeToNearestRoot } from "@lexical/utils";

// We need commands to send request/event from another lexical component.
import {
  $applyNodeReplacement,
  $getEditor,
  $getNodeByKey,
  $getSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from "lexical";

// This command is used to insert your custom elements to the editor area.
export const INSERT_CUSTOM_VIEW_COMMAND = createCommand();
export const UPDATE_CUSTOM_VIEW_COMMAND = createCommand();

// Every new component, must be a child of class, you don't have worry about this, just copy that and replace with your component's name
export class CustomView extends DecoratorBlockNode {
  // constructor helps to get arguments from outside, for example from toolbar
  constructor(name) {
    // super() is a function that calls the constructor of the parent class. Don't change that.
    super();
    this.name = name;
  }

  static getType() {
    // Replace this name with your custom plugins name.
    return "custom-view";
  }

  static clone(node) {
    // This function is used to clone the node. Make sure arguments are the same.
    return new CustomView(node.name);
  }

  // don't touch it :))
  static importJSON(serializedNode) {
    const node = $createCustomViewNode(serializedNode.id);
    node.setFormat(serializedNode.format);
    return node;
  }
  // don't touch it :))
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: CustomView.getType(),
      version: 1,
    };
  }

  // this is a main function that is being rendered
  decorate(editor, config) {
    // return component will be shown on editor
    return (
      <marquee
        onClick={() => {
          const value = prompt("Enter new value");
          this.updatevalue(value, editor);
        }}
        className="marquee-text"
      >
        {this.name}
      </marquee>
    );
  }

  updatevalue(value, editor) {
    editor.update(() => {
      const writable = this.getWritable();
      console.log(writable)
      writable.name = value;
    });
  }

  isTopLevel() {
    // This function is used to determine if the node is a top level node.
    // If it is, it will be rendered at the top level of the editor.
    return true;
  }
}

export function CustomViewPlugin() {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    // This function is used to register the command.
    if (!editor.hasNodes([CustomView])) {
      throw new Error("CustomViewPlugin: CustomView not registered on editor");
    }

    return editor.registerCommand(
      INSERT_CUSTOM_VIEW_COMMAND,
      (payload) => {
        const customViewNode = $createCustomViewNode(payload);
        $insertNodeToNearestRoot(customViewNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  React.useEffect(() => {
    return editor.registerCommand(
      UPDATE_CUSTOM_VIEW_COMMAND,
      (payload) => {
        
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}

export function $createCustomViewNode(name) {
  // This function is used to create a new node.
  return new CustomView(name);
}
