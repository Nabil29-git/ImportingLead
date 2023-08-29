import { LightningElement, wire, track } from 'lwc';
import getAccountData from '@salesforce/apex/AccountController.getAccountData';

const columns = [
    { label: 'Name', fieldName: 'Name', sortable: true, filterable: true, show: false },
    { label: 'Type', fieldName: 'Type', sortable: true, filterable: true, show: false },
    { label: 'Industry', fieldName: 'Industry', sortable: true, filterable: true, show: false },
    { label: 'AnnualRevenue', fieldName: 'AnnualRevenue', type: 'currency', sortable: true, filterable: true, show: false }
];

export default class DataTable2 extends LightningElement {

    originalData;
    @track fieldNames;
    @track accountData;
    @track columns = columns;
    @track selectedFilters = {
        Name: '',
        Type: '',
        Industry: '',
        AnnualRevenue: ''
    };
    @track accountOptions = [];
    @track showFilter = false;
    activeFilterField = '';

    @wire(getAccountData) //Hey box, I want some account data!
    wiredAccountData({ error, data }) { //tell me what happened
        if (data) {
            this.accountData = data;
            this.originalData = data;
            // Convert columns array into an array of field names for dynamic options
            this.fieldNames = columns.map(column => column.fieldName);
            console.log("fieldNames0: ", JSON.stringify(this.fieldNames));
            this.optionsMap = this.getAccountOptionsMap(this.fieldNames);
        } else if (error) {
            console.error(error);
        }
    }

    getAccountOptionsMap(fieldNames) {
        //const optionsMap = new Map();
        //console.log("fieldNames: ",JSON.stringify(fieldNames));
        fieldNames.forEach(fieldName => {
            const options = [...new Set(this.accountData.map(account => account[fieldName]))].map(option => ({
                label: option,
                value: option
            }));
            //console.log("options: ",JSON.stringify(options));
            //optionsMap.set(fieldName, options);

            const columnIndex = this.columns.findIndex(column => column.label === fieldName);
            //console.log(columnIndex);

            if (columnIndex !== -1) {
                this.columns[columnIndex].options = options;
            }
        });

        // console.log("optionsMap: ",optionsMap);

        // return optionsMap;
    }

    // getOptions(event){
    //     const fieldName = event.target.dataset.column;
    //     console.log("fieldName",fieldName);
    //     console.log("optionsMap0",optionsMap[fieldName]);
    //     return optionsMap[fieldName];

    // }

    clearData(){
        this.accountData = this.originalData;
        this.getAccountOptionsMap(this.fieldNames);
    }

    toggleFilter(event) {
        //console.log("in");
        const columnLabel = event.target.dataset.column;
        //console.log(columnLabel);

        const columnIndex = this.columns.findIndex(column => column.label === columnLabel);
        //console.log(columnIndex);

        if (columnIndex !== -1) {
            this.columns[columnIndex].show = !this.columns[columnIndex].show;
        }
    }


    handleFilterChange(event) {
        const fieldName = event.target.dataset.column;
        this.selectedFilters = { ...this.selectedFilters, [fieldName]: event.detail.value };
        this.filterData();
        this.getAccountOptionsMap(this.fieldNames);
    }





    filterData() {

        this.accountData = this.originalData.filter(account =>
            Object.keys(this.selectedFilters).every(
                field => !this.selectedFilters[field] || account[field] === this.selectedFilters[field]
            )
        );
    }

    handleSort(event) {
        const { fieldName, sortDirection } = event.detail;
        const reverse = sortDirection === 'asc' ? 1 : -1;
        const data = [...this.accountData];
        data.sort((a, b) => (a[fieldName] > b[fieldName] ? 1 * reverse : -1 * reverse));
        this.accountData = data;
    }
}
