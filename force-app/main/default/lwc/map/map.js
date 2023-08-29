import { LightningElement, wire, track, api } from 'lwc';

import fetchAccount from '@salesforce/apex/AccountDataController.fetchAccount';
import fetchAccounts from '@salesforce/apex/AccountDataController.fetchAccounts';
import fetchAccountsWithTech from '@salesforce/apex/AccountDataController.fetchAccountsWithTech';

import DATE_UPDATED_CHANNEL from '@salesforce/messageChannel/Date_Updated__c';
import { subscribe, MessageContext } from 'lightning/messageService';

export default class Map extends LightningElement {
    @api recordId;
    AccountId;
    @track error;
    @track mapMarkers = [];
    @track markersTitle = 'Accounts';
    @track zoomLevel = 8.9;
    @track center = '';
    @track customMapIcon = '';

    subscription = null;

    @wire(MessageContext)
    messageContext;
    subscribeToMessageChannel() {
      this.subscription = subscribe(
        this.messageContext,
        DATE_UPDATED_CHANNEL,
        (message) => console.log(message.date)
      );
    }


    connectedCallback() {
        console.log('Current record ID: ' + this.recordId);
        this.AccountId=this.recordId;
        this.subscribeToMessageChannel();
    }

    


    // @wire(fetchAccountsWithTech, {})
    // wireAccountWithTech({ error, data }) {
    //     if (data) {
    //          console.log("in");
    //          console.log(JSON.stringify(data));

    //     } else if (error) {
    //         this.error = error;
    //     }
    // }

    @wire(fetchAccount, {Id:'$AccountId'})
    wireAccount({ error, data }) {
        console.log("on1");
        console.log(JSON.stringify(data));
        if (data) {
        
            
            data.forEach(Item => {
                console.log(Item);
                this.customMapIcon = {
                        path: 'M0-163.2c27,0,49,21.7,49,48.5C49-87.9,0,0,0,0s-49-87.9-49-114.7S-27-163.2,0-163.2z M0.2-100.2 c8.4,0,15.1-6.7,15.1-15s-6.8-15-15.1-15c-8.4,0-15.1,6.7-15.1,15S-8.2-100.2,0.2-100.2z',
                        fillColor: '#04b82e',
                        fillOpacity: 1,
                        strokeColor: '',
                        strokeWeight: 0,
                        scale: 1 / 4
                }
               
                this.mapMarkers = [...this.mapMarkers,
                {
                    location: {
                        City: Item.BillingCity,
                        Country: Item.BillingCountry,
                        Latitude: Item.BillingLatitude,
                        Longitude: Item.BillingLongitude,
                    },
                    mapIcon :this.customMapIcon,
                    icon: 'custom:custom26',
                    title: Item.Name,
                    
                }
                ];
                this.center = {
                        location: { Latitude: Item.BillingLatitude, Longitude: Item.BillingLongitude },
                };
                this.zoomLevel = 5;
                
            });
            console.log("out");
            this.error = undefined;
        } else if (error) {
            this.error = error;
            console.log(error);
        }
    }


    @wire(fetchAccountsWithTech)
    wireAccountsWithTech({ error, data }) {
        console.log("on2");
        console.log(JSON.stringify(data));
        if (data) {
        
            
            data.forEach(Item => {
                console.log(Item);
                this.customMapIcon =  '';
               
                this.mapMarkers = [...this.mapMarkers,
                {
                    location: {
                        City: Item.BillingCity,
                        Country: Item.BillingCountry,
                        Latitude: Item.BillingLatitude,
                        Longitude: Item.BillingLongitude,
                    },
                    mapIcon :this.customMapIcon,
                    icon: 'standard:account',
                    title: Item.Account,
                    description: Item.Technicien+" will visite the company on "+Item.Date
                    
                }
                ];
                
            });
            console.log("out");
            this.error = undefined;
        } else if (error) {
            this.error = error;
            console.log(error);
        }
    }



}