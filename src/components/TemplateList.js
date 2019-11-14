import React from 'react';

import './TemplateList.scss';
import { ReactComponent as EditIcon} from '../images/edit-icon.svg';
import { ReactComponent as TrashIcon} from '../images/trash-icon.svg';
import { ReactComponent as CheckIcon} from '../images/check-icon.svg';
import { ReactComponent as TimesIcon} from '../images/times-icon.svg';

const TemplateLine = ({ template, onApply, onDelete, onEdit, hideButtons }) => (
  <div className={`template-list__line ${template.isApplied ? 'template-list__line--applied' : ''}`}>
    <div className="template-list__line__name">{template.name}</div>
    {!hideButtons && (
      <div className="template-list__line__action-icons">
        <div className="template-list__line__action-icons__icon" onClick={onApply}>
          {template.isApplied ? <TimesIcon /> : <CheckIcon />}
        </div>
        <div className="template-list__line__action-icons__icon" onClick={onEdit}>
          <EditIcon />
        </div>
        {!template.isApplied && (
          <div className="template-list__line__action-icons__icon template-list__line__action-icons__icon--trash" onClick={onDelete}>
            <TrashIcon />
          </div>
        )}
      </div>
    )}
  </div>
);

const TemplateList = ({ allTemplates, applyTemplate, unapplyTemplate, triggerDelete, triggerEdit, isLoading, triggerCreate }) => {  
  const appliedTemplate = allTemplates.find(template => template.isApplied);
  const unappliedTemplates = allTemplates.filter(template => !template.isApplied);

  return (
    <div className="manage-templates-box">
      <div>
        <div className="applied-template-label">Applied Template</div>
        {appliedTemplate
          ? (
              <TemplateLine 
                hideButtons={isLoading}
                template={appliedTemplate}
                onApply={unapplyTemplate}
                onEdit={() => triggerEdit(appliedTemplate.name)}
              />
            )
          : <div className="template-list__line"></div> }
      </div>

      <div className="manage-templates-box__divider-line"></div>

      <div className="template-list">
        {unappliedTemplates.map(template => (
          <TemplateLine
            key={template.name}
            hideButtons={isLoading}
            template={template}
            onApply={() => applyTemplate(template.name)}
            onEdit={() => triggerEdit(template.name)}
            onDelete={() => triggerDelete(template.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateList;