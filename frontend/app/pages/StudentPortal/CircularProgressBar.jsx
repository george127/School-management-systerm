// React Component
import "./style/CircularProgressBar.css";
import Strawberry from "./images/strawBerry.png"
const CircularProgressBar = ({
  percentage,
  size = 120,
  strokeWidth = 10,
  trackColor = "#d9d9d9",
  progressColor = "#e9691e",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="circular-progress-bar"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="progress-ring">
        <circle
          className="progress-ring__track"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="progress-ring__progress"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="percentage-text">
        <img src={Strawberry} alt="" />
        <span>{percentage}%</span>
      </div>
    </div>
  );
};

export default CircularProgressBar;


