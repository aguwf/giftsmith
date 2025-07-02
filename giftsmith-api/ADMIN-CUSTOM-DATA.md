# Managing Custom Data in Medusa Admin

Hướng dẫn chi tiết về cách cập nhật và quản lý custom data trong Medusa Admin interface.

## 🎯 **Tổng quan**

Hệ thống cho phép bạn:
- ✅ Chọn product type cho từng sản phẩm
- ✅ Nhập custom attributes theo schema
- ✅ Validate data tự động
- ✅ Cập nhật và xóa custom data
- ✅ Xem custom data hiện tại

## 🚀 **API Endpoints**

### 1. **Lấy thông tin sản phẩm với custom data**
```bash
GET /admin/products/{product_id}/custom-data
```

**Response:**
```json
{
  "product": { /* Medusa product data */ },
  "custom_product": {
    "id": "custom_prod_123",
    "product_id": "prod_456",
    "product_type_id": "type_789",
    "custom_attributes": {
      "box_size": "large",
      "box_color": "red",
      "max_items": 10
    }
  },
  "product_type": {
    "id": "type_789",
    "name": "Gift Box",
    "field_schema": [...]
  }
}
```

### 2. **Tạo/Cập nhật custom data**
```bash
POST /admin/products/{product_id}/custom-data
```

**Request Body:**
```json
{
  "product_type_id": "type_789",
  "custom_attributes": {
    "box_size": "large",
    "box_color": "blue",
    "max_items": 15,
    "personalization_available": true
  }
}
```

### 3. **Quản lý custom products**
```bash
# Lấy danh sách custom products
GET /admin/custom-products

# Lấy custom product theo ID
GET /admin/custom-products/{id}

# Cập nhật custom product
PUT /admin/custom-products/{id}

# Xóa custom product
DELETE /admin/custom-products/{id}
```

## 🎨 **React Component Integration**

### Sử dụng component trong admin:

```tsx
import CustomProductData from './components/CustomProductData'

// Trong product edit page
const ProductEditPage = ({ productId }) => {
  return (
    <div>
      {/* Existing product form */}
      <ProductForm productId={productId} />
      
      {/* Custom data section */}
      <CustomProductData productId={productId} />
    </div>
  )
}
```

### Component Features:

1. **Product Type Selection**
   - Dropdown để chọn loại sản phẩm
   - Tự động load product types từ API

2. **Dynamic Form Fields**
   - Tự động tạo form fields dựa trên schema
   - Hỗ trợ các kiểu: text, number, boolean, select, date
   - Validation theo rules của schema

3. **Real-time Updates**
   - Auto-save khi thay đổi
   - Hiển thị current data
   - Error handling

## 📝 **Cách sử dụng trong Admin**

### Bước 1: Truy cập Product Edit Page
1. Vào Medusa Admin
2. Chọn "Products"
3. Click vào sản phẩm cần chỉnh sửa
4. Scroll xuống phần "Custom Product Data"

### Bước 2: Chọn Product Type
1. Chọn loại sản phẩm từ dropdown
2. Form sẽ tự động hiển thị các fields cần thiết

### Bước 3: Nhập Custom Attributes
1. **Gift Box:**
   - Box Size: small, medium, large, extra-large
   - Box Color: text input
   - Max Items: number (1-20)
   - Personalization Available: toggle
   - Personalization Text: text input

2. **Gift Item:**
   - Item Category: chocolate, candy, toy, cosmetic, jewelry, book, other
   - Item Size: tiny, small, medium, large
   - Fragile: toggle
   - Expiry Date: date picker
   - Allergen Info: text input

3. **Gift Card:**
   - Card Type: digital, physical
   - Denomination: number (min: 1)
   - Validity Period: number (1-60 months)
   - Customizable Message: toggle
   - Design Template: birthday, anniversary, christmas, valentine, generic

### Bước 4: Save Changes
1. Click "Save Custom Data"
2. Hệ thống sẽ validate data
3. Hiển thị success/error message

## 🔧 **Advanced Usage**

### 1. **Bulk Operations**
```bash
# Cập nhật nhiều sản phẩm cùng lúc
curl -X POST http://localhost:9000/admin/custom-products/bulk-update \
  -H "Content-Type: application/json" \
  -d '{
    "product_ids": ["prod_1", "prod_2", "prod_3"],
    "product_type_id": "gift-box-type",
    "custom_attributes": {
      "box_size": "medium",
      "box_color": "white"
    }
  }'
```

### 2. **Filter và Search**
```bash
# Lọc theo product type
GET /admin/custom-products?product_type_id=gift-box-type

# Lọc theo attribute value
GET /admin/custom-products?attribute=box_size&value=large

# Search theo product name
GET /admin/custom-products?search=gift
```

### 3. **Export/Import**
```bash
# Export custom products
GET /admin/custom-products/export?format=csv

# Import custom products
POST /admin/custom-products/import
Content-Type: multipart/form-data
```

## 🎯 **Customization**

### 1. **Thêm Product Type mới**
```typescript
// Tạo product type mới
const newProductType = {
  name: "Custom Product",
  slug: "custom-product",
  field_schema: [
    {
      name: "custom_field",
      type: "text",
      label: "Custom Field",
      required: true
    }
  ]
}

// POST to /admin/product-types
```

### 2. **Custom Validation Rules**
```typescript
// Thêm validation rules vào schema
{
  name: "price_range",
  type: "number",
  validation: {
    min: 0,
    max: 1000,
    pattern: "^[0-9]+$"
  }
}
```

### 3. **Custom UI Components**
```tsx
// Tạo custom field renderer
const CustomFieldRenderer = ({ field, value, onChange }) => {
  if (field.type === 'color_picker') {
    return <ColorPicker value={value} onChange={onChange} />
  }
  return <DefaultFieldRenderer field={field} value={value} onChange={onChange} />
}
```

## 🔍 **Troubleshooting**

### Common Issues:

1. **"Product type not found"**
   - Kiểm tra product type ID
   - Đảm bảo product type đã được tạo

2. **"Validation failed"**
   - Kiểm tra data format
   - Đảm bảo required fields được điền
   - Kiểm tra validation rules

3. **"Custom product already exists"**
   - Sử dụng update thay vì create
   - Kiểm tra existing custom product

4. **"API endpoint not found"**
   - Đảm bảo server đang chạy
   - Kiểm tra route configuration
   - Restart server nếu cần

### Debug Commands:
```bash
# Kiểm tra API endpoints
curl http://localhost:9000/admin/product-types
curl http://localhost:9000/admin/custom-products

# Kiểm tra logs
npx medusa logs

# Test specific endpoint
curl -X POST http://localhost:9000/admin/products/PRODUCT_ID/custom-data \
  -H "Content-Type: application/json" \
  -d '{"product_type_id":"TYPE_ID","custom_attributes":{}}'
```

## 📚 **Best Practices**

1. **Data Validation**
   - Luôn validate data trước khi save
   - Sử dụng schema validation
   - Handle errors gracefully

2. **Performance**
   - Lazy load custom data
   - Cache product types
   - Optimize API calls

3. **User Experience**
   - Auto-save functionality
   - Real-time validation
   - Clear error messages
   - Loading states

4. **Security**
   - Validate user permissions
   - Sanitize input data
   - Rate limiting

## 🎉 **Kết luận**

Với hệ thống này, bạn có thể:
- ✅ Quản lý custom data một cách trực quan
- ✅ Validate data tự động
- ✅ Tích hợp dễ dàng vào admin interface
- ✅ Mở rộng linh hoạt cho các use cases khác

Hệ thống sẵn sàng cho production use! 🚀 