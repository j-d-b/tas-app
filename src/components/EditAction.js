import React from 'react';

import FormGroup from './FormGroup';
import FormInput from './FormInput';

const EditAction = ({ action, onEdit }) => {
  switch (action.type) {
    case 'IMPORT_FULL': {
      return (
        <div>
          <FormGroup>
            <label htmlFor="containerId">Container ID</label>
            <FormInput
              id="containerId"
              type="text"
              value={action.containerId || ''}
              onChange={e => onEdit({ ...action, containerId: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="containerType">Container Type</label>
            <FormInput
              id="containerType"
              type="text"
              value={action.containerType || ''}
              onChange={e => onEdit({ ...action, containerType: e.target.value })}
            />
          </FormGroup>

          <div>
            <label htmlFor="formNumber705">705 Form Number</label>
            <FormInput
              id="formNumber705"
              type="text"
              value={action.formNumber705 || ''}
              onChange={e => onEdit({ ...action, formNumber705: e.target.value })}
            />
          </div>
        </div>
      );
    }
    case 'STORAGE_EMPTY': {
      return (
        <div>
          <FormGroup>
            <label htmlFor="containerType">Container Type</label>
            <FormInput
              id="containerType"
              type="text"
              value={action.containerType || ''}
              onChange={e => onEdit({ ...action, containerType: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="emptyForCityFormNumber">Empty For City Form Number</label>
            <FormInput
              id="emptyForCityFormNumber"
              type="text"
              value={action.emptyForCityFormNumber || ''}
              onChange={e => onEdit({ ...action, emptyForCityFormNumber: e.target.value})}
            />
          </FormGroup>

          <div>
            <label htmlFor="shippingLine">Shipping Line</label>
            <FormInput
              id="shippingLine"
              type="text"
              value={action.shippingLine || ''}
              onChange={e => onEdit({ ...action, shippingLine: e.target.value})}
            />
          </div>
        </div>
      );
    }
    case 'EXPORT_FULL': {
      return (
        <div>
          <FormGroup>
            <label htmlFor="containerId">Container ID</label>
            <FormInput
              id="containerId"
              type="text"
              value={action.containerId || ''}
              onChange={e => onEdit({ ...action, containerId: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="containerType">Container Type</label>
            <FormInput
              id="containerType"
              type="text"
              value={action.containerType || ''}
              onChange={e => onEdit({ ...action, containerType: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="containerWeight">Container Weight</label>
            <FormInput
              id="containerWeight"
              type="text"
              value={action.containerWeight || ''}
              onChange={e => onEdit({ ...action, containerWeight: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="bookingNumber">Booking Number</label>
            <FormInput
              id="bookingNumber"
              type="text"
              value={action.bookingNumber || ''}
              onChange={e => onEdit({ ...action, bookingNumber: e.target.value })}
            />
          </FormGroup>

          <div>
            <label htmlFor="shippingLine">Shipping Line</label>
            <FormInput
              id="shippingLine"
              type="text"
              value={action.shippingLine || ''}
              onChange={e => onEdit({ ...action, shippingLine: e.target.value})}
            />
          </div>
        </div>
      );
    }
    case 'EXPORT_EMPTY': {
      return (
        <div>
          <FormGroup>
            <label htmlFor="containerId">Container ID</label>
            <FormInput
              id="containerId"
              type="text"
              value={action.containerId || ''}
              onChange={e => onEdit({ ...action, containerId: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="containerType">Container Type</label>
            <FormInput
              id="containerType"
              type="text"
              value={action.containerType || ''}
              onChange={e => onEdit({ ...action, containerType: e.target.value })}
            />
          </FormGroup>

          <div>
            <label htmlFor="shippingLine">Shipping Line</label>
            <FormInput
              id="shippingLine"
              type="text"
              value={action.shippingLine || ''}
              onChange={e => onEdit({ ...action, shippingLine: e.target.value})}
            />
          </div>
        </div>
      );
    }
    default: return <div>Action not found</div>;
  }
};

export default EditAction;