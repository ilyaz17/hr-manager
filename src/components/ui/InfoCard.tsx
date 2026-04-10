import { View, Text } from 'react-native';
import { Colors } from '../../constants/colors';

interface Props {
  emoji: string;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  bgColor: string;
}

export function InfoCard({ emoji, label, value, sub, color, bgColor }: Props) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: Colors.radius,
        padding: 14,
        margin: 4,
        borderWidth: 1,
        borderColor: Colors.border,
        borderLeftWidth: 4,
        borderLeftColor: color,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: bgColor,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
          }}
        >
          <Text style={{ fontSize: 18 }}>{emoji}</Text>
        </View>
        <Text style={{ fontSize: 11, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.4, flex: 1 }}>
          {label}
        </Text>
      </View>
      <Text style={{ fontSize: 26, fontWeight: '800', color }}>{value}</Text>
      {sub ? (
        <Text style={{ fontSize: 11, color: Colors.textLight, marginTop: 2 }}>{sub}</Text>
      ) : null}
    </View>
  );
}
