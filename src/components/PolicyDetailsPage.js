import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Tabs,
  Tab,
  TabTitleText,
  Button,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Card,
  CardBody,
  Icon,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  CodeBlock,
  CodeBlockCode,
  Breadcrumb,
  BreadcrumbItem
} from '@patternfly/react-core';
import {
  ArrowUpIcon,
  ArrowDownIcon
} from '@patternfly/react-icons';

// Simple Bar Chart Component
const BarChart = ({ data, title }) => (
  <div style={{ height: '300px' }}>
    <h4 style={{ marginBottom: '24px', fontSize: '16px', fontWeight: 'bold' }}>{title}</h4>
    <svg width="100%" height="240" viewBox="0 0 600 240">
      <defs>
        <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ff6b35', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#ff8659', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Y-axis */}
      <line x1="60" y1="20" x2="60" y2="200" stroke="#d1d5db" strokeWidth="1"/>
      
      {/* X-axis */}
      <line x1="60" y1="200" x2="580" y2="200" stroke="#d1d5db" strokeWidth="1"/>
      
      {/* Y-axis labels */}
      <text x="40" y="25" textAnchor="end" style={{ fontSize: '12px', fill: '#6b7280' }}>240</text>
      <text x="40" y="75" textAnchor="end" style={{ fontSize: '12px', fill: '#6b7280' }}>180</text>
      <text x="40" y="125" textAnchor="end" style={{ fontSize: '12px', fill: '#6b7280' }}>120</text>
      <text x="40" y="175" textAnchor="end" style={{ fontSize: '12px', fill: '#6b7280' }}>60</text>
      <text x="40" y="205" textAnchor="end" style={{ fontSize: '12px', fill: '#6b7280' }}>0</text>
      
      {/* Bars */}
      <rect x="80" y="175" width="60" height="25" fill="url(#barGradient)" rx="4" />
      <rect x="160" y="120" width="60" height="80" fill="url(#barGradient)" rx="4" />
      <rect x="240" y="140" width="60" height="60" fill="url(#barGradient)" rx="4" />
      <rect x="320" y="85" width="60" height="115" fill="url(#barGradient)" rx="4" />
      <rect x="400" y="25" width="60" height="175" fill="url(#barGradient)" rx="4" />
      <rect x="480" y="155" width="60" height="45" fill="url(#barGradient)" rx="4" />
      
      {/* X-axis labels */}
      <text x="110" y="220" textAnchor="middle" style={{ fontSize: '12px', fill: '#6b7280' }}>1min</text>
      <text x="190" y="220" textAnchor="middle" style={{ fontSize: '12px', fill: '#6b7280' }}>5min</text>
      <text x="270" y="220" textAnchor="middle" style={{ fontSize: '12px', fill: '#6b7280' }}>10min</text>
      <text x="350" y="220" textAnchor="middle" style={{ fontSize: '12px', fill: '#6b7280' }}>15min</text>
      <text x="430" y="220" textAnchor="middle" style={{ fontSize: '12px', fill: '#6b7280' }}>30min</text>
      <text x="510" y="220" textAnchor="middle" style={{ fontSize: '12px', fill: '#6b7280' }}>1hour</text>
    </svg>
  </div>
);

