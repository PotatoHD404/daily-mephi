import {useCallback, useEffect, useState} from "react";

export const useMediaQuery = (width: any) => {
    const [targetReached, setTargetReached] = useState(false);

    const updateTarget = useCallback((e: { matches: any; }) => {
        // console.log(e.matches)
        setTargetReached(e.matches);
    }, []);

    useEffect(() => {
        const media = window.matchMedia(`(max-width: ${width}px)`);
        media.addEventListener("change", updateTarget)

        // Check on mount (callback is not called until a change occurs)
        if (media.matches) {
            setTargetReached(true);
        }
        //
        // return () => media.removeEventListener("change", updateTarget);
    }, []);

    return targetReached;
};
