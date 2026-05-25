import { getStore } from "@netlify/blobs";

const STATE_KEY = "app-state-v1";

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

export default async (req) => {
  try {
    const store = getStore("sklad-doctor-state");

    if (req.method === "GET") {
      const raw = await store.get(STATE_KEY);
      if (!raw) return json({ data: null });
      try { return json({ data: JSON.parse(raw) }); }
      catch { return json({ data: null }); }
    }

    if (req.method === "PUT") {
      const payload = await req.json();
      if (!payload || typeof payload !== "object") {
        return json({ error: "Saqlash uchun obyekt yuboring." }, 400);
      }
      await store.set(STATE_KEY, JSON.stringify(payload));
      return json({ ok: true });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (error) {
    return json({ error: "Server xatoligi" }, 500);
  }
};
