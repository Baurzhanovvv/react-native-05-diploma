import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { styles } from '../../styles/auth.styles';
import { Link } from "expo-router";

export default function Profile() {
  return (
    <View style={styles.container}>
      <Link href="/(tabs)/notifications">Feed screen in tabs</Link>
    </View>
  );
}

