import React, { useEffect, useRef } from "react";
import { BracketsField } from "../js/brackets-field.js";

export interface BracketsCanvasProps {
  className?: string;
  enableMouseParallax?: boolean;
  enableScroll?: boolean;
  autoRotate?: boolean;
}

export const BracketsCanvas: React.FC<BracketsCanvasProps> = ({
  className = "",
  enableMouseParallax = true,
  enableScroll = true,
  autoRotate = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<BracketsField | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    instanceRef.current = new BracketsField(containerRef.current, {
      enableMouseParallax,
      enableScroll,
      autoRotate
    });

    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [enableMouseParallax, enableScroll, autoRotate]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};

export default BracketsCanvas;
