import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import "./index.css";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);

  const login = () => {
    if (username !== "") {
      setShowChat(true);
    }
    socket.emit('joinServer',{username});
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="card w-96 bg-white rounded-xl text-primary">
          <div className="card-body">
            <div className="flex flex-col gap-3 items-center justify-center my-6">
              <h1 className="text-black text-xl">Join A Chat</h1>
              <form onSubmit={login}>
                <input
                  className="input input-bordered input-accent w-full max-w-xs text-black mt-3"
                  type="text"
                  placeholder="John..."
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary w-full mt-6"
                  onClick={login}
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <Chat socket={socket} username={username} />
      )}
    </div>
  );
}

export default App;
