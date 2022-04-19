import React, {Component} from "react";
import {Tutor} from "../lib/models";
import withSession from "../components/withSession";
import {Session} from "next-auth";
import SEO from "../components/seo";
import Image from 'next/image'
import Logo from '../images/logo.svg'
import MiniCat from '../images/minicat.svg'

import SearchIcon from '@mui/icons-material/Search';
import BuyMeACoffee from "../components/buyMeCoffee";
import {Input} from "@mui/material";
import {styled} from "@mui/material/styles";

//https://next-auth.js.org/configuration/options
// className="btn inline-block p-4 border-2 border-black leading-tight"


export const StyledInput = styled(Input)(() => ({
    width: '100%',
    fontSize: '1.65rem',
    fontFamily: 'Montserrat',
    marginLeft: '0.5rem'
}));

class Home extends Component<{ session: Session }> {


    constructor(props: any) {
        super(props);
    }


    async componentDidMount() {
        const input = document.querySelector("input");
        input?.focus();
        input?.select();
        let data: Tutor = {
            id: 'string',
            name: 'string',
            old_rating: {
                character: -5,
                count: 1000,
                exams: -5,
                quality: 5
            },
            description: 'string',
            image: 'string',
            url: 'string',
            since: new Date(),
            updated: new Date(),
            disciplines: [],
            faculties: []
        };

        // console.log(db);
        // await enableIndexedDbPersistence(db);

        // console.log('1');
        // await addDoc(col(db, 'tutors'), data);
    }


    render() {
        return (
            <>
                <SEO/>

                <div className="flex grid-cols-12 grid pb-12 h-auto">
                    <div className="flex col-start-2 col-end-13 content-between items-center gap-4">
                        <div
                            className="items-center justify-start flex flex-wrap w-[42.8%] h-[50%]  mt-[6.5%]">

                            <div className="text-[6.25vw] -ml-1 -my-10 flex font-bold flex-nowrap">
                                <div className="flex h-fit w-[4vw] mt-[4vw] justify-center pl-[0.8vw] z-0">
                                    <Image src={MiniCat} alt="mini cat"
                                           className="flex scale-95 active:scale-110 transition ease-in-out duration-300"
                                        // layout="responsive"
                                    />

                                </div>

                                <div className="-ml-[4vw] z-10 mt-1.5 pointer-events-none">Daily MEPhi</div>
                            </div>
                            {/*<div className="ml-3"></div>*/}

                            <h1 className="flex text-4xl mt-8 row-start-3 row-end-4">Lorem ipsum dolor sit amet,
                                consectetur adipisicing elit. Animi officia quae quia suscipit? Animi aspernatur autem
                                doloribus eos error.
                            </h1>
                            <div className="bg-transparent flex border-2
                                             border-black align-middle
                                             rounded-full flex-row h-14 w-[80%]">
                                <SearchIcon style={{color: 'black'}} className="scale-125 my-auto ml-5 mr-1"/>
                                <StyledInput
                                    placeholder="Поиск"
                                    inputProps={{'aria-label': 'Поиск'}}
                                    disableUnderline
                                />
                            </div>
                        </div>

                        <div className="flex justify-center w-[50%]  mt-[4.5%]">
                            <Image src={Logo} alt="Big logo"/>
                        </div>
                    </div>
                </div>
                <BuyMeACoffee/>
            </>
        )
    }
}


export default withSession(Home);


//        if (this.props.session) {
//
//             return (
//                 <>
//                     Signed in as {this.props.session.user?.name ?? 'wha'} <br/>
//                     <button onClick={() => signOut()}>Sign out</button>
//                 </>
//             )
//         }
//         return <>
//             Not signed in <br/>
//             <button onClick={(e) => {
//                 e.preventDefault()
//                 signIn().then(() => {
//                 })
//             }}>Sign in
//             </button>
//         </>;