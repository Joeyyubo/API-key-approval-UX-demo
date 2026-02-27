import React from 'react';
import { PageSection, Title } from '@patternfly/react-core';

const ConnectivityObservabilityPage = () => (
  <PageSection variant="light">
    <Title headingLevel="h1" size="2xl">Observability</Title>
    <p style={{ marginTop: '16px', color: 'var(--pf-v5-global--Color--200)' }}>
      Monitor metrics, logs, and traces for your gateways and policies.
    </p>
  </PageSection>
);

export default ConnectivityObservabilityPage;
