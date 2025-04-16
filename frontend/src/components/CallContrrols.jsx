// src/components/CallControls.jsx
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useState } from "react";

const CallControls = ({ onEndCall }) => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const toggleMic = () => setMicOn((prev) => !prev);
  const toggleCam = () => setCamOn((prev) => !prev);

  return (
    <div className="mt-6 flex gap-4">
      <button onClick={toggleMic} className="btn btn-circle">
        {micOn ? <Mic /> : <MicOff />}
      </button>
      <button onClick={toggleCam} className="btn btn-circle">
        {camOn ? <Video /> : <VideoOff />}
      </button>
      <button onClick={onEndCall} className="btn btn-circle btn-error">
        <PhoneOff />
      </button>
    </div>
  );
};

export default CallControls;
