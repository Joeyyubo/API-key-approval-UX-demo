import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  FlexItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Icon,
  Tabs,
  Tab,
  TabTitleText
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@patternfly/react-table';
import { FilterIcon, CodeBranchIcon, EllipsisVIcon, LinkIcon } from '@patternfly/react-icons';

const PORTAL_URLS = {
  'External portal-1': 'https://ext1.us.portals.com/',
  'External portal-2': 'https://ext2.us.portals.com/',
  'External portal-3': 'https://ext3.us.portals.com/',
  'External portal-4': 'https://6599dc1ad2aa.us.portals.com/',
  'External portal-5': 'https://ext5.us.portals.com/'
};

const ROW_NAMES = [
  'Order Service',
  'User Authentication',
  'Payment Gateway',
  'Product Catalog',
  'Inventory Service',
  'Notification API',
  'Analytics Events',
  'Customer Profile'
];
const VERSIONS = ['v1.0.0', 'v1.2.0', 'v2.0.0', 'v1.1.0', 'v1.5.0', 'v1.0.0', 'v2.1.0', 'v1.3.0'];
const STATUSES = ['Published', 'Draft', 'Published', 'Published', 'Draft', 'Published', 'Published', 'Draft'];
const POLICIES = ['Default', 'Bronze', 'Gold', 'Default', 'Silver', 'Gold', 'Default', 'Bronze'];

const tableData = ROW_NAMES.map((name, i) => ({
  id: `row-${i}`,
  name: name,
  version: VERSIONS[i],
  status: STATUSES[i],
  policy: POLICIES[i]
}));

const PortalDetailPage = ({ portalName, onBack }) => {
  const [activeTabKey, setActiveTabKey] = useState('overview');
  const [planPolicyOpen, setPlanPolicyOpen] = useState(false);
  const [lifecycleOpen, setLifecycleOpen] = useState(false);
  const [actionsOpenRowId, setActionsOpenRowId] = useState(null);

  const portalUrl = PORTAL_URLS[portalName] || `https://${portalName.toLowerCase().replace(/\s+/g, '-')}.us.portals.com/`;

  return (
    <>
      <PageSection variant="light">
        <Breadcrumb style={{ marginBottom: '16px' }}>
          <BreadcrumbItem
            onClick={onBack}
            isLink
            style={{ color: '#0066cc', cursor: 'pointer', textDecoration: 'underline' }}
          >
            API catalog
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{portalName}</BreadcrumbItem>
        </Breadcrumb>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">{portalName}</Title>
          </FlexItem>
          <FlexItem>
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--pf-t--global--text--color--link--default)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <LinkIcon style={{ fontSize: '14px' }} />
              {portalUrl}
            </a>
          </FlexItem>
        </Flex>
        <Tabs
          activeKey={activeTabKey}
          onSelect={(e, tabKey) => setActiveTabKey(tabKey)}
          style={{ marginTop: '24px' }}
        >
          <Tab eventKey="overview" title={<TabTitleText>Overview</TabTitleText>} />
          <Tab eventKey="published-apis" title={<TabTitleText>Published APIs</TabTitleText>} />
          <Tab eventKey="editor" title={<TabTitleText>Editor</TabTitleText>} />
          <Tab eventKey="settings" title={<TabTitleText>Settings</TabTitleText>} />
        </Tabs>
        {activeTabKey === 'published-apis' && (
        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }} style={{ marginTop: '24px' }}>
          <Dropdown
            isOpen={planPolicyOpen}
            onOpenChange={(open) => setPlanPolicyOpen(open)}
            onSelect={() => setPlanPolicyOpen(false)}
            toggle={(toggleRef) => (
              <MenuToggle
                ref={toggleRef}
                onClick={() => setPlanPolicyOpen((prev) => !prev)}
                isExpanded={planPolicyOpen}
                variant="default"
              >
                <Icon style={{ marginRight: '8px' }}>
                  <FilterIcon />
                </Icon>
                Plan policy
              </MenuToggle>
            )}
          >
            <DropdownList>
              <DropdownItem key="default">Default</DropdownItem>
              <DropdownItem key="bronze">Bronze</DropdownItem>
              <DropdownItem key="silver">Silver</DropdownItem>
              <DropdownItem key="gold">Gold</DropdownItem>
            </DropdownList>
          </Dropdown>
          <Dropdown
            isOpen={lifecycleOpen}
            onOpenChange={(open) => setLifecycleOpen(open)}
            onSelect={() => setLifecycleOpen(false)}
            toggle={(toggleRef) => (
              <MenuToggle
                ref={toggleRef}
                onClick={() => setLifecycleOpen((prev) => !prev)}
                isExpanded={lifecycleOpen}
                variant="default"
              >
                <Icon style={{ marginRight: '8px' }}>
                  <FilterIcon />
                </Icon>
                Lifecycle
              </MenuToggle>
            )}
          >
            <DropdownList>
              <DropdownItem key="pub">Published</DropdownItem>
              <DropdownItem key="draft">Draft</DropdownItem>
              <DropdownItem key="deprecated">Deprecated</DropdownItem>
            </DropdownList>
          </Dropdown>
          <FlexItem align={{ default: 'alignRight' }}>
            <Button variant="secondary">Import API</Button>
          </FlexItem>
        </Flex>
        )}
      </PageSection>

      <PageSection>
        {activeTabKey === 'overview' && (
          <p style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
            Overview of {portalName}. Summary and key metrics will appear here.
          </p>
        )}
        {activeTabKey === 'published-apis' && (
        <Table aria-label={`${portalName} API products`}>
          <Thead>
            <Tr>
              <Th sort={{ columnIndex: 0, direction: 'asc' }}>Name</Th>
              <Th>Version</Th>
              <Th>Status</Th>
              <Th>Policy</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {tableData.map((row) => (
              <Tr key={row.id}>
                <Td>
                  <Button variant="link" isInline>
                    {row.name}
                  </Button>
                </Td>
                <Td>{row.version}</Td>
                <Td>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapXs' }}>
                    <Icon>
                      <CodeBranchIcon style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }} />
                    </Icon>
                    <span>{row.status}</span>
                  </Flex>
                </Td>
                <Td>
                  <Button variant="link" isInline>
                    {row.policy}
                  </Button>
                </Td>
                <Td>
                  <Dropdown
                    isOpen={actionsOpenRowId === row.id}
                    onOpenChange={(open) => setActionsOpenRowId(open ? row.id : null)}
                    onSelect={() => setActionsOpenRowId(null)}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        aria-label="Actions"
                        variant="plain"
                        onClick={() => setActionsOpenRowId(actionsOpenRowId === row.id ? null : row.id)}
                      >
                        <EllipsisVIcon />
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem key="view">View details</DropdownItem>
                      <DropdownItem key="edit">Edit</DropdownItem>
                      <DropdownItem key="remove">Remove from portal</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        )}
        {activeTabKey === 'editor' && (
          <p style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
            Editor for {portalName}. Configure portal content and layout here.
          </p>
        )}
        {activeTabKey === 'settings' && (
          <p style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
            Settings for {portalName}. Manage portal configuration and preferences.
          </p>
        )}
      </PageSection>
    </>
  );
};

export default PortalDetailPage;
