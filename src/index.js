export default {
  async scheduled(event, env, ctx) {
    const ukParts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour12: false
    }).formatToParts(new Date());

    const parts = Object.fromEntries(ukParts.map(p => [p.type, p.value]));

    const weekday = parts.weekday;
    const hour = parts.hour;
    const minute = parts.minute;

    if (!(weekday === "Mon" && hour === "10" && minute === "00")) {
      return;
    }

    const dateStr = `${parts.year}-${parts.month}-${parts.day}`;

    try {
      const res = await fetch(env.OUTTREACH_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: `TT-${dateStr}`,
          date: dateStr
        })
      });

      console.log(`outreach Trigger Response: ${res.status}`);
    } catch (err) {
      console.error(" Outreach Trigger Error:", err);
    }
  }
};
