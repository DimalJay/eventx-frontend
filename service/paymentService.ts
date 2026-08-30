import { request } from "@/lib/request";
import { Response, StripeConnectStatus } from "@/types";

const ALREADY_PURCHASED_PATTERNS = [
  /already (purchased|bought|registered|booked)/i,
  /already own/i,
  /already have (a )?ticket/i,
  /duplicate (registration|purchase)/i,
];

const friendlyMessage = (raw: string): string => {
  if (ALREADY_PURCHASED_PATTERNS.some((re) => re.test(raw))) {
    return "You have already purchased a ticket for this event. Check your email for the confirmation.";
  }
  if (/invalid email/i.test(raw)) {
    return "Unable to start payment for this event. Please try again or contact support.";
  }
  return raw;
};

export const createCheckoutSession = async (data: {
  eventId: string;
  quantity?: number;
}) => {
  let res: Response;
  try {
    res = await request("/payment/checkout-session", {
      method: "POST",
      data: {
        eventId: Number(data.eventId),
        quantity: data.quantity ?? 1,
        currency: "lkr",
      },
    });
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Unable to start payment.";
    throw new Error(friendlyMessage(msg));
  }

  if (res && !res.success) {
    throw new Error(friendlyMessage(res.message || "Unable to start payment."));
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