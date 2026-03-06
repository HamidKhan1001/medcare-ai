// src/pages/BoneScan.tsx
import React, { useState, useRef } from 'react';
import { generateMedicalPDF } from '../utils/generatePDF';
import { analyzeScan } from '../services/api';

const BoneScan = () => {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showUrdu, setShowUrdu] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setStep('analyzing');

    try {
      const data = await analyzeScan('bone', selectedFile);
      setResult({
        report     : data.report,
        urdu_report: data.report_urdu,
        severity   : data.severity,
        confidence : data.confidence,
        time       : data.time_seconds,
        demo       : false,
      });
    } catch (err: any) {
      // Colab offline — show demo result
      setResult({
        report: `TECHNIQUE: AP view, right hand/wrist.

FINDINGS:
- Bone density: Normal cortical and trabecular density.
- Fractures: No acute fracture or dislocation identified.
- Joint spaces: Preserved throughout. No joint space narrowing.
- Alignment: Normal bony alignment.
- Soft tissues: Unremarkable.

IMPRESSION:
1. Normal bone scan
2. No acute osseous pathology

RECOMMENDATION:
No further imaging required. Clinical correlation recommended.

SEVERITY: Normal`,
        severity  : '🟢 Normal',
        confidence: 92,
        time      : 0,
        demo      : true,
      });
    } finally {
      setStep('result');
    }
  };

  const severityColor =
    result?.severity?.includes('Normal')   ? 'bg-green-100 text-green-700 border-green-200' :
    result?.severity?.includes('Mild')     ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
    result?.severity?.includes('Moderate') ? 'bg-orange-100 text-orange-700 border-orange-200' :
    'bg-red-100 text-red-700 border-red-200';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🦴</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Bone Scan Analysis</h1>
            <p className="text-gray-500 text-sm">AI-powered orthopedic imaging</p>
          </div>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl">
          <span className="text-blue-700 text-sm font-medium">🤖 Powered by LLaVA-Med</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">

        {/* Upload Step */}
        {step === 'upload' && (
          <div className="grid grid-cols-2 gap-8">
            <div
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if(f) handleFile(f); }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition ${
                dragOver   ? 'border-blue-900 bg-blue-50' :
                preview    ? 'border-green-400 bg-green-50' :
                'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if(f) handleFile(f); }} />
              {preview ? (
                <div>
                  <img src={preview} alt="Bone Scan" className="w-full h-48 object-contain rounded-xl mb-4" />
                  <p className="text-green-600 font-medium text-sm">✅ {selectedFile?.name}</p>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-4">🦴</div>
                  <p className="text-gray-700 font-medium mb-2">Drop bone scan here</p>
                  <p className="text-gray-400 text-sm">X-ray, MRI, CT scan</p>
                  <p className="text-gray-300 text-xs mt-4">JPG, PNG, WEBP supported</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">What we analyze:</h3>
                {[
                  { icon: '🦴', text: 'Fractures and breaks' },
                  { icon: '📊', text: 'Bone density assessment' },
                  { icon: '🔍', text: 'Joint abnormalities' },
                  { icon: '⚠️', text: 'Bone lesions or tumors' },
                  { icon: '✅', text: 'Overall bone health' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span>{item.icon}</span>
                    <span className="text-gray-600 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                <p className="text-yellow-700 text-xs">
                  ⚠️ AI analysis only. Always consult an orthopedic specialist.
                </p>
              </div>

              {selectedFile && (
                <button onClick={handleAnalyze}
                  className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition">
                  🦴 Analyze Bone Scan
                </button>
              )}
            </div>
          </div>
        )}

        {/* Analyzing Step */}
        {step === 'analyzing' && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 animate-pulse">🦴</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Analyzing Bone Scan...
            </h2>
            <p className="text-gray-500 mb-8">
              AI is examining bone structure
            </p>
            <div className="max-w-md mx-auto space-y-3">
              {[
                '✅ Image uploaded',
                '✅ Preprocessing done',
                '🔄 Analyzing bone structure...',
                '⏳ Generating report...'
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl px-4 py-3 border border-gray-100 text-left">
                  <span className="text-sm text-gray-600">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result Step */}
        {step === 'result' && result && (
          <div className="grid grid-cols-2 gap-8">
            {/* Left */}
            <div className="space-y-4">
              {preview && (
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <img src={preview} alt="Scan" className="w-full rounded-xl" />
                </div>
              )}

              <div className={`rounded-xl p-4 border-2 text-center ${severityColor}`}>
                <p className="text-2xl font-bold">{result.severity}</p>
                <p className="text-sm mt-1">AI Severity Assessment</p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">AI Confidence</span>
                  <span className="font-bold text-blue-900">{result.confidence}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-900 h-2 rounded-full transition-all"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  ⏱️ Analysis: {result.time}s
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => generateMedicalPDF({
                    scanType  : 'bone',
                    report    : result.report,
                    severity  : result.severity,
                    confidence: result.confidence,
                    time      : result.time,
                    filename  : selectedFile?.name || 'bone.jpg',
                  })}
                  className="bg-blue-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-800">
                  📄 Download PDF
                </button>
                <button
                  onClick={() => { setStep('upload'); setResult(null); setPreview(null); }}
                  className="bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-200">
                  🔄 New Scan
                </button>
              </div>
            </div>

            {/* Right */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              {result.demo && (
                <div className="px-4 py-2 bg-orange-50 border-b border-orange-100 rounded-t-xl">
                  <p className="text-orange-600 text-xs font-medium">
                    🟡 Demo Mode — Colab offline. Connect Colab for real AI analysis.
                  </p>
                </div>
              )}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">AI Orthopedic Report</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowUrdu(!showUrdu)}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    {showUrdu ? '🇬🇧 English' : '🇵🇰 اردو'}
                  </button>
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                    ⏳ Doctor review pending
                  </span>
                </div>
              </div>
              <div className="p-6">
                <pre className={`text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed ${
                  showUrdu ? 'text-right' : ''
                }`}>
                  {showUrdu ? result.urdu_report : result.report}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoneScan;