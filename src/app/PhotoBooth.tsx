"use client";

import { useEffect, useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import { useGalleryOpen } from "./GalleryContext";

// A tiny fake "Photo Booth" app: live webcam preview, a shutter button, a
// filmstrip of the last several shots, and a share button for sending the
// selected one — camera access is opt-in (a click), never requested on page
// load, since auto-prompting for camera permission on load is exactly the
// kind of thing that gets a site's tab closed.
const CAPTURE_SIZE = 240;
const MAX_SHOTS = 6;

type Status = "idle" | "starting" | "live" | "error";

export default function PhotoBooth({
  titleBarProps,
}: {
  titleBarProps?: HTMLAttributes<HTMLDivElement>;
}) {
  const openFrom = useGalleryOpen();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [shots, setShots] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);
  const [flash, setFlash] = useState(false);
  const [sendState, setSendState] = useState<"idle" | "sent">("idle");

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStatus("idle");
  };

  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  const start = async () => {
    setStatus("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("live");
    } catch {
      setStatus("error");
    }
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (status !== "live" || !video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = CAPTURE_SIZE;
    canvas.height = CAPTURE_SIZE;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const side = Math.min(vw, vh);

    ctx.save();
    ctx.translate(CAPTURE_SIZE, 0);
    ctx.scale(-1, 1); // un-mirror: the preview is mirrored, the capture shouldn't be
    ctx.drawImage(
      video,
      (vw - side) / 2,
      (vh - side) / 2,
      side,
      side,
      0,
      0,
      CAPTURE_SIZE,
      CAPTURE_SIZE
    );
    ctx.restore();

    setShots((prev) => [canvas.toDataURL("image/png"), ...prev].slice(0, MAX_SHOTS));
    setSelected(0);
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
  };

  // Web Share API when the browser can share an actual file (most mobile
  // browsers), so "send" hands off to Messages/Mail/AirDrop/etc. the way it
  // would for a real photo. Falls back to just downloading the image where
  // sharing files isn't supported (most desktop browsers).
  const send = async () => {
    const src = shots[selected];
    if (!src) return;
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const file = new File([blob], "photo-booth.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Photo Booth" });
      } else {
        const a = document.createElement("a");
        a.href = src;
        a.download = "photo-booth.png";
        a.click();
      }
      setSendState("sent");
      setTimeout(() => setSendState("idle"), 1500);
    } catch {
      // AbortError from the user dismissing the share sheet, or a fetch
      // failure — either way there's nothing useful to recover into.
    }
  };

  return (
    <div className="w-full h-full rounded-lg border border-black/10 bg-white shadow-xl overflow-hidden flex flex-col">
      {/* Title bar. The red dot doubles as a real close/stop control — turning
          off the camera — rather than sitting there purely decorative like
          WordDoc's, since a photo booth window with a live camera feed
          benefits from an obvious, expected way to turn it off. */}
      <div
        {...titleBarProps}
        className="relative flex items-center px-3 py-2 bg-gradient-to-b from-neutral-100 to-neutral-200 border-b border-black/10 shrink-0"
      >
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={stopStream}
            disabled={status !== "live"}
            aria-label="Turn off camera"
            className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/20 disabled:opacity-60"
          />
          <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/20" />
          <span className="w-3 h-3 rounded-full bg-[#28c840] border border-black/20" />
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 text-xs text-neutral-500">
          Photo Booth
        </span>
      </div>

      <div className="relative flex-1 bg-black overflow-hidden">
        <video
          ref={videoRef}
          muted
          playsInline
          className={`w-full h-full object-cover -scale-x-100 ${
            status === "live" ? "block" : "hidden"
          }`}
        />

        {status !== "live" && (
          <div className="absolute inset-0 flex items-center justify-center px-4">
            {status === "error" ? (
              <button
                type="button"
                onClick={start}
                className="text-xs text-white/80 text-center hover:text-white"
              >
                Camera blocked or unavailable.
                <br />
                Tap to try again.
              </button>
            ) : (
              <button
                type="button"
                onClick={start}
                disabled={status === "starting"}
                aria-label="Turn on camera"
                className="flex flex-col items-center gap-2 text-white/70 hover:text-white disabled:opacity-50"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 7l-7 5 7 5V7z" />
                  <rect x="1" y="5" width="15" height="14" rx="2" />
                </svg>
                <span className="text-xs">
                  {status === "starting" ? "Starting…" : "Turn on camera"}
                </span>
              </button>
            )}
          </div>
        )}

        {flash && <div className="absolute inset-0 bg-white" />}

        {/* Filmstrip: every shot from this session, most recent first.
            Clicking one selects it (blue ring — that's what "send" acts on)
            and opens the shared lightbox, grouped so prev/next cycles
            through the rest of the strip instead of an unrelated gallery. */}
        {shots.length > 0 && (
          <div
            data-lightbox-group
            className="absolute right-2 bottom-11 flex gap-1.5 max-w-[calc(100%-5rem)] overflow-x-auto"
          >
            {shots.map((src, i) => (
              // Captured data URL, not a static asset next/image can optimize.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`Photo booth capture ${shots.length - i}`}
                data-lightbox-src={src}
                data-lightbox-alt={`Photo booth capture ${shots.length - i}`}
                onClick={(e) => {
                  setSelected(i);
                  openFrom(e.currentTarget);
                }}
                className={`w-7 h-7 shrink-0 rounded object-cover cursor-zoom-in border-2 ${
                  i === selected
                    ? "border-[#1d3fd6]"
                    : "border-white/40 hover:border-white/70"
                }`}
              />
            ))}
          </div>
        )}

        {/* Bottom control bar: capture button + share/send, the way the real
            app's own chrome looks — no toolbar. */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-2 bg-gradient-to-t from-black/50 to-transparent">
          <button
            type="button"
            onClick={capture}
            disabled={status !== "live"}
            aria-label="Take photo"
            className="w-8 h-8 rounded-full bg-white/15 border border-white/40 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 8h3l2-2h6l2 2h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
              <circle cx="12" cy="13" r="3.2" />
            </svg>
          </button>

          <button
            type="button"
            onClick={send}
            disabled={shots.length === 0}
            aria-label="Send photo"
            title="Send this photo to yourself"
            className="w-8 h-8 rounded-full bg-white/15 border border-white/40 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {sendState === "sent" ? (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 16V4M12 4l-4 4M12 4l4 4" />
                <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
