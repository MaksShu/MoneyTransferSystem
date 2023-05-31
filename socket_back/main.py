# from typing import List
# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# from fastapi.middleware.cors import CORSMiddleware
# from datetime import datetime
# import json
#
# app = FastAPI()
#
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # can alter with time
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
#
#
# class ConnectionManager:
#     def __init__(self):
#         self.connections: List[WebSocket] = []
#
#     async def connect(self, websocket: WebSocket):
#         await websocket.accept()
#         self.connections.append(websocket)
#
#     async def broadcast(self, data: str):
#         for connection in self.connections:
#             await connection.send_text(data)
#
#
# manager = ConnectionManager()
#
#
# @app.websocket("/ws/{client_id}")
# async def websocket_endpoint(websocket: WebSocket, client_id: int):
#     await manager.connect(websocket)
#     while True:
#         data = await websocket.receive_text()
#         # message = {"time": 'current_time', "clientId": client_id, "message": data}
#         await manager.broadcast(json.dumps(data))
#
#
# @app.get("/")
# async def get():
#     return "Welcome Home"
#
#
# # @app.websocket("/ws/{client_id}")
# # async def websocket_endpoint(websocket: WebSocket, client_id: int):
# #     await manager.connect(websocket)
# #     now = datetime.now()
# #     current_time = now.strftime("%H:%M")
# #     try:
# #         while True:
# #             data = await websocket.receive_text()
# #             # await manager.send_personal_message(f"You wrote: {data}", websocket)
# #             message = {"time": current_time, "clientId": client_id, "message": data}
# #             await manager.broadcast(json.dumps(message))
# #
# #     except WebSocketDisconnect:
# #         manager.disconnect(websocket)
# #         message = {"time": current_time, "clientId": client_id, "message": "Offline"}
# #         await manager.broadcast(json.dumps(message))


from fastapi import (
    FastAPI, WebSocket, WebSocketDisconnect,
    Request
)
from typing import List

app = FastAPI()


# manager
class SocketManager:
    def __init__(self):
        self.active_connections: List[(WebSocket, str)] = []

    async def connect(self, websocket: WebSocket, user: str):
        await websocket.accept()
        self.active_connections.append((websocket, user))

    def disconnect(self, websocket: WebSocket, user: str):
        self.active_connections.remove((websocket, user))

    async def broadcast(self, data):
        for connection in self.active_connections:
            await connection[0].send_json(data)

manager = SocketManager()


@app.websocket("/ws/{id}")
async def chat(websocket: WebSocket):
    sender = websocket.cookies.get("X-Authorization")
    if sender:
        await manager.connect(websocket, sender)
        response = {
            "sender": sender,
            "message": "got connected"
        }
        await manager.broadcast(response)
        try:
            while True:
                data = await websocket.receive_json()
                await manager.broadcast(data)
        except WebSocketDisconnect:
            manager.disconnect(websocket, sender)
            response['message'] = "left"
            await manager.broadcast(response)
