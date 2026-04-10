/**
 * Zero-dependency SVG pie chart using react-native-svg.
 * Renders up to N slices with a centre label.
 */
import { View, Text } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '../../constants/colors';

export interface Slice {
  value: number;
  color: string;
  label: string;
}

interface Props {
  slices: Slice[];
  size?: number;    // outer diameter
  hole?: number;    // inner radius (0 = full pie, >0 = donut)
  centerLabel?: string;
  centerSub?: string;
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polarToXY(cx, cy, r, startDeg);
  const end = polarToXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`;
}

export function PieChart({ slices, size = 180, hole = 54, centerLabel, centerSub }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;

  const total = slices.reduce((s, sl) => s + sl.value, 0);

  if (total === 0) {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size}>
          <Circle cx={cx} cy={cy} r={r} fill={Colors.border} />
          {hole > 0 && <Circle cx={cx} cy={cy} r={hole} fill={Colors.white} />}
        </Svg>
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          <Text style={{ fontSize: 13, color: Colors.textLight, fontWeight: '600' }}>No data</Text>
        </View>
      </View>
    );
  }

  let currentAngle = 0;
  const paths = slices.map((sl) => {
    const sweep = (sl.value / total) * 360;
    const start = currentAngle;
    const end = currentAngle + sweep;
    currentAngle = end;
    return { ...sl, path: buildPath(cx, cy, r, start, end) };
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        {paths.map((p, i) => (
          <Path key={i} d={p.path} fill={p.color} />
        ))}
        {hole > 0 && <Circle cx={cx} cy={cy} r={hole} fill={Colors.white} />}
      </Svg>
      {(centerLabel || centerSub) && (
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          {centerLabel && (
            <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.textPrimary }}>
              {centerLabel}
            </Text>
          )}
          {centerSub && (
            <Text style={{ fontSize: 10, color: Colors.textSecondary, marginTop: 1 }}>
              {centerSub}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
