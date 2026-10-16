import React from "react";
import "./google-preloader.css";

export interface GooglePreloaderProps {
  overlay?: boolean;
  visible?: boolean;
  className?: string;
}

export const GooglePreloader: React.FC<GooglePreloaderProps> = ({
  overlay = false,
  visible = true,
  className = ""
}) => {
  return (
    <div
      className={`google-preloader ${overlay ? "google-preloader--overlay" : ""} ${
        !visible ? "google-preloader--hidden" : ""
      } ${className}`.trim()}
      role="status"
      aria-label="Loading..."
    >
      <div className="google-preloader__track" aria-hidden="true">
        <div className="google-preloader__dot" />
        <div className="google-preloader__dot" />
        <div className="google-preloader__dot" />
        <div className="google-preloader__dot" />
      </div>
    </div>
  );
};

export default GooglePreloader;