const PolicyDetailsPage = ({ policyName, onBack }) => {
  const [activeTabKey, setActiveTabKey] = useState('details');

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  const yamlContent = `apiVersion: kuadrant.io/v1beta1
kind: TokenRateLimitPolicy
metadata:
  name: token-rate-limit-openai
  namespace: ai-gateway-prod
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: HTTPRoute
    name: openai-route
  limits:
    tokens_per_minute:
      rates:
      - limit: 1000
        duration: 60s
      counters:
      - token_count
  providers:
  - name: openai
    endpoint: https://api.openai.com
    tokenCounter: gpt_tokens`;

  const renderDetailsTab = () => (
    <Grid hasGutter>
      <GridItem span={6}>
        <Card>
          <CardBody>
            <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
              Policy Information
            </Title>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Name</DescriptionListTerm>
                <DescriptionListDescription>token-rate-limit-openai</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Type</DescriptionListTerm>
                <DescriptionListDescription>TokenRateLimitPolicy</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Namespace</DescriptionListTerm>
                <DescriptionListDescription>ai-gateway-prod</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Status</DescriptionListTerm>
                <DescriptionListDescription>Enforced</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Created</DescriptionListTerm>
                <DescriptionListDescription>Jul 15, 2025, 2:30 PM</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem span={6}>
        <Card>
          <CardBody>
            <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
              Configuration
            </Title>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Token Limit</DescriptionListTerm>
                <DescriptionListDescription>1000 tokens/min</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Provider</DescriptionListTerm>
                <DescriptionListDescription>OpenAI</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Target Route</DescriptionListTerm>
                <DescriptionListDescription>openai-route</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Duration Window</DescriptionListTerm>
                <DescriptionListDescription>60 seconds</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );

  const renderYAMLTab = () => (
    <Card>
      <CardBody>
        <CodeBlock>
          <CodeBlockCode>{yamlContent}</CodeBlockCode>
        </CodeBlock>
      </CardBody>
    </Card>
  );

  const renderAnalyticsTab = () => (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: '#6a6e73', fontSize: '16px', marginBottom: '24px' }}>
          Monitor token-based rate limiting and consumption
        </p>
        
        <Grid hasGutter style={{ marginBottom: '48px' }}>
          <GridItem xl={3} lg={3} md={6} sm={12}>
            <Card>
              <CardBody style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#151515', marginBottom: '8px' }}>
                  12,340
                </div>
                <div style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '8px' }}>
                  Token Requests/min
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Icon>
                    <ArrowUpIcon color="var(--pf-t--global--color--status--success--100)" />
                  </Icon>
                  <span style={{ color: 'var(--pf-t--global--color--status--success--100)', fontSize: '14px' }}>
                    +15%
                  </span>
                </div>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem xl={3} lg={3} md={6} sm={12}>
            <Card>
              <CardBody style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#151515', marginBottom: '8px' }}>
                  890/min
                </div>
                <div style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '8px' }}>
                  Token Consumption Rate
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Icon>
                    <ArrowUpIcon color="var(--pf-t--global--color--status--success--100)" />
                  </Icon>
                  <span style={{ color: 'var(--pf-t--global--color--status--success--100)', fontSize: '14px' }}>
                    +8%
                  </span>
                </div>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem xl={3} lg={3} md={6} sm={12}>
            <Card>
              <CardBody style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#151515', marginBottom: '8px' }}>
                  67
                </div>
                <div style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '8px' }}>
                  Rate Limited Tokens
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Icon>
                    <ArrowUpIcon color="var(--pf-t--global--color--status--warning--200)" />
                  </Icon>
                  <span style={{ color: 'var(--pf-t--global--color--status--warning--200)', fontSize: '14px' }}>
                    +23%
                  </span>
                </div>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem xl={3} lg={3} md={6} sm={12}>
            <Card>
              <CardBody style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#151515', marginBottom: '8px' }}>
                  45ms
                </div>
                <div style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '8px' }}>
                  Avg Token Latency
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Icon>
                    <ArrowDownIcon color="var(--pf-t--global--color--status--success--100)" />
                  </Icon>
                  <span style={{ color: 'var(--pf-t--global--color--status--success--100)', fontSize: '14px' }}>
                    -2ms
                  </span>
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </div>
      
      <Card>
        <CardBody>
          <BarChart 
            title="Token Rate Limit Hits by Time Window" 
            data={[]}
          />
        </CardBody>
      </Card>
    </div>
  );

  return (
    <>
      <PageSection variant="light">
        <Breadcrumb>
          <BreadcrumbItem>
            <Button variant="link" onClick={onBack} isInline>
              Policies
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>
            {policyName}
          </BreadcrumbItem>
        </Breadcrumb>
        
        <Title headingLevel="h1" size="2xl" style={{ marginTop: '16px' }}>
          {policyName}
        </Title>
        
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          style={{ marginTop: '24px' }}
        >
          <Tab eventKey="details" title={<TabTitleText>Details</TabTitleText>} />
          <Tab eventKey="yaml" title={<TabTitleText>YAML</TabTitleText>} />
          <Tab eventKey="analytics" title={<TabTitleText>Analytics</TabTitleText>} />
        </Tabs>
      </PageSection>
      
      <PageSection>
        {activeTabKey === 'details' && renderDetailsTab()}
        {activeTabKey === 'yaml' && renderYAMLTab()}
        {activeTabKey === 'analytics' && renderAnalyticsTab()}
      </PageSection>
    </>
  );
};

export default PolicyDetailsPage; 