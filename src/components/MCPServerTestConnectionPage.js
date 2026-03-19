import React, { useState } from 'react';
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
  TextArea,
  Select,
  SelectOption,
  Alert,
  AlertActionLink,
  Divider,
  Flex,
  FlexItem,
  Label,
  Icon,
  Progress,
  ProgressVariant,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  PlayIcon,
  StopIcon,
  SyncIcon,
  WifiIcon,
  ServerIcon
} from '@patternfly/react-icons';

const MCPServerTestConnectionPage = ({ serverName = 'Desktop Commander', onBack, onCancel }) => {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [testHistory, setTestHistory] = useState([
    {
      id: 1,
      timestamp: '2025-01-21 14:30:25',
      status: 'success',
      responseTime: 45,
      details: 'Connection successful. All tools available.'
    },
    {
      id: 2,
      timestamp: '2025-01-21 14:25:10',
      status: 'success',
      responseTime: 52,
      details: 'Connection successful. 24 tools available.'
    },
    {
      id: 3,
      timestamp: '2025-01-21 14:20:15',
      status: 'error',
      responseTime: null,
      details: 'Connection failed. Timeout after 30 seconds.'
    }
  ]);

  const [testConfig, setTestConfig] = useState({
    endpoint: 'ws://localhost:3001',
    timeout: 30,
    retries: 3,
    testTools: true,
    testPerformance: true
  });

  const handleTestConnection = async () => {
    setIsTestRunning(true);
    
    // Simulate test process
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      const responseTime = Math.floor(Math.random() * 100) + 20; // 20-120ms
      
      const result = {
        timestamp: new Date().toLocaleString(),
        status: success ? 'success' : 'error',
        responseTime: success ? responseTime : null,
        details: success 
          ? `Connection successful. Response time: ${responseTime}ms. All 24 tools available.`
          : 'Connection failed. Server not responding.',
        tests: success ? [
          { name: 'Endpoint Reachability', status: 'passed', duration: 15 },
          { name: 'Authentication', status: 'passed', duration: 8 },
          { name: 'Tool Discovery', status: 'passed', duration: 12 },
          { name: 'Performance Test', status: 'passed', duration: 10 }
        ] : [
          { name: 'Endpoint Reachability', status: 'failed', duration: 30, error: 'Connection timeout' },
          { name: 'Authentication', status: 'skipped', duration: 0 },
          { name: 'Tool Discovery', status: 'skipped', duration: 0 },
          { name: 'Performance Test', status: 'skipped', duration: 0 }
        ]
      };
      
      setTestResults(result);
      setTestHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 tests
      setIsTestRunning(false);
    }, 3000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />;
      case 'error':
        return <ExclamationTriangleIcon color="var(--pf-t--global--color--status--danger--100)" />;
      case 'running':
        return <ClockIcon color="var(--pf-t--global--color--status--info--100)" />;
      default:
        return <ClockIcon color="var(--pf-t--global--text--color--subtle)" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'green';
      case 'error':
        return 'red';
      case 'running':
        return 'blue';
      default:
        return 'grey';
    }
  };

  return (
    <>
      <PageSection variant="light">
        <Breadcrumb>
          <BreadcrumbItem>
            <Button variant="link" onClick={onBack}>
              {serverName}
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem>Test Connection</BreadcrumbItem>
        </Breadcrumb>
        
        <Title headingLevel="h1" size="2xl" style={{ marginTop: '16px' }}>
          Test Connection - {serverName}
        </Title>
      </PageSection>
      
      <PageSection>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Test Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
            </CardHeader>
            <CardBody>
              <Form>
                <FormGroup label="Endpoint" fieldId="endpoint">
                  <TextInput
                    id="endpoint"
                    value={testConfig.endpoint}
                    onChange={(value) => setTestConfig(prev => ({ ...prev, endpoint: value }))}
                    isDisabled={isTestRunning}
                  />
                </FormGroup>
                
                <FormGroup label="Timeout (seconds)" fieldId="timeout">
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[15, 30, 60, 120].map(timeout => (
                      <Button
                        key={timeout}
                        variant={testConfig.timeout === timeout ? 'primary' : 'secondary'}
                        onClick={() => setTestConfig(prev => ({ ...prev, timeout }))}
                        isDisabled={isTestRunning}
                        size="sm"
                      >
                        {timeout === 120 ? '2 minutes' : `${timeout} seconds`}
                      </Button>
                    ))}
                  </div>
                </FormGroup>
                
                <FormGroup label="Retries" fieldId="retries">
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 3, 5].map(retries => (
                      <Button
                        key={retries}
                        variant={testConfig.retries === retries ? 'primary' : 'secondary'}
                        onClick={() => setTestConfig(prev => ({ ...prev, retries }))}
                        isDisabled={isTestRunning}
                        size="sm"
                      >
                        {retries} {retries === 1 ? 'retry' : 'retries'}
                      </Button>
                    ))}
                  </div>
                </FormGroup>
                
                <FormGroup label="Test Options">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={testConfig.testTools}
                        onChange={(e) => setTestConfig(prev => ({ ...prev, testTools: e.target.checked }))}
                        disabled={isTestRunning}
                      />
                      Test tool availability
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={testConfig.testPerformance}
                        onChange={(e) => setTestConfig(prev => ({ ...prev, testPerformance: e.target.checked }))}
                        disabled={isTestRunning}
                      />
                      Performance test
                    </label>
                  </div>
                </FormGroup>
                
                <div style={{ marginTop: '24px' }}>
                  <Button
                    variant="primary"
                    onClick={handleTestConnection}
                    isDisabled={isTestRunning}
                    style={{ marginRight: '12px' }}
                  >
                    {isTestRunning ? (
                      <>
                        <Icon><ClockIcon /></Icon>
                        Testing...
                      </>
                    ) : (
                      <>
                        <Icon><PlayIcon /></Icon>
                        Start Test
                      </>
                    )}
                  </Button>
                  
                  {isTestRunning && (
                    <Button
                      variant="secondary"
                      onClick={() => setIsTestRunning(false)}
                    >
                      <Icon><StopIcon /></Icon>
                      Stop Test
                    </Button>
                  )}
                </div>
              </Form>
            </CardBody>
          </Card>

          {/* Current Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Current Test Results</CardTitle>
            </CardHeader>
            <CardBody>
              {isTestRunning ? (
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Icon><ClockIcon /></Icon>
                      <span>Running connection test...</span>
                    </div>
                    <Progress
                      value={undefined}
                      variant={ProgressVariant.single}
                      style={{ marginBottom: '16px' }}
                    />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                      <div style={{ fontSize: '14px', color: '#6a6e73' }}>Endpoint</div>
                      <div style={{ fontSize: '16px', fontWeight: '500' }}>
                        <Icon><WifiIcon /></Icon>
                        Testing...
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                      <div style={{ fontSize: '14px', color: '#6a6e73' }}>Server</div>
                      <div style={{ fontSize: '16px', fontWeight: '500' }}>
                        <Icon><ServerIcon /></Icon>
                        Testing...
                      </div>
                    </div>
                  </div>
                </div>
              ) : testResults ? (
                <div>
                  <Alert
                    variant={testResults.status === 'success' ? 'success' : 'danger'}
                    title={testResults.status === 'success' ? 'Connection Test Passed' : 'Connection Test Failed'}
                    style={{ marginBottom: '16px' }}
                  >
                    {testResults.details}
                  </Alert>
                  
                  {testResults.responseTime && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '8px' }}>Response Time</div>
                      <div style={{ fontSize: '24px', fontWeight: '600', color: '#0066cc' }}>
                        {testResults.responseTime}ms
                      </div>
                    </div>
                  )}
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '8px' }}>Test Details</div>
                    {testResults.tests.map((test, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: index < testResults.tests.length - 1 ? '1px solid #d7d7d7' : 'none'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getStatusIcon(test.status)}
                          <span>{test.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', color: '#6a6e73' }}>
                            {test.duration}ms
                          </span>
                          <Label color={getStatusColor(test.status)} variant="filled" isCompact>
                            {test.status}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    variant="secondary"
                    onClick={handleTestConnection}
                    style={{ marginRight: '12px' }}
                  >
                    <Icon><SyncIcon /></Icon>
                    Run Again
                  </Button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6a6e73' }}>
                  <div style={{ fontSize: '16px', marginBottom: '8px' }}>No test results</div>
                  <div style={{ fontSize: '14px' }}>Click "Start Test" to begin connection testing.</div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <Divider style={{ margin: '32px 0' }} />

        {/* Test History */}
        <Card>
          <CardHeader>
            <CardTitle>Test History</CardTitle>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {testHistory.map((test, index) => (
                <div key={test.id} style={{ 
                  border: '1px solid #d7d7d7', 
                  borderRadius: '6px', 
                  padding: '16px',
                  backgroundColor: 'white'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {getStatusIcon(test.status)}
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>
                          {test.status === 'success' ? 'Connection Successful' : 'Connection Failed'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6a6e73' }}>
                          {test.timestamp}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {test.responseTime && (
                        <span style={{ fontSize: '14px', color: '#6a6e73' }}>
                          {test.responseTime}ms
                        </span>
                      )}
                      <Label color={getStatusColor(test.status)} variant="filled" isCompact>
                        {test.status}
                      </Label>
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#6a6e73' }}>
                    {test.details}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

export default MCPServerTestConnectionPage;
