import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { Box, Icon, Text } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
import config from 'app/core/config';

interface StrongPasswordValidation {
  message: string;
  validation: (value: string) => boolean;
}

export interface ValidationLabelsProps {
  strongPasswordValidations: StrongPasswordValidation[];
  password: string;
  pristine: boolean;
}

export interface ValidationLabelProps {
  strongPasswordValidation: StrongPasswordValidation;
  password: string;
  pristine: boolean;
}

export const strongPasswordValidations: StrongPasswordValidation[] = [
  {
    message: 'At least 12 characters',
    validation: (value: string) => value.length >= 12,
  },
  {
    message: 'One uppercase letter',
    validation: (value: string) => /[A-Z]+/.test(value),
  },
  {
    message: 'One lowercase letter',
    validation: (value: string) => /[a-z]+/.test(value),
  },
  {
    message: 'One number',
    validation: (value: string) => /[0-9]+/.test(value),
  },
  {
    message: 'One symbol',
    validation: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
];

export const strongPasswordValidationRegister = (value: string) => {
  return (
    !config.auth.basicAuthStrongPasswordPolicy ||
    strongPasswordValidations.every((validation) => validation.validation(value)) ||
    t(
      'profile.change-password.strong-password-validation-register',
      'Password does not comply with the strong password policy'
    )
  );
};

export const ValidationLabels = ({ strongPasswordValidations, password, pristine }: ValidationLabelsProps) => {
  return (
    <Box marginBottom={2}>
      {strongPasswordValidations.map((validation) => (
        <ValidationLabel
          key={validation.message}
          strongPasswordValidation={validation}
          password={password}
          pristine={pristine}
        />
      ))}
    </Box>
  );
};

export const ValidationLabel = ({ strongPasswordValidation, password, pristine }: ValidationLabelProps) => {
  const { basicAuthStrongPasswordPolicy } = config.auth;
  if (!basicAuthStrongPasswordPolicy) {
    return null;
  }

  const { message, validation } = strongPasswordValidation;
  const result = password.length > 0 && validation(password);

  const iconName = result || pristine ? 'check' : 'exclamation-triangle';
  const textColor = result ? 'secondary' : pristine ? 'primary' : 'error';

  const iconColor = result ? styles.iconValid : pristine ? styles.iconPending : styles.iconError;

  return (
    <Box key={message} display={'flex'} alignItems={'center'} marginTop={1}>
      <Icon xstyle={[styles.icon, iconColor]} name={iconName} />
      <Text color={textColor}>{message}</Text>
    </Box>
  );
};

const styles = stylex.create({
  icon: {
    marginRight: spacing['--gf-spacing-x1'],
  },
  iconValid: {
    color: colors['--gf-colors-success-text'],
  },
  iconPending: {
    color: colors['--gf-colors-secondary-text'],
  },
  iconError: {
    color: colors['--gf-colors-error-text'],
  },
});
