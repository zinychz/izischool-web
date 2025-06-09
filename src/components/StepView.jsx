import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './StepView.css';
import { getLocalizedText } from '../utils/localizedText';
import { getLocalizedTextWithInfo } from '../utils/localizedTextWithInfo';

function StepView({ step, onNext }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedChoice, setSelectedChoice] = React.useState(null);

  const availableLanguages = ['RU', 'EN', 'UK', ':izi_default_locale:']; // Добавь нужные языки
  const [currentLanguage, setCurrentLanguage] = useState(':izi_default_locale:');


  // reset on new step
  useEffect(() => {
    setSelectedOption(null);
    setSelectedChoice(null);
  }, [step.id]);

  const handleNext = () => {
    const isChoice = step.question?.inputs?.find(i => i.type === 'CHOICE');
    if (isChoice && selectedOption) {
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

      <div className="step-header">{step.key?.name ? step.key.name : step.id}</div>

        <div className="step-content">
          {step.content?.blocks?.map((block, index) => {
            const { text, usedLang, fallback } = getLocalizedTextWithInfo(block.value, currentLanguage);

            return (
              <div key={index} style={{ marginBottom: '1rem' }}>
                {block.format === 'MARKDOWN' ? (
                  <ReactMarkdown>{text}</ReactMarkdown>
                ) : (
                  <p>{text}</p>
                )}
                {fallback && (
                  <span style={{ color: 'orange', fontSize: '0.9em' }}>
                    (Показан перевод: {usedLang})
                  </span>
                )}
              </div>
            );
          })}
        </div>




        <div className="question-block">
          {step.question?.inputs?.map((input, index) => {
            if(input.type === 'TEXT') {
                const { text, usedLang, fallback } = getLocalizedTextWithInfo(input.text, currentLanguage);
                return (
                    <div className="info-block">
                            {input.format === 'MARKDOWN' ? (
                              <p key={input.id}><ReactMarkdown>{text}</ReactMarkdown></p>
                            ) : (
                              <p key={input.id}>{text}</p>
                            )}
                            {fallback && (
                              <span style={{ color: 'orange', fontSize: '0.9em' }}>
                                (Показан перевод: {usedLang})
                              </span>
                            )}
                    </div>
                )
            }
            if(input.type === 'TEXT_INLINE') {
                const { text, usedLang, fallback } = getLocalizedTextWithInfo(input.text, currentLanguage);
                return (
                    <div className="info-block inline">


                            {input.format === 'MARKDOWN' ? (
                              <p key={input.id}><ReactMarkdown>{text}</ReactMarkdown></p>
                            ) : (
                              <p key={input.id}>{text}</p>
                            )}
                            {fallback && (
                              <span style={{ color: 'orange', fontSize: '0.9em' }}>
                                (Показан перевод: {usedLang})
                              </span>
                            )}
                    </div>
                )
            }
            if(input.type === 'INPUT') {
                const { text, usedLang, fallback } = getLocalizedTextWithInfo(input.text, currentLanguage);
                return (
                    <div className="question-input">
                        <div key={input.id}>
                            {input.format === 'MARKDOWN' ? (
                              <label><ReactMarkdown>{text}</ReactMarkdown></label>
                            ) : (
                              <label>{text}</label>
                            )}
                            <input type="text" />
                            {fallback && (
                              <span style={{ color: 'orange', fontSize: '0.9em' }}>
                                (Показан перевод: {usedLang})
                              </span>
                            )}
                        </div>
                    </div>
                )
            }
            if(input.type === 'INPUT_INLINE') {
                const { text, usedLang, fallback } = getLocalizedTextWithInfo(input.text, currentLanguage);
                return (
                    <div className="question-input inline">
                        <div key={input.id}>

                            {input.format === 'MARKDOWN' ? (
                              <label><ReactMarkdown>{text}</ReactMarkdown></label>
                            ) : (
                              <label>{text}</label>
                            )}
                            <input type="text" />
                            {fallback && (
                              <span style={{ color: 'orange', fontSize: '0.9em' }}>
                                (Показан перевод: {usedLang})
                              </span>
                            )}

                        </div>
                    </div>
                )
            }
            if(input.type === 'CHOICE') {
                const { text, usedLang, fallback } = getLocalizedTextWithInfo(input.text, currentLanguage);
                return (
                    <div className="question-choice">
                        <label key={input.id}>
                          <input
                            type="radio"
                            name={`choice-${step.id}`}
                            value={input.id}
                            checked={selectedChoice === input.id}
                            onChange={() => setSelectedChoice(input.id)}
                          />


                            {input.format === 'MARKDOWN' ? (
                              <span><ReactMarkdown>{text}</ReactMarkdown></span>
                            ) : (
                              <span>{text}</span>
                            )}
                            {fallback && (
                              <span style={{ color: 'orange', fontSize: '0.9em' }}>
                                (Показан перевод: {usedLang})
                              </span>
                            )}



                        </label>
                    </div>
                )
            }
          })}
        </div>




      {(selectedOption || step.transitions?.some(t => !t.condition)) && (
        <button className="next-button" onClick={handleNext}>
          Далее
        </button>
      )}

      {step.question?.inputs?.find(i => i.type === 'CHOICE') && step.transitions?.length > 0 && selectedChoice && (
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
