import React from 'react';

import './UnauthenticatedFormPage.scss';
import BoxPage from './BoxPage';
import { FormInput } from './Form';

const UnauthenticatedFormPage = ({ 
  title,
  onSubmit,
  actionName,
  inputs,
  data,
  error,
  loading,
  loadingText,
  successMessage = 'Success!',
  successComponent: Success, // takes precedent over successMessage
  belowForm
}) => (
  <BoxPage afterBox={belowForm}>
    <div className="form-page__title">{title}</div>
    {
      data 
        ? (Success ? <Success /> : <div className="form-page__success-message">{successMessage}</div>)
        : (
          <form name={title} onSubmit={onSubmit}>
            {
              inputs.map(input => (
                <FormInput
                  key={input.name}
                  name={input.name}
                  type={input.type}
                  value={input.value}
                  placeholder={input.name}
                  onChange={input.handleChange}
                  required={input.isRequired}
                />
              ))
            }
            <input
              className="form-page__submit-button"
              type="submit"
              disabled={loading}
              value={loading ? loadingText : actionName}
            />
            {
              error && <div className="form-page__error-message">{error.toString()}</div>
            }
          </form>
        )
    }
  </BoxPage>
);

export default UnauthenticatedFormPage;