import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Tabs,
  Tab,
  TabTitleText,
  Breadcrumb,
  BreadcrumbItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  CodeBlock,
  CodeBlockCode,
  Flex,
  FlexItem,
  Button,
  Grid,
  GridItem,
  Label,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Divider
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@patternfly/react-table';

const API_DETAILS = {
  'Order Service': {
    description: 'Manages order lifecycle including creation, updates, and fulfillment. Supports cart operations, checkout, and order history for e-commerce and internal order flows.',
    url: 'https://xx.com/order_service/v1',
    version: 'v1.1',
    inputLabel: 'Accepts JSON payloads with order items, shipping address, and payment reference. Required fields: customerId, items[].productId, items[].quantity.'
  },
  'User Authentication': {
    description: 'Handles user sign-in, sign-out, token refresh, and session management. Integrates with identity providers and supports OAuth2 and API key authentication.',
    url: 'https://xx.com/auth/v2',
    version: 'v2.0',
    inputLabel: 'Expects credentials (username/password or token). Optional scope parameter for OAuth. Returns JWT or session cookie.'
  },
  'Payment Gateway': {
    description: 'Processes payments, refunds, and payouts. Supports multiple payment methods and currencies. Provides idempotent transaction handling and webhook notifications.',
    url: 'https://xx.com/payments/v1',
    version: 'v1.3',
    inputLabel: 'Request body: amount, currency, method (card, bank, etc.), idempotencyKey. Returns transaction id and status.'
  },
  'Product Catalog': {
    description: 'Serves product information, pricing, availability, and search. Used by storefronts and internal tools for catalog browsing and product lookup.',
    url: 'https://xx.com/catalog/v1',
    version: 'v1.2',
    inputLabel: 'Query params: category, search, page, limit. Optional filters for price range and attributes.'
  },
  'Inventory Management': {
    description: 'Tracks stock levels, reservations, and movements across warehouses. Supports real-time availability checks and low-stock alerts.',
    url: 'https://xx.com/inventory/v1',
    version: 'v1.0',
    inputLabel: 'POST body: sku, quantity, locationId, operation (reserve, release, adjust). Returns updated stock and reservation id.'
  },
  'Notification Service': {
    description: 'Sends email, SMS, and in-app notifications. Supports templates, scheduling, and delivery status callbacks.',
    url: 'https://xx.com/notifications/v1',
    version: 'v1.1',
    inputLabel: 'JSON: channel (email|sms|push), recipient, templateId or body, optional metadata and schedule.'
  },
  'Analytics Events': {
    description: 'Ingests and queries analytics events for dashboards and reporting. Supports custom dimensions and real-time streaming.',
    url: 'https://xx.com/analytics/v1',
    version: 'v1.0',
    inputLabel: 'Event payload: eventName, timestamp, properties (key-value). Optional userId and sessionId for attribution.'
  },
  'Customer Profile': {
    description: 'CRUD for customer profiles, preferences, and segments. Used by marketing and support systems for personalization.',
    url: 'https://xx.com/customers/v1',
    version: 'v1.2',
    inputLabel: 'GET by id or query. POST/PATCH: name, email, attributes, preferences. Returns profile with computed segment.'
  },
  'Shipping & Fulfillment': {
    description: 'Calculates shipping rates, creates shipments, and tracks delivery status. Integrates with carriers and returns management.',
    url: 'https://xx.com/shipping/v1',
    version: 'v1.0',
    inputLabel: 'Input: origin/destination, weight, dimensions, service level. Returns rates and label or tracking number.'
  },
  'Billing & Invoicing': {
    description: 'Generates invoices, applies taxes, and records payments. Supports recurring billing and multi-currency.',
    url: 'https://xx.com/billing/v1',
    version: 'v1.1',
    inputLabel: 'Request: accountId, lineItems, dueDate, currency. Optional taxCode and paymentTerms. Returns invoice id and PDF link.'
  }
};

// API product tab: product name, description, core details, tiers, contact, docs
const getApiProductDetails = (apiName) => {
  const slug = apiName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
  const baseDetails = API_DETAILS[apiName];
  return {
    productName: apiName,
    description: baseDetails?.description || `API for ${apiName}. Use this service to integrate with related capabilities.`,
    lifecycle: 'production',
    api: slug + '-api',
    version: 'v1',
    route: slug + '-route',
    namespace: 'default',
    tags: ['ecommerce', 'retail'],
    tiers: [
      { tier: 'gold', rateLimit: '1000 per daily' },
      { tier: 'silver', rateLimit: '500 per daily' },
      { tier: 'bronze', rateLimit: '100 per daily' }
    ],
    contactTeam: 'platform-team',
    contactEmail: 'api@example.com',
    docsUrl: '#',
    specUrl: '#'
  };
};

