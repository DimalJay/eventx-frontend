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
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-zinc-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-pop">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-danger">
          Stripe
        </p>

        <h3 className="mt-2 font-display text-xl font-medium tracking-tight text-zinc-900">
          Disconnect this Stripe account?
        </h3>

        <p className="mt-2 text-sm leading-6 text-zinc-600">
          {accountEmail ? (
            <>
              The account{" "}
              <span className="font-semibold text-zinc-900">{accountEmail}</span>{" "}
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
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full bg-danger px-4 text-sm font-semibold text-white transition hover:bg-red-600"
            onClick={onConfirm}
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}