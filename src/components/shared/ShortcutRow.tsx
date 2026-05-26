import { View } from 'react-native';
import type { ReactNode } from 'react';
import { SPACING } from '../../constants/spacing';

export function ShortcutRow({ children }: { children: ReactNode }) {
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: SPACING.xl,
      marginBottom: SPACING['3xl'] - 4 /* 28 */,
    }}>
      {children}
    </View>
  );
}
