from fastapi import FastAPI
from logging_setup import LoggerSetup
from starlette.middleware.cors import CORSMiddleware
import logging
import os
import uvicorn

# setup root logger
logger_setup = LoggerSetup()
LOGGER = logging.getLogger(__name__)

def init_app():
    apps = FastAPI(
        title="brainstorming-api",
        description= "Fast API",
        version= "1.0.0"
    )

    @apps.on_event("startup")
    async def startup():
        LOGGER.info("--- Start up App ---")
        pass

    @apps.on_event("shutdown")
    async def shutdown():
        LOGGER.info("--- Shut down App ---")
        pass
    
    from controllers import brainstorm

    apps.include_router(brainstorm.router)
    
    return apps


app = init_app()

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)



if __name__ == "__main__":
    uvicorn.run("main:app", host='0.0.0.0', port=8000, reload=True, debug=True, workers=3)
