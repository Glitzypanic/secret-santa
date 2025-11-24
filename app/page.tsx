import { redirect } from "next/navigation";

export default function Page() {
  // Redirect root to the landing page which now lives at /landing
  redirect("/landing");
}
