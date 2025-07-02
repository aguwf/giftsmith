# Product Types Module

Module này cho phép bạn tạo các loại sản phẩm tùy chỉnh với các thuộc tính riêng biệt cho từng loại sản phẩm như gift box, gift items, gift card.

## Cách hoạt động

### 1. Product Types (Loại sản phẩm)
- Định nghĩa các loại sản phẩm khác nhau (gift box, gift item, gift card)
- Mỗi loại có một schema riêng định nghĩa các thuộc tính tùy chỉnh
- Hỗ trợ các kiểu dữ liệu: text, number, boolean, select, json, date, url

### 2. Custom Products (Sản phẩm tùy chỉnh)
- Liên kết sản phẩm Medusa với một product type
- Lưu trữ các thuộc tính tùy chỉnh dưới dạng JSON
- Validation tự động dựa trên schema của product type

## Các loại sản phẩm mẫu

### Gift Box
- **box_size**: Kích thước hộp (small, medium, large, extra-large)
- **box_color**: Màu sắc hộp
- **max_items**: Số lượng item tối đa
- **personalization_available**: Có thể cá nhân hóa không
- **personalization_text**: Văn bản cá nhân hóa

### Gift Item
- **item_category**: Danh mục item (chocolate, candy, toy, cosmetic, jewelry, book, other)
- **item_size**: Kích thước item (tiny, small, medium, large)
- **fragile**: Item dễ vỡ không
- **expiry_date**: Ngày hết hạn
- **allergen_info**: Thông tin dị ứng

### Gift Card
- **card_type**: Loại thẻ (digital, physical)
- **denomination**: Mệnh giá
- **validity_period**: Thời hạn hiệu lực (tháng)
- **customizable_message**: Có thể tùy chỉnh tin nhắn không
- **design_template**: Mẫu thiết kế (birthday, anniversary, christmas, valentine, generic)

## API Endpoints

### Quản lý Product Types
- `GET /admin/product-types` - Lấy danh sách product types
- `POST /admin/product-types` - Tạo product type mới

### Quản lý Custom Products
- `GET /admin/custom-products` - Lấy danh sách custom products
- `GET /admin/custom-products?product_type_id=xxx` - Lọc theo product type
- `POST /admin/custom-products` - Tạo custom product mới

## Ví dụ sử dụng

### Tạo Gift Box
```json
POST /admin/custom-products
{
  "product_id": "prod_123",
  "product_type_id": "gift-box-type-id",
  "custom_attributes": {
    "box_size": "large",
    "box_color": "red",
    "max_items": 10,
    "personalization_available": true,
    "personalization_text": "Happy Birthday!"
  }
}
```

### Tạo Gift Item
```json
POST /admin/custom-products
{
  "product_id": "prod_456",
  "product_type_id": "gift-item-type-id",
  "custom_attributes": {
    "item_category": "chocolate",
    "item_size": "medium",
    "fragile": false,
    "expiry_date": "2024-12-31",
    "allergen_info": "Contains nuts"
  }
}
```

## Chạy seed data

Để tạo các product types mẫu:

```bash
npx medusa exec ./src/scripts/seed-product-types.ts
```

## Validation

Hệ thống tự động validate các thuộc tính tùy chỉnh dựa trên:
- Kiểu dữ liệu (text, number, boolean, select, date)
- Giá trị tối thiểu/tối đa cho number
- Pattern matching cho text
- Options cho select fields
- Required fields

## Mở rộng

Bạn có thể dễ dàng thêm các loại sản phẩm mới bằng cách:
1. Tạo product type mới với schema tùy chỉnh
2. Thêm vào seed script
3. Sử dụng API để tạo custom products 