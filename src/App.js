import React, { useEffect, useState } from 'react';
import StepView from './components/StepView';

function App() {
  const [step, setStep] = useState(null);

  useEffect(() => {
    loadStep('1'); // начальный шаг
  }, []);

  const loadStep = (stepId) => {
    fetch(`http://localhost:8080/api/steps/${stepId}`)
      .then((res) => res.json())
      .then((data) => setStep(data));
  };

  const handleNextStep = (targetStepId) => {
    loadStep(targetStepId);
  };

  return (
    <div className="App">
      {step ? <StepView step={step} onNext={handleNextStep} /> : <p>Загрузка...</p>}
    </div>
  );
}

export default App;
