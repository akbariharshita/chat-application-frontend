import { Box, Grid, Modal, Typography } from "@mui/material";
import React from "react";

const BackgroundModal = ({
  wallpaperModalOpen,
  setWallpaperModalOpen,
  themes,
  handleWallpaperSelect,
}) => {
  return (
    <div>
      <Modal
        open={wallpaperModalOpen}
        onClose={() => setWallpaperModalOpen(false)}
        aria-labelledby="wallpaper-modal-title"
        aria-describedby="wallpaper-modal-description"
      >
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "300px",
            height: "80%",
            backgroundColor: "white",
            p: 4,
            overflowY: "scroll",
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography
            id="wallpaper-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            Select a Wallpaper
          </Typography>
          <Grid container spacing={2}>
            {themes.map((image, index) => (
              <Grid item xs={6} key={index}>
                <Box
                  component="img"
                  src={image.backgroundImage}
                  alt={`Wallpaper ${index + 1}`}
                  sx={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 2,
                    cursor: "pointer",
                    "&:hover": { transform: "scale(1.05)", transition: "0.3s" },
                  }}
                  onClick={() => handleWallpaperSelect(image)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default BackgroundModal;
