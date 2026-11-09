# ourlives.web.id

Website galeri kenangan kelas bergaya sederhana ala website era 1990-an, berbasis HTML, CSS, JavaScript, dan JSON. Prioritas desain adalah fungsi dan keterbacaan. Tidak membutuhkan backend atau database.

## 1. Menjalankan di komputer

Jangan membuka `index.html` langsung dengan alamat `file://`, karena browser dapat memblokir `fetch("data.json")`.

Cara mudah:
1. Buka folder proyek di Visual Studio Code.
2. Jalankan extension **Live Server**.
3. Klik **Go Live**.
4. Website akan terbuka melalui alamat lokal, biasanya `http://127.0.0.1:5500`.

Alternatif jika Python terpasang:

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000`.

## 2. Menambahkan kenangan baru

1. Siapkan foto dan ubah ke format WebP.
2. Letakkan foto di `assets/images/momen/`.
3. Tambahkan objek baru ke dalam array di `data.json` (pisahkan objek dengan koma).
4. Simpan dan refresh website.

Contoh:

```json
{
  "id": "momen-03",
  "judul_kegiatan": "Judul kegiatan",
  "kategori": "Sekolah",
  "tanggal": "2026-11-09",
  "deskripsi": "Ceritakan sedikit tentang momen ini.",
  "foto": [
    {
      "src": "assets/images/momen/nama-foto.webp",
      "alt": "Deskripsi singkat foto"
    }
  ]
}
```

Kategori yang tersedia:
- `Praktek`
- `Sekolah`
- `Hangout`
- `Random`

Format tanggal wajib `YYYY-MM-DD`, misalnya `2026-11-09`.

Satu kegiatan dapat memiliki beberapa foto. Tambahkan beberapa objek `{ "src": "...", "alt": "..." }` di dalam array `foto`.

## 3. Mengganti foto hero

Ganti file `assets/images/hero/class-photo.webp` dengan foto kelas milikmu. Pertahankan nama file tersebut agar HTML tidak perlu diubah.

## 4. Deploy ke GitHub Pages

1. Buat repository GitHub, misalnya `ourlives`.
2. Upload seluruh isi folder proyek ke root repository.
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/ (root)`, lalu Save.
6. Tunggu GitHub Pages menerbitkan website.

## 5. Menghubungkan domain ourlives.web.id

Di **Settings → Pages → Custom domain**, masukkan:

```text
ourlives.web.id
```

Simpan. Tambahkan file bernama `CNAME` di root repository dengan isi:

```text
ourlives.web.id
```

Kemudian atur DNS di penyedia domain:
- Buat record `CNAME` untuk host `www` yang mengarah ke `USERNAME.github.io`.
- Untuk domain apex `ourlives.web.id`, gunakan A records GitHub Pages yang tercantum di dokumentasi resmi GitHub Pages.
- Jika penyedia DNS mendukung ALIAS/ANAME atau CNAME flattening, opsi itu dapat digunakan untuk apex sesuai petunjuk penyedia.

Setelah DNS terpropagasi, aktifkan **Enforce HTTPS** di pengaturan Pages. Ikuti nilai DNS terkini dari dokumentasi GitHub Pages, karena alamat IP dapat berubah.

## 6. Catatan penting

- Nama file dan path foto harus sama persis, termasuk huruf besar/kecil.
- Gunakan ukuran gambar yang wajar. Untuk foto galeri, lebar sekitar 1200–1800 px biasanya sudah cukup.
- Usahakan ukuran WebP sekitar 100–400 KB per foto, tergantung detail gambar.
- `loading="lazy"` diterapkan pada foto galeri; foto hero dimuat lebih awal.
- Tema awal mengikuti pengaturan perangkat. Tombol tema memungkinkan beralih dark/light dan kembali ke adaptive.
- Website ini tidak memiliki sistem login atau upload foto dari pengunjung. Penambahan foto dilakukan melalui repository GitHub.
