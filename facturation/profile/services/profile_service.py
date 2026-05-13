# create new profile for user

from starlette.exceptions import HTTPException
from facturation.database.dependencies.dependencie_session import SessionDep
from facturation.profile.models.profile_model import Profile
from facturation.profile.schemas.profile_schema import ProfileCreate, ProfileResponse

# create new profile for user
async def create_profile(profile: ProfileCreate, db: SessionDep, current_user) -> ProfileResponse:
    # check if user already has a profile
    existing_profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if existing_profile:
        raise HTTPException(status_code=400, detail="User already has a profile")
    
    new_profile = Profile(
        user_id=current_user.id,
        full_name=profile.full_name,
        phone=profile.phone,
        document=profile.document
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile

# get profile user authenticated

async def get_profile(db: SessionDep, current_user) -> ProfileResponse:
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

# update profile user authenticated

async def update_profile(profile_update: ProfileCreate, db: SessionDep, current_user) -> ProfileResponse:
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    profile.full_name = profile_update.full_name
    profile.phone = profile_update.phone
    profile.document = profile_update.document

    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile
   