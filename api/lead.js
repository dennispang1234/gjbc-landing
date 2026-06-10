// Vercel serverless function — creates a lead in Notion "PT Lead Tracker 2.0".
// Requires env var NOTION_TOKEN (a Notion integration token with access to the DB).

const NOTION_DB_ID = "34c2d50e-7802-804f-b6dc-dc2135287af0"; // 📏 PT Lead Tracker 2.0

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const token = process.env.NOTION_TOKEN;
  if (!token) {
    res.status(500).json({ ok: false, error: "Server not configured (missing NOTION_TOKEN)" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  // Honeypot: bots fill hidden "company" field — silently accept and drop.
  if (body.company) { res.status(200).json({ ok: true }); return; }

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim();
  const goal = String(body.goal || "").trim();

  if (!name || !phone || !email) {
    res.status(400).json({ ok: false, error: "Missing required fields" });
    return;
  }

  const notes =
    "Website lead from the landing page (free consult + movement assessment)." +
    (goal ? " Goal: " + goal + "." : "");

  const properties = {
    "Name": { title: [{ text: { content: name.slice(0, 200) } }] },
    "Phone": { phone_number: phone.slice(0, 60) },
    "Email": { rich_text: [{ text: { content: email.slice(0, 200) } }] },
    "Notes": { rich_text: [{ text: { content: notes.slice(0, 1900) } }] },
    "Follow-Up Stage": { select: { name: "Pending" } },
    "Qualified?": { select: { name: "Needs Review" } }
  };

  try {
    const r = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ parent: { database_id: NOTION_DB_ID }, properties })
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error("Notion create failed:", r.status, detail);
      res.status(502).json({ ok: false, error: "Could not save lead" });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Lead handler error:", e);
    res.status(500).json({ ok: false, error: "Server error" });
  }
};
