import React, { useState, useEffect } from 'react';
import {
  Page,
  PageSection,
  PageSidebar,
  PageSidebarBody,
  Nav,
  NavItem,
  NavList,
  NavExpandable,
  Masthead,
  MastheadToggle,
  MastheadContent,
  PageToggleButton,
  Button,
  Flex,
  FlexItem,
  Title
} from '@patternfly/react-core';
import {
  BarsIcon,
  CogIcon,
  QuestionCircleIcon,
  BellIcon,
  ThIcon,
} from '@patternfly/react-icons';

import KuadrantOverview from './components/KuadrantOverview';
import GatewaysPage from './components/GatewaysPage';
import RoutesPage from './components/RoutesPage';
import PoliciesPage from './components/PoliciesPage';
import TopologyPage from './components/TopologyPage';
import GatewayDetailsPage from './components/GatewayDetailsPage';
import CreateGatewayPage from './components/CreateGatewayPage';
import CreateHTTPRoutePage from './components/CreateHTTPRoutePage';
import MCPServerTemplatePage from './components/MCPServerTemplatePage';
import MCPServerConfigPage from './components/MCPServerConfigPage';
import MCPServerDiscoveryPage from './components/MCPServerDiscoveryPage';
import MCPServerTestConnectionPage from './components/MCPServerTestConnectionPage';
import MCPServerLogsPage from './components/MCPServerLogsPage';
import ObservabilityPage from './components/ObservabilityPage';
import ConnectivityObservabilityPage from './components/ConnectivityObservabilityPage';
import APIKeyApprovalsPage from './components/APIKeyApprovalsPage';
import PortalPage from './components/PortalPage';
import PortalsManagementPage from './components/PortalsManagementPage';
import PortalDetailPage from './components/PortalDetailPage';
import APIDetailsPage from './components/APIDetailsPage';
import APICredentialsPage from './components/APICredentialsPage';
import APIProductsPage from './components/APIProductsPage';

