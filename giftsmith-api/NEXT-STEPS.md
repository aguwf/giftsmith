# Next Steps - Product Types System

Bây giờ bạn đã có product types trong database, đây là các bước tiếp theo:

## 🚀 **Bước 1: Tạo Custom Products**

Chạy script để thêm custom attributes cho các sản phẩm hiện có:

```bash
cd giftsmith-api
npx medusa exec ./src/scripts/create-custom-products.ts
```

Script này sẽ:
- Tự động detect loại sản phẩm dựa trên title/handle
- Assign default attributes cho từng loại
- Validate data trước khi tạo
- Hiển thị progress và summary

## 🧪 **Bước 2: Test API Endpoints**

### Test với Node.js script:
```bash
cd giftsmith-api
node test-api.js
```

### Test với curl:
```bash
# Lấy danh sách product types
curl http://localhost:9000/admin/product-types

# Lấy danh sách custom products
curl http://localhost:9000/admin/custom-products

# Lọc theo product type
curl "http://localhost:9000/admin/custom-products?product_type_id=YOUR_TYPE_ID"
```

## 📝 **Bước 3: Tạo Custom Product Thủ công**

### Tạo Gift Box:
```bash
curl -X POST http://localhost:9000/admin/custom-products \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "YOUR_PRODUCT_ID",
    "product_type_id": "GIFT_BOX_TYPE_ID",
    "custom_attributes": {
      "box_size": "large",
      "box_color": "red",
      "max_items": 10,
      "personalization_available": true,
      "personalization_text": "Happy Birthday!"
    }
  }'
```

### Tạo Gift Item:
```bash
curl -X POST http://localhost:9000/admin/custom-products \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "YOUR_PRODUCT_ID",
    "product_type_id": "GIFT_ITEM_TYPE_ID",
    "custom_attributes": {
      "item_category": "chocolate",
      "item_size": "medium",
      "fragile": false,
      "expiry_date": "2024-12-31",
      "allergen_info": "Contains nuts"
    }
  }'
```

### Tạo Gift Card:
```bash
curl -X POST http://localhost:9000/admin/custom-products \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "YOUR_PRODUCT_ID",
    "product_type_id": "GIFT_CARD_TYPE_ID",
    "custom_attributes": {
      "card_type": "digital",
      "denomination": 100,
      "validity_period": 12,
      "customizable_message": true,
      "design_template": "birthday"
    }
  }'
```

## 🔧 **Bước 4: Sử dụng trong Frontend**

### Lấy sản phẩm với custom attributes:
```javascript
// Lấy tất cả custom products
const response = await fetch('/admin/custom-products');
const { products } = await response.json();

// Lọc theo loại sản phẩm
const giftBoxes = products.filter(p => p.product_type_id === 'gift-box-type-id');
const giftItems = products.filter(p => p.product_type_id === 'gift-item-type-id');
const giftCards = products.filter(p => p.product_type_id === 'gift-card-type-id');
```

### Hiển thị custom attributes:
```javascript
// Ví dụ cho Gift Box
const giftBox = products.find(p => p.product_id === 'your-product-id');
if (giftBox) {
  const { custom_attributes } = giftBox;
  console.log(`Box Size: ${custom_attributes.box_size}`);
  console.log(`Box Color: ${custom_attributes.box_color}`);
  console.log(`Max Items: ${custom_attributes.max_items}`);
  console.log(`Personalization: ${custom_attributes.personalization_available ? 'Yes' : 'No'}`);
}
```

## 📊 **Bước 5: Quản lý và Cập nhật**

### Cập nhật custom attributes:
```bash
curl -X PUT http://localhost:9000/admin/custom-products/CUSTOM_PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "custom_attributes": {
      "box_size": "extra-large",
      "box_color": "blue",
      "max_items": 15
    }
  }'
```

### Xóa custom product:
```bash
curl -X DELETE http://localhost:9000/admin/custom-products/CUSTOM_PRODUCT_ID
```

## 🎯 **Bước 6: Tích hợp với Storefront**

### Tạo API endpoint cho storefront:
```typescript
// src/api/store/products/[id]/custom-attributes/route.ts
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;
  const productTypeService = req.scope.resolve("product_types");
  
  const customProduct = await productTypeService.getCustomProduct(id);
  
  res.json({ custom_attributes: customProduct?.custom_attributes || {} });
};
```

### Sử dụng trong React component:
```jsx
const ProductCustomAttributes = ({ productId }) => {
  const [attributes, setAttributes] = useState({});
  
  useEffect(() => {
    fetch(`/store/products/${productId}/custom-attributes`)
      .then(res => res.json())
      .then(data => setAttributes(data.custom_attributes));
  }, [productId]);
  
  return (
    <div>
      {attributes.box_size && <p>Box Size: {attributes.box_size}</p>}
      {attributes.box_color && <p>Box Color: {attributes.box_color}</p>}
      {attributes.max_items && <p>Max Items: {attributes.max_items}</p>}
    </div>
  );
};
```

## 🔍 **Bước 7: Debug và Troubleshooting**

### Kiểm tra logs:
```bash
# Xem logs của Medusa server
npx medusa logs

# Kiểm tra database
npx medusa db:show
```

### Common issues:
1. **"Product type not found"** - Kiểm tra product type ID
2. **"Validation failed"** - Kiểm tra data format theo schema
3. **"Custom product already exists"** - Sử dụng update thay vì create

## 📚 **Tài liệu tham khảo**

- [Product Types Module README](./src/modules/product-types/README.md)
- [API Endpoints Documentation](./src/api/README.md)
- [Medusa v2 Documentation](https://docs.medusajs.com/)

## 🎉 **Hoàn thành!**

Bây giờ bạn đã có một hệ thống product types hoàn chỉnh với:
- ✅ Product types được định nghĩa
- ✅ Custom attributes cho từng loại sản phẩm
- ✅ API endpoints để quản lý
- ✅ Validation tự động
- ✅ Scripts để migrate data

Hệ thống sẵn sàng để sử dụng trong production! 🚀 