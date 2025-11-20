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
  enableMarkdown?: boolean; // Enable markdown support
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

// Convert Markdown to Editor.js JSON
const markdownToEditorJs = (markdown: string): OutputData => {
  if (!markdown || markdown.trim() === '') {
    return {
      time: Date.now(),
      blocks: [],
    };
  }

  interface EditorBlock {
    id: string;
    type: string;
    data: Record<string, unknown>;
  }
  const blocks: EditorBlock[] = [];
  let blockId = 0;
  const footnotes: Map<string, string> = new Map();
  const lines = markdown.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Headers (# ## ### etc.)
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const text = headerMatch[2];
      blocks.push({
        id: `block-${blockId++}`,
        type: 'header',
        data: {
          text: text,
          level: level,
        },
      });
      i++;
      continue;
    }

    // Code blocks (```)
    if (line.startsWith('```')) {
      // Extract language if specified (```javascript, ```python, etc.)
      const languageMatch = line.match(/^```(\w+)?/);
      const language = languageMatch ? (languageMatch[1] || '') : '';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({
        id: `block-${blockId++}`,
        type: 'code',
        data: {
          code: codeLines.join('\n'),
          language: language || 'plaintext',
        },
      });
      i++;
      continue;
    }

    // Blockquotes (>)
    if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      // Handle nested quotes and multi-line quotes
      while (i < lines.length && (lines[i].trim().startsWith('>') || lines[i].trim() === '')) {
        if (lines[i].trim().startsWith('>')) {
          // Remove > and any nested >>
          const quoteText = lines[i].trim().replace(/^>+\s*/, '');
          quoteLines.push(quoteText);
        } else if (quoteLines.length > 0) {
          // Empty line within quote, keep it
          quoteLines.push('');
        }
        i++;
      }
      blocks.push({
        id: `block-${blockId++}`,
        type: 'quote',
        data: {
          text: quoteLines.join('\n'),
          caption: '',
        },
      });
      continue;
    }

    // Unordered lists (- or * or +)
    if (line.match(/^[-*+]\s+/)) {
      const items: string[] = [];
      const baseIndent = line.match(/^(\s*)/)?.[1]?.length || 0;
      
      while (i < lines.length) {
        const currentLine = lines[i];
        const trimmed = currentLine.trim();
        const currentIndent = currentLine.match(/^(\s*)/)?.[1]?.length || 0;
        
        // Check if it's a list item at the same or higher level
        if (trimmed.match(/^[-*+]\s+/) && currentIndent >= baseIndent) {
          // Extract item text, preserving inline formatting
          let itemText = trimmed.replace(/^[-*+]\s+/, '');
          // Process inline markdown in list items
          itemText = itemText.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
          itemText = itemText.replace(/\*([^*]+)\*/g, '<i>$1</i>');
          itemText = itemText.replace(/~~([^~]+)~~/g, '<s>$1</s>');
          itemText = itemText.replace(/`([^`]+)`/g, '<code>$1</code>');
          items.push(itemText);
          i++;
        } else if (trimmed === '' && items.length > 0) {
          // Empty line, might be part of list or end of list
          i++;
          // Check if next line is still part of list
          if (i < lines.length) {
            const nextLine = lines[i];
            const nextIndent = nextLine.match(/^(\s*)/)?.[1]?.length || 0;
            if (!nextLine.trim().match(/^[-*+]\s+/) || nextIndent < baseIndent) {
              break;
            }
          } else {
            break;
          }
        } else {
          break;
        }
      }
      
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
      continue;
    }

    // Ordered lists (1. 2. etc.)
    if (line.match(/^\d+\.\s+/)) {
      const items: string[] = [];
      const baseIndent = line.match(/^(\s*)/)?.[1]?.length || 0;
      
      while (i < lines.length) {
        const currentLine = lines[i];
        const trimmed = currentLine.trim();
        const currentIndent = currentLine.match(/^(\s*)/)?.[1]?.length || 0;
        
        // Check if it's a numbered list item at the same or higher level
        if (trimmed.match(/^\d+\.\s+/) && currentIndent >= baseIndent) {
          // Extract item text, preserving inline formatting
          let itemText = trimmed.replace(/^\d+\.\s+/, '');
          // Process inline markdown in list items
          itemText = itemText.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
          itemText = itemText.replace(/\*([^*]+)\*/g, '<i>$1</i>');
          itemText = itemText.replace(/~~([^~]+)~~/g, '<s>$1</s>');
          itemText = itemText.replace(/`([^`]+)`/g, '<code>$1</code>');
          items.push(itemText);
          i++;
        } else if (trimmed === '' && items.length > 0) {
          // Empty line
          i++;
          if (i < lines.length) {
            const nextLine = lines[i];
            const nextIndent = nextLine.match(/^(\s*)/)?.[1]?.length || 0;
            if (!nextLine.trim().match(/^\d+\.\s+/) || nextIndent < baseIndent) {
              break;
            }
          } else {
            break;
          }
        } else {
          break;
        }
      }
      
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
      continue;
    }

    // Footnotes [^1]: definition
    const footnoteMatch = line.match(/^\[\^([^\]]+)\]:\s*(.+)$/);
    if (footnoteMatch) {
      footnotes.set(footnoteMatch[1], footnoteMatch[2]);
      i++;
      continue;
    }
    
    // Horizontal rule (--- or ***)
    if (line.match(/^[*-]{3,}$/)) {
      blocks.push({
        id: `block-${blockId++}`,
        type: 'delimiter',
        data: {},
      });
      i++;
      continue;
    }

    // Images ![alt](url)
    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
    if (imageMatch) {
      blocks.push({
        id: `block-${blockId++}`,
        type: 'image',
        data: {
          url: imageMatch[2],
          caption: imageMatch[1],
        },
      });
      i++;
      continue;
    }

    // Links [text](url)
    const linkMatch = line.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      blocks.push({
        id: `block-${blockId++}`,
        type: 'paragraph',
        data: {
          text: `<a href="${linkMatch[2]}" target="_blank">${linkMatch[1]}</a>`,
        },
      });
      i++;
      continue;
    }

    // Tables (| col1 | col2 |)
    if (line.includes('|') && line.trim().startsWith('|')) {
      const tableRows: string[][] = [];
      const alignments: string[] = [];
      let isHeaderSeparator = false;
      
      while (i < lines.length && lines[i].trim().includes('|')) {
        const currentLine = lines[i].trim();
        
        // Check if it's a separator row (---)
        if (currentLine.match(/^\|[\s:-]+\|$/)) {
          // Parse alignment
          const cells = currentLine.split('|').filter(c => c.trim());
          cells.forEach((cell) => {
            const trimmed = cell.trim();
            if (trimmed.startsWith(':') && trimmed.endsWith(':')) {
              alignments.push('center');
            } else if (trimmed.endsWith(':')) {
              alignments.push('right');
            } else {
              alignments.push('left');
            }
          });
          isHeaderSeparator = true;
          i++;
          continue;
        }
        
        // Parse table row
        const cells = currentLine.split('|')
          .map(c => c.trim())
          .filter(c => c !== '');
        
        if (cells.length > 0) {
          tableRows.push(cells);
        }
        i++;
      }
      
      if (tableRows.length > 0) {
        // Convert table rows to Editor.js format
        const content = tableRows.map(row => row.map(cell => htmlToMarkdown(cell)));
        blocks.push({
          id: `block-${blockId++}`,
          type: 'table',
          data: {
            content: content,
            withHeadings: !isHeaderSeparator || tableRows.length > 1,
            alignment: alignments.length > 0 ? alignments : new Array(tableRows[0]?.length || 0).fill('left'),
          },
        });
      }
      continue;
    }

    // Regular paragraph
    if (line) {
      // Process inline markdown in paragraph
      let processedText = line;
      
      // Links [text](url) - process before other formatting
      processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
      
      // Bold **text** (must be before italic to avoid conflicts)
      processedText = processedText.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
      processedText = processedText.replace(/__([^_]+)__/g, '<b>$1</b>');
      
      // Bold and Italic ***text***
      processedText = processedText.replace(/\*\*\*([^*]+)\*\*\*/g, '<b><i>$1</i></b>');
      processedText = processedText.replace(/___([^_]+)___/g, '<b><i>$1</i></b>');
      
      // Italic *text* (after bold to avoid conflicts)
      processedText = processedText.replace(/\*([^*]+)\*/g, '<i>$1</i>');
      processedText = processedText.replace(/_([^_]+)_/g, '<i>$1</i>');
      
      // Strikethrough ~~text~~
      processedText = processedText.replace(/~~([^~]+)~~/g, '<s>$1</s>');
      
      // Inline code `code`
      processedText = processedText.replace(/`([^`]+)`/g, '<code>$1</code>');
      
      // Emoji shortcuts :rocket: :fire: etc. (basic support)
      processedText = processedText.replace(/:([a-z0-9_+-]+):/g, (match, emojiName) => {
        // Common emoji mappings
        const emojiMap: Record<string, string> = {
          rocket: '🚀',
          fire: '🔥',
          star: '⭐',
          heart: '❤️',
          thumbsup: '👍',
          thumbsdown: '👎',
          check: '✅',
          cross: '❌',
          warning: '⚠️',
          info: 'ℹ️',
          bulb: '💡',
          smile: '😊',
          wink: '😉',
        };
        return emojiMap[emojiName.toLowerCase()] || match;
      });
      
      blocks.push({
        id: `block-${blockId++}`,
        type: 'paragraph',
        data: {
          text: processedText,
        },
      });
    }
    i++;
  }
  
  // Add footnotes at the end if any were found
  if (footnotes.size > 0) {
    blocks.push({
      id: `block-${blockId++}`,
      type: 'delimiter',
      data: {},
    });
    
    footnotes.forEach((text: string, id: string) => {
      blocks.push({
        id: `block-${blockId++}`,
        type: 'paragraph',
        data: {
          text: `<a id="footnote-${id}" href="#footnote-ref-${id}"><strong>[${id}]</strong></a>: ${text}`,
        },
      });
    });
  }

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

// Helper function to convert HTML to Markdown
const htmlToMarkdown = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }
  
  let text = html;
  
  // Remove all HTML tags and convert to plain text, but preserve formatting
  // Handle nested tags properly - order matters!
  
  // Links (before other tags to preserve link text formatting)
  text = text.replace(/<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, (_match, url, linkText) => {
    const cleanText = linkText.replace(/<[^>]+>/g, ''); // Remove any nested tags in link text
    return `[${cleanText}](${url})`;
  });
  
  // Strikethrough (before bold/italic to avoid conflicts)
  text = text.replace(/<s>(.*?)<\/s>/gi, '~~$1~~');
  text = text.replace(/<strike>(.*?)<\/strike>/gi, '~~$1~~');
  text = text.replace(/<del>(.*?)<\/del>/gi, '~~$1~~');
  
  // Bold (strong and b tags)
  text = text.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
  text = text.replace(/<b>(.*?)<\/b>/gi, '**$1**');
  
  // Italic (em and i tags)
  text = text.replace(/<em>(.*?)<\/em>/gi, '*$1*');
  text = text.replace(/<i>(.*?)<\/i>/gi, '*$1*');
  
  // Code (inline code)
  text = text.replace(/<code>(.*?)<\/code>/gi, '`$1`');
  
  // Line breaks
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<p[^>]*>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n');
  
  // Remove remaining HTML tags
  text = text.replace(/<[^>]+>/g, '');
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&apos;/g, "'");
  
  return text.trim();
};

