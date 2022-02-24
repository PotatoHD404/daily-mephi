import React from "react";
import SEO from "../../components/seo";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {a11yProps} from "../../lib/frontend/utils";
import Image from "next/image";
import MiniCat from "../../images/minicat_transparent.svg";
import LikeIco from "../../images/like.svg";
import CommentIco from "../../images/comment.svg";
import Comment from "../../components/comment";
import ProfileIco from "../../images/profile3.png";
import GoldenCrown from "../../images/golden_crown.svg";
import SilverCrown from "../../images/silver_crown.svg";
import BronzeCrown from "../../images/bronze_crown.svg";
import SearchIcon from "@mui/icons-material/Search";
import {styled} from "@mui/material/styles";
import {Input} from "@mui/material";



export const StyledInput = styled(Input)(() => ({
    width: '100%',
    fontSize: '1.2rem',
    fontFamily: 'Montserrat',
    marginLeft: '0.5rem'
}));


function Tutors() {


    return (
        <>
            <SEO title={'Преподаватели'}/>
            <div className="flex-wrap w-full">
                <div className="text-[1.7rem] mt-[0.5rem] h-[3rem] text-center">Преподаватели</div>
                <div className="w-full h-[1px] bg-black bg-opacity-10 mb-4"/>
                <div className="flex w-full justify-between">
                    <div className="w-[75%]">
                        <div className="rounded-2xl p-6 text-[1.7rem] bg-white bg-opacity-90">
                            <table className="table-auto w-full">
                                <thead>
                                <tr>
                                    <th className="font-medium">#</th>
                                    <th className="text-left pl-4 font-medium">Имя</th>
                                    <th className="font-medium">Рейтинг</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="text-center">1</td>
                                    <td>
                                        <div className="flex pl-4 h-[4.5rem]">
                                            <div className="h-14 my-auto w-14 flex">
                                                <Image
                                                    src={ProfileIco}
                                                    alt="Profile pic"
                                                    className="rounded-full"
                                                />
                                                <div className="h-8 my-auto w-8 absolute ml-[2rem] -mt-[0.85rem]">
                                                    <Image
                                                        src={GoldenCrown}
                                                        alt="Golden crown"
                                                        className="rounded-full"
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-[0.8rem] h-fit my-auto ml-2">Burunduk</div>
                                        </div>
                                    </td>
                                    <td className="text-center">3.1 K</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="w-[23.5%]">
                        <div
                            className="bg-transparent flex border-2
                                             border-black align-middle
                                             rounded-full flex-row h-8 w-[80%]">
                            <SearchIcon style={{color: 'black'}} className="scale-125 my-auto ml-5 mr-1"/>
                            <StyledInput
                                placeholder="Поиск"
                                inputProps={{'aria-label': 'Поиск'}}
                                disableUnderline
                            />
                        </div>
                        <div
                            className="rounded-2xl pt-6 pb-4 px-3.5 text-[1.25rem] w-full bg-white bg-opacity-90 flex-wrap space-y-5
                    text-[#5B5959]">

                            tmp
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}

export default Tutors;



