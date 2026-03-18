import React from "react";
import type { LogEntry } from "../types/father";

interface FatherLogPanelProps {
  logs: LogEntry[];
  onBack: () => void;
}

export const FatherLogPanel: React.FC<FatherLogPanelProps> = ({
  logs,
  onBack,
}) => {
  const formatTime = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="panel log-panel">
      <div className="panel-header">
        <h2>父ログ</h2>
        <button className="btn-close" onClick={onBack}>
          ✕
        </button>
      </div>

      <div className="panel-content">
        {logs.length === 0 ? (
          <p className="empty-state">まだ記録がありません</p>
        ) : (
          <div className="log-list">
            {[...logs].reverse().map((log) => (
              <div key={log.id} className="log-item">
                <span className="log-time">{formatTime(log.timestamp)}</span>
                <span className="log-text">{log.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
