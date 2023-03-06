import { ENV } from "./consts";

let contractList;
if (["dev", "staging"].includes(ENV)) {
    contractList = [
        {
            name: "Interwoven",
            address: "KT1SSX3W9Dzd1wxL4w99qoXcDwrBns9Cv4M1",
            author: "MathBird",
        },
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
            name: "Hybrid",
            address: "KT1VwK23Bicp8Mr6LAze6WtZchkqSSF2kWaB",
            author: "pifragile",
            disableMintOnMobile: true,
        },
        {
            name: "Brick",
            address: "KT1XukBmtNUW1B7mjhNmMNBYQpxZtmxK5Jpo",
            author: "pifragile",
        },
        {
            name: "Chroma Rush",
            address: "KT1WmnsefxSqseDkF5vwbNsADgFX5UyuBSrc",
            author: "WootScoot",
        },
    ];
} else if (ENV === "prod") {
    contractList = [
        {
            name: "Interwoven",
            address: "KT1XHf9VcuXGaKJZ5zWBd3xyyqyaxpKgwQP1",
            author: "MathBird",
        },
        {
            name: "Chroma Rush",
            address: "KT1U8Qko8uQavWWPj4xx3bTGCNUPxrzitXnG",
            author: "WootScoot",
        },
        {
            name: "Hybrid",
            address: "KT1AgsJw6EEwk56r9XoQHss9yAA7dNPZYvFH",
            author: "pifragile",
            disableMintOnMobile: true,
        },
        {
            name: "Skull Wiggles",
            address: "KT1RaB59rC3MAC4UyePt2B1pK9XuUFiJ7Yvj",
            author: "j4son3099",
        },
        {
            name: "PIXELFACE",
            address: "KT1Mdzu48zD387G8cTunhkTwSMXrYw8AUR5U",
            author: "Filter8",
        },
        {
            name: "Genesis",
            address: "KT1D7Ufx21sz9yDyP4Rs1WBCur9XhaZ9JwNE",
            author: "pifragile",
        },
    ];
}

export default contractList;
