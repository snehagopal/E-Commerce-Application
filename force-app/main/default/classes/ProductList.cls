public class ProductList {
    @AuraEnabled
    public static String loginDetails(String email, String password) {
        Lead lead = [SELECT Id, FirstName,LastName, Email, Password__c, Status FROM Lead WHERE Email = :email AND Password__c = :password LIMIT 1];
            if (lead != null) {
                if (lead.Status != 'Closed-Converted') {
                    Account acc = new Account();
                    acc.Name = lead.FirstName;
                    acc.Lead__c=lead.Id;
                    insert acc;    
                    acc = [SELECT Id FROM Account WHERE Id = :acc.Id LIMIT 1];
                    Contact con = new Contact();
                    con.LastName = lead.LastName;
                    con.AccountId = acc.Id;
                    insert con;  
                    Opportunity opp = new Opportunity();
                    opp.Name = lead.FirstName + ' Opportunity';
                    opp.StageName = 'Prospecting';
                    opp.CloseDate = Date.today();
                    opp.AccountId = acc.Id;
                    insert opp;
                    lead.Status = 'Closed-Converted';
                    update lead;
                }
            }
            return lead.Id;
    } 
    
    @AuraEnabled(cacheable = true)
    public static List<Product2> getProductsByProductCode(String productCode,Integer pageNumber, Integer pageSize) {
    try {
        Id standardPricebookId = [SELECT Id FROM Pricebook2 WHERE IsStandard = true LIMIT 1].Id;
        Integer offset = (pageNumber - 1) * pageSize;
        return [SELECT Id, Name, imageUrl__c,Status__c,Product_Wishlist_Status__c,Total_Stock__c,(SELECT Pricebook2Id, UnitPrice FROM PricebookEntries WHERE Pricebook2Id = :standardPricebookId) FROM Product2 WHERE ProductCode LIKE :productCode LIMIT :pageSize
        OFFSET :offset];
        
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}
    @AuraEnabled(cacheable = true)
    public static List<OpportunityLineItem> cartProducts() {
        try {
            return [SELECT Id,Product2.Name,Product2.imageUrl__c,Product2.Status__c,ListPrice,TotalPrice FROM OpportunityLineItem];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable = true)
    public static List<Wishlist__c> wishlistProducts() {
        try {
            return [SELECT Id, Product2Id__c, Product2Id__r.Name, Product2Id__r.imageUrl__c,Product2Id__r.Status__c,UnitPrice__c,Wishlist_Status__c FROM Wishlist__c WHERE Wishlist_Status__c='True'];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static void addedToCartProducts(Id leadId, Id productId, String productName, Integer quantity) {
    List<Account> accounts = [SELECT Id FROM Account WHERE Lead__c = :leadId LIMIT 1];
    if (!accounts.isEmpty()) {
        List<Opportunity> opportunities = [SELECT Id, AccountId FROM Opportunity WHERE AccountId = :accounts[0].Id LIMIT 1];
        if (!opportunities.isEmpty()) {
            PricebookEntry price = [SELECT Id, Name, Pricebook2Id, UnitPrice, Product2Id FROM PricebookEntry WHERE Product2Id = :productId AND Pricebook2.IsActive = true LIMIT 1];
            if (price != null) {
                List<OpportunityLineItem> productItems = new List<OpportunityLineItem>();
                for (Opportunity opp : opportunities) {
                    OpportunityLineItem productItem = new OpportunityLineItem();
                    productItem.OpportunityId = opp.Id;
                    productItem.Product2Id = productId;
                    productItem.UnitPrice = price.UnitPrice;
                    productItem.Quantity = quantity;
                    productItem.PricebookEntryId = price.Id;
                    productItems.add(productItem);
                    System.debug('Opportunity Product created successfully: ' + productItem);
                }
                insert productItems;
            }
        }
    }
    Product2 product=[Select Id,Total_Stock__c, Status__c from Product2 where Id=:productId];
    if(product!=null)
    {
        product.Total_Stock__c=product.Total_Stock__c-quantity;
        if(product.Total_Stock__c<=0)
        {
            product.Status__c='Out of Stock';
        }
        System.debug('Opportunity Product updated successfully: ' + product);
        update product;
    }
    System.debug(product.Status__c);

}
@AuraEnabled
    public static void addedToWishlistProducts(Id leadId, Id productId, String productName, Integer quantity) {
    List<Account> account = [SELECT Id FROM Account WHERE Lead__c = :leadId LIMIT 1];

    if (!account.isEmpty()) {
        List<Opportunity> opportunity = [SELECT Id, AccountId FROM Opportunity WHERE AccountId = :account[0].Id LIMIT 1];
        if (!opportunity.isEmpty()) {
            PricebookEntry price = [SELECT Id, Name, Pricebook2Id, UnitPrice, Product2Id FROM PricebookEntry WHERE Product2Id = :productId AND Pricebook2.IsActive = true LIMIT 1];
            if (price != null) {
                List<Wishlist__c> productItems = new List<Wishlist__c>();
                for (Opportunity opp : opportunity) {
                    Wishlist__c productItem = new Wishlist__c();
                    productItem.Name=productName;
                    productItem.OpportunityId__c = opp.Id;
                    productItem.Product2Id__c = productId;
                    productItem.UnitPrice__c = price.UnitPrice;
                    productItem.Wishlist_Status__c='True';
                    productItems.add(productItem);
                    System.debug('Wishlist created successfully: ' + productItem);
                }
                insert productItems;
            }
        }
    }
    Product2 product = [SELECT Id, Product_Wishlist_Status__c FROM Product2 WHERE Id = :productId LIMIT 1];
    if (product != null) {
        product.Product_Wishlist_Status__c = 'True';
        update product;
    }

}
@AuraEnabled
public static void CancelCartProducts(String cartId){
    try {
        OpportunityLineItem item = [SELECT Id,Product2Id,Quantity FROM OpportunityLineItem WHERE Id = :cartId];
        if(item!=null)
        {
            Product2 product=[Select Id,Total_Stock__c,Status__c from Product2 where Id =:item.Product2Id];
            if(product!=null)
            {
                product.Total_Stock__c=product.Total_Stock__c+item.Quantity;
                if(product.Total_Stock__c>0&&product.Status__c=='Out of Stock')
                {
                    product.Status__c='In Stock';
                }
                update product;
            }
        }
        delete item;
        

    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}
@AuraEnabled
public static void cancelWishlistProducts(String cartId){
    try {
        Wishlist__c item = [SELECT Id,Product2Id__c FROM Wishlist__c WHERE Id = :cartId LIMIT 1];
        if (item != null) {
            Product2 product = [SELECT Id, Product_Wishlist_Status__c FROM Product2 WHERE Id = :item.Product2Id__c LIMIT 1];
            if (product != null) {
                product.Product_Wishlist_Status__c = 'False';
                update product;
            }
            delete item;
        }
    
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}
/*@AuraEnabled
public static void checkOutProducts(String leadId){
    try {
        List<Account> accounts = [SELECT Id FROM Account WHERE Lead__c = :leadId LIMIT 1];
        List<Opportunity> opportunities = [SELECT Id, AccountId FROM Opportunity WHERE AccountId = :accounts[0].Id LIMIT 1];
        List<OpportunityLineItem> items = [SELECT Id FROM OpportunityLineItem where OpportunityId=:opportunities[0].Id];
        delete items;

    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}*/
@AuraEnabled
    public static Order createOrder(Id leadId) {
        try {
          
            List<Account> accIds=[Select Id,Name from Account where Lead__c=:leadId LIMIT 1];
            Account acc = accIds[0];
            Order order = new Order();
            order.Name=acc.Name;
            order.Status='Draft';
            order.AccountId=acc.Id;
            order.EffectiveDate=Date.today();
            Pricebook2 defaultPricebook = [SELECT Id FROM Pricebook2 WHERE IsStandard = true LIMIT 1];
            order.Pricebook2Id = defaultPricebook.Id;
            insert order;
            System.debug(order+'Success');
            List<OpportunityLineItem> cartProducts=[Select Id,Product2Id,Quantity from OpportunityLineItem];
            List<OrderItem> orderProducts=new List<OrderItem>();
            for(OpportunityLineItem cartProduct:cartProducts)
            {
                PricebookEntry pricebookEntry = [SELECT Id, UnitPrice FROM PricebookEntry WHERE Product2Id = :cartProduct.Product2Id AND Pricebook2Id = :order.Pricebook2Id LIMIT 1];
                if(pricebookEntry!=null)
                {
                OrderItem orderProduct=new OrderItem();
                orderProduct.OrderId=order.Id;
                orderProduct.Product2Id=cartProduct.Product2Id;
                orderProduct.PricebookEntryId=pricebookEntry.Id;
                orderProduct.UnitPrice = pricebookEntry.UnitPrice;
                orderProduct.Quantity=cartProduct.Quantity;
                orderProducts.add(orderProduct);
                }
            }
            if(orderProducts!=null)
            {
            insert orderProducts;
            System.debug(orderProducts);
            }
            delete cartProducts;
            return order;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}