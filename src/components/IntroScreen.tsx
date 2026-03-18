import React from "react";

interface IntroScreenProps {
  onNext: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onNext }) => {
  return (
    <div className="screen intro-screen">
      <div className="intro-content screen-card">
        <div className="screen-heading">
          <h1 className="title">Father Maker</h1>
          <p className="subtitle">うちの父、生成しました。</p>
        </div>

        <div className="intro-message">
          <p className="copy">
            父をプレゼントする日ではなく、父の見えない時間を想像する日へ。
          </p>
          <p className="description">
            性格診断から"うちのお父さんらしい存在"を生成し、その父がWebの中で生活する様子を眺めることで、普段見えていない父の時間に思いを馳せる体験です。
          </p>
        </div>

        <div className="screen-actions">
          <button className="btn btn-primary" onClick={onNext}>
            お父さんを生成する
          </button>
        </div>
      </div>
    </div>
  );
};
