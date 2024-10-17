import BANNER from "../componentPage/pages/BANNER";
import CATEGORY from "../componentPage/pages/CATEGORY";
import PRODUCT from "../componentPage/pages/PRODUCT";
import SERVICE from "../componentPage/pages/SERVICE";
import Model from '../componentPage/pages/Model';
import NOTIFICATION from '../CommonComponent/NOTIFICATION';
import BestPlaces from "../componentPage/pages/BestPlaces";

const Main=()=> {
    return (
      <main>
        <Model/>
        <NOTIFICATION/>
        <BANNER/>
        <CATEGORY/>
        <BestPlaces/>
        <PRODUCT/>
        <SERVICE/>
      </main>
    );
  }
  
export default Main;