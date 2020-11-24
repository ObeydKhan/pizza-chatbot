//constants
const SETNAME = 'name';
const STARTORDER = 'start'
const UPDATEORDER = 'update';
const SETALERT = 'alert';
const UPDATELOC = 'location';
const RESET = 'reset'; 
//function
export const reducer = action => (state,props) =>{  
  const values = action.values  
  switch (action.type){    
    case STARTORDER:      
      const o = state.order;
      const m = state.menu;
      m.step = values.botValues;
      o.ordername = values.appValues.name;
      const d=state.display
      d.page = 'Menu';
      d.bot = true;
      d.displayBot = 'menuStep'      
      return {order:o,display:d,menu:m}; 
    case UPDATEORDER:
      const u = state.order;
      return {order:u};
    case SETNAME:
        break;
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
          display.bot = true
          display.displayBot=state.order.ordername?prev:'newOrder';          
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
