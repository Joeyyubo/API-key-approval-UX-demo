import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Page,
  PageSection,
  PageSidebar,
  PageSidebarBody,
  Nav,
  NavItem,
  NavList,
  Masthead,
  MastheadToggle,
  MastheadContent,
  PageToggleButton,
  Button,
  Flex
} from '@patternfly/react-core';
import {
  BarsIcon,
  CogIcon,
  BellIcon,
  ThIcon,
} from '@patternfly/react-icons';
import { FaQuestionCircleRegular } from './components/FaQuestionCircleRegular';

import GatewaysPage from './components/GatewaysPage';
import RoutesPage from './components/RoutesPage';
import GatewayDetailsPage from './components/GatewayDetailsPage';
import CreateGatewayPage from './components/CreateGatewayPage';
import CreateHTTPRoutePage from './components/CreateHTTPRoutePage';
import MCPServerTemplatePage from './components/MCPServerTemplatePage';
import MCPServerConfigPage from './components/MCPServerConfigPage';
import MCPServerDiscoveryPage from './components/MCPServerDiscoveryPage';
import MCPServerTestConnectionPage from './components/MCPServerTestConnectionPage';
import MCPServerLogsPage from './components/MCPServerLogsPage';
import APIKeyApprovalsPage from './components/APIKeyApprovalsPage';
import APIDetailsPage from './components/APIDetailsPage';
import RevealApiKeyModal from './components/RevealApiKeyModal';
import EditApiKeyModal from './components/EditApiKeyModal';
import DeleteApiKeyModal from './components/DeleteApiKeyModal';
import RequestApiKeyModal from './components/RequestApiKeyModal';
import RequestApiKeySuccessToast from './components/RequestApiKeySuccessToast';
import APIKeyUpdatedToast from './components/APIKeyUpdatedToast';
import APIKeyDeletedToast from './components/APIKeyDeletedToast';
import {
  buildCredentialsData,
  DEMO_CURRENT_USER_OWNER,
  REQUESTED_TIME_DISPLAY
} from './data/apiCredentialsModel';

