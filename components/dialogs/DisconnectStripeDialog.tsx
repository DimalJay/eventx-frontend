"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  accountEmail?: string;
};

export default function DisconnectStripeDialog({
  open,
  onClose,
  onConfirm,
  accountEmail,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
          Stripe
        </p>

        <h3 className="mt-2 text-xl font-semibold text-black">
          Disconnect this Stripe account?
        </h3>

        <p className="mt-2 text-sm leading-6 text-black/60">
          {accountEmail ? (
            <>
              The account{" "}
              <span className="font-semibold text-black">{accountEmail}</span>{" "}
              will be disconnected from EventX. Paid events you run will stop
              accepting ticket payments until you connect a new account.
            </>
          ) : (
            <>
              This Stripe account will be disconnected from EventX. Paid
              events you run will stop accepting ticket payments until you
              connect a new account.
            </>
          )}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold uppercase tracking-widest text-black transition hover:border-black/40"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full bg-red-500 px-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-600"
            onClick={onConfirm}
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}