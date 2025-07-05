import { formatMutez } from "../lib/utils";

function MintButton({ price, onClick, isLoading }) {
    return (
        <button
            className="btn btn-default btn-form"
            name="mint"
            id="mint"
            onClick={isLoading ? (e) => e.preventDefault() : onClick}
        >
            {/* {`Mint for ${formatMutez(price)}`} */}
            {`Mint`}
        </button>
    );
}

export default MintButton;
