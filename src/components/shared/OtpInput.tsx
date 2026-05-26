import { useEffect, useMemo, useRef, useState } from 'react';
import { Text, TextInput, View, type NativeSyntheticEvent, type TextInputKeyPressEventData } from 'react-native';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

type Props = {
  /** Number of digits. Default: 6. */
  length?: number;
  value: string;
  onChange: (next: string) => void;
  /** Fires when the user fills the final digit. */
  onComplete?: (final: string) => void;
  /** Visual error tint + helper text. */
  error?: string;
  /** Auto-focus the first cell on mount. Default: true. */
  autoFocus?: boolean;
};

/**
 * N-digit one-time-code input. Numeric-only, auto-advances on input, handles
 * paste of a full code, backspaces into the previous cell.
 *
 *   const [code, setCode] = useState('');
 *   <OtpInput value={code} onChange={setCode} onComplete={submit} />
 */
export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  error,
  autoFocus = true,
}: Props) {
  const refs = useRef<(TextInput | null)[]>([]);
  const [focusIdx, setFocusIdx] = useState<number>(autoFocus ? 0 : -1);

  // Normalise value: keep only digits, clip to length.
  const digits = useMemo(() => {
    const clean = (value ?? '').replace(/\D/g, '').slice(0, length);
    return Array.from({ length }, (_, i) => clean[i] ?? '');
  }, [value, length]);

  useEffect(() => {
    if (autoFocus) {
      // Microtask delay so refs are wired.
      const t = setTimeout(() => refs.current[0]?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  const setAt = (idx: number, ch: string) => {
    const cleanCh = ch.replace(/\D/g, '');
    if (cleanCh.length > 1) {
      // Paste: spread across cells starting at idx.
      const next = [...digits];
      for (let i = 0; i < cleanCh.length && idx + i < length; i++) {
        next[idx + i] = cleanCh[i];
      }
      const joined = next.join('');
      onChange(joined);
      const lastFilled = Math.min(idx + cleanCh.length, length - 1);
      refs.current[lastFilled]?.focus();
      if (joined.replace(/\D/g, '').length === length) onComplete?.(joined);
      return;
    }
    const next = [...digits];
    next[idx] = cleanCh;
    const joined = next.join('');
    onChange(joined);
    if (cleanCh && idx < length - 1) {
      refs.current[idx + 1]?.focus();
    }
    if (joined.replace(/\D/g, '').length === length) onComplete?.(joined);
  };

  const onKeyPress = (idx: number) => (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[idx] && idx > 0) {
      const next = [...digits];
      next[idx - 1] = '';
      onChange(next.join(''));
      refs.current[idx - 1]?.focus();
    }
  };

  const hasError = Boolean(error);

  return (
    <View>
      <View style={{ flexDirection: 'row', gap: SPACING.sm, justifyContent: 'center' }}>
        {digits.map((d, idx) => {
          const isFocused = focusIdx === idx;
          const borderColor = hasError
            ? COLORS.destructive
            : isFocused
            ? COLORS.accent
            : 'transparent';
          return (
            <TextInput
              key={idx}
              ref={r => { refs.current[idx] = r; }}
              value={d}
              onChangeText={ch => setAt(idx, ch)}
              onKeyPress={onKeyPress(idx)}
              onFocus={() => setFocusIdx(idx)}
              onBlur={() => setFocusIdx(curr => (curr === idx ? -1 : curr))}
              keyboardType="number-pad"
              maxLength={idx === 0 ? length : 1}
              selectTextOnFocus
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              style={{
                width: 48,
                height: 56,
                borderRadius: RADIUS.card,
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor,
                textAlign: 'center',
                color: COLORS.foreground,
                fontSize: 22,
                fontWeight: '700',
              }}
            />
          );
        })}
      </View>
      {hasError ? (
        <Text style={[typography.label, { color: COLORS.destructive, marginTop: SPACING.sm, textAlign: 'center' }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