// Convert Editor.js JSON to Markdown
const editorJsToMarkdown = (data: OutputData): string => {
  if (!data || !data.blocks || !Array.isArray(data.blocks)) {
    return '';
  }

  let markdown = '';

  data.blocks.forEach((block) => {
    try {
      switch (block.type) {
        case 'paragraph': {
          let text = '';
          if (typeof block.data.text === 'string') {
            text = block.data.text;
          } else if (block.data.text) {
            // If it's an object, try to extract text
            text = String(block.data.text);
          }
          text = htmlToMarkdown(text);
          if (text) {
            markdown += text + '\n\n';
          }
          break;
        }
        case 'header': {
          const level = (block.data.level || 1) as number;
          let text = '';
          if (typeof block.data.text === 'string') {
            text = block.data.text;
          } else if (block.data.text) {
            text = htmlToMarkdown(String(block.data.text));
          }
          if (text) {
            markdown += '#'.repeat(level) + ' ' + text + '\n\n';
          }
          break;
        }
        case 'list': {
          const items = block.data.items || [];
          const style = (block.data.style || 'unordered') as string;
          
          if (Array.isArray(items) && items.length > 0) {
            items.forEach((item: unknown, index: number) => {
              let itemText = '';
              if (typeof item === 'string') {
                itemText = htmlToMarkdown(item);
              } else if (item && typeof item === 'object') {
                // If item is an object, try to extract text
                itemText = htmlToMarkdown(JSON.stringify(item));
              } else {
                itemText = String(item || '');
              }
              
              if (itemText) {
                if (style === 'ordered') {
                  markdown += `${index + 1}. ${itemText}\n`;
                } else {
                  markdown += `- ${itemText}\n`;
                }
              }
            });
            markdown += '\n';
          }
          break;
        }
        case 'quote': {
          let text = '';
          if (typeof block.data.text === 'string') {
            text = block.data.text;
          } else if (block.data.text) {
            text = htmlToMarkdown(String(block.data.text));
          }
          if (text) {
            // Handle multi-line quotes
            const quoteLines = text.split('\n');
            quoteLines.forEach((line) => {
              if (line.trim()) {
                markdown += '> ' + line + '\n';
              }
            });
            markdown += '\n';
          }
          break;
        }
        case 'code': {
          const code = (block.data.code || '') as string;
          const language = (block.data.language || block.data.languageName || '') as string;
          if (code) {
            markdown += '```' + (language || '') + '\n' + code + '\n```\n\n';
          }
          break;
        }
        case 'image': {
          const url = (block.data.url || (block.data.file as { url?: string })?.url || '') as string;
          const caption = (block.data.caption || '') as string;
          if (url) {
            markdown += `![${caption || ''}](${url})\n\n`;
          }
          break;
        }
        case 'delimiter': {
          markdown += '---\n\n';
          break;
        }
        case 'checklist': {
          const items = (block.data.items || []) as Array<{ text?: string; checked?: boolean }>;
          if (Array.isArray(items) && items.length > 0) {
            items.forEach((item) => {
              const text = item.text || '';
              const checked = item.checked ? 'x' : ' ';
              markdown += `- [${checked}] ${htmlToMarkdown(text)}\n`;
            });
            markdown += '\n';
          }
          break;
        }
        case 'table': {
          const content = block.data.content || [];
          const withHeadings = (block.data.withHeadings || false) as boolean;
          const alignment = (block.data.alignment || []) as string[];
          
          if (Array.isArray(content) && content.length > 0) {
            content.forEach((row: unknown[], rowIndex: number) => {
              if (Array.isArray(row)) {
                const rowText = row.map((cell: unknown) => {
                  const cellText = typeof cell === 'string' ? cell : String(cell || '');
                  return htmlToMarkdown(cellText);
                }).join(' | ');
                markdown += '| ' + rowText + ' |\n';
                
                // Add header separator after first row (or after headings row if withHeadings is true)
                const separatorRowIndex = withHeadings ? 0 : 0;
                if (rowIndex === separatorRowIndex) {
                  const separator = row.map((_, colIndex) => {
                    const align = alignment && alignment[colIndex];
                    if (align === 'center') {
                      return ' :---: ';
                    } else if (align === 'right') {
                      return ' ---: ';
                    } else {
                      return ' --- ';
                    }
                  }).join('|');
                  markdown += '|' + separator + '|\n';
                }
              }
            });
            markdown += '\n';
          }
          break;
        }
        default:
          // For unknown block types, try to extract any text content
          if (block.data && typeof block.data === 'object') {
            const dataStr = JSON.stringify(block.data);
            if (dataStr && dataStr !== '{}') {
              console.warn(`Unknown block type: ${block.type}`, block.data);
            }
          }
          break;
      }
    } catch (error) {
      console.error(`Error processing block type ${block.type}:`, error, block);
    }
  });

  return markdown.trim();
};

