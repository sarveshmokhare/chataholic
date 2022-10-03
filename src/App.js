import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage"
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ChatPage from "./Pages/ChatPage";
import NotFound from "./Pages/NotFound";
import NotLoggedIn from "./Pages/NotLoggedIn";

import './App.css';
import ChatProvider from "./Context/ChatProvider";

function App() {

  return (
    <div className="App">
      <ChatProvider>

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<Signup />} />
            <Route path="/chats" element={<ChatPage />} />
            <Route path="/not-logged-in" element={<NotLoggedIn />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </div>
  );
}

export default App;
