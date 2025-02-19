import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: null,
  users: {},
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      const { userName, accessToken, refreshToken } = action.payload;
      console.log({ userName, accessToken, refreshToken });
      state.userName = userName;

      state.users[userName] = {
        userName,
        accessToken,
        refreshToken,
        roomName: "",
        chatMessages: [],
        chatTheme: {},
      };
      console.log(state.users);
    },

    setRoomName: (state, action) => {
      const { userName, roomName } = action.payload;
      if (state.users[userName]) {
        state.users[userName].roomName = roomName;
      }
    },

    clearRoom: (state, action) => {
      const { userName } = action.payload;
      if (state.users[userName]) {
        state.users[userName].roomName = "";
        state.users[userName].chatMessages = [];
      }
    },

    setChatMessages: (state, action) => {
      const { userName, chatMessages } = action.payload;
      if (state.users[userName]) {
        state.users[userName].chatMessages = chatMessages;
      }
    },

    addChatMessage: (state, action) => {
      const { userName, message } = action.payload;

      if (!state.users[userName]) {
        state.users[userName] = { chatMessages: [] };
      }
      state.users[userName].chatMessages.push(message);
    },

    updateChatMessage: (state, action) => {
      const { userName, messageId } = action.payload;
      if (state.users[userName]) {
        const messageIndex = state.users[userName].chatMessages.findIndex(
          (msg) => msg.id === messageId
        );
        if (messageIndex !== -1) {
          state.users[userName].chatMessages[messageIndex].isDeleted = true;
        }
      }
    },

    deleteChatMessage: (state, action) => {
      const { userName, messageId } = action.payload;
      if (state.users[userName]) {
        state.users[userName].chatMessages = state.users[
          userName
        ].chatMessages.map((msg) =>
          msg.id === messageId ? { ...msg, isDeleted: true } : msg
        );
      }
    },

    setChatTheme: (state, action) => {
      const { userName, chatTheme } = action.payload;

      if (!state.users[userName]) {
        state.users[userName] = { chatTheme: chatTheme };
      } else {
        state.users[userName].chatTheme = chatTheme;
      }
    },

    logout: (state, action) => {
      const { userName } = action.payload;
      console.log("Logging out:", { userName });

      if (state.users[userName]) {
        delete state.users[userName];
      }

      state.userName = null;
    },

    logoutAll: (state) => {
      state.users = {};
    },
  },
});

export const {
  setToken,
  setRoomName,
  clearRoom,
  setChatMessages,
  addChatMessage,
  updateChatMessage,
  deleteChatMessage,
  setChatTheme,
  logout,
  logoutAll,
} = authSlice.actions;

export default authSlice.reducer;
