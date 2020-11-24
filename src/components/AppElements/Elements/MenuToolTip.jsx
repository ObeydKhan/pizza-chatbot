import React from 'react';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles} from '@material-ui/core/styles';

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 400,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);
let rowTitle;

export default function MenuToolTip(props){
  rowTitle = props.rowTitle.itemCaption;

  return (
    <HtmlTooltip 
      title={
        <React.Fragment>
          <Typography color="inherit">
            {props.caption}
          </Typography>
            {props.description.replace("{i}",rowTitle)}
        </React.Fragment>}
      arrow placement="bottom-end" enterDelay={1000}>      
      {props.component}
    </HtmlTooltip>
  )
}