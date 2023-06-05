import router from 'next/router';
import { useState, useEffect } from 'react';

const useLoggedInUser = () => {
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setLoggedInUser(JSON.parse(user));   
      //  alert(user);
    }
  }, []);

  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setLoggedInUser(null);
    router.push("/"); // Navigate to the dashboard page
    router.reload();
  };

  return { loggedInUser, handleLogout };
};

export default useLoggedInUser;
