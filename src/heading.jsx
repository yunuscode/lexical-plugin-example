/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    DecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';


import { $insertNodeToNearestRoot } from '@lexical/utils';
import {COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical';

export function $createTweetNode(tweetID) {
    return new HeadingNode(tweetID);
}

export function $isTweetNode(node) {
    return node instanceof HeadingNode;
}

function convertTweetElement(domNode) {
    const id = domNode.getAttribute('data-lexical-tweet-id');
    if (id) {
        const node = $createTweetNode(id);
        return { node };
    }
    return null;
}

export class HeadingNode extends DecoratorBlockNode {

    static getType() {
        return 'heading';
    }

    static clone(node) {
        return new HeadingNode(node.__id, node.__format, node.__key);
    }

    static importJSON(serializedNode) {
        const node = $createTweetNode(serializedNode.id);
        node.setFormat(serializedNode.format);
        return node;
    }

    exportJSON() {
        return {
            ...super.exportJSON(),
            id: this.getId(),
            type: 'tweet',
            version: 1,
        };
    }

    static importDOM() {
        return {
            div: (domNode) => {
                if (!domNode.hasAttribute('data-lexical-tweet-id')) {
                    return null;
                }
                return {
                    conversion: convertTweetElement,
                    priority: 2,
                };
            },
        };
    }

    exportDOM() {
        const element = document.createElement('div');
        element.setAttribute('data-lexical-tweet-id', this.__id);
        return { element };
    }

    constructor(id, format, key) {
        super(format, key);
        this.__id = id;
    }

    getId() {
        return this.__id;
    }

    decorate(editor, config) {
        const embedBlockTheme = config.theme.embedBlock || {};
        const className = {
            base: embedBlockTheme.base || '',
            focus: embedBlockTheme.focus || '',
        };
        return (
            <h1>{this.__id}</h1>
        );
    }

    isTopLevel() {
        return true;
    }
}

export const INSERT_HEADING_COMMAND = createCommand();


export function HeadingPlugin() {
    const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([HeadingNode])) {
      throw new Error('TwitterPlugin: TweetNode not registered on editor');
    }

    return editor.registerCommand(
      INSERT_HEADING_COMMAND,
      (payload) => {
        const tweetNode = $createTweetNode(payload);
        $insertNodeToNearestRoot(tweetNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}

