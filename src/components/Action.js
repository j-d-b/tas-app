import React from 'react';

const Action = ({ action }) => {
  switch (action.type) {
    case 'IMPORT_FULL': {
      return (
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <th>Container ID</th>
              <td>{action.containerId}</td>
            </tr>
            <tr>
              <th>Container Size</th>
              <td>{action.containerSize}</td>
            </tr>
            <tr>
              <th>Container Type</th>
              <td>{action.containerType}</td>
            </tr>
            <tr>
              <th>705 Form Number</th>
              <td>{action.formNumber705}</td>
            </tr>
          </tbody>
        </table>
      );
    }
    case 'STORAGE_EMPTY': {
      return (
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <th>Container Size</th>
              <td>{action.containerSize}</td>
            </tr>
            <tr>
              <th>Container Type</th>
              <td>{action.containerType}</td>
            </tr>
            <tr>
              <th>Shipping Line</th>
              <td>{action.shippingLine}</td>
            </tr>
            <tr>
              <th>Empty For City Form Number</th>
              <td>{action.emptyForCityFormNumber}</td>
            </tr>
          </tbody>
        </table>
      );
    }
    case 'EXPORT_FULL': {
      return (
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <th>Container ID</th>
              <td>{action.containerId}</td>
            </tr>
            <tr>
              <th>Container Size</th>
              <td>{action.containerSize}</td>
            </tr>
            <tr>
              <th>Container Type</th>
              <td>{action.containerType}</td>
            </tr>
            <tr>
              <th>Container Weight</th>
              <td>{action.containerWeight}</td>
            </tr>
            <tr>
              <th>Shipping Line</th>
              <td>{action.shippingLine}</td>
            </tr>
            <tr>
              <th>Booking Number</th>
              <td>{action.bookingNumber}</td>
            </tr>
          </tbody>
        </table>
      );
    }
    case 'EXPORT_EMPTY': {
      return (
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <th>Container ID</th>
              <td>{action.containerId}</td>
            </tr>
            <tr>
              <th>Container Size</th>
              <td>{action.containerSize}</td>
            </tr>
            <tr>
              <th>Container Type</th>
              <td>{action.containerType}</td>
            </tr>
            <tr>
              <th>Shipping Line</th>
              <td>{action.shippingLine}</td>
            </tr>
          </tbody>
        </table>
      );
    }
    default: return <div>Error: action not defined</div>;
  }
};

export default Action;