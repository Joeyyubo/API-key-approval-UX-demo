import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Button,
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
  MenuToggle,
  Tabs,
  Tab,
  TabTitleText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@patternfly/react-core';
import {
  PlusIcon,
  TrashIcon,
  AngleLeftIcon,
  CogIcon
} from '@patternfly/react-icons';

const CreateHTTPRoutePage = ({ onBack, onCancel }) => {
  // Metadata Section
  const [name, setName] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [description, setDescription] = useState('');
  
  // Select dropdown states
  const [isNamespaceSelectOpen, setIsNamespaceSelectOpen] = useState(false);
  const [isParentRefSelectOpen, setIsParentRefSelectOpen] = useState({});
  const [isPathTypeSelectOpen, setIsPathTypeSelectOpen] = useState({});
  const [isMethodSelectOpen, setIsMethodSelectOpen] = useState({});
  const [isServiceSelectOpen, setIsServiceSelectOpen] = useState({});
  const [isWizardPathTypeSelectOpen, setIsWizardPathTypeSelectOpen] = useState({});
  const [isWizardMethodSelectOpen, setIsWizardMethodSelectOpen] = useState({});
  const [isWizardServiceSelectOpen, setIsWizardServiceSelectOpen] = useState({});
  const [isWizardFilterTypeSelectOpen, setIsWizardFilterTypeSelectOpen] = useState({});
  
  // Rules modal states
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [editingRuleIndex, setEditingRuleIndex] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [tempRule, setTempRule] = useState(null);

  // Parent References
  const [parentRefs, setParentRefs] = useState([
    {
      name: 'Gateway example',
      namespace: 'default',
      sectionName: '',
      port: ''
    }
  ]);

  // Hostnames
  const [hostnames, setHostnames] = useState(['']);

  // Rules
  const [rules, setRules] = useState([
    {
      matches: [
        {
          path: {
            type: 'PathPrefix',
            value: '/'
          },
          headers: [],
          queryParams: [],
          method: ''
        }
      ],
      filters: [],
      backendRefs: [
        {
          name: 'my-service',
          namespace: 'default',
          port: 80,
          weight: 1
        }
      ]
    }
  ]);

  // Namespace options
  const namespaceOptions = [
    { value: 'default', label: 'default' },
    { value: 'kube-system', label: 'kube-system' },
    { value: 'api-gateway-dmtest1', label: 'api-gateway-dmtest1' },
    { value: 'ai-gateway-prod', label: 'ai-gateway-prod' }
  ];

  // Gateway options
  const gatewayOptions = [
    { value: 'Gateway example', label: 'Gateway example' },
    { value: 'MCP demo gateway', label: 'MCP demo gateway' }
  ];

  // Service options
  const serviceOptions = [
    { value: 'my-service', label: 'my-service' },
    { value: 'api-service', label: 'api-service' },
    { value: 'web-service', label: 'web-service' }
  ];

  // Filter type options
  const filterTypeOptions = [
    { value: 'RequestHeaderModifier', label: 'Request Header Modifier' },
    { value: 'ResponseHeaderModifier', label: 'Response Header Modifier' },
    { value: 'RequestRedirect', label: 'Request Redirect' },
    { value: 'URLRewrite', label: 'URL Rewrite' },
    { value: 'RequestMirror', label: 'Request Mirror' }
  ];

  // Match type options
  const matchTypeOptions = [
    { value: 'PathPrefix', label: 'Path Prefix' },
    { value: 'Exact', label: 'Exact' },
    { value: 'RegularExpression', label: 'Regular Expression' }
  ];

  // HTTP method options
  const httpMethodOptions = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'DELETE', label: 'DELETE' },
    { value: 'PATCH', label: 'PATCH' },
    { value: 'HEAD', label: 'HEAD' },
    { value: 'OPTIONS', label: 'OPTIONS' }
  ];

  // Filter configuration templates
  const getFilterConfigTemplate = (type) => {
    switch (type) {
      case 'RequestHeaderModifier':
        return {
          add: [],
          set: [],
          remove: []
        };
      case 'ResponseHeaderModifier':
        return {
          add: [],
          set: [],
          remove: []
        };
      case 'RequestRedirect':
        return {
          scheme: 'https',
          hostname: '',
          path: '',
          port: null,
          statusCode: 302
        };
      case 'URLRewrite':
        return {
          hostname: '',
          path: ''
        };
      case 'RequestMirror':
        return {
          backendRef: {
            name: '',
            namespace: 'default',
            port: 80,
            weight: 1
          }
        };
      default:
        return {};
    }
  };

  // Helper functions for Parent References
  const addParentRef = () => {
    setParentRefs([...parentRefs, {
      name: '',
      namespace: 'default',
      sectionName: '',
      port: ''
    }]);
  };

  const removeParentRef = (index) => {
    setParentRefs(parentRefs.filter((_, i) => i !== index));
  };

  const updateParentRef = (index, field, value) => {
    const updated = [...parentRefs];
    updated[index] = { ...updated[index], [field]: value };
    setParentRefs(updated);
  };

  // Helper functions for Hostnames
  const addHostname = () => {
    setHostnames([...hostnames, '']);
  };

  const removeHostname = (index) => {
    setHostnames(hostnames.filter((_, i) => i !== index));
  };

  const updateHostname = (index, value) => {
    const updated = [...hostnames];
    updated[index] = value;
    setHostnames(updated);
  };

  // Rules modal functions
  const openRulesModal = (ruleIndex = null) => {
    if (ruleIndex !== null) {
      setEditingRuleIndex(ruleIndex);
      setTempRule({ ...rules[ruleIndex] });
    } else {
      setEditingRuleIndex(null);
      setTempRule({
        matches: [
          {
            path: {
              type: 'PathPrefix',
              value: '/'
            },
            headers: [],
            queryParams: [],
            method: ''
          }
        ],
        filters: [],
        backendRefs: [
          {
            name: 'my-service',
            namespace: 'default',
            port: 80,
            weight: 1
          }
        ]
      });
    }
    setCurrentStep(0);
    setIsRulesModalOpen(true);
  };

  const closeRulesModal = () => {
    setIsRulesModalOpen(false);
    setEditingRuleIndex(null);
    setTempRule(null);
    setCurrentStep(0);
  };

  const saveRule = () => {
    if (editingRuleIndex !== null) {
      const updatedRules = [...rules];
      updatedRules[editingRuleIndex] = tempRule;
      setRules(updatedRules);
    } else {
      setRules([...rules, tempRule]);
    }
    closeRulesModal();
  };

  const removeRule = (index) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  // Wizard step functions
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Matches functions
  const addMatch = () => {
    setTempRule({
      ...tempRule,
      matches: [...tempRule.matches, {
        path: {
          type: 'PathPrefix',
          value: '/'
        },
        headers: [],
        queryParams: [],
        method: ''
      }]
    });
  };

  const removeMatch = (matchIndex) => {
    const updatedMatches = tempRule.matches.filter((_, i) => i !== matchIndex);
    setTempRule({ ...tempRule, matches: updatedMatches });
  };

  const updateMatch = (matchIndex, field, value) => {
    const updatedMatches = [...tempRule.matches];
    const match = updatedMatches[matchIndex];
    
    if (field === 'path.type') {
      match.path = { ...match.path, type: value };
    } else if (field === 'path.value') {
      match.path = { ...match.path, value: value };
    } else if (field.startsWith('headers.') || field.startsWith('queryParams.')) {
      // Handle nested updates for headers and queryParams
      const [arrayName, index, prop] = field.split('.');
      if (index !== undefined && prop !== undefined) {
        match[arrayName][parseInt(index)] = { ...match[arrayName][parseInt(index)], [prop]: value };
      }
    } else {
      match[field] = value;
    }
    
    setTempRule({ ...tempRule, matches: updatedMatches });
  };

  // Helper functions for header management in matches
  const addMatchHeader = (matchIndex) => {
    const updatedMatches = [...tempRule.matches];
    const match = updatedMatches[matchIndex];
    match.headers = [...match.headers, { type: 'Exact', name: '', value: '' }];
    setTempRule({ ...tempRule, matches: updatedMatches });
  };

  const removeMatchHeader = (matchIndex, headerIndex) => {
    const updatedMatches = [...tempRule.matches];
    const match = updatedMatches[matchIndex];
    match.headers = match.headers.filter((_, i) => i !== headerIndex);
    setTempRule({ ...tempRule, matches: updatedMatches });
  };

  const updateMatchHeader = (matchIndex, headerIndex, field, value) => {
    const updatedMatches = [...tempRule.matches];
    const match = updatedMatches[matchIndex];
    match.headers[headerIndex] = { ...match.headers[headerIndex], [field]: value };
    setTempRule({ ...tempRule, matches: updatedMatches });
  };

  // Helper functions for query param management in matches
  const addMatchQueryParam = (matchIndex) => {
    const updatedMatches = [...tempRule.matches];
    const match = updatedMatches[matchIndex];
    match.queryParams = [...match.queryParams, { type: 'Exact', name: '', value: '' }];
    setTempRule({ ...tempRule, matches: updatedMatches });
  };

  const removeMatchQueryParam = (matchIndex, paramIndex) => {
    const updatedMatches = [...tempRule.matches];
    const match = updatedMatches[matchIndex];
    match.queryParams = match.queryParams.filter((_, i) => i !== paramIndex);
    setTempRule({ ...tempRule, matches: updatedMatches });
  };

  const updateMatchQueryParam = (matchIndex, paramIndex, field, value) => {
    const updatedMatches = [...tempRule.matches];
    const match = updatedMatches[matchIndex];
    match.queryParams[paramIndex] = { ...match.queryParams[paramIndex], [field]: value };
    setTempRule({ ...tempRule, matches: updatedMatches });
  };

  // Toggle edit mode for headers and query params
  const [editingHeader, setEditingHeader] = useState(null);
  const [editingQueryParam, setEditingQueryParam] = useState(null);

  const startEditHeader = (matchIndex, headerIndex) => {
    setEditingHeader({ matchIndex, headerIndex });
  };

  const startEditQueryParam = (matchIndex, paramIndex) => {
    setEditingQueryParam({ matchIndex, paramIndex });
  };

  const cancelEdit = () => {
    setEditingHeader(null);
    setEditingQueryParam(null);
  };

  // Filters functions
  const addFilter = () => {
    setTempRule({
      ...tempRule,
      filters: [...tempRule.filters, {
        type: 'RequestHeaderModifier',
        config: getFilterConfigTemplate('RequestHeaderModifier')
      }]
    });
  };

  const removeFilter = (filterIndex) => {
    const updatedFilters = tempRule.filters.filter((_, i) => i !== filterIndex);
    setTempRule({ ...tempRule, filters: updatedFilters });
  };

  const updateFilter = (filterIndex, field, value) => {
    const updatedFilters = [...tempRule.filters];
    const filter = updatedFilters[filterIndex];
    
    if (field === 'type') {
      // When filter type changes, update the config template
      filter.type = value;
      filter.config = getFilterConfigTemplate(value);
    } else if (field.startsWith('config.')) {
      // Handle nested config updates
      const configField = field.replace('config.', '');
      filter.config = { ...filter.config, [configField]: value };
    } else {
      filter[field] = value;
    }
    
    setTempRule({ ...tempRule, filters: updatedFilters });
  };

  // Helper functions for header management
  const addHeader = (filterIndex, headerType) => {
    const updatedFilters = [...tempRule.filters];
    const filter = updatedFilters[filterIndex];
    filter.config[headerType] = [...filter.config[headerType], { name: '', value: '' }];
    setTempRule({ ...tempRule, filters: updatedFilters });
  };

  const removeHeader = (filterIndex, headerType, headerIndex) => {
    const updatedFilters = [...tempRule.filters];
    const filter = updatedFilters[filterIndex];
    filter.config[headerType] = filter.config[headerType].filter((_, i) => i !== headerIndex);
    setTempRule({ ...tempRule, filters: updatedFilters });
  };

  const updateHeader = (filterIndex, headerType, headerIndex, field, value) => {
    const updatedFilters = [...tempRule.filters];
    const filter = updatedFilters[filterIndex];
    filter.config[headerType][headerIndex] = { ...filter.config[headerType][headerIndex], [field]: value };
    setTempRule({ ...tempRule, filters: updatedFilters });
  };

  // BackendRefs functions
  const addBackendRef = () => {
    setTempRule({
      ...tempRule,
      backendRefs: [...tempRule.backendRefs, {
        name: '',
        namespace: 'default',
        port: 80,
        weight: 1
      }]
    });
  };

  const removeBackendRef = (backendIndex) => {
    const updatedBackendRefs = tempRule.backendRefs.filter((_, i) => i !== backendIndex);
    setTempRule({ ...tempRule, backendRefs: updatedBackendRefs });
  };

  const updateBackendRef = (backendIndex, field, value) => {
    const updatedBackendRefs = [...tempRule.backendRefs];
    updatedBackendRefs[backendIndex] = { ...updatedBackendRefs[backendIndex], [field]: value };
    setTempRule({ ...tempRule, backendRefs: updatedBackendRefs });
  };

  // Wizard step renderers
  const renderMatchesStep = () => (
    <div>
      <h3>Request Matches</h3>
      <p style={{ color: '#6a6e73', marginBottom: '16px' }}>
        Define the criteria for a request to match this rule. If multiple matches are specified, they are ORed.
      </p>
      
      {tempRule.matches.map((match, matchIndex) => (
        <Card key={matchIndex} style={{ marginBottom: '16px' }}>
          <CardHeader>
            <CardTitle>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Match {matchIndex + 1}</span>
                {tempRule.matches.length > 1 && (
                  <Button
                    variant="plain"
                    icon={<TrashIcon />}
                    onClick={() => removeMatch(matchIndex)}
                  />
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardBody>
            {/* Visual Match Summary */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '20px',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #e1e1e1'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                flex: 1
              }}>
                <div style={{ 
                  padding: '4px 8px', 
                  backgroundColor: '#0066cc', 
                  color: 'white', 
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {match.path.type}
                </div>
                <div style={{ 
                  padding: '4px 8px', 
                  backgroundColor: '#e1e1e1', 
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'monospace'
                }}>
                  {match.path.value}
                </div>
                {match.method && (
                  <div style={{ 
                    padding: '4px 8px', 
                    backgroundColor: '#28a745', 
                    color: 'white', 
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {match.method}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '12px', color: '#6a6e73' }}>
                {match.headers.length > 0 && `${match.headers.length} headers`}
                {match.queryParams.length > 0 && `${match.headers.length > 0 ? ', ' : ''}${match.queryParams.length} params`}
              </div>
            </div>

            {/* Collapsible Configuration Sections */}
            <div style={{ marginBottom: '16px' }}>
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  // Toggle path configuration visibility
                  const pathConfig = document.getElementById(`path-config-${matchIndex}`);
                  if (pathConfig) {
                    pathConfig.style.display = pathConfig.style.display === 'none' ? 'block' : 'none';
                  }
                }}
                style={{ padding: '0', marginBottom: '8px' }}
              >
                ⚙️ Configure Path & Method
              </Button>
              <div id={`path-config-${matchIndex}`} style={{ display: 'none', marginLeft: '16px' }}>
                <Grid hasGutter>
                  <GridItem xl={6} lg={6} md={12}>
                    <FormGroup label="Path Type">
                      <Select
                        selected={match.path.type}
                        onSelect={(_event, selection) => updateMatch(matchIndex, 'path.type', selection)}
                        isOpen={isWizardPathTypeSelectOpen[matchIndex] || false}
                        onOpenChange={(isOpen) => setIsWizardPathTypeSelectOpen({...isWizardPathTypeSelectOpen, [matchIndex]: isOpen})}
                        toggle={
                          <MenuToggle
                            onClick={() => setIsWizardPathTypeSelectOpen({...isWizardPathTypeSelectOpen, [matchIndex]: !isWizardPathTypeSelectOpen[matchIndex]})}
                            isExpanded={isWizardPathTypeSelectOpen[matchIndex] || false}
                          >
                            {matchTypeOptions.find(opt => opt.value === match.path.type)?.label || match.path.type}
                          </MenuToggle>
                        }
                      >
                        {matchTypeOptions.map((option, optIndex) => (
                          <SelectOption key={optIndex} value={option.value}>
                            {option.label}
                          </SelectOption>
                        ))}
                      </Select>
                    </FormGroup>
                  </GridItem>
                  
                  <GridItem xl={6} lg={6} md={12}>
                    <FormGroup label="Path Value">
                      <TextInput
                        value={match.path.value}
                        onChange={(_event, value) => updateMatch(matchIndex, 'path.value', value)}
                        placeholder="/"
                      />
                    </FormGroup>
                  </GridItem>
                  
                  <GridItem xl={6} lg={6} md={12}>
                    <FormGroup label="HTTP Method">
                      <Select
                        selected={match.method}
                        onSelect={(_event, selection) => updateMatch(matchIndex, 'method', selection)}
                        isOpen={isWizardMethodSelectOpen[matchIndex] || false}
                        onOpenChange={(isOpen) => setIsWizardMethodSelectOpen({...isWizardMethodSelectOpen, [matchIndex]: isOpen})}
                        toggle={
                          <MenuToggle
                            onClick={() => setIsWizardMethodSelectOpen({...isWizardMethodSelectOpen, [matchIndex]: !isWizardMethodSelectOpen[matchIndex]})}
                            isExpanded={isWizardMethodSelectOpen[matchIndex] || false}
                          >
                            {match.method || 'Any method'}
                          </MenuToggle>
                        }
                      >
                        <SelectOption value="">Any method</SelectOption>
                        {httpMethodOptions.map((option, optIndex) => (
                          <SelectOption key={optIndex} value={option.value}>
                            {option.label}
                          </SelectOption>
                        ))}
                      </Select>
                    </FormGroup>
                  </GridItem>
                </Grid>
              </div>
            </div>

            {/* Headers Section - Only show if there are headers or user wants to add */}
            {(match.headers.length > 0 || true) && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Headers</span>
                  <Button
                    variant="link"
                    size="sm"
                    icon={<PlusIcon />}
                    onClick={() => addMatchHeader(matchIndex)}
                  >
                    Add Header
                  </Button>
                </div>
                {match.headers.length === 0 ? (
                  <div style={{ 
                    padding: '12px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '4px',
                    textAlign: 'center',
                    color: '#6a6e73',
                    fontSize: '12px'
                  }}>
                    No headers configured
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {match.headers.map((header, headerIndex) => (
                      <div key={headerIndex}>
                        {editingHeader?.matchIndex === matchIndex && editingHeader?.headerIndex === headerIndex ? (
                          // Edit mode
                          <div style={{ 
                            padding: '12px',
                            backgroundColor: '#fff',
                            borderRadius: '4px',
                            border: '2px solid #0066cc'
                          }}>
                            <Grid hasGutter>
                              <GridItem xl={4} lg={4} md={12}>
                                <FormGroup label="Header Name">
                                  <TextInput
                                    value={header.name}
                                    onChange={(_event, value) => updateMatchHeader(matchIndex, headerIndex, 'name', value)}
                                    placeholder="Content-Type"
                                  />
                                </FormGroup>
                              </GridItem>
                              <GridItem xl={3} lg={3} md={6}>
                                <FormGroup label="Match Type">
                                  <Select
                                    selected={header.type}
                                    onSelect={(_event, selection) => updateMatchHeader(matchIndex, headerIndex, 'type', selection)}
                                    toggle={
                                      <MenuToggle>
                                        {header.type}
                                      </MenuToggle>
                                    }
                                  >
                                    <SelectOption value="Exact">Exact</SelectOption>
                                    <SelectOption value="RegularExpression">Regular Expression</SelectOption>
                                  </Select>
                                </FormGroup>
                              </GridItem>
                              <GridItem xl={4} lg={4} md={12}>
                                <FormGroup label="Header Value">
                                  <TextInput
                                    value={header.value}
                                    onChange={(_event, value) => updateMatchHeader(matchIndex, headerIndex, 'value', value)}
                                    placeholder="application/json"
                                  />
                                </FormGroup>
                              </GridItem>
                              <GridItem xl={1} lg={1} md={12}>
                                <div style={{ display: 'flex', gap: '4px', marginTop: '24px' }}>
                                  <Button
                                    variant="plain"
                                    size="sm"
                                    onClick={cancelEdit}
                                  >
                                    ✓
                                  </Button>
                                  <Button
                                    variant="plain"
                                    size="sm"
                                    icon={<TrashIcon />}
                                    onClick={() => {
                                      removeMatchHeader(matchIndex, headerIndex);
                                      cancelEdit();
                                    }}
                                  />
                                </div>
                              </GridItem>
                            </Grid>
                          </div>
                        ) : (
                          // Display mode
                          <div 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px',
                              padding: '8px',
                              backgroundColor: '#f8f9fa',
                              borderRadius: '4px',
                              border: '1px solid #e1e1e1',
                              cursor: 'pointer'
                            }}
                            onClick={() => startEditHeader(matchIndex, headerIndex)}
                          >
                            <div style={{ 
                              padding: '2px 6px', 
                              backgroundColor: '#0066cc', 
                              color: 'white', 
                              borderRadius: '3px',
                              fontSize: '10px',
                              fontWeight: 'bold'
                            }}>
                              {header.type}
                            </div>
                            <div style={{ flex: 1, fontSize: '12px' }}>
                              <strong>{header.name}:</strong> {header.value}
                            </div>
                            <Button
                              variant="plain"
                              size="sm"
                              icon={<TrashIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeMatchHeader(matchIndex, headerIndex);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Query Parameters Section - Only show if there are params or user wants to add */}
            {(match.queryParams.length > 0 || true) && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Query Parameters</span>
                  <Button
                    variant="link"
                    size="sm"
                    icon={<PlusIcon />}
                    onClick={() => addMatchQueryParam(matchIndex)}
                  >
                    Add Parameter
                  </Button>
                </div>
                {match.queryParams.length === 0 ? (
                  <div style={{ 
                    padding: '12px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '4px',
                    textAlign: 'center',
                    color: '#6a6e73',
                    fontSize: '12px'
                  }}>
                    No query parameters configured
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {match.queryParams.map((param, paramIndex) => (
                      <div key={paramIndex}>
                        {editingQueryParam?.matchIndex === matchIndex && editingQueryParam?.paramIndex === paramIndex ? (
                          // Edit mode
                          <div style={{ 
                            padding: '12px',
                            backgroundColor: '#fff',
                            borderRadius: '4px',
                            border: '2px solid #28a745'
                          }}>
                            <Grid hasGutter>
                              <GridItem xl={4} lg={4} md={12}>
                                <FormGroup label="Parameter Name">
                                  <TextInput
                                    value={param.name}
                                    onChange={(_event, value) => updateMatchQueryParam(matchIndex, paramIndex, 'name', value)}
                                    placeholder="user_id"
                                  />
                                </FormGroup>
                              </GridItem>
                              <GridItem xl={3} lg={3} md={6}>
                                <FormGroup label="Match Type">
                                  <Select
                                    selected={param.type}
                                    onSelect={(_event, selection) => updateMatchQueryParam(matchIndex, paramIndex, 'type', selection)}
                                    toggle={
                                      <MenuToggle>
                                        {param.type}
                                      </MenuToggle>
                                    }
                                  >
                                    <SelectOption value="Exact">Exact</SelectOption>
                                    <SelectOption value="RegularExpression">Regular Expression</SelectOption>
                                  </Select>
                                </FormGroup>
                              </GridItem>
                              <GridItem xl={4} lg={4} md={12}>
                                <FormGroup label="Parameter Value">
                                  <TextInput
                                    value={param.value}
                                    onChange={(_event, value) => updateMatchQueryParam(matchIndex, paramIndex, 'value', value)}
                                    placeholder="123"
                                  />
                                </FormGroup>
                              </GridItem>
                              <GridItem xl={1} lg={1} md={12}>
                                <div style={{ display: 'flex', gap: '4px', marginTop: '24px' }}>
                                  <Button
                                    variant="plain"
                                    size="sm"
                                    onClick={cancelEdit}
                                  >
                                    ✓
                                  </Button>
                                  <Button
                                    variant="plain"
                                    size="sm"
                                    icon={<TrashIcon />}
                                    onClick={() => {
                                      removeMatchQueryParam(matchIndex, paramIndex);
                                      cancelEdit();
                                    }}
                                  />
                                </div>
                              </GridItem>
                            </Grid>
                          </div>
                        ) : (
                          // Display mode
                          <div 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px',
                              padding: '8px',
                              backgroundColor: '#f8f9fa',
                              borderRadius: '4px',
                              border: '1px solid #e1e1e1',
                              cursor: 'pointer'
                            }}
                            onClick={() => startEditQueryParam(matchIndex, paramIndex)}
                          >
                            <div style={{ 
                              padding: '2px 6px', 
                              backgroundColor: '#28a745', 
                              color: 'white', 
                              borderRadius: '3px',
                              fontSize: '10px',
                              fontWeight: 'bold'
                            }}>
                              {param.type}
                            </div>
                            <div style={{ flex: 1, fontSize: '12px' }}>
                              <strong>{param.name}:</strong> {param.value}
                            </div>
                            <Button
                              variant="plain"
                              size="sm"
                              icon={<TrashIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeMatchQueryParam(matchIndex, paramIndex);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quick Add Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px'
            }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => addMatchHeader(matchIndex)}
              >
                + Header
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => addMatchQueryParam(matchIndex)}
              >
                + Query Param
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
      
      <Button variant="link" size="sm" icon={<PlusIcon />} onClick={addMatch}>
        Add Match
      </Button>
    </div>
  );

  const renderFiltersStep = () => (
    <div>
      <h3>Request Filters</h3>
      <p style={{ color: '#6a6e73', marginBottom: '16px' }}>
        Define actions to perform on a request or response before it is sent to the backend.
      </p>
      
      {tempRule.filters.map((filter, filterIndex) => (
        <Card key={filterIndex} style={{ marginBottom: '16px' }}>
          <CardHeader>
            <CardTitle>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Filter {filterIndex + 1}</span>
                <Button
                  variant="plain"
                  icon={<TrashIcon />}
                  onClick={() => removeFilter(filterIndex)}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <FormGroup label="Filter Type">
              <Select
                selected={filter.type}
                onSelect={(_event, selection) => updateFilter(filterIndex, 'type', selection)}
                isOpen={isWizardFilterTypeSelectOpen[filterIndex] || false}
                onOpenChange={(isOpen) => setIsWizardFilterTypeSelectOpen({...isWizardFilterTypeSelectOpen, [filterIndex]: isOpen})}
                toggle={
                  <MenuToggle
                    onClick={() => setIsWizardFilterTypeSelectOpen({...isWizardFilterTypeSelectOpen, [filterIndex]: !isWizardFilterTypeSelectOpen[filterIndex]})}
                    isExpanded={isWizardFilterTypeSelectOpen[filterIndex] || false}
                  >
                    {filterTypeOptions.find(opt => opt.value === filter.type)?.label || filter.type}
                  </MenuToggle>
                }
              >
                {filterTypeOptions.map((option, index) => (
                  <SelectOption key={index} value={option.value}>
                    {option.label}
                  </SelectOption>
                ))}
              </Select>
            </FormGroup>

            {/* Filter Type Specific Configuration */}
            {filter.type === 'RequestHeaderModifier' && (
              <div style={{ marginTop: '16px' }}>
                <h5 style={{ marginBottom: '12px' }}>Header Configuration</h5>
                
                {/* Add Headers */}
                <div style={{ marginBottom: '16px' }}>
                  <h6 style={{ marginBottom: '8px' }}>Add Headers</h6>
                  {filter.config.add.map((header, headerIndex) => (
                    <div key={headerIndex} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'end' }}>
                      <div style={{ flex: 1 }}>
                        <TextInput
                          placeholder="Header name"
                          value={header.name}
                          onChange={(_event, value) => updateHeader(filterIndex, 'add', headerIndex, 'name', value)}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <TextInput
                          placeholder="Header value"
                          value={header.value}
                          onChange={(_event, value) => updateHeader(filterIndex, 'add', headerIndex, 'value', value)}
                        />
                      </div>
                      <Button
                        variant="plain"
                        icon={<TrashIcon />}
                        onClick={() => removeHeader(filterIndex, 'add', headerIndex)}
                      />
                    </div>
                  ))}
                  <Button variant="link" size="sm" icon={<PlusIcon />} onClick={() => addHeader(filterIndex, 'add')}>
                    Add Header
                  </Button>
                </div>

                {/* Set Headers */}
                <div style={{ marginBottom: '16px' }}>
                  <h6 style={{ marginBottom: '8px' }}>Set Headers</h6>
                  {filter.config.set.map((header, headerIndex) => (
                    <div key={headerIndex} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'end' }}>
                      <div style={{ flex: 1 }}>
                        <TextInput
                          placeholder="Header name"
                          value={header.name}
                          onChange={(_event, value) => updateHeader(filterIndex, 'set', headerIndex, 'name', value)}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <TextInput
                          placeholder="Header value"
                          value={header.value}
                          onChange={(_event, value) => updateHeader(filterIndex, 'set', headerIndex, 'value', value)}
                        />
                      </div>
                      <Button
                        variant="plain"
                        icon={<TrashIcon />}
                        onClick={() => removeHeader(filterIndex, 'set', headerIndex)}
                      />
                    </div>
                  ))}
                  <Button variant="link" size="sm" icon={<PlusIcon />} onClick={() => addHeader(filterIndex, 'set')}>
                    Set Header
                  </Button>
                </div>

                {/* Remove Headers */}
                <div style={{ marginBottom: '16px' }}>
                  <h6 style={{ marginBottom: '8px' }}>Remove Headers</h6>
                  {filter.config.remove.map((header, headerIndex) => (
                    <div key={headerIndex} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'end' }}>
                      <div style={{ flex: 1 }}>
                        <TextInput
                          placeholder="Header name"
                          value={header.name}
                          onChange={(_event, value) => updateHeader(filterIndex, 'remove', headerIndex, 'name', value)}
                        />
                      </div>
                      <Button
                        variant="plain"
                        icon={<TrashIcon />}
                        onClick={() => removeHeader(filterIndex, 'remove', headerIndex)}
                      />
                    </div>
                  ))}
                  <Button variant="link" size="sm" icon={<PlusIcon />} onClick={() => addHeader(filterIndex, 'remove')}>
                    Remove Header
                  </Button>
                </div>
              </div>
            )}

            {filter.type === 'ResponseHeaderModifier' && (
              <div style={{ marginTop: '16px' }}>
                <h5 style={{ marginBottom: '12px' }}>Response Header Configuration</h5>
                
                {/* Add Headers */}
                <div style={{ marginBottom: '16px' }}>
                  <h6 style={{ marginBottom: '8px' }}>Add Headers</h6>
                  {filter.config.add.map((header, headerIndex) => (
                    <div key={headerIndex} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'end' }}>
                      <div style={{ flex: 1 }}>
                        <TextInput
                          placeholder="Header name"
                          value={header.name}
                          onChange={(_event, value) => updateHeader(filterIndex, 'add', headerIndex, 'name', value)}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <TextInput
                          placeholder="Header value"
                          value={header.value}
                          onChange={(_event, value) => updateHeader(filterIndex, 'add', headerIndex, 'value', value)}
                        />
                      </div>
                      <Button
                        variant="plain"
                        icon={<TrashIcon />}
                        onClick={() => removeHeader(filterIndex, 'add', headerIndex)}
                      />
                    </div>
                  ))}
                  <Button variant="link" size="sm" icon={<PlusIcon />} onClick={() => addHeader(filterIndex, 'add')}>
                    Add Header
                  </Button>
                </div>

                {/* Set Headers */}
                <div style={{ marginBottom: '16px' }}>
                  <h6 style={{ marginBottom: '8px' }}>Set Headers</h6>
                  {filter.config.set.map((header, headerIndex) => (
                    <div key={headerIndex} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'end' }}>
                      <div style={{ flex: 1 }}>
                        <TextInput
                          placeholder="Header name"
                          value={header.name}
                          onChange={(_event, value) => updateHeader(filterIndex, 'set', headerIndex, 'name', value)}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <TextInput
                          placeholder="Header value"
                          value={header.value}
                          onChange={(_event, value) => updateHeader(filterIndex, 'set', headerIndex, 'value', value)}
                        />
                      </div>
                      <Button
                        variant="plain"
                        icon={<TrashIcon />}
                        onClick={() => removeHeader(filterIndex, 'set', headerIndex)}
                      />
                    </div>
                  ))}
                  <Button variant="link" size="sm" icon={<PlusIcon />} onClick={() => addHeader(filterIndex, 'set')}>
                    Set Header
                  </Button>
                </div>

                {/* Remove Headers */}
                <div style={{ marginBottom: '16px' }}>
                  <h6 style={{ marginBottom: '8px' }}>Remove Headers</h6>
                  {filter.config.remove.map((header, headerIndex) => (
                    <div key={headerIndex} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'end' }}>
                      <div style={{ flex: 1 }}>
                        <TextInput
                          placeholder="Header name"
                          value={header.name}
                          onChange={(_event, value) => updateHeader(filterIndex, 'remove', headerIndex, 'name', value)}
                        />
                      </div>
                      <Button
                        variant="plain"
                        icon={<TrashIcon />}
                        onClick={() => removeHeader(filterIndex, 'remove', headerIndex)}
                      />
                    </div>
                  ))}
                  <Button variant="link" size="sm" icon={<PlusIcon />} onClick={() => addHeader(filterIndex, 'remove')}>
                    Remove Header
                  </Button>
                </div>
              </div>
            )}

            {filter.type === 'RequestRedirect' && (
              <div style={{ marginTop: '16px' }}>
                <h5 style={{ marginBottom: '12px' }}>Redirect Configuration</h5>
                <Grid hasGutter>
                  <GridItem xl={6} lg={6} md={12}>
                    <FormGroup label="Scheme">
                      <Select
                        selected={filter.config.scheme}
                        onSelect={(_event, selection) => updateFilter(filterIndex, 'config.scheme', selection)}
                        toggle={
                          <MenuToggle>
                            {filter.config.scheme}
                          </MenuToggle>
                        }
                      >
                        <SelectOption value="http">HTTP</SelectOption>
                        <SelectOption value="https">HTTPS</SelectOption>
                      </Select>
                    </FormGroup>
                  </GridItem>
                  <GridItem xl={6} lg={6} md={12}>
                    <FormGroup label="Hostname">
                      <TextInput
                        value={filter.config.hostname}
                        onChange={(_event, value) => updateFilter(filterIndex, 'config.hostname', value)}
                        placeholder="example.com"
                      />
                    </FormGroup>
                  </GridItem>
                  <GridItem xl={6} lg={6} md={12}>
                    <FormGroup label="Path">
                      <TextInput
                        value={filter.config.path}
                        onChange={(_event, value) => updateFilter(filterIndex, 'config.path', value)}
                        placeholder="/new-path"
                      />
                    </FormGroup>
                  </GridItem>
                  <GridItem xl={3} lg={3} md={6}>
                    <FormGroup label="Port">
                      <TextInput
                        type="number"
                        value={filter.config.port || ''}
                        onChange={(_event, value) => updateFilter(filterIndex, 'config.port', value ? parseInt(value) : null)}
                        placeholder="443"
                      />
                    </FormGroup>
                  </GridItem>
                  <GridItem xl={3} lg={3} md={6}>
                    <FormGroup label="Status Code">
                      <Select
                        selected={filter.config.statusCode}
                        onSelect={(_event, selection) => updateFilter(filterIndex, 'config.statusCode', parseInt(selection))}
                        toggle={
                          <MenuToggle>
                            {filter.config.statusCode}
                          </MenuToggle>
                        }
                      >
                        <SelectOption value={301}>301 (Moved Permanently)</SelectOption>
                        <SelectOption value={302}>302 (Found)</SelectOption>
                        <SelectOption value={303}>303 (See Other)</SelectOption>
                        <SelectOption value={307}>307 (Temporary Redirect)</SelectOption>
                        <SelectOption value={308}>308 (Permanent Redirect)</SelectOption>
                      </Select>
                    </FormGroup>
                  </GridItem>
                </Grid>
              </div>
            )}

            {filter.type === 'URLRewrite' && (
              <div style={{ marginTop: '16px' }}>
                <h5 style={{ marginBottom: '12px' }}>URL Rewrite Configuration</h5>
                <Grid hasGutter>
                  <GridItem xl={6} lg={6} md={12}>
                    <FormGroup label="Hostname">
                      <TextInput
                        value={filter.config.hostname}
                        onChange={(_event, value) => updateFilter(filterIndex, 'config.hostname', value)}
                        placeholder="new-hostname.com"
                      />
                      <div style={{ fontSize: '12px', color: '#6a6e73', marginTop: '4px' }}>
                        Leave empty to keep original hostname
                      </div>
                    </FormGroup>
                  </GridItem>
                  <GridItem xl={6} lg={6} md={12}>
                    <FormGroup label="Path">
                      <TextInput
                        value={filter.config.path}
                        onChange={(_event, value) => updateFilter(filterIndex, 'config.path', value)}
                        placeholder="/new-path"
                      />
                      <div style={{ fontSize: '12px', color: '#6a6e73', marginTop: '4px' }}>
                        Leave empty to keep original path
                      </div>
                    </FormGroup>
                  </GridItem>
                </Grid>
              </div>
            )}

            {filter.type === 'RequestMirror' && (
              <div style={{ marginTop: '16px' }}>
                <h5 style={{ marginBottom: '12px' }}>Mirror Backend Configuration</h5>
                <Grid hasGutter>
                  <GridItem xl={6} lg={6} md={12}>
                    <FormGroup label="Service Name" isRequired>
                      <Select
                        selected={filter.config.backendRef.name}
                        onSelect={(_event, selection) => updateFilter(filterIndex, 'config.backendRef.name', selection)}
                        toggle={
                          <MenuToggle>
                            {filter.config.backendRef.name || 'Select Service'}
                          </MenuToggle>
                        }
                      >
                        {serviceOptions.map((option, optIndex) => (
                          <SelectOption key={optIndex} value={option.value}>
                            {option.label}
                          </SelectOption>
                        ))}
                      </Select>
                    </FormGroup>
                  </GridItem>
                  <GridItem xl={3} lg={3} md={6}>
                    <FormGroup label="Namespace">
                      <TextInput
                        value={filter.config.backendRef.namespace}
                        onChange={(_event, value) => updateFilter(filterIndex, 'config.backendRef.namespace', value)}
                        placeholder="default"
                      />
                    </FormGroup>
                  </GridItem>
                  <GridItem xl={3} lg={3} md={6}>
                    <FormGroup label="Port">
                      <TextInput
                        type="number"
                        value={filter.config.backendRef.port}
                        onChange={(_event, value) => updateFilter(filterIndex, 'config.backendRef.port', parseInt(value) || 0)}
                        placeholder="80"
                      />
                    </FormGroup>
                  </GridItem>
                </Grid>
              </div>
            )}
          </CardBody>
        </Card>
      ))}
      
      <Button variant="link" size="sm" icon={<PlusIcon />} onClick={addFilter}>
        Add Filter
      </Button>
    </div>
  );

  const renderBackendRefsStep = () => (
    <div>
      <h3>Backend References</h3>
      <p style={{ color: '#6a6e73', marginBottom: '16px' }}>
        Define the backend Kubernetes Service(s) to forward traffic to.
      </p>
      
      {tempRule.backendRefs.map((backendRef, backendIndex) => (
        <Card key={backendIndex} style={{ marginBottom: '16px' }}>
          <CardHeader>
            <CardTitle>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Backend {backendIndex + 1}</span>
                {tempRule.backendRefs.length > 1 && (
                  <Button
                    variant="plain"
                    icon={<TrashIcon />}
                    onClick={() => removeBackendRef(backendIndex)}
                  />
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <Grid hasGutter>
              <GridItem xl={6} lg={6} md={12}>
                <FormGroup label="Service Name" isRequired>
                  <Select
                    selected={backendRef.name}
                    onSelect={(_event, selection) => updateBackendRef(backendIndex, 'name', selection)}
                    isOpen={isWizardServiceSelectOpen[backendIndex] || false}
                    onOpenChange={(isOpen) => setIsWizardServiceSelectOpen({...isWizardServiceSelectOpen, [backendIndex]: isOpen})}
                    toggle={
                      <MenuToggle
                        onClick={() => setIsWizardServiceSelectOpen({...isWizardServiceSelectOpen, [backendIndex]: !isWizardServiceSelectOpen[backendIndex]})}
                        isExpanded={isWizardServiceSelectOpen[backendIndex] || false}
                      >
                        {backendRef.name || 'Select Service'}
                      </MenuToggle>
                    }
                  >
                    {serviceOptions.map((option, optIndex) => (
                      <SelectOption key={optIndex} value={option.value}>
                        {option.label}
                      </SelectOption>
                    ))}
                  </Select>
                </FormGroup>
              </GridItem>
              
              <GridItem xl={3} lg={3} md={6}>
                <FormGroup label="Namespace">
                  <TextInput
                    value={backendRef.namespace}
                    onChange={(_event, value) => updateBackendRef(backendIndex, 'namespace', value)}
                    placeholder="default"
                  />
                </FormGroup>
              </GridItem>
              
              <GridItem xl={3} lg={3} md={6}>
                <FormGroup label="Port">
                  <TextInput
                    type="number"
                    value={backendRef.port}
                    onChange={(_event, value) => updateBackendRef(backendIndex, 'port', parseInt(value) || 0)}
                    placeholder="80"
                  />
                </FormGroup>
              </GridItem>
              
              <GridItem xl={6} lg={6} md={12}>
                <FormGroup label="Weight">
                  <TextInput
                    type="number"
                    value={backendRef.weight}
                    onChange={(_event, value) => updateBackendRef(backendIndex, 'weight', parseInt(value) || 1)}
                    placeholder="1"
                  />
                  <div style={{ fontSize: '12px', color: '#6a6e73', marginTop: '4px' }}>
                    Weight for load balancing (1-1,000,000). Defaults to 1.
                  </div>
                </FormGroup>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
      ))}
      
      <Button variant="link" size="sm" icon={<PlusIcon />} onClick={addBackendRef}>
        Add Backend Reference
      </Button>
    </div>
  );

  const renderReviewStep = () => (
    <div>
      <h3>Review Rule Configuration</h3>
      
      <Card style={{ marginBottom: '16px' }}>
        <CardHeader>
          <CardTitle>Matches ({tempRule.matches.length})</CardTitle>
        </CardHeader>
        <CardBody>
          {tempRule.matches.length === 0 ? (
            <div style={{ color: '#6a6e73' }}>No matches configured (matches all requests)</div>
          ) : (
            tempRule.matches.map((match, index) => (
              <div key={index} style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  Match {index + 1}: {match.path.type} {match.path.value}
                </div>
                <div style={{ fontSize: '12px', color: '#6a6e73', marginLeft: '8px' }}>
                  {match.method && `Method: ${match.method}`}
                  {match.headers.length > 0 && `${match.method ? ', ' : ''}Headers: ${match.headers.length}`}
                  {match.queryParams.length > 0 && `${(match.method || match.headers.length > 0) ? ', ' : ''}Query Params: ${match.queryParams.length}`}
                </div>
                {match.headers.length > 0 && (
                  <div style={{ fontSize: '11px', color: '#6a6e73', marginLeft: '16px', marginTop: '2px' }}>
                    {match.headers.map((header, hIndex) => (
                      <div key={hIndex}>• {header.name}: {header.value} ({header.type})</div>
                    ))}
                  </div>
                )}
                {match.queryParams.length > 0 && (
                  <div style={{ fontSize: '11px', color: '#6a6e73', marginLeft: '16px', marginTop: '2px' }}>
                    {match.queryParams.map((param, pIndex) => (
                      <div key={pIndex}>• {param.name}: {param.value} ({param.type})</div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </CardBody>
      </Card>
      
      <Card style={{ marginBottom: '16px' }}>
        <CardHeader>
          <CardTitle>Filters ({tempRule.filters.length})</CardTitle>
        </CardHeader>
        <CardBody>
          {tempRule.filters.length === 0 ? (
            <div style={{ color: '#6a6e73' }}>No filters configured</div>
          ) : (
            tempRule.filters.map((filter, index) => (
              <div key={index} style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  Filter {index + 1}: {filter.type}
                </div>
                {filter.type === 'RequestHeaderModifier' && (
                  <div style={{ fontSize: '12px', color: '#6a6e73', marginLeft: '8px' }}>
                    {filter.config.add.length > 0 && `Add: ${filter.config.add.length} headers`}
                    {filter.config.set.length > 0 && `${filter.config.add.length > 0 ? ', ' : ''}Set: ${filter.config.set.length} headers`}
                    {filter.config.remove.length > 0 && `${(filter.config.add.length > 0 || filter.config.set.length > 0) ? ', ' : ''}Remove: ${filter.config.remove.length} headers`}
                  </div>
                )}
                {filter.type === 'ResponseHeaderModifier' && (
                  <div style={{ fontSize: '12px', color: '#6a6e73', marginLeft: '8px' }}>
                    {filter.config.add.length > 0 && `Add: ${filter.config.add.length} headers`}
                    {filter.config.set.length > 0 && `${filter.config.add.length > 0 ? ', ' : ''}Set: ${filter.config.set.length} headers`}
                    {filter.config.remove.length > 0 && `${(filter.config.add.length > 0 || filter.config.set.length > 0) ? ', ' : ''}Remove: ${filter.config.remove.length} headers`}
                  </div>
                )}
                {filter.type === 'RequestRedirect' && (
                  <div style={{ fontSize: '12px', color: '#6a6e73', marginLeft: '8px' }}>
                    {filter.config.scheme}://{filter.config.hostname || 'original'}{filter.config.path || ''}
                    {filter.config.port && `:${filter.config.port}`} (Status: {filter.config.statusCode})
                  </div>
                )}
                {filter.type === 'URLRewrite' && (
                  <div style={{ fontSize: '12px', color: '#6a6e73', marginLeft: '8px' }}>
                    Hostname: {filter.config.hostname || 'keep original'}, Path: {filter.config.path || 'keep original'}
                  </div>
                )}
                {filter.type === 'RequestMirror' && (
                  <div style={{ fontSize: '12px', color: '#6a6e73', marginLeft: '8px' }}>
                    Mirror to: {filter.config.backendRef.name} (Port: {filter.config.backendRef.port})
                  </div>
                )}
              </div>
            ))
          )}
        </CardBody>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Backend References ({tempRule.backendRefs.length})</CardTitle>
        </CardHeader>
        <CardBody>
          {tempRule.backendRefs.map((backendRef, index) => (
            <div key={index} style={{ marginBottom: '8px' }}>
              <strong>Backend {index + 1}:</strong> {backendRef.name} (Port: {backendRef.port}, Weight: {backendRef.weight})
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );

  const validateForm = () => {
    return name.trim() && 
           namespace.trim() && 
           parentRefs.every(ref => ref.name.trim()) &&
           rules.every(rule => rule.backendRefs.every(ref => ref.name.trim() && ref.port > 0));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log('Creating HTTPRoute:', {
        metadata: {
          name,
          namespace,
          description
        },
        spec: {
          parentRefs,
          hostnames: hostnames.filter(h => h.trim()),
          rules
        }
      });
      // Navigate back to routes page
      onBack();
    }
  };

  return (
    <>
      <PageSection variant="light">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <Button variant="plain" onClick={onBack} style={{ marginRight: '16px' }}>
            <AngleLeftIcon />
          </Button>
          <Title headingLevel="h1" size="2xl">
            Create HTTPRoute
          </Title>
        </div>
        <p style={{ color: '#6a6e73', fontSize: '14px', lineHeight: '1.5' }}>
          Create a new HTTPRoute to define routing rules for HTTP traffic to your services.
        </p>
      </PageSection>

      <PageSection>
        <Form onSubmit={handleSubmit}>
          <Grid hasGutter>
            {/* Metadata Section */}
            <GridItem span={12}>
              <Card>
                <CardHeader>
                  <CardTitle>Metadata</CardTitle>
                </CardHeader>
                <CardBody>
                  <Grid hasGutter>
                    <GridItem xl={6} lg={6} md={12}>
                      <FormGroup label="Name" isRequired fieldId="name">
                        <TextInput
                          id="name"
                          value={name}
                          onChange={(_event, value) => setName(value)}
                          placeholder="my-httproute"
                          isRequired
                        />
                        <div style={{ fontSize: '12px', color: '#6a6e73', marginTop: '4px' }}>
                          The name of this HTTPRoute resource. Must be unique within the namespace.
                        </div>
                      </FormGroup>
                    </GridItem>
                    
                    <GridItem xl={6} lg={6} md={12}>
                      <FormGroup label="Namespace" isRequired fieldId="namespace">
                        <Select
                          id="namespace"
                          selected={namespace}
                          onSelect={(_event, selection) => setNamespace(selection)}
                          isOpen={isNamespaceSelectOpen}
                          onOpenChange={(isOpen) => setIsNamespaceSelectOpen(isOpen)}
                          toggle={
                            <MenuToggle
                              onClick={() => setIsNamespaceSelectOpen(!isNamespaceSelectOpen)}
                              isExpanded={isNamespaceSelectOpen}
                            >
                              {namespace}
                            </MenuToggle>
                          }
                        >
                          {namespaceOptions.map((option, index) => (
                            <SelectOption key={index} value={option.value}>
                              {option.label}
                            </SelectOption>
                          ))}
                        </Select>
                        <div style={{ fontSize: '12px', color: '#6a6e73', marginTop: '4px' }}>
                          The namespace where the HTTPRoute will be created.
                        </div>
                      </FormGroup>
                    </GridItem>
                    
                    <GridItem span={12}>
                      <FormGroup label="Description" fieldId="description">
                        <TextArea
                          id="description"
                          value={description}
                          onChange={(_event, value) => setDescription(value)}
                          placeholder="Optional description for this HTTPRoute"
                          rows={3}
                        />
                      </FormGroup>
                    </GridItem>
                  </Grid>
                </CardBody>
              </Card>
            </GridItem>

            {/* Parent References Section */}
            <GridItem span={12}>
              <Card>
                <CardHeader>
                  <CardTitle>Parent References</CardTitle>
                </CardHeader>
                <CardBody>
                  <p style={{ color: '#6a6e73', fontSize: '14px', marginBottom: '16px' }}>
                    Specifies the Gateway(s) this route should attach to. This creates the link between the route and the entry point.
                  </p>
                  
                  {parentRefs.map((parentRef, index) => (
                    <div key={index} style={{ 
                      border: '1px solid #d2d2d2', 
                      borderRadius: '8px', 
                      padding: '16px', 
                      marginBottom: '16px',
                      backgroundColor: '#f8f9fa'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0 }}>Parent Reference {index + 1}</h4>
                        {parentRefs.length > 1 && (
                          <Button
                            variant="plain"
                            icon={<TrashIcon />}
                            onClick={() => removeParentRef(index)}
                          />
                        )}
                      </div>
                      
                      <Grid hasGutter>
                        <GridItem xl={6} lg={6} md={12}>
                          <FormGroup label="Name" isRequired>
                            <Select
                              selected={parentRef.name}
                              onSelect={(_event, selection) => updateParentRef(index, 'name', selection)}
                              isOpen={isParentRefSelectOpen[index] || false}
                              onOpenChange={(isOpen) => setIsParentRefSelectOpen({...isParentRefSelectOpen, [index]: isOpen})}
                              toggle={
                                <MenuToggle
                                  onClick={() => setIsParentRefSelectOpen({...isParentRefSelectOpen, [index]: !isParentRefSelectOpen[index]})}
                                  isExpanded={isParentRefSelectOpen[index] || false}
                                >
                                  {parentRef.name || 'Select Gateway'}
                                </MenuToggle>
                              }
                            >
                              {gatewayOptions.map((option, optIndex) => (
                                <SelectOption key={optIndex} value={option.value}>
                                  {option.label}
                                </SelectOption>
                              ))}
                            </Select>
                          </FormGroup>
                        </GridItem>
                        
                        <GridItem xl={6} lg={6} md={12}>
                          <FormGroup label="Namespace">
                            <TextInput
                              value={parentRef.namespace}
                              onChange={(_event, value) => updateParentRef(index, 'namespace', value)}
                              placeholder="default"
                            />
                          </FormGroup>
                        </GridItem>
                        
                        <GridItem xl={6} lg={6} md={12}>
                          <FormGroup label="Section Name">
                            <TextInput
                              value={parentRef.sectionName}
                              onChange={(_event, value) => updateParentRef(index, 'sectionName', value)}
                              placeholder="Optional listener name"
                            />
                          </FormGroup>
                        </GridItem>
                        
                        <GridItem xl={6} lg={6} md={12}>
                          <FormGroup label="Port">
                            <TextInput
                              type="number"
                              value={parentRef.port}
                              onChange={(_event, value) => updateParentRef(index, 'port', value)}
                              placeholder="Optional port number"
                            />
                          </FormGroup>
                        </GridItem>
                      </Grid>
                    </div>
                  ))}
                  
                  <Button variant="link" icon={<PlusIcon />} onClick={addParentRef}>
                    Add Parent Reference
                  </Button>
                </CardBody>
              </Card>
            </GridItem>

            {/* Hostnames Section */}
            <GridItem span={12}>
              <Card>
                <CardHeader>
                  <CardTitle>Hostnames</CardTitle>
                </CardHeader>
                <CardBody>
                  <p style={{ color: '#6a6e73', fontSize: '14px', marginBottom: '16px' }}>
                    A list of hostnames that this route will match. Traffic must match one of these hostnames and be received on a matching Gateway listener. Wildcards are supported (e.g., *.example.com).
                  </p>
                  
                  {hostnames.map((hostname, index) => (
                    <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'end' }}>
                      <div style={{ flex: 1 }}>
                        <TextInput
                          placeholder="example.com or *.example.com"
                          value={hostname}
                          onChange={(_event, value) => updateHostname(index, value)}
                        />
                      </div>
                      {hostnames.length > 1 && (
                        <Button
                          variant="plain"
                          icon={<TrashIcon />}
                          onClick={() => removeHostname(index)}
                        />
                      )}
                    </div>
                  ))}
                  
                  <Button variant="link" icon={<PlusIcon />} onClick={addHostname}>
                    Add Hostname
                  </Button>
                </CardBody>
              </Card>
            </GridItem>

            {/* Rules Section */}
            <GridItem span={12}>
              <Card>
                <CardHeader>
                  <CardTitle>Rules</CardTitle>
                </CardHeader>
                <CardBody>
                  <p style={{ color: '#6a6e73', fontSize: '14px', marginBottom: '16px' }}>
                    A list of rules for matching and processing requests. Requests are evaluated against rules in order. The first rule that matches is used.
                  </p>
                  
                  {rules.map((rule, ruleIndex) => (
                    <div key={ruleIndex} style={{ 
                      border: '1px solid #d2d2d2', 
                      borderRadius: '8px', 
                      padding: '16px', 
                      marginBottom: '16px',
                      backgroundColor: '#f8f9fa'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0 }}>Rule {ruleIndex + 1}</h4>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<CogIcon />}
                            onClick={() => openRulesModal(ruleIndex)}
                          >
                            Configure
                          </Button>
                          {rules.length > 1 && (
                            <Button
                              variant="plain"
                              icon={<TrashIcon />}
                              onClick={() => removeRule(ruleIndex)}
                            />
                          )}
                        </div>
                      </div>
                      
                      {/* Rule Summary */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          <div>
                            <strong>Matches:</strong> {rule.matches.length}
                            {rule.matches.map((match, index) => (
                              <div key={index} style={{ fontSize: '12px', color: '#6a6e73', marginLeft: '8px' }}>
                                • {match.path.type} {match.path.value}
                                {match.method && ` | ${match.method}`}
                              </div>
                            ))}
                          </div>
                          <div>
                            <strong>Filters:</strong> {rule.filters.length}
                            {rule.filters.map((filter, index) => (
                              <div key={index} style={{ fontSize: '12px', color: '#6a6e73', marginLeft: '8px' }}>
                                • {filter.type}
                              </div>
                            ))}
                          </div>
                          <div>
                            <strong>Backends:</strong> {rule.backendRefs.length}
                            {rule.backendRefs.map((backend, index) => (
                              <div key={index} style={{ fontSize: '12px', color: '#6a6e73', marginLeft: '8px' }}>
                                • {backend.name} (Port: {backend.port}, Weight: {backend.weight})
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="link" icon={<PlusIcon />} onClick={() => openRulesModal()}>
                    Add Rule
                  </Button>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isDisabled={!validateForm()}>
              Create HTTPRoute
            </Button>
          </div>
        </Form>
      </PageSection>

      {/* Rules Configuration Modal */}
      <Modal
        isOpen={isRulesModalOpen}
        onClose={closeRulesModal}
        variant="small"
      >
        <ModalHeader>
          <Title headingLevel="h2" size="xl">
            {editingRuleIndex !== null ? `Edit Rule ${editingRuleIndex + 1}` : 'Create New Rule'}
          </Title>
        </ModalHeader>
        <ModalBody>
          {tempRule && (
            <div>
              {/* Step Navigation */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  {['Matches', 'Filters', 'Backend References', 'Review'].map((stepName, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '4px',
                        backgroundColor: currentStep === index ? '#0066cc' : '#f0f0f0',
                        color: currentStep === index ? 'white' : '#333',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: currentStep === index ? 'bold' : 'normal'
                      }}
                      onClick={() => setCurrentStep(index)}
                    >
                      {stepName}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div style={{ minHeight: '400px' }}>
                {currentStep === 0 && renderMatchesStep()}
                {currentStep === 1 && renderFiltersStep()}
                {currentStep === 2 && renderBackendRefsStep()}
                {currentStep === 3 && renderReviewStep()}
              </div>

              {/* Step Navigation Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                <div>
                  <Button
                    variant="secondary"
                    onClick={prevStep}
                    isDisabled={currentStep === 0}
                  >
                    Back
                  </Button>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="link" onClick={closeRulesModal}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={currentStep === 3 ? saveRule : nextStep}
                    isDisabled={!tempRule}
                  >
                    {currentStep === 3 ? (editingRuleIndex !== null ? 'Save Rule' : 'Create Rule') : 'Next'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};

export default CreateHTTPRoutePage; 