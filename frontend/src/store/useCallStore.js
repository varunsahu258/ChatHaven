// src/store/useCallStore.js
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export const useCallStore = create((set, get) => ({
  isReceivingCall: false,
  isInCall: false,
  callerInfo: null,
  calleeInfo: null,

  localStream: null,
  remoteStream: null,
  peerConnection: null,

  // Call incoming
  receiveCall: ({ from, offer, caller }) => {
    set({ isReceivingCall: true, callerInfo: caller, offer });
  },

  // Accept incoming call
  acceptCall: async () => {
    const { socket, authUser } = useAuthStore.getState();
    const { offer, callerInfo } = get();

    const peer = new RTCPeerConnection({ iceServers: [ { urls: "stun:stun.l.google.com:19302" } ] });
    set({ peerConnection: peer });

    // Set local media
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStream.getTracks().forEach((track) => peer.addTrack(track, localStream));
    set({ localStream });

    // Handle incoming remote tracks
    const remoteStream = new MediaStream();
    peer.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
    };
    set({ remoteStream });

    // Handle ICE candidates
    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          to: callerInfo._id,
          candidate: e.candidate,
        });
      }
    };

    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("accept-call", {
      to: callerInfo._id,
      answer,
    });

    set({ isInCall: true, isReceivingCall: false });
  },

  // Start a new call (as caller)
  startCall: async (callee) => {
    const { socket, authUser } = useAuthStore.getState();

    const peer = new RTCPeerConnection({ iceServers: [ { urls: "stun:stun.l.google.com:19302" } ] });
    set({ peerConnection: peer, calleeInfo: callee });

    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStream.getTracks().forEach((track) => peer.addTrack(track, localStream));
    set({ localStream });

    const remoteStream = new MediaStream();
    peer.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
    };
    set({ remoteStream });

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          to: callee._id,
          candidate: e.candidate,
        });
      }
    };

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.emit("call-user", {
      to: callee._id,
      offer,
      caller: authUser,
    });

    set({ isInCall: true });
  },

  // Accept remote answer (as caller)
  setRemoteAnswer: async (answer) => {
    const peer = get().peerConnection;
    await peer.setRemoteDescription(new RTCSessionDescription(answer));
  },

  // Handle ICE from remote
  addIceCandidate: (candidate) => {
    const peer = get().peerConnection;
    if (peer) peer.addIceCandidate(new RTCIceCandidate(candidate));
  },

  // End the call
  endCall: () => {
    const { socket, authUser } = useAuthStore.getState();
    const { callerInfo, calleeInfo, localStream, peerConnection } = get();

    const targetUserId = callerInfo?._id || calleeInfo?._id;
    if (targetUserId) socket.emit("end-call", { to: targetUserId });

    if (peerConnection) peerConnection.close();
    if (localStream) localStream.getTracks().forEach((track) => track.stop());

    set({
      isInCall: false,
      isReceivingCall: false,
      callerInfo: null,
      calleeInfo: null,
      peerConnection: null,
      localStream: null,
      remoteStream: null,
    });
  },
}));
