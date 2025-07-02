const fetch = require('node-fetch');

async function testProductTypeAPI() {
  const baseUrl = 'http://localhost:9000';
  
  try {
    console.log('🧪 Testing Product Type API...\n');
    
    // Test data
    const testProductType = {
      name: "Test Product Type",
      slug: "test-product-type",
      description: "A test product type",
      field_schema: [
        {
          name: "test_field",
          type: "text",
          label: "Test Field",
          required: true,
          description: "A test field"
        }
      ],
      is_active: true
    };
    
    console.log('📤 Sending POST request to /admin/product-types');
    console.log('Request body:', JSON.stringify(testProductType, null, 2));
    
    const response = await fetch(`${baseUrl}/admin/product-types`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProductType)
    });
    
    const result = await response.json();
    
    console.log('\n📥 Response status:', response.status);
    console.log('Response body:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Product type created successfully!');
      console.log('Product type ID:', result.product_type?.id);
    } else {
      console.log('\n❌ Failed to create product type');
      console.log('Error details:', result);
    }
    
  } catch (error) {
    console.error('❌ Error testing product type API:', error.message);
  }
}

testProductTypeAPI(); 