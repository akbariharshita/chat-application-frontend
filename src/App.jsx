import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRoutes, Navigate } from "react-router-dom";
import Login from "./routes/login";
import Register from "./routes/register";
import RoomChat from "./routes/chatRoom";
import { useSelector } from "react-redux";

function App() {
  const userName = useSelector((state) => state.auth.userName);
  const token = useSelector(
    (state) => state?.auth?.users[userName]?.accessToken
  );

  const routes = [
    {
      path: "/",
      element: token ? <Navigate to="/chat" replace /> : <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/chat",
      element: (
        <ProtectedRoute token={token}>
          <RoomChat />
        </ProtectedRoute>
      ),
    },
    { path: "*", element: <Navigate to="/" replace /> },
  ];

  return useRoutes(routes);
}

export default App;

function ProtectedRoute({ token, children }) {
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}
