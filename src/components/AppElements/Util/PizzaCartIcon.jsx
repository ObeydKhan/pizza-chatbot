import React from 'react';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {Badge,Modal,Typography,Tooltip,IconButton} from '@material-ui/core/';
import { withStyles,makeStyles } from '@material-ui/core/styles';

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 0,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge);
const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 400,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);
function getModalStyle() {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function PizzaCartIcon(props){
  const cnt = props.cnt;
  const classes = useStyles();  
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Cart</h2>
      <p id="simple-modal-description">
        Your cart is empty.
      </p>
      <PizzaCartIcon />
    </div>
  );  
  return (
    <>
    <HtmlTooltip title={
        <React.Fragment><Typography color="inherit">Pizza Cart</Typography>Click here to view your pizza cart</React.Fragment>}
        arrow placement="bottom-end" enterDelay={100}>
      <IconButton aria-label="cart">
        <StyledBadge badgeContent={cnt} color="secondary">
          <ShoppingCartIcon onClick={handleOpen}/>
        </StyledBadge>
      </IconButton>
    </HtmlTooltip>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
      </>
  )
}
export default PizzaCartIcon;