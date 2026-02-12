const fs = require('fs');
const readline = require('readline');

// Konfigurasi File Output
const OUTPUT_FILE = 'result.txt';

// Konfigurasi Interface Terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Fungsi untuk memformat nama channel
 * Input: "📃 | Rules Server"
 * Output: "📃｜rules-server"
 */
function formatChannelName(input) {
  // Cek apakah user menggunakan separator | (biasa) atau ｜ (fullwidth)
  // Kita akan split berdasarkan yang ditemukan
  let parts;
  if (input.includes('|')) {
    parts = input.split('|');
  } else if (input.includes('｜')) {
    parts = input.split('｜');
  } else {
    // Jika tidak ada separator, anggap semuanya adalah teks channel biasa
    return input.trim().toLowerCase().replace(/\s+/g, '-');
  }

  // Ambil Emoji (Kiri) dan Teks (Kanan)
  const emoji = parts[0].trim();
  let text = parts.slice(1).join(' ').trim(); // Gabung sisanya jika ada split lebih

  // Logic Discord Channel: Lowercase & Spasi jadi Dash
  text = text.toLowerCase().replace(/\s+/g, '-');

  // Gabungkan kembali dengan separator estetik (｜)
  return `${emoji}｜${text}`;
}

/**
 * Fungsi untuk menyimpan ke file
 */
function saveToFile(content) {
  try {
    fs.appendFileSync(OUTPUT_FILE, content + '\n', 'utf8');
    return true;
  } catch (err) {
    console.error("Gagal menyimpan file:", err);
    return false;
  }
}

// --- PROGRAM UTAMA ---

console.clear();
console.log("\x1b[36m%s\x1b[0m", "=== DISCORD CHANNEL NAME COLLECTOR ===");
console.log(`Mode: Input akan otomatis disimpan ke '${OUTPUT_FILE}'`);
console.log("Format Input: <Emoji> | <Nama Channel>");
console.log("Contoh: 📃 | Rules Server  ->  Hasil: 📃｜rules-server");
console.log("Ketik 'exit' atau tekan Ctrl+C untuk selesai.\n");

// Buat/Reset file header session (Opsional, agar rapi)
const timestamp = new Date().toLocaleString();
fs.appendFileSync(OUTPUT_FILE, `\n--- Session: ${timestamp} ---\n`);

rl.setPrompt('Input > ');
rl.prompt();

rl.on('line', (line) => {
  const input = line.trim();

  if (input.toLowerCase() === 'exit') {
    rl.close();
    return;
  }

  if (input) {
    // 1. Proses Format
    const formatted = formatChannelName(input);

    // 2. Simpan ke File
    saveToFile(formatted);

    // 3. Feedback ke User
    console.log(`✅ Disimpan: \x1b[32m${formatted}\x1b[0m`);
  }

  rl.prompt();

}).on('close', () => {
  console.log(`\n\nSelesai! Silakan cek file \x1b[33m${OUTPUT_FILE}\x1b[0m untuk menyalin hasilnya.`);
  process.exit(0);
});
