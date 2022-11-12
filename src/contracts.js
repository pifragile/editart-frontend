import { ENV } from "./consts";

let contractList;
if (["dev", "staging"].includes(ENV)) {
    contractList = [
        {
            name: "EATEST",
            address: "KT1Rq14t5dfUxYkQXw1NGFciBxi9Spjm74mG",
            author: "pifragile",
        },
        {
            name: "PIXELFACE",
            address: "KT1QcCcnTsZHR19DBQiFiddV2kv8q9fJudav",
            author: "Filter8",
        },
        {
            name: "Skull Wiggles",
            address: "KT1FwvmPotvwwU38JH8i7ypRguxRW3xywRCB",
            author: "j4son3099",
        },
    ];
} else if (ENV === "prod") {
    contractList = [
        {
            name: "PIXELFACE",
            address: "KT1Mdzu48zD387G8cTunhkTwSMXrYw8AUR5U",
            author: "Filter8",
        },
        {
            name: "Genesis",
            address: "KT1D7Ufx21sz9yDyP4Rs1WBCur9XhaZ9JwNE",
            author: "pifragile",
        }
    ];
}

export default contractList;
