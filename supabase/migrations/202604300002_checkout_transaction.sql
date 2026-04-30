create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null default 'PENDING_PAYMENT' check (status in ('PENDING_PAYMENT', 'PAID', 'FAILED', 'CANCELLED', 'REFUND_REVIEW', 'REFUNDED')),
  provider text,
  provider_reference text,
  amount numeric(12,2) not null check (amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.create_checkout_order(p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_order_id uuid;
  v_total numeric(12,2) := 0;
  v_item jsonb;
  v_product record;
  v_quantity integer;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'UNAUTHORIZED';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'INVALID_ITEMS';
  end if;

  create temporary table if not exists checkout_items (
    product_id uuid primary key,
    quantity integer not null check (quantity > 0),
    price numeric(12,2) not null check (price >= 0)
  ) on commit drop;

  truncate table checkout_items;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_quantity := nullif((v_item ->> 'quantity'), '')::integer;
    if v_quantity is null or v_quantity <= 0 then
      raise exception 'INVALID_QUANTITY';
    end if;

    select id, price, stock_quantity, approval_status
    into v_product
    from public.products
    where id = (v_item ->> 'productId')::uuid
    for update;

    if not found then
      raise exception 'PRODUCT_NOT_FOUND';
    end if;

    if v_product.approval_status <> 'APPROVED' then
      raise exception 'PRODUCT_NOT_APPROVED';
    end if;

    if v_product.stock_quantity < v_quantity then
      raise exception 'INSUFFICIENT_STOCK';
    end if;

    insert into checkout_items (product_id, quantity, price)
    values (v_product.id, v_quantity, v_product.price)
    on conflict (product_id)
    do update set quantity = checkout_items.quantity + excluded.quantity;
  end loop;

  select coalesce(sum(quantity * price), 0) into v_total from checkout_items;

  insert into public.orders (user_id, status, total_amount)
  values (v_user_id, 'UNPAID', v_total)
  returning id into v_order_id;

  insert into public.order_items (order_id, product_id, quantity, price)
  select v_order_id, product_id, quantity, price from checkout_items;

  update public.products p
  set stock_quantity = p.stock_quantity - ci.quantity,
      updated_at = now()
  from checkout_items ci
  where p.id = ci.product_id;

  insert into public.payments (order_id, status, amount)
  values (v_order_id, 'PENDING_PAYMENT', v_total);

  insert into public.audit_logs (user_id, action, model, model_id, metadata)
  values (v_user_id, 'order_created_checkout', 'orders', v_order_id::text, jsonb_build_object('totalAmount', v_total));

  return jsonb_build_object('orderId', v_order_id, 'status', 'UNPAID', 'paymentStatus', 'PENDING_PAYMENT', 'totalAmount', v_total);
end;
$$;
