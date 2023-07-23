import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");

function Chat({ username }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [conversations, setConversations] = useState([]);

  const joinRoom = () => {
    if (username!=="" && roomName !== "") {
      socket.emit('joinRoom', { username, roomName });
    }
  };

  useEffect(() => {
    // Listen for joined rooms event
    socket.on('joinedRooms', (rooms) => {
      setJoinedRooms(rooms);
    });

    socket.on('roomInfo',(roominfo)=>{
      console.log("room info",roominfo);
    })

    // Clean up when component unmounts
    return () => {
      socket.off('joinedRooms');
    };
  }, []);

  useEffect(()=>{
    console.log(joinedRooms)
  },[joinedRooms]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        roomName: roomName,
        username: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("sendMessage", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  const handleLoadChat = (selectedRoom) => {
    // Fetch chat history for the selected room from saved conversations
    const chatHistory = conversations.find((conversation) => conversation.room === selectedRoom);
    // Display the chat history
    console.log(chatHistory);
  };

  useEffect(() => {
    socket.on("newMessage", ({ roomName, username, message, time }) => {
      setMessageList((list) => [...list, {roomName:roomName, username:username, message:message, time:time}]);
    });
    // eslint-disable-next-line
  }, [socket]);

  useEffect(() => {
    socket.on('message', (data) => {
      setConversations((prevConversations) => [...prevConversations, data]);
    });
  }, []);

  return (
    <div className="chat-window w-full h-full bg-white">
      <div className="flex gap-2 w-full h-full divide-x">
        <div className="chat-sidebar basis-1/3 flex flex-col divide-y">
          <div className="chat-header p-3">
            <p className="text-xl text-black font-black">Rooms</p>
          </div>
          <div className="flex gap-3 p-3">
            <input
              onChange={(event) => {
                setRoomName(event.target.value);
              }}
              className="input input-bordered input-accent w-full"
              placeholder="Room Name"
            />
            <button
              className="btn btn-primary rounded-lg text-xl"
              onClick={joinRoom}
            >
              +
            </button>
          </div>
          <div className="chat-rooms bg-white p-3">
            <ul className="flex flex-col gap-3">
              {joinedRooms.map((room, key) => (
                <li key={key}>
                  <button className="btn btn-accent w-full" onClick={() => handleLoadChat(room.name)}>{room.name}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="chat-rest basis-2/3 w-full h-full flex flex-col divide-y">
          <div className="chat-header p-3">
            <p className="text-xl text-black font-black">Room Name</p>
          </div>
          <div className="chat-body w-full h-full flex flex-col justify-end">
            <ScrollToBottom className="message-container overflow-y-auto max-h-[600px] p-3 flex flex-col gap-3">
              {messageList.map((messageContent, key) => {
                return (
                  <div key={key}>
                    {username === messageContent.username ? (
                      <div className="chat chat-end">
                        <div className="chat-header text-black">
                          {messageContent.author}
                        </div>
                        <div className="chat-bubble chat-bubble-primary">
                          {messageContent.message}
                        </div>
                        <div className="chat-footer">{messageContent.time}</div>
                      </div>
                    ) : (
                      <div className="chat chat-start">
                        <div className="chat-header">
                          {messageContent.username}
                        </div>
                        <div className="chat-bubble chat-bubble-accent">
                          {messageContent.message}
                        </div>
                        <div className="chat-footer">{messageContent.time}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </ScrollToBottom>
            <div className="chat-footer w-full p-3">
              <div className="flex gap-3 justify-between">
                <input
                  className="input input-bordered input-accent w-full"
                  type="text"
                  value={currentMessage}
                  placeholder="Hey..."
                  onChange={(event) => {
                    setCurrentMessage(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    event.key === "Enter" && sendMessage();
                  }}
                />
                <button className="btn btn-primary" onClick={sendMessage}>
                  &#9658;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
