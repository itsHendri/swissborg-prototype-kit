import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated, Easing, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { typography } from '../constants/typography';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { RADIUS } from '../constants/ui';

export type ToastTone = 'success' | 'error' | 'info' | 'warning';

export type ToastOptions = {
  /** Default: 'info' */
  tone?: ToastTone;
  /** Auto-dismiss after this many ms. Default: 2400. Pass `0` to keep until manually closed. */
  duration?: number;
};

type ToastState = ToastOptions & {
  id: number;
  message: string;
};

type ToastApi = {
  show: (message: string, options?: ToastOptions) => void;
  success: (message: string, options?: Omit<ToastOptions, 'tone'>) => void;
  error: (message: string, options?: Omit<ToastOptions, 'tone'>) => void;
  info: (message: string, options?: Omit<ToastOptions, 'tone'>) => void;
  warning: (message: string, options?: Omit<ToastOptions, 'tone'>) => void;
};

const ToastContext = createContext<ToastApi | undefined>(undefined);

/**
 * Imperative toast hook.
 *
 *   const toast = useToast();
 *   toast.success('Copied accent');
 *   toast.error('Network unavailable', { duration: 4000 });
 *
 * Stack: newest on top. Default auto-dismiss 2.4s. Pass `duration: 0` to hold.
 */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const show = useCallback((message: string, options: ToastOptions = {}) => {
    const id = ++idRef.current;
    const t: ToastState = { id, message, tone: options.tone ?? 'info', duration: options.duration ?? 2400 };
    setToasts(prev => [...prev, t]);
    if (t.duration && t.duration > 0) {
      setTimeout(() => dismiss(id), t.duration);
    }
  }, [dismiss]);

  const api = useMemo<ToastApi>(() => ({
    show,
    success: (m, o) => show(m, { ...o, tone: 'success' }),
    error:   (m, o) => show(m, { ...o, tone: 'error' }),
    info:    (m, o) => show(m, { ...o, tone: 'info' }),
    warning: (m, o) => show(m, { ...o, tone: 'warning' }),
  }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ─── Viewport ───────────────────────────────────────────────────────────────

const TONE_SPEC: Record<ToastTone, { bg: string; fg: string; icon: keyof typeof IconMap }> = {
  success: { bg: COLORS.accent,      fg: COLORS.onAccent,   icon: 'success' },
  error:   { bg: COLORS.destructive, fg: COLORS.foreground, icon: 'error'   },
  info:    { bg: COLORS.surface,     fg: COLORS.foreground, icon: 'info'    },
  warning: { bg: COLORS.warning,     fg: COLORS.onAccent,   icon: 'warning' },
};

const IconMap = {
  success: 'checkmark-circle' as const,
  error:   'alert-circle'     as const,
  info:    'information-circle' as const,
  warning: 'warning'          as const,
};

function ToastViewport({ toasts, onDismiss }: { toasts: ToastState[]; onDismiss: (id: number) => void }) {
  const insets = useSafeAreaInsets();
  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0, right: 0,
        bottom: insets.bottom + SPACING.xl,
        alignItems: 'center',
        gap: SPACING.sm,
      }}
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </View>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  // Start visible at translateY 12 then animate to 0. Opacity uses CSS
  // transition on web since RN-Web's Animated runtime drops driver-less
  // opacity timings silently — keeping it as a plain `1` avoids the bug.
  const translateY = useRef(new Animated.Value(12)).current;
  const spec = TONE_SPEC[toast.tone ?? 'info'];

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [translateY]);

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        backgroundColor: spec.bg,
        paddingVertical: SPACING.sm + 2,
        paddingHorizontal: SPACING.lg,
        borderRadius: RADIUS.pill,
        maxWidth: '90%',
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
      }}
      onTouchEnd={onDismiss}
    >
      <Ionicons name={IconMap[spec.icon]} size={18} color={spec.fg} />
      <Text style={[typography.bodySemibold, { color: spec.fg }]}>{toast.message}</Text>
    </Animated.View>
  );
}
