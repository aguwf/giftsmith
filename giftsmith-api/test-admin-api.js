const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:9000';

async function testAdminAPI() {
  console.log('🧪 Testing Admin API Endpoints...\n');

  try {
    // Test 1: Get all product types
    console.log('1. Testing GET /admin/product-types...');
    const productTypesResponse = await fetch(`${BASE_URL}/admin/product-types`);
    const productTypes = await productTypesResponse.json();
    
    if (productTypesResponse.ok) {
      console.log('✅ Product types endpoint working');
      console.log(`Found ${productTypes.product_types?.length || 0} product types`);
      
      if (productTypes.product_types?.length > 0) {
        const firstType = productTypes.product_types[0];
        console.log(`First product type: ${firstType.name} (${firstType.id})`);
      }
    } else {
      console.log('❌ Product types endpoint failed:', productTypes);
    }

    // Test 2: Get all custom products
    console.log('\n2. Testing GET /admin/custom-products...');
    const customProductsResponse = await fetch(`${BASE_URL}/admin/custom-products`);
    const customProducts = await customProductsResponse.json();
    
    if (customProductsResponse.ok) {
      console.log('✅ Custom products endpoint working');
      console.log(`Found ${customProducts.products?.length || 0} custom products`);
      
      if (customProducts.products?.length > 0) {
        const firstCustom = customProducts.products[0];
        console.log(`First custom product: ${firstCustom.product_id}`);
      }
    } else {
      console.log('❌ Custom products endpoint failed:', customProducts);
    }

    // Test 3: Get products with custom data (if any products exist)
    console.log('\n3. Testing GET /admin/products/{id}/custom-data...');
    
    // First, get a list of products
    const productsResponse = await fetch(`${BASE_URL}/admin/products`);
    const products = await productsResponse.json();
    
    if (productsResponse.ok && products.products?.length > 0) {
      const firstProduct = products.products[0];
      console.log(`Testing with product: ${firstProduct.title} (${firstProduct.id})`);
      
      const customDataResponse = await fetch(`${BASE_URL}/admin/products/${firstProduct.id}/custom-data`);
      const customData = await customDataResponse.json();
      
      if (customDataResponse.ok) {
        console.log('✅ Product custom data endpoint working');
        console.log('Product:', customData.product?.title);
        console.log('Has custom data:', !!customData.custom_product);
        
        if (customData.custom_product) {
          console.log('Custom attributes:', Object.keys(customData.custom_product.custom_attributes));
        }
      } else {
        console.log('❌ Product custom data endpoint failed:', customData);
      }
    } else {
      console.log('⚠️  No products found to test custom data endpoint');
    }

    // Test 4: Test creating a custom product (if we have a product and product type)
    console.log('\n4. Testing POST /admin/products/{id}/custom-data...');
    
    if (productsResponse.ok && products.products?.length > 0 && 
        productTypesResponse.ok && productTypes.product_types?.length > 0) {
      
      const testProduct = products.products[0];
      const testProductType = productTypes.product_types[0];
      
      const testData = {
        product_type_id: testProductType.id,
        custom_attributes: {
          // Add some test attributes based on the product type
          test_field: "test_value"
        }
      };
      
      // Add specific attributes based on product type
      if (testProductType.slug === 'gift-box') {
        testData.custom_attributes = {
          box_size: "medium",
          box_color: "blue",
          max_items: 5,
          personalization_available: true
        };
      } else if (testProductType.slug === 'gift-item') {
        testData.custom_attributes = {
          item_category: "other",
          item_size: "medium",
          fragile: false
        };
      } else if (testProductType.slug === 'gift-card') {
        testData.custom_attributes = {
          card_type: "digital",
          denomination: 50,
          validity_period: 12,
          customizable_message: true
        };
      }
      
      console.log(`Testing with product: ${testProduct.title}`);
      console.log(`Using product type: ${testProductType.name}`);
      
      const createResponse = await fetch(`${BASE_URL}/admin/products/${testProduct.id}/custom-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });
      
      const createResult = await createResponse.json();
      
      if (createResponse.ok) {
        console.log('✅ Create custom product endpoint working');
        console.log('Created custom product ID:', createResult.custom_product?.id);
      } else {
        console.log('❌ Create custom product endpoint failed:', createResult);
      }
    } else {
      console.log('⚠️  Cannot test create endpoint - missing products or product types');
    }

    console.log('\n🎉 Admin API testing completed!');
    console.log('\n📚 Next steps:');
    console.log('1. Use the React component in admin interface');
    console.log('2. Test the UI manually');
    console.log('3. Check the ADMIN-CUSTOM-DATA.md guide');

  } catch (error) {
    console.error('❌ Error testing admin API:', error.message);
    console.log('\n💡 Make sure:');
    console.log('- Medusa server is running on port 9000');
    console.log('- Product types have been created');
    console.log('- Database is properly configured');
  }
}

// Run the test
testAdminAPI(); 