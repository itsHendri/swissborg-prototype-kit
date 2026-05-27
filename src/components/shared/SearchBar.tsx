import { useEffect, useRef, useState, type RefObject } from 'react';
import { Animated, Easing, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

type Props = {
  value: string;
  onChangeText: (next: string) => void;
  placeholder?: string;
  /** Default: false. */
  autoFocus?: boolean;
  /**
   * iOS-style "Cancel" link that slides in when the field has focus.
   * Called on tap — typically blurs + clears + closes the search sheet.
   */
  onCancel?: () => void;
  /** External ref to the underlying TextInput for programmatic focus/blur. */
  inputRef?: RefObject<TextInput | null>;
};

/**
 * Search field with a leading magnifier, inline clear (×) button, and an
 * optional iOS-style "Cancel" link that animates in on focus.
 *
 * Distinct from `<TextField size="search" />`:
 *   - clear-button is inline (not part of TextField).
 *   - Cancel link is a built-in affordance, not a parent concern.
 *   - Designed for search-mode-on-screen surfaces — pair with
 *     `<SearchableList>` or render alone above a list.
 *
 *   const [q, setQ] = useState('');
 *   <SearchBar value={q} onChangeText={setQ} onCancel={() => setMode('default')} />
 */
export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search',
  autoFocus = false,
  onCancel,
  inputRef,
}: Props) {
  const innerRef = useRef<TextInput | null>(null);
  const ref = inputRef ?? innerRef;
  const [focused, setFocused] = useState(false);
  const anim = useRef(new Animated.Value(autoFocus ? 1 : 0)).current;

  const showCancel = Boolean(onCancel) && (focused || value.length > 0);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: showCancel ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [showCancel, anim]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: SPACING.sm,
          backgroundColor: COLORS.surface,
          borderRadius: RADIUS.full,
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm,
          minHeight: 40,
        }}
      >
        <Ionicons name="search-outline" size={16} color={COLORS.foregroundMuted} />
        <TextInput
          ref={r => { ref.current = r; }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.foregroundMuted}
          autoFocus={autoFocus}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[typography.body, { flex: 1, color: COLORS.foreground, padding: 0 }]}
        />
        {value.length > 0 ? (
          <Pressable onPress={() => onChangeText('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={COLORS.foregroundMuted} />
          </Pressable>
        ) : null}
      </View>
      {onCancel ? (
        <Animated.View
          style={{
            opacity: anim,
            width: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 70] }),
            overflow: 'hidden',
          }}
        >
          <Pressable
            onPress={() => { ref.current?.blur(); onChangeText(''); onCancel(); }}
            hitSlop={6}
            style={{ paddingHorizontal: SPACING.sm }}
          >
            <Text style={[typography.bodySemibold, { color: COLORS.accent }]}>Cancel</Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </View>
  );
}

