import React from 'react';

/** A native link with the shared DMS action style; keeps href/download behavior. */
const ActionLink = ({ variant = 'secondary', className = '', target, rel, children, ...props }) => {
  const safeRel = target === '_blank'
    ? Array.from(new Set([...(rel || '').split(/\s+/).filter(Boolean), 'noopener', 'noreferrer'])).join(' ')
    : rel;

  return (
    <a {...props} className={`btn btn-${variant} ${className}`.trim()} target={target} rel={safeRel}>
      {children}
    </a>
  );
};

export default ActionLink;
