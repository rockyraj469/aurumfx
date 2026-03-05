import express from 'express';

// Mock user object
const mockUser = {
  id: '1',
  email: 'dev@example.com',
  firstName: 'Dev',
  lastName: 'User',
  profileImageUrl: null,
  createdAt: new Date().toISOString(),
};

// Middleware that simulates authentication
export const isAuthenticated: express.RequestHandler = (req, res, next) => {
  // Check for mock session cookie
  if (req.cookies?.mockSession) {
    // Attach mock user to request
    (req as any).user = {
      claims: { sub: mockUser.id }
    };
    return next();
  }
  // Not authenticated
  return res.status(401).json({ message: 'Unauthorized' });
};

export function setupMockAuth(app: express.Express) {
  // Handle login form submission (email/password)
  app.post('/api/login', express.json(), (req, res) => {
    const { email, password } = req.body;
    // Accept any non-empty email/password for demo
    if (email && password) {
      // Set a cookie to simulate session
      res.cookie('mockSession', 'logged-in', { 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });
      return res.json({ success: true, user: mockUser });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
  });

  // Return mock user on /api/auth/user (used by frontend to check auth)
  app.get('/api/auth/user', (req, res) => {
    if (req.cookies?.mockSession) {
      return res.json(mockUser);
    }
    return res.status(401).json({ message: 'Unauthorized' });
  });

  // Optional: GET login endpoint (redirect to login page)
  app.get('/api/login', (req, res) => {
    res.redirect('/login');
  });

  // Logout endpoint
  app.post('/api/logout', (req, res) => {
    res.clearCookie('mockSession');
    res.json({ success: true });
  });

  // Also keep GET /api/logout for compatibility
  app.get('/api/logout', (req, res) => {
    res.clearCookie('mockSession');
    res.redirect('/login');
  });

  console.log('✅ Using mock authentication for development');
}