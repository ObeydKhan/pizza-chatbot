//constants
const SETNAME = 'name';
const STARTORDER = 'start'
const UPDATEPIZZA = 'update';
const SPECIALACT = 'special';
const SETALERT = 'alert';
const UPDATELOC = 'location';
const RESET = 'reset';
const EDITITEM = 'edit';
const REVIEW = 'review';
const SETINST = 'inst';
const ADDNEW = 'add';
const SETPIZZA = 'setpizza';
//function
export const reducer = action => (state,props) =>{  
  const values = action.values.appValues;  
  const o=state.order;
  const m=state.menu;
  const d=state.display;
  const p=state.currentPizza;
  const l=state.locObj;
  const a=state.alert;
  const botDisp = (values!==undefined&&values!==null&&values.hasOwnProperty('botDisplay'))?values.botDisplay:false;
  const step = (values!==undefined&&values!==null&&values.hasOwnProperty('step'))?values.step:false;
  const ret ={o:o,m:m,d:d,p:p,l:l,a:a,};
  switch (action.type){    
    case SETPIZZA:
      ret.p = o.GetPizzaByID(values.id);
      ret.d.page='NonMenuStep';
      ret.d.bot=true;
      ret.d.botDisplay='reviewPizza';
      break;           
    case ADDNEW:
      const updateProps = {item:'savePizza', pizza:p};
      if(p!==null){
        ret.o = o.UpdateOrder(updateProps);
      }
      ret.m.step='new';
      ret.d.page = 'Menu';
      ret.d.bot = true;
      ret.d.botDisplay = 'menuStep';
      break;   
    case EDITITEM:
      ret.m.step = values.step;
      ret.d.page='Menu';
      ret.d.bot=true;
      ret.d.botDisplay='editItem';
      break;
    case REVIEW:        
      ret.d.page='NonMenuStep';
      ret.d.bot=true;
      ret.d.botDisplay=botDisp;      
      if(p!==null&&botDisp==='reviewOrder'){
        const updateProps = {item:'savePizza', pizza:p};
        ret.o = o.UpdateOrder(updateProps);
      }
      break;
    case SETINST:
      ret.p.SpecialInstructions = values.inst;
      ret.d.page='NonMenuStep';
      ret.d.bot=true;
      ret.d.botDisplay='reviewPizza';
      break;      
    case STARTORDER:      
      ret.m.step = values.step;
      ret.o.ordername = values.name;      
      ret.d.page = 'Menu';
      ret.d.bot = true;
      ret.d.botDisplay = 'menuStep'      
      break; 
    case UPDATEPIZZA:      
      ret.d.botDisplay = values.botDisplay;
      if(botDisp==='menuStep'||botDisp==='editItem'){
        ret.m.step = step;
      } else if(step==='ask'){
        ret.d.prevDisplay = d;
      }           
      break;
    case SETNAME:
      //change name from reviewOrder menu
      ret.o.ordername = values.name;
      ret.d.page='NonMenuStep';
      ret.d.bot=true;
      ret.d.botDisplay='reviewOrder';
      break;       
    case SETALERT:
      ret.a = values;
      break;      
    case UPDATELOC:      
      const type = values.type;
      const display = {page:'Location', bot:false, botDisplay:false};
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
          display.botDisplay=state.order.ordername?prev:'newOrder';          
        }
        if(!prev||chk){
          delete display.prevBot;
        } else {
          display.prevBot = prev;
        }
      }
      ret.d = display;
      ret.l = loc;
      break;    
    case RESET:
      ret.o=o.NewOrder;
      ret.m=(m.step='new');
      ret.d={page:'Location', bot:false, botDisplay:false};
      ret.p=p.NewPizza;
      ret.l=props.locObj;
      ret.a=false;
      break;
    case SPECIALACT:
      //handle remove/cancel/complete
      if (step==='no'){
        ret.d.page = d.prevDisplay.page;
        ret.d.bot =d.prevDisplay.bot;
        ret.d.botDisplay = d.prevDisplay.botDisplay;
        delete ret.d.prevDisplay;
      } else {
        if(botDisp==='remove'){
          const updateProps = {item:'removePizza', pizza:p};        
          ret.o = o.UpdateOrder(updateProps);
          if(values.step==='new'){
            ret.d.botDisplay = 'addNew';            
          } else {
            ret.d.page='NonMenuStep';
            ret.d.bot=true;
            ret.d.botDisplay='reviewOrder';
          }
        } else if(botDisp==='cancel'){
          ret.p = p.NewPizza;
          ret.o = o.NewOrder;
          ret.m = (m.step='new');
          if(step==='restart'){
            ret.d.page='Main';
            ret.d.bot=true;
            ret.d.botDisplay = 'newOrder';
          } else {
            ret.d.page='Location';
            ret.d.bot=false;
            ret.d.botDisplay=false;
            ret.l = step==='main'?props.locObj:l.ChangeLoc();
          }      
        } else if(botDisp==='complete'){
          if(p!==null){
            const updateProps = {item:'savePizza', pizza:p};
            ret.o = o.UpdateOrder(updateProps);
          }
          ret.d.page = 'Final';
          ret.d.bot = false;
          ret.d.botDisplay = false;
        }
      }
      break;          
    default:
  }
  return {
    order:ret.o, 
    menu:ret.m, 
    display:ret.d, 
    currentPizza:ret.p,
    alert:ret.a,
    locObj:ret.l,
  };
}
