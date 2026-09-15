const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Auth API',
    version: '1.0.0',
    description: 'Express + Supabase Auth API with protected routes'
  },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: {
    '/auth/signup': {
      post: {
        summary: 'Create a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'user@example.com' },
                  password: { type: 'string', example: 'password123' }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          201: { description: 'User created' },
          400: { description: 'Missing email or password' }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Log in and receive a JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'user@example.com' },
                  password: { type: 'string', example: 'password123' }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          200: { description: 'Login successful — returns access_token and refresh_token' },
          400: { description: 'Missing email or password' },
          401: { description: 'Invalid login credentials' }
        }
      }
    },
    '/auth/logout': {
      post: {
        summary: 'Log out the current user',
        security: [{ bearerAuth: [] }],
        responses: {
          204: { description: 'Logged out' },
          401: { description: 'Access token required or invalid' }
        }
      }
    },
    '/public/info': {
      get: {
        summary: 'Public information — no auth required',
        responses: {
          200: { description: 'Public message' }
        }
      }
    },
    '/protected/profile': {
      get: {
        summary: 'Get the current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'User profile (id, email, created_at)' },
          401: { description: 'Missing or invalid token' }
        }
      }
    },
    '/protected/dashboard': {
      get: {
        summary: 'Get the user dashboard',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Dashboard data' },
          401: { description: 'Missing or invalid token' }
        }
      }
    }
  }
};

export default swaggerDocument;