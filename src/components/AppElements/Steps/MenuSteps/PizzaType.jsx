import React from 'react';
import {StaticTitle, PopupMenu} from '../../Elements/index';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width:'100%'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));
function initializeSelection(initial){
  const selected = initial.selected;  
  const isSel = selected!==null&&selected!==undefined;
  const ret = {crusts:'0', sizes:'0'};
  if(isSel){
    const menuType = initial.menuType;
    const selMenuType = selected.hasOwnProperty(menuType)?selected[menuType]:false;
    if(selMenuType){
      const selItem = selMenuType['1'];
      const c = selItem.hasOwnProperty('crusts')?selItem.crusts:'0';
      const s = selItem.hasOwnProperty('sizes')?selItem.sizes:'0';
      ret.crusts = c;
      ret.sizes = s;
    }
  } 
  return ret;
}
export default function PizzaTypeStep(props){     
  const classes = useStyles();
  const [initialized, setInitialzied] = React.useState(false);
  const initialSelect = (p)=>{
    return initializeSelection(p)
  }
  const updateItem = props.updateItem;
  const stepData = props.stepData;
  
  const [size, setSize] = React.useState('0');
  const [crust,setCrust] =React.useState('0');
  if(!initialized){
    const ini = initialSelect({selected:props.selected,menuType:stepData.menuType})
    setSize(ini.sizes);
    setCrust(ini.crusts);
    setInitialzied(true)
  }
  const handleMenuSelect = (input)=>{        
    const chk = (p)=>{
      const item = {crusts:crust,sizes:size};
      const type=p.type;
      const value = p.value;
      item[type]=value;
      if(type==='sizes'&&size!==value){
        setSize(value);
        return item;
      } else if(type==='crusts'&&crust!==value){
        setCrust(value);
        return item;
      } else {
        return false
      }
    }
    const doUpdate = chk(input);
    if(doUpdate){
      updateItem({item:{itemID:'1',values:doUpdate},replace:true})
    }    
  }  
  const content = stepData.content.values.map((i)=>{
    const type = i.type;
    const caption = i.caption;
    const description = i.description;
    const items=stepData.content[type].map((o)=>{
      const id = o.id;
      const caption = o.caption;
      const description = o.description;
      return {id:id, caption:caption, description:description, isDisabled:false}
    });
    return {type:type, caption:caption, description:description, items:items};
  })
  //const newType ={}
  
  const selected = {crusts:crust, sizes:size}  
  const displayElements = (
    <div className={classes.root}>
      <Grid container spacing={1}>
        {content.map((i)=>{        
        const type = i.type;
        const rowTitle = i.caption;
        const description = i.description;
        const isDisabled = false;
        const sel = parseInt(selected[type]);
        return (
          <Grid container item
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item>
              <Paper className={classes.paper}>
                <StaticTitle rowTitle={rowTitle} description={description}/>
              </Paper>
            </Grid>
            <Grid item>
              <Paper className={classes.paper}>
                <PopupMenu type={type} itemTypeCaption={rowTitle} selected={sel} isDisabled={isDisabled} items={i.items} handleMenuSelect={(p)=>{handleMenuSelect(p)}}/>
              </Paper>
            </Grid>
        </Grid>);
        })}
      </Grid>        
    </div> 
  )
  return(   
    <div className={classes.root}>
      <Grid container spacing={1}>
        {displayElements}
      </Grid>      
    </div>             
  )
}