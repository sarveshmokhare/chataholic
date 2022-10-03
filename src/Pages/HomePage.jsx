import React, {useEffect} from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

const HomePage = () => {

  const navigate = useNavigate();

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      if(user){
        navigate("/chats");
      }
      else{
        navigate("/");
      }
    }, [navigate])

  return(
    <div>
      <Navigate to="/login" replace={true} />
    </div>
  )
}

export default HomePage