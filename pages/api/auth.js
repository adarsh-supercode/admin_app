// pages/api/auth.js

import { supabase } from '../../lib/supabaseClient';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { type, username, password } = req.body;

    try {
      if (type === 'signup') {
        // Check if the username already exists
        const { data: existingUser, error: checkError } = await supabase
          .from('admin_panel')
          .select('*')
          .eq('username', username);

        if (checkError) {
          console.error('Check Error:', checkError.message);
          return res.status(400).json({ message: 'Error checking username.' });
        }

        if (existingUser.length > 0) {
          return res.status(400).json({ message: 'Username already exists.' });
        }

        // Insert new user into the admin_panel table
        const { error: insertError } = await supabase
          .from('admin_panel')
          .insert([{ username, password }]); 

        if (insertError) {
          console.error('Insert Error:', insertError.message);
          return res.status(400).json({ message: insertError.message });
        }

        return res.status(200).json({ message: 'Signup successful!' });
      }

      if (type === 'login') {
        // Find user by username
        const { data: userData, error: fetchError } = await supabase
          .from('admin_panel')
          .select('*')
          .eq('username', username)
          .single();

        if (fetchError || !userData || userData.password !== password) {
          return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Create a JWT token
        const token = jwt.sign({ username: userData.username }, process.env.JWT_SECRET, {
          expiresIn: '7d', 
        });

        return res.status(200).json({ message: 'Login successful!', token }); 
      }

      // If method is not POST, return method not allowed
      return res.status(405).json({ message: 'Method not allowed' });
    } catch (error) {
      console.error('Server Error:', error.message);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}