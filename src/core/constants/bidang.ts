export const BIDANG_LIST = [
  'Bidang APTIKA',
  'Bidang TIK',
  'Bidang IKP',
  'Bidang Statistik',
  'Bidang Persandian dan Keamanan Informasi',
] as const;

export type BidangType = (typeof BIDANG_LIST)[number];

export const BIDANG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Bidang APTIKA': {
    bg: 'bg-blue-50 text-blue-700',
    border: 'border-blue-200',
    text: 'text-blue-700',
  },
  'Bidang TIK': {
    bg: 'bg-emerald-50 text-emerald-700',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
  },
  'Bidang IKP': {
    bg: 'bg-purple-50 text-purple-700',
    border: 'border-purple-200',
    text: 'text-purple-700',
  },
  'Bidang Statistik': {
    bg: 'bg-amber-50 text-amber-700',
    border: 'border-amber-200',
    text: 'text-amber-700',
  },
  'Bidang Persandian dan Keamanan Informasi': {
    bg: 'bg-rose-50 text-rose-700',
    border: 'border-rose-200',
    text: 'text-rose-700',
  },
  'Sekretariat': {
    bg: 'bg-slate-100 text-slate-700',
    border: 'border-slate-300',
    text: 'text-slate-700',
  }
};
