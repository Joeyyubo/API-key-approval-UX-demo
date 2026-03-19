import React, { useState, useEffect } from 'react';
import {
  PageSection,
  Title,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Form,
  FormGroup,
  TextInput,
  Select,
  SelectOption,
  Checkbox,
  Divider,
  Flex,
  FlexItem,
  Label,
  Icon,
  Badge,
  Tabs,
  Tab,
  TabTitleText,
  TabContent,
  TabContentBody,
  SearchInput,
  Switch,
  Alert,
  AlertActionLink
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@patternfly/react-table';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InfoCircleIcon,
  ClockIcon,
  DownloadIcon,
  FilterIcon,
  SyncIcon,
  PlayIcon,
  PauseIcon,
  EyeIcon,
  EyeSlashIcon
} from '@patternfly/react-icons';

const MCPServerLogsPage = ({ serverName = 'Desktop Commander', onBack, onCancel }) => {
  const [activeTabKey, setActiveTabKey] = useState('realtime');
  const [isLiveLogging, setIsLiveLogging] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [selectedLogLevels, setSelectedLogLevels] = useState(['info', 'warn', 'error']);
  const [timeRange, setTimeRange] = useState('1h');
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);

  // Generate mock log data
  useEffect(() => {
    const generateMockLogs = () => {
      const logLevels = ['info', 'warn', 'error', 'debug'];
      const logMessages = [
        'Tool request received: read_file',
        'Tool request received: list_directory',
        'Tool request received: write_file',
        'Connection established with client',
        'Authentication successful',
        'Tool execution completed',
        'Performance metrics updated',
        'Memory usage: 45MB',
        'CPU usage: 12%',
        'Network request processed',
        'File operation completed',
        'Error occurred during tool execution',
        'Connection timeout detected',
        'Retry attempt initiated',
        'Tool discovery completed',
        'Configuration updated',
        'Session started',
        'Session ended',
        'Resource cleanup completed',
        'Health check performed'
      ];

      const mockLogs = [];
      const now = new Date();
      
      for (let i = 0; i < 200; i++) {
        const timestamp = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
        const level = logLevels[Math.floor(Math.random() * logLevels.length)];
        const message = logMessages[Math.floor(Math.random() * logMessages.length)];
        const requestId = `req-${Math.random().toString(36).substr(2, 9)}`;
        
        mockLogs.push({
          id: i + 1,
          timestamp: timestamp.toISOString(),
          level,
          message,
          requestId,
          duration: Math.floor(Math.random() * 1000),
          source: 'desktop-commander',
          userId: `user-${Math.floor(Math.random() * 10) + 1}`
        });
      }
      
      return mockLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    };

    setLogs(generateMockLogs());
  }, []);

  // Filter logs based on search and level filters
  useEffect(() => {
    let filtered = logs.filter(log => 
      selectedLogLevels.includes(log.level) &&
      (searchValue === '' || 
       log.message.toLowerCase().includes(searchValue.toLowerCase()) ||
       log.requestId.toLowerCase().includes(searchValue.toLowerCase()) ||
       log.source.toLowerCase().includes(searchValue.toLowerCase()))
    );
    
    setFilteredLogs(filtered);
  }, [logs, searchValue, selectedLogLevels]);

  const getLogLevelIcon = (level) => {
    switch (level) {
      case 'error':
        return <ExclamationCircleIcon color="var(--pf-t--global--color--status--danger--100)" />;
      case 'warn':
        return <ExclamationTriangleIcon color="var(--pf-t--global--color--status--warning--200)" />;
      case 'info':
        return <InfoCircleIcon color="var(--pf-t--global--color--status--info--100)" />;
      case 'debug':
        return <InfoCircleIcon color="var(--pf-t--global--text--color--subtle)" />;
      default:
        return <InfoCircleIcon />;
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error':
        return 'red';
      case 'warn':
        return 'orange';
      case 'info':
        return 'blue';
      case 'debug':
        return 'grey';
      default:
        return 'blue';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleLogLevelToggle = (level) => {
    setSelectedLogLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const handleExportLogs = () => {
    const logData = filteredLogs.map(log => ({
      timestamp: log.timestamp,
      level: log.level,
      message: log.message,
      requestId: log.requestId,
      duration: log.duration,
      source: log.source,
      userId: log.userId
    }));
    
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${serverName.toLowerCase().replace(' ', '-')}-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderRealtimeLogs = () => (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Alert
          variant="info"
          title="Live Logging Active"
          actionLinks={
            <AlertActionLink onClick={() => setIsLiveLogging(!isLiveLogging)}>
              {isLiveLogging ? 'Pause' : 'Resume'}
            </AlertActionLink>
          }
        >
          {isLiveLogging ? 'Logs are being updated in real-time' : 'Live logging is paused'}
        </Alert>
      </div>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #d7d7d7', 
        borderRadius: '6px',
        padding: '16px',
        fontFamily: 'monospace',
        fontSize: '14px',
        height: '400px',
        overflowY: 'auto'
      }}>
        {filteredLogs.map((log, index) => (
          <div key={log.id} style={{ 
            marginBottom: '8px',
            padding: '4px 0',
            borderBottom: index < filteredLogs.length - 1 ? '1px solid #e6e6e6' : 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#6a6e73', minWidth: '180px' }}>
                {formatTimestamp(log.timestamp)}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {getLogLevelIcon(log.level)}
                <Label color={getLogLevelColor(log.level)} variant="filled" isCompact>
                  {log.level.toUpperCase()}
                </Label>
              </div>
              <span style={{ color: '#0066cc', minWidth: '120px' }}>
                {log.requestId}
              </span>
              <span style={{ flex: 1 }}>
                {log.message}
              </span>
              {log.duration && (
                <span style={{ color: '#6a6e73', minWidth: '60px' }}>
                  {log.duration}ms
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLogTable = () => (
    <div>
      <Table aria-label="Server logs table">
        <Thead>
          <Tr>
            <Th>Timestamp</Th>
            <Th>Level</Th>
            <Th>Request ID</Th>
            <Th>Message</Th>
            <Th>Duration</Th>
            <Th>Source</Th>
            <Th>User</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredLogs.map((log) => (
            <Tr key={log.id}>
              <Td>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon style={{ marginRight: '8px' }}>
                    <ClockIcon />
                  </Icon>
                  <span>{formatTimestamp(log.timestamp)}</span>
                </div>
              </Td>
              <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {getLogLevelIcon(log.level)}
                  <Label color={getLogLevelColor(log.level)} variant="filled" isCompact>
                    {log.level.toUpperCase()}
                  </Label>
                </div>
              </Td>
              <Td>
                <code style={{ fontSize: '12px' }}>{log.requestId}</code>
              </Td>
              <Td>
                <div style={{ maxWidth: '300px', wordBreak: 'break-word' }}>
                  {log.message}
                </div>
              </Td>
              <Td>
                {log.duration ? (
                  <Badge isRead>{log.duration}ms</Badge>
                ) : (
                  <span style={{ color: '#6a6e73' }}>-</span>
                )}
              </Td>
              <Td>
                <code style={{ fontSize: '12px' }}>{log.source}</code>
              </Td>
              <Td>
                <span style={{ fontSize: '12px' }}>{log.userId}</span>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );

  return (
    <>
      <PageSection variant="light">
        <Breadcrumb>
          <BreadcrumbItem>
            <Button variant="link" onClick={onBack}>
              {serverName}
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem>View Logs</BreadcrumbItem>
        </Breadcrumb>
        
        <Title headingLevel="h1" size="2xl" style={{ marginTop: '16px' }}>
          Server Logs - {serverName}
        </Title>
      </PageSection>
      
      <PageSection>
        {/* Filters and Controls */}
        <Card style={{ marginBottom: '24px' }}>
          <CardBody>
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }}>
                  <FlexItem>
                    <SearchInput
                      placeholder="Search logs..."
                      value={searchValue}
                      onChange={(event, value) => setSearchValue(value)}
                      onSearch={(event, value) => setSearchValue(value)}
                      onClear={() => setSearchValue('')}
                    />
                  </FlexItem>
                  <FlexItem>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[
                        { value: '15m', label: 'Last 15 minutes' },
                        { value: '1h', label: 'Last hour' },
                        { value: '6h', label: 'Last 6 hours' },
                        { value: '24h', label: 'Last 24 hours' },
                        { value: '7d', label: 'Last 7 days' }
                      ].map(range => (
                        <Button
                          key={range.value}
                          variant={timeRange === range.value ? 'primary' : 'secondary'}
                          onClick={() => setTimeRange(range.value)}
                          size="sm"
                        >
                          {range.label}
                        </Button>
                      ))}
                    </div>
                  </FlexItem>
                  <FlexItem>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px' }}>Log Levels:</span>
                      {['error', 'warn', 'info', 'debug'].map(level => (
                        <Checkbox
                          key={level}
                          id={`level-${level}`}
                          isChecked={selectedLogLevels.includes(level)}
                          onChange={() => handleLogLevelToggle(level)}
                          label={level.toUpperCase()}
                        />
                      ))}
                    </div>
                  </FlexItem>
                </Flex>
              </FlexItem>
              <FlexItem>
                <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                  <Button
                    variant="secondary"
                    onClick={() => setIsLiveLogging(!isLiveLogging)}
                    isDisabled={activeTabKey !== 'realtime'}
                  >
                    <Icon>
                      {isLiveLogging ? <PauseIcon /> : <PlayIcon />}
                    </Icon>
                    {isLiveLogging ? 'Pause' : 'Resume'}
                  </Button>
                  <Button variant="secondary" onClick={() => window.location.reload()}>
                    <Icon><SyncIcon /></Icon>
                    Refresh
                  </Button>
                  <Button variant="secondary" onClick={handleExportLogs}>
                    <Icon><DownloadIcon /></Icon>
                    Export
                  </Button>
                </Flex>
              </FlexItem>
            </Flex>
          </CardBody>
        </Card>

        {/* Log Statistics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <Card>
            <CardBody>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#0066cc' }}>
                  {filteredLogs.length}
                </div>
                <div style={{ fontSize: '14px', color: '#6a6e73' }}>Total Logs</div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#dc3545' }}>
                  {filteredLogs.filter(log => log.level === 'error').length}
                </div>
                <div style={{ fontSize: '14px', color: '#6a6e73' }}>Errors</div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#ffc107' }}>
                  {filteredLogs.filter(log => log.level === 'warn').length}
                </div>
                <div style={{ fontSize: '14px', color: '#6a6e73' }}>Warnings</div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#28a745' }}>
                  {filteredLogs.filter(log => log.level === 'info').length}
                </div>
                <div style={{ fontSize: '14px', color: '#6a6e73' }}>Info</div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Log Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Tabs
                activeKey={activeTabKey}
                onSelect={(event, tabIndex) => setActiveTabKey(tabIndex)}
              >
                <Tab eventKey="realtime" title={<TabTitleText>Real-time Logs</TabTitleText>} />
                <Tab eventKey="table" title={<TabTitleText>Log Table</TabTitleText>} />
              </Tabs>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <TabContent
              activeKey={activeTabKey}
              id="log-content"
            >
              <TabContentBody>
                {activeTabKey === 'realtime' && renderRealtimeLogs()}
                {activeTabKey === 'table' && renderLogTable()}
              </TabContentBody>
            </TabContent>
          </CardBody>
        </Card>

      </PageSection>
    </>
  );
};

export default MCPServerLogsPage;
