// Fonction Serverless Vercel — relaie les demandes de réservation vers le CRM.
//
// Configurez l'URL du webhook dans Vercel (et non dans le code) :
//   Project → Settings → Environment Variables → ZAPIER_WEBHOOK_URL = https://hooks.zapier.com/hooks/catch/.../.../
//
// Le formulaire envoie ses données à /api/lead (même origine, pas de CORS),
// et cette fonction les transmet au webhook côté serveur.

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const url = process.env.ZAPIER_WEBHOOK_URL;
  if (!url) {
    return res.status(500).json({ ok: false, error: "Webhook non configuré (ZAPIER_WEBHOOK_URL manquant)" });
  }

  try {
    let body = req.body || {};
    if (typeof body === "string") {
      try { body = Object.fromEntries(new URLSearchParams(body)); } catch (e) { body = {}; }
    }

    const params = new URLSearchParams();
    ["nom", "telephone", "email", "studio", "source", "date"].forEach(function (k) {
      if (body[k] != null && body[k] !== "") params.append(k, String(body[k]));
    });

    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });

    if (!upstream.ok) {
      return res.status(502).json({ ok: false, error: "Le CRM a renvoyé le statut " + upstream.status });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "Erreur lors de l'envoi" });
  }
};
