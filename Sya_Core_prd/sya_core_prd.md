# Product Requirements Document (PRD) - Sya-Core

Dokumen ini merangkum spesifikasi, arsitektur, panduan pengembangan, serta aturan bisnis untuk platform **Sya-Core**, sebuah sistem manajemen akuntansi berlandaskan prinsip syariah.

---

## 1. README (Project Overview)
**Sya-Core** adalah platform *Core Banking* dan manajemen akuntansi berbasis web yang dirancang khusus untuk Lembaga Keuangan Mikro (LKM) Syariah, Koperasi Syariah, dan Baitul Maal wat Tamwil (BMT). 
Dibangun menggunakan teknologi modern (Next.js 14 dan Supabase), Sya-Core mendukung sistem *multi-akad*, manajemen keanggotaan, serta pelacakan buku besar (*ledger*) operasional maupun Ziswaf (Zakat, Infaq, Sadaqah, Wakaf) dengan antarmuka yang intuitif dan berfokus pada pengalaman pengguna yang premium.

---

## 2. ARCHITECTURE
- **Frontend**: Next.js 14 (App Router), React, dan Tailwind CSS. Desain menggunakan pendekatan *glassmorphism* dan estetika modern untuk memberikan kesan premium.
- **Backend & Database**: Supabase (PostgreSQL) yang menangani manajemen *database* relasional, autentikasi, serta aturan keamanan basis data.
- **Pola Arsitektur**: *Modular Monolith*. Pemisahan yang jelas antara *User Interface* (UI), *Business Logic* (layanan akad/transaksi), dan *Data Access Layer*.
- **State Management**: React Context/Zustand untuk *state* aplikasi lokal, dan React Query/SWR untuk *server state management*.
- **Deployment**: Vercel (untuk skalabilitas dan performa CI/CD yang optimal).

---

## 3. COMPLIANCE
Sistem ini dirancang untuk mematuhi regulasi keuangan dan prinsip-prinsip syariah secara ketat:
- **Kepatuhan Syariah**: Bebas dari unsur Riba (bunga), Gharar (ketidakpastian/spekulasi), dan Maysir (perjudian).
- **Regulasi Lokal**: Mengadopsi standar pelaporan keuangan dari Otoritas Jasa Keuangan (OJK) dan Kementerian Koperasi & UKM untuk LKM Syariah.
- **Auditabilitas**: Penerapan jejak audit (*audit trail*) yang bersifat *immutable* (tidak dapat diubah) pada setiap jurnal dan transaksi.

---

## 4. AI_SPEC (AI Integration Specifications)
Sya-Core dipersiapkan untuk integrasi kecerdasan buatan guna meningkatkan efisiensi operasional LKM:
- **Analisis Risiko Pembiayaan (*Credit Scoring*)**: AI untuk menilai profil risiko calon anggota atau *mudharib* berdasarkan data historis transaksi dan demografis.
- **Deteksi Anomali Transaksi (*Fraud Detection*)**: Mengidentifikasi potensi kecurangan atau kesalahan *human error* dalam pencatatan jurnal (misal: nominal yang tidak wajar).
- **Asisten Virtual (*Copilot*)**: Chatbot berbasis AI untuk membantu *teller* atau manajemen dalam mencari data anggota, kebijakan syariah, dan panduan penggunaan sistem secara *real-time*.

---

## 5. DEV_GUIDE
Panduan bagi *developer* yang berkontribusi pada repositori Sya-Core:
- **Standar Kode**: Wajib menggunakan TypeScript (*strict mode*), ESLint, dan Prettier.
- **Komponen UI**: Dibangun menggunakan prinsip *Atomic Design*. Dilarang menggunakan *inline styles*; maksimalkan penggunaan utilitas Tailwind CSS.
- **Git Workflow**: Menerapkan *Git Flow* standar (`main`, `develop`, `feature/*`, `hotfix/*`). Setiap PR (*Pull Request*) wajib menyertakan deskripsi fungsionalitas.
- **Testing**: 
  - *Unit Testing* (Jest) untuk memastikan keakuratan formula perhitungan bisnis (misalnya kalkulasi margin, bagi hasil, dan porsi penyusutan).
  - *End-to-End Testing* (Cypress/Playwright) untuk alur transaksi utama.

---

