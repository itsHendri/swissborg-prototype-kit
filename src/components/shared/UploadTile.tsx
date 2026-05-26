import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type UploadStatus = 'empty' | 'uploaded' | 'error';

type Props = {
  title: string;
  /** Helper text rendered under the title (only when `empty`). */
  hint?: string;
  /** Ionicon shown in the empty state. Default: 'cloud-upload-outline'. */
  icon?: IconName;
  status?: UploadStatus;
  /** Tap to mock upload. */
  onPress?: () => void;
  /** Filename or summary line shown when `uploaded`. */
  fileName?: string;
  /** Error message — shown when `status === 'error'`. */
  error?: string;
};

/**
 * KYC-style document upload tile. **Mock-only** — no real file picker.
 *
 * Use one per artefact (front of ID, back of ID, selfie). Pair with a
 * Stepper above to convey progress.
 *
 *   <UploadTile title="Front of ID" hint="JPG or PNG, up to 8 MB" onPress={fakeUpload} />
 *   <UploadTile title="Back of ID"  status="uploaded" fileName="back-id.jpg" />
 *   <UploadTile title="Selfie"      status="error" error="Could not detect a face" />
 */
export function UploadTile({
  title,
  hint,
  icon = 'cloud-upload-outline',
  status = 'empty',
  onPress,
  fileName,
  error,
}: Props) {
  const borderColor =
    status === 'uploaded' ? COLORS.accent :
    status === 'error'    ? COLORS.destructive :
    'rgba(255,255,255,0.10)';

  const iconName: IconName =
    status === 'uploaded' ? 'checkmark-circle' :
    status === 'error'    ? 'alert-circle' :
    icon;

  const iconColor =
    status === 'uploaded' ? COLORS.accent :
    status === 'error'    ? COLORS.destructive :
    COLORS.foregroundMuted;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.card,
        borderWidth: 1,
        borderColor,
        borderStyle: status === 'empty' ? 'dashed' : 'solid',
        padding: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 44, height: 44,
          borderRadius: RADIUS.full,
          backgroundColor: COLORS.iconBg,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Ionicons name={iconName} size={22} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[typography.bodySemibold, { color: COLORS.foreground }]}>{title}</Text>
        {status === 'empty' && hint ? (
          <Text style={[typography.label, { color: COLORS.foregroundMuted, marginTop: 2 }]}>{hint}</Text>
        ) : null}
        {status === 'uploaded' && fileName ? (
          <Text style={[typography.label, { color: COLORS.accent, marginTop: 2 }]} numberOfLines={1}>
            {fileName}
          </Text>
        ) : null}
        {status === 'error' && error ? (
          <Text style={[typography.label, { color: COLORS.destructive, marginTop: 2 }]} numberOfLines={2}>
            {error}
          </Text>
        ) : null}
      </View>
      {status === 'empty' ? (
        <Ionicons name="chevron-forward" size={16} color={COLORS.foregroundMuted} />
      ) : null}
    </Pressable>
  );
}
