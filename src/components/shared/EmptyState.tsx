import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { PremiumIcon, type PremiumIconName } from './PremiumIcon';
import { ShimmerGrid } from './ShimmerGrid';
import { Button } from './Button';

type IconName = ComponentProps<typeof Ionicons>['name'];

type Props = {
  /** Optional Ionicon glyph. Used when `premiumIcon` isn't supplied. */
  icon?: IconName;
  /**
   * Premium illustrated icon — preferred for the `default` (hero)
   * variant. Overrides `icon` when set.
   */
  premiumIcon?: PremiumIconName;
  title: string;
  subtitle?: string;
  /**
   * Optional CTA. In the `default` variant this renders as a
   * full-width primary `<Button>`. In the `compact` variant it renders
   * as an accent text link (the original behaviour).
   */
  action?: { label: string; onPress: () => void };
  /** Vertical padding of the empty-state block. Default: 48. */
  paddingVertical?: number;
  /**
   * `default` — hero layout mirroring the intro-slider slides: large
   * icon, heading title, body subtitle, full-width CTA button. Use on
   * full-screen / full-section empty states.
   *
   * `hero-sm` — same hero rhythm but ~50 % size: 80-pt PremiumIcon,
   * `titleSmall` typography (18 / 600), label subtitle, rounded pill
   * action. Use in per-account sections on Portfolio where the hero is
   * one block among many and shouldn't dominate.
   *
   * `compact` — tight inline layout for in-card empty states
   * ("All caught up", "No active loan"). Small Ionicon, muted title.
   */
  variant?: 'default' | 'hero-sm' | 'compact';
  /**
   * Render the ambient dot-grid shimmer behind the hero content. Only
   * applies to the `default` variant — use on screen-owned empty states
   * (Trade Loan pane, Watchlist) so they match the stories' ambience.
   */
  showShimmerGrid?: boolean;
};

/**
 * Standardised empty state — icon, title, subtitle, optional action.
 *
 * Default variant reuses the intro-slider visual system so hero empty
 * states read as part of the same story layer. Compact variant stays
 * minimal for in-card ack rows.
 */
export function EmptyState({
  icon,
  premiumIcon,
  title,
  subtitle,
  action,
  paddingVertical,
  variant = 'default',
  showShimmerGrid = false,
}: Props) {
  if (variant === 'compact') {
    return (
      <View
        style={{
          alignItems: 'center',
          paddingVertical: paddingVertical ?? SPACING['2xl'],
          paddingHorizontal: SPACING.xl,
        }}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={32}
            color={COLORS.foregroundMuted}
            style={{ marginBottom: SPACING.sm }}
          />
        ) : null}
        <Text style={[typography.label, { color: COLORS.foregroundMuted, textAlign: 'center' }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[
              typography.body,
              { color: COLORS.foregroundMuted, marginTop: SPACING.xs + 2 /* 6 */, textAlign: 'center' },
            ]}
          >
            {subtitle}
          </Text>
        ) : null}
        {action ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={action.onPress}
            style={{ marginTop: SPACING.md }}
          >
            <Text style={[typography.labelSemibold, { color: COLORS.accent }]}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  const isSmall = variant === 'hero-sm';

  // default (hero) variant — mirrors the intro-slider slide layout.
  // hero-sm shrinks the icon + title + CTA while keeping the body copy so
  // the block can share a scroll with other sections without dominating.
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: paddingVertical ?? (isSmall ? SPACING['2xl'] : SPACING['4xl']),
        paddingHorizontal: SPACING['2xl'],
      }}
    >
      {showShimmerGrid ? <ShimmerGrid /> : null}
      {premiumIcon ? (
        <PremiumIcon
          name={premiumIcon}
          size={isSmall ? 80 : 160}
          style={{ marginBottom: isSmall ? SPACING.lg : SPACING['3xl'] }}
        />
      ) : icon ? (
        <Ionicons
          name={icon}
          size={isSmall ? 36 : 64}
          color={COLORS.placeholder}
          style={{ marginBottom: isSmall ? SPACING.lg : SPACING['3xl'] }}
        />
      ) : null}

      <View style={{ width: '100%', maxWidth: 280, alignItems: 'center' }}>
        <Text
          style={[
            isSmall ? typography.titleSmall : typography.heading,
            {
              color: COLORS.foreground,
              textAlign: 'center',
              marginBottom: isSmall ? SPACING.sm : SPACING.md,
            },
          ]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[
              isSmall ? typography.label : typography.body,
              {
                color: COLORS.foregroundMuted,
                textAlign: 'center',
                marginBottom: action ? (isSmall ? SPACING.lg : SPACING['3xl']) : 0,
              },
            ]}
          >
            {subtitle}
          </Text>
        ) : null}
        {action ? (
          isSmall ? (
            <Button label={action.label} size="sm" variant="outline" pill onPress={action.onPress} />
          ) : (
            <Button label={action.label} size="lg" onPress={action.onPress} fullWidth />
          )
        ) : null}
      </View>
    </View>
  );
}
