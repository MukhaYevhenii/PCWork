@IsTest
public with sharing class PW_RecentlyViewedProductsTest {

    @IsTest
    public static void shouldNotReturnRecentlyViewedProduct(){
        List<Product2> recentlyProduct = PW_RecentlyViewedProducts.getRecentlyViewedProducts(1);
        System.assertEquals(0,recentlyProduct.size());
    }

    @IsTest
    public static void shouldReturnFourRecentlyViewProducts(){
        List<AggregateResult> numberRecentlyVieweProduct = PW_RecentlyViewedProducts.getNumberOfRecords();
        Integer x = (Integer) numberRecentlyVieweProduct[0].get('totalRecords');
        System.assertEquals(4,x);
    }
}