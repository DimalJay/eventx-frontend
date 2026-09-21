import PaymentResultPage from "@/components/pages/PaymentResultPage";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  return <PaymentResultPage kind="success" sessionId={session_id} />;
}