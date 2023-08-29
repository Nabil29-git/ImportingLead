public  class AccountDataController {
     
    @AuraEnabled (cacheable=true)
    public static List<Account> fetchAccount(String Id){
        
        return [SELECT Id, Name, BillingStreet,BillingLongitude,BillingLatitude, BillingCity, BillingState, BillingPostalCode, BillingCountry,Plannification_Status__c 
                FROM Account Where Id = :Id];       
    }

    @AuraEnabled (cacheable=true)
    public static List<Account> fetchAccounts(){
        
        return [SELECT Id, Name, BillingStreet,BillingLongitude,BillingLatitude, BillingCity, BillingState, BillingPostalCode, BillingCountry,Plannification_Status__c 
                FROM Account];       
    }

    @AuraEnabled (cacheable=true)
    public static List<Map<String,Object>> fetchAccountsWithTech(){
        List<Map<String,Object>> result = new List<Map<String,Object>>();
       List<Event> events =  [SELECT WhoId,WhatId,Morning__c,Afternoon__c,ActivityDate  FROM Event];
       for (event e :events){

        Map<String,Object> r = new Map<String,Object>();

        r.put('Morning', e.Morning__c);
        r.put('Afternoon', e.Afternoon__c);
        r.put('Date', e.ActivityDate);

        List<Account> a = [SELECT Id, Name, BillingStreet,BillingLongitude,BillingLatitude, BillingCity, BillingState, BillingPostalCode, BillingCountry,Plannification_Status__c 
        FROM Account where Id = :e.WhatId];
        
        r.put('AccountId',a[0].Id);
        r.put('Account', a[0].Name);
        r.put('BillingLongitude', a[0].BillingLongitude);
        r.put('BillingLatitude', a[0].BillingLatitude);
        r.put('BillingCity', a[0].BillingCity);
        r.put('BillingCountry', a[0].BillingCountry);
        r.put('PlannificationStatus ', a[0].Plannification_Status__c);

        List<Contact> t = [SELECT Id, Name FROM Contact where Id = :e.WhoId];

        r.put('Technicien', t[0].Name);


        result.add(r);

       }

        return result;
    }
    


    @AuraEnabled (cacheable=true)
    public static List<Map<String,Object>> fetchAccountsWithTechWithDate(Date selectedDate){
        List<Map<String,Object>> result = new List<Map<String,Object>>();
        List<Event> events =  [SELECT WhoId,WhatId,Morning__c,Afternoon__c,ActivityDate  FROM Event];
        for (event e :events){
 
         Map<String,Object> r = new Map<String,Object>();
 
         r.put('Morning', e.Morning__c);
         r.put('Afternoon', e.Afternoon__c);
 
 
         List<Account> a = [SELECT Id, Name, BillingStreet,BillingLongitude,BillingLatitude, BillingCity, BillingState, BillingPostalCode, BillingCountry,Plannification_Status__c 
         FROM Account where Id = :e.WhatId];
         
         r.put('AccountId',a[0].Id);
         r.put('Account', a[0].Name);
         r.put('BillingLongitude', a[0].BillingLongitude);
         r.put('BillingLatitude', a[0].BillingLatitude);
         r.put('BillingCity', a[0].BillingCity);
         r.put('BillingCountry', a[0].BillingCountry);
         r.put('PlannificationStatus ', a[0].Plannification_Status__c);
 
         List<Contact> t = [SELECT Id, Name FROM Contact where Id = :e.WhoId];
 
         r.put('Technicien', t[0].Name);
 
 
         result.add(r);
 
        }
 
         return result;
    }



    @AuraEnabled (cacheable=false)
    public static List<Map<String,Object>> fetchTechWithDate(Date selectedDate){
        List<RecordType> recordTypes = [SELECT Id FROM RecordType WHERE SObjectType = 'Contact' AND Name = 'Technicien'];
        String recordTypeId = recordTypes[0].Id;
 
        List<Map<String,Object>> result = new List<Map<String,Object>>();

        List<Contact> cs = [SELECT Name  FROM Contact  WHERE RecordTypeId = :recordTypeId];

        for (Contact c : cs){
            
            Map<String,Object> rr = new Map<String,Object>();
            Boolean isMorning = false;
            Boolean isAfternoon = false;

            List <Event> es = [SELECT  Morning__c, Afternoon__c FROM Event  WHERE WhoId = :c.Id and ActivityDate= :selectedDate];
            for (Event e : es)
            {   
                
                isMorning = isMorning || e.Morning__c;
                isAfternoon = isAfternoon || e.Afternoon__c;

            }


            rr.put('Id',c.id);
            rr.put('Name',c.Name);
            rr.put('isMorning',isMorning);
            rr.put('isAfternoon',isAfternoon);
            
            result.add(rr);

        
        }

        


        return result;
    }

    @AuraEnabled (cacheable=true)
    public static List<Contact> fetchTechs(){

        
        List<RecordType> recordTypes = [SELECT Id FROM RecordType WHERE SObjectType = 'Contact' AND Name = 'Technicien'];
        String recordTypeId = recordTypes[0].Id;

        return [SELECT Name  FROM Contact  WHERE RecordTypeId = :recordTypeId];
        
        
    }

    @AuraEnabled (cacheable=false)
    public static void AddTechEvent(String whoId, String whatId, String datee, Boolean isMorning, Boolean isAfternoon){

        
        Event e = new Event(  


            
            WhoId= whoId,
            WhatId= whatId,
            DurationInMinutes = null,
            ActivityDateTime = null,
            IsAllDayEvent = true,
            ActivityDate= Date.valueOf(datee),
            Morning__c= isMorning,
            Afternoon__c= isAfternoon
    

        );
    
        insert e ;


        //return e;
        
        
    }



    

    
}