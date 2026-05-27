/**
 * Small bundled country list for prototype use. Not exhaustive — add
 * rows as scenarios demand. Flag is a Unicode emoji (works everywhere
 * without an asset pipeline).
 */

export type Country = {
  /** ISO 3166-1 alpha-2 code (uppercase). */
  code: string;
  name: string;
  /** International dial code, including the leading +. */
  dial: string;
  /** Unicode flag emoji. */
  flag: string;
};

export const COUNTRIES: Country[] = [
  { code: 'CH', name: 'Switzerland',       dial: '+41',  flag: '🇨🇭' },
  { code: 'GB', name: 'United Kingdom',    dial: '+44',  flag: '🇬🇧' },
  { code: 'US', name: 'United States',     dial: '+1',   flag: '🇺🇸' },
  { code: 'DE', name: 'Germany',           dial: '+49',  flag: '🇩🇪' },
  { code: 'FR', name: 'France',            dial: '+33',  flag: '🇫🇷' },
  { code: 'ES', name: 'Spain',             dial: '+34',  flag: '🇪🇸' },
  { code: 'IT', name: 'Italy',             dial: '+39',  flag: '🇮🇹' },
  { code: 'PT', name: 'Portugal',          dial: '+351', flag: '🇵🇹' },
  { code: 'NL', name: 'Netherlands',       dial: '+31',  flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium',           dial: '+32',  flag: '🇧🇪' },
  { code: 'AT', name: 'Austria',           dial: '+43',  flag: '🇦🇹' },
  { code: 'SE', name: 'Sweden',            dial: '+46',  flag: '🇸🇪' },
  { code: 'NO', name: 'Norway',            dial: '+47',  flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark',           dial: '+45',  flag: '🇩🇰' },
  { code: 'FI', name: 'Finland',           dial: '+358', flag: '🇫🇮' },
  { code: 'PL', name: 'Poland',            dial: '+48',  flag: '🇵🇱' },
  { code: 'IE', name: 'Ireland',           dial: '+353', flag: '🇮🇪' },
  { code: 'CA', name: 'Canada',            dial: '+1',   flag: '🇨🇦' },
  { code: 'AU', name: 'Australia',         dial: '+61',  flag: '🇦🇺' },
  { code: 'JP', name: 'Japan',             dial: '+81',  flag: '🇯🇵' },
  { code: 'SG', name: 'Singapore',         dial: '+65',  flag: '🇸🇬' },
  { code: 'HK', name: 'Hong Kong',         dial: '+852', flag: '🇭🇰' },
  { code: 'ZA', name: 'South Africa',      dial: '+27',  flag: '🇿🇦' },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971', flag: '🇦🇪' },
];

export function findCountry(code: string): Country | undefined {
  return COUNTRIES.find(c => c.code === code.toUpperCase());
}
