import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data.data);
        setName(response.data.data.name);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/users/me',
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data.data);
      alert('Name updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating name');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{
          border: '4px solid #ccc',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</p>;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f0f2f5'
    }}>
      <div style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        width: '350px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: '#3498db',
          borderRadius: '50%',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '36px',
          margin: '0 auto 20px auto'
        }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h1 style={{ marginBottom: '10px', fontSize: '24px' }}>Profile</h1>
        <p style={{ marginBottom: '10px', color: '#555' }}>Edit your name:</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: '10px',
            width: '100%',
            marginBottom: '20px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '10px 20px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              flex: 1,
              marginRight: '10px'
            }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              flex: 1
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
