# FindIt! Web

Aplikasi web internal **Admin Console + Portal Tamu** untuk pencatatan barang temuan dan kehilangan (lost & found) Hotel **Grand Melia Jakarta**. Bagian dari ekosistem **FindIt!** — platform community-powered untuk mempertemukan barang hilang dengan pemiliknya.

Web ini melengkapi aplikasi Android petugas (`findit-work`) dengan konsol operasional front office: antrean verifikasi klaim tamu, master barang temuan housekeeping, arsip laporan, hingga notifikasi WhatsApp ke tamu.

---

## Fitur Utama

- **Login Admin** — autentikasi email + password, token JWT (Bearer) disimpan aman dan dikirim per-request.
- **Dashboard Operasional** — ringkasan KPI, tiket menunggu verifikasi, dan aksi cepat.
- **Verifikasi & Pencocokan** — tabel master klaim tamu dipasangkan dengan kandidat barang temuan housekeeping:
  - Pemeriksaan dua sisi (laporan klaim vs barang fisik HK) dalam satu modal.
  - Pasangkan barang temuan secara manual dengan saran berbasis kamar & kategori.
  - Tandai terverifikasi, lepas relasi / tidak cocok, dan riwayat serah terima (handover).
  - **Notifikasi WhatsApp semi-otomatis** — pratinjau pesan & deep link `wa.me` langsung saat barang terverifikasi.
- **Barang Temuan (All Reports)** — master inventaris campuran laporan `lost` & `found` dari backend, dengan filter tipe/status/tanggal dan ekspor CSV.
- **Laporan Operasional** — arsip laporan kehilangan tamu yang dibaca **langsung dari database** (API-first), konsisten dengan antrean Verifikasi — bukan localStorage.
- **Buat Laporan** — form laporan barang tertinggal bersama (tamu & admin) yang otomatis masuk arsip Laporan dan antrean Verifikasi. Photo upload didukung.
- **Portal Tamu** — register/login tamu, lapor barang tertinggal, dan pantau status laporan (menunggu verifikasi → terverifikasi → selesai).
- **Kelola Admin** — manajemen akun petugas front office.
- **Offline-friendly** — halaman penting punya fallback percabangan ketika backend tidak dapat dihubungi, dan banner peringatan saat mode offline.

---

## Teknologi

| Komponen            | Teknologi                                        |
| ------------------- | ------------------------------------------------ |
| Framework           | React 19 + Vite 8                                |
| Routing             | React Router v7 (URL-driven)                     |
| Ikon                | lucide-react                                     |
| Styling             | CSS modular per view                             |
| State & Persistence | React hooks + localStorage fallback (StorageService) |
| HTTP Client         | `fetch` wrapper `apiClient` (JWT interceptor, timeout 25s) |
| Keamanan            | JWT Bearer token (local/session storage)         |
| Backend             | FindIt API (Go) — REST + upload foto             |

Backend live: `https://139-190-96-203.sslip.io/findit`

---

## Cara Menjalankan (Development)

Persyaratan: **Node.js** (versi yang mendukung Vite 8, disarankan ≥ 20).

```bash
# 1. Install dependencies
npm install

# 2. Siapkan environment variable
cp .env.example .env

# 3. Jalankan dev server (dengan proxy /findit/api ke backend)
npm run dev
```

Buka `http://localhost:5173` — halaman akan otomatis dialihkan ke portal login tamu.

### Build produksi

```bash
# Lint cepat
npm run lint

# Build ke folder dist/
npm run build

# Pratinjau hasil build secara lokal
npm run preview
```

> Selama development, `vite.config.js` mem-proxy `/findit/api` menuju backend `https://139.190.96.203` dengan SNI `139-190-96-203.sslip.io` (karena sertifikat SSL berbasis IP). Mulai dari sini Anda bisa memakai base URL default di `.env`.

---

## Halaman & Routing

### Admin Portal (`/admin/*`)

