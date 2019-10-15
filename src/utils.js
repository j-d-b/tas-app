import ky from 'ky';
import jwtDecode from 'jwt-decode';

// use the auth-token endpoint to request a new authToken using the refreshToken cookie
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

// get a new auth token and update isLoggedIn and user information in cache
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

// check if the date in seconds has passed the current date; useful for checking jwt exp claim. 
export const isPassedExpiration = expirationSeconds => {
  const nowSeconds = Math.ceil(Date.now() / 1000); // TODO check this is all in UTC
  return nowSeconds > expirationSeconds;
};

// check to see if the userRole meets the required role
// will break if userRole or requiredRole is not on of ADMIN, OPERATOR, CUSTOMER
export const meetsRequiredRole = (userRole, requiredRole) => {
  if (userRole === 'ADMIN') return true;

  if (userRole === 'OPERATOR') {
    return requiredRole === 'OPERATOR' || requiredRole === 'CUSTOMER';
  }
  
  return requiredRole === 'CUSTOMER';
};