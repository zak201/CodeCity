import { Platform, ScrollView, StyleSheet, Text } from 'react-native';

import { COLORS } from '../../constants/colors';

const mono = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

export interface CodeBlockProps {
  code: string;
}

/** Bloc de code monospace, défilable horizontalement pour les lignes longues. */
export function CodeBlock({ code }: CodeBlockProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.wrap}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.code} accessibilityLabel={`Code : ${code}`}>
        {code}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#05050f',
    borderWidth: 1,
    borderColor: COLORS.trackOn,
    borderRadius: 10,
    marginBottom: 16,
  },
  content: {
    padding: 14,
  },
  code: {
    color: COLORS.neonGreen,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: mono as string,
  },
});
