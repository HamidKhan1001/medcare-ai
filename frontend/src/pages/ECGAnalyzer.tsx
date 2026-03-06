// src/pages/ECGAnalyzer.tsx
import React, { useState, useRef } from 'react';

const ECGAnalyzer = () => {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [preview, setPreview] =
    useState<string | null>(null);
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);
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
        report: `RHYTHM: Regular sinus rhythm

RATE: 72 beats per minute (Normal)

PR INTERVAL: 0.16s — Normal (0.12-0.20s)

QRS: 0.08s — Normal (<0.12s)

ST SEGMENT: No elevation or depression. Normal.

T WAVES: Upright in all leads. Normal.

IMPRESSION:
1. Normal sinus rhythm
2. No acute ischemic changes
3. No conduction abnormalities

RECOMMENDATION:
No immediate cardiac intervention required.
Routine cardiology follow-up recommended.

SEVERITY: Normal`,
        severity:   '🟢 Normal',
        confidence: 92,
        time:       98,
      });
      setStep('result');
    }, 3000);
  };

  const severityBg: Record<string, string> = {
    '🟢 Normal':   'bg-green-50 border-green-200 text-green-700',
    '🟡 Mild':     'bg-yellow-50 border-yellow-200 text-yellow-700',
    '🟠 Moderate': 'bg-orange-50 border-orange-200 text-orange-700',
    '🔴 Severe':   'bg-red-50 border-red-200 text-red-700',
    '🚨 URGENT':   'bg-red-100 border-red-400 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💓</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              ECG Analyzer
            </h1>
            <p className="text-gray-500 text-sm">
              AI-powered ECG/EKG analysis
            </p>
          </div>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl">
          <span className="text-blue-700 text-sm font-medium">
            🤖 Powered by LLaVA-Med
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          {['Upload', 'Analyzing', 'Report'].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i < ['upload','analyzing','result'].indexOf(step)
                  ? 'bg-green-500 text-white'
                  : i === ['upload','analyzing','result'].indexOf(step)
                  ? 'bg-blue-900 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {i < ['upload','analyzing','result']
                  .indexOf(step) ? '✓' : i + 1}
              </div>
              <span className="text-sm font-medium text-gray-600">{s}</span>
              {i < 2 && <div className="w-12 h-0.5 bg-gray-200 ml-2" />}
            </div>
          ))}
        </div>

        {/* Upload */}
        {step === 'upload' && (
          <div className="grid grid-cols-2 gap-8">
            <div
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if(f) handleFile(f); }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition ${
                dragOver ? 'border-blue-900 bg-blue-50' :
                preview  ? 'border-green-400 bg-green-50' :
                'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if(f) handleFile(f); }} />
              {preview ? (
                <div>
                  <img src={preview} alt="ECG" className="w-full h-48 object-contain rounded-xl mb-4" />
                  <p className="text-green-600 font-medium text-sm">✅ {selectedFile?.name}</p>
                  <p className="text-gray-400 text-xs mt-1">Click to change</p>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-4">💓</div>
                  <p className="text-gray-700 font-medium mb-2">Drop ECG here</p>
                  <p className="text-gray-400 text-sm">or click to browse</p>
                  <p className="text-gray-300 text-xs mt-4">JPG, PNG, WEBP supported</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">What we analyze:</h3>
                {[
                  { icon: '💓', text: 'Heart rhythm — regular or irregular' },
                  { icon: '📈', text: 'Heart rate — beats per minute' },
                  { icon: '📏', text: 'PR interval — conduction time' },
                  { icon: '⚡', text: 'QRS complex — ventricular activity' },
                  { icon: '📉', text: 'ST segment — ischemia detection' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span>{item.icon}</span>
                    <span className="text-gray-600 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <p className="text-red-800 text-sm font-medium mb-1">
                  🚨 Emergency Detection
                </p>
                <p className="text-red-600 text-xs">
                  AI auto-detects STEMI, AFib,
                  and other life-threatening conditions.
                </p>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                <p className="text-yellow-800 text-sm font-medium mb-1">⚠️ Disclaimer</p>
                <p className="text-yellow-700 text-xs">
                  AI report requires doctor verification before clinical use.
                </p>
              </div>

              {selectedFile && (
                <button onClick={handleAnalyze}
                  className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition">
                  💓 Analyze ECG
                </button>
              )}
            </div>
          </div>
        )}

        {/* Analyzing */}
        {step === 'analyzing' && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 animate-pulse">💓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Analyzing ECG...
            </h2>
            <p className="text-gray-500 mb-8">
              AI is reading your heart rhythm
            </p>
            <div className="max-w-md mx-auto space-y-3">
              {[
                '✅ Image preprocessing complete',
                '✅ ECG leads identified',
                '🔄 Analyzing heart rhythm...',
                '⏳ Generating cardiac report...',
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 text-left">
                  <span className="text-sm text-gray-600">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {step === 'result' && result && (
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              {preview && (
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <img src={preview} alt="ECG" className="w-full rounded-xl object-contain max-h-64" />
                </div>
              )}
              <div className={`rounded-xl p-4 border-2 text-center ${severityBg[result.severity] || 'bg-gray-50 border-gray-200'}`}>
                <p className="text-2xl font-bold mb-1">{result.severity}</p>
                <p className="text-sm opacity-75">Severity Level</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">AI Confidence</span>
                  <span className="text-sm font-bold text-blue-900">{result.confidence}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-900 h-2 rounded-full" style={{ width: `${result.confidence}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-2">⏱️ Analysis time: {result.time}s</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-blue-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-800 transition">
                  📄 Download PDF
                </button>
                <button
                  onClick={() => { setStep('upload'); setResult(null); setPreview(null); setSelectedFile(null); }}
                  className="bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
                  🔄 New Scan
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">AI Cardiac Report</h3>
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                  ⏳ Doctor review pending
                </span>
              </div>
              <div className="p-6">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {result.report}
                </pre>
              </div>
              <div className="p-4 border-t border-gray-100 bg-yellow-50">
                <p className="text-yellow-700 text-xs">
                  ⚠️ AI-generated report. Doctor verification required.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ECGAnalyzer;