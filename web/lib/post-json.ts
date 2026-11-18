// POST a JSON body to the API through the /api rewrite. A network failure gives null instead of throwing,
// so callers can give it its own message.
export const postJson = (path: string, body: unknown) =>
  fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);
