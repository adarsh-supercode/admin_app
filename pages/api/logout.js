// pages/api/logout.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        // Clear the token cookie by setting it to an empty value with an immediate expiration time
        res.setHeader('Set-Cookie', 'token=; Path=/; HttpOnly; Max-Age=0;');
        return res.status(200).json({ message: 'Logout successful!' });
      } catch (err) {
        console.error('Error during logout:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  }
  