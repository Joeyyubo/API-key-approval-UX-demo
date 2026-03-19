import React, { forwardRef } from 'react';
import { Button } from '@patternfly/react-core';
import { FaQuestionCircleRegular } from './FaQuestionCircleRegular';

/**
 * Plain inline help control with FA regular question-circle (Popover/Tooltip child).
 */
export const QuestionCircleHelpTrigger = forwardRef(
  ({ 'aria-label': ariaLabel, className, ...props }, ref) => (
    <Button
      ref={ref}
      component="span"
      variant="plain"
      hasNoPadding
      isInline
      className={className}
      aria-label={ariaLabel}
      icon={
        <FaQuestionCircleRegular
          style={{ fontSize: 'var(--pf-t--global--icon--size--font--body--default)' }}
        />
      }
      {...props}
    />
  )
);
QuestionCircleHelpTrigger.displayName = 'QuestionCircleHelpTrigger';
