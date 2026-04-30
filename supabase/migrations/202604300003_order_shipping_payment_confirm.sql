create or replace function public.confirm_payment(p_order_id uuid, p_provider text, p_provider_reference text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_order record;
  v_payment record;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'UNAUTHORIZED';
  end if;

  select id, status, user_id into v_order from public.orders where id = p_order_id;
  if not found then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  if v_order.status <> 'UNPAID' then
    raise exception 'INVALID_ORDER_STATUS';
  end if;

  select id, status into v_payment from public.payments where order_id = p_order_id order by created_at desc limit 1;
  if not found then
    raise exception 'PAYMENT_NOT_FOUND';
  end if;

  if v_payment.status <> 'PENDING_PAYMENT' then
    raise exception 'PAYMENT_ALREADY_PROCESSED';
  end if;

  update public.payments
  set status = 'PAID',
      provider = p_provider,
      provider_reference = p_provider_reference,
      updated_at = now()
  where id = v_payment.id;

  update public.orders
  set status = 'PAID',
      updated_at = now()
  where id = p_order_id;

  insert into public.audit_logs (user_id, action, model, model_id, metadata)
  values (v_user_id, 'payment_confirmed', 'orders', p_order_id::text, jsonb_build_object('provider', p_provider, 'reference', p_provider_reference));

  return jsonb_build_object('orderId', p_order_id, 'status', 'PAID', 'paymentStatus', 'PAID');
end;
$$;

create or replace function public.update_order_shipping(p_order_id uuid, p_shipping_name text, p_shipping_phone text, p_shipping_addr text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_order record;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'UNAUTHORIZED';
  end if;

  select id, status, user_id into v_order from public.orders where id = p_order_id;
  if not found then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  if v_order.user_id <> v_user_id then
    raise exception 'FORBIDDEN';
  end if;

  update public.orders
  set shipping_name = p_shipping_name,
      shipping_phone = p_shipping_phone,
      shipping_addr = p_shipping_addr,
      updated_at = now()
  where id = p_order_id;

  insert into public.audit_logs (user_id, action, model, model_id, metadata)
  values (v_user_id, 'order_shipping_updated', 'orders', p_order_id::text, jsonb_build_object('shippingName', p_shipping_name));

  return jsonb_build_object('orderId', p_order_id, 'shippingName', p_shipping_name);
end;
$$;

create or replace function public.update_order_status(p_order_id uuid, p_status text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_order record;
  v_valid_statuses text[] := array['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUND_REVIEW', 'REFUNDED'];
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'UNAUTHORIZED';
  end if;

  if not (p_status = any(v_valid_statuses)) then
    raise exception 'INVALID_STATUS';
  end if;

  select id, status, user_id into v_order from public.orders where id = p_order_id;
  if not found then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  update public.orders
  set status = p_status,
      updated_at = now()
  where id = p_order_id;

  insert into public.audit_logs (user_id, action, model, model_id, metadata)
  values (v_user_id, 'order_status_updated', 'orders', p_order_id::text, jsonb_build_object('oldStatus', v_order.status, 'newStatus', p_status));

  return jsonb_build_object('orderId', p_order_id, 'status', p_status);
end;
$$;
