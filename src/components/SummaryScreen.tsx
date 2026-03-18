import React, { useEffect, useState } from "react";
import type { FatherTypeId, LogEntry } from "../types/father";
import { generateDailySummary } from "../lib/textGenerator";

interface SummaryScreenProps {
  logs: LogEntry[];
  typeId?: FatherTypeId;
  onBack: () => void;
  onReset: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  logs,
  typeId,
  onBack,
  onReset,
}) => {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      const newSummary = await generateDailySummary(logs, typeId);
      setSummary(newSummary);
      setIsLoading(false);
    };
    loadSummary();
  }, [logs, typeId]);

  return (
    <div className="panel summary-panel">
      <div className="panel-header">
        <h2>今日のまとめ</h2>
        <button className="btn-close" aria-label="パネルを閉じる" onClick={onBack}>
          ✕
        </button>
      </div>

      <div className="panel-content summary-panel-content">
        <div className="screen-heading">
          <p className="eyebrow">ダイジェスト</p>
          <h3>今日のまとめ</h3>
        </div>

        <div className={`summary-text ${isLoading ? "loading" : ""}`}>
          {summary.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>

        <div className="summary-actions">
          <button className="btn btn-secondary" onClick={onBack}>
            ホームへ戻る
          </button>
          <button className="btn btn-primary" onClick={onReset}>
            最初に戻る
          </button>
        </div>
      </div>
    </div>
  );
};
