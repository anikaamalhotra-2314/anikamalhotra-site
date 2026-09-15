"use client";

import { useRef, useState } from "react";
import type { HTMLAttributes } from "react";

// A fake Mac TextEdit window: title bar with traffic-light dots, a toolbar
// that changes the whole note's font/style/size/color, a ruler, and a
// contentEditable body so visitors can type into it. Formatting commands use
// execCommand — it's deprecated but still the simplest way to toggle rich
// formatting on a selection inside a contentEditable without pulling in a
// rich-text library for one decorative widget.

const FONTS = [
  { label: "Arial Narrow", value: "'Arial Narrow', Arial, sans-serif" },
  { label: "Times", value: "'Times New Roman', Times, serif" },
  { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
  { label: "Helvetica", value: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  { label: "Courier", value: "'Courier New', Courier, monospace" },
  { label: "Comic Sans", value: "'Comic Sans MS', 'Comic Sans', cursive" },
];

const SIZES = [12, 14, 16, 18, 21, 24, 28];

const STYLES = [
  { label: "Normal", tag: "p" },
  { label: "Title", tag: "h1" },
  { label: "Heading", tag: "h2" },
  { label: "Emphasis", tag: "em" },
];

export default function WordDoc({
  titleBarProps,
}: {
  // Spread onto the title bar so a wrapping <Draggable> can use it as the
  // drag handle — optional so WordDoc still works rendered on its own.
  titleBarProps?: HTMLAttributes<HTMLDivElement>;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const textColorRef = useRef<HTMLInputElement>(null);
  const [font, setFont] = useState(FONTS[0].value);
  const [fontSize, setFontSize] = useState(16);
  const [color, setColor] = useState("#1d3fd6");

  const format = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  };

  const applyStyle = (tag: string) => {
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, tag);
  };

  const applyTextColor = (value: string) => {
    setColor(value);
    format("foreColor", value);
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-lg bg-white text-[#171717] shadow-xl overflow-hidden">
      {/* Title bar. (No cursor-grab/grabbing class here: the site overrides
          any cursor-* utility back to the custom dot cursor — see
          globals.css's [class*="cursor-"] rule — so it would be inert.) */}
      <div
        {...titleBarProps}
        className="relative flex items-center px-3 py-2.5 bg-gradient-to-b from-neutral-100 to-neutral-200 border-b border-black/10"
      >
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/20" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/20" />
          <span className="w-3 h-3 rounded-full bg-[#28c840] border border-black/20" />
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs text-neutral-500">
          About Me — Edited
          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-black/10 bg-neutral-50 text-xs">
        <button
          type="button"
          onClick={() => format("insertUnorderedList")}
          aria-label="Toggle list"
          title="Paragraph style"
          className="w-6 h-6 border border-black/15 rounded"
        >
          ¶
        </button>
        <select
          value={font}
          onChange={(e) => setFont(e.target.value)}
          aria-label="Font"
          className="border border-black/15 rounded px-1.5 py-1 bg-white"
        >
          {FONTS.map((f) => (
            <option key={f.label} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <select
          defaultValue="p"
          onChange={(e) => applyStyle(e.target.value)}
          aria-label="Paragraph style"
          className="border border-black/15 rounded px-1.5 py-1 bg-white"
        >
          {STYLES.map((s) => (
            <option key={s.label} value={s.tag}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          aria-label="Font size"
          className="border border-black/15 rounded px-1.5 py-1 bg-white"
        >
          {SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => textColorRef.current?.click()}
          aria-label="Text color"
          title="Text color"
          className="w-5 h-5 rounded-sm border border-black/25"
          style={{ backgroundColor: color }}
        />
        <input
          ref={textColorRef}
          type="color"
          value={color}
          onChange={(e) => applyTextColor(e.target.value)}
          aria-hidden="true"
          tabIndex={-1}
          className="w-0 h-0 opacity-0 absolute"
        />
        <div className="flex items-center gap-1 ml-auto">
          <button
            type="button"
            onClick={() => format("bold")}
            aria-label="Bold"
            className="w-6 h-6 font-bold border border-black/15 rounded"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => format("italic")}
            aria-label="Italic"
            className="w-6 h-6 italic border border-black/15 rounded"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => format("underline")}
            aria-label="Underline"
            className="w-6 h-6 underline border border-black/15 rounded"
          >
            U
          </button>
        </div>
      </div>

      {/* Ruler */}
      <div className="relative px-6 pt-1 pb-0.5 border-b border-black/10 text-[10px] text-neutral-400 select-none">
        <div className="flex justify-between">
          {[0, 2, 4, 6, 8, 10, 12].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
        <span className="absolute left-6 top-0 border-x-4 border-x-transparent border-t-4 border-t-neutral-400" />
        <span className="absolute right-6 top-0 border-x-4 border-x-transparent border-t-4 border-t-neutral-400" />
      </div>

      {/* Body */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        className="min-h-40 px-6 py-6 outline-none leading-relaxed"
        style={{ fontFamily: font, fontSize: `${fontSize}px`, color }}
      >
        <p>
          I am an engineer, writer, and artist in NYC. I am passionate about
          building beautiful websites and ethical tech. These days, I’m
          focused on designing and building AI-powered developer tooling. On
          the side, I’m constantly developing my sense of web design and learning
          new technologies.
        </p>
        <p className="mt-4">
          I hold a BA in Computer Science from Barnard College of Columbia
          University. I am currently a docs writer &amp; engineer @ MongoDB.
        </p>
      </div>
    </div>
  );
}