| Route                   | Halaman                                                   |
| ----------------------- | --------------------------------------------------------- |
| `/admin/login`          | Login admin (gate: tanpa token)                           |
| `/admin`                | Dashboard operasional + KPI                               |
| `/admin/verifikasi`     | Verifikasi & Pencocokan (master-detail + handover)        |
| `/admin/barang-temuan`  | Barang Temuan / All Reports (lost & found)                |
| `/admin/laporan`        | Laporan Operasional (arsip klaim kehilangan, API-first)   |
| `/admin/laporan/baru`   | Buat Laporan (form laporan barang, full-page)             |
| `/admin/kelola-admin`   | Kelola Admin                                              |

### User Portal (`/user/*`)

| Route               | Halaman                                   |
| ------------------- | ----------------------------------------- |
| `/user/login`       | Login tamu                                |
| `/user/register`    | Registrasi tamu                           |
| `/user/onboarding`  | Onboarding pertama kali                   |
| `/user/dashboard`   | Dashboard tamu (status laporan)           |
| `/user/report-form` | Form lapor barang tertinggal              |
| `/user/confirmation`| Konfirmasi laporan (menunggu verifikasi)  |
| `/user/survey`      | Survei pasca-checkout                     |

---

## Tutorial Penggunaan (Admin)

### 1. Login

Buka `/admin/login`, masukkan email & password akun admin yang dibuat via `Kelola Admin`. Token JWT tersimpan otomatis; tanpa token semua halaman admin akan diarahkan kembali ke login.

### 2. Buat Laporan

1. Klik **"+ Buat Laporan"** di halaman **Verifikasi** atau **Laporan**.
2. Isi nomor kamar, deskripsi barang, kategori, dan lokasi perkiraan (foto opsional).
3. Simpan → laporan **langsung masuk database**, tampil di arsip **Laporan** dan antrean **Verifikasi**.

### 3. Verifikasi Klaim Tamu

1. Buka **Verifikasi** (default filter: antrean berjalan).
2. Baris dengan kandidat temuan HK → klik **Verifikasi** untuk membuka perbandingan dua sisi.
3. Gunakan **Pasangkan** untuk mencari & memasangkan barang temuan secara manual bila belum ada kandidat.
4. Klik **Tandai Terverifikasi** — status ter-update, lalu muncul pratinjau **notifikasi WhatsApp** ke nomor tamu (deep link `wa.me`).
5. Ada kecocokan yang salah? Gunakan **Lepas Relasi / Tidak Cocok**.
6. Laporan bisa dihapus permanen dari backend lewat ikon sampah (dengan dialog konfirmasi).

### 4. Laporan Operasional

- Menampilkan **arsip laporan kehilangan tamu live dari database** (sumber data sama persis dengan Verifikasi).
- Filter berdasarkan **status** (`Baru Masuk`, `Dicocokkan`, `Terverifikasi`, `Selesai Handover`, `Ditolak`) + pencarian.
- Klik **Detail** untuk pratinjau lembar dokumen resmi (bisa dicetak), **hapus** untuk menghapus dari backend.
- Bila backend offline, daftar tampil kosong + banner peringatan (bukan data basi dari perangkat).

### 5. Barang Temuan (All Reports)

Master laporan `lost` & `found` dengan filter tipe, status, rentang tanggal, pencarian, dan **ekspor CSV**.

---

## Struktur Proyek

