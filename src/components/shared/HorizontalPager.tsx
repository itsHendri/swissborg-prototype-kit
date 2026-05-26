import { useState, Children, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

type Props = {
  children: ReactNode;
  /** Width (px) of each page/card. Required for snapping math. */
  itemWidth: number;
  /** Gap between pages. Default: 12. */
  gap?: number;
  /** Horizontal padding at the start/end of the scroll content. Default: 20. */
  sidePadding?: number;
  /** Show the animated dot indicators below the pager. Default: true. */
  showDots?: boolean;
  /** Color of the active dot. Default: `COLORS.foreground`. */
  activeDotColor?: string;
  /** Color of inactive dots. Default: `rgba(255,255,255,0.2)`. */
  inactiveDotColor?: string;
  /** Space between pager and dots. Default: 12. */
  dotsMarginTop?: number;
  /** Number of child items visible / advanced per swipe. Default: 1. */
  itemsPerPage?: number;
};

/**
 * Horizontal snap pager with animated dot indicators.
 *
 * Used by Analytics for the Earned/Cashflow 6-card pager, and by
 * PortfolioScreen for the account pager. Replaces any inlined horizontal
 * snap + dot patterns.
 */
export function HorizontalPager({
  children,
  itemWidth,
  gap = SPACING.md,
  sidePadding = SPACING.xl,
  showDots = true,
  activeDotColor = COLORS.foreground,
  inactiveDotColor = 'rgba(255,255,255,0.2)',
  dotsMarginTop = SPACING.md,
  itemsPerPage = 1,
}: Props) {
  const items = Children.toArray(children);
  const [activeIndex, setActiveIndex] = useState(0);

  // Distance scrolled per "page" — advances by itemsPerPage cards at a time.
  const pageStride = (itemWidth + gap) * itemsPerPage;
  const pageCount = Math.ceil(items.length / itemsPerPage);

  return (
    <View>
      <ScrollView
        horizontal
        snapToInterval={pageStride}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: sidePadding }}
        scrollEventThrottle={16}
        onScroll={e => {
          const offsetX = e.nativeEvent.contentOffset.x;
          const newIndex = Math.round(offsetX / pageStride);
          if (newIndex !== activeIndex && newIndex >= 0 && newIndex < pageCount) {
            setActiveIndex(newIndex);
          }
        }}
      >
        {items.map((child, i) => (
          <View
            key={i}
            style={{
              width: itemWidth,
              marginRight: i === items.length - 1 ? 0 : gap,
            }}
          >
            {child}
          </View>
        ))}
      </ScrollView>

      {showDots && pageCount > 1 && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: dotsMarginTop,
            gap: SPACING.xs + 2 /* 6 */,
          }}
        >
          {Array.from({ length: pageCount }).map((_, i) => (
            <View
              key={i}
              style={{
                width: i === activeIndex ? 16 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === activeIndex ? activeDotColor : inactiveDotColor,
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
