import React, {useState} from "react";
import CoffeeCup from 'images/coffee.svg'
import Image from "next/image";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {ButtonBase} from '@mui/material';

const BuyMeACoffeeWidget = () => {

    const [state, setState] = useState({widget: false, triggered: false})
    const toggleWidget = () => {
        setState({triggered: true, widget: !state.widget});
    }

    const path = `https://www.donationalerts.com/r/daily_mephi`;

    return (
        <>
            <ButtonBase
                className={"flex align-middle justify-center  bg-[#FF5F5F] text-white rounded-full fixed " +
                    "md:right-[2.5rem] md:bottom-[2.5rem] right-[1.5rem] bottom-[1.5rem] duration-200 transition-all ease-in-out z-30 " +
                    "active:bg-[#FF5F5F] hover:bg-[#FF5F5F] " +
                    (state.widget ? "w-11 h-11 mr-2 mb-2 md:w-12 md:h-12" : "w-14 h-14 md:w-16 md:h-16")}
                onClick={toggleWidget}
                style={{boxShadow: '0 4px 8px rgba(0,0,0,.4)'}}>
                {state.widget ? <KeyboardArrowDownIcon className="m-auto w-[70%] h-[70%] rotate-180"/> :
                    <div className="flex w-[66%] h-[66%] m-auto">

                        <Image
                            src={CoffeeCup}
                            alt="Coffee cup"
                        />

                    </div>
                }
            </ButtonBase>
            <div
                className={"fixed m-0 md:border-0 border-10 md:right-20 md:bottom-20 right-10 bottom-10 rounded-2xl shadow-xl z-10 " +
                    "transition-all duration-300 w-[90vw] md:w-[535px] ease-in-out bg-white overflow:hidden max-h-[90vh] "
                    + (state.widget ? "md:h-[830px] h-[90vh]" : "h-0 opacity-0")}>
                {
                    state.triggered ?
                        <iframe
                            className={"m-0 border-0 md:right-20 md:bottom-20 right-10 bottom-10 z-10 rounded-2xl " +
                                "transition-all duration-300 w-[90vw] md:w-[535px] ease-in-out bg-white overflow:hidden max-h-[90vh] " +
                                (state.widget ? "md:h-[830px] h-[90vh]" : "h-0 opacity-0")}
                            src={path}
                            title="Buy Me a Coffee"
                            id="donationFrame"/> : null
                }
            </div>
        </>
    );
};
export default BuyMeACoffeeWidget;
