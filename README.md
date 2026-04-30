# OCOP AIHub White-Label Commerce Platform

Bo tai lieu khoi tao du an nen tang thuong mai dien tu white-label cho san pham OCOP, dac san dia phuong, dai ly ban lai, nha cung cap va AIHub van hanh.

## Muc tieu

Xay dung mot he thong production-first gom:

- Marketplace/commerce core cho san pham OCOP.
- White-label storefront cho reseller/dai ly/KOL/doanh nghiep qua tang.
- Supplier dashboard cho chu the OCOP.
- Admin dashboard de duyet, van hanh, doi soat.
- Order/payment/shipping lifecycle that.
- AIHub dung NVIDIA API/NIM de tao noi dung, kiem tra du lieu, goi y combo, chat tu van, phan tich van hanh.
- Codex engineering workflow: AIHub tao brief ro rang, Codex lap trinh tren branch/PR, con nguoi review va merge.

## Stack de xuat

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Supabase Auth/Storage hoac tuong duong
- NVIDIA API/NIM cho AIHub
- Vercel deploy
- GitHub + Codex workflow
- Sentry/logging

## Tai lieu quan trong

- `AGENTS.md`: huong dan goc cho Codex/coding agents.
- `docs/ARCHITECTURE.md`: kien truc tong the.
- `docs/API_CONTRACTS.md`: hop dong API.
- `docs/TASK_GRAPH.md`: phu thuoc task de khoi tao song song.
- `docs/TASKS_PARALLEL.md`: ke hoach chia wave song song.
- `docs/CODEX_TASK_TEMPLATE.md`: mau giao viec cho Codex.
- `docs/MASTER_PROJECT_SPEC.md`: dac ta du an tong the.
- `docs/aihub/AIHUB_RUNTIME.md`: AIHub tu lap trinh den van hanh.
- `docs/operations/RUNBOOK.md`: van hanh hang ngay va xu ly su co.
- `docs/security/SECURITY_RULES.md`: quy tac bao mat.

## Cach dung bo tai lieu nay

1. Tao repo GitHub moi.
2. Copy toan bo file trong goi nay vao repo.
3. Tao project Next.js theo `docs/SETUP.md`.
4. Yeu cau Codex doc `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/TASK_GRAPH.md` truoc khi lam task.
5. Chia task theo wave trong `docs/TASKS_PARALLEL.md`.
6. Moi task mot branch, mot PR, khong sua module khong lien quan.

## Nguyen tac toi thieu

- Khong dung mock data trong production.
- Khong goi AI provider tu frontend.
- Khong lo secret/API key.
- Khong auto-duyet san pham, chung nhan, thanh toan, hoan tien.
- Moi AI task phai ghi log `AiGeneration`.
- Codex chi tao branch/PR, khong tu merge production.
