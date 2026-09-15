"use client";

import { useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";

// Generic props bag, not typed against this file's own internals, so
// WordDoc/PhotoBooth/ClockWidget (which each define their own title bar
// markup) can just spread it onto whichever element should be the drag
// handle without importing anything drag-specific themselves.
export type DragHandleProps = {
  onPointerDown: (e: ReactPointerEvent) => void;
  onPointerMove: (e: ReactPointerEvent) => void;
  onPointerUp: (e: ReactPointerEvent) => void;
  onPointerCancel: (e: ReactPointerEvent) => void;
  style: CSSProperties;
  // Browsers make <img> elements natively draggable (the browser's own
  // drag-to-save/drag-to-a-new-tab gesture), which fights our pointer-based
  // dragging for exactly the elements most likely to need it. Harmless on
  // the title-bar <div> handles, which aren't natively draggable anyway.
  draggable: false;
};

type DragStart = { x: number; y: number; ox: number; oy: number };

// Wraps one home-page element to make it click-and-drag repositionable.
// The handle is deliberately NOT the whole element: for the fake app
// windows (WordDoc, PhotoBooth, ClockWidget) it's just their title bar,
// the same place a real OS window gets dragged from — attaching drag
// listeners to the whole card would intercept clicks meant for WordDoc's
// text/toolbar, PhotoBooth's shutter button, etc. Plain images pass the
// same handle props straight onto themselves since they have no interior
// controls to protect.
//
// Drag-in-progress state lives in useState, not a ref: the handle props
// get threaded through a render-prop call (children(...)), and a closure
// that reads a ref's .current can't be verified safe to only run outside
// render — plain state keeps every handler's closure just reading normal
// render-scoped values instead.
export default function Draggable({
  className,
  children,
}: {
  className?: string;
  children: (handleProps: DragHandleProps, dragging: boolean) => ReactNode;
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<DragStart | null>(null);

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    setDragStart({ x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y });
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragStart) return;
    setOffset({
      x: dragStart.ox + (e.clientX - dragStart.x),
      y: dragStart.oy + (e.clientY - dragStart.y),
    });
  };

  const endDrag = () => setDragStart(null);
  const dragging = dragStart !== null;

  return (
    <div
      className={className}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        zIndex: dragging ? 50 : undefined,
      }}
    >
      {children(
        {
          onPointerDown,
          onPointerMove,
          onPointerUp: endDrag,
          onPointerCancel: endDrag,
          style: {
            // touch-action: none stops the browser from also trying to
            // scroll/pan the page with the same touch that's dragging.
            touchAction: "none",
            // A plain inline style, not a cursor-* class: the site overrides
            // any class matching [class*="cursor-"] back to the custom dot
            // cursor (globals.css) precisely so it stays consistent
            // everywhere else, but inline styles aren't caught by that
            // selector at all and win the cascade regardless, which is
            // exactly what a deliberate exception like this one needs.
            cursor: dragging ? "grabbing" : "grab",
          },
          draggable: false,
        },
        dragging
      )}
    </div>
  );
}
