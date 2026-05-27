import { useCallback } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Haptic feedback hook. Returns a `trigger(kind)` function that fires the
 * matching expo-haptics call on iOS/Android and no-ops on web.
 *
 *   const haptic = useHaptic();
 *   <Button label="Pay" onPress={() => { haptic('success'); onPay(); }} />
 *
 * Pre-bind a single kind by passing it as the argument:
 *
 *   const tapHaptic = useHaptic('selection');
 *   <Pressable onPress={() => { tapHaptic(); ... }} />
 *
 * Kinds map to `expo-haptics`:
 *   - `selection`   → light tick on segment / pill change
 *   - `success`     → notification.success — slide-to-confirm complete
 *   - `warning`     → notification.warning — slippage too high
 *   - `error`       → notification.error — failed transaction
 *   - `impactLight` → small bump — toast, chip toggle
 *   - `impactMedium`→ medium bump — modal open, sheet snap
 *   - `impactHeavy` → heavy bump — destructive confirm, lock
 */
export type HapticKind =
  | 'selection'
  | 'success'
  | 'warning'
  | 'error'
  | 'impactLight'
  | 'impactMedium'
  | 'impactHeavy';

function fire(kind: HapticKind): void {
  if (Platform.OS === 'web') return;
  switch (kind) {
    case 'selection':    Haptics.selectionAsync(); return;
    case 'success':      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); return;
    case 'warning':      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); return;
    case 'error':        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);   return;
    case 'impactLight':  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);  return;
    case 'impactMedium': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); return;
    case 'impactHeavy':  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);  return;
  }
}

export function useHaptic(): (kind: HapticKind) => void;
export function useHaptic(boundKind: HapticKind): () => void;
export function useHaptic(boundKind?: HapticKind) {
  return useCallback(
    (kind?: HapticKind) => {
      const k = (boundKind ?? kind) as HapticKind | undefined;
      if (k) fire(k);
    },
    [boundKind],
  );
}
