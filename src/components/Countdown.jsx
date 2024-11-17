import React from "react";
import { useCountdown } from "../hooks/useCountdown";

const Countdown = ({ targetDate }) => {
    const [days, hours, minutes, seconds] = useCountdown(targetDate);

    if (days + hours + minutes + seconds <= 0) {
        return "";
    } else {
        return (
            <span>
                {days > 0 && <span>{days} days </span>}
                {hours > 0 && <span>{hours} hours </span>}
                {minutes > 0 && <span>{minutes} minutes </span>}
                {seconds > 0 && <span>{seconds} seconds</span>}
            </span>
        );
    }
};

export default Countdown;
