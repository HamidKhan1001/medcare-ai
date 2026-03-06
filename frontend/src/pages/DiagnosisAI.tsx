// src/pages/DiagnosisAI.tsx
import React, { useState } from 'react';

const symptoms = [
  'Fever', 'Headache', 'Cough', 'Chest Pain',
  'Shortness of Breath', 'Nausea', 'Vomiting',
  'Diarrhea', 'Fatigue', 'Dizziness', 'Back Pain',
  'Joint Pain', 'Skin Rash', 'Sore Throat',
  'Runny Nose', 'Abdominal Pain', 'Loss of Appetite',
  'Weight Loss', 'Night Sweats', 'Swelling',
];

const DiagnosisAI = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [duration, setDuration] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [step, setStep] = useState<'form' | 'analyzing' | 'result'>('form');
  const [result, setResult] = useState<any>(null);

  const toggleSymptom = (s: string) => {
    setSelected(prev =>
      prev.includes(s)
        ? prev.filter(x => x !== s)
        : [...prev, s]
    );
  };

  const handleAnalyze = () => {
    if (selected.length === 0) return;
    setStep('analyzing');
    setTimeout(() => {
      setResult({
        diagnoses: [
          { name: 'Viral Upper Respiratory Infection', probability: 78, severity: 'Mild' },
          { name: 'Influenza (Flu)', probability: 65, severity: 'Moderate' },
          { name: 'COVID-19', probability: 45, severity: 'Moderate' },
        ],
        recommendation: 'Rest, hydration, and symptomatic treatment recommended. Consult a doctor if symptoms worsen after 3 days.',
        urgency: 'Non-urgent',
        urgencyColor: 'green',
      });
      setStep('result');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔍</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Diagnosis AI</h1>
            <p className="text-gray-500 text-sm">Symptom-based differential diagnosis</p>
          </div>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl">
          <span className="text-blue-700 text-sm font-medium">🤖 AI Powered</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8">

        {step === 'form' && (
          <div className="space-y-6">

            {/* Patient Info */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Patient Information</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-900"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-900"
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Duration</label>
                  <select
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-900"
                  >
                    <option value="">Select</option>
                    <option>Today</option>
                    <option>2-3 days</option>
                    <option>1 week</option>
                    <option>2+ weeks</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">
                Select Symptoms
                <span className="text-blue-900 ml-2">({selected.length} selected)</span>
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Select all symptoms you are experiencing
              </p>
              <div className="flex flex-wrap gap-2">
                {symptoms.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition ${
                      selected.includes(s)
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={selected.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                selected.length > 0
                  ? 'bg-blue-900 text-white hover:bg-blue-800'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              🔍 Analyze Symptoms
            </button>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 animate-pulse">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Analyzing Symptoms...</h2>
            <p className="text-gray-500 mb-8">AI is finding possible diagnoses</p>
            <div className="max-w-md mx-auto space-y-3">
              {['✅ Symptoms recorded', '✅ Patient data processed', '🔄 Matching diagnoses...', '⏳ Generating report...']
                .map((s, i) => (
                <div key={i} className="bg-white rounded-xl px-4 py-3 border border-gray-100 text-left">
                  <span className="text-sm text-gray-600">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'result' && result && (
          <div className="space-y-6">

            {/* Urgency */}
            <div className={`rounded-xl p-4 border-2 text-center ${
              result.urgencyColor === 'green'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <p className={`text-xl font-bold ${
                result.urgencyColor === 'green'
                  ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.urgencyColor === 'green' ? '🟢' : '🚨'} {result.urgency}
              </p>
            </div>

            {/* Diagnoses */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">
                Possible Diagnoses
              </h3>
              <div className="space-y-4">
                {result.diagnoses.map((d: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {i + 1}. {d.name}
                      </span>
                      <span className="text-sm font-bold text-blue-900">
                        {d.probability}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-900 h-2 rounded-full"
                        style={{ width: `${d.probability}%` }}
                      />
                    </div>
                    <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                      d.severity === 'Mild' ? 'bg-green-100 text-green-700' :
                      d.severity === 'Moderate' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {d.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-2">💡 Recommendation</h3>
              <p className="text-blue-700 text-sm">{result.recommendation}</p>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
              <p className="text-yellow-700 text-xs">
                ⚠️ AI suggestions only. Not a clinical diagnosis. Consult a doctor.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="bg-blue-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-800">
                📄 Download Report
              </button>
              <button
                onClick={() => { setStep('form'); setSelected([]); setResult(null); }}
                className="bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-200">
                🔄 New Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisAI;