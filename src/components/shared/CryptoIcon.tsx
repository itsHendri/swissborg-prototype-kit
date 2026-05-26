/**
 * CryptoIcon
 *
 * Renders a custom SVG icon for a known crypto symbol, or falls back to a
 * coloured letter-circle if no SVG exists yet.
 *
 * To add more icons: drop an ic_crypto_<symbol>.svg into
 * assets/icons/crypto-icons/, add an import below, and add the symbol to
 * ICON_MAP.
 */

import React from 'react';
import { View, Text } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import { COLORS } from '../../constants/colors';

import BtcIcon   from '../../../assets/icons/crypto-icons/ic_crypto_btc.svg';
import SolIcon   from '../../../assets/icons/crypto-icons/ic_crypto_sol.svg';
import EthIcon   from '../../../assets/icons/crypto-icons/ic_crypto_eth.svg';
import UsdcIcon  from '../../../assets/icons/crypto-icons/ic_crypto_usdc.svg';
import UsdtIcon  from '../../../assets/icons/crypto-icons/ic_crypto_usdt.svg';
import BorgIcon  from '../../../assets/icons/crypto-icons/ic_crypto_borg.svg';
import BnbIcon   from '../../../assets/icons/crypto-icons/ic_crypto_bnb.svg';
import AvaxIcon  from '../../../assets/icons/crypto-icons/ic_crypto_avax.svg';
import AdaIcon   from '../../../assets/icons/crypto-icons/ic_crypto_ada.svg';
import LinkIcon  from '../../../assets/icons/crypto-icons/ic_crypto_link.svg';
import UniIcon   from '../../../assets/icons/crypto-icons/ic_crypto_uni.svg';
import DaiIcon   from '../../../assets/icons/crypto-icons/ic_crypto_dai.svg';
import AaveIcon  from '../../../assets/icons/crypto-icons/ic_crypto_aave.svg';
import ArbIcon   from '../../../assets/icons/crypto-icons/ic_crypto_arb.svg';
import SuiIcon   from '../../../assets/icons/crypto-icons/ic_crypto_sui.svg';
import SandIcon  from '../../../assets/icons/crypto-icons/ic_crypto_sand.svg';
import GalaIcon  from '../../../assets/icons/crypto-icons/ic_crypto_gala.svg';
import ChzIcon   from '../../../assets/icons/crypto-icons/ic_crypto_chz.svg';
import CompIcon  from '../../../assets/icons/crypto-icons/ic_crypto_comp.svg';
import GrtIcon   from '../../../assets/icons/crypto-icons/ic_crypto_grt.svg';
import KsmIcon   from '../../../assets/icons/crypto-icons/ic_crypto_ksm.svg';
import CakeIcon  from '../../../assets/icons/crypto-icons/ic_crypto_cake.svg';
import BatIcon   from '../../../assets/icons/crypto-icons/ic_crypto_bat.svg';
import BonkIcon  from '../../../assets/icons/crypto-icons/ic_crypto_bonk.svg';
import UniIcon2  from '../../../assets/icons/crypto-icons/ic_crypto_uni.svg';
import PolIcon   from '../../../assets/icons/crypto-icons/ic_crypto_pol.svg';
import StgIcon   from '../../../assets/icons/crypto-icons/ic_crypto_stg.svg';
import GmxIcon   from '../../../assets/icons/crypto-icons/ic_crypto_gmx.svg';
import EnfIcon   from '../../../assets/icons/crypto-icons/ic_crypto_ens.svg';

type IconFC = React.FC<SvgProps>;

const ICON_MAP: Record<string, IconFC> = {
  BTC:   BtcIcon,
  ETH:   EthIcon,
  USDC:  UsdcIcon,
  USDT:  UsdtIcon,
  BORG:  BorgIcon,
  SOL:   SolIcon,
  BNB:   BnbIcon,
  AVAX:  AvaxIcon,
  ADA:   AdaIcon,
  LINK:  LinkIcon,
  UNI:   UniIcon,
  DAI:   DaiIcon,
  AAVE:  AaveIcon,
  ARB:   ArbIcon,
  SUI:   SuiIcon,
  SAND:  SandIcon,
  GALA:  GalaIcon,
  CHZ:   ChzIcon,
  COMP:  CompIcon,
  GRT:   GrtIcon,
  KSM:   KsmIcon,
  CAKE:  CakeIcon,
  BAT:   BatIcon,
  BONK:  BonkIcon,
  POL:   PolIcon,
  STG:   StgIcon,
  GMX:   GmxIcon,
  ENS:   EnfIcon,
};

const TOKEN_COLORS: Record<string, string> = {
  BTC:  '#F7931A',
  ETH:  '#627EEA',
  SOL:  '#9945FF',
  USDC: '#2775CA',
  USDT: '#26A17B',
  BORG: '#7C6FE5',
  BNB:  '#F0B90B',
  AVAX: '#E84142',
  ADA:  '#0033AD',
  LINK: '#2A5ADA',
  UNI:  '#FF007A',
  DAI:  '#F5AC37',
  AAVE: '#B6509E',
  ARB:  '#28A0F0',
  SUI:  '#4DA2FF',
};

type Props = {
  symbol: string;
  size?: number;
};

export function CryptoIcon({ symbol, size = 40 }: Props) {
  const key = symbol.toUpperCase();
  const IconComponent = ICON_MAP[key];

  if (IconComponent) {
    return <IconComponent width={size} height={size} />;
  }

  // Fallback: coloured letter circle for any symbol without an SVG
  const color = TOKEN_COLORS[key] ?? COLORS.foregroundMuted;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color + '22',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color, fontSize: size * 0.36, fontWeight: '700' }}>
        {symbol[0]?.toUpperCase()}
      </Text>
    </View>
  );
}
