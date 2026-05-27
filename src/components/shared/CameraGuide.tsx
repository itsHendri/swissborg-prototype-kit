import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

type Props = {
  /** Helper instruction shown above the frame. */
  prompt?: string;
  /** Tap-to-snap CTA. Mock — does not actually open the camera. */
  onCapture?: () => void;
  /** Captured-state visualisation: dim frame + a check icon. */
  captured?: boolean;
  /** Override the CTA label. */
  ctaLabel?: string;
};

const FRAME = 240;

/**
 * **Mock-only** selfie-capture surface for KYC prototypes. Renders a
 * circular frame overlay with a prompt above and a tap-to-snap CTA
 * below. Does *not* hook up the camera — `onCapture` is the place to
 * fire a transition / state update / haptic.
 *
 *   <CameraGuide
 *     prompt="Center your face inside the circle"
 *     onCapture={() => advanceStep()}
 *   />
 */
export function CameraGuide({
  prompt = 'Center your face inside the circle',
  onCapture,
  captured = false,
  ctaLabel = 'Take photo',
}: Props) {
  return (
    <View style={{ paddingHorizontal: SPACING.xl, alignItems: 'center', gap: SPACING.lg }}>
      <Text style={[typography.body, { color: COLORS.foregroundMuted, textAlign: 'center' }]}>
        {prompt}
      </Text>
      <View
        style={{
          width: FRAME,
          height: FRAME,
          borderRadius: FRAME / 2,
          borderWidth: 3,
          borderColor: captured ? COLORS.accent : COLORS.foreground,
          borderStyle: 'dashed',
          backgroundColor: captured ? `${COLORS.accent}11` : COLORS.surface,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons
          name={captured ? 'checkmark-circle' : 'person-outline'}
          size={captured ? 80 : 96}
          color={captured ? COLORS.accent : COLORS.foregroundMuted}
        />
      </View>
      {onCapture ? (
        <Button
          label={captured ? 'Retake' : ctaLabel}
          onPress={onCapture}
          variant={captured ? 'secondary' : 'primary'}
          fullWidth
        />
      ) : null}
    </View>
  );
}
