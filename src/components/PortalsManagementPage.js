import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Flex,
  FlexItem,
  Button,
  Card,
  CardHeader,
  CardBody,
  Grid,
  GridItem,
  Icon,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle
} from '@patternfly/react-core';
import { FileIcon, EllipsisVIcon, ArrowRightIcon } from '@patternfly/react-icons';

const PORTALS = [
  { id: 'internal', name: 'Internal portal', apiCount: 6 },
  { id: 'ext1', name: 'External portal-1', apiCount: 6 },
  { id: 'ext2', name: 'External portal-2', apiCount: 6 },
  { id: 'ext3', name: 'External portal-3', apiCount: 6 },
  { id: 'ext4', name: 'External portal-4', apiCount: 6 },
  { id: 'ext5', name: 'External portal-5', apiCount: 6 }
];

const CARD_DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id feugiat augue, nec fringilla turpis.';

const PortalsManagementPage = ({ onPortalClick }) => {
  const [openCardId, setOpenCardId] = useState(null);

  const handleCardAction = (portalName, e) => {
    if (e && e.target && e.target.closest('[aria-label="Actions"]')) return;
    if (e && e.target && e.target.closest('.pf-c-dropdown')) return;
    onPortalClick && onPortalClick(portalName);
  };

  return (
    <div
      style={{
        height: 'calc(100vh - 60px)',
        backgroundColor: 'var(--pf-v5-global--BackgroundColor--100)',
        overflowY: 'auto'
      }}
    >
      <PageSection variant="default">
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">Portals</Title>
            <p style={{ marginTop: '8px', color: 'var(--pf-v5-global--Color--200)' }}>
              Manage portal settings and configurations.
            </p>
          </FlexItem>
          <FlexItem>
            <Button variant="primary">Create new portal</Button>
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection variant="default">
        <Grid hasGutter md={6} lg={4}>
          {PORTALS.map((portal) => (
            <GridItem key={portal.id}>
              <div
                style={{
                  height: '100%',
                  border: '1px solid #d2d2d2',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: 'var(--pf-v5-global--BoxShadow--sm)'
                }}
              >
              <Card
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: onPortalClick ? 'pointer' : undefined,
                  border: 'none',
                  borderRadius: 0,
                  boxShadow: 'none'
                }}
                isSelectable={!!onPortalClick}
                onClick={(e) => handleCardAction(portal.name, e)}
              >
                <CardHeader
                  style={{ padding: '24px 24px 16px' }}
                  actions={{
                    actions: (
                      <Dropdown
                        isOpen={openCardId === portal.id}
                        onOpenChange={(open) => setOpenCardId(open ? portal.id : null)}
                        onSelect={() => setOpenCardId(null)}
                        toggle={(toggleRef) => (
                          <MenuToggle
                            ref={toggleRef}
                            aria-label="Actions"
                            variant="plain"
                            onClick={(e) => { e.stopPropagation(); setOpenCardId(openCardId === portal.id ? null : portal.id); }}
                          >
                            <EllipsisVIcon />
                          </MenuToggle>
                        )}
                      >
                        <DropdownList>
                          <DropdownItem key="edit">Edit</DropdownItem>
                          <DropdownItem key="settings">Settings</DropdownItem>
                          <DropdownItem key="delete">Delete</DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    )
                  }}
                >
                  <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
                    <Icon size="lg" style={{ color: 'var(--pf-v5-global--primary-color--100)' }}>
                      <FileIcon />
                    </Icon>
                    <span style={{ fontWeight: 600, fontSize: '16px' }}>{portal.name}</span>
                  </Flex>
                </CardHeader>
                <CardBody style={{ flex: '1 1 auto', padding: '16px 24px 24px' }}>
                  <p
                    style={{
                      color: 'var(--pf-v5-global--Color--200)',
                      fontSize: '14px',
                      marginTop: '4px',
                      marginBottom: '16px',
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {CARD_DESCRIPTION}
                  </p>
                  <Divider style={{ margin: '16px 0' }} />
                  <Flex
                    alignItems={{ default: 'alignItemsCenter' }}
                    justifyContent={{ default: 'justifyContentSpaceBetween' }}
                    onClick={(e) => { e.stopPropagation(); onPortalClick && onPortalClick(portal.name); }}
                    style={{ cursor: onPortalClick ? 'pointer' : undefined }}
                  >
                    <span style={{ fontSize: '14px', color: 'var(--pf-v5-global--Color--200)' }}>
                      APIs ({portal.apiCount})
                    </span>
                    <Button variant="plain" isInline aria-label="View APIs">
                      <ArrowRightIcon />
                    </Button>
                  </Flex>
                </CardBody>
              </Card>
              </div>
            </GridItem>
          ))}
        </Grid>
      </PageSection>
    </div>
  );
};

export default PortalsManagementPage;
