import axios from "axios"
import { BACKEND_URL } from "../app/config"
export async function getChats(roomId: String) {
    const response  = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    return response.data.message;
}

    export async function ChatRoom(id: {
        id :String
    }) {
        const messages = await  getChats(id);
        return <>
        </>
    }