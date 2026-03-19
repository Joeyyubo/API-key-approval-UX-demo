import React from 'react';
import { Tooltip } from '@patternfly/react-core';

/** Max characters shown before "..." for API key names in lists and headings. */
export const API_KEY_NAME_DISPLAY_MAX_LEN = 20;

/**
 * @param {string|null|undefined} name
 * @returns {{ display: string, full: string, isTruncated: boolean }}
 */
export function getApiKeyNameTableDisplay(name) {
  const s = name == null ? '' : String(name);
  if (s.length <= API_KEY_NAME_DISPLAY_MAX_LEN) {
    return { display: s, full: s, isTruncated: false };
  }
  return {
    display: `${s.slice(0, API_KEY_NAME_DISPLAY_MAX_LEN)}...`,
    full: s,
    isTruncated: true
  };
}

/**
 * Inline API key name; if truncated with "...", full value is shown in a Tooltip on hover/focus.
 */
export function ApiKeyNameText({ name, style, className }) {
  const { display, full, isTruncated } = getApiKeyNameTableDisplay(name);
  const span = (
    <span style={style} className={className} tabIndex={isTruncated ? 0 : undefined}>
      {display}
    </span>
  );
  return isTruncated ? <Tooltip content={full}>{span}</Tooltip> : span;
}
