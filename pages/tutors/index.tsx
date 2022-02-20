import React, {Component} from "react";
import {Tutor} from "../../lib/backend/models";
import withSession from "../../components/withSession";
import {Session} from "next-auth";
import SEO from "../../components/seo";
import Image from 'next/image'
import Button from "@mui/material/Button";

import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';

//https://next-auth.js.org/configuration/options
// className="btn inline-block p-4 border-2 border-black leading-tight"


class Tutors extends Component<{ session: Session }> {

    constructor(props: any) {
        super(props);
    }


    async componentDidMount() {

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
                <SEO title={''} description={'what?'}/>

                <div className="flex grid-cols-12 grid">
                    <div className="flex col-start-2 col-end-13 content-between items-center gap-4">
                        <div
                            className="items-center justify-start flex flex-wrap w-[42.8%] h-[50%]  mt-[6.5%] greenBox">

                            <div className="text-[6.25vw] -ml-1 -my-10 flex font-bold flex-nowrap">


                                <div className="-ml-[4vw] z-10 mt-1.5 pointer-events-none">Daily MEPhi</div>
                            </div>
                            {/*<div className="ml-3"></div>*/}

                            <span className="flex text-4xl mt-8 row-start-3 row-end-4">Lorem ipsum dolor sit amet,
                                consectetur
                                adipisicing elit.
                                Animi officia quae quia suscipit? Animi aspernatur autem doloribus eos error.
                            </span>
                            <div

                                className="bg-transparent justify-center flex border-2
                                             border-black justify-center align-middle
                                             rounded-full flex-row h-10 w-[20rem] my-auto w-[25%]"
                            >
                                <SearchIcon style={{color: 'black'}} className="scale-125 my-auto ml-3 mr-1"/>
                                <InputBase
                                    placeholder="Поиск"
                                    inputProps={{'aria-label': 'Поиск'}}
                                    className="font-[Montserrat] text-[1.65rem]"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center w-[50%]  mt-[4.5%]">

                        </div>
                    </div>
                </div>

                {/*<Footer/>*/}
            </>
        )
    }
}


export default withSession(Tutors);


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