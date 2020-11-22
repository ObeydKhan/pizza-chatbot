import React from 'react';
import {StaticTitle, PopupMenu} from '../../Elements/index';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
/* 
PizzaTypeStep expects props={
  initialState:{object},
  selected:(string)=initalState(type)
  content:(array[]):{
    type:(crusts||sizes),    
    caption:(string),
    description:(string),
    items:(list)=>PopupMenu()
  }
}
*/
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
  const selected = props.selected;
  const handleMenuSelect = (props)=>{
    props.updateItem({itemID:'1', change:{type:props.type, value:props.value}})
  }  
  const displayElements = (
    <div className={classes.root}>
      <Grid container spacing={1}>
        {props.content.map((i)=>{        
        const type = i.type;
        const rowTitle = i.caption;
        const description = i.description;
        const isDisabled = false;
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
                <PopupMenu type={type} itemTypeCaption={rowTitle} selected={selected[type]} isDisabled={isDisabled} items={i.items} handleMenuSelect={()=>{handleMenuSelect()}}/>
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