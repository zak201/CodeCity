import { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ThemePalette } from '../../constants/palette';
import { useThemeColors } from '../../hooks/useThemeColors';
import { askLog, type LogContext } from '../../lib/claude';
import { LOGBubble } from './LOGBubble';

export interface LOGModalProps {
  visible: boolean;
  concept: string;
  /** Contexte de jeu (quartier, niveau…) pour des réponses dans l'univers. */
  context?: LogContext;
  onClose: () => void;
}

/**
 * Modal plein écran « Demande à LOG » : intro, saisie, réponse fictive pour la phase MVP.
 */
export function LOGModal({ visible, concept, context, onClose }: LOGModalProps) {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const [question, setQuestion] = useState('');
  const [reply, setReply] = useState<string | null>(null);

  const introMessage = useMemo(
    () => `Pose-moi ta question sur ${concept}.`,
    [concept]
  );

  const handleClose = useCallback(() => {
    setQuestion('');
    setReply(null);
    onClose();
  }, [onClose]);

  const handleSend = useCallback(async () => {
    setReply('…');
    const answer = await askLog({ concept, question, context });
    setReply(answer);
  }, [concept, question, context]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.root}>
          <Pressable
            style={styles.backdropPressable}
            onPress={handleClose}
            accessibilityLabel="Fermer en touchant le fond"
            accessibilityRole="button"
          />

          <SafeAreaView
            style={styles.sheet}
            edges={['top', 'bottom']}
            pointerEvents="box-none"
          >
            <View style={styles.header}>
              <View style={styles.headerSpacer} />
              <Pressable
                onPress={handleClose}
                hitSlop={12}
                accessibilityLabel="Fermer la demande à LOG"
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.closeBtn,
                  pressed && styles.closeBtnPressed,
                ]}
              >
                <Text style={styles.closeBtnText}>×</Text>
              </Pressable>
            </View>

            <View style={styles.content} pointerEvents="box-none">
              <LOGBubble message={introMessage} mood="mysterious" animated />

              <TextInput
                value={question}
                onChangeText={setQuestion}
                placeholder="Ta question…"
                placeholderTextColor={c.textMuted}
                style={styles.input}
                multiline
                accessibilityLabel="Champ de question pour LOG"
                accessibilityHint="Saisis ta question sur le concept du niveau"
              />

              <Pressable
                onPress={handleSend}
                accessibilityLabel="Envoyer la question à LOG"
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.sendBtn,
                  pressed && styles.sendBtnPressed,
                ]}
              >
                <Text style={styles.sendBtnText}>Envoyer</Text>
              </Pressable>

              {reply ? (
                <View style={styles.replyWrap}>
                  <LOGBubble message={reply} mood="neutral" animated />
                </View>
              ) : null}
            </View>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const makeStyles = (c: ThemePalette) => StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flex: 1,
    backgroundColor: 'rgba(6, 5, 20, 0.66)',
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  headerSpacer: {
    flex: 1,
  },
  closeBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnPressed: {
    opacity: 0.75,
  },
  closeBtnText: {
    color: c.textPrimary,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '300',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  input: {
    marginTop: 20,
    minHeight: 96,
    maxHeight: 160,
    borderRadius: 12,
    padding: 14,
    backgroundColor: c.bgCard,
    color: c.textPrimary,
    fontSize: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: c.trackOn,
  },
  sendBtn: {
    marginTop: 16,
    backgroundColor: c.neonPurple,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
  },
  sendBtnPressed: {
    opacity: 0.88,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  replyWrap: {
    marginTop: 24,
  },
});