const getDetails = (apiName) =>
  API_DETAILS[apiName] || {
    description: 'API for ' + apiName + '. Use this service to integrate with related capabilities.',
    url: 'https://xx.com/' + apiName.toLowerCase().replace(/\s+/g, '_') + '/v1',
    version: 'v1.0',
    inputLabel: 'See API documentation for request and response schemas.'
  };

const getSwaggerDefinition = (apiName) => {
  const basePath = '/' + apiName.toLowerCase().replace(/\s+/g, '_').replace(/&/g, 'and') + '/v1';
  return `openapi: 3.0.3
info:
  title: ${apiName} API
  description: Mock OpenAPI definition for ${apiName}.
  version: 1.0.0
  contact:
    name: API Support
    email: api@example.com

servers:
  - url: https://xx.com${basePath}
    description: Production

paths:
  /orders:
    get:
      summary: List resources
      operationId: listItems
      tags:
        - ${apiName}
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ListResponse'
    post:
      summary: Create resource
      operationId: createItem
      tags:
        - ${apiName}
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateRequest'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ItemResponse'
        '400':
          description: Bad request

  /orders/{id}:
    get:
      summary: Get by ID
      operationId: getItem
      tags:
        - ${apiName}
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ItemResponse'
        '404':
          description: Not found
    put:
      summary: Update resource
      operationId: updateItem
      tags:
        - ${apiName}
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateRequest'
      responses:
        '200':
          description: OK
        '404':
          description: Not found

components:
  schemas:
    ListResponse:
      type: object
      properties:
        items:
          type: array
          items:
            $ref: '#/components/schemas/Item'
        total:
          type: integer
          example: 42
    Item:
      type: object
      properties:
        id:
          type: string
          example: "item-001"
        name:
          type: string
        createdAt:
          type: string
          format: date-time
    ItemResponse:
      allOf:
        - $ref: '#/components/schemas/Item'
    CreateRequest:
      type: object
      required:
        - name
      properties:
        name:
          type: string
        metadata:
          type: object
    UpdateRequest:
      type: object
      properties:
        name:
          type: string
        metadata:
          type: object
`;
};

