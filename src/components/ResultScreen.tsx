import React from "react";
import type { FatherProfile } from "../types/father";
import { assetMap } from "../data/assetMap";

interface ResultScreenProps {
  fatherProfile: FatherProfile;
  onNext: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  fatherProfile,
  onNext,
}) => {
  const fatherImage = assetMap.father(fatherProfile.id, "resting");

  return (
    <div className="screen result-screen">
      <div className="result-content screen-card">
        <div className="result-image">
          <img src={fatherImage} alt={fatherProfile.displayName} />
        </div>

        <div className="result-info">
          <div className="screen-heading">
            <p className="eyebrow">診断結果</p>
            <h2 className="result-type">{fatherProfile.displayName}</h2>
          </div>

          <div className="result-tags">
            {fatherProfile.tags.map((tag, idx) => (
              <span key={idx} className="tag">
                {tag}
              </span>
            ))}
          </div>

          <p className="result-description">{fatherProfile.description}</p>
        </div>

        <div className="screen-actions">
          <button className="btn btn-primary" onClick={onNext}>
            この父を見守る
          </button>
        </div>
      </div>
    </div>
  );
};
