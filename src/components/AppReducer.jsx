//constants
const SETNAME = 'name';
const UPDATEORDER = 'update';
const SETALERT = 'alert';
const UPDATELOC = 'location';
const RESET = 'reset'; 
//function
export const reducer = action => (state,props) =>{
  const values = action.values  
  switch (action.type){    
    case SETNAME:
      const o = state.order;
      o.ordername = values.name;
      const d={page:values.display, bot:values.showBot}
      return {order:o,display:d}; 
    case UPDATEORDER:
      const u = state.order;
      return {order:u};
    case SETALERT:
      return{alert:values}      
    case UPDATELOC:      
      const type = values.type;
      const display = {page:'Location', bot:false};
      const hasPrev = state.display.hasOwnProperty('prevBot');
      const prev = hasPrev?state.display.prevBot:false;      
      let loc = null;
      if(type==='change'){
        loc = state.locObj;
        loc.ChangeLoc();
        display.prevBot = prev;                        
      } else {
        loc = values.locObj;
        const chk = loc.searchStep==='done';        
        if(chk){
          display.page='Main';
          display.bot=state.order.ordername?prev:'newOrder';          
        }
        if(!prev||chk){
          delete display.prevBot;
        } else {
          display.prevBot = prev;
        }
      }
      return {locObj:loc, display:display};    
    case RESET:
      return {
        alert:false,
        display:{page:'Location', bot:false},             
        locObj: props.locObj,           
        order: values.order,
      }    
    default:

  }
}
