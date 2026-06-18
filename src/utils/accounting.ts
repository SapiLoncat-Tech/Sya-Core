export type JournalEntry = {
  accountCode: string;
  type: 'debit' | 'kredit';
  amount: number;
};

/**
 * Menghitung simulasi cicilan pembiayaan Murabahah (Jual Beli)
 * @param pokok - Harga beli barang asli
 * @param marginPertahun - Persentase keuntungan BMT per tahun (misal: 15)
 * @param tenorBulan - Lama cicilan dalam bulan (misal: 12)
 * @returns { totalMargin, totalPembiayaan, cicilanPerBulan }
 */
export function calculateMurabahah(pokok: number, marginPertahun: number, tenorBulan: number) {
  if (pokok <= 0 || tenorBulan <= 0 || marginPertahun < 0) {
    throw new Error('Parameter tidak valid');
  }

  // Margin = Pokok * (Persentase / 100) * (Bulan / 12)
  const totalMargin = pokok * (marginPertahun / 100) * (tenorBulan / 12);
  const totalPembiayaan = pokok + totalMargin;
  const cicilanPerBulan = Math.round(totalPembiayaan / tenorBulan);

  return {
    totalMargin,
    totalPembiayaan,
    cicilanPerBulan
  };
}

/**
 * Memvalidasi prinsip Double-Entry Accounting
 * Total Debit harus sama persis dengan Total Kredit (Balance)
 * @param entries - Array dari jurnal (debit/kredit)
 * @returns boolean - true jika balance, false jika tidak balance
 */
export function validateDoubleEntry(entries: JournalEntry[]): boolean {
  if (entries.length === 0) return false;

  let totalDebit = 0;
  let totalKredit = 0;

  for (const entry of entries) {
    if (entry.amount < 0) {
      throw new Error('Nominal tidak boleh negatif');
    }
    
    if (entry.type === 'debit') {
      totalDebit += entry.amount;
    } else {
      totalKredit += entry.amount;
    }
  }

  return totalDebit === totalKredit;
}
