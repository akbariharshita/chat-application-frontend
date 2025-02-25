import { useState } from "react";
import { Box, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const ChatImage = ({ msg, sender }) => {
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(msg.file);
      console.log({ response });
      const blob = await response.blob();
      console.log({ blob });
      const url = URL.createObjectURL(blob);
      console.log({ url });

      // Create an anchor tag to trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = "downloaded_image.jpg"; // Set file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Set downloaded state to true
      setIsDownloaded(true);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
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
            filter: !sender && !isDownloaded ? "blur(10px)" : "blur(0px)",
          }}
        />
        {!sender && !isDownloaded && (
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
            onClick={handleDownload}
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
