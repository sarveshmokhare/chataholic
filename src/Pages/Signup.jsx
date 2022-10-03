import React, { useState } from 'react'
import { Container, Typography, Snackbar, Alert as MuiAlert, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { UploadClient } from '@uploadcare/upload-client'

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

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        confirmedPassword: "",
        avatar: "",
    })

    function userDataHandler(e) {
        const { name, value } = e.target;

        setUserData(prevData => {
            return ({ ...prevData, [name]: value, })
        });
    }

    function imgHandler(e) {
        // console.log(e.target.files[0]);
        const img = e.target.files[0];
        console.log(process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
        console.log(img);
        if (img === undefined) {
            snackHandler("error", "Please upload an image");
            return;
        }

        const client = new UploadClient({ publicKey: '26142c26bdf508eb3a05' })
        setLoading(true);
        client
            .uploadFile(img)
            .then(res => {
                console.log(res.cdnUrl);
                setUserData(prevData => {
                    return ({ ...prevData, avatar: res.cdnUrl })
                });
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            })
    }
    // console.log(userData);
    
    function submitHandler(e) {
        e.preventDefault();
        setLoading(true);
        if(!userData.name || !userData.email || !userData.password || !userData.confirmedPassword){
            snackHandler("warning", "Please enter all the fields!");
            return;
        }

        if(userData.password !== userData.confirmedPassword){
            snackHandler("warning", "Passwords don't match!");
            return;
        }

        const formData = new FormData();
        formData.append("name", userData.name);
        formData.append("email", userData.email);
        formData.append("password", userData.password);
        formData.append("avatar", userData.avatar);
        console.log(formData);
        axios.post(process.env.REACT_APP_BACKEND_URL + "/api/user/add", formData)
            .then(res => {
                console.log(res);
                snackHandler("success", "Registration successfully!");
                setLoading(false);
                navigate("/login");
            })
            .catch(err => {
                console.log(err);
                snackHandler("error", "An error occured! Please use different credentials or refresh the page and try again.")
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
                    onClick={() => { navigate("/") }}
                >
                    Chataholic
                </Typography>

                <img alt='chat-img' src={ChatImg}></img>

                <Snackbar open={snackOpen} autoHideDuration={5000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>

                <Typography
                    variant='h5'
                >
                    Signup
                </Typography>

                <form onSubmit={submitHandler} method="post" encType="multipart/form-data" >
                    <Container maxWidth="lg"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <input
                            placeholder="Name"
                            name='name'
                            value={userData.name}
                            onChange={userDataHandler}
                        >
                        </input>
                        <input
                            placeholder="Email Address"
                            name='email'
                            value={userData.email}
                            onChange={userDataHandler}
                            type="email"
                        >
                        </input>
                        <input
                            placeholder="Password"
                            name='password'
                            value={userData.password}
                            onChange={userDataHandler}
                            type="password"
                        >
                        </input>
                        <input
                            placeholder="Confirm Password"
                            name='confirmedPassword'
                            value={userData.confirmedPassword}
                            onChange={userDataHandler}
                            type="password"
                        >
                        </input>
                        <Typography textAlign={"left"}>Upload Avatar:</Typography>
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={imgHandler}
                        />
                        <button type='submit'>Create Account</button>
                    </Container>
                </form>

                <br />

                <Typography color={"#055bcb"} fontSize={14} >Already have an account?</Typography>
                <button className='signup-button' onClick={() => { navigate("/login") }}>Login</button>

            </Container>
        </div>
    )
}

export default HomePage