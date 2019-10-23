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

// check if the date in seconds has passed the current date; useful for checking jwt exp claim. 
export const isPassedExpiration = expirationSeconds => {
  const nowSeconds = Math.ceil(Date.now() / 1000); // TODO check this is all in UTC
  return nowSeconds > expirationSeconds;
};

// check to see if the userRole meets the required role
// will break if userRole or requiredRole is not on of ADMIN, OPERATOR, CUSTOMER
export const meetsRequiredRole = (userRole, requiredRole) => {
  if (!requiredRole) return true;

  if (!userRole) return false;
  
  if (userRole === 'ADMIN') return true;

  if (userRole === 'OPERATOR') {
    return requiredRole === 'OPERATOR' || requiredRole === 'CUSTOMER';
  }
  
  return requiredRole === 'CUSTOMER';
};

export const getFriendlyActionType = actionType => {
  switch (actionType) {
    case 'IMPORT_FULL': return 'Import Full';
    case 'STORAGE_EMPTY': return 'Storage Empty';
    case 'EXPORT_FULL': return 'Export Full';
    case 'EXPORT_EMPTY': return 'Export Empty';
    default: return '';
  }
};

export const getFriendlyUserRole = userRole => {
  switch (userRole) {
    case 'ADMIN': return 'Admin';
    case 'OPERATOR': return 'Operator';
    case 'CUSTOMER': return 'Customer';
    default: return 'Customer';
  }
}

export const getHourString = hourVal => hourVal < 10 ? `0${hourVal}:00` : `${hourVal}:00`;

export const getDateFromTimeslot = timeSlot => Date.parse(`${timeSlot.date}T${getHourString(timeSlot.hour)}:00`);

export const getApptDate = appt =>  new Date(Date.parse(`${appt.timeSlot.date}T${getHourString(appt.timeSlot.hour)}:00Z`));