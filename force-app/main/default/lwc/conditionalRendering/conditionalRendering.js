import { LightningElement } from 'lwc';

export default class ConditionalRendering extends LightningElement {
    myValue = "Nabil Fast";
   showMe = false;
   handleChange(event){
    this.showMe=event.target.checked;
   }
}