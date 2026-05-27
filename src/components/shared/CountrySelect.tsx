import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchableList } from './SearchableList';
import { ListRow } from './ListRow';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';
import { COUNTRIES, type Country } from '../../data/countries';

type Props = {
  visible: boolean;
  /** ISO 3166-1 alpha-2 code of the selected country, e.g. "CH". */
  value?: string;
  onChange: (country: Country) => void;
  onClose: () => void;
  /** Override the default country list. */
  countries?: Country[];
  /** Sheet title. Default: 'Select country'. */
  title?: string;
};

/**
 * Country picker — flag + name + dial code, with built-in search.
 *
 * Self-contained sheet: pass `visible`/`onClose` like `BottomSheet`.
 * Composes `SearchableList` for the filter + recents pattern; not
 * intended to render inline.
 *
 *   const [country, setCountry] = useState<Country | undefined>();
 *   const [open, setOpen] = useState(false);
 *   <CountrySelect
 *     visible={open}
 *     value={country?.code}
 *     onClose={() => setOpen(false)}
 *     onChange={c => { setCountry(c); setOpen(false); }}
 *   />
 */
export function CountrySelect({
  visible,
  value,
  onChange,
  onClose,
  countries = COUNTRIES,
  title = 'Select country',
}: Props) {
  const [query, setQuery] = useState('');
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
      >
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: COLORS.background,
            borderTopLeftRadius: RADIUS.xl,
            borderTopRightRadius: RADIUS.xl,
            paddingTop: SPACING.lg,
            paddingBottom: insets.bottom + SPACING.md,
            maxHeight: '85%',
          }}
        >
          {/* Drag handle + title bar */}
          <View
            style={{
              alignSelf: 'center',
              width: 36, height: 4,
              borderRadius: 2,
              backgroundColor: COLORS.divider,
              marginBottom: SPACING.md,
            }}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.xl, marginBottom: SPACING.md }}>
            <Text style={[typography.title, { color: COLORS.foreground, flex: 1 }]}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={20} color={COLORS.foregroundMuted} />
            </Pressable>
          </View>

          <SearchableList
            query={query}
            onQueryChange={setQuery}
            placeholder="Search by name or code"
            items={countries}
            keyExtractor={c => c.code}
            matches={(c, q) => {
              const ql = q.toLowerCase();
              return (
                c.name.toLowerCase().includes(ql) ||
                c.code.toLowerCase().includes(ql) ||
                c.dial.includes(ql)
              );
            }}
            renderItem={(c, { last }) => (
              <ListRow
                leading={<Text style={{ fontSize: 26 }}>{c.flag}</Text>}
                primary={c.name}
                secondary={c.code}
                value={c.dial}
                onPress={() => onChange(c)}
                last={last}
                trailing={
                  value === c.code ? (
                    <Ionicons name="checkmark" size={20} color={COLORS.accent} />
                  ) : undefined
                }
              />
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
