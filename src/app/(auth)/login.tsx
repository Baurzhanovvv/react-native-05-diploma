import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { auth } from '../../lib/supabase';
import { useRouter } from 'expo-router';

export default function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true);

    const { error } = await auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert('Ошибка входа', error.message);
    } else {
      router.replace('/(home)/(tabs)'); // ✅ редирект
    }

    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);

    const { data, error } = await auth.signUp({ email, password });

    if (error) {
      Alert.alert('Ошибка регистрации', error.message);
    } else if (!data.session) {
      Alert.alert('Подтвердите регистрацию через email!');
    } else {
      router.replace('/(home)/(tabs)'); // ✅ редирект
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      {/* Вкладки */}
      <View style={styles.tabs}>
        <Pressable
          onPress={() => setMode('signin')}
          style={[styles.tab, mode === 'signin' && styles.activeTab]}
        >
          <Text style={[styles.tabText, mode === 'signin' && styles.activeTabText]}>
            Sign In
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setMode('signup')}
          style={[styles.tab, mode === 'signup' && styles.activeTab]}
        >
          <Text style={[styles.tabText, mode === 'signup' && styles.activeTabText]}>
            Sign Up
          </Text>
        </Pressable>
      </View>

      {/* Анимированная форма */}
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        layout={Layout.springify()}
        style={styles.formContainer}
        key={mode}
      >
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          style={styles.input}
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />

        {mode === 'signin' ? (
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={signInWithEmail}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.buttonOutline, loading && styles.buttonDisabled]}
            onPress={signUpWithEmail}
            disabled={loading}
          >
            <Text style={styles.buttonOutlineText}>Sign Up</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3390EC',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTabText: {
    color: '#3390EC',
    fontWeight: 'bold',
  },
  formContainer: {
    gap: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingVertical: 12,
    color: '#000',
  },
  button: {
    backgroundColor: '#3390EC',
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonOutline: {
    borderColor: '#3390EC',
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#3390EC',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
