import React from "react";

export const BookCardSkeleton = () => {
  return (
    <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px", height: "340px", cursor: "default" }}>
      {/* Fake Book cover top gradient bar */}
      <div className="skeleton-bg" style={{ height: "140px", borderRadius: "8px", width: "100%" }} />
      
      {/* Fake Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div className="skeleton-bg" style={{ height: "20px", borderRadius: "4px", width: "75%" }} />
        <div className="skeleton-bg" style={{ height: "14px", borderRadius: "4px", width: "45%" }} />
      </div>

      {/* Fake Genre Tag & Rating */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="skeleton-bg" style={{ height: "24px", borderRadius: "20px", width: "70px" }} />
        <div className="skeleton-bg" style={{ height: "14px", borderRadius: "4px", width: "60px" }} />
      </div>

      {/* Spacer */}
      <div style={{ flexGrow: 1 }} />

      {/* Fake Action Buttons */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <div className="skeleton-bg" style={{ height: "36px", borderRadius: "8px", flex: 1 }} />
        <div className="skeleton-bg" style={{ height: "36px", borderRadius: "8px", width: "36px" }} />
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 6 }) => {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "24px",
      width: "100%"
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
};
