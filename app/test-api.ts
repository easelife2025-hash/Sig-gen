import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/gemini/signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: "Rudu", vibe: "Professional", styles: [
        {id: 1, label: "Test", desc: "test"}
      ] })
    });
    const text = await res.text();
    console.log(res.status, text.slice(0, 500));
  } catch (e) {
    console.error(e);
  }
}
run();
