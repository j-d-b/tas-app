import React from 'react';

import { FormGroup, FormSelect, FormInput, FormNote } from './Form';
import { getPrettyContainerType, getPrettyContainerSize } from '../helpers';

const containerTypeOptions = [
  'GENERAL',
  'OPEN_TOP',
  'REEFER',
  'HIGH_CUBE',
  'TANK',
  'PLATFORM',
  'SPECIAL_TYPE',
  'FLATRACK'
].map(value => ({ name: getPrettyContainerType(value), value }));

const containerSizeOptions = [
  'TWENTYFOOT',
  'FORTYFOOT'
].map(value => ({ name: getPrettyContainerSize(value), value }));

const EditContainerId = ({ action, onEdit }) => (
  <FormGroup>
    <label htmlFor="containerId">Container ID*</label>
    <FormInput
      name="containerId"
      id="containerId"
      type="text"
      value={action.containerId || ''}
      onChange={e => onEdit({ ...action, containerId: e.target.value })}
      required
    />
  </FormGroup>
);

const EditContainerSize = ({ action, onEdit, options, disabled }) => (
  <FormGroup>
    <label htmlFor="containerSize">Container Size*</label>
    <FormSelect
      disabled={disabled}
      name="containerSize"
      id="containerSize"
      options={options || containerSizeOptions}
      value={action.containerSize}
      onChange={e => onEdit({ ...action, containerSize: e.target.value })}
      placeholder="Select container size"
      required
    />
  </FormGroup>
);

const EditContainerType = ({ action, onEdit }) => (
  <FormGroup>
    <label htmlFor="containerType">Container Type*</label>
    <FormSelect
      name="containerType"
      id="containerType"
      options={containerTypeOptions}
      value={action.containerType}
      onChange={e => onEdit({ ...action, containerType: e.target.value })}
      placeholder="Select container type"
      required
    />
  </FormGroup>
);

const EditShippingLine = ({ action, onEdit }) => (
  <div>
    <label htmlFor="shippingLine">Shipping Line*</label>
    <FormInput
      name="shippingLine"
      id="shippingLine"
      type="text"
      value={action.shippingLine || ''}
      onChange={e => onEdit({ ...action, shippingLine: e.target.value })}
      required
    />
  </div>
);

const EditAction = ({ action, onEdit, isNew, containerSizeOptions }) => {
  switch (action.type) {
    case 'IMPORT_FULL': {
      return (
        <div>
          <EditContainerId action={action} onEdit={onEdit} />
          <EditContainerSize action={action} onEdit={onEdit} options={containerSizeOptions} disabled={!isNew} />
          <EditContainerType action={action} onEdit={onEdit} />

          <div>
            <label htmlFor="formNumber705">705 Form Number*</label>
            <FormInput
              name="formNumber705"
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
          <EditContainerType action={action} onEdit={onEdit} isNew />

          <EditContainerSize action={action} onEdit={onEdit} options={containerSizeOptions} disabled={!isNew} />

          <FormGroup>
            <label htmlFor="emptyForCityFormNumber">Empty For City Form Number*</label>
            <FormInput
              name="emptyForCityFormNumber"
              id="emptyForCityFormNumber"
              type="text"
              value={action.emptyForCityFormNumber || ''}
              onChange={e => onEdit({ ...action, emptyForCityFormNumber: e.target.value })}
              required
            />
            {isNew && <FormNote>Form number received from <a href="http://www.bctc-lb.com/services.aspx">BCTC's Empty for City Request</a></FormNote>}
          </FormGroup>
        </div>
      );
    }
    case 'EXPORT_FULL': {
      return (
        <div>
          <EditContainerId action={action} onEdit={onEdit} />
          <EditContainerSize action={action} onEdit={onEdit} options={containerSizeOptions} disabled={!isNew} />
          <EditContainerType action={action} onEdit={onEdit} />

          <FormGroup>
            <label htmlFor="containerWeight">Container Weight (kg)*</label>
            <FormInput
              name="containerWeight"
              id="containerWeight"
              type="number"
              min="0"
              max="999999999"
              value={action.containerWeight || ''}
              onChange={e => onEdit({ ...action, containerWeight: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="bookingNumber">Booking Number*</label>
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
          <EditContainerSize action={action} onEdit={onEdit} options={containerSizeOptions} disabled={!isNew} />
          <EditContainerType action={action} onEdit={onEdit} />
        </div>
      );
    }
    default: return <div>Error: action not defined</div>;
  }
};

export default EditAction;