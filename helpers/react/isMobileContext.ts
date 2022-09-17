import React, {useContext} from 'react'
const IsMobileContext = React.createContext({})
export const IsMobileProvider = IsMobileContext.Provider
export default function useIsMobile() {
    return useContext(IsMobileContext);
}
