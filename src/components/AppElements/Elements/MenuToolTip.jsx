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

export default class MenuToolTip extends React.Component{  
  render(){
    const caption = this.props.caption;
    const description = this.props.description?this.props.description:'';
    description.replace("{i}",this.props.caption);
    return (
    <HtmlTooltip 
      title={
        <React.Fragment>
          <Typography color="inherit">
            {caption}
          </Typography>
            {description}
        </React.Fragment>}
      arrow placement="bottom-end" enterDelay={1000}>      
      {this.props.component}
    </HtmlTooltip>
    )
  }  
}