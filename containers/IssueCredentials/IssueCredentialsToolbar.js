import React from 'react';
import IconButton from 'material-ui/IconButton';
import IconActionHelp from 'material-ui/svg-icons/action/help';
import IconActionInfo from 'material-ui/svg-icons/action/info';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

const IssueCredentialsToolbar = () => (
  <Toolbar style={{ backgroundColor: 'none' }}>
    <ToolbarGroup>
      <ToolbarTitle text="Attributen uitgeven" />
    </ToolbarGroup>
    <ToolbarGroup lastChild>
      <IconButton tooltip="Help">
        <IconActionHelp />
      </IconButton>
      <IconButton tooltip="Info">
        <IconActionInfo />
      </IconButton>
    </ToolbarGroup>
  </Toolbar>
);

export default IssueCredentialsToolbar;
