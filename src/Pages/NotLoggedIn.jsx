import React from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Typography } from '@mui/material';


import NotLoggedInImg from "../images/Startled-bro.svg";

function NotLoggedIn() {
    const navigate = useNavigate();
    return (
        <Container maxWidth="xl"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                color: "white",
            }}
        >

            <Typography
                variant='h3'
                sx={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: "bold",
                    margin: "20px 0 10px 0",
                    cursor: "pointer",
                }}
                onClick={() => { navigate("/"); }}
            >
                Chataholic
            </Typography>
            <img className='not-found-img' alt='not-found' src={NotLoggedInImg} />

            <Typography variant='h6'>You are not logged in. Click below button to log in.</Typography>
            <br />

            <button className='signup-button' onClick={() => { navigate("/login"); }}>Login</button>

            {/* <a href="https://storyset.com/people">People illustrations by Storyset</a> */}
        </Container>
    )
}

export default NotLoggedIn