import { View, Text } from 'react-native';
import { COLORS } from '../../constants/colors';

type Tone = 'neutral' | 'success' | 'danger' | 'info' | 'badge' | 'warning' | 'dev';

type Props = {
  label: string;
  tone?: Tone;
  /**
   * Visual shape:
   *   - `tag` (default): squared-off small tag (radius 6, 10px caption) — DEV, Featured.
   *   - `pill`: rounded count badge (radius 10, 12px label) — unread count.
   *   - `chip`: medium rounded label (radius 8, 12px label).
   */
  size?: 'tag' | 'pill' | 'chip';
};

// Signal tones use a translucent ("22" alpha) tint with the signal colour as
// foreground. Neutral and solid-badge tones use opaque backgrounds. These
// composite colors aren't tokenised individually because they're derived
// from the base COLORS palette.
const TONES: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: COLORS.iconBg,       fg: COLORS.foreground },
  success: { bg: `${COLORS.accent}22`,      fg: COLORS.accent },
  danger:  { bg: `${COLORS.destructive}22`, fg: COLORS.destructive },
  info:    { bg: `${COLORS.info}22`,        fg: COLORS.info },
  badge:   { bg: COLORS.badge,        fg: COLORS.foreground },
  warning: { bg: `${COLORS.warning}22`,     fg: COLORS.warning },
  dev:     { bg: `${COLORS.badge}22`,       fg: COLORS.badge },
};

/**
 * Small text pill used for statuses (Active/Featured), counts (unread),
 * and tags (DEV). Tones map to the design-system signal palette.
 */
type Spec = { padV: number; padH: number; radius: number; fontSize: number };
const SIZES: Record<NonNullable<Props['size']>, Spec> = {
  tag:  { padV: 4, padH: 8,  radius: 6,  fontSize: 10 },
  pill: { padV: 2, padH: 8,  radius: 10, fontSize: 12 },
  chip: { padV: 4, padH: 10, radius: 8,  fontSize: 12 },
};

export function Badge({ label, tone = 'neutral', size = 'tag' }: Props) {
  const { bg, fg } = TONES[tone];
  const s = SIZES[size];

  return (
    <View
      style={{
        backgroundColor: bg,
        borderRadius: s.radius,
        paddingVertical: s.padV,
        paddingHorizontal: s.padH,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ color: fg, fontSize: s.fontSize, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}
