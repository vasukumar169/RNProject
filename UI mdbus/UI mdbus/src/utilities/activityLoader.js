import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import common from '@material-ui/core/colors/common';

// Reusable Component for Circular Loader when waiting for response

function ActivityLoader(props) {
  return (
    <div style={ props.customStyles ? props.customStyles  : { marginTop : "50%", marginLeft : "50%" }}>
      <CircularProgress  size={60} style={{ color: common["white"] }} thickness={5} />
    </div>
  )
}

export {
  ActivityLoader
}
