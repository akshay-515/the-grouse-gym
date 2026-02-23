import api from "./axios"

export const loginUser = async (username: string, password: string) => {
    const res = await api.post("/auth/login", {username, password});
    return res.data;
};

