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

export const getFriendlyActionType = (actionType, role = 'CUSTOMER') => {
  switch (actionType) {
    case 'IMPORT_FULL': return role === 'CUSTOMER' ? 'Pick Up Full' : 'Import Full';
    case 'STORAGE_EMPTY': return role === 'CUSTOMER' ? 'Pick Up Empty' : 'Storage Empty';
    case 'EXPORT_FULL': return role === 'CUSTOMER' ? 'Drop Off Full' : 'Export Full';
    case 'EXPORT_EMPTY': return role === 'CUSTOMER' ? 'Drop Off Empty' : 'Export Empty';
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

export const getTimeSlotFromDate = date => {
  return {
    date: date.toISOString().split('T')[0],
    hour: date.getHours()
  };
};

export const getApptDate = appt =>  new Date(Date.parse(`${appt.timeSlot.date}T${getHourString(appt.timeSlot.hour)}:00Z`));

export const containerSizeToTFU = containerSizeString => containerSizeString === 'TWENTYFOOT' ? 20 : 40;

export const calculateApptTFU = appt => appt.actions.reduce((totalTFU, { containerSize }) => totalTFU + containerSizeToTFU(containerSize), 0);

export const buildActionDetailsInput = action => {
  switch (action.type) {
    case 'IMPORT_FULL': {
      return {
        importFull: {
          formNumber705: action.formNumber705,
          containerId: action.containerId,
          containerType: action.containerType
        }
      };
    }
    case 'STORAGE_EMPTY': {
      return {
        storageEmpty: {
          shippingLine: action.shippingLine,
          containerType: action.containerType,
          emptyForCityFormNumber: action.emptyForCityFormNumber
        }
      }
    }
    case 'EXPORT_FULL': {
      return {
        exportFull: {
          containerId: action.containerId,
          containerType: action.containerType,
          containerWeight: action.containerWeight,
          shippingLine: action.shippingLine,
          bookingNumber: action.bookingNumber
        }
      }
    }
    case 'EXPORT_EMPTY': {
      return {
        exportEmpty: {
          containerId: action.containerId,
          containerType: action.containerType,
          shippingLine: action.shippingLine
        }
      }
    }
    default: return {};
  }
};