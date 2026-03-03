const fs = require("fs");
const path = require("path");

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function colorize(text, color) {
  return colors[color] + text + colors.reset;
}

// Daftar pola kata yang akan dihapus (tanpa tanda kurung)
const patterns = [
  "addon",
  "MDF",
  "world_template",
  "skin_pack",
  "Extract Zip",
  "[_]",
  "[]",
];

/**
 * Membersihkan nama file dari pola-pola yang tidak diinginkan.
 * @param {string} filename - Nama file asli.
 * @returns {string} Nama file yang sudah dibersihkan.
 */
function cleanFileName(filename) {
  let cleaned = filename;

  // Hapus setiap pola yang muncul dalam tanda kurung (case-insensitive)
  patterns.forEach((p) => {
    // Escape karakter khusus regex
    const escaped = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\(${escaped}\\)`, "gi");
    cleaned = cleaned.replace(regex, "");
  });

  // Bersihkan spasi berlebih
  cleaned = cleaned
    .replace(/\s+/g, " ") // ganti spasi ganda dengan satu spasi
    .trim() // hapus spasi di awal/akhir
    .replace(/\s+\./g, "."); // hapus spasi sebelum titik ekstensi

  return cleaned;
}

/**
 * Memproses semua file dalam folder yang diberikan.
 * @param {string} folderPath - Path folder yang akan diproses.
 */
function processFolder(folderPath) {
  const targetPath = path.resolve(folderPath);
  console.log(colorize(`Memproses folder: ${targetPath}`, "blue"));

  // Baca daftar file dalam folder
  let files;
  try {
    files = fs.readdirSync(targetPath);
  } catch (err) {
    console.error(colorize(`Gagal membaca folder: ${err.message}`, "red"));
    return;
  }

  let renamedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  files.forEach((file) => {
    const filePath = path.join(targetPath, file);

    // Lewati jika bukan file (misalnya direktori)
    let stats;
    try {
      stats = fs.statSync(filePath);
    } catch (err) {
      console.error(
        colorize(`Gagal membaca stat ${file}: ${err.message}`, "red"),
      );
      errorCount++;
      return;
    }
    if (!stats.isFile()) return;

    const newName = cleanFileName(file);

    // Jika nama tidak berubah, lewati
    if (newName === file) {
      console.log(colorize(`Lewati (tidak berubah): ${file}`, "yellow"));
      skippedCount++;
      return;
    }

    const newPath = path.join(targetPath, newName);

    // Cek apakah file dengan nama baru sudah ada
    if (fs.existsSync(newPath)) {
      console.log(
        colorize(`Lewati (nama sudah ada): ${file} -> ${newName}`, "yellow"),
      );
      skippedCount++;
      return;
    }

    // Lakukan rename
    try {
      fs.renameSync(filePath, newPath);
      console.log(colorize(`Berhasil: ${file} -> ${newName}`, "green"));
      renamedCount++;
    } catch (err) {
      console.error(
        colorize(`Gagal rename ${file} -> ${newName}: ${err.message}`, "red"),
      );
      errorCount++;
    }
  });

  // Tampilkan ringkasan
  console.log("\nRingkasan:");
  console.log(colorize(`Berhasil rename: ${renamedCount}`, "green"));
  console.log(colorize(`Lewati: ${skippedCount}`, "yellow"));
  console.log(colorize(`Gagal: ${errorCount}`, "red"));
}

// Bagian utama: baca argumen command line
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Penggunaan: node format.js <folder_path>");
  console.log("Contoh: node format.js /sdcard/telegram/");
  process.exit(1);
}

const folderPath = args[0];
processFolder(folderPath);
