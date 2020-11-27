import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {MultiTableDisplay} from './AppElements/Elements/index';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '75%',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function ConfirmationPage(props){  
  const classes = useStyles();
  const botState = props.getBotState();
  const order = botState.order;
  const menu = botState.menu;
  const loc = botState.loc.curStoreInfo;
  const locName = loc.storeName;
  const locHours = loc.storeHours
  const oSum = order.OrderSummary;
  const handlePizzaSelect = () =>{

  }
  const msg = `${oSum.name}, your order of ${oSum.cnt} pizzas will be available for pickup in 30 minutes at the ${locName}.\nPlease ensure you arrive before closing time. As a reminder the store hours for this location are ${locHours}.\nThank You.`;
  return (
    <div className={classes.root}>
    <div className={classes.paper}>{msg}</div>
      <MultiTableDisplay name={oSum.name} pizzas={oSum.pizzas} menu={menu} handlePizzaSelect={handlePizzaSelect}/>
    </div>
  )
}

    
