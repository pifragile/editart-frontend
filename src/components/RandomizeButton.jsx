function RandomizeButton({ handleRandomize }) {
    return (
        <button
            className="btn btn-default btn-form"
            name="randomize"
            id="randomize"
            onClick={handleRandomize}
        >
            Randomize
        </button>
    );
}

export default RandomizeButton;
