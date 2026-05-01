-- Create user profiles table to store roles (links to auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'CUSTOMER' CHECK (role IN ('ADMIN', 'SUPPLIER', 'RESELLER', 'CUSTOMER')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Function to get user role from public.user_profiles
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_role text;
BEGIN
  SELECT up.role INTO v_role FROM public.user_profiles up WHERE up.id = p_user_id;
  RETURN COALESCE(v_role, 'CUSTOMER');
END;
$$;

-- Function to set user role (admin only)
CREATE OR REPLACE FUNCTION public.set_user_role(p_user_id uuid, p_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, role, created_at, updated_at)
  VALUES (p_role, p_role, now(), now())
  ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, updated_at = now();
END;
$$;

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage profiles
CREATE POLICY "Service role can manage profiles" ON public.user_profiles
  FOR ALL USING (true) WITH CHECK (true);