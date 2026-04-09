import { View, Text, TextInput, TextInputProps } from 'react-native';
import { Colors } from '../../constants/colors';

interface Props extends TextInputProps {
  label: string;
}

export function FormField({ label, ...props }: Props) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: Colors.border,
          borderRadius: Colors.radius,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 15,
          color: Colors.textPrimary,
          backgroundColor: Colors.background,
        }}
        placeholderTextColor={Colors.textLight}
        {...props}
      />
    </View>
  );
}
