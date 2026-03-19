import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Flex,
  FlexItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Icon
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@patternfly/react-table';
import { FilterIcon, CodeBranchIcon, EllipsisVIcon } from '@patternfly/react-icons';

// Align with portals: APIs in portals are published from API products
const API_NAMES = [
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
const POLICIES = ['analytics-plans', 'payments-plans', 'default-plans', 'inventory-plans', 'notification-plans', 'analytics-plans', 'payments-plans', 'default-plans'];

const tableData = API_NAMES.map((name, i) => ({
  id: `row-${i}`,
  name,
  version: VERSIONS[i],
  status: STATUSES[i],
  policy: POLICIES[i]
}));

const APIProductsPage = () => {
  const [planPolicyOpen, setPlanPolicyOpen] = useState(false);
  const [lifecycleOpen, setLifecycleOpen] = useState(false);
  const [actionsOpenRowId, setActionsOpenRowId] = useState(null);

  return (
    <>
      <PageSection variant="light">
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">API products</Title>
            <p style={{ marginTop: '8px', color: 'var(--pf-t--global--text--color--subtle)' }}>
              Create and publish your API product to portal.
            </p>
          </FlexItem>
          <FlexItem>
            <Button variant="primary">Create API Product</Button>
          </FlexItem>
        </Flex>
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
        </Flex>
      </PageSection>

      <PageSection>
        <Table aria-label="API products table">
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
                      <DropdownItem key="delete">Delete</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageSection>
    </>
  );
};

export default APIProductsPage;
