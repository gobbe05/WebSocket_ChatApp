import express from "express";
import {createServer} from 'http'
import WebSocket, {WebSocketServer} from 'ws'
import path from 'path'

const app = express()
const server = createServer(app);
const wss = new WebSocketServer({server});
require("dotenv").config()
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, "/public")))

wss.on("connection", socket => {
  socket.on("message", (data) => {
    const buffer = data.toString("utf8")
    const { username, message} = JSON.parse(buffer)

    wss.clients.forEach((client) => {
      if(client.readyState === WebSocket.OPEN) {
        if(client !== socket) {
          client.send(`
            <div id='newmessage' hx-swap-oob='beforeend'>
              <div class='mr-auto rounded-md my-2 p-2 bg-gray-300'>
                <p>${message}</p>
                <p class="text-xs text-right mt-1">${username}</p>
              </div>
            </div>
          `)
        } else {
          client.send(`
            <div id='newmessage' hx-swap-oob='beforeend'>
              <div class='ml-auto text-white rounded-md my-2 p-2 bg-blue-500'>
                <p>${message}</p>
                <p class="text-xs text-right mt-1">${username}</p>
              </div>
            </div>
            <input id="message" hx-swap-oob="outerHTML" name="message" class="flex-grow p-2 border border-black rounded-md" />
          `)
        }
      } 
    })
  })
})

server.listen(port, () => {
  console.log("Listening on port 3000")
})
