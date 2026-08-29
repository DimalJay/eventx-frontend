import { Suspense } from "react";
import VerifyEmailPage from "../../components/pages/VerifyEmailPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPage />
    </Suspense>
  );
}
