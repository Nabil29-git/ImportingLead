import { LightningElement } from 'lwc';

export default class LifecycleHooks extends LightningElement {
    constructor(){
        super();
        console.log("Constructor");
    }
}