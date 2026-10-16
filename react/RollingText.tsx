import React, { useState } from "react";

export interface RollingTextProps {
  children: string;
  className?: string;
  staggerMs?: number;
}

export const RollingText: React.FC<RollingTextProps> = ({
  children,
  className = "",
  staggerMs = 25
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const chars = children.split("");

  return (
    <span
      className={`relative inline-block overflow-hidden align-bottom ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top primary text */}
      <span className="inline-block" data-roll="top">
        {chars.map((char, i) => (
          <span
            key={`top-${i}`}
            className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transitionDelay: `${i * staggerMs}ms`,
              transform: isHovered ? "translateY(-100%)" : "translateY(0%)"
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      {/* Bottom sliding duplicate text */}
      <span
        className="pointer-events-none absolute left-0 top-0 inline-block"
        data-roll="bottom"
        aria-hidden="true"
      >
        {chars.map((char, i) => (
          <span
            key={`bot-${i}`}
            className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transitionDelay: `${i * staggerMs}ms`,
              transform: isHovered ? "translateY(0%)" : "translateY(100%)"
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </span>
  );
};

export default RollingText;
