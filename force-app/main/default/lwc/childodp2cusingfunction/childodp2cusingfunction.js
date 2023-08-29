import { LightningElement, api} from 'lwc';

export default class Childodp2cusingfunction extends LightningElement {
    timestamp = new Date();
    
    @api 
    refresh(){
        this.timestamp = new Date();
    }
}