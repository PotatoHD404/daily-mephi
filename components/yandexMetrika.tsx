import {Component} from "react";
import Image from "next/image";
// import Script from "next/script";

export default class MetricContainer extends Component {
    render() {
        return <>
            <script
                dangerouslySetInnerHTML={{
                    __html: `<!-- Yandex.Metrika counter -->
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(89495681, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });

<!-- /Yandex.Metrika counter -->
        `
                }}/>
            <noscript>
                <div><Image src="https://mc.yandex.ru/watch/89495681" style={{position: "absolute", left: "-9999px"}}
                          alt="" width={1} height={1}/>
                </div>
            </noscript>
        </>
    }
}
