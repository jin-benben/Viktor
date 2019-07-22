import React from 'react';

const Text = ({ text, color }) => (
  <div style={{ wordWrap: 'break-word', wordBreak: 'break-all', color: color || '' }}>{text}</div>
);

export default Text;
