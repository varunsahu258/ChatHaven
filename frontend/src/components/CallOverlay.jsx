// src/components/CallOverlay.jsx
import CallControls from "./CallControls";

const CallOverlay = ({ localStream, remoteStream, onEndCall }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center gap-4">
        <video
          ref={(video) => {
            if (video && remoteStream) video.srcObject = remoteStream;
          }}
          autoPlay
          playsInline
          className="w-full h-full rounded-xl object-cover"
        />
        <video
          ref={(video) => {
            if (video && localStream) video.srcObject = localStream;
          }}
          autoPlay
          muted
          playsInline
          className="absolute bottom-4 right-4 w-32 h-32 rounded-md border border-white object-cover"
        />
      </div>

      <CallControls onEndCall={onEndCall} />
    </div>
  );
};

export default CallOverlay;
