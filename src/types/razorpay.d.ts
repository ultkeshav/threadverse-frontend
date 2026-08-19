export {};

declare global {
  interface RazorpayPaymentResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }

  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    order_id: string;

    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };

    notes?: Record<string, string>;

    theme?: {
      color?: string;
    };

    modal?: {
      confirm_close?: boolean;
      ondismiss?: () => void;
    };

    handler: (
      response: RazorpayPaymentResponse,
    ) => void;
  }

  interface RazorpayInstance {
    open: () => void;
    on: (
      event: string,
      callback: (response: unknown) => void,
    ) => void;
  }

  interface Window {
    Razorpay?: new (
      options: RazorpayOptions,
    ) => RazorpayInstance;

    __threadverseRazorpayPromise?: Promise<void>;
  }
}