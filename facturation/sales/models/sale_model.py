from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer
from sqlalchemy.orm import relationship
from facturation.database.base import Base

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User")
    details = relationship("SaleDetail", back_populates="sale")

    @property
    def seller_name(self) -> str:
        if self.user is None:
            return "Vendedor"
        if getattr(self.user, "profile", None) is not None and getattr(self.user.profile, "full_name", None):
            return self.user.profile.full_name
        return self.user.email or "Vendedor"

    @property
    def seller_email(self) -> str:
        return self.user.email if self.user is not None else ""
