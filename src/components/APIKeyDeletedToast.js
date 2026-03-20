import React from 'react';
import { Alert, AlertVariant, Button } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import ApiKeyToastFrame from './ApiKeyToastFrame';

/**
 * Success notice after Delete API key (PatternFly success alert).
 * Renders below masthead; auto-dismisses after PatternFly-style interval.
 */
const APIKeyDeletedToast = ({ api, keyName, onClose }) => (
  <ApiKeyToastFrame aria-label="API key deleted" onClose={onClose}>
    <Alert
      variant={AlertVariant.success}
      isLiveRegion
      title="API key deleted"
      actionClose={
        <Button variant="plain" onClick={onClose} aria-label="Dismiss notification" icon={<TimesIcon />} />
      }
    >
      <div style={{ marginBottom: 'var(--pf-t--global--spacer--xs)' }}>
        <span style={{ fontWeight: 'var(--pf-t--global--font--weight--body--bold)' }}>API: </span>
        {api}
      </div>
      <div>
        <span style={{ fontWeight: 'var(--pf-t--global--font--weight--body--bold)' }}>API key name: </span>
        {keyName}
      </div>
    </Alert>
  </ApiKeyToastFrame>
);

export default APIKeyDeletedToast;
