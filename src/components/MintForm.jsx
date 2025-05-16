import React, { useEffect, useState } from "react";
import MintButton from "./MintButton";
import RandomizeButton from "./RandomizeButton";
import { queryStringFromValues } from "../lib/utils";

function MintForm({
    onSubmitForm,
    onMint,
    price,
    showButton,
    isLoading,
    values,
    error=null,
}) {
    const [m0, setM0] = useState(values[0]);
    const [m1, setM1] = useState(values[1]);
    const [m2, setM2] = useState(values[2]);
    const [m3, setM3] = useState(values[3]);
    const [m4, setM4] = useState(values[4]);

    useEffect(() => {
        setM0(values[0]);
        setM1(values[1]);
        setM2(values[2]);
        setM3(values[3]);
        setM4(values[4]);
    }, [values]);


    let keyUpFun = (e) => {
        // left and right arrow
        if([37, 39].includes(e.keyCode)) handleChange(e);
    };

    let handleChange = (e) => {
        //e.preventDefault();
        onSubmitForm(m0, m1, m2, m3, m4);
    };

    let handleMint = (e) => {
        e.preventDefault();
        onMint();
    };

    let handleRandomize = (e) => {
        e.preventDefault();
        const newM0 = Math.random().toFixed(3);
        const newM1 = Math.random().toFixed(3);
        const newM2 = Math.random().toFixed(3);
        const newM3 = Math.random().toFixed(3);
        const newM4 = Math.random().toFixed(3);

        setM0(newM0);
        setM1(newM1);
        setM2(newM2);
        setM3(newM3);
        setM4(newM4);

        e.target.form.value0.value = newM0;
        e.target.form.value1.value = newM1;
        e.target.form.value2.value = newM2;
        e.target.form.value3.value = newM3;
        e.target.form.value4.value = newM4;

        onSubmitForm(newM0, newM1, newM2, newM3, newM4);
    };

    const copyUrlToClipBoard = (e) => {
        e.preventDefault();
        let href = window.location.href;
        href = href.split("?")[0];
        href = href + "?values=" + btoa(queryStringFromValues(...values));
        navigator.clipboard.writeText(href);
    };

    return (
        <div>
            <form>
                <fieldset style={{ position: "relative" }}>
                    <div
                        style={{
                            position: "absolute",
                            top: "0px",
                            right: "15px",
                            margin: "0",
                            padding: "0",
                        }}
                    >
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
                            overflow: "hidden"
                        }}
                    >
                        <input
                            className="mint-slider"
                            type="range"
                            min="0"
                            max="1"
                            value={m0}
                            step="0.001"
                            id="value0"
                            name="value0"
                            onMouseUp={handleChange}
                            onTouchEnd={handleChange}
                            onKeyUp={keyUpFun}
                            onChange={(e) => setM0(e.target.form.value0.value)}
                        />
                        <input
                            className="mint-slider"
                            type="range"
                            min="0"
                            max="1"
                            value={m1}
                            step="0.001"
                            id="value1"
                            name="value1"
                            onMouseUp={handleChange}
                            onTouchEnd={handleChange}
                            onKeyUp={keyUpFun}
                            onChange={(e) => setM1(e.target.form.value1.value)}
                        />
                        <input
                            className="mint-slider"
                            type="range"
                            min="0"
                            max="1"
                            value={m2}
                            step="0.001"
                            id="value2"
                            name="value2"
                            onMouseUp={handleChange}
                            onTouchEnd={handleChange}
                            onKeyUp={keyUpFun}
                            onChange={(e) => setM2(e.target.form.value2.value)}
                        />
                        <input
                            className="mint-slider"
                            type="range"
                            min="0"
                            max="1"
                            value={m3}
                            step="0.001"
                            id="value3"
                            name="value3"
                            onMouseUp={handleChange}
                            onTouchEnd={handleChange}
                            onKeyUp={keyUpFun}
                            onChange={(e) => setM3(e.target.form.value3.value)}
                        />
                        <input
                            className="mint-slider"
                            type="range"
                            min="0"
                            max="1"
                            value={m4}
                            step="0.001"
                            id="value4"
                            name="value4"
                            onMouseUp={handleChange}
                            onTouchEnd={handleChange}
                            onKeyUp={keyUpFun}
                            onChange={(e) => setM4(e.target.form.value4.value)}
                        />
                    </div>

                    <div className="form-group" style={{flex:"row", display: "flex", flexWrap: "wrap"}}>
                        <RandomizeButton handleRandomize={handleRandomize} />
                        <button
                            className="btn btn-default"
                            name="copyUrl"
                            id="copyUrl"
                            onClick={copyUrlToClipBoard}
                        >
                            Copy
                        </button>
                        {showButton && (
                            <MintButton
                                price={price}
                                onClick={handleMint}
                                isLoading={isLoading}
                            />
                        )}
                    </div>
                    {error && <span style={{ color: "red" }}>{error}</span>}
                </fieldset>
               
            </form>
            
        </div>
    );
}

export default MintForm;
