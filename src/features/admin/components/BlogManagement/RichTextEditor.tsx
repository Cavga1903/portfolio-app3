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
// @ts-expect-error - Checklist doesn't have types
import Checklist from '@editorjs/checklist';
// @ts-expect-error - Marker doesn't have types
import Marker from '@editorjs/marker';
import Underline from '@editorjs/underline';
import InlineCode from '@editorjs/inline-code';
import Warning from '@editorjs/warning';
// @ts-expect-error - Embed type resolution issue
import Embed from '@editorjs/embed';
// @ts-expect-error - Raw doesn't have types
import Raw from '@editorjs/raw';

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
      case 'checklist': {
        html += `<ul class="checklist">`;
        block.data.items?.forEach((item: { text: string; checked: boolean }) => {
          const checked = item.checked ? 'checked' : '';
          html += `<li class="checklist-item"><input type="checkbox" ${checked} disabled /> ${item.text || ''}</li>`;
        });
        html += `</ul>`;
        break;
      }
      case 'warning': {
        html += `<div class="warning-block">`;
        html += `<div class="warning-title">${block.data.title || 'Uyarı'}</div>`;
        html += `<div class="warning-message">${block.data.message || ''}</div>`;
        html += `</div>`;
        break;
      }
      case 'embed': {
        html += `<div class="embed-wrapper">`;
        if (block.data.embed) {
          html += block.data.embed;
        } else if (block.data.source) {
          html += `<iframe src="${block.data.source}" frameborder="0" allowfullscreen></iframe>`;
        }
        html += `</div>`;
        break;
      }
      case 'raw': {
        html += block.data.html || '';
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
      case 'ul': {
        // Check for checklist
        if (element.classList.contains('checklist')) {
          const items: Array<{ text: string; checked: boolean }> = [];
          element.querySelectorAll('li.checklist-item').forEach((li) => {
            const checkbox = li.querySelector('input[type="checkbox"]');
            items.push({
              text: li.textContent?.trim() || '',
              checked: checkbox?.hasAttribute('checked') || false,
            });
          });
          if (items.length > 0) {
            blocks.push({
              id: `block-${blockId++}`,
              type: 'checklist',
              data: {
                items: items,
              },
            });
          }
          break;
        }
        // Regular unordered list
        const items: string[] = [];
        element.querySelectorAll('li').forEach((li) => {
          items.push(li.textContent?.trim() || '');
        });
        if (items.length > 0) {
          blocks.push({
            id: `block-${blockId++}`,
            type: 'list',
            data: {
              style: 'unordered',
              items: items,
            },
          });
        }
        break;
      }
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
              style: 'ordered',
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
      case 'div': {
        // Check for warning blocks
        if (element.classList.contains('warning-block') || element.classList.contains('warning')) {
          const title = element.querySelector('.warning-title')?.textContent || 'Uyarı';
          const message = element.querySelector('.warning-message')?.textContent || element.textContent || '';
          blocks.push({
            id: `block-${blockId++}`,
            type: 'warning',
            data: {
              title: title,
              message: message,
            },
          });
          break;
        }
        // Check for embed blocks
        if (element.classList.contains('embed-wrapper') || element.querySelector('iframe')) {
          const iframe = element.querySelector('iframe');
          blocks.push({
            id: `block-${blockId++}`,
            type: 'embed',
            data: {
              source: iframe?.getAttribute('src') || '',
              embed: element.innerHTML,
            },
          });
          break;
        }
        // Process child nodes for other divs
        Array.from(element.childNodes).forEach(processNode);
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
  const initialContentRef = useRef<string>(content);
  const isUpdatingFromPropRef = useRef(false);

  useEffect(() => {
    if (!holderRef.current || isInitializedRef.current) {
      return;
    }

    // Initialize Editor.js
    // Ensure content is always a string
    const contentString = typeof initialContentRef.current === 'string' ? initialContentRef.current : '';
    const editor = new EditorJS({
      holder: holderRef.current,
      placeholder: placeholder,
      data: htmlToEditorJs(contentString),
      readOnly: false,
      autofocus: false,
      minHeight: 0,
      tools: {
        header: {
          // @ts-expect-error - Header type mismatch
          class: Header,
          config: {
            placeholder: 'Başlık girin...',
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2,
          },
          inlineToolbar: ['link', 'marker', 'underline'],
        },
        list: {
          class: List,
          inlineToolbar: ['link', 'bold', 'italic', 'marker', 'underline'],
          config: {
            defaultStyle: 'unordered',
          },
        },
        checklist: {
          class: Checklist,
          inlineToolbar: ['link', 'bold', 'italic'],
        },
        paragraph: {
          // @ts-expect-error - Paragraph type mismatch
          class: Paragraph,
          inlineToolbar: ['bold', 'italic', 'link', 'marker', 'underline', 'inlineCode'],
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
          inlineToolbar: ['link', 'bold', 'italic', 'marker'],
          shortcut: 'CMD+SHIFT+O',
          config: {
            quotePlaceholder: 'Alıntı metni...',
            captionPlaceholder: 'Alıntı yazarı...',
          },
        },
        warning: {
          class: Warning,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+W',
          config: {
            titlePlaceholder: 'Uyarı başlığı...',
            messagePlaceholder: 'Uyarı mesajı...',
          },
        },
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              coub: true,
              codepen: true,
              imgur: true,
              vimeo: true,
              gfycat: true,
            },
          },
        },
        raw: {
          class: Raw,
          config: {
            placeholder: 'HTML kodunu buraya yapıştırın...',
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
        // Inline Tools
        marker: Marker,
        underline: Underline,
        inlineCode: InlineCode,
      },
      onChange: async () => {
        // Don't trigger onChange if we're updating from prop
        if (isUpdatingFromPropRef.current || !editorRef.current) {
          return;
        }
        try {
          const outputData = await editorRef.current.save();
          const html = editorJsToHtml(outputData);
          // Ensure we always pass a string
          if (typeof html === 'string') {
            onChange(html);
          } else {
            console.warn('Editor content is not a string:', html);
            onChange('');
          }
        } catch (error) {
          console.error('Error saving editor content:', error);
          // If there's an error, don't update to prevent data loss
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

  // Update content when prop changes externally (e.g., when loading a post)
  // But only if it's different from what we already have
  useEffect(() => {
    if (editorRef.current && isInitializedRef.current) {
      // Ensure content is always a string
      const contentString = typeof content === 'string' ? content : '';
      
      // Only update if content is different and not empty
      // This prevents clearing the editor when user is typing
      const currentContent = initialContentRef.current;
      if (contentString !== currentContent && contentString !== '') {
        isUpdatingFromPropRef.current = true;
        try {
          const editorJsData = htmlToEditorJs(contentString);
          editorRef.current.render(editorJsData).then(() => {
            initialContentRef.current = contentString;
            isUpdatingFromPropRef.current = false;
          }).catch((error) => {
            console.error('Error rendering editor content:', error);
            isUpdatingFromPropRef.current = false;
          });
        } catch (error) {
          console.error('Error converting content to Editor.js format:', error);
          isUpdatingFromPropRef.current = false;
        }
      }
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
        /* Checklist styles */
        .checklist {
          list-style: none;
          padding-left: 0;
        }
        .checklist-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .checklist-item input[type="checkbox"] {
          margin-top: 0.25rem;
          cursor: default;
        }
        /* Warning block styles */
        .warning-block {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 1rem;
          margin: 1rem 0;
          border-radius: 0.25rem;
        }
        .dark .warning-block {
          background-color: #78350f;
          border-left-color: #fbbf24;
        }
        .warning-title {
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #92400e;
        }
        .dark .warning-title {
          color: #fcd34d;
        }
        .warning-message {
          color: #78350f;
        }
        .dark .warning-message {
          color: #fde68a;
        }
        /* Embed styles */
        .embed-wrapper {
          margin: 1rem 0;
        }
        .embed-wrapper iframe {
          width: 100%;
          max-width: 100%;
          border-radius: 0.5rem;
        }
        /* Marker (highlight) styles */
        .ce-inline-toolbar__dropdown {
          z-index: 1000;
        }
        /* Inline code styles */
        .inline-code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.875em;
        }
        .dark .inline-code {
          background-color: #374151;
        }
      `}</style>
    </div>
  );
};
