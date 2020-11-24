import React from 'react';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles} from '@material-ui/core/styles';
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
let rowTitle;

export default function MenuComponent(props) {
  const componentType = props.componentType;
  rowTitle = props.rowTitle.itemCaption;
  switch(componentType){
    case 'botmenu':
      return {
        componentType:componentType,
        rowKey:props.rowKey,
        rowtitle:ToolTipComponent(props.rowTitle),
        rowbtns:props.rowbtns.map((b)=>{
          const val = b;
          val.onSelect = props.onSelect
          return ToolTipComponent(val)})
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
        const sel = {type:'select', values:props.itemValue};      
      return <button className={type} onClick={()=>{return props.onSelect(sel)}}>{props.itemCaption}</button>;
      default:
        return <div className='default'>Default Component</div>;
    }
  }
  const key =props.hasOwnProperty('itemKey')?props.itemKey:false;
  const liClass = props.hasOwnProperty('btnClass')?props.btnClass:false;
  const tip = (      
    <HtmlTooltip title={<React.Fragment><Typography color="inherit">{props.itemCaption}</Typography>{props.itemDescription.replace("{i}",rowTitle)}</React.Fragment>} arrow placement="bottom-end" enterDelay={1500}>
      {comp(props)}
    </HtmlTooltip>)

  return {comp:tip, key:key, iClass:liClass}
}