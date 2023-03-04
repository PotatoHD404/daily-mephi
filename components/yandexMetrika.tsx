import {Component} from "react";
import Image from "next/image";
import Script from "next/script";

export default class MetricContainer extends Component {
    render() {
        return <>
            <Script type="text/javascript" src="/metrika.js"></Script>
            <noscript>
                <div><Image src="https://mc.yandex.ru/watch/89495681" style={{position: "absolute", left: "-9999px"}}
                            alt="" width={1} height={1}/>
                </div>
            </noscript>
        </>
    }
}
