import React, {useState} from "react";
import CoffeeCup from 'images/coffee.svg'
import Image from "next/image";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function getElementByXpath(path: string) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

const BuyMeACoffeeWidget = () => {

    const [state, setState] = useState({widget: false, triggered: false})
    const toggleWidget = () => {
        setState({triggered: true, widget: !state.widget});
    }

    const path = `https://www.donationalerts.com/r/daily_mephi`;

    return (
        <>
            <button
                className={"flex align-middle justify-center w-14 h-14 md:w-16 md:h-16 bg-[#FF5F5F] text-white rounded-full fixed " +
                    "md:right-[2.5rem] md:bottom-[2.5rem] right-[1.5rem] bottom-[1.5rem] duration-200 transition-all ease-in-out z-30 " +
                    (state.widget ? "scale-[80%]" : "")} onClick={toggleWidget}
                style={{boxShadow: '0 4px 8px rgba(0,0,0,.4)'}}>
                {state.widget ? <KeyboardArrowDownIcon className="m-auto w-[70%] h-[70%] rotate-180"/> :
                    <div className="flex w-[66%] h-[66%] m-auto">

                        <Image
                            src={CoffeeCup}
                            alt="Coffee cup"
                        />

                    </div>
                }
            </button>
            <div
                className={"fixed m-0 md:border-0 border-10 md:right-20 md:bottom-20 right-10 bottom-10 rounded-2xl shadow-xl z-10 " +
                    "transition-all duration-300 w-[90vw] md:w-[335px] ease-in-out bg-white overflow:hidden "
                    + (state.widget ? "md:h-[530px] h-[90vh]" : "h-0 opacity-0")}>
                {
                    state.triggered ?
                        <iframe
                            className={"m-0 border-0 md:right-20 md:bottom-20 right-10 bottom-10 z-10 rounded-2xl " +
                                "transition-all duration-300 w-[90vw] md:w-[335px] ease-in-out bg-white overflow:hidden" + (state.widget ? "md:h-[530px] h-[90vh]" : "h-0 opacity-0")}
                            src={path}
                            title="Buy Me a Coffee"
                            id="donationFrame"/> : null
                }
            </div>
        </>
    );
};
export default BuyMeACoffeeWidget;
