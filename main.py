import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import agent_executor

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(req: ChatRequest):
    try:
        response = agent_executor.invoke({"messages": [("user", req.message)]})
        messages = response.get("messages", [])
        for msg in reversed(messages):
            content = getattr(msg, "content", "")
            if content and isinstance(content, str):
                return {"response": content}
            elif isinstance(content, list):
                text_parts = [item.get("text", "") for item in content if isinstance(item, dict) and "text" in item]
                if text_parts:
                    return {"response": "\n".join(text_parts)}
        return {"response": "I am here to help with your rural business financial planning. How can I assist you today?"}
    except Exception as e:
        return {"response": f"Error processing request: {str(e)}"}
