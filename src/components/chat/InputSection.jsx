import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiPicker from "emoji-picker-react";

const InputSection = ({
  message,
  setMessage,
  handleSendMessage,
  file,
  setFile,
}) => {
  const [attachFileDialogOpen, setAttachFileDialogOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleAttachFileOpen = () => setAttachFileDialogOpen(true);

  const handleAttachFileClose = () => setAttachFileDialogOpen(false);

  const handleEmojiSelect = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const sendMessage = () => {
    handleSendMessage();
    if (file) setAttachFileDialogOpen(false);
  };

  const handleSendMessageOnEnter = async (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await sendMessage();
    }
  };

  return (
    <Box>
      <Box display="flex" width="100%" gap={1} p={2}>
        <Box flex={1}>
          <TextField
            size="small"
            onKeyDown={handleSendMessageOnEnter}
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              width: "100%",
              mb: 3,
              fontSize: "10px",
              borderWidth: 1,
              borderRadius: 3,
              borderColor: "white",
              borderStyle: "solid",
              input: { color: "white" },
              "& .MuiInputBase-input::placeholder": {
                color: "rgba(255,255,255,0.9)",
                fontSize: "10px",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <Box display="flex" alignItems="center">
                  <IconButton
                    sx={{ p: "0px" }}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <EmojiEmotionsIcon
                      sx={{ fontSize: "20px", color: "white" }}
                    />
                  </IconButton>
                  <IconButton
                    sx={{ pl: "5px", pr: "0px" }}
                    onClick={handleAttachFileOpen}
                  >
                    <AttachFileIcon sx={{ fontSize: "20px", color: "white" }} />
                  </IconButton>
                </Box>
              ),
            }}
          />
        </Box>

        <Box>
          <Button
            sx={{
              border: "1px solid white",
              borderRadius: "50%",
              minWidth: "35px",
              height: "35px",
              my: "4px",
              p: "0px",
            }}
            onClick={sendMessage}
          >
            <SendIcon sx={{ fontSize: "20px", color: "white" }} />
          </Button>
        </Box>
      </Box>
      {showEmojiPicker && (
        <Box sx={{ position: "absolute", bottom: "60px", right: "20px" }}>
          <EmojiPicker onEmojiClick={handleEmojiSelect} />
        </Box>
      )}
      <Dialog
        open={attachFileDialogOpen}
        onClose={handleAttachFileClose}
        PaperProps={{
          sx: {
            position: "absolute",
            bottom: 65,
            margin: 0,
            mx: "auto",
            width: "80%",
            borderRadius: "10px 10px 0 0",
          },
        }}
      >
        <DialogContent
          sx={{
            backgroundColor: "rgb(16,29,37)",
            display: "flex",
            gap: "20px",
            alignItems: "center",
          }}
        >
          {file ? (
            <Box sx={{ position: "relative" }}>
              <img
                src={URL.createObjectURL(file)}
                alt="Selected file preview"
                style={{
                  maxWidth: "50px",
                  maxHeight: "50px",
                  borderRadius: "2px",
                }}
              />
              <IconButton
                onClick={() => {
                  setFile(null);
                  setAttachFileDialogOpen(false);
                }}
                sx={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  width: "20px",
                  height: "20px",
                  p: "0px",
                }}
              >
                <CloseIcon sx={{ fontSize: "16px", color: "red" }} />
              </IconButton>
            </Box>
          ) : (
            <Box
              component="label"
              htmlFor="file-upload"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#b718c1",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              <ImageIcon sx={{ color: "white", fontSize: "25px" }} />
              <input
                type="file"
                id="file-upload"
                hidden
                onChange={(event) => {
                  const uploadedFile = event.target.files?.[0] || null;
                  setFile(uploadedFile);
                  if (uploadedFile) {
                    setAttachFileDialogOpen(false);
                  }
                }}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default InputSection;
