import { View, Text } from 'react-native';
import { Colors } from '../../constants/colors';

interface Props {
  label: string;
  value: string | number;
  color?: string;
  bgColor?: string;
}

export function StatCard({ label, value, color = Colors.primary, bgColor = Colors.primaryLight }: Props) {
  return (
    <View style={{
      flex: 1,
      backgroundColor: bgColor,
      borderRadius: Colors.radius,
      padding: 16,
      alignItems: 'center',
      margin: 4,
    }}>
      <Text style={{ fontSize: 28, fontWeight: '800', color }}>{value}</Text>
      <Text style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 4, textAlign: 'center' }}>{label}</Text>
    </View>
  );
}
