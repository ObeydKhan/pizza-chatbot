import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuToolTip from './MenuToolTip';
/* 
PopupMenu expects props={    
  type:(crusts||sizes) = content.type
  itemTypeCaption:(string) = content.caption
  selected:(number) = initialState(type)
  items:(list): = content.list {
    id:(string),
    label:(string),
    caption:(string),
    description:(string),
    isDisabled:(boolean),
  }
}
*/
export function PopupMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selected, setSelected] = React.useState(0);

  const hasPriorSelection = props.hasOwnProperty('selected');
  if(hasPriorSelection){setSelected(parseInt(props.selected))};
  const itemTypeCaption = props.itemTypeCaption;
  const itemList = props.items;
  const initialLabel = `No ${itemTypeCaption} selected`;
  const noneItem = {id:'0', caption:`None`, description:`No ${itemTypeCaption} selected`}
  const menuList = [noneItem].concat(itemList);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuItemSelect = (event, index) => {
    setSelected(index);
    setAnchorEl(null);
    props.handleMenuSelect({type:props.type, value:menuList[index].id});
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const menuItems = menuList.map((item,index)=>{
    const menuItem = <MenuItem key={`${props.type}-${item.id}`} disabled={index===0} selected={index === selected} onClick={(event) => handleMenuItemSelect(event, index)}>
                        {item.caption}
                      </MenuItem>
    return <MenuToolTip caption={item.caption} description={item.description} component={menuItem}/>
  })
  const menuToolTipCaption = `${itemTypeCaption} menu`;
  const menuToolTipDescription = `Click here to select a ${itemTypeCaption} for this pizza`;
  const label = selected===0?initialLabel:menuList[selected].label;  
  const button = props.isDisabled?<Button disabled variant="outline">{label}</Button>:
    <Button aria-controls="popup-menu-select" aria-haspopup="true" onClick={handleClick}>
      {label}
    </Button>; 
  return (
    <div>
      <MenuToolTip caption={menuToolTipCaption} description={menuToolTipDescription} component={button}/>
      <Menu
        id="popup-menu-select"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuItems}         
      </Menu>
    </div>
  );
}