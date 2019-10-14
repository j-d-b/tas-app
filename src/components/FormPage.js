import React from 'react';

import './FormPage.scss';
import logo from '../images/bctc-tas-simple-logo.svg';

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
  children 
}) => (
  <div className="form-page">
    <img className="form-page__logo" src={logo} alt="BCTC TAS"/>

    <div className="form-page__box">
      <div className="form-page__box__title">{title}</div>
      {
        data 
          ? <div className="form-page__box__message form-page__box__message--success">{successMessage || 'Success'}</div>
          : (
            <form name={title} onSubmit={onSubmit}>
              {
                inputs.map(input => (
                  <input
                    className="form-page__box__input"
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
                className="form-page__box__submit-button"
                type="submit"
                value={loading ? loadingText : actionName}
              />
              <div className="form-page__box__message form-page__box__message--error">
                {error && error.toString()}
              </div>
            </form>
          )
      }
    </div>

    <div className="form-page__line-after">{children}</div> {/* Children are rendered below the form box; useful for addtional short messages */}
  </div>
);

export default FormPage;