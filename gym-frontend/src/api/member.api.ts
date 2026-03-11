import api from "./axios";

export interface CreateMemberPayload {
  name: string;
  phone: string;
  age: string;
  gender: string;
  joined_date: string;
//   address: string;
  
}

export const createMember = async (data:  CreateMemberPayload) => {
    const response = await api.post("/members", data);
    return response.data;
}