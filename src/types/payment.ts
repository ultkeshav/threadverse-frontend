export interface CreateRazorpayOrderResponse {
  orderId: number;
  paymentId: number;
  razorpayOrderId: string;
  razorpayKeyId: string;
  amount: number;
  amountInPaise: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface VerifyPaymentRequest {
  orderId: number;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface PaymentResponse {
  orderId: number;
  paymentId: number;
  paymentMethod: string;
  paymentStatus: string;
  amount: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpayKeyId?: string;
  currency: string;
}