import { LightningElement } from 'lwc';

export default class BindHtmlDynamic extends LightningElement {
    myValue="Nabil Fast";
    handleChange(event){
        this.myValue = event.target.value; 
    }
}