import { type ReactNode } from 'react';
import { View, Text, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassNavButton } from './GlassNavButton';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

type Props = {
  /** Title text rendered next to the back arrow. Pass `left` instead to use a custom element. */
  title?: string;
  /** Custom left-side element (overrides title — e.g. QR button). */
  left?: ReactNode;
  /** Extra action(s) rendered on the right side. */
  rightActions?: ReactNode;
  /** Override the default goBack() back handler. */
  onClose?: () => void;
  /** 'push' (default): back arrow on left. 'modal': title on left, close X on right. */
  variant?: 'push' | 'modal';
  /** Pass a scroll position to fade the blur background in on scroll (0 → transparent, ≥20 → fully visible). */
  scrollY?: Animated.Value;
  /** Hide the back / close arrow (e.g. on success steps where only a custom close action should be shown). */
  hideBack?: boolean;
};

/**
 * Height of the header row. All screens using PageTitleBar should add this
 * as `paddingTop` on their ScrollView contentContainerStyle so content
 * starts below the floating header.
 */
export const PAGE_TITLE_BAR_HEIGHT = 60;

/**
 * Unified sticky page header with a frosted-glass blur background.
 *
 * Positioned absolutely so ScrollView content scrolls behind it.
 * Add `paddingTop: PAGE_TITLE_BAR_HEIGHT` to the ScrollView below.
 */
export function PageTitleBar({ title, left, rightActions, onClose, variant = 'push', scrollY, hideBack = false }: Props) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const handleClose = onClose ?? (() => navigation.goBack());

  const isModal = variant === 'modal';

  const blurOpacity = scrollY
    ? scrollY.interpolate({ inputRange: [0, 20], outputRange: [0, 1], extrapolate: 'clamp' })
    : 1;

  const headerRow = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        height: PAGE_TITLE_BAR_HEIGHT,
      }}
    >
      {/* Left side */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm + 2 /* 10 */ }}>
        {!isModal && !hideBack && (
          <GlassNavButton icon="arrow-back" onPress={handleClose} />
        )}
        {left ?? (
          <Text style={[typography.title, { color: COLORS.foreground }]}>
            {title ?? ''}
          </Text>
        )}
      </View>

      {/* Right side */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
        {rightActions}
        {isModal && (
          <GlassNavButton icon="close" onPress={handleClose} iconSize={20} />
        )}
      </View>
    </View>
  );

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingTop: insets.top,
      }}
    >
      {/* Blur layer — fades in on scroll */}
      <Animated.View
        style={{
          ...{ position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 },
          opacity: blurOpacity,
        }}
      >
        <BlurView
          tint="dark"
          intensity={80}
          style={{ flex: 1, overflow: 'hidden' }}
        />
      </Animated.View>

      {/* Buttons + title — always visible */}
      {headerRow}
    </View>
  );
}
