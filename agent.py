import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.prebuilt import create_react_agent
from tools import calculate_micro_loan, search_rural_subsidies

llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash-lite",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.2
)

tools = [calculate_micro_loan, search_rural_subsidies]

SYSTEM_PROMPT = """You are a warm, empathetic financial advisor for rural micro-entrepreneurs.
Rules:
1. Speak in simple language. Avoid complex financial jargon.
2. Ask about daily income and monthly expenses before offering loan advice.
3. Automatically use the tools to calculate loan capacity and check government schemes.
4. Keep answers short, structured, and easy to read."""

agent_executor = create_react_agent(llm, tools, prompt=SYSTEM_PROMPT)
