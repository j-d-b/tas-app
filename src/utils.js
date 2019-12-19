import ky from 'ky';
import jwtDecode from 'jwt-decode';

// use the auth-token endpoint to request a new authToken using the refreshToken cookie
const getAuthToken = async () => {
  let authToken;

  try {
    const data = await ky.get(process.env.REACT_APP_REFRESH_TOKEN_URI, { 
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

// used when you get a new auth token: update local storage and apollo client cache
export const applyNewToken = (authToken, client) => {
  const { userEmail, userRole } = jwtDecode(authToken);

  window.localStorage.setItem('authToken', authToken);

  client.writeData({
    data: {
      isLoggedIn: true,
      userRole,
      userEmail
    }
  });
};

// attempt to get a new auth token and update cache and local storage accordingly
export const refreshAuthToken = async (client, callback) => {
  const authToken = await getAuthToken();

  if (authToken) {
    applyNewToken(authToken, client);
  } else {
    window.localStorage.removeItem('authToken');

    client.writeData({
      data: {
        isLoggedIn: false,
        userRole: null,
        userEmail: null
      }
    });
  }

  if (callback) callback(authToken);
};

// clear auth token from local storage and update isLoggedIn
export const logoutCleanup = client => {
  window.localStorage.removeItem('authToken');
  client.resetStore();
};