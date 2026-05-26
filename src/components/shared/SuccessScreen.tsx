import { View, Text, ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShimmerGrid } from './ShimmerGrid';
import { GlassNavButton } from './GlassNavButton';
import { SummaryCard, type SummaryRow } from './SummaryCard';
import { CryptoIcon } from './CryptoIcon';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

type Props = {
  title: string;
  body: string;
  /**
   * Optional large accent-green amount rendered between title and body.
   * E.g. `"$1,234.56 USDC"`
   */
  amountLabel?: string;
  /** Optional secondary line rendered under `amountLabel` (muted). */
  amountSubtitle?: string;
  /**
   * Optional crypto symbol — when provided, the hero renders the matching
   * CryptoIcon with a small accent checkmark badge instead of the plain
   * checkmark ring. Use for success states where the "thing delivered" is
   * a specific token (e.g. loan draw → USDC).
   */
  heroSymbol?: string;
  /** Optional detail-rows card rendered below the body. */
  summaryRows?: SummaryRow[];
  /**
   * Optional info card rendered below the body — icon square + title + subtitle.
   * Used for things like "Protected by Passkey" on the account-creation modal.
   */
  infoCard?: {
    icon: IoniconName;
    title: string;
    subtitle: string;
  };
  /**
   * When provided, a close (×) button is rendered absolutely in the top-right
   * corner (safe-area aware). Use this in place of a PageTitleBar back arrow
   * on success steps.
   */
  onClose?: () => void;
  /**
   * While true, the checkmark is replaced with a spinner and body content
   * (title, amount, body, summary, info card, children) is hidden — for
   * async in-flight operations.
   */
  loading?: boolean;
  /** Any additional content rendered after the summary / info card. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Unified success-screen template.
 *
 * Fills flex:1 with a ShimmerGrid background, a centred checkmark circle,
 * title, optional amount, body, and optional summary / info card. Action
 * buttons live in the caller's StickyBottomBar (or inline for modals that
 * don't have one).
 *
 * Use this for EVERY success state in the app. Do not rebuild the pattern.
 */
export function SuccessScreen({
  title,
  body,
  amountLabel,
  amountSubtitle,
  heroSymbol,
  summaryRows,
  infoCard,
  onClose,
  loading = false,
  children,
  style,
}: Props) {
  const insets = useSafeAreaInsets();

  const hasBodyContent = !!(summaryRows || infoCard || children);

  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: SPACING['2xl'],
        },
        style,
      ]}
    >
      <ShimmerGrid />

      {onClose && !loading ? (
        <GlassNavButton
          icon="close"
          onPress={onClose}
          style={{ position: 'absolute', top: insets.top + SPACING.sm, right: SPACING.lg }}
        />
      ) : null}

      {/* Hero — token-with-checkmark overlay, spinner while loading, or
          the default checkmark ring. */}
      <View
        style={{
          width: 96,
          height: 96,
          borderRadius: RADIUS.full,
          backgroundColor: heroSymbol && !loading ? 'transparent' : 'rgba(0,163,119,0.12)',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: loading ? 0 : SPACING['3xl'] - 4 /* 28 */,
        }}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.accent} size="large" />
        ) : heroSymbol ? (
          <View style={{ width: 96, height: 96, alignItems: 'center', justifyContent: 'center' }}>
            <CryptoIcon symbol={heroSymbol} size={88} />
            {/* Accent checkmark badge pinned bottom-right with a ring in
                the page background so it reads as a separate pip. */}
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 34,
                height: 34,
                borderRadius: RADIUS.full,
                backgroundColor: COLORS.accent,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 3,
                borderColor: COLORS.background,
              }}
            >
              <Ionicons name="checkmark" size={18} color={COLORS.background} />
            </View>
          </View>
        ) : (
          <View
            style={{
              width: 68,
              height: 68,
              borderRadius: RADIUS.full,
              backgroundColor: COLORS.accent,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="checkmark" size={36} color={COLORS.background} />
          </View>
        )}
      </View>

      {!loading && (
        <View style={{ width: '100%', maxWidth: 320, alignItems: 'center' }}>
          <Text
            style={[
              typography.headingLarge,
              {
                color: COLORS.foreground,
                textAlign: 'center',
                marginBottom: SPACING.md - 2 /* 10 */,
              },
            ]}
          >
            {title}
          </Text>

          {amountLabel ? (
            <Text
              style={[
                typography.displayLarge,
                {
                  color: COLORS.accent,
                  textAlign: 'center',
                  marginBottom: amountSubtitle ? SPACING.xs : SPACING.md - 2 /* 10 */,
                },
              ]}
            >
              {amountLabel}
            </Text>
          ) : null}

          {amountSubtitle ? (
            <Text
              style={[
                typography.body,
                {
                  color: COLORS.foregroundMuted,
                  textAlign: 'center',
                  marginBottom: SPACING.md - 2 /* 10 */,
                },
              ]}
            >
              {amountSubtitle}
            </Text>
          ) : null}

          <Text
            style={[
              typography.body,
              {
                color: COLORS.foregroundMuted,
                textAlign: 'center',
                marginBottom: hasBodyContent ? SPACING['2xl'] : 0,
              },
            ]}
          >
            {body}
          </Text>

          {summaryRows ? (
            <View style={{ width: '100%' }}>
              <SummaryCard rows={summaryRows} />
            </View>
          ) : null}

          {infoCard ? (
            <View
              style={{
                width: '100%',
                backgroundColor: COLORS.surface,
                borderRadius: RADIUS.lg,
                padding: SPACING.lg,
                marginTop: summaryRows ? SPACING.md : 0,
                flexDirection: 'row',
                alignItems: 'center',
                gap: SPACING.md,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: RADIUS.full,
                  backgroundColor: COLORS.divider,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name={infoCard.icon} size={20} color={COLORS.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typography.bodySemibold, { color: COLORS.foreground }]}>
                  {infoCard.title}
                </Text>
                <Text style={[typography.label, { color: COLORS.foregroundMuted, marginTop: 2 }]}>
                  {infoCard.subtitle}
                </Text>
              </View>
              <Ionicons name="shield-checkmark" size={20} color={COLORS.accent} />
            </View>
          ) : null}

          {children}
        </View>
      )}
    </View>
  );
}
