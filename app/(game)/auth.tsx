import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { LOGBubble } from '../../components/log/LOGBubble';
import type { ThemePalette } from '../../constants/palette';
import { useThemeColors } from '../../hooks/useThemeColors';
import { loginAccount, registerAccount } from '../../lib/auth';
import { pushLocalToServer } from '../../lib/sync';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';

const INCORRECT_RED = '#FF6B6B';
type Mode = 'login' | 'register';

export default function AuthScreen() {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const router = useRouter();

  const setAuth = useAuthStore((s) => s.actions.setAuth);
  const setIdentity = useUserStore((s) => s.actions.setIdentity);

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRegister = mode === 'register';

  const submit = useCallback(async () => {
    if (loading) return;
    setError(null);

    if (!email.trim() || !password) {
      setError('Email et mot de passe requis.');
      return;
    }
    if (isRegister && username.trim().length < 2) {
      setError('Choisis un nom d’utilisateur (2 caractères minimum).');
      return;
    }

    setLoading(true);
    const res = isRegister
      ? await registerAccount(email.trim(), username.trim(), password)
      : await loginAccount(email.trim(), password);
    setLoading(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }
    setAuth(res.token, res.user);
    setIdentity(res.user.id, res.user.username);
    // Réclame la partie jouée hors-ligne sur le compte (best-effort).
    void pushLocalToServer();
    router.replace('/(game)/profile');
  }, [
    loading,
    email,
    password,
    username,
    isRegister,
    setAuth,
    setIdentity,
    router,
  ]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            onPress={() => router.back()}
            accessibilityLabel="Retour"
            accessibilityRole="button"
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          >
            <Text style={styles.backLabel}>‹ Retour</Text>
          </Pressable>

          <Text style={styles.title}>
            {isRegister ? 'Créer un compte' : 'Connexion'}
          </Text>

          <LOGBubble
            message="Connecte-toi pour sauvegarder ta progression et la retrouver sur un autre appareil. Le jeu reste jouable sans compte."
            mood="mysterious"
            style={styles.bubble}
          />

          {isRegister ? (
            <View style={styles.field}>
              <Text style={styles.label}>Nom d’utilisateur</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="CodeArchitect"
                placeholderTextColor={c.textMuted}
                autoCapitalize="none"
                style={styles.input}
                accessibilityLabel="Nom d’utilisateur"
              />
            </View>
          ) : null}

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="toi@exemple.com"
              placeholderTextColor={c.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              style={styles.input}
              accessibilityLabel="Email"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="6 caractères minimum"
              placeholderTextColor={c.textMuted}
              secureTextEntry
              style={styles.input}
              accessibilityLabel="Mot de passe"
            />
          </View>

          {error ? (
            <Text style={styles.error} accessibilityRole="alert">
              {error}
            </Text>
          ) : null}

          <Pressable
            onPress={submit}
            disabled={loading}
            accessibilityLabel={isRegister ? 'Créer le compte' : 'Se connecter'}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.submitBtn,
              loading && styles.submitDisabled,
              pressed && !loading && styles.pressed,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#0B0A1E" />
            ) : (
              <Text style={styles.submitText}>
                {isRegister ? 'Créer le compte' : 'Se connecter'}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              setMode(isRegister ? 'login' : 'register');
              setError(null);
            }}
            accessibilityRole="button"
            accessibilityLabel={
              isRegister
                ? 'Basculer vers la connexion'
                : 'Basculer vers la création de compte'
            }
            style={styles.switchBtn}
          >
            <Text style={styles.switchText}>
              {isRegister
                ? 'Déjà un compte ? Se connecter'
                : 'Pas de compte ? En créer un'}
            </Text>
          </Pressable>

          <Text style={styles.demoHint}>
            Démo : player@codecity.dev / codecity123 (ou admin@codecity.dev)
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (c: ThemePalette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.bg },
    flex: { flex: 1 },
    scroll: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 4 },
    backBtn: { alignSelf: 'flex-start', paddingVertical: 8, paddingRight: 12 },
    backLabel: { color: c.neonPurple, fontSize: 16, fontWeight: '600' },
    pressed: { opacity: 0.8 },
    title: {
      color: c.textPrimary,
      fontSize: 26,
      fontWeight: '800',
      marginBottom: 16,
    },
    bubble: { marginBottom: 24 },
    field: { marginBottom: 16 },
    label: {
      color: c.textSecondary,
      fontSize: 13,
      fontWeight: '700',
      marginBottom: 6,
    },
    input: {
      minHeight: 48,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: c.bgCard,
      borderWidth: 1,
      borderColor: c.trackOn,
      color: c.textPrimary,
      fontSize: 16,
    },
    error: {
      color: INCORRECT_RED,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 12,
    },
    submitBtn: {
      minHeight: 52,
      borderRadius: 14,
      backgroundColor: c.neonGreen,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
    },
    submitDisabled: { opacity: 0.6 },
    submitText: { color: '#0B0A1E', fontSize: 17, fontWeight: '800' },
    switchBtn: { alignItems: 'center', paddingVertical: 16, minHeight: 44 },
    switchText: { color: c.neonPurple, fontSize: 15, fontWeight: '700' },
    demoHint: {
      color: c.textMuted,
      fontSize: 12,
      textAlign: 'center',
      marginTop: 4,
    },
  });
