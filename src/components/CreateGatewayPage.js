import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Select,
  SelectOption,
  MenuToggle,
  Grid,
  GridItem,
  Card,
  CardBody,
  Alert,
  ActionGroup,
  Divider,
  HelperText,
  HelperTextItem,
  FormHelperText,
  Label,
  Flex,
  FlexItem,
  Icon,
  Checkbox,
  Wizard,
  WizardStep,
  WizardFooter,
  Modal
} from '@patternfly/react-core';
import {
  PlusIcon,
  TrashIcon,
  InfoCircleIcon
} from '@patternfly/react-icons';

const CreateGatewayPage = ({ onBack, onCancel }) => {
  // Basic information state
  const [gatewayName, setGatewayName] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [gatewayClassName, setGatewayClassName] = useState('istio');
  const [description, setDescription] = useState('');
  
  // Gateway class options
  const [isGatewayClassOpen, setIsGatewayClassOpen] = useState(false);
  const gatewayClassOptions = [
    { value: 'istio', label: 'istio' },
    { value: 'envoy', label: 'envoy' },
    { value: 'nginx', label: 'nginx' },
    { value: 'kong', label: 'kong' }
  ];

  // Namespace options
  const [isNamespaceOpen, setIsNamespaceOpen] = useState(false);
  const namespaceOptions = [
    { value: 'default', label: 'default' },
    { value: 'api-gateway-prod', label: 'api-gateway-prod' },
    { value: 'ai-gateway-prod', label: 'ai-gateway-prod' },
    { value: 'kube-system', label: 'kube-system' }
  ];

  // Protocol select state
  const [protocolSelectStates, setProtocolSelectStates] = useState({});
  const [tlsModeSelectStates, setTlsModeSelectStates] = useState({});

  // Listeners state
  const [listeners, setListeners] = useState([
    {
      name: 'default',
      protocol: 'HTTP',
      port: 80,
      hostname: '*.example.com',
      tls: {
        mode: 'Terminate',
        certificateRefs: [{ name: '', namespace: '', kind: 'Secret' }],
        options: [{ key: '', value: '' }]
      },
      allowedRoutes: {
        namespaces: { from: 'Same' },
        namespaceSelector: [{ key: '', value: '' }],
        kinds: [{ group: 'gateway.networking.k8s.io', kind: 'HTTPRoute' }]
      }
    }
  ]);

  // Wizard state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingListenerIndex, setEditingListenerIndex] = useState(null);
  const [wizardListener, setWizardListener] = useState({
    name: '',
    protocol: 'HTTP',
    port: 80,
    hostname: '',
    tls: {
      mode: 'Terminate',
      certificateRefs: [{ name: '', namespace: '', kind: 'Secret' }],
      options: [{ key: '', value: '' }]
    },
    allowedRoutes: {
      namespaces: { from: 'Same' },
      namespaceSelector: [{ key: '', value: '' }],
      kinds: [{ group: 'gateway.networking.k8s.io', kind: 'HTTPRoute' }]
    }
  });

  // Labels and annotations
  const [labels, setLabels] = useState([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState([{ key: '', value: '' }]);

  // Advanced settings
  const [enableMetrics, setEnableMetrics] = useState(true);
  const [enableTracing, setEnableTracing] = useState(false);
  const [enableLogging, setEnableLogging] = useState(true);

  // Validation state
  const [validationErrors, setValidationErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  // Wizard functions
  const openWizardForNewListener = () => {
    setEditingListenerIndex(null);
    setWizardListener({
      name: `listener-${listeners.length + 1}`,
      protocol: 'HTTP',
      port: 80,
      hostname: '',
      tls: {
        mode: 'Terminate',
        certificateRefs: [{ name: '', namespace: '', kind: 'Secret' }],
        options: [{ key: '', value: '' }]
      },
      allowedRoutes: {
        namespaces: { from: 'Same' },
        namespaceSelector: [{ key: '', value: '' }],
        kinds: [{ group: 'gateway.networking.k8s.io', kind: 'HTTPRoute' }]
      }
    });
    setIsWizardOpen(true);
  };

  const openWizardForEditListener = (index) => {
    setEditingListenerIndex(index);
    setWizardListener({ ...listeners[index] });
    setIsWizardOpen(true);
  };

  const closeWizard = () => {
    setIsWizardOpen(false);
    setEditingListenerIndex(null);
  };

  const saveListener = () => {
    if (editingListenerIndex !== null) {
      // Edit existing listener
      const updatedListeners = [...listeners];
      updatedListeners[editingListenerIndex] = { ...wizardListener };
      setListeners(updatedListeners);
    } else {
      // Add new listener
      setListeners([...listeners, { ...wizardListener }]);
    }
    closeWizard();
  };

  const removeListener = (index) => {
    setListeners(listeners.filter((_, i) => i !== index));
  };

  // Wizard helper functions
  const updateWizardListener = (field, value) => {
    setWizardListener({ ...wizardListener, [field]: value });
  };

  const updateWizardListenerTLS = (field, value) => {
    setWizardListener({
      ...wizardListener,
      tls: { ...wizardListener.tls, [field]: value }
    });
  };

  const updateWizardListenerAllowedRoutes = (field, value) => {
    setWizardListener({
      ...wizardListener,
      allowedRoutes: { ...wizardListener.allowedRoutes, [field]: value }
    });
  };

  // Wizard step components
  const renderBasicConfigStep = () => (
    <Grid hasGutter>
      <GridItem xl={6} lg={6} md={12}>
        <FormGroup label="Listener Name" isRequired fieldId="wizard-listener-name">
          <TextInput
            id="wizard-listener-name"
            value={wizardListener.name}
            onChange={(_event, value) => updateWizardListener('name', value)}
            placeholder="unique-listener-name"
          />
          <FormHelperText>
            <HelperText>
              <HelperTextItem>
                A unique name for this listener within the Gateway
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>
      </GridItem>
      
      <GridItem xl={6} lg={6} md={12}>
        <FormGroup label="Port Number" isRequired fieldId="wizard-listener-port">
          <TextInput
            id="wizard-listener-port"
            type="number"
            value={wizardListener.port}
            onChange={(_event, value) => updateWizardListener('port', parseInt(value) || '')}
            min={1}
            max={65535}
            placeholder="80"
          />
          <FormHelperText>
            <HelperText>
              <HelperTextItem>
                Port number to listen on (1-65535)
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>
      </GridItem>
      
      <GridItem xl={6} lg={6} md={12}>
        <FormGroup label="Hostname" fieldId="wizard-listener-hostname">
          <TextInput
            id="wizard-listener-hostname"
            value={wizardListener.hostname}
            onChange={(_event, value) => updateWizardListener('hostname', value)}
            placeholder="*.example.com"
          />
          <FormHelperText>
            <HelperText>
              <HelperTextItem>
                Hostname to match traffic. Wildcards allowed. Leave blank to match all hostnames.
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>
      </GridItem>
    </Grid>
  );

  const renderProtocolAndSecurityStep = () => {
    const isTLSRequired = wizardListener.protocol === 'HTTPS' || wizardListener.protocol === 'TLS';

    return (
      <div>
        {/* Protocol Selection */}
        <div style={{ marginBottom: '32px' }}>
          <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>
            Network Protocol
          </Title>
          
          <Grid hasGutter>
            <GridItem xl={6} lg={6} md={12}>
              <FormGroup label="Protocol" isRequired fieldId="wizard-listener-protocol">
                <Select
                  id="wizard-listener-protocol"
                  isOpen={protocolSelectStates['wizard-protocol'] || false}
                  selected={wizardListener.protocol}
                  onSelect={(_event, selection) => {
                    updateWizardListener('protocol', selection);
                    setProtocolSelectStates({
                      ...protocolSelectStates,
                      'wizard-protocol': false
                    });
                  }}
                  onOpenChange={(isOpen) => {
                    setProtocolSelectStates({
                      ...protocolSelectStates,
                      'wizard-protocol': isOpen
                    });
                  }}
                  toggle={
                    <MenuToggle 
                      onClick={() => {
                        setProtocolSelectStates({
                          ...protocolSelectStates,
                          'wizard-protocol': !protocolSelectStates['wizard-protocol']
                        });
                      }}
                      isExpanded={protocolSelectStates['wizard-protocol'] || false}
                    >
                      {wizardListener.protocol}
                    </MenuToggle>
                  }
                >
                  <SelectOption value="HTTP">HTTP</SelectOption>
                  <SelectOption value="HTTPS">HTTPS</SelectOption>
                  <SelectOption value="TLS">TLS</SelectOption>
                  <SelectOption value="TCP">TCP</SelectOption>
                  <SelectOption value="UDP">UDP</SelectOption>
                </Select>
              </FormGroup>
            </GridItem>
          </Grid>
        </div>

        {/* TLS Configuration - Only show when needed */}
        {isTLSRequired && (
          <div style={{ marginBottom: '32px' }}>
            <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>
              TLS Configuration
            </Title>

            <Grid hasGutter>
              <GridItem xl={6} lg={6} md={12}>
                <FormGroup label="TLS Mode" isRequired fieldId="wizard-tls-mode">
                  <Select
                    id="wizard-tls-mode"
                    isOpen={tlsModeSelectStates['wizard-tls-mode'] || false}
                    selected={wizardListener.tls.mode}
                    onSelect={(_event, selection) => {
                      updateWizardListenerTLS('mode', selection);
                      setTlsModeSelectStates({
                        ...tlsModeSelectStates,
                        'wizard-tls-mode': false
                      });
                    }}
                    onOpenChange={(isOpen) => {
                      setTlsModeSelectStates({
                        ...tlsModeSelectStates,
                        'wizard-tls-mode': isOpen
                      });
                    }}
                    toggle={
                      <MenuToggle 
                        onClick={() => {
                          setTlsModeSelectStates({
                            ...tlsModeSelectStates,
                            'wizard-tls-mode': !tlsModeSelectStates['wizard-tls-mode']
                          });
                        }}
                        isExpanded={tlsModeSelectStates['wizard-tls-mode'] || false}
                      >
                        {wizardListener.tls.mode}
                      </MenuToggle>
                    }
                  >
                    <SelectOption value="Terminate">Terminate</SelectOption>
                    <SelectOption value="Passthrough">Passthrough</SelectOption>
                  </Select>
                </FormGroup>
              </GridItem>
              
              {wizardListener.tls.mode === 'Terminate' && (
                <GridItem span={12}>
                  <FormGroup label="Certificate References" fieldId="wizard-cert-refs">
                    {wizardListener.tls.certificateRefs.map((cert, certIndex) => (
                      <div key={certIndex} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'end' }}>
                        <div style={{ flex: 1 }}>
                          <TextInput
                            placeholder="Certificate name"
                            value={cert.name}
                            onChange={(_event, value) => {
                              const updatedCerts = [...wizardListener.tls.certificateRefs];
                              updatedCerts[certIndex] = { ...cert, name: value };
                              updateWizardListenerTLS('certificateRefs', updatedCerts);
                            }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <TextInput
                            placeholder="Namespace (optional)"
                            value={cert.namespace}
                            onChange={(_event, value) => {
                              const updatedCerts = [...wizardListener.tls.certificateRefs];
                              updatedCerts[certIndex] = { ...cert, namespace: value };
                              updateWizardListenerTLS('certificateRefs', updatedCerts);
                            }}
                          />
                        </div>
                        <Button
                          variant="plain"
                          icon={<TrashIcon />}
                          onClick={() => {
                            const updatedCerts = wizardListener.tls.certificateRefs.filter((_, i) => i !== certIndex);
                            updateWizardListenerTLS('certificateRefs', updatedCerts);
                          }}
                          isDisabled={wizardListener.tls.certificateRefs.length === 1}
                        />
                      </div>
                    ))}
                    <Button
                      variant="link"
                      icon={<PlusIcon />}
                      onClick={() => {
                        const updatedCerts = [...wizardListener.tls.certificateRefs, { name: '', namespace: '', kind: 'Secret' }];
                        updateWizardListenerTLS('certificateRefs', updatedCerts);
                      }}
                    >
                      Add Certificate
                    </Button>
                  </FormGroup>
                </GridItem>
              )}
            </Grid>
          </div>
        )}
      </div>
    );
  };

  const renderAllowedRoutesStep = () => (
    <Grid hasGutter>
      <GridItem span={12}>
        <Alert 
          variant="info" 
          isInline 
          title="Configure which routes can attach to this listener"
          style={{ marginBottom: '24px' }}
        />
      </GridItem>
      
      <GridItem xl={6} lg={6} md={12}>
        <FormGroup label="Allowed Namespaces" fieldId="wizard-allowed-namespaces">
          <Select
            id="wizard-allowed-namespaces"
            isOpen={false}
            selected={wizardListener.allowedRoutes.namespaces.from}
            onSelect={(_event, selection) => {
              updateWizardListenerAllowedRoutes('namespaces', { 
                ...wizardListener.allowedRoutes.namespaces, 
                from: selection 
              });
            }}
            toggle={
              <MenuToggle>
                {wizardListener.allowedRoutes.namespaces.from}
              </MenuToggle>
            }
          >
            <SelectOption value="All">All Namespaces</SelectOption>
            <SelectOption value="Same">Same Namespace</SelectOption>
            <SelectOption value="Selector">Selected Namespaces</SelectOption>
          </Select>
          <FormHelperText>
            <HelperText>
              <HelperTextItem>
                Controls which namespaces can attach routes to this listener
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>
      </GridItem>
      
      <GridItem span={12}>
        <FormGroup label="Allowed Route Kinds" fieldId="wizard-allowed-kinds">
          {wizardListener.allowedRoutes.kinds.map((kind, kindIndex) => (
            <div key={kindIndex} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'end' }}>
              <div style={{ flex: 1 }}>
                <TextInput
                  placeholder="Group (e.g., gateway.networking.k8s.io)"
                  value={kind.group}
                  onChange={(_event, value) => {
                    const updatedKinds = [...wizardListener.allowedRoutes.kinds];
                    updatedKinds[kindIndex] = { ...kind, group: value };
                    updateWizardListenerAllowedRoutes('kinds', updatedKinds);
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <TextInput
                  placeholder="Kind (e.g., HTTPRoute)"
                  value={kind.kind}
                  onChange={(_event, value) => {
                    const updatedKinds = [...wizardListener.allowedRoutes.kinds];
                    updatedKinds[kindIndex] = { ...kind, kind: value };
                    updateWizardListenerAllowedRoutes('kinds', updatedKinds);
                  }}
                />
              </div>
              <Button
                variant="plain"
                icon={<TrashIcon />}
                onClick={() => {
                  const updatedKinds = wizardListener.allowedRoutes.kinds.filter((_, i) => i !== kindIndex);
                  updateWizardListenerAllowedRoutes('kinds', updatedKinds);
                }}
                isDisabled={wizardListener.allowedRoutes.kinds.length === 1}
              />
            </div>
          ))}
          <Button
            variant="link"
            icon={<PlusIcon />}
            onClick={() => {
              const updatedKinds = [...wizardListener.allowedRoutes.kinds, { group: 'gateway.networking.k8s.io', kind: 'HTTPRoute' }];
              updateWizardListenerAllowedRoutes('kinds', updatedKinds);
            }}
          >
            Add Route Kind
          </Button>
        </FormGroup>
      </GridItem>
    </Grid>
  );

  const renderReviewStep = () => (
    <div>
      <Title headingLevel="h3" size="lg" style={{ marginBottom: '24px' }}>
        Review Listener Configuration
      </Title>
      
      <Card>
        <CardBody>
          <Grid hasGutter>
            <GridItem xl={6} lg={6} md={12}>
              <div style={{ marginBottom: '16px' }}>
                <strong>Listener Name:</strong> {wizardListener.name}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Protocol:</strong> {wizardListener.protocol}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Port:</strong> {wizardListener.port}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Hostname:</strong> {wizardListener.hostname || 'All hostnames'}
              </div>
            </GridItem>
            
            <GridItem xl={6} lg={6} md={12}>
              {(wizardListener.protocol === 'HTTPS' || wizardListener.protocol === 'TLS') && (
                <div style={{ marginBottom: '16px' }}>
                  <strong>TLS Mode:</strong> {wizardListener.tls.mode}
                  {wizardListener.tls.mode === 'Terminate' && wizardListener.tls.certificateRefs.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <strong>Certificates:</strong>
                      <ul style={{ marginTop: '4px', paddingLeft: '20px' }}>
                        {wizardListener.tls.certificateRefs
                          .filter(cert => cert.name.trim())
                          .map((cert, index) => (
                            <li key={index}>
                              {cert.name} {cert.namespace && `(${cert.namespace})`}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                  {wizardListener.tls.options && wizardListener.tls.options.length > 0 && 
                   wizardListener.tls.options.some(option => option.key.trim() && option.value.trim()) && (
                    <div style={{ marginTop: '8px' }}>
                      <strong>TLS Options:</strong>
                      <ul style={{ marginTop: '4px', paddingLeft: '20px' }}>
                        {wizardListener.tls.options
                          .filter(option => option.key.trim() && option.value.trim())
                          .map((option, index) => (
                            <li key={index}>
                              {option.key}: {option.value}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              <div style={{ marginBottom: '16px' }}>
                <strong>Allowed Namespaces:</strong> {wizardListener.allowedRoutes.namespaces.from}
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <strong>Allowed Route Kinds:</strong>
                <ul style={{ marginTop: '4px', paddingLeft: '20px' }}>
                  {wizardListener.allowedRoutes.kinds
                    .filter(kind => kind.kind && kind.group)
                    .map((kind, index) => (
                      <li key={index}>{kind.group}/{kind.kind}</li>
                    ))}
                </ul>
              </div>
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
    </div>
  );

  // Helper functions for labels and annotations
  const addLabelOrAnnotation = (type) => {
    if (type === 'labels') {
      setLabels([...labels, { key: '', value: '' }]);
    } else {
      setAnnotations([...annotations, { key: '', value: '' }]);
    }
  };

  const removeLabelOrAnnotation = (type, index) => {
    if (type === 'labels') {
      setLabels(labels.filter((_, i) => i !== index));
    } else {
      setAnnotations(annotations.filter((_, i) => i !== index));
    }
  };

  const updateLabelOrAnnotation = (type, index, field, value) => {
    if (type === 'labels') {
      const updated = [...labels];
      updated[index][field] = value;
      setLabels(updated);
    } else {
      const updated = [...annotations];
      updated[index][field] = value;
      setAnnotations(updated);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!gatewayName.trim()) {
      errors.gatewayName = 'Gateway name is required';
    } else if (!/^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(gatewayName)) {
      errors.gatewayName = 'Gateway name must be a valid DNS-1123 label';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateYAML = () => {
    const gatewayConfig = {
      apiVersion: 'gateway.networking.k8s.io/v1beta1',
      kind: 'Gateway',
      metadata: {
        name: gatewayName,
        namespace: namespace,
        labels: labels.reduce((acc, label) => {
          if (label.key && label.value) {
            acc[label.key] = label.value;
          }
          return acc;
        }, {}),
        annotations: annotations.reduce((acc, annotation) => {
          if (annotation.key && annotation.value) {
            acc[annotation.key] = annotation.value;
          }
          return acc;
        }, {})
      },
      spec: {
        gatewayClassName: gatewayClassName,
        listeners: listeners.map(listener => {
          const listenerSpec = {
            name: listener.name,
            port: parseInt(listener.port),
            protocol: listener.protocol
          };
          
          if (listener.hostname && listener.hostname.trim()) {
            listenerSpec.hostname = listener.hostname;
          }
          
          if (listener.protocol === 'HTTPS' || listener.protocol === 'TLS') {
            listenerSpec.tls = {
              mode: listener.tls.mode
            };
            
            if (listener.tls.mode === 'Terminate' && listener.tls.certificateRefs.length > 0) {
              listenerSpec.tls.certificateRefs = listener.tls.certificateRefs
                .filter(ref => ref.name.trim())
                .map(ref => {
                  const certRef = { name: ref.name, kind: ref.kind || 'Secret' };
                  if (ref.namespace && ref.namespace.trim()) {
                    certRef.namespace = ref.namespace;
                  }
                  return certRef;
                });
            }
            
            // Add TLS options if any
            if (listener.tls.options && listener.tls.options.length > 0) {
              const tlsOptions = listener.tls.options
                .filter(option => option.key.trim() && option.value.trim())
                .reduce((acc, option) => {
                  acc[option.key] = option.value;
                  return acc;
                }, {});
              
              if (Object.keys(tlsOptions).length > 0) {
                listenerSpec.tls.options = tlsOptions;
              }
            }
          }
          
          if (listener.allowedRoutes) {
            const allowedRoutes = {};
            
            if (listener.allowedRoutes.namespaces) {
              allowedRoutes.namespaces = { from: listener.allowedRoutes.namespaces.from };
            }
            
            if (listener.allowedRoutes.kinds && listener.allowedRoutes.kinds.length > 0) {
              allowedRoutes.kinds = listener.allowedRoutes.kinds
                .filter(kind => kind.kind && kind.group)
                .map(kind => ({
                  group: kind.group,
                  kind: kind.kind
                }));
            }
            
            if (Object.keys(allowedRoutes).length > 0) {
              listenerSpec.allowedRoutes = allowedRoutes;
            }
          }
          
          return listenerSpec;
        })
      }
    };

    return gatewayConfig;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      setShowAlert(true);
      return;
    }

    const gatewayConfig = generateYAML();
    console.log('Gateway configuration:', gatewayConfig);
    alert('Gateway created successfully! (In a real implementation, this would submit to the API)');
    onBack();
  };

  return (
    <>
      {/* Listener Configuration Wizard */}
      <Modal
        isOpen={isWizardOpen}
        onClose={closeWizard}
        variant="small"
        title={editingListenerIndex !== null ? 'Edit Listener' : 'Add New Listener'}
      >
        <Wizard
          titleId="listener-wizard"
          descriptionId="listener-wizard-description"
          onClose={closeWizard}
          footer={
            <WizardFooter>
              <Button variant="primary" type="submit" onClick={saveListener}>
                {editingListenerIndex !== null ? 'Update Listener' : 'Add Listener'}
              </Button>
              <Button variant="secondary" onClick={closeWizard}>
                Cancel
              </Button>
            </WizardFooter>
          }
        >
          <WizardStep
            name="Basic Configuration"
            id="basic-config-step"
            isDisabled={false}
          >
            <div>
              <Title headingLevel="h2" size="lg" style={{ marginBottom: '24px' }}>
                Basic Listener Configuration
              </Title>
              <p style={{ marginBottom: '24px', color: '#6a6e73' }}>
                Configure the basic settings for your listener including name, port, and hostname.
              </p>
              {renderBasicConfigStep()}
            </div>
          </WizardStep>
          
          <WizardStep
            name="Protocol & Security"
            id="protocol-security-step"
            isDisabled={false}
          >
            <div>
              <Title headingLevel="h2" size="lg" style={{ marginBottom: '24px' }}>
                Protocol & Security
              </Title>
              <p style={{ marginBottom: '24px', color: '#6a6e73' }}>
                Configure the network protocol and security settings for your listener.
              </p>
              {renderProtocolAndSecurityStep()}
            </div>
          </WizardStep>
          
          <WizardStep
            name="Allowed Routes"
            id="allowed-routes-step"
            isDisabled={false}
          >
            <div>
              <Title headingLevel="h2" size="lg" style={{ marginBottom: '24px' }}>
                Allowed Routes Configuration
              </Title>
              <p style={{ marginBottom: '24px', color: '#6a6e73' }}>
                Configure which routes can attach to this listener and from which namespaces.
              </p>
              {renderAllowedRoutesStep()}
            </div>
          </WizardStep>
          
          <WizardStep
            name="Review"
            id="review-step"
            isDisabled={false}
          >
            <div>
              {renderReviewStep()}
            </div>
          </WizardStep>
        </Wizard>
      </Modal>

      <PageSection variant="light">
        <Breadcrumb>
          <BreadcrumbItem>
            <Button variant="link" onClick={onBack}>
              Gateways
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem>Create Gateway</BreadcrumbItem>
        </Breadcrumb>
        
        <Title headingLevel="h1" size="2xl" style={{ marginTop: '16px' }}>
          Create Gateway
        </Title>
      </PageSection>
      
      <PageSection>
        {showAlert && (
          <Alert
            variant="danger"
            title="Validation Error"
            style={{ marginBottom: '24px' }}
            actionClose={<Button variant="plain" onClick={() => setShowAlert(false)} />}
          >
            Please fix the validation errors before proceeding.
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Grid hasGutter>
            {/* Basic Information */}
            <GridItem span={12}>
              <Card>
                <CardBody>
                  <Title headingLevel="h2" size="lg" style={{ marginBottom: '24px' }}>
                    Basic Information
                  </Title>
                  
                  <Grid hasGutter>
                    <GridItem xl={6} lg={6} md={12}>
                      <FormGroup label="Gateway Name" isRequired fieldId="gateway-name">
                        <TextInput
                          isRequired
                          type="text"
                          id="gateway-name"
                          name="gateway-name"
                          value={gatewayName}
                          onChange={(_event, value) => setGatewayName(value)}
                          validated={validationErrors.gatewayName ? 'error' : 'default'}
                        />
                        <FormHelperText>
                          <HelperText>
                            <HelperTextItem>
                              Must be a valid DNS-1123 label (lowercase alphanumeric characters or '-')
                            </HelperTextItem>
                          </HelperText>
                        </FormHelperText>
                      </FormGroup>
                    </GridItem>
                    
                    <GridItem xl={6} lg={6} md={12}>
                      <FormGroup label="Namespace" isRequired fieldId="namespace">
                        <Select
                          id="namespace"
                          isOpen={isNamespaceOpen}
                          selected={namespace}
                          onSelect={(_event, selection) => {
                            setNamespace(selection);
                            setIsNamespaceOpen(false);
                          }}
                          onOpenChange={(isOpen) => setIsNamespaceOpen(isOpen)}
                          toggle={
                            <MenuToggle onClick={() => setIsNamespaceOpen(!isNamespaceOpen)}>
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
                      </FormGroup>
                    </GridItem>
                    
                    <GridItem xl={6} lg={6} md={12}>
                      <FormGroup label="Gateway Class" isRequired fieldId="gateway-class">
                        <Select
                          id="gateway-class"
                          isOpen={isGatewayClassOpen}
                          selected={gatewayClassName}
                          onSelect={(_event, selection) => {
                            setGatewayClassName(selection);
                            setIsGatewayClassOpen(false);
                          }}
                          onOpenChange={(isOpen) => setIsGatewayClassOpen(isOpen)}
                          toggle={
                            <MenuToggle onClick={() => setIsGatewayClassOpen(!isGatewayClassOpen)}>
                              {gatewayClassName}
                            </MenuToggle>
                          }
                        >
                          {gatewayClassOptions.map((option, index) => (
                            <SelectOption key={index} value={option.value}>
                              {option.label}
                            </SelectOption>
                          ))}
                        </Select>
                      </FormGroup>
                    </GridItem>
                    
                    <GridItem span={12}>
                      <FormGroup label="Description" fieldId="description">
                        <TextArea
                          id="description"
                          name="description"
                          value={description}
                          onChange={(_event, value) => setDescription(value)}
                          placeholder="Optional description for this gateway"
                          rows={3}
                        />
                      </FormGroup>
                    </GridItem>
                  </Grid>
                </CardBody>
              </Card>
            </GridItem>

            {/* Listeners Configuration - Simplified with Wizard */}
            <GridItem span={12}>
              <Card>
                <CardBody>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <Title headingLevel="h2" size="lg">
                      Listeners
                    </Title>
                    <Button variant="primary" icon={<PlusIcon />} onClick={openWizardForNewListener}>
                      Add Listener
                    </Button>
                  </div>
                  
                  {listeners.length === 0 ? (
                    <Alert variant="info" title="No listeners configured">
                      Click "Add Listener" to create your first listener. Each listener defines a port and protocol for your gateway.
                    </Alert>
                  ) : (
                    <div>
                      {listeners.map((listener, index) => (
                        <Card key={index} style={{ marginBottom: '16px', border: '1px solid #d2d2d2' }}>
                          <CardBody>
                            <Grid hasGutter>
                              <GridItem xl={2} lg={3} md={4} sm={6}>
                                <div>
                                  <Label color="blue" variant="outline" isCompact style={{ marginBottom: '4px' }}>
                                    Name
                                  </Label>
                                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{listener.name}</div>
                                </div>
                              </GridItem>
                              
                              <GridItem xl={2} lg={3} md={4} sm={6}>
                                <div>
                                  <Label color="green" variant="outline" isCompact style={{ marginBottom: '4px' }}>
                                    Protocol
                                  </Label>
                                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{listener.protocol}</div>
                                </div>
                              </GridItem>
                              
                              <GridItem xl={2} lg={3} md={4} sm={6}>
                                <div>
                                  <Label color="orange" variant="outline" isCompact style={{ marginBottom: '4px' }}>
                                    Port
                                  </Label>
                                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{listener.port}</div>
                                </div>
                              </GridItem>
                              
                              <GridItem xl={3} lg={3} md={4} sm={6}>
                                <div>
                                  <Label color="purple" variant="outline" isCompact style={{ marginBottom: '4px' }}>
                                    Hostname
                                  </Label>
                                  <div style={{ fontWeight: '500', fontSize: '14px' }}>
                                    {listener.hostname || 'All hostnames'}
                                  </div>
                                </div>
                              </GridItem>
                              
                              <GridItem xl={3} lg={12} md={12} sm={12}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                  {(listener.protocol === 'HTTPS' || listener.protocol === 'TLS') && (
                                    <Label color="cyan" variant="filled" isCompact>
                                      TLS Enabled
                                    </Label>
                                  )}
                                  <Button 
                                    variant="secondary" 
                                    size="sm"
                                    onClick={() => openWizardForEditListener(index)}
                                  >
                                    Edit
                                  </Button>
                                  {listeners.length > 1 && (
                                    <Button
                                      variant="plain"
                                      size="sm"
                                      icon={<TrashIcon />}
                                      onClick={() => removeListener(index)}
                                      aria-label={`Remove listener ${listener.name}`}
                                    />
                                  )}
                                </div>
                              </GridItem>
                            </Grid>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </GridItem>

            {/* Labels and Annotations */}
            <GridItem span={12}>
              <Card>
                <CardBody>
                  <Title headingLevel="h2" size="lg" style={{ marginBottom: '24px' }}>
                    Labels and Annotations
                  </Title>
                  
                  <Grid hasGutter>
                    <GridItem xl={6} lg={6} md={12}>
                      <FormGroup label="Labels" fieldId="labels">
                        {labels.map((label, index) => (
                          <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'end' }}>
                            <div style={{ flex: 1 }}>
                              <TextInput
                                placeholder="Key"
                                value={label.key}
                                onChange={(_event, value) => updateLabelOrAnnotation('labels', index, 'key', value)}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <TextInput
                                placeholder="Value"
                                value={label.value}
                                onChange={(_event, value) => updateLabelOrAnnotation('labels', index, 'value', value)}
                              />
                            </div>
                            <Button
                              variant="plain"
                              icon={<TrashIcon />}
                              onClick={() => removeLabelOrAnnotation('labels', index)}
                              isDisabled={labels.length === 1}
                            />
                          </div>
                        ))}
                        <Button
                          variant="link"
                          icon={<PlusIcon />}
                          onClick={() => addLabelOrAnnotation('labels')}
                        >
                          Add Label
                        </Button>
                      </FormGroup>
                    </GridItem>
                    
                    <GridItem xl={6} lg={6} md={12}>
                      <FormGroup label="Annotations" fieldId="annotations">
                        {annotations.map((annotation, index) => (
                          <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'end' }}>
                            <div style={{ flex: 1 }}>
                              <TextInput
                                placeholder="Key"
                                value={annotation.key}
                                onChange={(_event, value) => updateLabelOrAnnotation('annotations', index, 'key', value)}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <TextInput
                                placeholder="Value"
                                value={annotation.value}
                                onChange={(_event, value) => updateLabelOrAnnotation('annotations', index, 'value', value)}
                              />
                            </div>
                            <Button
                              variant="plain"
                              icon={<TrashIcon />}
                              onClick={() => removeLabelOrAnnotation('annotations', index)}
                              isDisabled={annotations.length === 1}
                            />
                          </div>
                        ))}
                        <Button
                          variant="link"
                          icon={<PlusIcon />}
                          onClick={() => addLabelOrAnnotation('annotations')}
                        >
                          Add Annotation
                        </Button>
                      </FormGroup>
                    </GridItem>
                  </Grid>
                </CardBody>
              </Card>
            </GridItem>

            {/* Advanced Settings */}
            <GridItem span={12}>
              <Card>
                <CardBody>
                  <Title headingLevel="h2" size="lg" style={{ marginBottom: '24px' }}>
                    Advanced Settings
                  </Title>
                  
                  <div>
                    <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
                      <FlexItem>
                        <Checkbox
                          id="enable-metrics"
                          label="Enable Metrics Collection"
                          isChecked={enableMetrics}
                          onChange={(_event, checked) => setEnableMetrics(checked)}
                          description="Enable Prometheus metrics collection for this gateway"
                        />
                      </FlexItem>
                      <FlexItem>
                        <Checkbox
                          id="enable-tracing"
                          label="Enable Distributed Tracing"
                          isChecked={enableTracing}
                          onChange={(_event, checked) => setEnableTracing(checked)}
                          description="Enable OpenTelemetry tracing for requests"
                        />
                      </FlexItem>
                      <FlexItem>
                        <Checkbox
                          id="enable-logging"
                          label="Enable Access Logging"
                          isChecked={enableLogging}
                          onChange={(_event, checked) => setEnableLogging(checked)}
                          description="Log all requests passing through this gateway"
                        />
                      </FlexItem>
                    </Flex>
                  </div>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          <Divider style={{ margin: '32px 0' }} />

          <ActionGroup>
            <Button variant="primary" type="submit">
              Create Gateway
            </Button>
            <Button variant="secondary" onClick={onBack}>
              Cancel
            </Button>
          </ActionGroup>
        </Form>
      </PageSection>
    </>
  );
};

export default CreateGatewayPage; 