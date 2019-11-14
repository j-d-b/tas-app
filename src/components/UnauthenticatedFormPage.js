import React from 'react';

import './UnauthenticatedFormPage.scss';
import BoxPage from './BoxPage';
import { SuccessMessage, ErrorMessage } from './ResponseMessage';
import { FormInput, FormButton } from './Form';

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
    <div className="unauthenticated-form-page__title">{title}</div>
    {
      data 
        ? (Success ? <Success /> : <SuccessMessage>{successMessage}</SuccessMessage>)
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
            <FormButton
              style={{ width: '100%' }}
              type="submit"
              disabled={loading}
            >
              {loading ? loadingText : actionName}
            </FormButton>
            {error && <ErrorMessage error={error} />}
          </form>
        )
    }
  </BoxPage>
);

export default UnauthenticatedFormPage;