from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import random
import logging
import os

# Get logger for module
LOGGER = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api",
    tags=['api']
)

load_dotenv()
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

class Result(BaseModel):
    user: str
    time: int
    humanIdeas: str
    aiIdeas: str

class UserAction(BaseModel):
    user: str
    time: int
    action: str

@router.post("/start")
async def start_exp(action: UserAction):
    print(action)
    LOGGER.info(f"User {action.user} starts the experiment")
    return {"message":"OK" }

@router.post("/idea")
async def create_idea(result: Result):
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        temperature= 1,
        messages=[{
            "role": "system", 
            "content": """
            You are a creative brainstorming master. Help me to brainstorming, 
            Give me one idea about: How can college help the society improve sustainability? 
            The idea should less than 12 words.
            You already have the following ideas, but the idea should be different from the following ideas:
            {result.aiIdeas}
            Use the following idea as inspiration if below exists but the idea you provide should be totally different from the following ideas:
            {result.humanIdeas}
            Please follow brainstorming rules: 
            Rule 1: Focus on Quantity
            Rule 2: Welcome Wild Ideas
            Rule 3: Combine and Improve Ideas
            """
        }],
    )
    message =  completion.choices[0].message
    LOGGER.info(f"User {result.user} at time {result.time} generate idea from AI: {message.content}")

    return {"message": message}

# after doing the experiment, save the result to RDS
@router.post("/end")
def end_exp(result: Result):
    randbytes = random.randbytes(4)
    verification_code = result.user + "-" + randbytes.hex()
    LOGGER.info(f"User {result.user} at time {result.time} end the experiment with ideas: {result.humanIdeas}. AI generated ideas:  {result.aiIdeas}. Code: {verification_code}")
    return {"result": verification_code }

@router.post("/action")
def user_action(action: UserAction):
    LOGGER.info(f"User {action.user} at time {action.time} {action.action}")
    return {"message":"OK" }

@router.get("")
async def welcome_home():
    LOGGER.info("Welcome!")
    return "welcome"

@router.get("/test")
async def test_home():
    LOGGER.info("welcome page test!")
    return "welcome page test!"