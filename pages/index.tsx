import React, {Component} from "react";
import withSession from "components/withSession";
import {Session} from "next-auth";
import SEO from "components/seo";
import Image from 'next/image'
import Logo from 'images/logo.svg'
import MiniCat from 'images/minicat.svg'

import SearchIcon from '@mui/icons-material/Search';
// import BuyMeACoffee from "components/buyMeCoffee";
import {Input} from "@mui/material";
import {styled} from "@mui/material/styles";


export const StyledInput = styled(Input)(() => ({
    width: '100%',
    fontSize: '1.65rem',
    fontFamily: 'Montserrat',
    marginLeft: '0.5rem'
}));

function SearchBar() {
    return <div className="bg-transparent flex border-2
                                             border-black align-middle
                                             rounded-full flex-row h-14 w-[80%]">
        <SearchIcon style={{color: "black"}} className="scale-125 my-auto ml-5 mr-1"/>
        <StyledInput
            placeholder="Поиск"
            inputProps={{"aria-label": "Поиск"}}
            disableUnderline
        />
    </div>;
}

function LogoText() {
    return <div className="text-[6.25vw] -ml-1 -my-10 flex font-bold flex-nowrap">
        <div className="flex h-fit w-[4vw] mt-[4vw] justify-center pl-[0.8vw] z-0">
            <Image src={MiniCat} alt="mini cat"
                   className="flex scale-95 active:scale-110 transition ease-in-out duration-300"
                // layout="responsive"
            />

        </div>

        <div className="-ml-[4vw] z-10 mt-1.5 pointer-events-none">Daily MEPhi</div>
    </div>;
}

class Home extends Component<{ session: Session }> {


    constructor(props: any) {
        super(props);
    }


    async componentDidMount() {
        const input = document.querySelector("input");
        input?.focus();
        input?.select();
    }


    render() {
        return (
            <>
                <SEO/>

                <div className="flex grid-cols-12 grid pb-12 h-auto">
                    <div className="flex col-start-2 col-end-13 content-between items-center gap-4">
                        <div
                            className="items-center justify-start flex flex-wrap w-[42.8%] h-[50%]  mt-[6.5%]">

                            <LogoText/>
                            {/*<div className="ml-3"></div>*/}

                            <h1 className="flex text-4xl mt-8 row-start-3 row-end-4 pb-3">Lorem ipsum dolor sit amet,
                                consectetur adipisicing elit. Animi officia quae quia suscipit? Animi aspernatur autem
                                doloribus eos error.
                            </h1>
                            <SearchBar/>
                        </div>

                        <div className="flex justify-center w-[50%]  mt-[4.5%]">
                            <Image src={Logo} alt="Big logo"/>
                        </div>
                    </div>
                </div>
                {/*<BuyMeACoffee/>*/}
            </>
        )
    }
}


export default withSession(Home);