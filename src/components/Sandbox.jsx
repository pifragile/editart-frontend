import Layout from "./Layout";
import { useState, useEffect } from "react";
import Editor from "./Editor";

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : "";
}

function setCookie(name, value, days = 7) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function Sandbox() {
    const [sketchSrc, setSketchSrc] = useState("");

    useEffect(() => {
        const storedSrc = getCookie("sketchSrc");
        if (storedSrc) {
            setSketchSrc(storedSrc);
        }
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        const newSrc = event.target[0].value;
        setCookie("sketchSrc", newSrc);
        // Reload the page so that changes are reflected immediately.
        window.location.reload();
    }

    return (
        <Layout>
            <h1>Preview</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Sketch URL:
                    <input type="url" id="sketchUrl" defaultValue={sketchSrc} />
                </label>
                <br/>
                <input className="btn btn-default" type="submit" value="Submit" />
            </form>
            {sketchSrc && (
                <>
                    <Editor price={0} baseUrl={sketchSrc} showButton={false} />
                </>
            )}
        </Layout>
    );
}

export default Sandbox;