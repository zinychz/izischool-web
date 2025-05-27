import React, { useState, useEffect } from 'react';
import './StepView.css';

function StepView({ step, onNext }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedChoice, setSelectedChoice] = React.useState(null);

  // ⬇️ Сброс выбора при переходе на новый шаг
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
        <div className="question-choice">
          {step.question.content?.blocks?.map((block, index) => (
            <p key={index}>{block.value}</p>
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
              <span>{option.text}</span>
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
