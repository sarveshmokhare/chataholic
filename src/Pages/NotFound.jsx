import React from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Typography } from '@mui/material';


import NotFoundImg from "../images/PageNotFound.svg";

function NotFound() {
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
            <img className='not-found-img' alt='not-found' src={NotFoundImg} />

            <button className='signup-button' onClick={() => { navigate("/login"); }}>Go Home</button>
        </Container>
    )
}

export default NotFound