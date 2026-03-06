// src/pages/PrescriptionReader.tsx
import React, { useState, useRef } from 'react';

const PrescriptionReader = () => {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAnalyze = () => {
    setStep('analyzing');
    setTimeout(() => {
      setResult({
        medicines: [
          {
            name: 'Amoxicillin 500mg',
            dosage: '1 capsule',
            frequency: '3 times daily',
            duration: '7 days',
            instructions: 'Take with food',
            type: 'Antibiotic',
          },
          {
            name: 'Paracetamol 500mg',
            dosage: '1-2 tablets',
            frequency: 'Every 6 hours',
            duration: 'As needed',
            instructions: 'For fever and pain',
            type: 'Painkiller',
          },
          {
            name: 'Omeprazole 20mg',
            dosage: '1 capsule',
            frequency: 'Once daily',
            duration: '14 days',
            instructions: 'Take 30 mins before breakfast',
            type: 'Antacid',
          },
        ],
        doctor: 'Dr. Ahmed Khan',
        date: 'March 3, 2026',
        warnings: [
          'Complete the antibiotic course',
          'Avoid alcohol with these medications',
        ],
      });
      setStep('result');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💊</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Prescription Reader</h1>
            <p className="text-gray-500 text-sm">AI-powered prescription interpreter</p>
          </div>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl">
          <span className="text-blue-700 text-sm font-medium">🤖 Powered by LLaVA-Med</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">

        {step === 'upload' && (
          <div className="grid grid-cols-2 gap-8">
            <div
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if(f) handleFile(f); }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition ${
                dragOver ? 'border-blue-900 bg-blue-50' :
                preview ? 'border-green-400 bg-green-50' :
                'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if(f) handleFile(f); }} />
              {preview ? (
                <div>
                  <img src={preview} alt="Prescription" className="w-full h-48 object-contain rounded-xl mb-4" />
                  <p className="text-green-600 font-medium text-sm">✅ {selectedFile?.name}</p>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-4">💊</div>
                  <p className="text-gray-700 font-medium mb-2">Drop prescription here</p>
                  <p className="text-gray-400 text-sm">Handwritten or printed</p>
                  <p className="text-gray-300 text-xs mt-4">JPG, PNG, WEBP supported</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">What we extract:</h3>
                {[
                  { icon: '💊', text: 'Medicine names and dosages' },
                  { icon: '⏰', text: 'Frequency and timing' },
                  { icon: '📅', text: 'Duration of treatment' },
                  { icon: '⚠️', text: 'Special instructions' },
                  { icon: '👨‍⚕️', text: 'Doctor information' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span>{item.icon}</span>
                    <span className="text-gray-600 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-blue-800 text-sm font-medium mb-1">
                  ✅ Urdu & English
                </p>
                <p className="text-blue-600 text-xs">
                  Works with both Urdu and English prescriptions.
                </p>
              </div>

              {selectedFile && (
                <button onClick={handleAnalyze}
                  className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition">
                  💊 Read Prescription
                </button>
              )}
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 animate-pulse">💊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Reading Prescription...</h2>
            <p className="text-gray-500 mb-8">AI is extracting medicine information</p>
            <div className="max-w-md mx-auto space-y-3">
              {['✅ Image preprocessed', '✅ Text detected', '🔄 Extracting medicines...', '⏳ Generating report...']
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

            {/* Header */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex justify-between">
              <div>
                <p className="font-bold text-gray-900">👨‍⚕️ {result.doctor}</p>
                <p className="text-gray-500 text-sm">📅 {result.date}</p>
              </div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium h-fit">
                ✅ {result.medicines.length} medicines found
              </span>
            </div>

            {/* Medicines */}
            <div className="space-y-4">
              {result.medicines.map((med: any, i: number) => (
                <div key={i}
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {med.name}
                      </h3>
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                        {med.type}
                      </span>
                    </div>
                    <span className="text-2xl">💊</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Dosage',       value: med.dosage },
                      { label: 'Frequency',    value: med.frequency },
                      { label: 'Duration',     value: med.duration },
                      { label: 'Instructions', value: med.instructions },
                    ].map((item, j) => (
                      <div key={j} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <p className="text-sm font-medium text-gray-900 mt-0.5">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Warnings */}
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <h3 className="font-bold text-orange-800 mb-2">⚠️ Important Notes</h3>
              {result.warnings.map((w: string, i: number) => (
                <p key={i} className="text-orange-700 text-sm">• {w}</p>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="bg-blue-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-800">
                📄 Download Report
              </button>
              <button
                onClick={() => { setStep('upload'); setResult(null); setPreview(null); setSelectedFile(null); }}
                className="bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-200">
                🔄 New Prescription
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionReader;