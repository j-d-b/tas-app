import React from 'react';

import FormGroup from './FormGroup';
import FormSelect from './FormSelect';
import FormInput from './FormInput';

const EditContainerId = ({ action, onEdit }) => (
  <FormGroup>
    <label htmlFor="containerId">Container ID</label>
    <FormInput
      id="containerId"
      type="text"
      value={action.containerId || ''}
      onChange={e => onEdit({ ...action, containerId: e.target.value })}
      required
    />
  </FormGroup>
);

const EditContainerSize = ({ action, onEdit }) => (
  <FormGroup>
    <label htmlFor="containerSize">Container Size</label>
    <FormSelect
      id="containerSize"
      options={[
        { name: 'Twenty Foot', value: 'TWENTYFOOT' },
        { name: 'Forty Foot', value: 'FORTYFOOT' }
      ]}
      value={action.containerSize}
      onChange={e => onEdit({ ...action, containerSize: e.target.value })}
      required
    />
  </FormGroup>
);

const EditContainerType = ({ action, onEdit }) => (
  <FormGroup>
    <label htmlFor="containerType">Container Type</label>
    <FormInput
      id="containerType"
      type="text"
      value={action.containerType || ''}
      onChange={e => onEdit({ ...action, containerType: e.target.value })}
      required
    />
  </FormGroup>
);

const EditShippingLine = ({ action, onEdit }) => (
  <div>
    <label htmlFor="shippingLine">Shipping Line</label>
    <FormInput
      id="shippingLine"
      type="text"
      value={action.shippingLine || ''}
      onChange={e => onEdit({ ...action, shippingLine: e.target.value})}
      required
    />
  </div>
);

const EditAction = ({ action, onEdit, isNew }) => {
  switch (action.type) {
    case 'IMPORT_FULL': {
      return (
        <div>
          <EditContainerId action={action} onEdit={onEdit} />
          {isNew && <EditContainerSize action={action} onEdit={onEdit} />}
          <EditContainerType action={action} onEdit={onEdit} />

          <div>
            <label htmlFor="formNumber705">705 Form Number</label>
            <FormInput
              id="formNumber705"
              type="text"
              value={action.formNumber705 || ''}
              onChange={e => onEdit({ ...action, formNumber705: e.target.value })}
              required
            />
          </div>
        </div>
      );
    }
    case 'STORAGE_EMPTY': {
      return (
        <div>
          <EditContainerType action={action} onEdit={onEdit} />

          {isNew && <EditContainerSize action={action} onEdit={onEdit} />}

          <FormGroup>
            <label htmlFor="emptyForCityFormNumber">Empty For City Form Number</label>
            <FormInput
              id="emptyForCityFormNumber"
              type="text"
              value={action.emptyForCityFormNumber || ''}
              onChange={e => onEdit({ ...action, emptyForCityFormNumber: e.target.value})}
              required
            />
          </FormGroup>

          <EditShippingLine action={action} onEdit={onEdit} />
        </div>
      );
    }
    case 'EXPORT_FULL': {
      return (
        <div>
          <EditContainerId action={action} onEdit={onEdit} />
          {isNew && <EditContainerSize action={action} onEdit={onEdit} />}
          <EditContainerType action={action} onEdit={onEdit} />

          <FormGroup>
            <label htmlFor="containerWeight">Container Weight</label>
            <FormInput
              id="containerWeight"
              type="number"
              value={action.containerWeight || ''}
              onChange={e => onEdit({ ...action, containerWeight: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="bookingNumber">Booking Number</label>
            <FormInput
              id="bookingNumber"
              type="text"
              value={action.bookingNumber || ''}
              onChange={e => onEdit({ ...action, bookingNumber: e.target.value })}
              required
            />
          </FormGroup>

          <EditShippingLine action={action} onEdit={onEdit} />
        </div>
      );
    }
    case 'EXPORT_EMPTY': {
      return (
        <div>
          <EditContainerId action={action} onEdit={onEdit} />
          {isNew && <EditContainerSize action={action} onEdit={onEdit} />}
          <EditContainerType action={action} onEdit={onEdit} />

          <div>
            <label htmlFor="shippingLine">Shipping Line</label>
            <FormInput
              id="shippingLine"
              type="text"
              value={action.shippingLine || ''}
              onChange={e => onEdit({ ...action, shippingLine: e.target.value})}
              required
            />
          </div>
        </div>
      );
    }
    default: return <div>Error: action not defined</div>;
  }
};

export default EditAction;