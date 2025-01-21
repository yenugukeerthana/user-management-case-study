import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState({ username: '', email: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) {
          alert('Please log in to access your profile.');
          // window.location.href = '/login'; 
          // Redirect to login
          return;
        }

        const response = await axios.get('http://localhost:5000/profile', {
          headers: { 'x-access-token': token }, // Pass token in headers
        });

        if (response && response.data) {
          setProfile(response.data); // Update state with profile data
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        const errorMessage = err.response?.data?.message || 'Failed to fetch profile';
        alert('Error: ' + errorMessage);

        if (err.response?.status === 401) {
          window.location.href = '/login'; // Redirect to login on unauthorized
        }
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {profile.username || 'Not available'}</p>
      <p>Email: {profile.email || 'Not available'}</p>
    </div>
  );
}

export default Profile;
