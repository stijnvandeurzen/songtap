// functions/push-to-esp.js
export async function onRequestPost({ request }) {
  try {
    const token = await request.text();  // raw body is the token string
    if (!token) {
      return new Response("No token", { status: 400 });
    }
    // Attempt to forward token to ESP32 device
    const espRes = await fetch("http://192.168.1.30/token", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: token
    });
    if (!espRes.ok) {
      return new Response("ESP32 error", { status: espRes.status });
    }
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("push-to-esp error:", err);
    return new Response(err.message || "Push failed", { status: 500 });
  }
}
