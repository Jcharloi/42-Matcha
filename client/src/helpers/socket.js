import socketIOClient from "socket.io-client";

const socket = socketIOClient("http://localhost:5001/");

export default socket;
