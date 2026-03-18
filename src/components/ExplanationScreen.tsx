import React from "react";

interface ExplanationScreenProps {
  onNext: () => void;
}

export const ExplanationScreen: React.FC<ExplanationScreenProps> = ({ onNext }) => {
  return (
    <div className="screen explanation-screen">
      <div className="explanation-content screen-card">
        <div className="screen-heading">
          <p className="eyebrow">Father Maker について</p>
          <h2>父の見えない時間を想像する</h2>
        </div>

        <div className="explanation-text">
          <p>父のことを、どれくらい知っていますか。</p>
          <p>仕事中の顔。ひとりの時間。疲れたときの様子。</p>
          <p>家族の前では見えない"父の時間"は、意外と知られていません。</p>
          <p className="conclusion">
            Father Maker は、そんな見えない時間を想像するための小さな装置です。
          </p>
        </div>

        <div className="screen-actions">
          <button className="btn btn-primary" onClick={onNext}>
            はじめる
          </button>
        </div>
      </div>
    </div>
  );
};
