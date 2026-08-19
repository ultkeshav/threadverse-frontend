export interface AddCartItemRequest {
  variantId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartItem {
  cartItemId: number;
  variantId: number;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  cartId: number;
  items: CartItem[];
  totalAmount: number;
}