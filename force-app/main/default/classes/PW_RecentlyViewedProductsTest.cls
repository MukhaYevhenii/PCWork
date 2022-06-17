@IsTest
public with sharing class PW_RecentlyViewedProductsTest {

    @IsTest
    public static void shouldNotReturnRecentlyViewedProduct(){
        List<Product2> recentlyProduct = PW_RecentlyViewedProducts.getRecentlyViewedProducts(1);
        System.assertEquals(0,recentlyProduct.size());
    }
}