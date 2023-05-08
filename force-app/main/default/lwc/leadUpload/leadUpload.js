import { LightningElement, track, api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import csvFileRead from '@salesforce/apex/LeadMassImportController.csvFileRead';

const columnsLead = [
    { label: 'FirstName', fieldName: 'FirstName' }, 
    { label: 'LastName', fieldName: 'LastName' },
    { label: 'Email', fieldName: 'Email'}, 
    { label: 'Company', fieldName: 'Company'}, 
    { label: 'City', fieldName: 'City'},
    { label: 'Country', fieldName: 'Country'},
    { label: 'Industry', fieldName: 'Industry'},
    { label: 'Status', fieldName: 'Status'}
];


export default class cSVFileReadLWC extends LightningElement {
    @track columnsLead = columnsLead;
    @api recordId;
    @track error;
    @track data;

    // accepted parameters
    get acceptedCSVFormats() {
        return ['.csv'];
    }
    
    uploadFileHandler(event) {
        // Get the list of records from the uploaded files
        const uploadedFiles = event.detail.files;

        // calling apex class csvFileread method
        csvFileRead({contentDocumentId : uploadedFiles[0].documentId})
        .then(result => {
            window.console.log('result ===> '+result);
            this.data = result;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!!',
                    message: 'Leads are created according to the CSV file upload!!!',
                    variant: 'Success',
                }),
            );
        })
        .catch(error => {
            this.error = error;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error!!',
                    message: JSON.stringify(error),
                    variant: 'error',
                }),
            );     
        })

    }
}
