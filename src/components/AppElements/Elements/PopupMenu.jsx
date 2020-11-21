import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuToolTip from './MenuToolTip';
/* PopupMenu expects props=
  selected:(number),
  itemTypeName:(string),
  items:(list):{
    label:(string),
    caption:(string),
    description:(string),
    isDisabled:(boolean),
  },
  isDisabled:(boolean),
  selectItem:(function),
*/
export default function PopupMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selected, setSelected] = React.useState(0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuItemSelect = (event, index) => {    
    props.selectItem(index);
    setSelected(index);
    setAnchorEl(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const hasPriorSelection = props.hasOwnProperty('selected');
  if(hasPriorSelection){setSelected(props.selected)};
  const itemTypeName = props.itemTypeName;
  const itemList = props.items;
  const initialLabel = `No ${itemTypeName} selected`;
  const noneItem = {label:'None', caption:`No ${itemTypeName}`, description:null}
  const menuList = [noneItem].concat(itemList);
  const menuItems = menuList.map((item,index)=>{
    const menuItem = <MenuItem key={item.label} disabled={item.isDisabled} selected={index === selected} onClick={(event) => handleMenuItemSelect(event, index)}>
                        {item.label}
                      </MenuItem>
    return <MenuToolTip caption={item.caption} description={item.description} component={menuItem}/>
  })
  const menuToolTipCaption = `${itemTypeName} menu`;
  const menuToolTipDescription = `Click here to select a ${itemTypeName} for this pizza`;
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