const APIDetailsPage = ({ apiName, onBack, breadcrumbParent = 'API catalog' }) => {
  const [activeTabKey, setActiveTabKey] = useState('overview');
  const [projectOpen, setProjectOpen] = useState(false);
  const details = getDetails(apiName);

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <>
      <PageSection variant="light">
        <Dropdown
          isOpen={projectOpen}
          onOpenChange={(open) => setProjectOpen(open)}
          onSelect={() => setProjectOpen(false)}
          toggle={(toggleRef) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setProjectOpen((prev) => !prev)}
              isExpanded={projectOpen}
              variant="default"
            >
              Project: All Projects
            </MenuToggle>
          )}
        >
          <DropdownList>
            <DropdownItem key="all">All Projects</DropdownItem>
            <DropdownItem key="proj1">Project 1</DropdownItem>
            <DropdownItem key="proj2">Project 2</DropdownItem>
          </DropdownList>
        </Dropdown>
        <div style={{ width: '100%' }}>
          <Divider style={{ marginTop: '16px', marginBottom: '16px' }} />
        </div>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
          <FlexItem>
            <Breadcrumb style={{ marginBottom: '16px' }}>
              <BreadcrumbItem
                onClick={onBack}
                isLink
                style={{ color: '#0066cc', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {breadcrumbParent}
              </BreadcrumbItem>
              <BreadcrumbItem isActive>{apiName}</BreadcrumbItem>
            </Breadcrumb>
            <Title headingLevel="h1" size="2xl">{apiName}</Title>
          </FlexItem>
          <FlexItem>
            <Button variant="primary">Request API keys</Button>
          </FlexItem>
        </Flex>
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          style={{ marginTop: '24px' }}
        >
          <Tab eventKey="overview" title={<TabTitleText>Overview</TabTitleText>} />
          <Tab eventKey="api-product" title={<TabTitleText>API product</TabTitleText>} />
          <Tab eventKey="definition" title={<TabTitleText>Definition</TabTitleText>} />
        </Tabs>
      </PageSection>

      <PageSection
        style={{
          height: 'calc(100vh - 280px)',
          overflowY: 'auto',
          backgroundColor: 'var(--pf-t--global--background--color--100)'
        }}
      >
        {activeTabKey === 'api-product' && (() => {
          const product = getApiProductDetails(apiName);
          const labelStyle = { fontSize: '12px', fontWeight: 600, color: 'var(--pf-t--global--text--color--subtle)', textTransform: 'uppercase' };
          const sectionTitleStyle = { marginBottom: '12px', fontSize: '12px', fontWeight: 600, color: 'var(--pf-t--global--text--color--subtle)', textTransform: 'uppercase' };
          return (
            <Grid hasGutter>
              <GridItem md={6}>
                <DescriptionList isCompact style={{ marginBottom: '24px' }}>
                  <DescriptionListGroup>
                    <DescriptionListTerm style={labelStyle}>Product name</DescriptionListTerm>
                    <DescriptionListDescription style={{ fontSize: '16px', fontWeight: 600 }}>{product.productName}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm style={labelStyle}>Description</DescriptionListTerm>
                    <DescriptionListDescription>{product.description}</DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
                <DescriptionList isCompact style={{ marginBottom: '24px' }}>
                  <DescriptionListGroup>
                    <DescriptionListTerm style={labelStyle}>Lifecycle</DescriptionListTerm>
                    <DescriptionListDescription><Label color="blue">{product.lifecycle}</Label></DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm style={labelStyle}>API</DescriptionListTerm>
                    <DescriptionListDescription>{product.api}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm style={labelStyle}>Version</DescriptionListTerm>
                    <DescriptionListDescription>{product.version}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm style={labelStyle}>Route</DescriptionListTerm>
                    <DescriptionListDescription>{product.route}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm style={labelStyle}>Namespace</DescriptionListTerm>
                    <DescriptionListDescription>{product.namespace}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm style={labelStyle}>Tags</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Flex gap={{ default: 'gapSm' }} wrap="wrap">
                        {product.tags.map((t) => (
                          <Label key={t} variant="outline" isCompact>{t}</Label>
                        ))}
                      </Flex>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
                <Title headingLevel="h3" size="md" style={sectionTitleStyle}>Contact information</Title>
                <DescriptionList isCompact>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Team</DescriptionListTerm>
                    <DescriptionListDescription>{product.contactTeam}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Email</DescriptionListTerm>
                    <DescriptionListDescription>
                      <a href={`mailto:${product.contactEmail}`} style={{ color: 'var(--pf-t--global--text--color--link--default)' }}>{product.contactEmail}</a>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </GridItem>
              <GridItem md={6}>
                <Title headingLevel="h3" size="md" style={sectionTitleStyle}>Available tiers</Title>
                <Table aria-label="Available tiers" style={{ marginBottom: '24px' }}>
                  <Thead>
                    <Tr>
                      <Th>Tier</Th>
                      <Th>Rate limits</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {product.tiers.map((row) => (
                      <Tr key={row.tier}>
                        <Td><Label variant="outline" isCompact>{row.tier}</Label></Td>
                        <Td>{row.rateLimit}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Title headingLevel="h3" size="md" style={sectionTitleStyle}>Documentation</Title>
                <DescriptionList isCompact>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Docs</DescriptionListTerm>
                    <DescriptionListDescription><a href={product.docsUrl} style={{ color: 'var(--pf-t--global--text--color--link--default)' }}>View Documentation</a></DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>OpenAPI Spec</DescriptionListTerm>
                    <DescriptionListDescription><a href={product.specUrl} style={{ color: 'var(--pf-t--global--text--color--link--default)' }}>View Spec</a></DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </GridItem>
            </Grid>
          );
        })()}
        {activeTabKey === 'overview' && (
          <DescriptionList isCompact>
            <DescriptionListGroup>
              <DescriptionListTerm>API name</DescriptionListTerm>
              <DescriptionListDescription>{apiName}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Description</DescriptionListTerm>
              <DescriptionListDescription>{details.description}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>URL</DescriptionListTerm>
              <DescriptionListDescription>{details.url}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Version</DescriptionListTerm>
              <DescriptionListDescription>{details.version}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Input label</DescriptionListTerm>
              <DescriptionListDescription>{details.inputLabel}</DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        )}
        {activeTabKey === 'definition' && (
          <div>
            <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>OpenAPI 3.0 Definition</Title>
            <CodeBlock>
              <CodeBlockCode>{getSwaggerDefinition(apiName)}</CodeBlockCode>
            </CodeBlock>
          </div>
        )}
      </PageSection>
    </>
  );
};

export default APIDetailsPage;
