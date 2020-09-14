import { useState, useEffect } from 'react';
import ky from 'ky';
import jwtDecode from 'jwt-decode';
import { gql } from 'apollo-boost';
import { DateTime } from 'luxon';

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

// get the current time on the server
let serverTimezone;
const getCurrServerTime = async client => {
  if (!serverTimezone) {
    const { data: { systemTimezone } } = await client.query({ query: gql`{ systemTimezone }` });
    serverTimezone = systemTimezone;
  }

  const serverTime = DateTime.local().setZone(serverTimezone);

  return new Date(serverTime.year, serverTime.month - 1, serverTime.day, serverTime.hour, serverTime.minute);
};

export const useCurrServerTime = client => {
  const [currServerTime, setCurrServerTime] = useState(null);

  useEffect(() => {
    getCurrServerTime(client)
      .then(setCurrServerTime)
      .catch(err => {
        setCurrServerTime('ERROR');
      });
  }, [client]);

  return currServerTime;
};