import React from 'react';
import { PageSection, Title } from '@patternfly/react-core';

/**
 * Test tab — placeholder under RHCL API catalog nav.
 */
const APIKeyTestTabPage = () => (
  <PageSection variant="light">
    <Title headingLevel="h1" size="2xl">
      Test tab
    </Title>
    <p
      style={{
        marginTop: 'var(--pf-t--global--spacer--sm)',
        color: 'var(--pf-t--global--text--color--subtle)'
      }}
    >
      Content for this tab will appear here.
    </p>
  </PageSection>
);

export default APIKeyTestTabPage;
