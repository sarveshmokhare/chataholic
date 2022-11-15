import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { LinearProgress } from '@mui/material'
import axios from 'axios';
import io from "socket.io-client";

import ChatRooms from '../components/ChatRooms';
import ChatBox from '../components/ChatBox';
import Header from '../components/Header';
import "./ChatPage.css";

const backendURL = process.env.REACT_APP_BACKEND_URL;
const socket = io(backendURL);;


function ChatPage() {
    const navigate = useNavigate();

    const userEmail = localStorage.getItem("userEmail");
    // console.log(typeof(userEmail));
    useEffect(() => {
        if (!userEmail) {
            navigate("/not-logged-in");
        }
        // console.log("entered useeffect");
    }, [navigate, userEmail]);

    // useEffect(() => {

    //     // socket.emit("join", userID);
    // }, [])

    const [rooms, setRooms] = useState([]);

    const [userData, setUserData] = useState();
    const [userID, setUserID] = useState();
    useEffect(() => {
        setLoading(true);
        axios
            .get(`${backendURL}/api/user/getUserData/${userEmail}`)
            .then(result => {
                // console.log(result);
                setUserData(result);
                setUserID(result.data._id);
                // console.log("userID set!");
                // console.log(userID);

                return result.data._id;
            })
            .then(info => {
                return axios
                    .get(`${backendURL}/api/chatRoom/users/${info}`)

            })
            .then(res => {
                // console.log(res.data);
                setRooms(res.data);
                setLoading(false);
            })

    }, []);

    const [roomMessages, setRoomMessages] = useState([]);
    const [roomID, setRoomID] = useState();
    const [roomData, setRoomData] = useState();
    function getClickedRoomID(roomID) {
        // console.log("from chat page", roomID);
        setRoomID(roomID);
        axios
            .get(`${backendURL}/api/message/${roomID}`)
            .then(res => {
                setRoomMessages(res.data);
            })
            .catch(err => {
                console.log(err);
            })

        axios
            .get(`${backendURL}/api/chatRoom/getRoomData/${roomID}`)
            .then(res=>{
                setRoomData(res.data);
            })
            .catch(err =>{
                console.log(err);
            })
    }
    // console.log(roomData);

    function getBackBtnHandler() {
        if (window.innerWidth <= 500) {
            document.getElementById("parent-chatbox").style.display = "none";
            document.querySelector(".chatrooms-box").style.display = "flex";
        }
    }
    // console.log(window.innerWidth);
    // console.log(roomMessages);
    // console.log(clickedRoomID);
    // console.log(rooms);
    // console.log(user);
    const [roomSelected, setRoomSelected] = useState(false)
    const [loading, setLoading] = useState(false)
    return (
        <div style={{ width: "100%" }}>
            {loading && <LinearProgress sx={{ position: "fixed", top: 0, right: 0, left: 0 }} />}

            {userEmail && <Header />}
            {(window.innerWidth <= 500) ? <button className='backtochat-btn' onClick={getBackBtnHandler} >Chat Rooms</button> : null}
            <div
                className='second-container'
            >
                {userEmail && <ChatRooms rooms={rooms} clickedRoomID={getClickedRoomID} userData={userData} userID={userID} setRooms={setRooms} socket={socket} roomSelected={roomSelected} setRoomSelected={setRoomSelected} />}
                {userEmail && <ChatBox roomMessages={roomMessages} roomID={roomID} userData={userData} userID={userID} setMessages={setRoomMessages} socket={socket} roomData={roomData} setRoomData={setRoomData} setRooms={setRooms} rooms={rooms} roomSelected={roomSelected} setRoomSelected={setRoomSelected} />}
            </div>


        </div>
    )
}

export default ChatPage