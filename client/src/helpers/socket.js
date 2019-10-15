import socketIOClient from "socket.io-client";

const socket = socketIOClient("http://localhost:5001/");
socket.emit("send-userName", localStorage.getItem("user_name"));

export default socket;
