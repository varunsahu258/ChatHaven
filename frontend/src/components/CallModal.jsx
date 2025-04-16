import { Phone, PhoneOff, Video } from "lucide-react";

const CallModal = ({ caller, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-xl shadow-lg text-center space-y-4 max-w-sm w-full">
        <h2 className="text-xl font-semibold">Incoming Call</h2>
        <p className="text-base-content/70">{caller.fullName} is calling you...</p>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={onReject}
            className="btn btn-circle btn-error"
            title="Reject"
          >
            <PhoneOff />
          </button>
          <button
            onClick={onAccept}
            className="btn btn-circle btn-success"
            title="Accept"
          >
            <Video />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
