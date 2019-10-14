import ky from 'ky';

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

export const setAuthToken = async (client, callback) => {
  const authToken = await getAuthToken();

  if (authToken) {
    window.localStorage.setItem('authToken', authToken);
  } else {
    window.localStorage.removeItem('authToken');
  }

  client.writeData({
    data: {
      isLoggedIn: authToken ? true : false
    }
  });

  callback && callback(authToken);
};