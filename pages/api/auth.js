import { supabase } from '../../lib/supabaseClient';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { type, username, email, password } = req.body;

    try {
      if (type === 'signup') {
        // Check if the username already exists
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('*')
          .eq('username', username);

        if (checkError) {
          return res.status(400).json({ message: 'Error checking username.' });
        }

        if (existingUser.length > 0) {
          return res.status(400).json({ message: 'Username already exists.' });
        }

        // Hash the password before inserting it into the database
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        // Insert new user into the users table
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ username, email, password: hashedPassword }]); // Use hashed password

        if (insertError) {
          return res.status(400).json({ message: insertError.message });
        }

        return res.status(200).json({ message: 'Signup successful!' });
      }

      if (type === 'login') {
        // Find user by username
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .single();

        // Log the fetched user data
        console.log('Fetched user data:', userData);

        // Check if there was an error with the query or no user found
        if (fetchError || !userData) {
          return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Check if the provided password matches the hashed password
        const isPasswordValid = await bcrypt.compare(password, userData.password);

        if (!isPasswordValid) {
          return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Create a JWT token
        const token = jwt.sign({ username: userData.username, id: userData.id }, process.env.JWT_SECRET, {
          expiresIn: '7d',
        });

        // Set the token as a cookie
        res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; Max-Age=604800;`);
        return res.status(200).json({ message: 'Login successful!', token });
      }

      return res.status(405).json({ message: 'Method not allowed' });
    } catch (err) {
      console.error('Error during authentication:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
