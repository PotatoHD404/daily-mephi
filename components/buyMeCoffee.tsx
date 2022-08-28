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

    const path = `https://www.donationalerts.com/r/potatohd404`;

    return (
        <>
            <button
                className={"flex align-middle justify-center w-16 h-16 bg-[#FF5F5F] text-white rounded-full fixed " +
                    "right-[2.5rem] bottom-[2.5rem] duration-200 transition-all ease-in-out z-50 " +
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
            <div className={"fixed m-0 border-0 right-20 bottom-20 rounded-2xl shadow-xl z-30 " +
                "transition-all duration-300 w-[335px] ease-in-out bg-white overflow:hidden " + (state.widget ? "h-[530px]" : "h-0 opacity-0")}>
                {
                    state.triggered ?
                        <iframe className={"m-0 border-0 right-20 bottom-20 z-30 rounded-2xl " +
                            "transition-all duration-300 w-[335px] ease-in-out bg-white overflow:hidden " + (state.widget ? "h-[530px]" : "h-0 opacity-0")}
                                src={path}
                                title="Buy Me a Coffee"
                                id="donationFrame"/> : null
                }
            </div>
        </>
    );
};
export default BuyMeACoffeeWidget;
