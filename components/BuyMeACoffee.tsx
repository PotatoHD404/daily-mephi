import React, { useEffect } from "react";

export default function BuyMeACoffee() {
    // const
    useEffect(() => {
        const script = document.createElement("script");
        const div = document.getElementById("supportByBMC");
        script.setAttribute(
            "src",
            "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
        );
        script.setAttribute("data-name", "BMC-Widget");
        script.setAttribute("data-cfasync", "false");
        script.setAttribute("data-id", "dailyMEPhi");
        script.setAttribute("data-description", "Support me on Buy me a coffee!");
        script.setAttribute(
            "data-message",
            "Buying a single coffee for me is 1000 times worth than a Thank you"
        );
        script.setAttribute("data-color", "#5F7FFF");
        script.setAttribute("data-position", "Right");
        script.setAttribute("data-x_margin", "100");
        script.setAttribute("data-y_margin", "100");

        script.onload = function () {
            // let evt = document.createEvent("Event");
        // , ("DOMContentLoaded", false, false)
            let evt = new Event("DOMContentLoaded");
            window.dispatchEvent(evt);
        };

        div?.appendChild(script);
    }, []);

    return <div id="supportByBMC"/>;
}
