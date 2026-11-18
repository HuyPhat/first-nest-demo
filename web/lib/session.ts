import { cookies } from "next/headers";
import { apiUrl } from "./api-url";

// Calls Me from the server, forwarding the login cookie. Shared by the profile page and the
// login and register pages.
export async function fetchMe() {
  return fetch(`${apiUrl()}/auth/me`, { headers: { cookie: (await cookies()).toString() } });
}
