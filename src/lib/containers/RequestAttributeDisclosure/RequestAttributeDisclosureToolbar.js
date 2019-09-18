import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import IconActionHelp from '@material-ui/icons/Help';
import IconActionInfo from '@material-ui/icons/Info';
import Toolbar from '@material-ui/core/Toolbar';

const RequestAttributeDisclosureToolbar = () => (
  <Toolbar style={{ backgroundColor: 'none' }}>
    <Typography style={{ flexGrow: 1 }}>Attribute(s) Required</Typography>
    <IconButton tooltip="Help">
      <IconActionHelp />
    </IconButton>
    <IconButton tooltip="Info">
      <IconActionInfo />
    </IconButton>
  </Toolbar>
);

export default RequestAttributeDisclosureToolbar;
