import React from 'react';
import {StaticTitle, PopupMenu} from '../../Elements/index';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function PizzaTypeStep(props){     
  const classes = useStyles();    
  
  const handleMenuSelect = (props)=>{
    const item = {itemID:'',crusts:'0',sizes:'0'}; 
    updateItem({itemID:'1', change:{type:props.type, value:props.value}})
  }
  const updateItem = props.updateItem;
  const stepData = props.stepData;
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
  const selected = props.selected!==null&&props.selected.hasOwnProperty(stepData.menuType)?props.selected[stepData.menuType]['1']:null;
  const displayElements = (
    <div className={classes.root}>
      <Grid container spacing={1}>
        {content.map((i)=>{        
        const type = i.type;
        const rowTitle = i.caption;
        const description = i.description;
        const isDisabled = false;
        const sel = selected!==null&&selected.hasOwnProperty(type)?selected[type]:0;
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