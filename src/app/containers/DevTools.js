import React from 'react';

let DevTools;

if (process.env.NODE_ENV === 'production') {
  DevTools = () => null;
} else {
  const { createDevTools } = require('redux-devtools');
  const LogMonitor = require('redux-devtools-log-monitor').default;
  const DockMonitor = require('redux-devtools-dock-monitor').default;

  DevTools = createDevTools(
    <DockMonitor toggleVisibilityKey='ctrl-h' changePositionKey='ctrl-q' defaultIsVisible={false} defaultPosition='left'>
      <LogMonitor theme='tomorrow' />
    </DockMonitor>
  );
}

export default DevTools;