```
src/
├── main.jsx                          # Entry point
├── App.jsx                           # Routing URL-driven + AdminShell (gate auth)
├── services/
│   ├── apiClient.js                  # HTTP base (fetch wrapper, JWT, timeout)
│   ├── ApiService.js                 # REST endpoint (reports, matches, upload, users)
│   ├── api.js                        # API portal tamu (token user)
│   ├── reportStatus.js               # Kanonisasi status (baru→dicocokkan→dikonfirmasi→dikembalikan)
│   ├── StorageService.js             # localStorage fallback (offline friendly)
│   ├── lostReport.js                 # Adaptor submit laporan lost (admin form)
│   ├── matchSync.js                  # Helper keputusan verifikasi (API-first)
│   └── whatsapp.js                   # Penyusun pesan + deep link wa.me
├── models/                           # Model data (Match, Report, Dashboard, dsb.)
├── controllers/                      # Controller per view (pola MVC)
├── views/
│   ├── auth/                         # Login & register (admin & tamu)
│   ├── dashboard/                    # Dashboard admin + komponen (Sidebar, KPI, WA modal)
│   ├── match-review/                 # Halaman Verifikasi & Pencocokan
│   ├── reports/                      # Barang Temuan, Laporan Operasional, Buat Laporan
│   ├── claim-tickets/                # Daftar tiket klaim
│   ├── handover/                     # Serah terima / handover
│   ├── survey/                       # Survei pasca-checkout
│   └── user/                         # Portal tamu (form laporan, konfirmasi)
├── components/                       # Komponen bersama (ConfirmDialog, Logo, dsb.)
└── hooks/                            # Hook bersama (useConfirmDialog)
```

---

## Environment & Konfigurasi

| Variabel              | Deskripsi                            | Default                                   |
| --------------------- | ------------------------------------ | ----------------------------------------- |
| `VITE_API_BASE_URL`   | Base URL REST API FindIt             | `https://139-190-96-203.sslip.io/findit/api` |

Contoh memakai backend lokal saat development:

```bash
# .env
VITE_API_BASE_URL=http://localhost:8000/api
```

Dev proxy di `vite.config.js` sudah disiapkan untuk rute `/findit/api` bila ingin memakai konfigurasi bawaan.

---

## API yang Digunakan (Ringkasan)

| Method | Endpoint            | Fungsi                                   |
| ------ | ------------------- | ---------------------------------------- |
| GET    | `/health`           | Pengecekan ketersediaan backend          |
| POST   | `/login`            | Login admin / tamu (JWT)                 |
| POST   | `/register`         | Registrasi tamu                          |
| GET    | `/reports?type=`    | List laporan (`lost` / `found`)          |
| POST   | `/reports`          | Simpan laporan baru                      |
| PUT    | `/reports/{id}`     | Update laporan                           |
| DELETE | `/reports/{id}`     | Hapus laporan                            |
| POST   | `/upload`           | Upload foto barang (multipart)           |
| GET    | `/matches`          | List relasi match klaim ↔ temuan         |
| POST   | `/matches`          | Buat relasi pasangan manual              |
| PUT    | `/matches/{id}`     | Update status match (verifikasi/handover)|
| GET    | `/users/{id}`       | Ambil profil tamu (nomor WhatsApp)       |

---

## Troubleshooting

| Masalah                                     | Solusi                                                                          |
| ------------------------------------------- | ------------------------------------------------------------------------------- |
| Halaman admin tidak bisa diakses             | Login ulang di `/admin/login`; tanpa JWT halaman dialihkan otomatis ke login     |
| Data tidak muncul / banner "Backend tidak dapat dihubungi" | Periksa `VITE_API_BASE_URL` & koneksi ke backend; halaman Verifikasi/Laporan menampilkan fallback resmi |
| Foto tidak tampil                            | File foto disajikan backend di path `/uploads` relatif host; pastikan base URL benar (suffix `/api` dipotong otomatis) |
| Request menggantung lama                     | `apiClient` punya timeout 25 detik (AbortController) — permintaan akan gagal dengan pesan yang jelas |
| Verifikasi lewat tombol WhatsApp tidak jalan | Pastikan laporan punya nomor telepon/WA tamu; jika tidak tersedia muncul notifikasi `Nomor WhatsApp tamu belum tersedia` |

---

## Lisensi & Ekosistem

- **Web (repo ini):** Admin Console & Portal Tamu React.
- **Android Worker (`findit-work`):** aplikasi petugas untuk quick capture barang temuan (AI).
- **FindIt API (Go):** backend REST yang melayani kedua frontend.