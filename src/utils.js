import ky from 'ky';
import jwtDecode from 'jwt-decode';

const getAuthToken = async () => {
  let authToken;

  try {
    const data = await ky.get('http://localhost:4000/auth-token', { 
      credentials: 'include',
      headers: { 
        authorization: `Bearer ${window.localStorage.getItem('authToken')}` 
      }
    }).json();

    authToken = data.authToken;
  } catch (err) {
    authToken = null;
  }
  
  return authToken;
};

// use refresh token cookie to request a new auth token and update isLoggedIn and user information in cache
export const refreshAuthToken = async (client, callback) => {
  const authToken = await getAuthToken();

  if (authToken) {
    const { userEmail, userRole } = jwtDecode(authToken);

    window.localStorage.setItem('authToken', authToken);

    client.writeData({
      data: {
        isLoggedIn: true,
        userRole,
        userEmail
      }
    });
  } else {
    window.localStorage.removeItem('authToken');

    client.writeData({
      data: {
        isLoggedIn: false
      }
    });
  }

  callback && callback(authToken);
};

// clear auth token from local storage and update isLoggedIn
export const logoutCleanup = client => {
  window.localStorage.removeItem('authToken');
  client.resetStore();
};