# Dashboard Workplan Nadifa (2–7 November 2026)

Dashboard statis untuk memantau tugas, status, catatan, tautan bukti, dan laporan mingguan. Tidak memerlukan server atau database.

## Publikasikan via GitHub Pages

1. Masuk ke github.com dan buat **repository baru** bernama `nadifa-workplan`.
2. Unggah **index.html, styles.css, app.js, data.js, README.md** ke bagian utama repository (root), kemudian **Commit changes**. Jangan hanya mengunggah ZIP.
3. Buka **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main → Folder: /(root) → Save**.
4. Setelah deployment berhasil, link biasanya menjadi `https://USERNAME.github.io/nadifa-workplan/` (ganti USERNAME dengan username Anda).
5. Bagikan URL tersebut kepada bos; beliau dapat memantau tanpa login untuk situs publik.

## Mengubah perkembangan dan membuatnya tampil untuk bos

1. Buka dashboard melalui browser Anda → klik **Mode Edit**.
2. Klik **Ubah** pada baris tugas, isi status, catatan dan URL bukti bila ada, lalu **Simpan ke browser**.
3. Klik **Unduh data.js terbaru**. Dashboard menyimpan draft sementara di browser Anda, bukan secara otomatis ke GitHub.
4. Di repo GitHub, pilih **Add file → Upload files**, unggah `data.js` baru ke lokasi yang sama dan konfirmasi penggantian jika ditawarkan; atau buka `data.js` dan edit isinya di GitHub. Pastikan file baru menggantikan `data.js` lama di root dan lakukan commit.
5. Setelah GitHub Pages memublikasikan commit, buka ulang situs untuk memeriksa hasilnya. **Catatan:** di browser yang Anda gunakan untuk mengedit, perubahan lokal tersimpan sehingga Anda mungkin harus klik **Batalkan perubahan lokal** untuk memeriksa versi publik yang sesungguhnya.

## Keamanan dan keterbatasan

- GitHub Pages **tidak** menyimpan pengeditan ke repository secara otomatis; ini sengaja dibuat tanpa token atau kredensial di sisi browser.
- GitHub Pages pada dasarnya **dapat diakses publik**, bahkan ketika repo privat pada jenis paket tertentu. Jangan unggah laporan internal, data klien, nomor pribadi, artikel berlisensi, atau bukti rahasia. Untuk bukti internal, gunakan tautan dokumen yang hanya bisa dibuka oleh pemilik akses yang diizinkan.
- Angka progres adalah input manual, bukan klaim penyelesaian aktual. Semua tugas dibuat dengan status awal `Belum dimulai`.
- 7 November 2026 jatuh pada Sabtu: diposisikan sebagai hari review tambahan, bukan otomatis hari kerja yang disetujui.
- Pembaruan data akan terpengaruh cache lokal browser. Gunakan tombol batalkan perubahan lokal untuk kembali ke versi publik.

## Struktur

- `index.html` — tampilan dashboard
- `styles.css` — gaya responsif
- `app.js` — kalkulasi, filter, penyuntingan lokal, ekspor dan laporan
- `data.js` — satu-satunya sumber data publik yang perlu diperbarui
