import { formatMutez } from "../lib/utils";

function SeriesPrice({ soldOut, price, floorPrice }) {
    if (soldOut) {
        if (floorPrice !== Infinity) return `floor: ${formatMutez(floorPrice)}`;
        else return "";
    } else {
        return formatMutez(price);
    }
}

export default SeriesPrice;
