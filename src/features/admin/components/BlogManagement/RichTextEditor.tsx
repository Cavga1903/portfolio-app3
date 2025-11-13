/**
 * Rich Text Editor Component
 * Built with Editor.js for blog content editing
 */

import React, { useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Image from '@editorjs/image';
// @ts-expect-error - LinkTool doesn't have types
import LinkTool from '@editorjs/link';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import Table from '@editorjs/table';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  error?: boolean;
  minHeight?: string;
}

// Convert Editor.js JSON to HTML
const editorJsToHtml = (data: OutputData): string => {
  if (!data || !data.blocks || !Array.isArray(data.blocks)) {
    return '';
  }

  let html = '';

  data.blocks.forEach((block) => {
    switch (block.type) {
      case 'paragraph': {
        html += `<p>${block.data.text || ''}</p>`;
        break;
      }
      case 'header': {
        const level = block.data.level || 1;
        const text = block.data.text || '';
        html += `<h${level}>${text}</h${level}>`;
        break;
      }
      case 'list': {
        const listType = block.data.style === 'ordered' ? 'ol' : 'ul';
        html += `<${listType}>`;
        block.data.items?.forEach((item: string) => {
          html += `<li>${item}</li>`;
        });
        html += `</${listType}>`;
        break;
      }
      case 'quote': {
        html += `<blockquote><p>${block.data.text || ''}</p>`;
        if (block.data.caption) {
          html += `<cite>${block.data.caption}</cite>`;
        }
        html += `</blockquote>`;
        break;
      }
      case 'code': {
        html += `<pre><code>${block.data.code || ''}</code></pre>`;
        break;
      }
      case 'image': {
        html += `<figure>`;
        html += `<img src="${block.data.file?.url || block.data.url || ''}" alt="${block.data.caption || ''}" />`;
        if (block.data.caption) {
          html += `<figcaption>${block.data.caption}</figcaption>`;
        }
        html += `</figure>`;
        break;
      }
      case 'linkTool': {
        html += `<a href="${block.data.link || ''}" target="_blank" rel="noopener noreferrer">${block.data.meta?.title || block.data.link || ''}</a>`;
        break;
      }
      case 'table': {
        html += `<table>`;
        if (block.data.content && Array.isArray(block.data.content)) {
          block.data.content.forEach((row: string[]) => {
            html += `<tr>`;
            row.forEach((cell: string) => {
              html += `<td>${cell}</td>`;
            });
            html += `</tr>`;
          });
        }
        html += `</table>`;
        break;
      }
      case 'delimiter': {
        html += `<hr />`;
        break;
      }
      default:
        break;
    }
  });

  return html;
};

