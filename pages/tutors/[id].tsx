import {NextRouter, withRouter} from "next/router";
import React, {Component} from "react";
import {Session} from "next-auth";
import TutorImage from '../../images/tutor.png'
import Image from "next/image";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {styled} from "@mui/material/styles";
import {alpha, SliderProps, withStyles} from "@mui/material";


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

// const SuccessSlider = styled(Slider)<SliderProps>(({ theme }) => ({
//     width: 300,
//     color: theme.palette.success.main,
//     '& .MuiSlider-thumb': {
//         '&:hover, &.Mui-focusVisible': {
//             boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.success.main, 0.16)}`,
//         },
//         '&.Mui-active': {
//             boxShadow: `0px 0px 0px 14px ${alpha(theme.palette.success.main, 0.16)}`,
//         },
//     },
// }));
//
// const TabStyle = withStyles((theme:any) => ({
//     root: {
//         padding: '1rem 0',
//         textTransform: 'none',
//         fontWeight: theme.typography.fontWeightRegular,
//         fontSize: '1.2rem',
//         fontFamily: [
//             '-apple-system',
//             'BlinkMacSystemFont',
//             'Roboto',
//         ].join(','),
//         '&:hover': {
//             backgroundColor: '#004C9B',
//             color: 'white',
//             opacity: 1,
//         },
//         '&$selected': {
//             backgroundColor: '#004C9B',
//             color: 'white',
//             fontWeight: theme.typography.fontWeightMedium,
//         },
//     },
//     tab: {
//         padding: '0.5rem',
//         fontFamily: 'Open Sans',
//         fontSize: '2rem',
//         backgroundColor: 'grey',
//         color: 'black',
//         '&:hover': {
//             backgroundColor: 'red',
//             color: 'white',
//             opacity: 1,
//         },
//     },
//     selected: {},
// })
// // ((props) => <Tab {...props} />)

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


function Tutor() {

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    // constructor(props: any) {
    //     super(props);
    //     this.state = {id: ''};
    // }
    //
    // static getDerivedStateFromProps(props: any, state: any) {
    //     return {...state, id: props.router.query.id};
    // }

    // bg-white bg-opacity-[36%]
    // ID: {this.state.id}
    return (
        <>
            <div className="w-full greenBox mt-2">
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth"
                          TabIndicatorProps={{style: {background: 'white'}}}>
                        <Tab label={
                            <>
                                <div></div>
                                <span className="text-black text-3xl font-[Montserrat] normal-case">Профиль</span>
                            </>
                        } {...a11yProps(0)}
                        />
                        <Tab label="Item Two" {...a11yProps(1)} />
                        <Tab label="Item Three" {...a11yProps(2)} />
                        <Tab label="Item Three" {...a11yProps(3)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    {value == 0 ?
                        <>
                            <div className="ml-auto mr-3 w-[27%] greenBox">
                                <div><Image
                                    src={TutorImage}
                                    alt="Picture of the author"
                                    quality={100}
                                    objectFit="cover"
                                    placeholder="blur"
                                /></div>
                            </div>
                            {console.log(0)}
                        </> :
                        <></>}
                </TabPanel>
                <TabPanel value={value} index={1}>
                    {value == 1 ? <>Item One {console.log(1)}</> : <></>}
                </TabPanel>
                <TabPanel value={value} index={2}>
                    {value == 2 ? <>Item One {console.log(2)}</> : <></>}
                </TabPanel>
                <TabPanel value={value} index={3}>
                    {value == 3 ? <>Item One {console.log(3)}</> : <></>}
                </TabPanel>
            </div>
        </>);

}

export default Tutor;



