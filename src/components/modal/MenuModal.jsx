import { Box, Modal, Typography } from "@mui/material";
import React from "react";
import BackgroundModal from "./BackgroundModal";
import { useMutation } from "@tanstack/react-query";
import { LogoutUser } from "../../services/authService";
import { useNavigate } from "react-router";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";

const menuData = ["Search", "Wallpaper"];

const MenuModal = ({
  themes,
  open,
  handleClose,
  setWallpaperModalOpen,
  wallpaperModalOpen,
  handleWallpaperSelect,
}) => {
  const navigate = useNavigate();
  const userName = useSelector((state) => state.auth.userName);
  const dispatch = useDispatch();

  const handleWallpaperClick = () => {
    setWallpaperModalOpen(true);
  };

  const { mutate } = useMutation({
    mutationFn: LogoutUser,
    onSuccess: (data) => {
      dispatch(logout({ userName }));
      console.log("Registration data:", data);
      navigate("/");
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  const handleLogout = () => {
    mutate();
  };

  return (
    <Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropProps={{
          style: {
            backgroundColor: "transparent",
          },
        }}
      >
        <Box
          sx={{
            maxWidth: "768px",
            mx: "auto",
            border: "none",
            outline: "none",
            "&:focus": {
              outline: "none",
            },
            "&:focusVisible": {
              outline: "none",
            },
          }}
        >
          <Box
            sx={{
              ml: "auto",
              mt: "45px",
              mr: "10px",
              width: 170,
              backgroundColor: "rgb(16,29,37)",
              py: 1,
              px: 4,
              borderRadius: 2,
              zIndex: 1300,
            }}
          >
            {menuData.map((data) => (
              <Typography
                id="modal-modal-title"
                fontSize="14px"
                fontWeight="400"
                py={1}
                color="white"
                onClick={data === "Wallpaper" ? handleWallpaperClick : null}
                sx={{ cursor: "pointer" }}
              >
                {data}
              </Typography>
            ))}
            <Typography
              id="modal-modal-title"
              fontSize="14px"
              fontWeight="400"
              py={1}
              color="red"
              onClick={handleLogout}
              sx={{ cursor: "pointer" }}
            >
              Logout <LogoutIcon sx={{ fontSize: "20px", ml: 1 }} />
            </Typography>
          </Box>
        </Box>
      </Modal>

      <BackgroundModal
        wallpaperModalOpen={wallpaperModalOpen}
        setWallpaperModalOpen={setWallpaperModalOpen}
        themes={themes}
        handleWallpaperSelect={handleWallpaperSelect}
      />
    </Box>
  );
};

export default MenuModal;
