import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

type Props = {
  /** Helper instruction shown above the frame. */
  prompt?: string;
  /** Tap-to-scan CTA. Mock — does not actually open the camera. */
  onCapture?: () => void;
  /** Captured-state visualisation. */
  captured?: boolean;
  /** Override the CTA label. */
  ctaLabel?: string;
  /** Aspect ratio of the document. Default: 1.6 (ID-1 card style). */
  aspectRatio?: number;
};

/**
 * **Mock-only** ID/document capture surface. Corners-marked rectangle
 * with a prompt above and a tap-to-scan CTA below. The corners are
 * decorative — there's no real edge detection.
 *
 * Pair with `Stepper` above for KYC flows. Pair with `UploadTile` on
 * a review screen showing all artefacts.
 *
 *   <DocumentScanFrame
 *     prompt="Position the front of your ID inside the frame"
 *     onCapture={() => advance('back-of-id')}
 *   />
 */
export function DocumentScanFrame({
  prompt = 'Position the document inside the frame',
  onCapture,
  captured = false,
  ctaLabel = 'Scan document',
  aspectRatio = 1.6,
}: Props) {
  const cornerColor = captured ? COLORS.accent : COLORS.foreground;
  return (
    <View style={{ paddingHorizontal: SPACING.xl, gap: SPACING.lg }}>
      <Text style={[typography.body, { color: COLORS.foregroundMuted, textAlign: 'center' }]}>
        {prompt}
      </Text>
      <View
        style={{
          aspectRatio,
          backgroundColor: captured ? `${COLORS.accent}11` : COLORS.surface,
          borderRadius: RADIUS.lg,
          overflow: 'hidden',
        }}
      >
        {/* Four corner brackets */}
        <Corner pos="tl" color={cornerColor} />
        <Corner pos="tr" color={cornerColor} />
        <Corner pos="bl" color={cornerColor} />
        <Corner pos="br" color={cornerColor} />
        {captured ? (
          <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="checkmark-circle" size={56} color={COLORS.accent} />
          </View>
        ) : (
          <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="card-outline" size={56} color={COLORS.foregroundMuted} />
          </View>
        )}
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

const CORNER = 28;
const THICKNESS = 3;

function Corner({ pos, color }: { pos: 'tl' | 'tr' | 'bl' | 'br'; color: string }) {
  const top = pos.startsWith('t');
  const left = pos.endsWith('l');
  return (
    <View
      style={{
        position: 'absolute',
        top:    top    ? 12 : undefined,
        bottom: !top   ? 12 : undefined,
        left:   left   ? 12 : undefined,
        right:  !left  ? 12 : undefined,
        width: CORNER,
        height: CORNER,
        borderColor: color,
        borderTopWidth:    top  ? THICKNESS : 0,
        borderBottomWidth: !top ? THICKNESS : 0,
        borderLeftWidth:   left ? THICKNESS : 0,
        borderRightWidth:  !left ? THICKNESS : 0,
        borderTopLeftRadius:     top  && left  ? 6 : 0,
        borderTopRightRadius:    top  && !left ? 6 : 0,
        borderBottomLeftRadius:  !top && left  ? 6 : 0,
        borderBottomRightRadius: !top && !left ? 6 : 0,
      }}
    />
  );
}
