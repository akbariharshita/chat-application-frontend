import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import CryptoJS from "crypto-js";
import { Box, CircularProgress } from "@mui/material";
import JoinRoom from "../components/chat/JoinRoom";
import ChatWindow from "../components/chat/ChatWindow";
import { BACKEND_URL, CRYPTO_SECRET_KEY } from "../lib/envrionments";
import { useDispatch, useSelector } from "react-redux";
import {
  setRoomName,
  clearRoom,
  setChatMessages,
  addChatMessage,
  deleteChatMessage,
  setFileDownloaded,
} from "../store/authSlice";

export const socket = io(BACKEND_URL);
const availableRooms = ["Room 1", "Room 2", "Room 3"];

const RoomChat = () => {
  const userName = useSelector((state) => state.auth.userName);
  const storedRoomName = useSelector(
    (state) => state.auth.users[userName].roomName
  );
  const storedMessages = useSelector(
    (state) => state.auth.users[userName]?.chatMessages
  );
  const dispatch = useDispatch();

  const [roomName, setRoomNameState] = useState(storedRoomName || "");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    if (storedRoomName && userName) {
      setRoomNameState(storedRoomName);
      setJoined(true);
    }
    setLoading(false);
  }, [storedRoomName, userName]);

  useEffect(() => {
    if (Array.isArray(storedMessages) && storedMessages.length > 0) {
      dispatch(setChatMessages({ userName, chatMessages: storedMessages }));
    }

    socket.on("roomMessage", (data) => {
      if (!data || !Array.isArray(data.chatMessage)) {
        console.error("Invalid or undefined chatMessage:", data?.chatMessage);
        return;
      }

      const decryptedMessages = data.chatMessage.map((msg) => {
        const decryptedMessage = CryptoJS.AES.decrypt(
          msg.message,
          CRYPTO_SECRET_KEY
        ).toString(CryptoJS.enc.Utf8);

        return {
          user: msg.user,
          file: msg.file,
          message: decryptedMessage,
          timestamp: msg.timestamp,
          isDeleted: msg.isDeleted,
          isDownload: msg.isDownload,
          id: msg._id,
        };
      });

      dispatch(setChatMessages({ userName, chatMessages: decryptedMessages }));
    });

    socket.on("newMessage", (data) => {
      const { chatMessage } = data;
      console.log("New message received:", data);
      setFileLoading(false);

      const decryptedMessage = CryptoJS.AES.decrypt(
        chatMessage.message,
        CRYPTO_SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);

      const newMessage = {
        user: chatMessage.user,
        file: chatMessage.file,
        message: decryptedMessage,
        timestamp: chatMessage.timestamp,
        isDeleted: chatMessage.isDeleted,
        isDownload: chatMessage.isDownload,
        id: chatMessage._id,
      };

      dispatch(addChatMessage({ userName, message: newMessage }));
    });

    socket.on("messageDeleted", ({ MessageId }) => {
      dispatch(deleteChatMessage({ userName, messageId: MessageId }));
    });

    socket.on("fileDownload", ({ MessageId }) => {
      setChatMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === MessageId ? { ...message, isDownload: true } : message
        )
      );
    });

    return () => {
      socket.off("roomMessage");
      socket.off("newMessage");
      socket.off("messageDeleted");
      socket.off("fileDownload");
    };
  }, [storedMessages, userName]);

  useEffect(() => {
    if (storedRoomName && userName) {
      socket.emit(
        "createOrJoinRoom",
        { roomName: storedRoomName, userName },
        (response) => {
          if (response.status === "success") {
            dispatch(setRoomName(storedRoomName));
            setJoined(true);
          } else {
            console.error(response.message);
          }
        }
      );
    }
  }, [storedRoomName, userName, dispatch]);

  const handleJoinRoom = (room) => {
    setJoiningRoom(true);
    setRoomNameState(room);
    if (room && userName) {
      socket.emit(
        "createOrJoinRoom",
        { roomName: room, userName },
        (response) => {
          setJoiningRoom(false);
          if (response.status === "success") {
            localStorage.setItem("roomName", room);
            dispatch(setRoomName({ userName, roomName: room }));
            setJoined(true);
          } else {
            alert(response.message);
          }
        }
      );
    }
  };

  const handleSendMessage = () => {
    if (!message && !file) return;

    setFileLoading(true);

    const encryptedMessage = CryptoJS.AES.encrypt(
      message,
      CRYPTO_SECRET_KEY
    ).toString();

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileBuffer = reader.result;
        socket.emit("sendMessageToRoom", {
          roomName,
          userName,
          message: encryptedMessage,
          file: {
            fileName: file.name,
            fileBuffer: fileBuffer,
            fileType: file.type,
          },
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      socket.emit(
        "sendMessageToRoom",
        { roomName, userName, message: encryptedMessage },
        () => {
          setFileLoading(false);
        }
      );
    }

    setMessage("");
    setFile(null);
  };

  const handleDeleteMessage = (selectedMessage) => {
    socket.emit("deleteMessage", { roomName, messageId: selectedMessage.id });
    dispatch(deleteChatMessage({ userName, messageId: selectedMessage.id }));
  };

  const handleDownload = async (msg) => {
    try {
      const response = await fetch(msg.file);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "downloaded_image.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      socket.emit("downloadFile", { roomName, messageId: msg.id });
      dispatch(setFileDownloaded({ userName, messageId: msg.id }));
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  const handleLeaveRoom = () => {
    if (roomName && userName) {
      socket.emit("leaveRoom", { roomName, userName }, (response) => {
        if (response.status === "success") {
          localStorage.removeItem("roomName");
          dispatch(clearRoom({ userName }));
          setJoined(false);
          setRoomNameState("");
        } else {
          alert(response.message);
        }
      });
    } else {
      alert("No room to leave.");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "600",
          py: "30px",
        }}
      >
        Loading...
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: "0px",
        height: "100%",
        maxWidth: "768px",
        mx: "auto",
        py: { xs: 0, md: "10px" },
      }}
    >
      {!joined ? (
        <>
          {joiningRoom ? (
            <Box
              sx={{
                textAlign: "center",
                py: "30px",
              }}
            >
              <CircularProgress />
              <Box sx={{ mt: 2 }}>Joining Room...</Box>
            </Box>
          ) : (
            <JoinRoom
              roomName={roomName}
              availableRooms={availableRooms}
              handleJoinRoom={handleJoinRoom}
            />
          )}
        </>
      ) : (
        <ChatWindow
          roomName={roomName}
          userName={userName}
          chatMessages={storedMessages}
          message={message}
          setMessage={setMessage}
          setFile={setFile}
          file={file}
          handleLeaveRoom={handleLeaveRoom}
          handleSendMessage={handleSendMessage}
          handleDeleteMessage={handleDeleteMessage}
          handleDownload={handleDownload}
          fileLoading={fileLoading}
        />
      )}
    </Box>
  );
};

export default RoomChat;
