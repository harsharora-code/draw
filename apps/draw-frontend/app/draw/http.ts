import axios from "axios";
import { HTTP_BACKEND } from "@/config";
export async function getExistingShape(roomId: Number) {
      console.log(`${HTTP_BACKEND}/chat/${roomId}`);
    const res = await axios.get(`${HTTP_BACKEND}/chat/${roomId}`);
    const messages = res.data.msg;
    console.log(messages);

    const shapes = messages.map((x: {message: string}) => {
           const messageData = JSON.parse(x.message);
           return messageData.shape;    // shape as message
    })

    return shapes;



}