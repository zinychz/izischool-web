import React, { useState } from 'react';
import './StepView.css';

function StepView({ step, onNext }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleNext = () => {
    // Для CHOICE ищем переход по выбранной опции
    if (step.question?.type === 'CHOICE' && selectedOption) {
      const transition = step.transitions?.find(t => t.condition === `CHOICE=${selectedOption}`);
      if (transition) {
        onNext(transition.targetStepId);
        return;
      }
    }

    // Иначе ищем переход без условий
    const defaultTransition = step.transitions?.find(t => !t.condition);
    if (defaultTransition) {
      onNext(defaultTransition.targetStepId);
    }
  };

  return (
    <div className="step-container">
      <div className="step-header">Шаг #{step.id}</div>

      <div className="step-content">
        {step.content?.blocks?.map((block, index) => (
          <p key={index}>{block.value}</p>
        ))}
      </div>

      {step.question?.type === 'TEXT_INPUT' && (
        <div className="question-block question-input">
          {step.question.inputs.map((input) => (
            <div key={input.id}>
              <label>{input.text}</label>
              <input type="text" />
            </div>
          ))}
        </div>
      )}

      {step.question?.type === 'INFO_ONLY' && (
        <div className="question-block info-block">
          {step.question.content?.blocks?.map((block, index) => (
            <p key={index}>{block.value}</p>
          ))}
        </div>
      )}

      {step.question?.type === 'CHOICE' && (
        <div className="question-block question-choice">
          {step.question.content?.blocks?.map((block, index) => (
            <p key={index}>{block.value}</p>
          ))}
          {step.question.options?.map((option) => (
            <label key={option.id}>
              <input
                type="radio"
                name="choice"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => setSelectedOption(option.id)}
              />
              {option.text}
            </label>
          ))}
        </div>
      )}

      {/* Показывать кнопку "Далее", если: */}
      {/* - выбрана опция в CHOICE */}
      {/* - или есть переход без условия */}
      {(selectedOption || step.transitions?.some(t => !t.condition)) && (
        <button className="next-button" onClick={handleNext}>
          Далее
        </button>
      )}
    </div>
  );
}

export default StepView;
