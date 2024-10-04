import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabaseClient';
import LogoutButton from '../components/LogoutButton'; 
import { useRouter } from 'next/router'; 
import styles from '../styles/AdminPanel.module.css';
import '../styles/global.css'; 

export const getServerSideProps = async (context) => {
  const { req } = context;
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      props: { user: decoded },
    };
  } catch {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};

const AdminPanel = ({ user }) => {
  const [bio, setBio] = useState('');
  const [profileImgUrl, setProfileImgUrl] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    if (data) {
      setBio(data.bio || '');
      setProfileImgUrl(data.profile_image_url || '');
      setProfileExists(true);
    } else {
      console.warn('No profile data found for user_id:', user.id);
      setProfileExists(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user.id]);

  const handleSave = async () => {
    if (!profileExists) {
      const { error } = await supabase
        .from('profiles')
        .insert([{ user_id: user.id, bio, profile_image_url: profileImgUrl }]);

      if (error) {
        console.error('Error creating profile:', error);
        return;
      }
    } else {
      const { error } = await supabase
        .from('profiles')
        .update({ bio, profile_image_url: profileImgUrl })
        .eq('user_id', user.id);
      if (error) {
        console.error('Error updating profile:', error);
        return;
      }
    }

    await fetchProfile();
    setEditMode(false);
  };

  const handleLogoutSuccess = () => {
    router.push('/login');
  };

  return (
    <div>
      <div className={styles.adminContainer}>
        <h1>Dashboard</h1>
        <h3 className={styles.user}>{user.username}</h3>
      </div>
      <div className={styles.adminPanel}>
        <h2>Account</h2>
      {editMode ? (
        <div>
          <textarea 
            className={styles.textarea} 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            placeholder="Bio" 
          />
          <input
            className={styles.input} 
            type="text"
            value={profileImgUrl}
            onChange={(e) => setProfileImgUrl(e.target.value)}
            placeholder="Profile Image URL"
          />
          <button className={styles.button} onClick={handleSave}>Save</button>
          <button className={styles.button} onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div className={styles.accountDetails}>
           {/* <div className={styles.accountDetails}> */}
          {profileExists ? (
            <>
              <p>Bio: {bio}</p>
              {profileImgUrl && <img className={styles.profileImg} src={profileImgUrl} alt="Profile" />}
              <button className={styles.button} onClick={() => setEditMode(true)}>Edit</button>
            </>
          ) : (
            <div>
              <p>No profile data found. Please add your profile information.</p>
              <button className={styles.button} onClick={() => setEditMode(true)}>Add Profile</button>
            </div>
          )}
        </div>
      )}

      <LogoutButton onLogoutSuccess={handleLogoutSuccess} setMessage={setMessage} />
      {message && <p className={styles.message}>{message}</p>}
      </div>

    </div>
  );
};

export default AdminPanel;
