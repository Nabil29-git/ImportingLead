import { LightningElement,api } from 'lwc';

export default class Childofp2cusingapi extends LightningElement {
    @api percentage;

    get style(){
        return `background-color:red; min-height:50px; width: ${this.percentage}%; min-width:10px`;
    }

    @api 
    refresh(){
        this.timestamp = new Date();
    }
}