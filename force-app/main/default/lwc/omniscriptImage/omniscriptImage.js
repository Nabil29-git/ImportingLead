import { LightningElement,track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin'



export default class omniscriptImage extends OmniscriptBaseMixin(LightningElement) {
  @track value;

  connectedCallback() {
    this.value = this.omniJsonData.imgUrl;
    console.log("dd");
    console.log(this.omniJsonData.imgUrl);
}
}