const App = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('internal-portals');
  const [isKuadrantExpanded, setIsKuadrantExpanded] = useState(true);
  const [isInternalPortalExpanded, setIsInternalPortalExpanded] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAppsDropdownOpen, setIsAppsDropdownOpen] = useState(false);
  const [isGatewayDetailsOpen, setIsGatewayDetailsOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [isCreateGatewayOpen, setIsCreateGatewayOpen] = useState(false);
  const [isCreateHTTPRouteOpen, setIsCreateHTTPRouteOpen] = useState(false);
  const [isCreateHTTPRouteFromRoutes, setIsCreateHTTPRouteFromRoutes] = useState(false);
  const [mcpServerPageType, setMcpServerPageType] = useState(null); // 'template', 'config', 'discovery'
  const [mcpServerAction, setMcpServerAction] = useState(null); // 'test-connection', 'view-logs'
  const [selectedMCPServer, setSelectedMCPServer] = useState(null);
  const [selectedApiDetails, setSelectedApiDetails] = useState(null); // API name when viewing API details from Portal
  const [selectedPortal, setSelectedPortal] = useState(null); // portal name when API owner clicks a portal card

  const onNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  const onNavSelect = (event, result) => {
    console.log('Navigation selected:', result);
    if (result && result.itemId) {
      console.log('Setting active item to:', result.itemId);
      setActiveItem(result.itemId);
    }
  };

  // Auto-expand Connectivity Link when any of its child items are active
  useEffect(() => {
    if (['overview', 'policies', 'topology', 'connectivity-observability', 'api-products', 'api-key-approvals'].includes(activeItem)) {
      setIsKuadrantExpanded(true);
    }
  }, [activeItem]);

  // Auto-expand Dev portal when any of its child items are active
  useEffect(() => {
    if (['internal-portals', 'api-access', 'observability'].includes(activeItem)) {
      setIsInternalPortalExpanded(true);
    }
  }, [activeItem]);

  const handleGatewayNameClick = (gatewayName) => {
    setSelectedGateway(gatewayName);
    setIsGatewayDetailsOpen(true);
  };

  const handleBackToGateways = () => {
    setIsGatewayDetailsOpen(false);
    setSelectedGateway(null);
    setIsCreateGatewayOpen(false);
    setIsCreateHTTPRouteOpen(false);
  };

  const handleCreateGateway = () => {
    setIsCreateGatewayOpen(true);
    setIsGatewayDetailsOpen(false);
    setSelectedGateway(null);
    setIsCreateHTTPRouteOpen(false);
  };

  const handleCreateHTTPRoute = () => {
    setIsCreateHTTPRouteOpen(true);
    setIsGatewayDetailsOpen(false);
    setIsCreateGatewayOpen(false);
  };

  const handleCreateHTTPRouteFromRoutes = () => {
    setIsCreateHTTPRouteFromRoutes(true);
  };

  const handleBackToGatewayDetails = () => {
    setIsCreateHTTPRouteOpen(false);
    setIsCreateGatewayOpen(false);
  };

  const handleMCPServerPage = (pageType) => {
    console.log('handleMCPServerPage called with:', pageType);
    setMcpServerPageType(pageType);
    setIsGatewayDetailsOpen(false);
    setSelectedGateway(null);
    // Set activeItem to gateways to maintain navigation state
    setActiveItem('gateways');
    console.log('State updated - mcpServerPageType:', pageType, 'isGatewayDetailsOpen: false');
  };

  const handleBackToGatewayDetailsFromMCPServer = () => {
    setMcpServerPageType(null);
    setMcpServerAction(null);
    setSelectedMCPServer(null);
    setIsGatewayDetailsOpen(true);
  };

  const handleMCPServerAction = (action, serverName) => {
    console.log('handleMCPServerAction called with:', action, serverName);
    setMcpServerAction(action);
    setSelectedMCPServer(serverName);
    setMcpServerPageType(null);
    setIsGatewayDetailsOpen(false);
    setSelectedGateway(null);
    setActiveItem('gateways');
  };

  const masthead = (
    <Masthead>
      <MastheadToggle>
        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
          <PageToggleButton
            variant="plain"
            aria-label="Global navigation"
            isNavOpen={isNavOpen}
            onNavToggle={onNavToggle}
          >
            <BarsIcon />
          </PageToggleButton>
          <FlexItem>
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--pf-v5-global--Color--100)'
              }}
            >
              proposal-B
            </span>
          </FlexItem>
        </Flex>
      </MastheadToggle>
      
      <MastheadContent>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginLeft: 'auto'
        }}>
          <Button variant="plain" aria-label="Applications" style={{ color: 'black' }}>
            <ThIcon />
          </Button>
          <Button variant="plain" aria-label="Notifications" style={{ color: 'black' }}>
            <BellIcon />
          </Button>
          <Button variant="plain" aria-label="Settings" style={{ color: 'black' }}>
            <CogIcon />
          </Button>
          <Button variant="plain" aria-label="Help" style={{ color: 'black' }}>
            <QuestionCircleIcon />
          </Button>
        </div>
      </MastheadContent>
    </Masthead>
  );

  const navigation = (
    <Nav onSelect={onNavSelect} aria-label="Navigation">
      <NavList>
        <NavExpandable
          title="Connectivity Link"
            isExpanded={isKuadrantExpanded}
            onExpand={() => setIsKuadrantExpanded(!isKuadrantExpanded)}
            isActive={['overview', 'policies', 'topology', 'connectivity-observability', 'api-products', 'api-key-approvals'].includes(activeItem)}
          >
            <NavItem 
              itemId="overview" 
              isActive={activeItem === 'overview'}
              onClick={() => setActiveItem('overview')}
            >
              Overview
            </NavItem>
            <NavItem 
              itemId="policies" 
              isActive={activeItem === 'policies'}
              onClick={() => setActiveItem('policies')}
            >
              Policies
            </NavItem>
            <NavItem 
              itemId="topology" 
              isActive={activeItem === 'topology'}
              onClick={() => setActiveItem('topology')}
            >
              Topology
            </NavItem>
            <NavItem 
              itemId="connectivity-observability" 
              isActive={activeItem === 'connectivity-observability'}
              onClick={() => setActiveItem('connectivity-observability')}
            >
              Observability
            </NavItem>
            <NavItem
              itemId="api-products"
              isActive={activeItem === 'api-products'}
              onClick={() => setActiveItem('api-products')}
            >
              API products
            </NavItem>
            <NavItem
              itemId="api-key-approvals"
              isActive={activeItem === 'api-key-approvals'}
              onClick={() => setActiveItem('api-key-approvals')}
            >
              API key approvals
            </NavItem>
          </NavExpandable>
          <NavExpandable
            title="Dev portal"
            isExpanded={isInternalPortalExpanded}
            onExpand={() => setIsInternalPortalExpanded(!isInternalPortalExpanded)}
            isActive={['internal-portals', 'api-access', 'observability'].includes(activeItem)}
          >
            <NavItem
              itemId="internal-portals"
              isActive={activeItem === 'internal-portals'}
              onClick={() => {
                setActiveItem('internal-portals');
                setSelectedPortal(null);
                setSelectedApiDetails(null);
              }}
            >
              Portals
            </NavItem>
            <NavItem
              itemId="api-access"
              isActive={activeItem === 'api-access'}
              onClick={() => setActiveItem('api-access')}
            >
              My API keys
            </NavItem>
            <NavItem
              itemId="observability"
              isActive={activeItem === 'observability'}
              onClick={() => setActiveItem('observability')}
            >
              Observability
            </NavItem>
          </NavExpandable>
      </NavList>
    </Nav>
  );

  const sidebar = (
    <PageSidebar isNavOpen={isNavOpen}>
      <PageSidebarBody>
        {navigation}
      </PageSidebarBody>
    </PageSidebar>
  );

  const renderContent = () => {
    console.log('renderContent called - mcpServerPageType:', mcpServerPageType, 'mcpServerAction:', mcpServerAction, 'isGatewayDetailsOpen:', isGatewayDetailsOpen, 'activeItem:', activeItem);
    
    // Check MCP Server actions first
    if (mcpServerAction === 'test-connection') {
      console.log('Rendering MCPServerTestConnectionPage');
      return <MCPServerTestConnectionPage serverName={selectedMCPServer} onBack={handleBackToGatewayDetailsFromMCPServer} onCancel={handleBackToGatewayDetailsFromMCPServer} />;
    }
    
    if (mcpServerAction === 'view-logs') {
      console.log('Rendering MCPServerLogsPage');
      return <MCPServerLogsPage serverName={selectedMCPServer} onBack={handleBackToGatewayDetailsFromMCPServer} onCancel={handleBackToGatewayDetailsFromMCPServer} />;
    }
    
    // Check MCP Server pages
    if (mcpServerPageType === 'template') {
      console.log('Rendering MCPServerTemplatePage');
      return <MCPServerTemplatePage onBack={handleBackToGatewayDetailsFromMCPServer} onCancel={handleBackToGatewayDetailsFromMCPServer} />;
    }
    
    if (mcpServerPageType === 'config') {
      console.log('Rendering MCPServerConfigPage');
      return <MCPServerConfigPage onBack={handleBackToGatewayDetailsFromMCPServer} onCancel={handleBackToGatewayDetailsFromMCPServer} />;
    }
    
    if (mcpServerPageType === 'discovery') {
      console.log('Rendering MCPServerDiscoveryPage');
      return <MCPServerDiscoveryPage onBack={handleBackToGatewayDetailsFromMCPServer} onCancel={handleBackToGatewayDetailsFromMCPServer} />;
    }
    
    if (isCreateHTTPRouteOpen) {
      return <CreateHTTPRoutePage gatewayName={selectedGateway} onBack={handleBackToGatewayDetails} onCancel={handleBackToGatewayDetails} />;
    }
    
    if (isCreateHTTPRouteFromRoutes) {
      return <CreateHTTPRoutePage onBack={() => setIsCreateHTTPRouteFromRoutes(false)} onCancel={() => setIsCreateHTTPRouteFromRoutes(false)} />;
    }
    
    if (isCreateGatewayOpen) {
      return <CreateGatewayPage onBack={handleBackToGateways} onCancel={handleBackToGateways} />;
    }
    
    if (isGatewayDetailsOpen) {
      return <GatewayDetailsPage gatewayName={selectedGateway} onBack={handleBackToGateways} onCreateHTTPRoute={handleCreateHTTPRoute} onMCPServerPage={handleMCPServerPage} onMCPServerAction={handleMCPServerAction} />;
    }
    
    switch (activeItem) {
      case 'gateways':
        return <GatewaysPage onGatewayNameClick={handleGatewayNameClick} onCreateGateway={handleCreateGateway} />;
      case 'routes':
        return <RoutesPage onCreateHTTPRoute={handleCreateHTTPRouteFromRoutes} />;
      case 'policies':
        return <PoliciesPage />;
      case 'topology':
        return <TopologyPage />;
      case 'connectivity-observability':
        return <ConnectivityObservabilityPage />;
      case 'internal-portals':
        if (selectedApiDetails) {
          return (
            <APIDetailsPage
              apiName={selectedApiDetails}
              onBack={() => setSelectedApiDetails(null)}
              breadcrumbParent="Portals"
            />
          );
        }
        if (selectedPortal === 'Internal portal') {
          return <PortalPage onApiNameClick={setSelectedApiDetails} onBack={() => setSelectedPortal(null)} />;
        }
        if (selectedPortal) {
          return <PortalDetailPage portalName={selectedPortal} onBack={() => setSelectedPortal(null)} />;
        }
        return <PortalsManagementPage onPortalClick={setSelectedPortal} />;
      case 'api-products':
        return <APIProductsPage />;
      case 'api-access':
        return <APICredentialsPage />;
      case 'observability':
        return <ObservabilityPage />;
      case 'api-key-approvals':
        return <APIKeyApprovalsPage />;
      case 'overview':
      default:
        return (
          <KuadrantOverview
            onGatewayNameClick={handleGatewayNameClick}
            onCreateGateway={handleCreateGateway}
            onCreateHTTPRoute={handleCreateHTTPRoute}
          />
        );
    }
  };

  return (
    <Page masthead={masthead} sidebar={sidebar}>
      {renderContent()}
    </Page>
  );
};

export default App; 