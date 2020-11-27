import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);
const useStyles = makeStyles((theme)=> ({
  root: {
    width: '100%',
  },
  title: {
    flex: '1 1 100%',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    maxWidth: 650,
    minWidth: 400,

  },
}));

export function SingleTableDisplay(props){
  const classes = useStyles();
  const [selected, setSelected] = React.useState(0);
  const pizzaId = props.id;
  const selByPizza = pizzaId!==0;
  const pInfo = props.pizza.PizzaInfo;
  const list = props.menu.stepList  
  const rows = SummaryRows(pInfo,list);
  const handleClick = (event, name) => {
    const isSelected = selected===name;
    let newSelect  = ''
    if(isSelected){
      newSelect = ''
    } else {
      newSelect=name;
    }
    const retSel = selByPizza?pizzaId:name
    props.handleSelect(retSel);
    setSelected(newSelect)
  };
  
  const isSelected = (name) => name===selected;
  const summaryMsg = `Pizza${pizzaId>0?` ${pizzaId} `:' '}Summary`  
  return (
    <div className={classes.root}>
    <Toolbar className={classes.title}>
      <Typography className={classes.title}  align="center" variant="h6" id="tableTitle" component="div">
        {summaryMsg}
      </Typography>
    </Toolbar>
    <TableContainer component={Paper}>
      <Table className={classes.table} size={'small'} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Item</StyledTableCell>
            <StyledTableCell align="center">Item Summary</StyledTableCell>            
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => {
            const isItemSelected = isSelected(row.name);
            return (
            <StyledTableRow hover
                      onClick={(event) => handleClick(event, row.name)}                     
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
              <StyledTableCell component="th" scope="row" padding="none">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="left">{row.itemSummary}</StyledTableCell>    
            </StyledTableRow>
          )})}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}
export function MultiTableDisplay(props){
  const name = props.name;
  const summaryMsg = `Order summary for ${name}`;
  const classes = useStyles();
  const [selected, setSelected] = React.useState(0);
  const pizzaList = props.pizzas;  
  const handleSelect = (id) => {
    const isSelected = selected===id;
    let newSelect  = ''
    if(isSelected){
      newSelect = ''
    } else {
      newSelect =id;
    }
    props.handlePizzaSelect(newSelect);
    setSelected(newSelect)
  };  
  const isSelected = (id) => id===selected;
  return (
    <div className={classes.root}>
    <Toolbar className={classes.toolBar}>
      <Typography className={classes.title}  align="center" variant="h6" id="tableTitle" component="div">
        {summaryMsg}
      </Typography>
    </Toolbar>
    {pizzaList!==undefined&&pizzaList!==null&&pizzaList.lentgh>0&&pizzaList.map((p)=>{
      const pInfo = p.PizzaInfo;
      const isItemSelected = isSelected(pInfo.id);
      return (
        <TableContainer component={Paper}>
          <Table className={classes.table} size={'small'} aria-label="customized table" selected={isItemSelected} onClick={handleSelect(pInfo.id)}>
            <SingleTableDisplay pizza={p} menu={props.menu} handleSelect={handleSelect} />
          </Table>
        </TableContainer>
      )      
    })}
    </div>
  )
}
function SummaryRows(pizzaInfo, menuList){  
  const pizzaItems = pizzaInfo.items;
  const itemMsg = pizzaInfo.itemMsg;
  const hasSpecInst = pizzaInfo.specinst?true:false;
  const list = menuList;
  const rows = list.map((i)=>{
    const chk = pizzaItems.hasOwnProperty(i.val)&&itemMsg.hasOwnProperty(i.val);
    const itemSum = chk?itemMsg[i.val]:`No ${i.name} selected`    
    const item = {name:i.name, itemSummary:itemSum}
    return item;
  })
  const specInt = hasSpecInst?pizzaInfo.specinst:'No special instructions';
  return rows.concat({name:'Instructions',itemSummary:specInt})
}