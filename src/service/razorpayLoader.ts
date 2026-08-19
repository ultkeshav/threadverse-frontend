const RAZORPAY_SCRIPT_URL =
  "https://checkout.razorpay.com/v1/checkout.js";

export function loadRazorpay(): Promise<void> {
  if (window.Razorpay) {
    return Promise.resolve();
  }

  if (window.__threadverseRazorpayPromise) {
    return window.__threadverseRazorpayPromise;
  }

  window.__threadverseRazorpayPromise =
    new Promise<void>((resolve, reject) => {
      const existingScript =
        document.querySelector<HTMLScriptElement>(
          `script[src="${RAZORPAY_SCRIPT_URL}"]`,
        );

      if (existingScript) {
        existingScript.addEventListener(
          "load",
          () => resolve(),
          { once: true },
        );

        existingScript.addEventListener(
          "error",
          () =>
            reject(
              new Error(
                "Unable to load Razorpay Checkout.",
              ),
            ),
          { once: true },
        );

        return;
      }

      const script =
        document.createElement("script");

      script.src = RAZORPAY_SCRIPT_URL;
      script.async = true;

      script.onload = () => resolve();

      script.onerror = () =>
        reject(
          new Error(
            "Unable to load Razorpay Checkout.",
          ),
        );

      document.body.appendChild(script);
    });

  return window.__threadverseRazorpayPromise;
}