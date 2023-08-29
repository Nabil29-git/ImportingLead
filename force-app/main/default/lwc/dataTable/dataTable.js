import { LightningElement, wire, track } from 'lwc';
import getAccountData from '@salesforce/apex/AccountController.getAccountData';

const columns = [
    { label: 'Name', fieldName: 'Name', sortable: true },
    { label: 'Type', fieldName: 'Type', sortable: true },
    { label: 'Industry', fieldName: 'Industry', sortable: true },
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue', type: 'currency', sortable: true }
];

export default class DataTable2 extends LightningElement {
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

    @wire(getAccountData)
    wiredAccountData({ error, data }) {
        if (data) {
            this.accountData = data;
            this.accountOptions = this.getAccountOptions('Name');
        } else if (error) {
            console.error(error);
        }
    }

    getAccountOptions(fieldName) {
        return [...new Set(this.accountData.map(account => account[fieldName]))].map(option => ({
            label: option,
            value: option
        }));
    }

    toggleFilter() {
        this.showFilter = !this.showFilter;
    }

    getFilterOptions(fieldName) {
        if (fieldName === 'Name') {
            return this.accountOptions;
        } else if (fieldName === 'Type') {
            return this.getTypeOptions();
        } else if (fieldName === 'Industry') {
            return this.getIndustryOptions();
        } else if (fieldName === 'AnnualRevenue') {
            return this.getRevenueOptions();
        }
        return [];
    }

    getTypeOptions() {
        return [
            { label: 'Prospect', value: 'Prospect' },
            { label: 'Customer - Direct', value: 'Customer - Direct' },
            { label: 'Customer - Channel', value: 'Customer - Channel' },
            { label: 'Channel Partner / Reseller', value: 'Channel Partner / Reseller' },
            // Add more options as needed
        ];
    }

    getIndustryOptions() {
        return [
            { label: 'Healthcare', value: 'Healthcare' },
            { label: 'Technology', value: 'Technology' },
            { label: 'Manufacturing', value: 'Manufacturing' },
            { label: 'Finance', value: 'Finance' },
            // Add more options as needed
        ];
    }

    getRevenueOptions() {
        return [
            { label: 'Less than $1M', value: 'Less than $1M' },
            { label: '$1M - $10M', value: '$1M - $10M' },
            { label: '$10M - $100M', value: '$10M - $100M' },
            { label: 'More than $100M', value: 'More than $100M' },
            // Add more options as needed
        ];
    }

    handleFilterChange(event) {
        const fieldName = event.target.dataset.field;
        this.selectedFilters = { ...this.selectedFilters, [fieldName]: event.detail.value };
        this.filterData();
    }

    filterData() {
        this.accountData = this.accountData.filter(account =>
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
