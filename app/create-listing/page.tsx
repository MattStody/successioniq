import { Suspense } from "react";
import CreateListingClient from "./CreateListingClient";

export default function CreateListingPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
          <div className="text-slate-400 text-sm">Loading…</div>
        </div>
      }
    >
      <CreateListingClient />
    </Suspense>
  );
}