// Convert HTML to Editor.js JSON (basic conversion)
const htmlToEditorJs = (html: string): OutputData => {
  if (!html || html.trim() === '') {
    return {
      time: Date.now(),
      blocks: [],
    };
  }

  // Check if content is markdown (starts with #, -, >, etc.)
  const trimmedHtml = html.trim();
  if (trimmedHtml.match(/^[#->*`\d]/) && !trimmedHtml.startsWith('<')) {
    // Likely markdown, try parsing as markdown
    return markdownToEditorJs(html);
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
  enableMarkdown = true, // Enable markdown by default
}) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const initialContentRef = useRef<string>(content);
  const isUpdatingFromPropRef = useRef(false);
  const lastContentFromPropRef = useRef<string>(content);

  useEffect(() => {
    if (!holderRef.current || isInitializedRef.current) {
      return;
    }

    // Initialize Editor.js
    // Ensure content is always a string
    const contentString = typeof initialContentRef.current === 'string' ? initialContentRef.current : '';
    // Convert content to Editor.js format (supports both HTML and Markdown)
    const editorData = enableMarkdown && contentString.trim().match(/^[#->*`\d]/) && !contentString.trim().startsWith('<')
      ? markdownToEditorJs(contentString)
      : htmlToEditorJs(contentString);
    const editor = new EditorJS({
      holder: holderRef.current,
      placeholder: placeholder,
      data: editorData,
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
          // If markdown is enabled, export as markdown, otherwise as HTML
          const output = enableMarkdown 
            ? editorJsToMarkdown(outputData)
            : editorJsToHtml(outputData);
          // Ensure we always pass a string
          if (typeof output === 'string') {
            // Update our refs to prevent re-render loop
            lastContentFromPropRef.current = output;
            initialContentRef.current = output;
            onChange(output);
          } else {
            console.warn('Editor content is not a string:', output);
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
  // But only if it's different from what we already have and it's an external change
  useEffect(() => {
    if (editorRef.current && isInitializedRef.current) {
      // Ensure content is always a string
      const contentString = typeof content === 'string' ? content : '';
      
      // Only update if:
      // 1. Content is different from what we last received from props
      // 2. Content is different from what we last saved (to avoid loops)
      // 3. Content is not empty (unless we're clearing it intentionally)
      const lastPropContent = lastContentFromPropRef.current;
      const currentSavedContent = initialContentRef.current;
      
      // This is an external change (from props) if it's different from what we last received
      // AND different from what we last saved (meaning it's not from our own onChange)
      if (contentString !== lastPropContent && contentString !== currentSavedContent) {
        isUpdatingFromPropRef.current = true;
        lastContentFromPropRef.current = contentString;
        try {
          // Convert content to Editor.js format (supports both HTML and Markdown)
          const editorJsData = enableMarkdown && contentString.trim().match(/^[#->*`\d]/) && !contentString.trim().startsWith('<')
            ? markdownToEditorJs(contentString)
            : htmlToEditorJs(contentString);
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
      } else if (contentString === lastPropContent && contentString !== currentSavedContent) {
        // Content matches what we last received from props, but differs from saved
        // This means user is typing, so update our ref but don't re-render
        lastContentFromPropRef.current = contentString;
      }
    }
  }, [content, enableMarkdown]);

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
