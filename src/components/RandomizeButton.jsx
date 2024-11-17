function RandomizeButton({ handleRandomize }) {
    return (
        <button
            className="btn btn-default"
            name="randomize"
            id="randomize"
            onClick={handleRandomize}
        >
            Randomize
        </button>
    );
}

export default RandomizeButton;
