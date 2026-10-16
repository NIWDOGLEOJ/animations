import React, { useEffect, useRef } from "react";
import { VenueReveal as VenueRevealController } from "../js/venue-reveal.js";
import "../css/venue-reveal.css";

export interface VenueRevealProps {
  svgUrl?: string;
  photoUrl?: string;
  tagline?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const VenueReveal: React.FC<VenueRevealProps> = ({
  svgUrl = "assets/venue-lines.svg",
  photoUrl = "assets/venue.webp",
  tagline = "The Flagship Venue",
  title = "IITM Research Park",
  subtitle = "Kanagam Road, Taramani, Chennai · Tamil Nadu 600113",
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<VenueRevealController | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    controllerRef.current = new VenueRevealController(containerRef.current, {
      svgUrl,
      photoUrl,
      autoPlayOnScroll: true
    });

    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, [svgUrl, photoUrl]);

  return (
    <div ref={containerRef} className={`venue-reveal ${className}`}>
      <div className="venue-reveal__caption">
        <span className="venue-reveal__tagline">{tagline}</span>
        <h3 className="venue-reveal__title">{title}</h3>
        <p className="venue-reveal__subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default VenueReveal;
