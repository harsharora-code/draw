
import { WebSocketServer, WebSocket } from 'ws';
import { URLSearchParams } from 'url';
import  jwt from 'jsonwebtoken'
import {JWT_SECRET} from "@repo/backend-common/config"

// const server = createServer({
//   cert: readFileSync('/path/to/cert.pem'),
//   key: readFileSync('/path/to/key.pem')
// });
const wss = new WebSocketServer({port: 8080});

interface User {
  ws : WebSocket,
  rooms: string[],
  userId: string
}
const users: User[] = [];
function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch(e) {
    return null;
  }
  return null;
}
wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if(!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkUser(token);
  
  if(userId == null) {
    ws.close();
    return null;
  }

   users.push({
    userId,
    rooms: [],
    ws,
   })


  ws.on('message', async function message(data) {    //msg is incoming
    const parseData = JSON.parse(data as unknown as string);

    if(parseData.type == "join_room") {
       const user  = users.find(x => x.ws == ws);
    user?.rooms.push(parseData.roomId);  //here we apply multiple checks to enter user into room or not
    }
  
   if(parseData.type == "leave_room") {  //close the chat-room  
        const user = users.find(x => x.ws == ws);
        if(!user) {
          return
        }
        user.rooms = user?.rooms.filter(x => x == parseData.room);  //remove specific roomId from rooms array
   }
   
   if(parseData.type == "chat") {
    const roomId = parseData.roomId;
    const message = parseData.message;

    users.forEach(user => {
      if(user?.rooms.includes(roomId)) {  //who are intersted user send here msg to him
        user.ws.send(JSON.stringify({
          type: "chat",
          message: message,
          roomId 
        }))
      }
    })
   }
  });

});
