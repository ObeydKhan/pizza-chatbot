import React from 'react';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles} from '@material-ui/core/styles';
import Random from 'random-id';
import df from "../resources/dairyfree.svg";
import gf from "../resources/glutenfree.svg";
import veggie from "../resources/vegetarian.svg";
import vegan from "../resources/vegan.svg";

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 400,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

export default function MenuComponent(props) {
  const componentType = props.componentType;
  switch(componentType){
    case 'botmenu':
      return {
        componentType:componentType,
        rowKey:props.rowKey,
        rowtitle:{comp:ToolTipComponent(props.rowtitle),props:props.rowtitle},
        rowbtns:{comp:props.rowbtns.map((b)=>{return ToolTipComponent(b)}),props:props.rowbtns}
      };
    case 'cart':
      return 'Cart Component';
    case 'summary':
      return 'Summary Component';
    default:
      return 'Default Component';
  };  
}
function ToolTipComponent(props){
  const comp = (props) => {
    const type = props.itemClass;
    switch (type){
      case 'rowTitle':
        return <div className={type}>{props.itemCaption}</div>;
      case 'menuBtn':
        return <button className={type} onClick={()=>{return props.onClick(props.itemVal)}}>{props.itemCaption}</button>;
      default:
        return <div className='default'>Default Component</div>;
    }
  }
  return (
    <>
      <HtmlTooltip title={<React.Fragment><Typography color="inherit">{props.itemCaption}</Typography>{props.itemDescription}</React.Fragment>} arrow placement="bottom-end" enterDelay={1500}>
        {comp(props)}
      </HtmlTooltip>
    </>
  );
}
/*
function MenuImage(){

}*/

