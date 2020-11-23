
//constants
const STARTBOT = 'start';
const SAVE = 'next';
const BACK = 'prev';
const RESET = 'reset'; 
//function
export const reducer = action => (state,props) =>{
  const values = action.values
  switch (action.type){
    case STARTBOT:
      const m = state.menu;
      m.step =values.step;
      return {
        menu:m,        
      };      
    case SAVE:
      break;
    case BACK:
      break;
    case RESET:
      break;
    default:
  }
}