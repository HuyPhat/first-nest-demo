"use client";

export function LogoutButton() {
  async function logOut() {
    // Clears the HttpOnly login cookie through the /api rewrite. If the call fails the cookie simply
    // expires within the hour, so the User still leaves for the login page.
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    // A full page load, not router.push: Next keeps visited pages in memory (the filled-in Login form,
    // the cached profile), and a logged-out session should leave none of it behind.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- deliberate, see above
    window.location.assign("/login");
  }

  return (
    <button
      type="button"
      onClick={logOut}
      className="rounded-md text-sm font-medium text-accent transition-colors duration-150 hover:text-accent-hover"
    >
      Log out
    </button>
  );
}
