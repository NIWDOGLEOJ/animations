import React from "react";
import "./infinite-marquee.css";

export interface InfiniteMarqueeProps {
  items: React.ReactNode[];
  speedSeconds?: number;
  className?: string;
}

export const InfiniteMarquee: React.FC<InfiniteMarqueeProps> = ({
  items,
  speedSeconds = 30,
  className = ""
}) => {
  return (
    <div
      className={`infinite-marquee ${className}`}
      style={{ "--marquee-speed": `${speedSeconds}s` } as React.CSSProperties}
    >
      <div className="infinite-marquee__track">
        {items.map((item, idx) => (
          <div key={`track1-${idx}`} className="infinite-marquee__item">
            {item}
          </div>
        ))}
      </div>
      <div className="infinite-marquee__track" aria-hidden="true">
        {items.map((item, idx) => (
          <div key={`track2-${idx}`} className="infinite-marquee__item">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteMarquee;
