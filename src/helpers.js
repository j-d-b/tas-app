import { format } from 'date-fns';

// check if the date in seconds has passed the current date; useful for checking jwt exp claim. 
export const isPassedExpiration = expirationSeconds => {
  const nowSeconds = Math.ceil(Date.now() / 1000);
  return nowSeconds > expirationSeconds;
};

// check to see if the userRole meets the required role
// will break if userRole or requiredRole is not ADMIN, OPERATOR, or CUSTOMER
export const meetsRequiredRole = (userRole, requiredRole) => {
  if (!requiredRole) return true;

  if (!userRole) return false;
  
  if (userRole === 'ADMIN') return true;

  if (userRole === 'OPERATOR') {
    return requiredRole === 'OPERATOR' || requiredRole === 'CUSTOMER';
  }
  
  return requiredRole === 'CUSTOMER';
};

export const isTimeSlotEqual = (slot1, slot2) => slot1.date === slot2.date && slot1.hour === slot2.hour;

export const isTemplateTimeSlotEqual = (templateSlot1, templateSlot2) => (
  templateSlot1.dayOfWeek === templateSlot2.dayOfWeek && templateSlot1.hour === templateSlot2.hour
);

export const getHourStringFromNumber = hourVal => hourVal < 10 ? `0${hourVal}:00` : `${hourVal}:00`;

export const getPrettyActionType = (actionType, role = 'CUSTOMER') => {
  switch (actionType) {
    case 'IMPORT_FULL': return role === 'CUSTOMER' ? 'Pick Up Full' : 'Import Full';
    case 'STORAGE_EMPTY': return role === 'CUSTOMER' ? 'Pick Up Empty' : 'Storage Empty';
    case 'EXPORT_FULL': return role === 'CUSTOMER' ? 'Drop Off Full' : 'Export Full';
    case 'EXPORT_EMPTY': return role === 'CUSTOMER' ? 'Drop Off Empty' : 'Export Empty';
    default: return '';
  }
};

export const getPrettyUserRole = userRole => {
  switch (userRole) {
    case 'ADMIN': return 'Admin';
    case 'OPERATOR': return 'Operator';
    case 'CUSTOMER': return 'Customer';
    default: return 'Customer';
  }
};

export const getPrettyContainerType = containerType => {
  switch (containerType) {
    case 'GENERAL': return 'General';
    case 'OPEN_TOP': return 'Open Top';
    case 'REEFER': return 'Reefer';
    case 'HIGH_CUBE': return 'High Cube';
    case 'TANK': return 'Tank';
    case 'PLATFORM': return 'Platform';
    case 'SPECIAL_TYPE': return 'Special Type';
    case 'FLATRACK': return 'Flatrack';
    default: return 'General';
  }
};

export const formatError = error => {
  let errorString = error.toString();
  if (errorString.startsWith('Error: ')) {
    errorString = errorString.replace('Error: ', '');

    if (errorString.startsWith('GraphQL error: ')) {
      errorString = errorString.replace('GraphQL error: ', '');
    }
  }

  return errorString;
};

export const getDateFromTimeSlot = timeSlot => new Date(`${timeSlot.date} ${getHourStringFromNumber(timeSlot.hour)}:00`);

export const buildTimeSlotFromDate = date => ({
  date: format(date, 'yyyy-MM-dd'),
  hour: Number(format(date, 'H'))
});
