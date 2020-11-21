import React, {useState} from 'react'
import SvgIcon from '@material-ui/core/SvgIcon';
import { makeStyles } from '@material-ui/core/styles';
import MenuToolTip from '../Elements/MenuToolTip';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles ({
  root:{
    color:"black",
  }
});

export default function ChangeHalfButton(props){
  const [half, setHalf] = useState(2);
  const classes = useStyles();
  
  const handleClick = (event)=>{
    const x = (half+1)>3?1:half+1;
    setHalf(x);
    props.changeHalf(x);
  }
  const icon = <PizzaHalfIcon half={half}/>;

  const component = <IconButton aria-label="half-button" classes={{root:classes.root}} onClick={handleClick}>{icon}</IconButton>
  return (
    <MenuToolTip caption={props.caption} description={props.description} component={component}/>
  )
}

function PizzaHalfIcon(props){  
  const half = props.half;
  const rot = half!==2?((half-1)*90):0;
  const trans = `rotate(${rot} 12 12)`;
  const path = half!==2?<path  d="M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2M12 4A8 8 0 0 1 20 12A8 8 0 0 1 12 20V4Z"
        transform={trans} />:<path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />;
  return <SvgIcon>{path}</SvgIcon>
}