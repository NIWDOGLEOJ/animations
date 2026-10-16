import React, { useRef } from "react";
import "./glow-button.css"; // Ensure glow-button.css is imported or merged into global CSS

export interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shape?: "pill" | "box" | "circle";
  as?: "button" | "a";
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  shape = "pill",
  as = "button",
  href,
  children,
  className = "",
  onClick,
  ...props
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const burstTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = () => {
    const el = containerRef.current;
    if (!el) return;

    if (burstTimerRef.current) clearTimeout(burstTimerRef.current);
    el.classList.remove("glow-btn--burst");
    void el.offsetWidth; // Force CSS reflow
    el.classList.add("glow-btn--burst");

    burstTimerRef.current = setTimeout(() => {
      el.classList.remove("glow-btn--burst");
      burstTimerRef.current = null;
    }, 900);
  };

  const corners = <span className="glow-btn__corners" aria-hidden="true" />;
  const label = <span className="glow-btn__label">{children}</span>;

  if (as === "a" || href) {
    return (
      <span
        ref={containerRef}
        className={`glow-btn ${className}`}
        data-shape={shape}
        onPointerDown={handlePointerDown}
      >
        {corners}
        <a href={href} className="glow-btn__surface" {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {label}
        </a>
      </span>
    );
  }

  return (
    <span
      ref={containerRef}
      className={`glow-btn ${className}`}
      data-shape={shape}
      onPointerDown={handlePointerDown}
    >
      {corners}
      <button
        type="button"
        className="glow-btn__surface"
        onClick={onClick}
        {...props}
      >
        {label}
      </button>
    </span>
  );
};

export default GlowButton;
