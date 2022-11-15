import React, { useState } from 'react'
import { Container, Typography, Snackbar, Alert as MuiAlert, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

import ChatImg from '../images/chat_app_img.svg';

import "../Pages/HomePage.css";

// For linearProgress
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const HomePage = () => {
    const navigate = useNavigate();

    // For snacks
    const [snackOpen, setSnackOpen] = useState(false);
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    function snackHandler(t, m) {
        setType(t);
        setMessage(m);
        setSnackOpen(true);
    }
    function handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
        setLoading(false);
    };
    // Snacks code ends

    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function submitHandler(e) {
        e.preventDefault();
        // console.log(process.env.REACT_APP_BACKEND_URL + "/api/user/auth");
        setLoading(true);

        // console.log(email, password);
        axios
            .post(process.env.REACT_APP_BACKEND_URL + "/api/user/auth", { email, password })
            .then(res => {
                // console.log(res.data.email);
                snackHandler("success", "Signing you in...");
                // console.log(res.data);
                localStorage.setItem("userEmail", res.data.email);
                setLoading(false);
                navigate("/chats", { state: { email } });
            })
            .catch(err => {
                console.log(err);
                snackHandler("error", "Invalid email or password!");
            })

    }

    return (
        <div>
            {loading && <LinearProgress sx={{ position: "fixed", top: 0, right: 0, left: 0 }} />}

            <Container maxWidth="xl"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
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

                <img alt='chat-img' src={ChatImg}></img>

                <Snackbar open={snackOpen} autoHideDuration={5000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>

                <Typography variant='h5'>
                    Login
                </Typography>

                <form onSubmit={submitHandler} method="post">
                    <Container
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <input
                            placeholder="Email Address"
                            name='email'
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email"
                        >
                        </input>
                        <input
                            placeholder="Password"
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                        >
                        </input>
                        <button>Sign in</button>
                    </Container>
                </form>


                <br />

                <Typography color={"#055bcb"} fontSize={14} >Don't have an account?</Typography>
                <button className='signup-button' onClick={() => { navigate("/create"); }}>Create Account</button>
            </Container>
        </div>

    )
}

export default HomePage