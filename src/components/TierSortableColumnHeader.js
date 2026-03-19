import React from 'react';
import { css } from '@patternfly/react-styles';
import tableStyles from '@patternfly/react-styles/css/components/Table/table';
import { Popover } from '@patternfly/react-core';
import { SortColumn, SortByDirection } from '@patternfly/react-table';
import { QuestionCircleHelpTrigger } from './QuestionCircleHelpTrigger';

const TIER_POPOVER_BODY = (
  <p style={{ margin: 0 }}>A Tier is a set of rate limits defined within the PlanPolicy.</p>
);

/** Min width for Tier column so “Tier”, sort control, and help icon stay visible. */
export const TIER_TABLE_COLUMN_MIN_WIDTH = '11rem';

/**
 * Sortable "Tier" header with FA question-circle popover (My API keys / API key approval).
 */
export function TierSortableColumnHeader({ columnIndex, sortBy, onSort }) {
  const isSortedBy = sortBy && columnIndex === sortBy.index;

  const sortClicked = (event) => {
    let reversedDirection;
    if (!isSortedBy) {
      reversedDirection = sortBy?.defaultDirection ? sortBy.defaultDirection : SortByDirection.asc;
    } else {
      reversedDirection =
        sortBy.direction === SortByDirection.asc ? SortByDirection.desc : SortByDirection.asc;
    }
    onSort?.(event, columnIndex, reversedDirection);
  };

  return (
    <div
      className={css(tableStyles.tableColumnHelp, tableStyles.modifiers.help)}
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        gap: 'var(--pf-t--global--spacer--sm)',
      }}
    >
      <span style={{ flexShrink: 0 }}>
        <SortColumn
          isSortedBy={isSortedBy}
          sortDirection={isSortedBy ? sortBy.direction : ''}
          onSort={sortClicked}
          aria-label="Sort by Tier"
        >
          Tier
        </SortColumn>
      </span>
      <span className={css(tableStyles.tableColumnHelpAction)} style={{ flexShrink: 0, display: 'inline-flex' }}>
        <Popover
          headerContent="Tier"
          showClose
          closeBtnAriaLabel="Close"
          position="top"
          aria-label="Tier"
          bodyContent={TIER_POPOVER_BODY}
        >
          <QuestionCircleHelpTrigger aria-label="More information about Tier" />
        </Popover>
      </span>
    </div>
  );
}
