import React, { useEffect } from "react";
import SEO from "components/seo";
import Profile from "components/profile";
// import ProfileSettings from "components/profileSettings";






function User({changeNeedsAuth}: {changeNeedsAuth: (a: boolean) => void}) {
    useEffect(() => {   
        changeNeedsAuth(true);
        // window.onpopstate = () => changeNeedsAuth(true);
        }, []);
    return (
        <>
            <SEO title={'Профиль'}/>
            <div className="flex-wrap w-full space-y-8">
                <Profile/>
                {/*<ProfileSettings/>*/}
            </div>
        </>
    );

}

export default User;
