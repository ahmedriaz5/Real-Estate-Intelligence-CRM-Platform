from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

from app.core.config import get_settings
from app.database import Base, engine

from app.customers.model import Customer
from app.leads.model import Lead
from app.properties.model import Property
from app.users.model import User

from app.users.router import router as users_router
from app.customers.router import router as customers_router
from app.leads.router import router as leads_router
from app.properties.router import router as properties_router
from fastapi.middleware.cors import CORSMiddleware

settings = get_settings()


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Real Estate CRM",
    description="FastAPI Real Estate CRM API",
    version="1.0.0",
    debug=settings.debug,
)


@app.exception_handler(IntegrityError)
async def integrity_error_handler(
    request: Request,
    exc: IntegrityError,
):
    return JSONResponse(
        status_code=409,
        content={
            "detail": "Database constraint violation"
        },
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(
    users_router,
    prefix=f"{settings.api_prefix}/users",
    tags=["Users"],
)


app.include_router(
    customers_router,
    prefix=f"{settings.api_prefix}/customers",
    tags=["Customers"],
)


app.include_router(
    properties_router,
    prefix=f"{settings.api_prefix}/properties",
    tags=["Properties"],
)


app.include_router(
    leads_router,
    prefix=f"{settings.api_prefix}/leads",
    tags=["Leads"],
)


@app.get("/")
def root():
    return {
        "message": "Real Estate CRM API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }