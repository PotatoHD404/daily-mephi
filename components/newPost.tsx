import UserHeader from "./userHeader";
import React from "react";

export default function NewPost(props: { placeholder: string, onClick: () => void }) {
    return <div className="text-lg w-full whiteBox">
        <UserHeader name={"User1"}
                    date={"15 февраля 2022"}/>
        <textarea
            className="rounded-2xl appearance-none block w-full bg-gray-200 text-gray-700
                                        border focus:border-gray-200 p-3 focus:outline-none
                                        focus:bg-gray-100 focus:border-gray-500 transition-colors h-20 mb-3 resize-none
                                        text-[0.9rem] leading-6"
            placeholder={props.placeholder}
            onClick={props.onClick}/>
    </div>;
}
