import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { loginFormStyles } from './LoginForm.stylex';
import { type ReactElement, useId } from 'react';
import { useForm } from 'react-hook-form';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { Button, Input, Field } from '@grafana/ui';

import { PasswordField } from '../PasswordField/PasswordField';

import { type FormModel } from './LoginCtrl';

interface Props {
  children: ReactElement;
  onSubmit: (data: FormModel) => void;
  isLoggingIn: boolean;
  passwordHint: string;
  loginHint: string;
}

export const LoginForm = ({ children, onSubmit, isLoggingIn, passwordHint, loginHint }: Props) => {
  const usernameId = useId();
  const passwordId = useId();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormModel>({ mode: 'onChange' });

  return (
    <div {...stylex.props(loginFormStyles.wrapper)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          label={t('login.form.username-label', 'Email or username')}
          invalid={!!errors.user}
          error={errors.user?.message}
        >
          <Input
            {...register('user', { required: t('login.form.username-required', 'Email or username is required') })}
            id={usernameId}
            autoFocus
            autoCapitalize="none"
            placeholder={loginHint || t('login.form.username-placeholder', 'email or username')}
            data-testid={selectors.pages.Login.username}
          />
        </Field>
        <Field
          label={t('login.form.password-label', 'Password')}
          invalid={!!errors.password}
          error={errors.password?.message}
        >
          <PasswordField
            {...register('password', { required: t('login.form.password-required', 'Password is required') })}
            id={passwordId}
            autoComplete="current-password"
            placeholder={passwordHint || t('login.form.password-placeholder', 'password')}
          />
        </Field>
        <Button
          type="submit"
          data-testid={selectors.pages.Login.submit}
          {...stylex.props(loginFormStyles.submitButton)}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? t('login.form.submit-loading-label', 'Logging in...') : t('login.form.submit-label', 'Log in')}
        </Button>
        {children}
      </form>
    </div>
  );
};

export 