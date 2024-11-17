import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Buffer } from 'buffer';
window.Buffer = Buffer;

const root = ReactDOM.createRoot(document.getElementById("app"));

root.render(
    //<React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    //</React.StrictMode>
);
