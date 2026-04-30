# Gift Combo Prompt

```text
Tao goi y combo qua tang OCOP tu danh sach san pham co san.

Yeu cau:
{{COMBO_INPUT_JSON}}

Khong duoc chon san pham ngoai danh sach.
Tong gia combo phai nam trong ngan sach neu co the.

Tra ve JSON theo schema:
{
  "combos": [
    {
      "name": "string",
      "description": "string",
      "productIds": ["string"],
      "estimatedTotal": 0,
      "targetCustomer": "string",
      "sellingAngle": "string"
    }
  ]
}
```
