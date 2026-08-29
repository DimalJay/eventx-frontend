import { request } from "@/lib/request";
import { Response, StripeConnectStatus } from "@/types";

export const createCheckoutSession = async (data: {
  eventId: string;
  quantity?: number;
}) => {
  const res: Response = await request("/payment/checkout-session", {
    method: "POST",
    data: {
      eventId: Number(data.eventId),
      quantity: data.quantity ?? 1,
      currency: "lkr",
    },
  });

  if (res && !res.success) {
    throw new Error(res.message || "Unable to start payment.");
  }

  const url =
    res?.data?.url ||
    res?.data?.checkoutUrl ||
    (typeof res?.data === "string" ? res.data : null);

  if (!url) {
    throw new Error("No checkout URL returned by the payment provider.");
  }

  return url;
};

export const connectStripeAccount = async (email: string) => {
  const res: Response = await request("/payment/connect", {
    method: "POST",
    data: { email },
  });

  if (res && !res.success) {
    throw new Error(res.message || "Unable to start Stripe connection.");
  }

  const url =
    res?.data?.url ||
    res?.data?.onboardingUrl ||
    res?.data?.accountLinkUrl ||
    (typeof res?.data === "string" ? res.data : null);

  if (!url) {
    throw new Error("No Stripe connect URL returned by the payment provider.");
  }

  return url;
};

export const getConnectStatus = async (): Promise<StripeConnectStatus> => {
  const res: Response = await request("/payment/connect-status", {
    method: "GET",
  });

  if (res && !res.success) {
    throw new Error(res.message || "Unable to load Stripe status.");
  }

  return (
    res?.data ?? { connected: false, pending: false, account: null }
  );
};

export const disconnectStripe = async (): Promise<void> => {
  const res: Response = await request("/payment/disconnect", {
    method: "POST",
  });

  if (res && !res.success) {
    throw new Error(res.message || "Unable to disconnect Stripe.");
  }
};