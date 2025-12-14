import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function CircularChart({ value = 0, color = "#0CBBAA", maxValue = 100 }) {
    const percentage = Math.min((value / maxValue) * 100, 100);

    return (
        <div className="w-[55px] h-[55px]">
            <CircularProgressbar
                value={percentage}
                text={`${Math.round(percentage)}%`}
                styles={buildStyles({
                    textColor: color,
                    pathColor: color,
                    trailColor: color + "40",
                })}
            />
        </div>
    );
}

export default CircularChart;
