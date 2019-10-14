import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const ME = gql`
  {
    me {
      name
      email
    }
  }
`;

const Me = () => {
  const { loading, error, data } = useQuery(ME, { fetchPolicy: 'network-only' });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      Name: {data.me.name}<br></br>
      Email: {data.me.email}
    </div>
  );
};

export default Me;