import type { ReactNode } from "react";

interface WinDialogProps {
  /** Title shown in the blue title bar */
  title: string;
  /** Optional icon emoji or element before title */
  icon?: string;
  /** Dialog body content */
  children: ReactNode;
  /** Optional close handler — shows the X button when provided */
  onClose?: () => void;
}

/**
 * Reusable Win98-style dialog box component.
 * Features a gradient blue title bar with decorative window controls,
 * 3D beveled borders, and optional close button.
 */
export default function WinDialog({ title, icon, children, onClose }: WinDialogProps) {
  return (
    <div className="w-full border-t-2 border-l-2 border-r-2 border-b-2 border-retro-border-mid bg-retro-winface shadow-[2px_2px_0px_#000]">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-1.5 py-0.5 bg-linear-to-r from-[#000080] to-[#1084d0] select-none">
        <span className="text-white text-xs font-bold flex items-center gap-1.5">
          {icon && <span className="text-sm">{icon}</span>}
          {title}
        </span>
        <div className="flex gap-0.5">
          {/* Minimize button (decorative) */}
          <span className="inline-block w-4 h-4 bg-retro-winface border-t border-l border-r border-b border-retro-border-mid text-[10px] text-center leading-4 font-bold">
            _
          </span>
          {/* Maximize button (decorative) */}
          <span className="inline-block w-4 h-4 bg-retro-winface border-t border-l border-r border-b border-retro-border-mid text-[10px] text-center leading-4 font-bold">
            □
          </span>
          {/* Close button — functional if onClose provided */}
          {onClose ? (
            <button
              className="w-4 h-4 bg-retro-winface border-t border-l border-r border-b border-retro-border-mid text-[10px] leading-none flex items-center justify-center cursor-pointer hover:bg-[#ff4444] active:border-t-retro-border-mid active:border-l-retro-border-mid active:border-r-white active:border-b-white"
              onClick={onClose}
              aria-label="Close dialog"
            >
              ✕
            </button>
          ) : (
            <span className="inline-block w-4 h-4 bg-retro-winface border-t border-l border-r border-b border-retro-border-mid text-[10px] text-center leading-4">
              ✕
            </span>
          )}
        </div>
      </div>

      {/* Menu Bar (decorative) */}
      <div className="flex gap-3 px-2 py-0.5 text-[11px] text-black border-b border-retro-border-mid">
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-default">File</span>
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-default">Edit</span>
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-default">View</span>
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-default">Help</span>
      </div>

      {/* Dialog Content */}
      <div className="p-3">
        {children}
      </div>

      {/* Status Bar (decorative) */}
      <div className="flex items-center px-2 py-0.5 border-t border-retro-border-mid">
        <div className="text-[10px] text-[#444] flex items-center gap-1">
          <span className="inline-block w-2 h-2 bg-retro-green-online rounded-full border border-[#004400]" />
          Ready
        </div>
      </div>
    </div>
  );
}
