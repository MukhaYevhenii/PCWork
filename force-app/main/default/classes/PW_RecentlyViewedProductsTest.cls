@IsTest
public with sharing class PW_RecentlyViewedProductsTest {

    @IsTest
    public static void shouldNotReturnRecentlyViewedProduct(){
        List<Product2> recentlyProduct = PW_RecentlyViewedProducts.getRecentlyViewedProducts();
        System.assertEquals(0,recentlyProduct.size());
    }
}