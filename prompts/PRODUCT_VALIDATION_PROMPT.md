# Product Validation Prompt

```text
Kiem tra du lieu san pham OCOP sau co du dieu kien dang ban chua.

Du lieu:
{{PRODUCT_JSON}}

Tra ve JSON theo schema:
{
  "isReadyToPublish": true,
  "score": 0,
  "missingFields": ["string"],
  "riskWarnings": ["string"],
  "recommendedFixes": ["string"]
}

score la so tu 0 den 100.
AI chi duoc danh gia, khong duoc tu phe duyet san pham.
```
