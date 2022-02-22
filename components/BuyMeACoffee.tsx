import React, {useState} from "react";
import CoffeeCup from '../images/coffee.svg'
import Image from "next/image";

const BuyMeACoffeeWidget = () => {
    const [widget, setWidget] = useState(false)

    const toggleWidget = () => {
        setWidget(!widget)
    }

    const path = `https://www.buymeacoffee.com/widget/page/${process.env.NEXT_PUBLIC_BUY_ME_A_COFFEE_USERNAME}?description=Support%20me%20on%20Buy%20me%20a%20coffee!&color=%235F7FFF`;

    return (
        <>
            <button className={"flex align-middle justify-center w-16 h-16 bg-cyan-300 text-white rounded-full fixed " +
                "right-10 bottom-10 duration-200 transition-all ease-in-out z-30 " +
                (widget ? "scale-[80%]" : "")} onClick={toggleWidget}
                    style={{boxShadow: '0 4px 8px rgba(0,0,0,.4)'}}>
                <div className="flex w-[80%] h-[80%] m-auto">
                    <Image
                        src={CoffeeCup}
                        alt="Coffee cup"
                    />
                </div>
            </button>

            <iframe className={"fixed m-0 border-0 right-40 bottom-52 rounded-2xl shadow-xl z-50 " +
                "transition-all duration-300 ease-in-out bg-white " + (widget ? "h-[560px]" : "h-0 opacity-0")}
                    src={path}
                    title="Buy Me a Coffee"/>
        </>

    );
};
export default BuyMeACoffeeWidget;