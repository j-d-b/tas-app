import React from 'react';

import './UnauthenticatedFormPage.scss';
import BoxPage from './BoxPage';
import { SuccessMessage, ErrorMessage } from './ResponseMessage';
import { FormInput, FormButton } from './Form';
import bctcLogo from '../images/bctc-logo.png';

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
                  disableInvalidHighlighting={input.disableInvalidHighlighting}
                  name={input.name}
                  type={input.type}
                  {...(input.minLength && { minLength: input.minLength })}
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
    <div className="bctc-logo-container">
      <img className="bctc-logo-container__logo" src={bctcLogo} alt="BCTC"/>
    </div>
  </BoxPage>
);

export default UnauthenticatedFormPage;