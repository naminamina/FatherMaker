import React, { useState } from "react";
import type { FatherProfile, FatherStats } from "../types/father";
import { generateItemReaction } from "../lib/textGenerator";

interface ItemPanelProps {
  profile: FatherProfile;
  stats: FatherStats;
  onStats: (stats: FatherStats) => void;
  onBack: () => void;
}

const AVAILABLE_ITEMS = ["缶コーヒー", "甘いもの", "休み時間", "おつかれさま", "小さな趣味の時間"];

export const ItemPanel: React.FC<ItemPanelProps> = ({
  profile,
  stats,
  onStats,
  onBack,
}) => {
  const [reaction, setReaction] = useState("");
  const [isLoadingReaction, setIsLoadingReaction] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleUseItem = async (item: string) => {
    setSelectedItem(item);
    setIsLoadingReaction(true);

    const newReaction = await generateItemReaction(item, profile.id);
    setReaction(newReaction);

    // Update stats based on item
    const newStats = { ...stats };
    switch (item) {
      case "缶コーヒー":
        newStats.energy += 15;
        newStats.fatigue -= 5;
        break;
      case "甘いもの":
        newStats.mood += 20;
        newStats.fatigue -= 10;
        break;
      case "休み時間":
        newStats.energy += 10;
        newStats.fatigue -= 15;
        break;
      case "おつかれさま":
        newStats.mood += 15;
        newStats.fatigue -= 5;
        break;
      case "小さな趣味の時間":
        newStats.mood += 25;
        newStats.energy += 10;
        break;
    }

    // Clamp values
    newStats.energy = Math.min(100, Math.max(0, newStats.energy));
    newStats.fatigue = Math.min(100, Math.max(0, newStats.fatigue));
    newStats.mood = Math.min(100, Math.max(0, newStats.mood));

    onStats(newStats);
    setIsLoadingReaction(false);

    setTimeout(() => {
      setReaction("");
      setSelectedItem(null);
    }, 2000);
  };

  return (
    <div className="panel items-panel">
      <div className="panel-header">
        <h2>アイテム</h2>
        <button className="btn-close" onClick={onBack}>
          ✕
        </button>
      </div>

      <div className="panel-content">
        <p className="items-description">
          父に何かしてあげましょう。きっと反応してくれます。
        </p>

        <div className="items-grid">
          {AVAILABLE_ITEMS.map((item) => (
            <button
              key={item}
              className={`item-btn ${selectedItem === item ? "active" : ""}`}
              onClick={() => handleUseItem(item)}
              disabled={isLoadingReaction && selectedItem === item}
            >
              <span className="item-name">{item}</span>
            </button>
          ))}
        </div>

        {reaction && (
          <div className="reaction-box">
            <p>{reaction}</p>
          </div>
        )}
      </div>
    </div>
  );
};
