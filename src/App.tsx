// import { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { Button } from './components/ui/button';
// import { Input } from './components/ui/input';
// import { Label } from './components/ui/label';
// import { Toaster } from 'sonner';
// import { toast } from 'sonner';
// import { supabase } from './lib/supabase/supabaseClient';
// import EventRegistrationPage from './pages/EventRegistrationPage';
// import AdminDashboard from './pages/AdminDashboard';

// function App() {
//   const [user, setUser] = useState<any>(null);
//   const [showLogin, setShowLogin] = useState(false);
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false); // New state for role selection

//   useEffect(() => {
//     checkUser();
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user ?? null);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   async function checkUser() {
//     const { data: { user } } = await supabase.auth.getUser();
//     setUser(user);
//   }

//   async function handleSignIn(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       if (isSignUp) {
//         // Handle signup
//         const { error, data } = await supabase.auth.signUp({
//           email,
//           password,
//           options: {
//             emailRedirectTo: window.location.origin,
//             data: {
//               is_admin: isAdmin // Store the role in user metadata
//             }
//           },
//         });
        
//         if (error) {
//           toast.error('Error signing up: ' + error.message);
//         } else {
//           toast.success('Signup successful! Please check your email for verification.');
//           setShowLogin(false);
//           setEmail('');
//           setPassword('');
//           setIsAdmin(false);
//         }
//       } else {
//         // Handle signin
//         const { error } = await supabase.auth.signInWithPassword({
//           email,
//           password,
//         });
        
//         if (error) {
//           toast.error('Error signing in: ' + error.message);
//         } else {
//           toast.success('Successfully signed in');
//           setShowLogin(false);
//           setEmail('');
//           setPassword('');
//         }
//       }
//     } catch (error) {
//       toast.error(`Error ${isSignUp ? 'signing up' : 'signing in'}`);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleSignOut() {
//     const { error } = await supabase.auth.signOut();
//     if (error) {
//       toast.error('Error signing out: ' + error.message);
//     } else {
//       toast.success('Successfully signed out');
//     }
//   }

//   return (
//     <Router>
//       <div className="min-h-screen bg-background">
//         <nav className="border-b">
//           <div className="w-full px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4"> {/* full-width */}
//             <div className="flex gap-4 items-center">
//               <Link to="/" className="text-xl font-bold">
//                 Event Registration
//               </Link>
//               {user && (
//                 <Link to="/admin">
//                   <Button variant="outline">Admin Dashboard</Button>
//                 </Link>
//               )}
//             </div>
//             <div>
//               {user ? (
//                 <Button onClick={handleSignOut} variant="outline">
//                   Sign Out ({user.email})
//                 </Button>
//               ) : (
//                 <Button onClick={() => setShowLogin(true)} variant="outline">
//                   Sign In / Sign Up
//                 </Button>
//               )}
//             </div>
//           </div>
//         </nav>

//         <main className="w-full px-4 py-8"> {/* full-width */}
//           <Routes>
//             <Route path="/" element={<EventRegistrationPage />} />
//             <Route path="/admin" element={<AdminDashboard />} />
//           </Routes>
//         </main>

//         {showLogin && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
//               <h2 className="text-2xl font-bold mb-4 text-black">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
//               <form onSubmit={handleSignIn} className="space-y-4">
//                 <div>
//                   <Label htmlFor="email">Email</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     placeholder="Enter your email"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="password">Password</Label>
//                   <Input
//                     id="password"
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     placeholder="Enter your password"
//                   />
//                 </div>
                
//                 {/* Add role selection for signup */}
//                 {isSignUp && (
//                   <div className="flex items-center space-x-2">
//                     <Label htmlFor="role">Account Type:</Label>
//                     <div className="flex space-x-4">
//                       <div className="flex items-center">
//                         <input
//                           type="radio"
//                           id="user-role"
//                           name="role"
//                           checked={!isAdmin}
//                           onChange={() => setIsAdmin(false)}
//                           className="mr-2"
//                         />
//                         <Label htmlFor="user-role">User</Label>
//                       </div>
//                       <div className="flex items-center">
//                         <input
//                           type="radio"
//                           id="admin-role"
//                           name="role"
//                           checked={isAdmin}
//                           onChange={() => setIsAdmin(true)}
//                           className="mr-2"
//                         />
//                         <Label htmlFor="admin-role">Admin</Label>
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 <div className="flex gap-2">
//                   <Button 
//                     type="submit" 
//                     disabled={loading} 
//                     className="flex-1 bg-black text-white border border-white hover:bg-white hover:text-black"
//                     style={{backgroundColor: '#000000', color: '#ffffff', border: '1px solid #ffffff'}}
//                   >
//                     {loading ? (isSignUp ? 'Signing Up...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => setShowLogin(false)}
//                     className="bg-black text-white border border-white hover:bg-white hover:text-black"
//                     style={{backgroundColor: '#000000', color: '#ffffff', border: '1px solid #ffffff'}}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//                 <div className="text-center">
//                   <button 
//                     type="button" 
//                     onClick={() => setIsSignUp(!isSignUp)} 
//                     className="text-blue-500 hover:underline text-sm"
//                     style={{backgroundColor: 'transparent', color: '#000000', border: 'none'}}
//                   >
//                     {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//       <Toaster />
//     </Router>
//   )
// }

// export default App







import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import { supabase } from './lib/supabase/supabaseClient';
import EventRegistrationPage from './pages/EventRegistrationPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [user, setUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              is_admin: isAdmin
            }
          },
        });

        if (error) {
          toast.error('Error signing up: ' + error.message);
        } else {
          toast.success('Signup successful! Please check your email for verification.');
          setShowLogin(false);
          setEmail('');
          setPassword('');
          setIsAdmin(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error('Error signing in: ' + error.message);
        } else {
          toast.success('Successfully signed in');
          setShowLogin(false);
          setEmail('');
          setPassword('');
        }
      }
    } catch (error) {
      toast.error(`Error ${isSignUp ? 'signing up' : 'signing in'}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out: ' + error.message);
    } else {
      toast.success('Successfully signed out');
    }
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <nav className="border-b bg-white">
          <div className="w-full max-w-screen-xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <Link to="/" className="text-xl font-bold">
                Event Registration
              </Link>
              {user && (
                <Link to="/admin">
                  <Button variant="outline">Admin Dashboard</Button>
                </Link>
              )}
            </div>
            <div className="flex justify-center">
              {user ? (
                <Button onClick={handleSignOut} variant="outline">
                  Sign Out ({user.email})
                </Button>
              ) : (
                <Button onClick={() => setShowLogin(true)} variant="outline">
                  Sign In / Sign Up
                </Button>
              )}
            </div>
          </div>
        </nav>

        <main className="w-full max-w-screen-xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<EventRegistrationPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        {showLogin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4 text-black text-center">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                  />
                </div>

                {isSignUp && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <Label htmlFor="role" className="whitespace-nowrap">Account Type:</Label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="user-role"
                          name="role"
                          checked={!isAdmin}
                          onChange={() => setIsAdmin(false)}
                        />
                        <span>User</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="admin-role"
                          name="role"
                          checked={isAdmin}
                          onChange={() => setIsAdmin(true)}
                        />
                        <span>Admin</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="flex-1 bg-black text-white border border-white hover:bg-white hover:text-black"
                    style={{backgroundColor: '#000000', color: '#ffffff', border: '1px solid #ffffff'}}
                  >
                    {loading ? (isSignUp ? 'Signing Up...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowLogin(false)}
                    className="bg-black text-white border border-white hover:bg-white hover:text-black"
                    style={{backgroundColor: '#000000', color: '#ffffff', border: '1px solid #ffffff'}}
                  >
                    Cancel
                  </Button>
                </div>
                <div className="text-center">
                  <button 
                    type="button" 
                    onClick={() => setIsSignUp(!isSignUp)} 
                    className="text-blue-500 hover:underline text-sm"
                    style={{backgroundColor: 'transparent', color: '#000000', border: 'none'}}
                  >
                    {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </Router>
  );
}

export default App;
