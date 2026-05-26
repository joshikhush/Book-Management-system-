import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, Loader, X } from "lucide-react";
import "../styles/Toast.css";

const ToastIcon = ({ type }) => {
  switch (type) {
    case "success":
      return <CheckCircle2 className="toast-icon-success" size={20} />;
    case "error":
      return <XCircle className="toast-icon-error" size={20} />;
    case "warning":
      return <AlertTriangle className="toast-icon-warning" size={20} />;
    case "loading":
      return <Loader className="toast-icon-info animate-spin" style={{ animation: "spin 1s linear infinite" }} size={20} />;
    default:
      return <Info className="toast-icon-info" size={20} />;
  }
};

export const ToastItem = ({ id, message, type, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (type === "loading") return; // Loading toasts shouldn't auto-dismiss

    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, type, duration, onClose]);

  return (
    <div className={`toast-item toast-${type}`}>
      <div className="toast-icon-wrapper">
        <ToastIcon type={type} />
      </div>
      <div className="toast-message">{message}</div>
      {type !== "loading" && (
        <button onClick={() => onClose(id)} className="toast-close-btn" aria-label="Close notification">
          <X size={16} />
        </button>
      )}
      {type !== "loading" && (
        <div 
          className="toast-progress" 
          style={{ 
            animation: `shrink-progress ${duration}ms linear forwards`,
            transformOrigin: "left"
          }} 
        />
      )}
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={removeToast}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};
