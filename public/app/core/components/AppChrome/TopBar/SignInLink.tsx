import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { signInLinkStyles } from './SignInLink.stylex';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom-v5-compat';

import { Trans } from '@grafana/i18n';
import { contextSrv } from 'app/core/services/context_srv';
import { isFrontendService } from 'app/core/utils/isFrontendService';

export function SignInLink() {
  const femt = isFrontendService();
  const location = useLocation();
  let loginUrl = femt
    ? locationUtil.assureBaseUrl('/login')
    : textUtil.sanitizeUrl(locationUtil.getUrlForPartial(location, { forceLogin: 'true' }));

  // Fix for loginUrl starting with "//" which is a scheme relative URL
  if (loginUrl.startsWith('//')) {
    loginUrl = loginUrl.replace(/\/+/g, '/');
  }

  const handleOnClick = useCallback(() => {
    contextSrv.setRedirectToUrl();
  }, []);

  return (
    <a {...stylex.props(signInLinkStyles.link)} onClick={handleOnClick} href={loginUrl} target={femt ? undefined : '_self'}>
      <Trans i18nKey="app-chrome.top-bar.sign-in">Sign in</Trans>
    </a>
  );
}

