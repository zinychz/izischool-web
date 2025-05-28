import React, { useState, useEffect } from 'react';
import './StepView.css';
import { getLocalizedText } from '../utils/localizedText';
import { getLocalizedTextWithInfo } from '../utils/localizedTextWithInfo';

function StepView({ step, onNext }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedChoice, setSelectedChoice] = React.useState(null);

  const availableLanguages = ['RU', 'EN', 'UK']; // Добавь нужные языки
  const [currentLanguage, setCurrentLanguage] = useState('EN');


  // reset on new step
  useEffect(() => {
    setSelectedOption(null);
    setSelectedChoice(null);
  }, [step.id]);

  const handleNext = () => {
    if (step.question?.type === 'CHOICE' && selectedOption) {
      const transition = step.transitions?.find(t => t.condition === `CHOICE=${selectedOption}`);
      if (transition) {
        onNext(transition.targetStepId);
        return;
      }
    }

    const defaultTransition = step.transitions?.find(t => !t.condition);
    if (defaultTransition) {
      onNext(defaultTransition.targetStepId);
    }
  };

  return (
    <div className="step-container">

    <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <select
          value={currentLanguage}
          onChange={(e) => setCurrentLanguage(e.target.value)}
        >
          {availableLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div className="step-header">Шаг #{step.id}</div>

        <div className="step-content">
          {step.content?.blocks?.map((block, index) => {
            const { text, fallback, usedLang } = getLocalizedTextWithInfo(block.value, currentLanguage);

            return (
              <p key={index}>
                {text}
                {fallback && (
                  <span style={{ color: 'orange', fontSize: '0.9em', marginLeft: '8px' }}>
                    (Показан перевод: {usedLang})
                  </span>
                )}
              </p>
            );
          })}
        </div>

      {step.question?.type === 'TEXT_INPUT' && (
        <div className="question-block question-input">
          {step.question.inputs.map((input) => (
            <div key={input.id}>
              <label>{getLocalizedText(input.text, currentLanguage)}</label>
              <input type="text" />
            </div>
          ))}
        </div>
      )}

      {step.question?.type === 'INFO_ONLY' && (
        <div className="question-block info-block">
          {step.question.content?.blocks?.map((block, index) => (
            <p key={index}>{getLocalizedText(block.value, currentLanguage)}</p>
          ))}
        </div>
      )}

      {step.question?.type === 'CHOICE' && (
        <div className="question-choice">
          {step.question.content?.blocks?.map((block, index) => (
            <p key={index}>{getLocalizedText(block.value, currentLanguage)}</p>
          ))}
          {step.question.options.map((option) => (
            <label key={option.id}>
              <input
                type="radio"
                name={`choice-${step.id}`}
                value={option.id}
                checked={selectedChoice === option.id}
                onChange={() => setSelectedChoice(option.id)}
              />
              <span>{getLocalizedText(option.text, currentLanguage)}</span>
            </label>
          ))}
        </div>
      )}

      {(selectedOption || step.transitions?.some(t => !t.condition)) && (
        <button className="next-button" onClick={handleNext}>
          Далее
        </button>
      )}

      {step.question?.type === 'CHOICE' && step.transitions?.length > 0 && selectedChoice && (
        <button className="next-button" onClick={() => {
          const transition = step.transitions.find(t => t.condition === `CHOICE=${selectedChoice}`);
          if (transition) onNext(transition.targetStepId);
        }}>
          Далее under Radio
        </button>
      )}
    </div>
  );
}

export default StepView;
