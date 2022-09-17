import React from "react";
import SEO from "components/seo";
import Profile from "components/profile";
import ProfileSettings from "components/profileSettings";






function User() {

    return (
        <>
            <SEO title={'Пользователь PotatoHD'}/>
            <div className="flex-wrap w-full space-y-8">
                <Profile/>
            </div>
        </>
    );

}

export default User;
