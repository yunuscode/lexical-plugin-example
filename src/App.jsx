/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import * as React from "react";

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const theme = {
  code: "editor-code",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
  },
  image: "editor-image",
  link: "editor-link",
  list: {
    listitem: "editor-listitem",
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
  },
  ltr: "ltr",
  paragraph: "editor-paragraph",
  placeholder: "editor-placeholder",
  quote: "editor-quote",
  rtl: "rtl",
  text: {
    bold: "editor-text-bold",
    code: "editor-text-code",
    hashtag: "editor-text-hashtag",
    italic: "editor-text-italic",
    overflowed: "editor-text-overflowed",
    strikethrough: "editor-text-strikethrough",
    underline: "editor-text-underline",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
  },
};

import ToolbarPlugin from "./toolbar";
import TreeViewPlugin from "./treeview";
import { TweetNode, TwitterPlugin } from "./marquee";
import { HeadingNode, HeadingPlugin } from "./heading";
import {
  CustomView,
  CustomViewPlugin,
  INSERT_CUSTOM_VIEW_COMMAND,
  UPDATE_CUSTOM_VIEW_COMMAND,
} from "./examples/CustomView";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

const editorConfig = {
  namespace: "React.js Demo",
  nodes: [TweetNode, HeadingNode, CustomView],
  // Handling of errors during update
  onError(error) {
    throw error;
  },
  // The editor theme
  theme: theme,
};

export default function App() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <section className="parent">
        <div className="editor-container">
          <div className="editor-inner" style={{}}>
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<Placeholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <CustomViewPlugin />
          </div>
        </div>
        <Sidebar />
      </section>
    </LexicalComposer>
  );
}

function Sidebar() {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    console.log(editor);
  }, []);

  return (
    <aside className="sidebar">
      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_CUSTOM_VIEW_COMMAND, "test")
        }
        className="sidebar-button"
      >
        Add heading
      </button>
      <input
        onChange={(e) => {
          // updating existing custom view command
          editor.dispatchCommand(UPDATE_CUSTOM_VIEW_COMMAND, e.target.value);
        }}
        className="sidebar-input"
        type="text"
        placeholder="Heading text"
      />
    </aside>
  );
}
