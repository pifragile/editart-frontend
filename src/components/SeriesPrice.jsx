import { TezosUsdContext } from "../App";
import { formatMutez } from "../lib/utils";
import { useContext } from "react";

function SeriesPrice({ soldOut, price, floorPrice }) {
    const tezosUsd = useContext(TezosUsdContext);
    if (soldOut) {
        if (floorPrice !== Infinity)
            return (
                <span>floor: ${formatMutez(floorPrice, tezosUsd.rate)}</span>
            );
        else return "";
    } else {
        return formatMutez(price, tezosUsd.rate);
    }
}

export default SeriesPrice;
