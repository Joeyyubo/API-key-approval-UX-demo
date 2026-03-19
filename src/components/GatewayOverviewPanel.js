import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Flex,
  FlexItem,
  Icon,
  Title,
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DollarSignIcon,
  CogIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  AngleRightIcon,
  EllipsisVIcon
} from '@patternfly/react-icons';

const GatewayOverviewPanel = () => {
  const [isPerformanceExpanded, setIsPerformanceExpanded] = useState(true);
  const [isResourcesExpanded, setIsResourcesExpanded] = useState(true);
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">
              Gateway System Overview
            </Title>
          </FlexItem>
          <FlexItem>
            <Dropdown
              onSelect={() => setIsActionsDropdownOpen(false)}
              toggle={
                <MenuToggle
                  onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
                  isExpanded={isActionsDropdownOpen}
                >
                  Actions <EllipsisVIcon />
                </MenuToggle>
              }
              isOpen={isActionsDropdownOpen}
            >
              <DropdownList>
                <DropdownItem key="refresh">Refresh Metrics</DropdownItem>
                <DropdownItem key="export">Export Report</DropdownItem>
                <DropdownItem key="settings">Settings</DropdownItem>
              </DropdownList>
            </Dropdown>
          </FlexItem>
        </Flex>
      </div>

      {/* Top Level Metrics */}
      <Grid hasGutter style={{ marginBottom: '32px' }}>
        <GridItem xl={3} lg={3} md={6} sm={12}>
          <Card>
            <CardBody>
              <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                <FlexItem>
                  <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--pf-t--global--text--color--regular)' }}>
                    8
                  </h1>
                </FlexItem>
                <FlexItem>
                  <h3 style={{ fontWeight: 'bold', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Total Gateways
                  </h3>
                </FlexItem>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem xl={3} lg={3} md={6} sm={12}>
          <Card>
            <CardBody>
              <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                <FlexItem>
                  <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <FlexItem>
                      <Icon>
                        <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
                      </Icon>
                    </FlexItem>
                    <FlexItem>
                      <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--pf-t--global--text--color--regular)' }}>
                        6
                      </h1>
                    </FlexItem>
                  </Flex>
                </FlexItem>
                <FlexItem>
                  <h3 style={{ fontWeight: 'bold', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Healthy Gateways
                  </h3>
                </FlexItem>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem xl={3} lg={3} md={6} sm={12}>
          <Card>
            <CardBody>
              <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                <FlexItem>
                  <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <FlexItem>
                      <Icon>
                        <ExclamationTriangleIcon color="var(--pf-t--global--color--status--warning--200)" />
                      </Icon>
                    </FlexItem>
                    <FlexItem>
                      <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--pf-t--global--text--color--regular)' }}>
                        2
                      </h1>
                    </FlexItem>
                  </Flex>
                </FlexItem>
                <FlexItem>
                  <h3 style={{ fontWeight: 'bold', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Unhealthy Gateways
                  </h3>
                </FlexItem>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem xl={3} lg={3} md={6} sm={12}>
          <Card>
            <CardBody>
              <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                <FlexItem>
                  <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <FlexItem>
                      <Icon>
                        <ClockIcon color="var(--pf-t--global--color--status--info--100)" />
                      </Icon>
                    </FlexItem>
                    <FlexItem>
                      <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--pf-t--global--text--color--regular)' }}>
                        850ms
                      </h1>
                    </FlexItem>
                  </Flex>
                </FlexItem>
                <FlexItem>
                  <h3 style={{ fontWeight: 'bold', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Avg Latency
                  </h3>
                </FlexItem>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* System Performance Summary */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
        <div style={{ 
          flex: 1, 
          backgroundColor: 'white', 
          border: '1px solid #d7d7d7', 
          borderRadius: '8px', 
          padding: '24px' 
        }}>
          <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>Total Requests</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0066cc' }}></div>
              <span style={{ color: '#0066cc', fontSize: '16px', fontWeight: '500' }}>3.2K/min</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon><CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" /></Icon>
              <span style={{ color: '#6a6e73', fontSize: '16px' }}>95.2% successful</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon><ExclamationTriangleIcon color="var(--pf-t--global--color--status--warning--200)" /></Icon>
              <span style={{ color: '#6a6e73', fontSize: '16px' }}>4.8% error</span>
            </div>
          </div>
        </div>
        
        <div style={{ 
          flex: 1, 
          backgroundColor: 'white', 
          border: '1px solid #d7d7d7', 
          borderRadius: '8px', 
          padding: '24px' 
        }}>
          <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>Token Usage</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0066cc' }}></div>
              <span style={{ color: '#0066cc', fontSize: '16px', fontWeight: '500' }}>3.0M Total</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6a6e73' }}></div>
              <span style={{ color: '#6a6e73', fontSize: '16px' }}>1.9M completion</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#17a2b8' }}></div>
              <span style={{ color: '#17a2b8', fontSize: '16px' }}>1.1M prompt</span>
            </div>
          </div>
        </div>
        
        <div style={{ 
          flex: 1, 
          backgroundColor: 'white', 
          border: '1px solid #d7d7d7', 
          borderRadius: '8px', 
          padding: '24px' 
        }}>
          <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>System Cost</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0066cc' }}></div>
              <span style={{ color: '#0066cc', fontSize: '16px', fontWeight: '500' }}>$2,450 Total</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#6a6e73', fontSize: '16px' }}>$0.77 Per 1K req</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon><ArrowUpIcon color="var(--pf-t--global--color--status--success--100)" /></Icon>
              <span style={{ color: '#28a745', fontSize: '16px' }}>+18%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Button 
          variant="plain" 
          onClick={() => setIsPerformanceExpanded(!isPerformanceExpanded)}
          style={{ padding: 0, minWidth: 'auto' }}
        >
          <Icon style={{ 
            transform: isPerformanceExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}>
            <AngleRightIcon />
          </Icon>
        </Button>
        <Title headingLevel="h2" size="xl" style={{ margin: 0 }}>
          Performance Metrics
        </Title>
      </div>

      {isPerformanceExpanded && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Request Volume by Provider */}
          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid #d7d7d7', 
            borderRadius: '8px', 
            padding: '24px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>Request Volume by Provider</span>
              <Button variant="plain" aria-label="Settings">
                <Icon><CogIcon /></Icon>
              </Button>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>18.7K Total</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#0066cc' }}></div>
                  <span style={{ fontSize: '14px' }}>OpenAI</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '120px', height: '8px', backgroundColor: '#0066cc', borderRadius: '4px' }}></div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>6.8K</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#ff6b35' }}></div>
                  <span style={{ fontSize: '14px' }}>Azure</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '100px', height: '8px', backgroundColor: '#ff6b35', borderRadius: '4px' }}></div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>5.2K</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#17a2b8' }}></div>
                  <span style={{ fontSize: '14px' }}>Gemini</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '85px', height: '8px', backgroundColor: '#17a2b8', borderRadius: '4px' }}></div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>3.5K</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#ffc107' }}></div>
                  <span style={{ fontSize: '14px' }}>Watson</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '70px', height: '8px', backgroundColor: '#ffc107', borderRadius: '4px' }}></div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>2.1K</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#28a745' }}></div>
                  <span style={{ fontSize: '14px' }}>DeepSeek</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '60px', height: '8px', backgroundColor: '#28a745', borderRadius: '4px' }}></div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>1.1K</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Latency Overview */}
          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid #d7d7d7', 
            borderRadius: '8px', 
            padding: '24px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>System Latency Overview</span>
              <Button variant="plain" aria-label="Settings">
                <Icon><CogIcon /></Icon>
              </Button>
            </div>
            <div style={{ fontSize: '12px', color: '#6a6e73', marginBottom: '24px' }}>From last 12 hours</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Average Latency</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon><ArrowUpIcon color="var(--pf-t--global--color--status--warning--200)" /></Icon>
                    <span style={{ fontSize: '20px', fontWeight: '600' }}>5%</span>
                  </div>
                  <span style={{ fontSize: '14px', color: '#6a6e73' }}>810ms → 850ms</span>
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>P95 Latency</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon><ArrowUpIcon color="var(--pf-t--global--color--status--warning--200)" /></Icon>
                    <span style={{ fontSize: '20px', fontWeight: '600' }}>8%</span>
                  </div>
                  <span style={{ fontSize: '14px', color: '#6a6e73' }}>1.8s → 1.94s</span>
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>P99 Latency</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon><ArrowDownIcon color="var(--pf-t--global--color--status--success--100)" /></Icon>
                    <span style={{ fontSize: '20px', fontWeight: '600' }}>2%</span>
                  </div>
                  <span style={{ fontSize: '14px', color: '#6a6e73' }}>4.2s → 4.1s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Code Distribution */}
          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid #d7d7d7', 
            borderRadius: '8px', 
            padding: '24px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>Status Code Distribution</span>
              <Button variant="plain" aria-label="Settings">
                <Icon><CogIcon /></Icon>
              </Button>
            </div>
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <path d="M 80 10 A 70 70 0 1 1 30 130 L 80 80 Z" fill="#28a745" stroke="white" strokeWidth="2"/>
                <path d="M 30 130 A 70 70 0 0 1 126 45 L 80 80 Z" fill="#ffc107" stroke="white" strokeWidth="2"/>
                <path d="M 126 45 A 70 70 0 0 1 134 95 L 80 80 Z" fill="#dc3545" stroke="white" strokeWidth="2"/>
                <text x="80" y="85" textAnchor="middle" fontSize="16" fontWeight="500" fill="white">95.2%</text>
                <text x="45" y="120" textAnchor="middle" fontSize="12" fill="white">3.5%</text>
                <text x="130" y="70" textAnchor="middle" fontSize="12" fill="white">1.3%</text>
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#28a745' }}></div>
                <span>2XX</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#ffc107' }}></div>
                <span>4XX</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#dc3545' }}></div>
                <span>5XX</span>
              </div>
            </div>
          </div>

          {/* Cost Distribution */}
          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid #d7d7d7', 
            borderRadius: '8px', 
            padding: '24px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>Cost Distribution</span>
              <Button variant="plain" aria-label="Settings">
                <Icon><CogIcon /></Icon>
              </Button>
            </div>
            <div style={{ fontSize: '12px', color: '#6a6e73', marginBottom: '16px' }}>By Provider</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>OpenAI</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>$892</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Azure</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>$654</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Gemini</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>$423</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Watson</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>$321</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>DeepSeek</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>$160</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resource Utilization Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Button 
          variant="plain" 
          onClick={() => setIsResourcesExpanded(!isResourcesExpanded)}
          style={{ padding: 0, minWidth: 'auto' }}
        >
          <Icon style={{ 
            transform: isResourcesExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}>
            <AngleRightIcon />
          </Icon>
        </Button>
        <Title headingLevel="h2" size="xl" style={{ margin: 0 }}>
          Resource Utilization
        </Title>
      </div>

      {isResourcesExpanded && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Gateway Resource Usage */}
          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid #d7d7d7', 
            borderRadius: '8px', 
            padding: '24px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>Gateway Resource Usage</span>
              <Button variant="plain" aria-label="Settings">
                <Icon><CogIcon /></Icon>
              </Button>
            </div>
            <div style={{ fontSize: '12px', color: '#6a6e73', marginBottom: '16px' }}>Top 5 gateways by resource usage</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>gateway-01</span>
                  <Icon><CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" /></Icon>
                </div>
                <span style={{ fontSize: '14px', color: '#6a6e73' }}>CPU: 78% | Memory: 65%</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>gateway-02</span>
                  <Icon><CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" /></Icon>
                </div>
                <span style={{ fontSize: '14px', color: '#6a6e73' }}>CPU: 72% | Memory: 58%</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>gateway-03</span>
                  <Icon><ExclamationTriangleIcon color="var(--pf-t--global--color--status--warning--200)" /></Icon>
                </div>
                <span style={{ fontSize: '14px', color: '#6a6e73' }}>CPU: 89% | Memory: 82%</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>gateway-04</span>
                  <Icon><CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" /></Icon>
                </div>
                <span style={{ fontSize: '14px', color: '#6a6e73' }}>CPU: 45% | Memory: 39%</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>gateway-05</span>
                  <Icon><ExclamationTriangleIcon color="var(--pf-t--global--color--status--warning--200)" /></Icon>
                </div>
                <span style={{ fontSize: '14px', color: '#6a6e73' }}>CPU: 91% | Memory: 76%</span>
              </div>
            </div>
          </div>

          {/* System Health Summary */}
          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid #d7d7d7', 
            borderRadius: '8px', 
            padding: '24px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>System Health Summary</span>
              <Button variant="plain" aria-label="Settings">
                <Icon><CogIcon /></Icon>
              </Button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Overall System Health</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon><CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" /></Icon>
                    <span style={{ fontSize: '20px', fontWeight: '600' }}>Good</span>
                  </div>
                  <span style={{ fontSize: '14px', color: '#6a6e73' }}>75% of gateways healthy</span>
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Active Alerts</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon><ExclamationTriangleIcon color="var(--pf-t--global--color--status--warning--200)" /></Icon>
                    <span style={{ fontSize: '20px', fontWeight: '600' }}>3</span>
                  </div>
                  <span style={{ fontSize: '14px', color: '#6a6e73' }}>2 high CPU, 1 memory warning</span>
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Uptime</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon><CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" /></Icon>
                    <span style={{ fontSize: '20px', fontWeight: '600' }}>99.97%</span>
                  </div>
                  <span style={{ fontSize: '14px', color: '#6a6e73' }}>Last 30 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GatewayOverviewPanel; 