// Convert HTML to Editor.js JSON (basic conversion)
const htmlToEditorJs = (html: string): OutputData => {
  if (!html || html.trim() === '') {
    return {
      time: Date.now(),
      blocks: [],
    };
  }

  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  interface EditorBlock {
    id: string;
    type: string;
    data: Record<string, unknown>;
  }
  const blocks: EditorBlock[] = [];
  let blockId = 0;

  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        blocks.push({
          id: `block-${blockId++}`,
          type: 'paragraph',
          data: {
            text: text,
          },
        });
      }
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    const element = node as HTMLElement;
    const tagName = element.tagName.toLowerCase();

    switch (tagName) {
      case 'p': {
        const pText = element.textContent?.trim();
        if (pText) {
          blocks.push({
            id: `block-${blockId++}`,
            type: 'paragraph',
            data: {
              text: pText,
            },
          });
        }
        break;
      }
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6': {
        const level = parseInt(tagName.charAt(1));
        blocks.push({
          id: `block-${blockId++}`,
          type: 'header',
          data: {
            text: element.textContent?.trim() || '',
            level: level,
          },
        });
        break;
      }
      case 'ul':
      case 'ol': {
        const items: string[] = [];
        element.querySelectorAll('li').forEach((li) => {
          items.push(li.textContent?.trim() || '');
        });
        if (items.length > 0) {
          blocks.push({
            id: `block-${blockId++}`,
            type: 'list',
            data: {
              style: tagName === 'ol' ? 'ordered' : 'unordered',
              items: items,
            },
          });
        }
        break;
      }
      case 'blockquote': {
        blocks.push({
          id: `block-${blockId++}`,
          type: 'quote',
          data: {
            text: element.textContent?.trim() || '',
          },
        });
        break;
      }
      case 'pre': {
        const codeElement = element.querySelector('code');
        blocks.push({
          id: `block-${blockId++}`,
          type: 'code',
          data: {
            code: codeElement?.textContent || element.textContent || '',
          },
        });
        break;
      }
      case 'img': {
        blocks.push({
          id: `block-${blockId++}`,
          type: 'image',
          data: {
            file: {
              url: element.getAttribute('src') || '',
            },
            caption: element.getAttribute('alt') || '',
          },
        });
        break;
      }
      case 'a': {
        blocks.push({
          id: `block-${blockId++}`,
          type: 'linkTool',
          data: {
            link: element.getAttribute('href') || '',
            meta: {
              title: element.textContent?.trim() || '',
            },
          },
        });
        break;
      }
      case 'hr': {
        blocks.push({
          id: `block-${blockId++}`,
          type: 'delimiter',
          data: {},
        });
        break;
      }
      default:
        // Process child nodes
        Array.from(element.childNodes).forEach(processNode);
        break;
    }
  };

  Array.from(tempDiv.childNodes).forEach(processNode);

  return {
    time: Date.now(),
    blocks: blocks.length > 0 ? blocks : [
      {
        id: 'block-0',
        type: 'paragraph',
        data: {
          text: '',
        },
      },
    ],
  };
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'İçeriğinizi buraya yazın...',
  error = false,
  minHeight = '300px',
}) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!holderRef.current || isInitializedRef.current) {
      return;
    }

    // Initialize Editor.js
    const editor = new EditorJS({
      holder: holderRef.current,
      placeholder: placeholder,
      data: htmlToEditorJs(content),
      tools: {
        header: {
          // @ts-expect-error - Header type mismatch
          class: Header,
          config: {
            placeholder: 'Başlık girin...',
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2,
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
          },
        },
        paragraph: {
          // @ts-expect-error - Paragraph type mismatch
          class: Paragraph,
          inlineToolbar: true,
        },
        image: {
          class: Image,
          config: {
            endpoints: {
              byFile: '/api/upload-image', // You can configure this later
            },
            captionPlaceholder: 'Resim açıklaması...',
            buttonContent: 'Resim Ekle',
            uploader: {
              async uploadByFile(file: File) {
                // This will be handled by the image upload service
                // For now, return a placeholder
                return {
                  success: 1,
                  file: {
                    url: URL.createObjectURL(file),
                  },
                };
              },
            },
          },
        },
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: '/api/fetch-url', // You can configure this later
          },
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+O',
          config: {
            quotePlaceholder: 'Alıntı metni...',
            captionPlaceholder: 'Alıntı yazarı...',
          },
        },
        code: {
          class: Code,
          config: {
            placeholder: 'Kod bloğu girin...',
          },
        },
        delimiter: Delimiter,
        table: {
          // @ts-expect-error - Table type mismatch
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 2,
          },
        },
      },
      onChange: async () => {
        if (editorRef.current) {
          try {
            const outputData = await editorRef.current.save();
            const html = editorJsToHtml(outputData);
            onChange(html);
          } catch (error) {
            console.error('Error saving editor content:', error);
          }
        }
      },
    });

    editorRef.current = editor;
    isInitializedRef.current = true;

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
        isInitializedRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Update content when prop changes (but not on initial mount)
  useEffect(() => {
    if (editorRef.current && isInitializedRef.current && content) {
      const editorJsData = htmlToEditorJs(content);
      editorRef.current.render(editorJsData);
    }
  }, [content]);

  return (
    <div
      className={`border rounded-lg overflow-hidden ${
        error
          ? 'border-red-500 focus-within:ring-2 focus-within:ring-red-500'
          : 'border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500'
      }`}
    >
      <div
        ref={holderRef}
        className="bg-white dark:bg-gray-700"
        style={{ minHeight }}
      />
      <style>{`
        .codex-editor {
          padding: 1rem;
        }
        .codex-editor__redactor {
          padding-bottom: 200px !important;
        }
        .ce-toolbar__content,
        .ce-block__content {
          max-width: 100% !important;
        }
        .ce-toolbar__plus,
        .ce-toolbar__settings-btn {
          color: #6b7280;
        }
        .ce-toolbar__plus:hover,
        .ce-toolbar__settings-btn:hover {
          color: #2563eb;
        }
        .dark .ce-toolbar__plus,
        .dark .ce-toolbar__settings-btn {
          color: #9ca3af;
        }
        .dark .ce-toolbar__plus:hover,
        .dark .ce-toolbar__settings-btn:hover {
          color: #60a5fa;
        }
        .ce-paragraph {
          color: #1f2937;
        }
        .dark .ce-paragraph {
          color: #f3f4f6;
        }
        .ce-header {
          color: #1f2937;
          font-weight: 700;
        }
        .dark .ce-header {
          color: #f3f4f6;
        }
      `}</style>
    </div>
  );
};