const App = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('api-key-approvals');
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
  const [selectedApiDetails, setSelectedApiDetails] = useState(null); // API name when viewing API details (e.g. from approvals)
  const [revealedKeyIds, setRevealedKeyIds] = useState(() => new Set());
  const [revealModalRowId, setRevealModalRowId] = useState(null);
  const [credentialsList, setCredentialsList] = useState(() => buildCredentialsData());
  const credentialNamesForRequestModal = useMemo(
    () => credentialsList.map((c) => c.name),
    [credentialsList]
  );
  const [editCredentialId, setEditCredentialId] = useState(null);
  const [deleteCredentialId, setDeleteCredentialId] = useState(null);
  const [requestApiKeyOpen, setRequestApiKeyOpen] = useState(false);
  const [requestKeySuccessToast, setRequestKeySuccessToast] = useState(null);
  const [editKeySuccessToast, setEditKeySuccessToast] = useState(null);
  const [deleteKeySuccessToast, setDeleteKeySuccessToast] = useState(null);

  const editingCredential = editCredentialId ? credentialsList.find((c) => c.id === editCredentialId) : null;
  const deletingCredential = deleteCredentialId ? credentialsList.find((c) => c.id === deleteCredentialId) : null;

  const handleEditApiKeySave = (id, { name, tier, useCase }) => {
    let apiName = '';
    let updatesSummary = '';
    setCredentialsList((prev) => {
      const prevRow = prev.find((r) => r.id === id);
      if (prevRow) {
        apiName = prevRow.api;
        const lines = [];
        if (prevRow.name !== name) lines.push(`API key name updated to "${name}".`);
        if (prevRow.tier !== tier) lines.push(`Tier updated to ${tier}.`);
        const prevUc = (prevRow.useCase || '').trim();
        const nextUc = (useCase || '').trim();
        if (prevUc !== nextUc) {
          lines.push(nextUc || 'Use case cleared.');
        }
        updatesSummary =
          lines.length > 0 ? lines.join(' ') : 'Changes saved. The API key is pending approval.';
      }
      return prev.map((r) => (r.id === id ? { ...r, name, tier, useCase, status: 'Pending' } : r));
    });
    setRequestKeySuccessToast(null);
    setDeleteKeySuccessToast(null);
    setEditKeySuccessToast({
      api: apiName,
      keyName: name,
      updates: updatesSummary,
      credentialId: id
    });
  };

  const openRequestApiKeyModal = useCallback(() => {
    setRequestKeySuccessToast(null);
    setEditKeySuccessToast(null);
    setDeleteKeySuccessToast(null);
    setRequestApiKeyOpen(true);
  }, []);

  const handleRequestApiKeySubmit = ({ api: apiName, tier, name, useCase }) => {
    const id = `cred-${Date.now()}`;
    let createdName = '';
    setCredentialsList((prev) => {
      createdName = (name && name.trim()) || `API key ${prev.length + 1}`;
      return [
        {
          id,
          name: createdName,
          owner: DEMO_CURRENT_USER_OWNER,
          api: apiName,
          status: 'Pending',
          tier,
          apiKeyState: 'empty',
          requestedTime: REQUESTED_TIME_DISPLAY,
          useCase: useCase || ''
        },
        ...prev
      ];
    });
    setEditKeySuccessToast(null);
    setDeleteKeySuccessToast(null);
    setRequestKeySuccessToast({
      api: apiName,
      keyName: createdName,
      credentialId: id
    });
  };

  const dismissRequestKeyToast = useCallback(() => setRequestKeySuccessToast(null), []);

  const handleRequestSuccessViewDetails = useCallback(() => {
    if (!requestKeySuccessToast?.credentialId) return;
    const id = requestKeySuccessToast.credentialId;
    const row = credentialsList.find((c) => c.id === id);
    setRequestKeySuccessToast(null);
    if (row?.api) {
      setSelectedApiDetails(row.api);
      setActiveItem('internal-portals');
    }
  }, [requestKeySuccessToast, credentialsList]);

  const dismissEditKeyToast = useCallback(() => setEditKeySuccessToast(null), []);

  const handleEditSuccessViewDetails = useCallback(() => {
    if (!editKeySuccessToast?.credentialId) return;
    const id = editKeySuccessToast.credentialId;
    const row = credentialsList.find((c) => c.id === id);
    setEditKeySuccessToast(null);
    if (row?.api) {
      setSelectedApiDetails(row.api);
      setActiveItem('internal-portals');
    }
  }, [editKeySuccessToast, credentialsList]);

  const dismissDeleteKeyToast = useCallback(() => setDeleteKeySuccessToast(null), []);

  const handleDeleteApiKeyConfirm = (id) => {
    const row = credentialsList.find((c) => c.id === id);
    const apiName = row?.api ?? '';
    const keyName = row?.name ?? '';

    setCredentialsList((prev) => prev.filter((r) => r.id !== id));
    setRevealedKeyIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setRevealModalRowId((current) => (current === id ? null : current));
    setEditCredentialId((current) => (current === id ? null : current));
    setDeleteCredentialId(null);

    setRequestKeySuccessToast(null);
    setEditKeySuccessToast(null);
    setDeleteKeySuccessToast({ api: apiName, keyName });
  };

  /** Open API product details for the same API name (e.g. from approvals). */
  const navigateToApiCatalogDetail = (apiName) => {
    setRevealModalRowId(null);
    setEditCredentialId(null);
    setDeleteCredentialId(null);
    setSelectedApiDetails(apiName);
    setActiveItem('internal-portals');
  };

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

  useEffect(() => {
    if (!requestKeySuccessToast) return;
    const eligible = activeItem === 'internal-portals' && selectedApiDetails;
    if (!eligible) {
      setRequestKeySuccessToast(null);
    }
  }, [activeItem, selectedApiDetails, requestKeySuccessToast]);

  useEffect(() => {
    if (!editKeySuccessToast) return;
    const eligible = activeItem === 'internal-portals' && selectedApiDetails;
    if (!eligible) {
      setEditKeySuccessToast(null);
    }
  }, [activeItem, selectedApiDetails, editKeySuccessToast]);

  useEffect(() => {
    if (!deleteKeySuccessToast) return;
    const eligible = activeItem === 'internal-portals' && selectedApiDetails;
    if (!eligible) {
      setDeleteKeySuccessToast(null);
    }
  }, [activeItem, selectedApiDetails, deleteKeySuccessToast]);

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
        </Flex>
      </MastheadToggle>
      
      <MastheadContent>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--pf-t--global--spacer--sm)',
            marginLeft: 'auto'
          }}
        >
          <Button
            variant="plain"
            aria-label="Applications"
            style={{ color: 'var(--pf-t--global--icon--color--regular)' }}
          >
            <ThIcon />
          </Button>
          <Button
            variant="plain"
            aria-label="Notifications"
            style={{ color: 'var(--pf-t--global--icon--color--regular)' }}
          >
            <BellIcon />
          </Button>
          <Button
            variant="plain"
            aria-label="Settings"
            style={{ color: 'var(--pf-t--global--icon--color--regular)' }}
          >
            <CogIcon />
          </Button>
          <Button
            variant="plain"
            aria-label="Help"
            style={{ color: 'var(--pf-t--global--icon--color--regular)' }}
          >
            <FaQuestionCircleRegular style={{ color: 'inherit' }} />
          </Button>
        </div>
      </MastheadContent>
    </Masthead>
  );

  const navigation = (
    <Nav onSelect={onNavSelect} aria-label="Navigation">
      <NavList>
        <NavItem
          itemId="api-key-approvals"
          isActive={activeItem === 'api-key-approvals' || activeItem === 'internal-portals'}
          onClick={() => {
            setActiveItem('api-key-approvals');
            setSelectedApiDetails(null);
          }}
        >
          API key approval
        </NavItem>
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
      case 'internal-portals':
        if (selectedApiDetails) {
          return (
            <APIDetailsPage
              apiName={selectedApiDetails}
              onBack={() => {
                setSelectedApiDetails(null);
                setActiveItem('api-key-approvals');
              }}
              breadcrumbParent="API key approval"
              onRequestApiKey={openRequestApiKeyModal}
              apiKeysRows={credentialsList.filter((c) => c.api === selectedApiDetails)}
              onOpenDelete={(row) => setDeleteCredentialId(row.id)}
            />
          );
        }
        return <APIKeyApprovalsPage onNavigateToApiCatalog={navigateToApiCatalogDetail} />;
      case 'api-key-approvals':
        return <APIKeyApprovalsPage onNavigateToApiCatalog={navigateToApiCatalogDetail} />;
      default:
        return <APIKeyApprovalsPage onNavigateToApiCatalog={navigateToApiCatalogDetail} />;
    }
  };

  const showRequestKeySuccessToast = Boolean(
    requestKeySuccessToast && activeItem === 'internal-portals' && selectedApiDetails
  );

  const showEditKeySuccessToast = Boolean(
    editKeySuccessToast && activeItem === 'internal-portals' && selectedApiDetails
  );

  const showDeleteKeySuccessToast = Boolean(
    deleteKeySuccessToast && activeItem === 'internal-portals' && selectedApiDetails
  );

  return (
    <Page masthead={masthead} sidebar={sidebar}>
      {renderContent()}
      {showRequestKeySuccessToast && requestKeySuccessToast && (
        <RequestApiKeySuccessToast
          api={requestKeySuccessToast.api}
          keyName={requestKeySuccessToast.keyName}
          onClose={dismissRequestKeyToast}
          onViewDetails={handleRequestSuccessViewDetails}
        />
      )}
      {showEditKeySuccessToast && editKeySuccessToast && (
        <APIKeyUpdatedToast
          api={editKeySuccessToast.api}
          keyName={editKeySuccessToast.keyName}
          updates={editKeySuccessToast.updates}
          onClose={dismissEditKeyToast}
          onViewDetails={handleEditSuccessViewDetails}
        />
      )}
      {showDeleteKeySuccessToast && deleteKeySuccessToast && (
        <APIKeyDeletedToast
          api={deleteKeySuccessToast.api}
          keyName={deleteKeySuccessToast.keyName}
          onClose={dismissDeleteKeyToast}
        />
      )}
      <RevealApiKeyModal
        rowId={revealModalRowId}
        onClose={() => setRevealModalRowId(null)}
        onRevealed={(id) => setRevealedKeyIds((prev) => new Set(prev).add(id))}
      />
      <EditApiKeyModal
        credential={editingCredential}
        isOpen={Boolean(editCredentialId && editingCredential)}
        onClose={() => setEditCredentialId(null)}
        onSave={handleEditApiKeySave}
      />
      <DeleteApiKeyModal
        credential={deletingCredential}
        isOpen={Boolean(deleteCredentialId && deletingCredential)}
        onClose={() => setDeleteCredentialId(null)}
        onConfirm={handleDeleteApiKeyConfirm}
      />
      <RequestApiKeyModal
        isOpen={requestApiKeyOpen}
        onClose={() => setRequestApiKeyOpen(false)}
        onSubmit={handleRequestApiKeySubmit}
        existingKeyNames={credentialNamesForRequestModal}
      />
    </Page>
  );
};

export default App; 