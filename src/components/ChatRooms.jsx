import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { LinearProgress, Modal, Snackbar, Alert as MuiAlert } from '@mui/material';

import "./chatRooms.css"

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


function ChatRooms(props) {
  // For snacks
  const [snackOpen, setSnackOpen] = useState(false);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  function snackHandler(t, m) {
    setType(t);
    setMessage(m);
    setSnackOpen(true);
  }
  function handleSnackClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
    setLoading(false);
  };
  // Snacks code ends

  const backendURL = process.env.REACT_APP_BACKEND_URL;
  const [loading, setLoading] = useState(false);

  const socket = props.socket;
  const rooms = props.rooms;
  // console.log(rooms);


  function chatRoomHandler(roomID) {
    // console.log(roomID);
    props.clickedRoomID(roomID);
    // props.setRoomSelected(true);
    if (window.innerWidth <= 500) {
      document.querySelector(".chatrooms-box").style.display = "none";
      document.getElementById("parent-chatbox").style.display = "flex";
    }

    socket.emit("joinRoom", roomID);
  }

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openJoin, setOpenJoin] = React.useState(false);
  const handleOpenJoin = () => setOpenJoin(true);
  const handleCloseJoin = () => setOpenJoin(false);

  const [roomName, setRoomName] = useState("");
  const userID = props.userID;
  function createRoomHandler(e) {
    e.preventDefault();
    setLoading(true);

    let roomCode = Math.floor(1000 + Math.random() * 9000);
    try {
      if (rooms.find(room => room.roomCode === roomCode) !== undefined) {
        roomCode = Math.floor(1000 + Math.random() * 9000);
      }
      // console.log(roomCode);
    } catch (err) {
      console.log(err);
    }
    axios
      .post(`${backendURL}/api/chatRoom/create`, { userID, roomName, roomCode })
      .then(res => {
        // console.log(res);
        props.setRooms([...rooms, res.data]);
        setRoomName("");
        setLoading(false);
        setOpen(false);
      })
      .catch(err => {
        console.log(err);
        setRoomName("");
        setLoading(false);
        setOpen(false);
      })

  }

  const [roomCode, setRoomCode] = useState("");
  function joinRoomHandler(e) {
    e.preventDefault();
    setLoading(true);
    axios
      .put(`${backendURL}/api/chatRoom/addUser`, { userID, roomCode })
      .then(res => {
        // console.log(res);
        props.setRooms([...rooms, res.data]);
        setRoomCode("");
        setLoading(false);
        setOpenJoin(false);
      })
      .catch(err => {
        console.log(err);
        setRoomCode("");
        snackHandler("error", "Room with entered code doesn't exist.");
        setLoading(false);
        setOpenJoin(false);
      })
  }

  return (
    <div className='chatrooms-box' >
      {loading && <LinearProgress sx={{ position: "fixed", top: 0, right: 0, left: 0 }} />}

      <Snackbar open={snackOpen} autoHideDuration={5000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={type} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

      <div>
        <h3>Your Chat Rooms</h3>
        {rooms.map((room, ind) => {
          return (
            <div className='one-chat' key={room._id} onClick={() => chatRoomHandler(room._id)} >
              <h4>{capitalizeFirstLetter(room.roomName)}</h4>
              <p>Room Code: {room.roomCode}</p>
            </div>
          )
        })}
      </div>

      <div className='buttons'>
        <button onClick={handleOpen} >Create Chat Room</button>
        <button onClick={handleOpenJoin} >Join a Chat Room</button>
      </div>

      {/* Create Room Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className='create-room-modal'>
          <form>
            <input
              placeholder="Room Name"
              name='roomName'
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            >
            </input>

            <button onClick={createRoomHandler} type="submit" >Create the Chat Room</button>
          </form>
        </div>
      </Modal>

      {/* Join room from room code */}
      <Modal
        open={openJoin}
        onClose={handleCloseJoin}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className='create-room-modal'>
          <form>
            <input
              placeholder="Room Code"
              name='roomCode'
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            >
            </input>

            <button onClick={joinRoomHandler} type="submit" >Join the Chat Room</button>
          </form>
        </div>
      </Modal>
    </div>
  )
}

// ChatRooms.propTypes = {
//   /**
//    * Injected by the documentation to work in an iframe.
//    * You won't need it on your project.
//    */
//   window: PropTypes.func,
// };


export default ChatRooms