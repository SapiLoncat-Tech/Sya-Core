import { calculateMurabahah, validateDoubleEntry, JournalEntry } from '../src/utils/accounting';

describe('Sya-Core Accounting Engine Tests', () => {
  
  describe('Modul 1: Perhitungan Cicilan Murabahah', () => {
    it('Harus menghitung margin dan cicilan dengan benar (Kasus Normal)', () => {
      // Skenario: Beli Motor 12 Juta, Margin 10% per tahun, Tenor 12 Bulan (1 Tahun)
      // Ekspektasi Margin: 12.000.000 * 10% * 1 = 1.200.000
      // Ekspektasi Total Hutang: 13.200.000
      // Ekspektasi Cicilan Per Bulan: 13.200.000 / 12 = 1.100.000

      const result = calculateMurabahah(12000000, 10, 12);

      expect(result.totalMargin).toBe(1200000);
      expect(result.totalPembiayaan).toBe(13200000);
      expect(result.cicilanPerBulan).toBe(1100000);
    });

    it('Harus menolak input yang tidak valid (Pokok <= 0)', () => {
      expect(() => {
        calculateMurabahah(0, 10, 12);
      }).toThrow('Parameter tidak valid');
    });
  });

  describe('Modul 2: Validasi Double-Entry Accounting', () => {
    it('Harus mengembalikan TRUE jika total Debit SAMA DENGAN total Kredit', () => {
      // Simulasi Jurnal Pencairan Murabahah
      const jurnalSeimbang: JournalEntry[] = [
        { accountCode: '14101', type: 'debit', amount: 13200000 },  // Piutang bertambah
        { accountCode: '11101', type: 'kredit', amount: 12000000 }, // Kas berkurang (bayar ke dealer)
        { accountCode: '22101', type: 'kredit', amount: 1200000 },  // Margin ditangguhkan bertambah
      ];

      // 13.200.000 (Debit) === 12.000.000 + 1.200.000 (Kredit)
      const isBalanced = validateDoubleEntry(jurnalSeimbang);
      expect(isBalanced).toBe(true);
    });

    it('Harus mengembalikan FALSE jika jurnal TIDAK SEIMBANG', () => {
      // Simulasi Jurnal Error (Kurang pencatatan margin)
      const jurnalBocor: JournalEntry[] = [
        { accountCode: '14101', type: 'debit', amount: 13200000 },  
        { accountCode: '11101', type: 'kredit', amount: 12000000 }, 
      ];

      // 13.200.000 (Debit) !== 12.000.000 (Kredit)
      const isBalanced = validateDoubleEntry(jurnalBocor);
      expect(isBalanced).toBe(false);
    });

    it('Harus menolak jika ada angka negatif (Anti-Fraud)', () => {
      const jurnalHacker: JournalEntry[] = [
        { accountCode: '14101', type: 'debit', amount: -50000 },  
        { accountCode: '11101', type: 'kredit', amount: -50000 }, 
      ];

      expect(() => {
        validateDoubleEntry(jurnalHacker);
      }).toThrow('Nominal tidak boleh negatif');
    });
  });

});
