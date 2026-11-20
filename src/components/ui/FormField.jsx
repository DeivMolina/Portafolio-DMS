import React from 'react';

/** A labeled native input/textarea; validation and form submission remain native. */
const FormField = ({ id, label, multiline = false, className = '', ...props }) => (
  <div className={`form-field ${className}`.trim()}>
    <label htmlFor={id}>{label}</label>
    {multiline ? <textarea id={id} {...props} /> : <input id={id} {...props} />}
  </div>
);

export default FormField;