## 6. SECURITY
Protokol keamanan berlapis untuk melindungi data finansial dan privasi anggota:
- **Otentikasi & Otorisasi**: Implementasi *Role-Based Access Control* (RBAC) (Superadmin, Manajer, Kasir, Anggota) via Supabase Auth.
- **Row Level Security (RLS)**: Diaktifkan di seluruh tabel Supabase untuk memastikan pengguna hanya bisa mengakses data (seperti cabang/transaksi) yang menjadi hak mereka.
- **Enkripsi Data**: Enkripsi otomatis *data at rest* oleh Supabase dan *data in transit* via HTTPS/TLS 1.2+.
- **Backup & Recovery**: Pencadangan *database* otomatis (*Automated Daily Backups*) dengan kapabilitas Point-in-Time Recovery (PITR).

---

## 7. BUSINESS_RULES (Berdasarkan PSAK Akuntansi Syariah)
Aturan bisnis (*Business Logic*) pada sistem Sya-Core dibangun dengan merujuk langsung pada **Pernyataan Standar Akuntansi Keuangan (PSAK) Syariah** di Indonesia:

### A. PSAK 101: Penyajian Laporan Keuangan Syariah
Sistem otomatis menyusun dan menyajikan komponen laporan keuangan lengkap:
1. Neraca (Laporan Posisi Keuangan).
2. Laporan Laba Rugi.
3. Laporan Arus Kas.
4. Laporan Perubahan Ekuitas.
5. **Laporan Rekonsiliasi Pendapatan dan Bagi Hasil** (Khas Syariah).
6. **Laporan Sumber dan Penyaluran Dana Zakat** (Khas Syariah).
7. **Laporan Sumber dan Penyaluran Dana Kebajikan/Qardh** (Khas Syariah).

### B. PSAK 102: Akuntansi Murabahah (Jual Beli dengan Margin)
- **Pencatatan Aset**: Aset murabahah diinventarisasi sebesar biaya perolehannya.
- **Pengakuan Margin**: Keuntungan (margin) diakui secara proporsional seiring berjalannya periode angsuran/akad jika dilakukan secara tangguh.
- **Uang Muka (*Urbun*)**: Jika anggota menyetor uang muka, sistem mencatatnya sebagai kewajiban (titipan) sebelum akad disepakati, dan dikonversi menjadi pengurang piutang murabahah setelah akad.
- **Potongan (*Muqasah*)**: Sistem mendukung kalkulasi potongan pelunasan dipercepat sesuai kebijakan LKM.

### C. PSAK 103 (Salam) & PSAK 104 (Istishna)
- **Salam**: Pencatatan piutang salam saat modal/uang diserahkan 100% di awal kepada nasabah, dan pelunasan diakui saat barang pesanan diserahkan.
- **Istishna**: Digunakan untuk pembiayaan manufaktur/konstruksi. Pendapatan istishna margin dihitung menggunakan **metode persentase penyelesaian** untuk durasi lebih dari satu tahun buku.

### D. PSAK 105: Akuntansi Mudharabah (Bagi Hasil - Investasi)
- **Dana Syirkah Temporer**: Dana dari deposan/investor dicatat secara terpisah dari kewajiban (liabilitas) dan ekuitas.
- **Pengakuan Pendapatan**: Pembagian hasil/laba diakui berdasarkan penerimaan kas aktual (*cash basis*), bukan basis akrual, untuk mencegah pembagian keuntungan yang belum terwujud.
- **Kerugian**: Apabila terjadi kerugian bisnis (bukan kelalaian pengelola/*mudharib*), kerugian akan ditanggung oleh pemilik modal (*shahibul maal*), dan sistem akan mengurangi saldo investasi secara proporsional.

### E. PSAK 106: Akuntansi Musyarakah (Kemitraan)
- **Setoran Modal**: Setoran berupa kas maupun aset non-kas akan dinilai berdasarkan nilai wajar (*fair value*) pada saat akad disepakati.
- **Distribusi Hasil**: 
  - Keuntungan dibagi berdasarkan *nisbah* (rasio) yang disepakati sejak awal.
  - Kerugian (jika ada) ditanggung secara otomatis oleh sistem berdasarkan proporsi porsi modal masing-masing mitra (LKM dan Anggota).

### F. PSAK 109: Akuntansi Zakat dan Infak/Sedekah
- **Pemisahan Buku Besar (*Ledger Segregation*)**: Sistem Sya-Core menjamin pemisahan mutlak antara rekening/dana operasional LKM dengan dana Ziswaf.
- **Penerimaan & Penyaluran**: Transaksi ziswaf diakui sebagai penambahan atau pengurangan saldo dana langsung pada saat kas diterima atau disalurkan ke *mustahiq*.
- **Dana Amil**: Sistem memiliki mekanisme otomatisasi persentase hak amil (pengelola) dari dana zakat/infak yang terhimpun sesuai ketentuan yang dikonfigurasi.
