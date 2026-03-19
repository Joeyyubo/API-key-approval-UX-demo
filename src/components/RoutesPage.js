import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Button,
  SearchInput,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Grid,
  GridItem,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Select,
  SelectOption,
  Label,
  Icon,
  Flex,
  FlexItem,
  Divider,
  Alert,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  Tabs,
  Tab,
  TabTitleText
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@patternfly/react-table';
import {
  CheckCircleIcon,
  EllipsisVIcon,
  PlusIcon,
  TrashIcon,
  AngleDownIcon
} from '@patternfly/react-icons';

const RoutesPage = ({ onCreateHTTPRoute }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState('all');

  // Mock data for routes
  const routes = [
    {
      name: 'example-route',
      namespace: 'default',
      status: 'Accepted',
      type: 'HTTPRoute',
      hostnames: ['example.com'],
      path: '/',
      service: 'example-service',
      port: 80,
      lastUpdated: '2 minutes ago',
      description: 'Main HTTP route for the gateway'
    },
    {
      name: 'api-route-1',
      namespace: 'default',
      status: 'Accepted',
      type: 'HTTPRoute',
      hostnames: ['api.example.com'],
      path: '/api/v1',
      service: 'api-service',
      port: 8080,
      lastUpdated: '5 minutes ago',
      description: 'API route for version 1'
    },
    {
      name: 'api-route-2',
      namespace: 'default',
      status: 'Accepted',
      type: 'HTTPRoute',
      hostnames: ['api-v2.example.com'],
      path: '/api/v2',
      service: 'api-v2-service',
      port: 8080,
      lastUpdated: '10 minutes ago',
      description: 'API route for version 2'
    },
    {
      name: 'mcp-api-route',
      namespace: 'api-gateway-dmtest1',
      status: 'Accepted',
      type: 'HTTPRoute',
      hostnames: ['mcp.example.com'],
      path: '/mcp',
      service: 'mcp-service',
      port: 3001,
      lastUpdated: '15 minutes ago',
      description: 'MCP API route'
    },
    {
      name: 'web-route',
      namespace: 'ai-gateway-prod',
      status: 'Accepted',
      type: 'HTTPRoute',
      hostnames: ['web.example.com'],
      path: '/',
      service: 'web-service',
      port: 80,
      lastUpdated: '1 hour ago',
      description: 'Web application route'
    },
    {
      name: 'grpc-route',
      namespace: 'default',
      status: 'Accepted',
      type: 'GRPCRoute',
      hostnames: ['grpc.example.com'],
      path: '/grpc',
      service: 'grpc-service',
      port: 9090,
      lastUpdated: '2 hours ago',
      description: 'gRPC service route'
    }
  ];

  const getFilteredRoutes = () => {
    if (!searchValue) return routes;
    
    return routes.filter(route => 
      route.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      route.namespace.toLowerCase().includes(searchValue.toLowerCase()) ||
      route.type.toLowerCase().includes(searchValue.toLowerCase()) ||
      route.service.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const handleCreateRoute = (routeType) => {
    console.log('Creating route:', routeType);
    if (routeType === 'httproute' && onCreateHTTPRoute) {
      onCreateHTTPRoute();
    }
  };

  const renderNamespace = (namespace) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Label color="green" variant="filled" isCompact>
          NS
        </Label>
        <span style={{ marginLeft: '8px' }}>{namespace}</span>
      </div>
    );
  };

  const renderStatus = (status) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Icon style={{ marginRight: '8px' }}>
          <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
        </Icon>
        <span>{status}</span>
      </div>
    );
  };

  const renderErrorCodes = (errorCodes) => {
    if (!errorCodes || errorCodes.length === 0) {
      return <span style={{ color: '#6a6e73' }}>None</span>;
    }
    
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {errorCodes.map((code, index) => (
          <Label key={index} color="red" variant="filled" isCompact>
            {code}
          </Label>
        ))}
      </div>
    );
  };

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <>
      <PageSection variant="light">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title headingLevel="h1" size="2xl">
            Routes
          </Title>
          <Button
            variant="primary"
            onClick={() => {
              if (onCreateHTTPRoute) {
                onCreateHTTPRoute();
              }
            }}
          >
            Create route
          </Button>
        </div>

        {/* Filter Tabs */}
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          style={{ marginBottom: '24px' }}
        >
          <Tab eventKey="all" title={<TabTitleText>All Routes ({routes.length})</TabTitleText>} />
          <Tab eventKey="httproutes" title={<TabTitleText>HTTPRoutes ({routes.filter(r => r.type === 'HTTPRoute').length})</TabTitleText>} />
          <Tab eventKey="grpcroutes" title={<TabTitleText>GRPCRoutes ({routes.filter(r => r.type === 'GRPCRoute').length})</TabTitleText>} />
        </Tabs>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <SearchInput
            placeholder="Search routes..."
            value={searchValue}
            onChange={(event, value) => setSearchValue(value)}
            onSearch={(event, value) => setSearchValue(value)}
            onClear={() => setSearchValue('')}
            style={{ width: '300px' }}
          />
          <span style={{ fontSize: '14px', color: '#6a6e73' }}>
            {getFilteredRoutes().length} of {routes.length} routes
          </span>
        </div>

        {/* Routes Table */}
        <Table aria-label="Routes table">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Namespace</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Hostnames</Th>
              <Th>Path</Th>
              <Th>Service</Th>
              <Th>Last Updated</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getFilteredRoutes().map((route, rowIndex) => (
              <Tr key={rowIndex}>
                <Td>
                  <Button variant="link">
                    {route.name}
                  </Button>
                </Td>
                <Td>{renderNamespace(route.namespace)}</Td>
                <Td>{route.type}</Td>
                <Td>{renderStatus(route.status)}</Td>
                <Td>{route.hostnames.join(', ')}</Td>
                <Td>{route.path}</Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>{route.service}</span>
                    <span style={{ marginLeft: '8px', color: '#6a6e73' }}>:{route.port}</span>
                  </div>
                </Td>
                <Td>{route.lastUpdated}</Td>
                <Td>
                  <Dropdown
                    onSelect={(_event, _itemId) => {}}
                    onOpenChange={() => {}}
                    toggle={
                      <MenuToggle
                        aria-label="Actions"
                        variant="plain"
                        onClick={(_event) => {}}
                      >
                        <EllipsisVIcon />
                      </MenuToggle>
                    }
                    isOpen={false}
                  >
                    <DropdownList>
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

export default RoutesPage; 