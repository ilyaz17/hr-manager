import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/colors';

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'danger' | 'outline';
}

export function PrimaryButton({ label, onPress, loading = false, variant = 'primary' }: Props) {
  const bg = variant === 'primary' ? Colors.primary : variant === 'danger' ? Colors.danger : 'transparent';
  const textColor = variant === 'outline' ? Colors.primary : Colors.white;
  const border = variant === 'outline' ? { borderWidth: 1.5, borderColor: Colors.primary } : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={[
        {
          backgroundColor: bg,
          borderRadius: Colors.radius,
          paddingVertical: 14,
          alignItems: 'center',
          marginTop: 8,
        },
        border,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={{ color: textColor, fontWeight: '700', fontSize: 15 }}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
