import React from 'react';
import { PageSection, Title } from '@patternfly/react-core';

/**
 * API key observability — placeholder under RHCL API catalog nav.
 */
const APIKeyObservabilityPage = () => (
  <PageSection variant="light">
    <Title headingLevel="h1" size="2xl">
      Observability
    </Title>
    <p
      style={{
        marginTop: 'var(--pf-t--global--spacer--sm)',
        color: 'var(--pf-t--global--text--color--subtle)'
      }}
    >
      Metrics, usage, and health for API keys will appear here.
    </p>
  </PageSection>
);

export default APIKeyObservabilityPage;
