import { Suspense } from "react";
import CheckEmailPage from "../../components/pages/CheckEmailPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CheckEmailPage />
    </Suspense>
  );
}
