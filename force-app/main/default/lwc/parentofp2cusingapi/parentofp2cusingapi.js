import { LightningElement } from 'lwc';

export default class Parentofp2cusingapi extends LightningElement {
    percentage = 20;
    handleonchange(event){
        this.percentage = event.target.value;
    } 

    handleClick(){
        this.template.querySelector("c-childodp2cusingfunction").refresh();
    }

}