/**
 * GlassIcon
 *
 * Renders a branded green-glass 3D PNG icon from assets/icons/glass-icons/.
 * Metro requires literal `require` paths, so the name→asset map lives here
 * once and callers pick by semantic name.
 *
 * Usage: <GlassIcon name="wallet" size={48} />
 */
import { Image, type ImageStyle, type StyleProp } from 'react-native';

const ICONS = {
  wallet:          require('../../../assets/icons/glass-icons/Cryptocurrency Wallet - green_glass - cryptocurrency wallet - small.png'),
  card:            require('../../../assets/icons/glass-icons/Business Card - green_glass - name card with profile picture - small.png'),
  growth:          require('../../../assets/icons/glass-icons/Economic Growth - green_glass - upward arrow over world globe - small.png'),
  seedling:        require('../../../assets/icons/glass-icons/Venture Capital - green_glass - seedling with upward growth arrow - small.png'),
  gift:            require('../../../assets/icons/glass-icons/Employee Bonus 2 - green_glass - gift box beside employee badge - small.png'),
  bonus:           require('../../../assets/icons/glass-icons/Employee Bonus - green_glass - gift box with money ribbon - small.png'),
  shield:          require('../../../assets/icons/glass-icons/Secure Payment Shield - green_glass - Secure Payment Shield - small.png'),
  lock:            require('../../../assets/icons/glass-icons/Secure Lock - green_glass - secure lock - small.png'),
  vault:           require('../../../assets/icons/glass-icons/Safe Vault - green_glass - Safe Vault - small.png'),
  goldBars:        require('../../../assets/icons/glass-icons/Gold Bars - green_glass - Gold Bars - small.png'),
  piggyBank:       require('../../../assets/icons/glass-icons/Wealth Management - green_glass - piggy bank with shield - small.png'),
  pie:             require('../../../assets/icons/glass-icons/Expense Summary - green_glass - summary pie chart with labels - small.png'),
  chart:           require('../../../assets/icons/glass-icons/Business Chart - green_glass - mixed bar and pie chart - small.png'),
  clipboard:       require('../../../assets/icons/glass-icons/Financial Report - green_glass - chart on clipboard - small.png'),
  calendar:        require('../../../assets/icons/glass-icons/Payment Schedule - green_glass - calendar with checkmark - small.png'),
  globe:           require('../../../assets/icons/glass-icons/Currency Exchange - green_glass - globe with dollar symbols and arrow around - small.png'),
  brain:           require('../../../assets/icons/glass-icons/AI Analytics - green_glass - brain with circuit lines - small.png'),
  feedback:        require('../../../assets/icons/glass-icons/Customer Feedback - green_glass - chat bubble with star rating - small.png'),
  receipt:         require('../../../assets/icons/glass-icons/Expense Reimbursement - green_glass - receipt with minu sign - small.png'),
  taxRefund:       require('../../../assets/icons/glass-icons/Tax Refund - green_glass - stamped paper with dollar sign - small.png'),
  bankAccount:     require('../../../assets/icons/glass-icons/Bank Account - green_glass - Wallet with coin - small.png'),
  operationalCost: require('../../../assets/icons/glass-icons/Operational Cost - green_glass - gear with money symbol - small.png'),
  companyProfile:  require('../../../assets/icons/glass-icons/Company Profile - green_glass - Building with financial dossier - small.png'),
  plan:            require('../../../assets/icons/glass-icons/Business Plan - green_glass - document with growth chart and roadmap - small.png'),
  contract:        require('../../../assets/icons/glass-icons/Employee Contract - green_glass - document with signature - small.png'),
  salesContract:   require('../../../assets/icons/glass-icons/Sales Contract - green_glass - document with signature pen - small.png'),
  budget:          require('../../../assets/icons/glass-icons/Budget Planning - green_glass - calendar with budget pie chart - small.png'),
  companyBudget:   require('../../../assets/icons/glass-icons/Company Budget - green_glass - open file with banknotes - small.png'),
} as const;

export type GlassIconName = keyof typeof ICONS;

type Props = {
  name: GlassIconName;
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export function GlassIcon({ name, size = 48, style }: Props) {
  return (
    <Image
      source={ICONS[name]}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
    />
  );
}
