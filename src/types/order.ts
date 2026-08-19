export type PaymentMethod =
  | "COD"
  | "UPI"
  | "CARD"
  | "NET_BANKING";

export interface CreateOrderRequest {
  addressId: number;
  paymentMethod: PaymentMethod;
}

export interface OrderItem {
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  orderId: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  items: OrderItem[];
}

export interface UpdateOrderStatusRequest {
  status: string;
}