import React, { useEffect, useState } from 'react'
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import { Modal } from '@mui/material';


import "./chatBox.css"

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const backendURL = process.env.REACT_APP_BACKEND_URL;

function ChatBox(props) {
  const socket = props.socket;
  const roomID = props.roomID;
  const userID = props.userID;
  const userData = props.userData;
  const messages = props.roomMessages;
  const roomData = props.roomData;
  const setRoomData = props.setRoomData;
  // const roomSelected = props.roomSelected;
  // const setRoomSelected = props.setRoomSelected;
  // setMessages(props.roomMessages);
  // const messages = props.roomMessages;
  // const [senderData, setSenderData] = useState();

  useEffect(() => {
    // console.log("entered here");
    socket.on("newMsg", (newMsgData) => {
      axios
        .get(`${backendURL}/api/user/getUserData/byID/${newMsgData.userId}`)
        .then(res => {
          // console.log(senderData);
          const msg = {
            content: newMsgData.content,
            room: newMsgData.roomId,
            sender: res.data,
          }
          // console.log(msg);
          props.setMessages([...messages, msg]);
        })
        .catch(err => {
          console.log(err);
        })
      // console.log("entered socket");
      // console.log(newMsgData);
    })

    const chatWindow = document.getElementById("parent-chatbox");
    chatWindow.scrollTop = chatWindow.scrollHeight;
  })

  // console.log(messages);

  const userEmail = localStorage.getItem("userEmail");
  // console.log(userEmail);
  // const userMessages = document.getElementsByClassName("msg-content");
  // console.log(userMessages);

  const [message, setMessage] = useState("");
  function submitMsgHandler(e) {
    e.preventDefault();

    const dataToBeSend = {
      content: message,
      roomId: roomID,
      userId: userID,
    }
    // console.log(dataToBeSend);

    axios
      .post(`${backendURL}/api/message/send`, dataToBeSend)
      .then(res => {
        // console.log(res);
      })
      .catch(err => {
        console.log(err);
      })

    // console.log(userData);
    const msgToBeAppendedInMessagesArray = {
      content: message,
      room: roomID,
      sender: userData.data,
    }
    props.setMessages([...messages, msgToBeAppendedInMessagesArray]);
    // console.log([...messages, dataToBeSend]);
    socket.emit("newMessage", dataToBeSend);
    setMessage("");
  }
  // console.log(props);
  // console.log(message);

  function leaveRoomHandler() {
    axios
      .put(`${backendURL}/api/chatRoom/removeUser`, { userID, roomCode: roomData.roomCode })
      .then(res => {

        props.setRooms(() => {
          return props.rooms.filter(room => {
            return room.roomCode !== roomData.roomCode;
          })
        })

        props.setMessages([]);
        setRoomData();
      })
  }

  const [members, setMembers] = useState();
  function viewMembersHandler() {
    axios
      .get(`${backendURL}/api/chatRoom/users/room/${roomData.roomCode}`)
      .then(res => {
        setMembers(res.data);
      })
      .catch(err => {
        console.log(err);
      })

    handleOpen();
  }

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div id='parent-chatbox'>

      <div className="chat-box" >
        {roomData && <div className='chatbox-header' >
          <h3>{capitalizeFirstLetter(roomData.roomName)}</h3>
          <div className='buttons-container'>
            <button className='chat-box-buttons' style={{ color: "#00c2b8" }} onClick={viewMembersHandler} type="button" >Members</button>
            <button className='chat-box-buttons' style={{ color: "#e61a23" }} onClick={leaveRoomHandler} type="button" >Leave Room</button>
          </div>
        </div>}

        {messages.map((msg, ind) => {
          return (
            <div style={{ display: "flex", textAlign: (userEmail === msg.sender.email) ? "right" : "left", flexDirection: (userEmail === msg.sender.email) ? "row-reverse" : "row" }} key={ind} >
              {userEmail === msg.sender.email ? null : <div className='img-holder'><img alt="avatar" src={msg.sender.avatar} /></div>}
              <div className='msg-box' >
                {userEmail === msg.sender.email ? null : <h4>{capitalizeFirstLetter(msg.sender.name)}:</h4>}
                <p>{msg.content}</p>
              </div>
            </div>
          )
        })}

      </div>
      {roomData && <form onSubmit={submitMsgHandler} autoComplete='off'>
        <input
          placeholder="Message"
          name='message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        >
        </input>
        <button type="submit"><SendIcon /></button>
      </form>}

      {/* View chat room members modal code */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className='view-room-members-modal'>
          <h1>Members</h1>
          {members && members.map((member, ind) => {
            return (
              <div className='member' key={ind}>
                <div className='member-img-holder'><img alt="avatar" src={member.avatar} /></div>
                <p style={{ fontSize: "20px" }}>{member.name}</p>
                <p>{member.email}</p>
              </div>
            )
          })}
        </div>
      </Modal>
    </div>
  )
}

export default ChatBox