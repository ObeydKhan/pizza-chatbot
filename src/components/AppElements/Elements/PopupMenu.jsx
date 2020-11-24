import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuToolTip from './MenuToolTip';
/* 
PopupMenu expects props={    
  type = content.type
  itemTypeCaption = content.caption
  selected = initialState(type)
  items:(list): = content.list {
    id:(string),    
    caption:(string),
    description:(string),
    isDisabled:(boolean),
  }
}
*/
export function PopupMenu(props) {
  const hasPriorSelection = props.hasOwnProperty('selected')&&props.selected!==null&&props.selected!==0;
  const sel = hasPriorSelection?props.selected:0;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selected, setSelected] = React.useState(sel);

  
  
  const itemTypeCaption = props.itemTypeCaption;
  const itemList = props.items;
  const initialLabel = `No ${itemTypeCaption} selected`;
  const noneItem = {id:'0', caption:`None`, description:`No ${itemTypeCaption} selected`}
  
  const menuList = [noneItem].concat(itemList);
  const menuToolTipCaption = `${itemTypeCaption} menu`;
  const menuToolTipDescription = `Click here to select a ${itemTypeCaption} for this pizza`;
  
  const label = selected===0?initialLabel:menuList[selected].caption;  
  
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
    const menuItem = <MenuItem key={`${props.type}-${item.id}`} selected={index === selected} onClick={(event) => handleMenuItemSelect(event, index)}>
                        {item.caption}
                      </MenuItem>
    return <MenuToolTip caption={item.caption} description={item.description} component={menuItem}/>
  })

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