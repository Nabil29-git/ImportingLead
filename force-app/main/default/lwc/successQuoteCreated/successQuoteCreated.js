import { LightningElement,track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';

export default class SuccessQuoteCreated extends OmniscriptBaseMixin(LightningElement) {
    @track cartId;
    connectedCallback() {
        const jsonData = JSON.parse(JSON.stringify(this.omniJsonData));
        this.cartId= jsonData.cartId;
    }

    handleClick(){
        this.omniNextStep();
    }
}