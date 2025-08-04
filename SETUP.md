# Event Registration App - Setup Guide

## Environment Configuration

### 1. Supabase Setup

1. **Create a Supabase project**:

   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key

2. **Configure Environment Variables**:

   ```bash
   # Copy .env.example to .env if it exists
   # Or create .env file with:
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

3. **Database Schema Setup**:
   Run the following SQL in your Supabase SQL editor:

   ```sql
   -- Events table
   CREATE TABLE IF NOT EXISTS public.events (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     name text NOT NULL,
     date date NOT NULL,
     description text,
     created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
   );

   -- Registrations table
   CREATE TABLE IF NOT EXISTS public.registrations (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
     event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
     created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
     UNIQUE(user_id, event_id)
   );

   -- Enable Row Level Security
   ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

   -- Policies for events
   CREATE POLICY "Events are viewable by everyone" ON public.events
     FOR SELECT USING (true);

   CREATE POLICY "Only admins can insert events" ON public.events
     FOR INSERT WITH CHECK (
       EXISTS (
         SELECT 1 FROM public.profiles
         WHERE id = auth.uid() AND role = 'admin'
       )
     );

   -- Policies for registrations
   CREATE POLICY "Users can view their own registrations" ON public.registrations
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can register for events" ON public.registrations
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can cancel their own registrations" ON public.registrations
     FOR DELETE USING (auth.uid() = user_id);

   -- Admin can view all registrations
   CREATE POLICY "Admins can view all registrations" ON public.registrations
     FOR SELECT USING (
       EXISTS (
         SELECT 1 FROM public.profiles
         WHERE id = auth.uid() AND role = 'admin'
       )
     );

   -- Insert sample events
   INSERT INTO public.events (name, date, description) VALUES
   ('Tech Conference 2024', '2024-06-15', 'Annual technology conference'),
   ('Workshop: React Basics', '2024-07-10', 'Learn React fundamentals'),
   ('Networking Event', '2024-08-05', 'Professional networking meetup')
   ON CONFLICT DO NOTHING;
   ```

4. **Profiles Table Setup**:
   Run the SQL from `src/lib/supabase/profiles.sql` to set up user roles.

### 2. Authentication Setup

1. **Enable Authentication**:

   - Go to Authentication > Providers in Supabase dashboard
   - Enable Email provider
   - Configure email templates if needed

2. **Create Admin User**:
   ```sql
   -- After creating your admin user, update their role:
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'your-admin-email@example.com';
   ```

### 3. Development Tips

- **Debug Mode**: In development, `window.supabase` is available in browser console
- **Error Handling**: Check browser console for detailed error messages
- **Environment Validation**: The app now validates your Supabase URL and key format

### 4. Common Issues and Solutions

1. **"Missing Supabase environment variables"**:

   - Ensure your `.env` file exists and has correct values
   - Restart the development server after adding variables

2. **"Unauthorized access" errors**:

   - Check that your user has the 'admin' role in the profiles table
   - Verify RLS policies are correctly configured

3. **Database connection issues**:
   - Ensure your Supabase project is active
   - Check that your IP is allowed in Supabase settings

### 5. Testing Checklist

- [ ] Environment variables are set correctly
- [ ] Database tables are created
- [ ] RLS policies are configured
- [ ] Authentication is working
- [ ] Admin dashboard is accessible for admin users
- [ ] Event registration works for authenticated users
- [ ] Error messages are user-friendly

## Running the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```
