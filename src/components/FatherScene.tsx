import React, { useEffect, useState } from "react";
import type { FatherState, FatherProfile, FatherStats } from "../types/father";
import { assetMap } from "../data/assetMap";
import { generateFatherQuote } from "../lib/textGenerator";

interface FatherSceneProps {
  profile: FatherProfile;
  currentState: FatherState;
  stats: FatherStats;
  onNavigate: (tab: "logs" | "items" | "summary") => void;
}

const QUOTE_REFRESH_INTERVAL = 45 * 1000;
const SCENE_THEMES: Record<FatherState, string> = {
  working: "theme-working",
  resting: "theme-resting",
  commuting: "theme-commuting",
  relaxing: "theme-relaxing",
  thinking: "theme-thinking",
  sleeping: "theme-sleeping",
};

export const FatherScene: React.FC<FatherSceneProps> = ({
  profile,
  currentState,
  stats,
  onNavigate,
}) => {
  const [quote, setQuote] = useState("");
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  const fatherImage = assetMap.father(profile.id, currentState);
  const sceneTheme = SCENE_THEMES[currentState];

  useEffect(() => {
    let isMounted = true;
    let intervalId: number;

    const loadQuote = async () => {
      setIsLoadingQuote(true);
      const newQuote = await generateFatherQuote(currentState, profile.id);
      if (!isMounted) return;
      setQuote(newQuote);
      setIsLoadingQuote(false);
    };

    loadQuote();
    intervalId = window.setInterval(loadQuote, QUOTE_REFRESH_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [currentState, profile.id]);

  const getStateLabel = (state: FatherState): string => {
    const labels: Record<FatherState, string> = {
      working: "仕事中",
      resting: "休憩中",
      commuting: "移動中",
      relaxing: "くつろぎ中",
      thinking: "考え中",
      sleeping: "睡眠中",
    };
    return labels[state];
  };

  return (
    <div className="screen main-screen">
      <div className={`father-scene ${sceneTheme}`}>
        <div className="scene-overlay">
          <div className="father-container">
            <img
              src={fatherImage}
              alt={`Father in ${currentState} state`}
              className="father-image"
            />
          </div>

          <div className="father-info">
            <p className="father-status">{getStateLabel(currentState)}</p>
            <div className={`father-quote ${isLoadingQuote ? "loading" : ""}`}>
              <p>{quote || "..."}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat">
          <label>体力</label>
          <div className="stat-bar">
            <div
              className="stat-fill energy"
              style={{ width: `${stats.energy}%` }}
            ></div>
          </div>
          <span className="stat-value">{Math.round(stats.energy)}</span>
        </div>
        <div className="stat">
          <label>疲労</label>
          <div className="stat-bar">
            <div
              className="stat-fill fatigue"
              style={{ width: `${stats.fatigue}%` }}
            ></div>
          </div>
          <span className="stat-value">{Math.round(stats.fatigue)}</span>
        </div>
        <div className="stat">
          <label>気分</label>
          <div className="stat-bar">
            <div
              className="stat-fill mood"
              style={{ width: `${stats.mood}%` }}
            ></div>
          </div>
          <span className="stat-value">{Math.round(stats.mood)}</span>
        </div>
      </div>

      <nav className="main-nav">
        <button
          className="nav-btn"
          onClick={() => onNavigate("logs")}
          title="父ログ"
        >
          <span className="nav-text">LOG</span>
        </button>
        <button
          className="nav-btn"
          onClick={() => onNavigate("items")}
          title="アイテム"
        >
          <span className="nav-text">ITEMS</span>
        </button>
        <button
          className="nav-btn"
          onClick={() => onNavigate("summary")}
          title="今日のまとめ"
        >
          <span className="nav-text">SUMMARY</span>
        </button>
      </nav>
    </div>
  );
};
