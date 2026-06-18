# Daftar Backlog Pengembangan - Sya-Core

Dokumen ini berisi daftar *backlog* (*Product Backlog Items*) berdasarkan tinjauan dari spesifikasi dokumen PDF (`Sya-Core.pdf`), PRD (`sya_core_prd.md`), serta apa yang telah diimplementasikan sejauh ini di sisi UI (`developer_Reference.md`).

---

## Epic 1: Database & Backend Foundation (Supabase)
*Fokus pada penyambungan UI yang sudah ada dengan infrastruktur backend.*
- [ ] **Task 1.1:** Setup Supabase Auth dan implementasi otentikasi.
- [ ] **Task 1.2:** Implementasi *Role-Based Access Control* (RBAC) dengan peran: Superadmin, Manajer, Kasir, Admin Pembiayaan, AO, dll.
- [ ] **Task 1.3:** Desain Skema Database (Tabel Anggota, Transaksi, Akad, Jurnal, dan Ziswaf).
- [ ] **Task 1.4:** Konfigurasi *Row Level Security* (RLS) di Supabase untuk proteksi privasi data.

## Epic 2: Multi-Akad Engine & Auto-Journaling
*Melengkapi logika perhitungan pembiayaan syariah berdasarkan PSAK.*
- [ ] **Task 2.1:** Integrasi Form Simulasi Akad UI dengan Backend untuk pembuatan kontrak Murabahah (PSAK 102), Mudharabah (PSAK 105), dan Musyarakah (PSAK 106).
- [ ] **Task 2.2:** Pembuatan sistem *Auto-Journaling Syariah* yang otomatis membuat entri jurnal (*double-entry*) setiap kali ada transaksi disetujui.
- [ ] **Task 2.3:** Kalkulasi otomatis untuk pembagian nisbah dan bagi hasil (*cash basis*).

## Epic 3: Ziswaf Separated Ledger (PSAK 109)
*Pengelolaan dana sosial yang terpusat dan transparan.*
- [ ] **Task 3.1:** Pembuatan *buku besar khusus* (Ledger) untuk memisahkan dana operasional LKM dan dana Ziswaf.
- [ ] **Task 3.2:** Halaman/Form Penerimaan dan Penyaluran dana Zakat, Infaq, dan Sedekah ke *mustahiq*.
- [ ] **Task 3.3:** Otomatisasi persentase potong dana hak Amil.

## Epic 4: Modul Laporan Keuangan Syariah (PSAK 101)
*Visualisasi dan ekspor data finansial LKM.*
- [ ] **Task 4.1:** Pembuatan Laporan Neraca (Posisi Keuangan) dan Laba Rugi secara *real-time*.
- [ ] **Task 4.2:** Pembuatan Laporan Rekonsiliasi Pendapatan dan Bagi Hasil.
- [ ] **Task 4.3:** Pembuatan Laporan Sumber dan Penyaluran Dana Ziswaf / Qardh.
- [ ] **Task 4.4:** Fitur Ekspor Laporan Otomatis ke format **PDF** dan **XLSX**.

## Epic 5: Dokumen Digital & Fitur AI
*Penerapan teknologi AI untuk produktivitas.*
- [ ] **Task 5.1:** *Upload* Dokumen Digital: Modul manajemen bukti transaksi/akad yang terintegrasi per profil nasabah.
- [ ] **Task 5.2:** Integrasi **AI-Powered OCR**: Fitur membaca foto kuitansi/nota lalu otomatis mengekstrak nominal, tanggal, dan nama pihak.
- [ ] **Task 5.3:** **Automated Scoring & Validation**: AI memvalidasi kesesuaian dokumen bukti (misal sertifikat jaminan) dengan data yang diinput ke sistem.
- [ ] **Task 5.4:** **Shariah Scoring**: Kalkulasi matriks kesehatan koperasi seperti rasio NPF (*Non-Performing Financing*), Likuiditas, dan Rentabilitas.

## Epic 6: Impor Data & Migrasi
*Peralihan sistem lama.*
- [ ] **Task 6.1:** Fitur **Impor Data via JSON/Excel**: Memungkinkan *Admin Sistem* untuk memigrasikan data anggota dan mutasi lama tanpa harus mengubah kode (berdasarkan slide PDF).

## Epic 7: QA & Automated Testing
*Memastikan kepatuhan formula dan kestabilan.*
- [ ] **Task 7.1:** *Unit Testing* (Jest) khusus untuk modul perhitungan *Margin* dan *Bagi Hasil*.
- [ ] **Task 7.2:** *End-to-End Testing* (Cypress/Playwright) untuk memastikan alur pendaftaran akad, pembayaran cicilan, dan jurnal berjalan mulus.
