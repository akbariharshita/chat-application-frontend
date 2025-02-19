import { Box, Card, Typography } from "@mui/material";
import React from "react";

const JoinRoom = ({ roomName, availableRooms, handleJoinRoom }) => {
  return (
    <Box>
      <Card
        sx={{
          width: "100%",
          height: { xs: "100vh", md: "calc(100vh - 20px)" },
          p: 4,
          backgroundColor: "rgb(16,29,37)",
          borderRadius: "0px",
          backgroundSize: "cover",
          overflowY: "scroll",
          borderRadius: { xs: 0, md: "40px" },
        }}
      >
        <Typography
          variant="h5"
          align="center"
          color="white"
          fontSize="30px"
          fontWeight="600"
          gutterBottom
        >
          Join a Room
        </Typography>
        <Box sx={{ my: 3 }}>
          {" "}
          <Typography
            textAlign="start"
            color="white"
            fontSize="20px"
            fontWeight="400"
          >
            Select Room
          </Typography>
          <Box mt={3}>
            {availableRooms.map((room, index) => (
              <Box
                key={index}
                value={room}
                onClick={() => handleJoinRoom(room)}
              >
                <Typography
                  border="1px solid white"
                  sx={{
                    borderRadius: 3,
                    cursor: "pointer",
                    px: 3,
                    py: 2,
                    my: 2,
                    color: "white",
                    fontSize: "16px",
                    textAlign: "start",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  {room}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default JoinRoom;
