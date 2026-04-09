import { View, Text } from 'react-native';
import { Colors } from '../../constants/colors';

export function SectionHeader({ title }: { title: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 12 }}>
      <View style={{ width: 4, height: 18, backgroundColor: Colors.primary, borderRadius: 2, marginRight: 8 }} />
      <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.primary, textTransform: 'uppercase', letterSpacing: 0.8 }}>
        {title}
      </Text>
    </View>
  );
}
