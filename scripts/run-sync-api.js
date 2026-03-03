const fetch = require('node-fetch');

async function run() {
  console.log("Iniciando sync...");
  try {
    const res = await fetch('http://localhost:3000/api/admin/distribuidores/1511df09-1f4a-4e68-9f8c-05cd06be6269/sync', {
      method: 'POST'
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Erro:", e);
  }
}
run();
