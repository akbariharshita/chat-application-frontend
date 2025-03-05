import { Box, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const ChatImage = ({ msg, sender, handleDownload }) => {
  const handleDownloadFile = () => {
    handleDownload(msg);
  };

  return (
    <>
      <Box sx={{ position: "relative", display: "inline-block" }}>
        <img
          src={msg.file}
          alt="Received File"
          style={{
            width: "100%",
            borderRadius: "10px",
            maxHeight: "200px",
            objectFit: "cover",
            filter: !sender && !msg.isDownload ? "blur(10px)" : "blur(0px)",
          }}
        />
        {!sender && !msg.isDownload && (
          <Box
            sx={{
              position: "absolute",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              top: "10px",
              right: "10px",
              backgroundColor: "rgba(225, 225, 225, 0.4)",
              width: "50px",
              borderRadius: "50%",
              padding: "6px",
              cursor: "pointer",
            }}
            onClick={handleDownloadFile}
          >
            <DownloadIcon sx={{ color: "white", fontSize: 18 }} />
          </Box>
        )}
      </Box>
      {msg.message && <hr />}
      <Typography
        sx={{
          textAlign: "start",
          fontSize: "10px",
          lineHeight: "8px",
        }}
      >
        {msg.message}
      </Typography>
    </>
  );
};

export default ChatImage;
