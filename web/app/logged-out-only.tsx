import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchMe } from "@/lib/session";

// Wraps what only a logged-out visitor should see (the login and register forms). A logged-in User
// goes to the profile; Log out there is how they switch User. No cookie means no API call, and
// anything but a 200 from Me (expired token, API down) shows the form as usual.
export async function LoggedOutOnly({ children }: { children: React.ReactNode }) {
  if ((await cookies()).has("access_token") && (await fetchMe().catch(() => null))?.ok) {
    redirect("/profile");
  }
  return children;
}
