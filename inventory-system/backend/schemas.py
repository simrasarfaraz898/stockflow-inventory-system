from pydantic import BaseModel, EmailStr, validator
from typing import List, Optional
from datetime import datetime
from models import OrderStatus

# ── Product Schemas ───────────────────────────────────────
class ProductBase(BaseModel):
    name: str
    sku: str
    description: Optional[str] = None
    price: float
    stock_quantity: int
    category: Optional[str] = None

    @validator("price")
    def price_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Price must be positive")
        return v

    @validator("stock_quantity")
    def stock_must_be_non_negative(cls, v):
        if v < 0:
            raise ValueError("Stock quantity cannot be negative")
        return v

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock_quantity: Optional[int] = None
    category: Optional[str] = None

class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ── Customer Schemas ──────────────────────────────────────
class CustomerBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class Customer(CustomerBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ── Order Schemas ─────────────────────────────────────────
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

    @validator("quantity")
    def quantity_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Quantity must be positive")
        return v

class OrderItem(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    product: Optional[Product] = None

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]
    notes: Optional[str] = None

    @validator("items")
    def items_must_not_be_empty(cls, v):
        if not v:
            raise ValueError("Order must have at least one item")
        return v

class OrderStatusUpdate(BaseModel):
    status: OrderStatus

class Order(BaseModel):
    id: int
    customer_id: int
    status: OrderStatus
    total_amount: float
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    customer: Optional[Customer] = None
    items: List[OrderItem] = []

    class Config:
        from_attributes = True
