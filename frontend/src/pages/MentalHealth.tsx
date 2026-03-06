// src/pages/MentalHealth.tsx
import React, { useState } from 'react';

const questions = [
  { id: 1, text: "Little interest or pleasure in doing things?" },
  { id: 2, text: "Feeling down, depressed, or hopeless?" },
  { id: 3, text: "Trouble falling or staying asleep?" },
  { id: 4, text: "Feeling tired or having little energy?" },
  { id: 5, text: "Poor appetite or overeating?" },
  { id: 6, text: "Feeling bad about yourself?" },
  { id: 7, text: "Trouble concentrating on things?" },
  { id: 8, text: "Moving or speaking slowly or being restless?" },
  { id: 9, text: "Thoughts of being better off dead?" },
];

const options = [
  { label: 'Not at all',        score: 0, color: 'green'  },
  { label: 'Several days',      score: 1, color: 'yellow' },
  { label: 'More than half',    score: 2, color: 'orange' },
  { label: 'Nearly every day',  score: 3, color: 'red'    },
];

const MentalHealth = () => {
  const [step, setStep] = useState<'intro' | 'questions' | 'result'>('intro');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<any>(null);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      // Calculate result
      const total = newAnswers.reduce(
        (a, b) => a + b, 0
      );
      let severity, label, color, advice;

      if (total <= 4) {
        severity = '🟢 Minimal';
        label    = 'Minimal Depression';
        color    = 'green';
        advice   = 'No treatment likely needed. Monitor symptoms.';
      } else if (total <= 9) {
        severity = '🟡 Mild';
        label    = 'Mild Depression';
        color    = 'yellow';
        advice   = 'Watchful waiting. Consider counseling.';
      } else if (total <= 14) {
        severity = '🟠 Moderate';
        label    = 'Moderate Depression';
        color    = 'orange';
        advice   = 'Treatment plan recommended. See a doctor.';
      } else if (total <= 19) {
        severity = '🔴 Severe';
        label    = 'Moderately Severe';
        color    = 'red';
        advice   = 'Active treatment required. See doctor soon.';
      } else {
        severity = '🚨 URGENT';
        label    = 'Severe Depression';
        color    = 'red';
        advice   = 'Immediate treatment required. See doctor today.';
      }

      setResult({ total, severity, label, color, advice, answers: newAnswers });
      setStep('result');
    }
  };

  const severityBg: Record<string, string> = {
    green:  'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    orange: 'bg-orange-50 border-orange-200',
    red:    'bg-red-50 border-red-200',
  };

  const severityText: Record<string, string> = {
    green:  'text-green-700',
    yellow: 'text-yellow-700',
    orange: 'text-orange-700',
    red:    'text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🧠</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Mental Health Screening
            </h1>
            <p className="text-gray-500 text-sm">
              PHQ-9 Depression Assessment
            </p>
          </div>
        </div>
        <div className="bg-purple-50 px-4 py-2 rounded-xl">
          <span className="text-purple-700 text-sm font-medium">
            🔒 100% Confidential
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-12">

        {/* Intro */}
        {step === 'intro' && (
          <div className="text-center">
            <div className="text-8xl mb-6">🧠</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              PHQ-9 Depression Screening
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Over the last 2 weeks, how often have
              you been bothered by the following problems?
              This takes about 2 minutes.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: '⏱️', text: '2 minutes' },
                { icon: '🔒', text: 'Confidential' },
                { icon: '✅', text: '9 Questions' },
              ].map((item, i) => (
                <div key={i}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-sm font-medium text-gray-700">
                    {item.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-8 text-left">
              <p className="text-blue-800 text-sm font-medium mb-1">
                ℹ️ About PHQ-9
              </p>
              <p className="text-blue-600 text-xs leading-relaxed">
                The Patient Health Questionnaire-9 is a
                validated screening tool used worldwide
                by healthcare professionals to assess
                depression severity.
              </p>
            </div>

            <button
              onClick={() => setStep('questions')}
              className="bg-blue-900 text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition">
              Start Screening →
            </button>
          </div>
        )}

        {/* Questions */}
        {step === 'questions' && (
          <div>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Question {current + 1} of {questions.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(((current) / questions.length) * 100)}% complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-900 h-2 rounded-full transition-all"
                  style={{ width: `${(current / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
              <p className="text-gray-500 text-sm mb-4">
                Over the last 2 weeks...
              </p>
              <h2 className="text-xl font-bold text-gray-900 mb-8">
                {questions[current].text}
              </h2>

              <div className="space-y-3">
                {options.map((opt) => (
                  <button
                    key={opt.score}
                    onClick={() => handleAnswer(opt.score)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-blue-900 hover:bg-blue-50 transition text-left group">
                    <span className="font-medium text-gray-700 group-hover:text-blue-900">
                      {opt.label}
                    </span>
                    <span className="text-gray-400 group-hover:text-blue-900 text-sm">
                      {opt.score} pts
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Back */}
            {current > 0 && (
              <button
                onClick={() => {
                  setCurrent(current - 1);
                  setAnswers(answers.slice(0, -1));
                }}
                className="text-gray-500 text-sm hover:text-blue-900">
                ← Previous question
              </button>
            )}
          </div>
        )}

        {/* Result */}
        {step === 'result' && result && (
          <div>
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {result.color === 'green' ? '😊' :
                 result.color === 'yellow' ? '😐' :
                 result.color === 'orange' ? '😟' : '😢'}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Screening Complete
              </h2>
            </div>

            {/* Score Card */}
            <div className={`rounded-2xl p-8 border-2 text-center mb-6 ${severityBg[result.color]}`}>
              <p className={`text-4xl font-bold mb-2 ${severityText[result.color]}`}>
                {result.total}/27
              </p>
              <p className={`text-xl font-bold mb-2 ${severityText[result.color]}`}>
                {result.label}
              </p>
              <p className={`text-sm ${severityText[result.color]}`}>
                {result.severity}
              </p>
            </div>

            {/* Advice */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
              <h3 className="font-bold text-gray-900 mb-3">
                💡 Recommendation
              </h3>
              <p className="text-gray-600">
                {result.advice}
              </p>
            </div>

            {/* Answers Summary */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
              <h3 className="font-bold text-gray-900 mb-4">
                📊 Your Responses
              </h3>
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 flex-1 mr-4">
                      {q.text}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      result.answers[i] === 0 ? 'bg-green-100 text-green-700' :
                      result.answers[i] === 1 ? 'bg-yellow-100 text-yellow-700' :
                      result.answers[i] === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {options[result.answers[i]]?.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-50 rounded-xl p-4 border border-red-100 mb-6">
              <p className="text-red-700 text-xs">
                ⚠️ This is a screening tool only.
                Not a clinical diagnosis.
                Please consult a mental health professional.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="bg-blue-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-800 transition">
                📄 Download Report
              </button>
              <button
                onClick={() => {
                  setStep('intro');
                  setCurrent(0);
                  setAnswers([]);
                  setResult(null);
                }}
                className="bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
                🔄 Retake
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentalHealth;