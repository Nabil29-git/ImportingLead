import { LightningElement, wire, track, api } from 'lwc';
import AddTechEvent from '@salesforce/apex/AccountDataController.AddTechEvent';
//import createEvents from '@salesforce/apex/AccountDataController.createEvents';

import { publish, MessageContext } from 'lightning/messageService';
import fetchTechWithDate from '@salesforce/apex/AccountDataController.fetchTechWithDate';
import DATE_UPDATED_CHANNEL from '@salesforce/messageChannel/Date_Updated__c';


export default class TechChooser extends LightningElement {

    
    @track techs;
    @track event;
    @api recordId;


    @wire(MessageContext)
    messageContext;


    whatId ;
    whoId ; // replace with your actual Contact or Lead Id
    isMorning = false; // replace with your actual value
    isAfternoon = false
    date;


    

    connectedCallback() {
        console.log('Current record ID: ' + this.recordId);
        this.whatId = this.recordId;
    }
    // @wire(fetchTechs, {})
    // wireAccountWithTech({ error, data }) {
    //     if (data) {

    //          this.techs=data;
    //          console.log("on");
    //          console.log(JSON.stringify(data));

    //     } else if (error) {
    //         this.error = error;
    //     }
    // }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async MorningEvent(event) {
        console.log('Morning');
        this.whoId=event.target.dataset.id;
        this.isMorning=true;
        this.isAfternoon = false;
        this.invoke();
        
        await this.delay(500);
        this.GetTech();

    }


    async AfternoonEvent(event) {
        console.log('Afternoon');
        this.whoId=event.target.dataset.id;
        this.isAfternoon=true;
        this.isMorning = false;
        this.invoke();

        await this.delay(500);
        this.GetTech();

    }

    handleChange(event) {
        const selectedDate = event.detail.value;
        console.log('Selected date: ' + selectedDate);
        this.date=selectedDate;
        
        console.log("inn");

        const payload = { 
            date: this.date,
            
        };
        publish(this.messageContext, DATE_UPDATED_CHANNEL, payload);
        //this.invoke();

        this.GetTech();


        // Handle date selection here
    }

    GetTech(){

        fetchTechWithDate({ selectedDate: this.date})
        .then(result => {
            console.log('innn',result);
            this.techs = result;
            this.error = undefined;
        })
        .catch(error => {
            console.error(error);
            this.error = error.body.message;
            this.userList = undefined;
        });

    }


    @api async invoke() {
        let result = await AddTechEvent({ whoId: this.whoId, whatId: this.whatId, datee: this.date, isMorning: this.isMorning, isAfternoon: this.isAfternoon })
    }

    





}