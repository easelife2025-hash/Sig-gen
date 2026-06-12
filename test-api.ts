import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/gemini/signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: "Alex", vibe: "Professional", styles: [
        {id: 1, label: "test", desc: "test"}
      ] })
    });
    console.log(res.status, await res.text());
  } catch (e) {
    console.error(e);
  }
}
run();
