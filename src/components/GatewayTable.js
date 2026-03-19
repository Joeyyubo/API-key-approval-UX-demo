import React, { useState } from 'react';
import {
  Title,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Flex,
  FlexItem,
  Label,
  Icon,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TableText
} from '@patternfly/react-table';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EllipsisVIcon,
  SortAmountDownIcon,
  SortAmountUpIcon
} from '@patternfly/react-icons';

const GatewayTable = ({ onGatewayNameClick, activeTabKey }) => {
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState({});
  const [activeSortIndex, setActiveSortIndex] = useState(null);
  const [activeSortDirection, setActiveSortDirection] = useState(null);

  const gatewayData = [
    {
      name: 'Gateway example',
      namespace: 'default',
      status: 'Enforced',
      totalRequests: '-',
      successfulRequests: '-',
      errorRate: '-%',
      errorCodes: 'None',
      type: 'ai'
    },
    {
      name: 'MCP demo gateway',
      namespace: 'api-gateway-dmtest1',
      status: 'Enforced',
      totalRequests: '2879',
      successfulRequests: '2879',
      errorRate: '0.0%',
      errorCodes: 'None',
      type: 'mcp'
    },
    {
      name: 'healthy-gateway',
      namespace: 'toystore-orla',
      status: 'Enforced',
      totalRequests: '-',
      successfulRequests: '-',
      errorRate: '-%',
      errorCodes: 'None',
      type: 'api'
    },
    {
      name: 'healthy-gateway-2-electric-boogaloo',
      namespace: 'toystore-orla',
      status: 'Enforced',
      totalRequests: '-',
      successfulRequests: '-',
      errorRate: '-%',
      errorCodes: 'None',
      type: 'api'
    },
    {
      name: 'kserve-ingress-gateway',
      namespace: 'kserve',
      status: 'Enforced',
      totalRequests: '882',
      successfulRequests: '-',
      errorRate: '100.0%',
      errorCodes: '4xx',
      type: 'api'
    },
    {
      name: 'mcp-streamable',
      namespace: 'mcp-gateway',
      status: 'Enforced',
      totalRequests: '474',
      successfulRequests: '-',
      errorRate: '100.0%',
      errorCodes: '4xx, 500',
      type: 'api'
    },
    {
      name: 'unhealthy-gateway',
      namespace: 'toystore-orla',
      status: 'Unknown',
      totalRequests: '-',
      successfulRequests: '-',
      errorRate: '-%',
      errorCodes: 'None',
      type: 'api'
    },
    {
      name: 'unhealthy-gateway-2-electric-boogaloo',
      namespace: 'toystore-orla',
      status: 'Unknown',
      totalRequests: '-',
      successfulRequests: '-',
      errorRate: '-%',
      errorCodes: 'None',
      type: 'api'
    }
  ];

  const columnNames = {
    name: 'Name',
    namespace: 'Namespace',
    status: 'Status',
    totalRequests: 'Total Requests',
    successfulRequests: 'Successful Requests',
    errorRate: 'Error Rate',
    errorCodes: 'Error Codes'
  };

  const getFilteredByTab = () => {
    let filteredByTab = [];
    
    switch (activeTabKey) {
      case 'all-gateways':
        filteredByTab = gatewayData;
        break;
      case 'api-gateways':
        filteredByTab = gatewayData.filter(gateway => gateway.type === 'api');
        break;
      case 'ai-gateways':
        filteredByTab = gatewayData.filter(gateway => gateway.type === 'ai');
        break;
      case 'mcp-gateways':
        filteredByTab = gatewayData.filter(gateway => gateway.type === 'mcp');
        break;
      default:
        filteredByTab = gatewayData;
    }
    
    return filteredByTab;
  };

  const filteredGateways = getFilteredByTab().filter(gateway =>
    gateway.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    gateway.namespace.toLowerCase().includes(searchValue.toLowerCase())
  );

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
    const isEnforced = status === 'Enforced';
    return (
      <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
        <FlexItem>
          <Icon>
            {isEnforced ? (
              <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
            ) : (
              <ExclamationTriangleIcon color="var(--pf-t--global--color--status--warning--200)" />
            )}
          </Icon>
        </FlexItem>
        <FlexItem>
          <span>{status}</span>
        </FlexItem>
      </Flex>
    );
  };

  const renderErrorCodes = (errorCodes) => {
    if (errorCodes === 'None') {
      return (
        <Label color="green" variant="filled" isCompact>
          None
        </Label>
      );
    }
    
    if (errorCodes.includes(',')) {
      const codes = errorCodes.split(', ');
      return (
        <div style={{ display: 'flex', gap: '4px' }}>
          {codes.map((code, index) => (
            <Label key={index} color="red" variant="filled" isCompact>
              {code}
            </Label>
          ))}
        </div>
      );
    }
    
    return (
      <Label color="red" variant="filled" isCompact>
        {errorCodes}
      </Label>
    );
  };

  return (
    <>
      <div>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <Flex alignItems={{ default: 'alignItemsCenter' }}>
                <FlexItem>
                  <Button variant="control" aria-label="Sort by name">
                    Name
                    <SortAmountDownIcon style={{ marginLeft: '8px' }} />
                  </Button>
                </FlexItem>
                <FlexItem>
                  <SearchInput
                    placeholder="Search by name..."
                    value={searchValue}
                    onChange={(event, value) => setSearchValue(value)}
                    onSearch={(event, value) => setSearchValue(value)}
                    onClear={() => setSearchValue('')}
                  />
                </FlexItem>
              </Flex>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </div>

      <Table aria-label="Gateways table">
        <Thead>
          <Tr>
            <Th sort={{
              sortBy,
              onSort: (event, index, direction) => {
                setActiveSortIndex(index);
                setActiveSortDirection(direction);
                setSortBy({ index, direction });
              },
              columnIndex: 0
            }}>
              {columnNames.name}
            </Th>
            <Th>{columnNames.namespace}</Th>
            <Th>{columnNames.status}</Th>
            <Th sort={{
              sortBy,
              onSort: (event, index, direction) => {
                setActiveSortIndex(index);
                setActiveSortDirection(direction);
                setSortBy({ index, direction });
              },
              columnIndex: 3
            }}>
              {columnNames.totalRequests}
            </Th>
            <Th sort={{
              sortBy,
              onSort: (event, index, direction) => {
                setActiveSortIndex(index);
                setActiveSortDirection(direction);
                setSortBy({ index, direction });
              },
              columnIndex: 4
            }}>
              {columnNames.successfulRequests}
            </Th>
            <Th sort={{
              sortBy,
              onSort: (event, index, direction) => {
                setActiveSortIndex(index);
                setActiveSortDirection(direction);
                setSortBy({ index, direction });
              },
              columnIndex: 5
            }}>
              {columnNames.errorRate}
            </Th>
            <Th>{columnNames.errorCodes}</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {filteredGateways.map((gateway, rowIndex) => (
            <Tr key={rowIndex}>
              <Td>
                <Icon style={{ marginRight: '8px', color: 'var(--pf-t--global--color--brand--200)' }}>
                  <CheckCircleIcon />
                </Icon>
                {(gateway.name === 'Gateway example' || gateway.name === 'MCP demo gateway') ? (
                  <Button variant="link" isInline onClick={() => onGatewayNameClick(gateway.name)}>
                    {gateway.name}
                  </Button>
                ) : (
                  <span>{gateway.name}</span>
                )}
              </Td>
              <Td>{renderNamespace(gateway.namespace)}</Td>
              <Td>{renderStatus(gateway.status)}</Td>
              <Td>{gateway.totalRequests}</Td>
              <Td>{gateway.successfulRequests}</Td>
              <Td>{gateway.errorRate}</Td>
              <Td>{renderErrorCodes(gateway.errorCodes)}</Td>
              <Td>
                <Dropdown
                  onSelect={() => {}}
                  toggle={
                    <MenuToggle
                      aria-label="Actions"
                      variant="plain"
                      onClick={() => {}}
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
    </>
  );
};

export default GatewayTable; 