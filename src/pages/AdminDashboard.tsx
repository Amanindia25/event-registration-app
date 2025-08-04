import { useEffect, useState } from 'react';


import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase/supabaseClient';
import { handleSupabaseError, logError } from '../lib/supabase/errorHandler';
import { format } from 'date-fns';
// Note: You need to install the date-fns package first:
// Run: npm install date-fns
import type { RegistrationWithEvent } from '../types';
import type { User } from '@supabase/supabase-js';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<RegistrationWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        logError('checkAdmin', authError);
        toast.error(handleSupabaseError(authError));
        navigate('/');
        return;
      }
      if (!user) {
        toast.error('Please sign in to access admin dashboard');
        navigate('/');
        return;
      }

      // Check if user has admin role using user metadata
      // This assumes you've set up admin roles in Supabase
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        logError('checkAdmin', profileError);
        toast.error(handleSupabaseError(profileError));
        navigate('/');
        return;
      }

      if (!profile || profile.role !== 'admin') {
        toast.error('Unauthorized access - Admin privileges required');
        navigate('/');
        return;
      }

      setUser(user);
      fetchRegistrations();
    } catch (error) {
      logError('checkAdmin', error);
      toast.error(handleSupabaseError(error as Error));
      navigate('/');
    }
  }

  async function fetchRegistrations(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    try {
      // Fetch registrations with event details
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          id,
          user_id,
          created_at,
          events (id, name, date, created_at)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      interface DbRegistration {
        id: string;
        user_id: string;
        created_at: string;
        events: {
          id: string;
          name: string;
          date: string;
          created_at: string;
        };
      }

      // Transform the data to match our types
      const formattedData = (data as unknown as DbRegistration[]).map((registration) => ({
        id: registration.id,
        user_id: registration.user_id,
        event_id: registration.events.id,
        created_at: registration.created_at,
        event: {
          id: registration.events.id,
          name: registration.events.name,
          date: registration.events.date,
          created_at: registration.events.created_at
        }
      }));

      setRegistrations(formattedData as unknown as RegistrationWithEvent[]);
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    } catch (error) {
      logError('fetchRegistrations', error);
      toast.error(handleSupabaseError(error as Error));
    } finally {
      if (!loading) setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-3 text-lg">Loading registrations...</span>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <span className="text-lg">User not authenticated</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* header + refresh button */}
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button 
          onClick={() => fetchRegistrations(true)} 
          variant="outline"
          disabled={refreshing}
          className="bg-black text-white border border-white hover:bg-white hover:text-black"
          style={{backgroundColor: '#000000', color: '#ffffff', border: '1px solid #ffffff'}}
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      <div className="overflow-x-auto"> {/* enable mobile scroll */}
        <table className="min-w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead>Registration ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Event Name</TableHead>
              <TableHead>Event Date</TableHead>
              <TableHead>Registration Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className={refreshing ? 'opacity-50' : ''}>
            {registrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell>{registration.id}</TableCell>
                <TableCell>{registration.user_id}</TableCell>
                <TableCell>{registration.event.name}</TableCell>
                <TableCell>
                  {(() => {
                    try {
                      return format(new Date(registration.event.date), 'PPP');
                    } catch (error) {
                      logError('formatDate', error);
                      return 'Invalid date';
                    }
                  })()}
                </TableCell>
                <TableCell>
                  {(() => {
                    try {
                      return format(new Date(registration.created_at), 'PPP p');
                    } catch (error) {
                      logError('formatDate', error);
                      return 'Invalid date';
                    }
                  })()}
                </TableCell>
              </TableRow>
            ))}
            {registrations.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-lg text-gray-500">No registrations found</p>
                    <p className="text-sm text-gray-400">Registrations will appear here once users sign up for events</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </table>
      </div>
    </div>
  );
}