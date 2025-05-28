import React, { useEffect, useState } from 'react';
import StepView from './components/StepView';

function App() {
  const beApiBaseUrl = process.env.REACT_APP_BE_API_BASE_URL;
  const [step, setStep] = useState(null);

  useEffect(() => {
    loadStep('1'); // first step
  }, []);

  const loadStep = (stepId) => {
    fetch(`${beApiBaseUrl}/api/steps/${stepId}`)
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
