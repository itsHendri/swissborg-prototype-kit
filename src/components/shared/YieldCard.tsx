import { type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { ProgressBar } from './ProgressBar';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

type Props = {
  title: string;
  /** Short marketing line under the title. */
  description?: string;
  /** Yield value, pre-formatted (e.g. "4.2%"). Renders as a chip in the corner. */
  apy?: string;
  /** Label paired with `apy`. Default: 'APY'. */
  apyLabel?: string;
  /** Optional visual — a `GlassIcon` / `PremiumIcon` / illustration. */
  illustration?: ReactNode;
  /**
   * Optional deposit-progress display. Renders a ProgressBar with the
   * given 0–1 ratio and an optional label.
   */
  progress?: { value: number; label?: string; trailingLabel?: string };
  /** Optional time-left line (e.g. "Closes in 3d 4h"). */
  timeLeft?: string;
  /** Primary CTA. */
  cta?: { label: string; onPress: () => void };
  /** Uses `Card variant="featured"` for the glow outline. */
  featured?: boolean;
};

/**
 * Marketing / product card for Earn, staking, and yield products.
 * Title + description + optional APY chip + optional illustration +
 * optional progress + optional time-left + optional CTA.
 *
 *   <YieldCard
 *     title="USDC Vault"
 *     description="Stablecoin yield with weekly compounding"
 *     apy="5.2%"
 *     illustration={<GlassIcon name="vault" size={56} />}
 *     progress={{ value: 0.72, label: 'Capacity', trailingLabel: '72%' }}
 *     timeLeft="Closes in 3d 4h"
 *     cta={{ label: 'Deposit', onPress: open }}
 *     featured
 *   />
 */
export function YieldCard({
  title,
  description,
  apy,
  apyLabel = 'APY',
  illustration,
  progress,
  timeLeft,
  cta,
  featured,
}: Props) {
  return (
    <Card padding="all" variant={featured ? 'featured' : 'surface'}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md }}>
        {illustration ? (
          <View style={{ marginTop: -2 }}>{illustration}</View>
        ) : null}
        <View style={{ flex: 1, gap: SPACING.xs + 2 }}>
          <Text style={[typography.titleSmall, { color: COLORS.foreground }]}>{title}</Text>
          {description ? (
            <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>
              {description}
            </Text>
          ) : null}
        </View>
        {apy ? (
          <View style={{ alignItems: 'flex-end' }}>
            <Text
              style={[
                typography.titleLarge,
                { color: COLORS.accent, lineHeight: typography.titleLarge.fontSize },
              ]}
            >
              {apy}
            </Text>
            <Text style={[typography.label, { color: COLORS.foregroundMuted, marginTop: 2 }]}>
              {apyLabel}
            </Text>
          </View>
        ) : null}
      </View>

      {progress ? (
        <View style={{ marginTop: SPACING.lg }}>
          <ProgressBar
            value={progress.value}
            label={progress.label}
            trailingLabel={progress.trailingLabel}
          />
        </View>
      ) : null}

      {timeLeft || cta ? (
        <View
          style={{
            marginTop: SPACING.lg,
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.md,
          }}
        >
          {timeLeft ? (
            <View style={{ flex: 1 }}>
              <Badge label={timeLeft} tone="info" size="chip" />
            </View>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          {cta ? <Button label={cta.label} onPress={cta.onPress} size="sm" /> : null}
        </View>
      ) : null}
    </Card>
  );
}
