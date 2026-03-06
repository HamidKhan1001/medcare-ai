// src/pages/VitalSigns.tsx
import React, { useState } from 'react';

const VitalSigns = () => {
  const [vitals, setVitals] = useState({
    systolic:   '',
    diastolic:  '',
    heartRate:  '',
    temperature:'',
    oxygen:     '',
    sugar:      '',
    weight:     '',
    height:     '',
  });
  const [result, setResult] = useState<any>(null);
  const [step, setStep] = useState<'form' | 'result'>('form');

  const analyze = () => {
    const findings: any[] = [];
    let maxSeverity = 'normal';

    // Blood Pressure
    const sys = parseInt(vitals.systolic);
    const dia = parseInt(vitals.diastolic);
    if (sys && dia) {
      if (sys >= 180 || dia >= 120) {
        findings.push({ vital: 'Blood Pressure', value: `${sys}/${dia} mmHg`, status: 'URGENT', color: 'red', note: 'Hypertensive crisis! Seek emergency care!' });
        maxSeverity = 'urgent';
      } else if (sys >= 140 || dia >= 90) {
        findings.push({ vital: 'Blood Pressure', value: `${sys}/${dia} mmHg`, status: 'High', color: 'orange', note: 'Stage 2 Hypertension. See doctor.' });
        if (maxSeverity === 'normal') maxSeverity = 'moderate';
      } else if (sys >= 130 || dia >= 80) {
        findings.push({ vital: 'Blood Pressure', value: `${sys}/${dia} mmHg`, status: 'Elevated', color: 'yellow', note: 'Stage 1 Hypertension. Monitor closely.' });
        if (maxSeverity === 'normal') maxSeverity = 'mild';
      } else {
        findings.push({ vital: 'Blood Pressure', value: `${sys}/${dia} mmHg`, status: 'Normal', color: 'green', note: 'Healthy blood pressure.' });
      }
    }

    // Heart Rate
    const hr = parseInt(vitals.heartRate);
    if (hr) {
      if (hr > 100) {
        findings.push({ vital: 'Heart Rate', value: `${hr} bpm`, status: 'High', color: 'orange', note: 'Tachycardia. Consult doctor.' });
      } else if (hr < 60) {
        findings.push({ vital: 'Heart Rate', value: `${hr} bpm`, status: 'Low', color: 'yellow', note: 'Bradycardia. Monitor if symptomatic.' });
      } else {
        findings.push({ vital: 'Heart Rate', value: `${hr} bpm`, status: 'Normal', color: 'green', note: 'Normal heart rate.' });
      }
    }

    // Temperature
    const temp = parseFloat(vitals.temperature);
    if (temp) {
      if (temp >= 39.5) {
        findings.push({ vital: 'Temperature', value: `${temp}°C`, status: 'High Fever', color: 'red', note: 'High fever! Seek medical attention.' });
      } else if (temp >= 37.5) {
        findings.push({ vital: 'Temperature', value: `${temp}°C`, status: 'Fever', color: 'orange', note: 'Fever present. Rest and hydrate.' });
      } else {
        findings.push({ vital: 'Temperature', value: `${temp}°C`, status: 'Normal', color: 'green', note: 'Normal temperature.' });
      }
    }

    // Oxygen
    const o2 = parseInt(vitals.oxygen);
    if (o2) {
      if (o2 < 90) {
        findings.push({ vital: 'Oxygen Level', value: `${o2}%`, status: 'URGENT', color: 'red', note: 'Critical oxygen level! Emergency!' });
        maxSeverity = 'urgent';
      } else if (o2 < 95) {
        findings.push({ vital: 'Oxygen Level', value: `${o2}%`, status: 'Low', color: 'orange', note: 'Below normal. See doctor.' });
      } else {
        findings.push({ vital: 'Oxygen Level', value: `${o2}%`, status: 'Normal', color: 'green', note: 'Normal oxygen saturation.' });
      }
    }

    // Blood Sugar
    const sugar = parseInt(vitals.sugar);
    if (sugar) {
      if (sugar > 200) {
        findings.push({ vital: 'Blood Sugar', value: `${sugar} mg/dL`, status: 'High', color: 'red', note: 'Hyperglycemia! Consult doctor.' });
      } else if (sugar < 70) {
        findings.push({ vital: 'Blood Sugar', value: `${sugar} mg/dL`, status: 'Low', color: 'orange', note: 'Hypoglycemia! Eat something sweet.' });
      } else {
        findings.push({ vital: 'Blood Sugar', value: `${sugar} mg/dL`, status: 'Normal', color: 'green', note: 'Normal blood sugar.' });
      }
    }

    // BMI
    const w = parseFloat(vitals.weight);
    const h = parseFloat(vitals.height) / 100;
    if (w && h) {
      const bmi = w / (h * h);
      const bmiRound = bmi.toFixed(1);
      if (bmi >= 30) {
        findings.push({ vital: 'BMI', value: bmiRound, status: 'Obese', color: 'red', note: 'Obesity. Diet and exercise recommended.' });
      } else if (bmi >= 25) {
        findings.push({ vital: 'BMI', value: bmiRound, status: 'Overweight', color: 'yellow', note: 'Overweight. Lifestyle changes recommended.' });
      } else if (bmi < 18.5) {
        findings.push({ vital: 'BMI', value: bmiRound, status: 'Underweight', color: 'yellow', note: 'Underweight. Increase nutrition intake.' });
      } else {
        findings.push({ vital: 'BMI', value: bmiRound, status: 'Normal', color: 'green', note: 'Healthy BMI.' });
      }
    }

    setResult({ findings, maxSeverity });
    setStep('result');
  };

  const colorMap: Record<string, string> = {
    green:  'bg-green-50 border-green-200 text-green-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    red:    'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Vital Signs Monitor</h1>
            <p className="text-gray-500 text-sm">Track and analyze your health vitals</p>
          </div>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl">
          <span className="text-blue-700 text-sm font-medium">📊 AI Analysis</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8">

        {step === 'form' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-6">Enter Your Vitals</h3>
              <div className="grid grid-cols-2 gap-6">

                {/* Blood Pressure */}
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    🩺 Blood Pressure (mmHg)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="Systolic (e.g. 120)"
                      value={vitals.systolic}
                      onChange={e => setVitals({...vitals, systolic: e.target.value})}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-900" />
                    <input type="number" placeholder="Diastolic (e.g. 80)"
                      value={vitals.diastolic}
                      onChange={e => setVitals({...vitals, diastolic: e.target.value})}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-900" />
                  </div>
                </div>

                {[
                  { key: 'heartRate',   icon: '💓', label: 'Heart Rate (bpm)',        placeholder: 'e.g. 72' },
                  { key: 'temperature', icon: '🌡️', label: 'Temperature (°C)',        placeholder: 'e.g. 37.0' },
                  { key: 'oxygen',      icon: '💨', label: 'Oxygen Level (%)',         placeholder: 'e.g. 98' },
                  { key: 'sugar',       icon: '🍬', label: 'Blood Sugar (mg/dL)',      placeholder: 'e.g. 95' },
                  { key: 'weight',      icon: '⚖️', label: 'Weight (kg)',             placeholder: 'e.g. 70' },
                  { key: 'height',      icon: '📏', label: 'Height (cm)',             placeholder: 'e.g. 175' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      {field.icon} {field.label}
                    </label>
                    <input
                      type="number"
                      placeholder={field.placeholder}
                      value={(vitals as any)[field.key]}
                      onChange={e => setVitals({...vitals, [field.key]: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-900"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={analyze}
              className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition">
              📊 Analyze Vitals
            </button>
          </div>
        )}

        {step === 'result' && result && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Analysis Results
              </h2>
              <button
                onClick={() => { setStep('form'); setResult(null); }}
                className="text-blue-900 text-sm font-medium hover:underline">
                ← Enter New Vitals
              </button>
            </div>

            {result.findings.map((f: any, i: number) => (
              <div key={i}
                className={`rounded-xl p-4 border-2 ${colorMap[f.color]}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{f.vital}</p>
                    <p className="text-2xl font-bold mt-1">{f.value}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border ${colorMap[f.color]}`}>
                    {f.status}
                  </span>
                </div>
                <p className="text-sm mt-2 opacity-80">{f.note}</p>
              </div>
            ))}

            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-yellow-700 text-xs">
                ⚠️ These readings are for monitoring only. Consult a doctor for medical advice.
              </p>
            </div>

            <button className="w-full bg-blue-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-800">
              📄 Download Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VitalSigns;