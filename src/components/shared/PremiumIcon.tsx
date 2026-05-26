/**
 * PremiumIcon
 *
 * Large-format illustrated PNG icon for hero / display contexts —
 * intro-slider slides (stories) and full-screen empty states. Metro
 * requires literal `require` paths, so the name→asset map lives here
 * once and callers pick by semantic name.
 *
 * Usage: <PremiumIcon name="solLoan" />
 *
 * Ambient motion: each icon runs a gentle bob + tilt loop (≈4s cycle)
 * driven by RN Animated on the native driver. The 4-step sequence
 * 0 → +1 → 0 → −1 → 0 means `Animated.loop` restarts at the initial
 * value with no visible jump. Set `animated={false}` to render static.
 *
 * For small inline / list icons, use `GlassIcon` instead.
 */
import { useEffect, useRef } from 'react';
import { Animated, Easing, type ImageStyle, type StyleProp } from 'react-native';

const ICONS = {
  bitcoinWallet: require('../../../assets/icons/premium-icons/Premium - Bitcoin Wallet.png'),
  earn:          require('../../../assets/icons/premium-icons/Premium - Earn.png'),
  solLoan:       require('../../../assets/icons/premium-icons/Premium - SOL Loands.png'),
  solUsdcLoan:   require('../../../assets/icons/premium-icons/Premium - SOL USDC Loands.png'),
  swissBorgLoan: require('../../../assets/icons/premium-icons/Premium - SwissBorg Loands.png'),
  transaction:   require('../../../assets/icons/premium-icons/Premium - Transaction.png'),
} as const;

export type PremiumIconName = keyof typeof ICONS;

type Props = {
  name: PremiumIconName;
  size?: number;
  /**
   * Play the ambient bob + tilt loop. Default `true`. Set false for
   * static renders (preview grids, tests, accessibility preferences).
   */
  animated?: boolean;
  style?: StyleProp<ImageStyle>;
};

const LEG = 1600; // ms per leg of the 4-step loop

export function PremiumIcon({ name, size = 160, animated = true, style }: Props) {
  // Single value drives both translateY and rotateZ via interpolation.
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue:  1, duration: LEG, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(anim, { toValue:  0, duration: LEG, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(anim, { toValue: -1, duration: LEG, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(anim, { toValue:  0, duration: LEG, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim, animated]);

  // Wider travel + upward scale: the icon lifts on +1, settles at 0,
  // dips and squeezes on -1. Reads as a gentle breathing / floating
  // motion rather than a subtle hover.
  const translateY = anim.interpolate({
    inputRange:  [-1, 0, 1],
    outputRange: [4,  0, -8],
  });
  const rotate = anim.interpolate({
    inputRange:  [-1, 0, 1],
    outputRange: ['-2deg', '0deg', '2deg'],
  });
  const scale = anim.interpolate({
    inputRange:  [-1, 0, 1],
    outputRange: [0.97, 1, 1.06],
  });

  return (
    <Animated.Image
      source={ICONS[name]}
      style={[
        { width: size, height: size },
        style,
        { transform: [{ translateY }, { rotate }, { scale }] },
      ]}
      resizeMode="contain"
    />
  );
}
