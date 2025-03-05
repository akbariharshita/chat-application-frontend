import React, { useEffect, useRef, useState } from "react";
import { Box, Card, Grid, Menu, MenuItem, Typography } from "@mui/material";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuModal from "../modal/MenuModal";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import InputSection from "./InputSection";
import { useDispatch, useSelector } from "react-redux";
import { setChatTheme } from "../../store/authSlice";
import { themes } from "../../utils/data";
import ChatImage from "./ChatImage";

const getDayLabel = (timestamp) => {
  const today = new Date();
  const messageDate = new Date(timestamp);
  const diffTime =
    today.setHours(0, 0, 0, 0) - messageDate.setHours(0, 0, 0, 0);

  if (diffTime === 0) {
    return "Today";
  } else if (diffTime === 86400000) {
    return "Yesterday";
  } else {
    return messageDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
};

const ChatWindow = ({
  roomName,
  userName,
  chatMessages,
  message,
  setMessage,
  file,
  setFile,
  handleLeaveRoom,
  handleSendMessage,
  handleDeleteMessage,
  handleDownload,
  fileLoading,
}) => {
  const dispatch = useDispatch();
  const chatTheme = useSelector(
    (state) => state.auth.users[userName].chatTheme
  );
  const [contextMenu, setContextMenu] = useState(null);
  const [wallpaperModalOpen, setWallpaperModalOpen] = useState(false);
  const [theme, setTheme] = useState(
    chatTheme && Object.keys(chatTheme).length > 0 ? chatTheme : themes[0]
  );
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages]);

  const handleContextMenu = (event, msg) => {
    event.preventDefault();
    setSelectedMessage(msg);
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
    setSelectedMessage(null);
  };

  const handleCopyMessage = () => {
    if (selectedMessage) {
      navigator.clipboard.writeText(selectedMessage.message);
    }
    handleCloseContextMenu();
  };

  const handleDeleteMessageClick = () => {
    if (selectedMessage && selectedMessage.user === userName) {
      handleDeleteMessage(selectedMessage);
    }
    handleCloseContextMenu();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleWallpaperSelect = (theme) => {
    setTheme(theme);
    dispatch(setChatTheme({ userName, chatTheme: theme }));
    setWallpaperModalOpen(false);
    setOpen(false);
  };

  const toUserName = (str) => {
    if (typeof str !== "string") {
      return "";
    }
    return str
      .toLowerCase()
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toUpperCase() : word.toLowerCase()
      )
      .replace(/\s+/g, "");
  };

  const groupedMessages = Array.isArray(chatMessages)
    ? chatMessages.reduce((acc, msg) => {
        const dayLabel = getDayLabel(msg.timestamp || Date.now());
        if (!acc[dayLabel]) acc[dayLabel] = [];
        acc[dayLabel].push(msg);
        return acc;
      }, {})
    : {};

  return (
    <Box>
      <Card
        sx={{
          height: { xs: "100vh", md: "calc(100vh - 20px)" },
          backgroundImage: `url(${theme.backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          borderRadius: { xs: 0, md: "20px" },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyItems="center"
          gap={3}
          mb={1}
          p={1}
          borderBottom="1px solid white"
        >
          <Box onClick={handleLeaveRoom}>
            <KeyboardBackspaceIcon
              sx={{ color: theme.textColor, fontSize: 20, cursor: "pointer" }}
            />
          </Box>
          <Typography
            width="100%"
            fontSize="13px"
            textAlign="center"
            sx={{ color: theme.textColor }}
          >
            Room: {roomName}
          </Typography>
          <Box>
            <MoreVertIcon
              onClick={handleClickOpen}
              sx={{ color: theme.textColor, fontSize: 20, cursor: "pointer" }}
            />
            {open && (
              <MenuModal
                themes={themes}
                open={open}
                handleClose={handleClose}
                setWallpaperModalOpen={setWallpaperModalOpen}
                wallpaperModalOpen={wallpaperModalOpen}
                handleWallpaperSelect={handleWallpaperSelect}
              />
            )}
          </Box>
        </Box>

        <Box
          ref={chatContainerRef}
          sx={{
            height: { xs: "calc(100vh - 140px)", md: "calc(100vh - 130px)" },
            overflowY: "scroll",
            px: 2,
            pt: 2,
          }}
        >
          {Object.keys(groupedMessages).map((day, dayIndex) => (
            <React.Fragment key={dayIndex}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  textAlign="center"
                  sx={{
                    backgroundColor: "rgba(0,0,0,0.3)",
                    color: "white",
                    fontSize: "10px",
                    borderRadius: "10px",
                    display: "inline-block",
                    px: 2,
                    py: 1,
                    mb: 2,
                  }}
                >
                  {day}
                </Typography>
              </Box>

              {groupedMessages[day].map((msg, index) => {
                const sender = msg.user === userName;
                const time = new Date(
                  msg.timestamp || Date.now()
                ).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });
                return (
                  <Grid
                    container
                    justifyContent={sender ? "flex-end" : "flex-start"}
                    sx={{ mb: 1 }}
                    key={index}
                    onContextMenu={(e) => handleContextMenu(e, msg)}
                  >
                    <Box
                      sx={{
                        py: "8px",
                        px: "12px",
                        borderTopLeftRadius: sender ? "20px" : "0px",
                        borderBottomLeftRadius: "20px",
                        borderBottomRightRadius: sender ? "0px" : "20px",
                        borderTopRightRadius: "20px",
                        backgroundColor: sender
                          ? theme.sendBoxColor
                          : theme.reciveBoxColor,
                        color: "white",
                        maxWidth: "70%",
                        minWidth: "auto",
                        wordWrap: "break-word",
                        alignSelf: sender ? "flex-end" : "flex-start",
                        position: "relative",
                        margin: "5px 0",
                        "::before": {
                          content: '""',
                          position: "absolute",
                          bottom: sender ? "0px" : "auto",
                          top: sender ? "auto" : "0px",
                          width: 0,
                          height: 0,
                          borderStyle: "solid",
                          borderWidth: sender
                            ? "10px 10px 0 10px"
                            : "0px 10px 10px 0",
                          borderColor: sender
                            ? `transparent transparent transparent ${theme.sendBoxColor}`
                            : `transparent ${theme.reciveBoxColor} transparent transparent`,
                          right: sender ? "-19.5px" : "auto",
                          left: sender ? "auto" : "-10px",
                        },
                      }}
                    >
                      <Typography
                        textAlign="left"
                        color="#fff"
                        pb="4px"
                        fontSize="7px"
                        fontWeight="700"
                      >
                        {!sender && `${toUserName(msg.user)} :`}
                      </Typography>
                      {msg.isDeleted ? (
                        sender ? (
                          <Typography
                            sx={{
                              fontStyle: "italic",
                              color: "#ccc",
                              fontSize: "10px",
                            }}
                          >
                            You deleted this message
                          </Typography>
                        ) : (
                          <Typography
                            sx={{
                              fontStyle: "italic",
                              color: "#ccc",
                              fontSize: "10px",
                            }}
                          >
                            This message was deleted
                          </Typography>
                        )
                      ) : msg.file ? (
                        <ChatImage
                          msg={msg}
                          sender={sender}
                          userName={userName}
                          handleDownload={handleDownload}
                        />
                      ) : (
                        <Typography
                          sx={{
                            textAlign: "start",
                            fontSize: "10px",
                            lineHeight: "8px",
                          }}
                        >
                          {msg.message}
                        </Typography>
                      )}

                      <Typography
                        textAlign="right"
                        fontSize="7px"
                        pt="3px"
                        pl="25px"
                        color={sender ? "#504747" : "#8b938b"}
                      >
                        {time}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}

              <Menu
                open={contextMenu !== null}
                onClose={handleCloseContextMenu}
                anchorReference="anchorPosition"
                anchorPosition={
                  contextMenu !== null
                    ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                    : undefined
                }
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "rgb(16,29,37)",
                    color: "white",
                  },
                }}
              >
                <MenuItem
                  sx={{ fontSize: "12px", py: 0 }}
                  onClick={handleCopyMessage}
                >
                  <ContentCopyIcon sx={{ mr: 1, fontSize: "18px", p: 0 }} />
                  Copy
                </MenuItem>
                <MenuItem
                  sx={{ fontSize: "12px", py: 1 }}
                  onClick={handleDeleteMessageClick}
                >
                  <DeleteIcon sx={{ mr: 1, fontSize: "18px", p: 0 }} />
                  Delete
                </MenuItem>
              </Menu>
            </React.Fragment>
          ))}
        </Box>

        <InputSection
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
          file={file}
          setFile={setFile}
        />
      </Card>
    </Box>
  );
};

export default ChatWindow;
