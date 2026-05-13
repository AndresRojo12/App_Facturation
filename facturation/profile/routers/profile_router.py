from fastapi import APIRouter, Depends

from facturation.database.dependencies.dependencie_session import SessionDep, get_session
from facturation.users.login.user_login import get_current_active_user
from facturation.users.schemas.user_schema import UserResponse
from facturation.profile.schemas.profile_schema import ProfileCreate, ProfileResponse
from facturation.profile.services.profile_service import create_profile, get_profile, update_profile

router = APIRouter(prefix="/profile", tags=["profile"])

@router.post("/", response_model=ProfileResponse)
async def create_new_profile(
    profile: ProfileCreate,
    db: SessionDep,
    current_user = Depends(get_current_active_user)
):
    return await create_profile(profile, db, current_user)

@router.get("/me", response_model=ProfileResponse)
async def read_profile(
    db: SessionDep,
    current_user = Depends(get_current_active_user)
):
    return await get_profile(db, current_user)

@router.put("/", response_model=ProfileResponse)
async def update_existing_profile(
    profile_update: ProfileCreate,
    db: SessionDep,
    current_user = Depends(get_current_active_user)
):
    return await update_profile(profile_update, db, current_user)