import { LightningElement,track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';


export default class LwcSelectPhone extends OmniscriptBaseMixin(LightningElement) {
    @track products;
    connectedCallback() {
        const jsonData = JSON.parse(JSON.stringify(this.omniJsonData));
        this.products= jsonData.products.map(item => ({ ...item, finalPrice: item.OneTimePrice - 0.3*item.OneTimePrice }));;
    }

    handleClick(event){
        const card = event.currentTarget;   
        var data={
            phone:{
                product_name:card.getAttribute('product-name'),
                product_one_time_price:card.getAttribute('product-one-time-price'),
            }
           
        } ;

        this.omniApplyCallResp(data);

        // get all divs with the class "color-change"
        const colorDivs = this.template.querySelectorAll('.clicked');
        
        // loop through each div and remove the "clicked" class
        colorDivs.forEach(div => {
        div.classList.remove('clicked');
        });
        

        // add the "clicked" class to the clicked div
        card.parentNode.parentNode.classList.add('clicked');
    }
}