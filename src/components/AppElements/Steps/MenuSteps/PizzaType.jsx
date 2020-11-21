import React, {useState} from 'react';
import {StaticTitle, PopupRowElement} from '../../Elements/index';
import NavigationArray from '../MenuStep';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
/* 
PizzaTypeStep expects props={
  initialState:{object},
  showAlert:(function),
  handleTrigger:(function),
  content:(array[]):{
    type:(string),
    caption:(string),
    description:(string),
    items:(list)=>PopupMenu()
  }
}
PopupRowElement expects props={
  updateItem:(function),
  type:(string),
  itemTypeName:(string),  
  items:(list)=>PopupMenu()
}
PopupMenu expects props={    
  itemTypeName:(string),
  selected:(number),
  items:(list):{
    label:(string),
    caption:(string),
    description:(string),
    isDisabled:(boolean),
  },
  isDisabled:(boolean),
  selectItem:(function),
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
  const [type, setType] = useState(props.initialState);   
  const classes = useStyles();
  const updateItem = (name,value) =>{    
    const newVal = type;
    newVal[name]=value;
    setType(newVal);    
  }
  const onTrigger = (props)=>{
    if(type.crust===0||type.size===0){
      handleAlert()
    } else {
      //handletrigger
    }
  }

  const handleAlert = (props)=>{
    const msgTitle = 'Alert'
    const msg = 'You must select a valid crust type and size before continuing.'
    const status = true;
    const val ={status:status,title:msgTitle,msg:msg};
    props.showAlert(val);
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
                <PopupRowElement itemType={type} itemTypename={rowTitle} selected={type[type]} isDisabled={isDisabled} items={i.items} updateItem={()=>{updateItem()}}/>
              </Paper>
            </Grid>
        </Grid>);
        })}
      </Grid>        
    </div> 
  )
  return(        
    <div className="orderStep">
        <div className={classes.root}>
      <Grid container spacing={1}>
        {displayElements}
      </Grid>
      <NavigationArray displayElements={displayElements} onTrigger={onTrigger}/>
      </div>
    </div>         
  )
}