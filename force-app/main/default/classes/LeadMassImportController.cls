public with sharing class LeadMassImportController {
    @AuraEnabled
    public static list<Lead> csvFileRead(Id contentDocumentId){
        list<Lead> leadInsertList = new list<Lead>();
        if(contentDocumentId != null) {
            
            // Fetch File Data based on the basic of document id 
            ContentVersion contentVersionObj = [SELECT Id, VersionData FROM ContentVersion WHERE ContentDocumentId =:contentDocumentId WITH SECURITY_ENFORCED];
            // split the file data
            list<String> csvRecordsList = contentVersionObj.VersionData.toString().split('\n');

            for(Integer i = 1; i < csvRecordsList.size(); i++){
                Lead leadObj = new Lead();
                list<String> csvRowData = csvRecordsList[i].split(';');
                System.debug('csvRowData====> '+csvRowData);
                leadObj.FirstName = csvRowData[0]; // leadName
                leadObj.LastName = csvRowData[1];
                leadObj.Email = csvRowData[2];
                leadObj.Company = csvRowData[3];
                leadObj.City = csvRowData[4];
                leadObj.Country = csvRowData[5];
                leadObj.Industry = csvRowData[6];
                leadObj.Status = csvRowData[7];
                leadInsertList.add(leadObj);
            }
            Schema.DescribeSObjectResult objDescribe = Lead.SObjectType.getDescribe();
            try{ 
                if(!leadInsertList.isEmpty()) {
                    if (objDescribe.isCreateable() && Schema.sObjectType.Lead.isCreateable()){
                    insert leadInsertList;
                } 
            }
            }
            catch (Exception ex) {
                throw new AuraHandledException(ex.getMessage());
            } 
        }
        return leadInsertList;    
    }
}