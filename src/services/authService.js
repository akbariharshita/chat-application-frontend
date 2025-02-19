import client from "../lib/client";

export const LoginApi = async (parameter) => {
  const response = await client.post("/api/user/login", parameter);
  return response.data;
};

export const RegisterApi = async (parameter) => {
  const response = await client.post("/api/user/register", parameter);
  return response.data;
};

export const LogoutUser = async () => {
  const response = await client.post("/api/user/logout");
  return response.data;
};
