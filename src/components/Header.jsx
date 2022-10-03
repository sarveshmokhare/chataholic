import React, { useEffect, useState } from 'react'
import { Avatar, Box, Container, IconButton, Menu, MenuItem, Modal, Tooltip, Typography, LinearProgress } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#00c2b8',
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
    ['@media (max-width:992px)']: { // eslint-disable-line no-useless-computed-key
        width: 270,
    }
};



function Header() {
    const [loading, setLoading] = useState(false);

    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const [userAvatar, setUserAvatar] = useState("");
    const [userName, setUserName] = useState("");
    const userEmail = localStorage.getItem("userEmail").toString();
    // console.log(backendURL)
    // console.log(JSON.stringify({ userEmail }));
    useEffect(() => {
        function fetchUserData() {
            axios.get(`${backendURL}/api/user/getUserData/${userEmail}`)
                .then(res => {
                    // console.log(res.data);
                    setLoading(true);
                    setUserAvatar(res.data.avatar);
                    setUserName(res.data.name);
                    setLoading(false);
                    // console.log(userAvatar);
                })
                .catch(err => {
                    console.log(err);
                })
        }
        fetchUserData();
    }, [backendURL, userEmail])

    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [openModal, setOpenModal] = React.useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    // console.log(userName);
    return (
        <div className='first-container'>
            {loading && <LinearProgress sx={{ position: "fixed", top: 0, right: 0, left: 0 }} />}
            <Container
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "13vh",
                    minWidth: "100%",
                    color: "white",
                }}
            >
                <div></div>
                <Typography
                    variant='h2'
                    sx={{
                        fontFamily: "'Barlow', sans-serif",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "50px",
                    }}
                    onClick={() => { navigate("/chats"); }}
                >
                    Chataholic
                </Typography>

                <Tooltip title="Account">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2, color: "#fff" }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar
                            sx={{ width: 32, height: 32 }}
                            alt="profile-pic"
                            src={userAvatar}
                        >
                            M
                        </Avatar>
                    </IconButton>
                </Tooltip>

                <StyledMenu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.4))',
                            backgroundColor: "#cbfff7",
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem sx={{ fontSize: "15px" }} onClick={handleOpenModal} >
                        Profile
                    </MenuItem>
                    <MenuItem sx={{ fontSize: "15px" }} onClick={() => {
                        navigate("/");
                        localStorage.clear();
                    }} >
                        Logout
                    </MenuItem>
                </StyledMenu>

                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <CloseIcon
                            sx={{
                                position: "absolute",
                                right: "15px",
                                top: "15px",
                                color: "white",
                                "&:hover": {
                                    color: "#c6c6c6",
                                },
                                cursor: "pointer",
                            }}
                            onClick={handleCloseModal}
                        />
                        <Container
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}
                        >
                            <Typography variant="h3" color="#e2fffa" >
                                {userName}
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                                <Avatar
                                    sx={{ width: 150, height: 150 }}
                                    alt="profile-pic"
                                    src={userAvatar}
                                />
                            </Typography>
                            <br />
                            <Typography variant='h6' color="#e2fffa" >
                                Email: {userEmail}
                            </Typography>
                        </Container>
                    </Box>
                </Modal>
            </Container>
        </div >
    )
}

export default Header