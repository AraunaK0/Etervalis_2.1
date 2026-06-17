import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#2e7d32',
  primaryDark: '#1b5e20',
  primaryLight: '#4caf50',
  secondary: '#ffd700',
  white: '#ffffff',
  black: '#000000',
  error: '#f44336',
  success: '#4caf50',
  warning: '#ff9800',
  background: '#2e7d32',
  cardBg: 'rgba(255,255,255,0.15)',
  inputBg: 'rgba(255,255,255,0.15)',
  border: 'rgba(255,255,255,0.2)',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.8)',
  textMuted: 'rgba(255,255,255,0.6)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  h3: { fontSize: 20, fontWeight: 'bold' },
  body: { fontSize: 16 },
  small: { fontSize: 14 },
  caption: { fontSize: 12 },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 30,
    padding: spacing.md,
    color: colors.white,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  button: {
    borderRadius: 30,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  buttonPrimary: {
    backgroundColor: colors.white,
  },
  buttonPrimaryText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonOutlineText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  backText: {
    color: colors.white,
    fontSize: 16,
  },
  pointsBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  pointsText: {
    color: colors.secondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  successText: {
    color: colors.success,
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});