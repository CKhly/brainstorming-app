from fastapi import FastAPI
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

app = FastAPI()

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

class Result(BaseModel):
    user: str
    ideas: str

class UserAction(BaseModel):
    user: str
    action: str

@app.get("/")
async def root():
    return {"message": "Hello World"}



@app.get("/api/idea")
async def call_openai_api():
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{
            "role": "system", 
            "content": """
            Help me to brainstorming, 
            Give me one idea about: How can college help the society improve sustainability? 
            The idea should less than 15 words.
            """
        }],
    )
    message =  completion.choices[0].message
    return {"message": message}

@app.post("/api/start")
async def start_exp(action: UserAction):
    print(action)
    return {"message":"OK" }

@app.post("/api/idea")
async def create_idea(result: Result):
    print(result)
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{
            "role": "system", 
            "content": """
            Help me to brainstorming, 
            Give me one idea about: How can college help the society improve sustainability? 
            The idea should less than 12 words.
            Use the following idea as inspiration if below exists but the idea should be different from the following idea:
            {result.ideas}
            """
        }],
    )
    message =  completion.choices[0].message
    print("message", message)
    return {"message": message}

# after doing the experiment, save the result to RDS
@app.post("/api/result")
def create_result(result: Result):
    # generate random number
    print(result)
    n = 1
    return {"result": n}

if __name__ == "__main__":
    uvicorn.run("app:app", host='0.0.0.0', port=8000, reload=True, debug=True, workers=3)
