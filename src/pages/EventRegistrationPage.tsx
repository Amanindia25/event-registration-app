// import { useEffect, useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
// import { Button } from '../components/ui/button';
// import { toast } from 'sonner';
// import { supabase } from '../lib/supabase/supabaseClient';
// import { handleSupabaseError, logError } from '../lib/supabase/errorHandler';

// import type { Event } from '../types';

// // Default events; will be seeded into Supabase if events table is empty
// const DEFAULT_EVENTS: Omit<Event, 'id'>[] = [
//   { name: 'Tech Conference 2024', date: '2024-09-15' },
//   { name: 'Startup Pitch Night', date: '2024-10-05' },
//   { name: 'AI Workshop', date: '2024-11-12' },
//   { name: 'Networking Meetup', date: '2024-12-01' },
// ];

// interface Registration {
//   id: string;
//   user_id: string;
//   event_id: string;
// }

// export default function EventRegistrationPage() {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [registrations, setRegistrations] = useState<Registration[]>([]);
//   const [selected, setSelected] = useState<string[]>([]); // event ids chosen but not yet submitted
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     checkUser();
//     fetchEvents();
//   }, []);

//   useEffect(() => {
//     if (user) {
//       fetchUserRegistrations();
//     }
//   }, [user]);

//   async function checkUser() {
//     const { data: { user } } = await supabase.auth.getUser();
//     setUser(user);
//   }

//   async function fetchUserRegistrations() {
//     try {
//       const { data, error } = await supabase
//         .from('registrations')
//         .select('*')
//         .eq('user_id', user.id);

//       if (error) throw error;
//       setRegistrations(data || []);
//     } catch (error) {
//       logError('fetchUserRegistrations', error);
//       toast.error(handleSupabaseError(error as Error));
//     }
//   }

//   async function fetchEvents() {
//     try {
//       const { data, error } = await supabase.from('events').select('*');
//       if (error) throw error;

//       if (!data || data.length === 0) {
//         // Seed default events if table empty
//         const { data: seeded, error: seedError } = await supabase
//           .from('events')
//           .insert(DEFAULT_EVENTS)
//           .select();
//         if (seedError) throw seedError;
//         setEvents(seeded as Event[]);
//       } else {
//         setEvents(data as Event[]);
//       }
//     } catch (error) {
//       logError('fetchEvents', error);
//       toast.error(handleSupabaseError(error as Error));
//     } finally {
//       setLoading(false);
//     }
//   }

//   function toggleSelection(eventId: string) {
//     setSelected((prev) =>
//       prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
//     );
//   }

//   async function submitRegistrations() {
//     if (!user) {
//       toast.error('Please sign in to submit registrations');
//       return;
//     }

//     if (selected.length === 0) {
//       toast.error('No events selected');
//       return;
//     }

//     try {
//       const inserts = selected.map((event_id) => ({ user_id: user.id, event_id }));
//       const { error } = await supabase.from('registrations').insert(inserts);
//       if (error) throw error;

//       toast.success('Registrations saved');
//       setSelected([]);
//       fetchUserRegistrations();
//     } catch (error) {
//       logError('submitRegistrations', error);
//       toast.error(handleSupabaseError(error as Error));
//     }
//   }

//   async function handleCancelRegistration(eventId: string) {
//     try {
//       const { error } = await supabase
//         .from('registrations')
//         .delete()
//         .eq('user_id', user.id)
//         .eq('event_id', eventId);

//       if (error) throw error;
//       toast.success('Registration cancelled');
//       fetchUserRegistrations();
//     } catch (error) {
//       logError('handleCancelRegistration', error);
//       toast.error(handleSupabaseError(error as Error));
//     }
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//           <span className="ml-3 text-lg">Loading events...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full px-4 py-8"> {/* full-width */}
//       <h1 className="text-3xl font-bold mb-8 text-center">Event Registration</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"> {/* extra xl column */}
//         <div>
//           <h2 className="text-2xl font-semibold mb-4">Available Events</h2>
//           <div className="space-y-4">
//             {events.map((event) => {
//               const isRegistered = registrations.some(r => r.event_id === event.id);
//               return (
//                 <Card key={event.id}>
//                   <CardHeader>
//                     <CardTitle>{event.name}</CardTitle>
//                     <CardDescription>
//                       Date: {new Date(event.date).toLocaleDateString()}
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <Button
//                       onClick={() =>
//                         isRegistered ? handleCancelRegistration(event.id) : toggleSelection(event.id)
//                       }
//                       variant={isRegistered ? 'destructive' : selected.includes(event.id) ? 'secondary' : 'default'}
//                       className="w-full py-2 mt-2 bg-black text-white border border-white hover:bg-white hover:text-black"
//                       style={{backgroundColor: '#000000', color: '#ffffff', border: '1px solid #ffffff'}}
//                     >
//                       {isRegistered ? 'Cancel Registration' : selected.includes(event.id) ? 'Selected' : 'Register'}
//                     </Button>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         </div>

