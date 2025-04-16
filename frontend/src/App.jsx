import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import CallModal from "./components/CallModal";
import CallOverlay from "./components/CallOverlay";
import { useCallStore } from "./store/useCallStore";

import Register from "./register";


const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  const {
    isReceivingCall,
    isInCall,
    callerInfo,
    localStream,
    remoteStream,
    acceptCall,
    endCall,
  } = useCallStore();
  
  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  
  return (
    <div data-theme={theme}>
      <Navbar />
      {isReceivingCall && (
  <CallModal
    caller={callerInfo}
    onAccept={acceptCall}
    onReject={endCall}
  />
)}

{isInCall && (
  <CallOverlay
    localStream={localStream}
    remoteStream={remoteStream}
    onEndCall={endCall}
  />
)}

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={authUser ? "/" : "/login"} />} />
      </Routes>
      <Register onSuccess={(username) => console.log("Registered as", username)} />


      <Toaster />
    </div>
  );
};
export default App;
