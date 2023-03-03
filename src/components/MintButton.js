import { formatMutez } from "../lib/utils";

function MintButton({ price, onClick, isLoading }) {
    return (
        <button
            className={isLoading ? "btn btn-default btn-ghost" : "btn btn-default"}
            name="mint"
            id="mint"
            onClick={isLoading ? (e) => e.preventDefault() : onClick}
        >
            {`Mint for ${formatMutez(price)}`}
        </button>
    );
}

export default MintButton;
