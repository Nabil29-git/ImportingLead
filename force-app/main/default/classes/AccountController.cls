public class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountData() {
        return [SELECT Id, Name, Type, Industry, AnnualRevenue FROM Account];
    }
}
