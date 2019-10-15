import React from 'react';

import './FormPage.scss';
import BoxPage from './BoxPage';

const FormPage = ({ 
  title,
  onSubmit,
  actionName,
  inputs,
  lineAfterHTML,
  data,
  error,
  loading,
  loadingText,
  successMessage,
  belowForm
}) => (
  <BoxPage afterBox={belowForm}>
    <div className="form-page__title">{title}</div>
    
    {
      data 
        ? <div className="form-page__success-message">{successMessage || 'Success!'}</div>
        : (
          <form name={title} onSubmit={onSubmit}>
            {
              inputs.map(input => (
                <input
                  className="form-page__input"
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

export default FormPage;