//         <div>
//           <h2 className="text-2xl font-semibold mb-4">Your Registrations</h2>
//           <div className="space-y-4">
//             {registrations.map((registration) => {
//               const event = events.find(e => e.id === registration.event_id);
//               if (!event) return null;
//               return (
//                 <Card key={registration.id}>
//                   <CardHeader>
//                     <CardTitle>{event.name}</CardTitle>
//                     <CardDescription>
//                       Date: {new Date(event.date).toLocaleDateString()}
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <Button
//                       variant="destructive"
//                       onClick={() => handleCancelRegistration(event.id)}
//                       className="bg-black text-white border border-white hover:bg-white hover:text-black"
//                       style={{backgroundColor: '#000000', color: '#ffffff', border: '1px solid #ffffff'}}
//                     >
//                       Cancel Registration
//                     </Button>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//             {registrations.length === 0 && (
//               <p className="text-gray-500">No registrations yet</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Submit Button */}
//       <div className="mt-8 flex justify-center">
//         <Button 
//           onClick={submitRegistrations} 
//           disabled={selected.length === 0}
//           className="px-8 py-2 text-lg bg-black text-white border border-white hover:bg-white hover:text-black"
//           style={{backgroundColor: '#000000', color: '#ffffff', border: '1px solid #ffffff'}}
//         >
//           Submit Registration
//         </Button>
//       </div>
//     </div>
//   );
// }






import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase/supabaseClient';
import { handleSupabaseError, logError } from '../lib/supabase/errorHandler';
import type { Event } from '../types';

const DEFAULT_EVENTS: Omit<Event, 'id'>[] = [
  { name: 'Tech Conference 2024', date: '2024-09-15' },
  { name: 'Startup Pitch Night', date: '2024-10-05' },
  { name: 'AI Workshop', date: '2024-11-12' },
  { name: 'Networking Meetup', date: '2024-12-01' },
];

interface Registration {
  id: string;
  user_id: string;
  event_id: string;
}

export default function EventRegistrationPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
    fetchEvents();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserRegistrations();
    }
  }, [user]);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  async function fetchUserRegistrations() {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      logError('fetchUserRegistrations', error);
      toast.error(handleSupabaseError(error as Error));
    }
  }

  async function fetchEvents() {
    try {
      const { data, error } = await supabase.from('events').select('*');
      if (error) throw error;

      if (!data || data.length === 0) {
        const { data: seeded, error: seedError } = await supabase
          .from('events')
          .insert(DEFAULT_EVENTS)
          .select();
        if (seedError) throw seedError;
        setEvents(seeded as Event[]);
      } else {
        setEvents(data as Event[]);
      }
    } catch (error) {
      logError('fetchEvents', error);
      toast.error(handleSupabaseError(error as Error));
    } finally {
      setLoading(false);
    }
  }

  function toggleSelection(eventId: string) {
    setSelected((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  }

  async function submitRegistrations() {
    if (!user) {
      toast.error('Please sign in to submit registrations');
      return;
    }

    if (selected.length === 0) {
      toast.error('No events selected');
      return;
    }

    try {
      const inserts = selected.map((event_id) => ({ user_id: user.id, event_id }));
      const { error } = await supabase.from('registrations').insert(inserts);
      if (error) throw error;

      toast.success('Registrations saved');
      setSelected([]);
      fetchUserRegistrations();
    } catch (error) {
      logError('submitRegistrations', error);
      toast.error(handleSupabaseError(error as Error));
    }
  }

  async function handleCancelRegistration(eventId: string) {
    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', eventId);

      if (error) throw error;
      toast.success('Registration cancelled');
      fetchUserRegistrations();
    } catch (error) {
      logError('handleCancelRegistration', error);
      toast.error(handleSupabaseError(error as Error));
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-3 text-lg">Loading events...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Event Registration</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Events */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center sm:text-left">Available Events</h2>
          <div className="flex flex-col gap-4">
            {events.map((event) => {
              const isRegistered = registrations.some(r => r.event_id === event.id);
              return (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>
                      Date: {new Date(event.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() =>
                        isRegistered ? handleCancelRegistration(event.id) : toggleSelection(event.id)
                      }
                      variant={isRegistered ? 'destructive' : selected.includes(event.id) ? 'secondary' : 'default'}
                      className="w-full py-2 mt-2 bg-black text-white border border-white hover:bg-white hover:text-black"
                      style={{ backgroundColor: '#000000', color: '#ffffff', border: '1px solid #ffffff' }}
                    >
                      {isRegistered ? 'Cancel Registration' : selected.includes(event.id) ? 'Selected' : 'Register'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* User Registrations */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center sm:text-left">Your Registrations</h2>
          <div className="flex flex-col gap-4">
            {registrations.map((registration) => {
              const event = events.find(e => e.id === registration.event_id);
              if (!event) return null;
              return (
                <Card key={registration.id}>
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>
                      Date: {new Date(event.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="destructive"
                      onClick={() => handleCancelRegistration(event.id)}
                      className="w-full py-2 bg-black text-white border border-white hover:bg-white hover:text-black"
                      style={{ backgroundColor: '#000000', color: '#ffffff', border: '1px solid #ffffff' }}
                    >
                      Cancel Registration
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
            {registrations.length === 0 && (
              <p className="text-gray-500 text-center sm:text-left">No registrations yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-10 flex justify-center">
        <Button
          onClick={submitRegistrations}
          disabled={selected.length === 0}
          className="px-8 py-2 text-lg bg-black text-white border border-white hover:bg-white hover:text-black"
          style={{ backgroundColor: '#000000', color: '#ffffff', border: '1px solid #ffffff' }}
        >
          Submit Registration
        </Button>
      </div>
    </div>
  );
}
