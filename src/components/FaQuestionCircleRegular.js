import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';

/**
 * Font Awesome **regular** `fa-question-circle` — use for all question-mark / help icons.
 */
export function FaQuestionCircleRegular({ style, className, title, 'aria-hidden': ariaHidden }) {
  return (
    <FontAwesomeIcon
      icon={faQuestionCircle}
      className={className}
      style={{
        fontSize: 'var(--pf-t--global--icon--size--font--md)',
        verticalAlign: 'middle',
        ...style
      }}
      title={title}
      aria-hidden={ariaHidden}
    />
  );
}
