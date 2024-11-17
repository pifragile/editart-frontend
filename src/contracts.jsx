import { ENV } from "./consts";

let contractList;
if (["dev", "staging"].includes(ENV)) {
    contractList = [];
} else if (ENV === "prod") {
    contractList = [
        {
            name: "Density",
            address: "KT1PJtZ9EyG2CBwDVvqPnpsFpF4jq1vrGqWB",
            author: "mandybrigwell",
            showArtifact: true,
            plannedRelease: "2023-04-20T12:00:00.000Z"
        },
        {
            name: "Crystal Glitch",
            address: "KT1RvNzvhAH7vZF7WSKMe3HEZxuK198GYGmV",
            author: "AlexandreRangel",
            showArtifact: true,
        },
        {
            name: "aabb",
            address: "KT1AJ5gnH8PrM3YqCDijQjLUrSjdE46Co3tH",
            author: "mattebb",
        },
        {
            name: ":D",
            address: "KT1P6qtCWKRGYci6dS4XsFo5mMCAhcHgYyp1",
            author: "pxlshrd",
        },
        {
            name: "Blöck",
            address: "KT1JRLJVnSM5JhqByAunX7Ck4FdVfRcKHGyj",
            author: "Gorilla Sun",
        },
        {
            name: "Dash",
            address: "KT1F8NDkP6Ewu5fv4D7Fy4BXUVWngSCsnqKv",
            author: "loackme",
            showArtifact: true,
        },
        {
            name: "Shadows",
            address: "KT1BNAXdkkbjifrjTCM1LUbUvkG1r5AnDT1T",
            author: "loackme",
        },
        {
            name: "Brick",
            address: "KT1WXy5a7Z3i1fekQFp4y1c2yfdFt1YT8AQ3",
            author: "pifragile",
        },
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
