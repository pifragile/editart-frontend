import React from "react";
import MintButton from "./MintButton";
import RandomizeButton from "./RandomizeButton";

function MintForm({
    onSubmitForm,
    onMint,
    price,
    showButton,
    isLoading,
    queryString,
}) {
    const urlParams = new URLSearchParams(queryString);
    const m0 = urlParams.get("m0");
    const m1 = urlParams.get("m1");
    const m2 = urlParams.get("m2");
    const m3 = urlParams.get("m3");
    const m4 = urlParams.get("m4");

    let handleChange = (e) => {
        //e.preventDefault();
        onSubmitForm(
            e.target.form.value0.value,
            e.target.form.value1.value,
            e.target.form.value2.value,
            e.target.form.value3.value,
            e.target.form.value4.value
        );
    };

    let handleMint = (e) => {
        e.preventDefault();
        onMint();
    };

    let handleRandomize = (e) => {
        e.preventDefault();
        e.target.form.value0.value = Math.random().toFixed(3);
        e.target.form.value1.value = Math.random().toFixed(3);
        e.target.form.value2.value = Math.random().toFixed(3);
        e.target.form.value3.value = Math.random().toFixed(3);
        e.target.form.value4.value = Math.random().toFixed(3);
        handleChange(e);
    };

    const copyUrlToClipBoard = (e) => {
        e.preventDefault();
        let href = window.location.href;
        href = href.split("?")[0];
        href = href + "?values=" + btoa(queryString);
        navigator.clipboard.writeText(href);
    };

    return (
        <div>
            <form>
                <fieldset style={{position: 'relative'}}>
                    <div style={{ position: "absolute", top: "0px", right: '15px', margin:"0", padding:"0"}}>
                        {" "}
                        {isLoading && <small>loading...</small>}
                    </div>
                    <legend>Mint Variables</legend>
                    <div
                        className="form-group"
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}
                    >
                        <input
                            className="mint-slider"
                            type="range"
                            min="0"
                            max="1"
                            defaultValue={m0}
                            step="0.001"
                            id="value0"
                            name="value0"
                            onMouseUp={handleChange}
                            onTouchEnd={handleChange}
                            onKeyUp={handleChange}
                        />
                        <input
                            className="mint-slider"
                            type="range"
                            min="0"
                            max="1"
                            defaultValue={m1}
                            step="0.001"
                            id="value1"
                            name="value1"
                            onMouseUp={handleChange}
                            onTouchEnd={handleChange}
                            onKeyUp={handleChange}
                        />
                        <input
                            className="mint-slider"
                            type="range"
                            min="0"
                            max="1"
                            defaultValue={m2}
                            step="0.001"
                            id="value2"
                            name="value2"
                            onMouseUp={handleChange}
                            onTouchEnd={handleChange}
                            onKeyUp={handleChange}
                        />
                        <input
                            className="mint-slider"
                            type="range"
                            min="0"
                            max="1"
                            defaultValue={m3}
                            step="0.001"
                            id="value3"
                            name="value3"
                            onMouseUp={handleChange}
                            onTouchEnd={handleChange}
                            onKeyUp={handleChange}
                        />
                        <input
                            className="mint-slider"
                            type="range"
                            min="0"
                            max="1"
                            defaultValue={m4}
                            step="0.001"
                            id="value4"
                            name="value4"
                            onMouseUp={handleChange}
                            onTouchEnd={handleChange}
                            onKeyUp={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <RandomizeButton handleRandomize={handleRandomize} />
                        {showButton && (
                            <MintButton
                                price={price}
                                onClick={handleMint}
                                isLoading={isLoading}
                            />
                        )}
                        <button
                            className="btn btn-default"
                            name="copyUrl"
                            id="copyUrl"
                            onClick={copyUrlToClipBoard}
                        >
                            Copy
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
}

export default MintForm;
