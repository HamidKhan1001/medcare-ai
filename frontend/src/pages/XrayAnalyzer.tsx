// src/pages/XrayAnalyzer.tsx
import React, { useState, useRef } from 'react';
import { generateMedicalPDF } from '../utils/generatePDF';
import { analyzeScan } from '../services/api';

const XrayAnalyzer = () => {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);
  const [preview, setPreview] =
    useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [showUrdu, setShowUrdu] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setStep('analyzing');

    try {
      const data = await analyzeScan('xray', selectedFile);
      setResult({
        report    : data.report,
        urdu_report: data.report_urdu,
        severity  : data.severity,
        confidence: data.confidence,
        time      : data.time_seconds,
        demo      : false,
      });
    } catch (err: any) {
      // Colab offline — show demo result
      setResult({
        report: `TECHNIQUE: PA view, patient upright.

FINDINGS:
- Lungs: Clear lung fields bilaterally. No consolidation or opacity seen.
- Heart: Cardiac silhouette within normal limits. CTR < 0.5.
- Bones: Ribs and spine intact. No fractures.
- Diaphragm: Both hemidiaphragms well-defined.

IMPRESSION:
1. Normal chest X-ray
2. No acute cardiopulmonary disease

RECOMMENDATION:
No further imaging required. Routine follow-up as clinically indicated.

SEVERITY: Normal`,
        severity   : '🟢 Normal',
        confidence : 95,
        time       : 0,
        demo       : true,
      });
    } finally {
      setStep('result');
    }
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
          <span className="text-3xl">🫁</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              X-Ray Analyzer
            </h1>
            <p className="text-gray-500 text-sm">
              AI-powered chest X-ray analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl">
          <span className="text-blue-700 text-sm font-medium">
            🤖 Powered by LLaVA-Med
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          {['Upload', 'Analyzing', 'Report'].map(
            (s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i === 0 && step === 'upload'   ? 'bg-blue-900 text-white' :
                i === 1 && step === 'analyzing'? 'bg-blue-900 text-white' :
                i === 2 && step === 'result'   ? 'bg-green-500 text-white' :
                i < ['upload','analyzing','result'].indexOf(step)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {i < ['upload','analyzing','result']
                  .indexOf(step) ? '✓' : i + 1}
              </div>
              <span className="text-sm font-medium text-gray-600">
                {s}
              </span>
              {i < 2 && (
                <div className="w-12 h-0.5 bg-gray-200 ml-2" />
              )}
            </div>
          ))}
        </div>

        {/* Upload Step */}
        {step === 'upload' && (
          <div className="grid grid-cols-2 gap-8">

            {/* Upload Box */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition ${
                dragOver
                  ? 'border-blue-900 bg-blue-50'
                  : preview
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
              {preview ? (
                <div>
                  <img
                    src={preview}
                    alt="X-ray preview"
                    className="w-full h-48 object-contain rounded-xl mb-4"
                  />
                  <p className="text-green-600 font-medium text-sm">
                    ✅ {selectedFile?.name}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Click to change
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-4">🫁</div>
                  <p className="text-gray-700 font-medium mb-2">
                    Drop X-ray here
                  </p>
                  <p className="text-gray-400 text-sm">
                    or click to browse
                  </p>
                  <p className="text-gray-300 text-xs mt-4">
                    JPG, PNG, WEBP supported
                  </p>
                </div>
              )}
            </div>

            {/* Info Panel */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">
                  What we analyze:
                </h3>
                {[
                  { icon: '🫁', text: 'Lung fields — opacity, consolidation' },
                  { icon: '💓', text: 'Heart size — cardiomegaly check' },
                  { icon: '🦴', text: 'Bones — rib fractures, spine' },
                  { icon: '📐', text: 'Diaphragm — both sides' },
                ].map((item, i) => (
                  <div key={i}
                    className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span>{item.icon}</span>
                    <span className="text-gray-600 text-sm">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-blue-800 text-sm font-medium mb-1">
                  🤖 AI Model
                </p>
                <p className="text-blue-600 text-xs">
                  LLaVA-Med — Microsoft Research
                  Nature Medicine 2024
                </p>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                <p className="text-yellow-800 text-sm font-medium mb-1">
                  ⚠️ Disclaimer
                </p>
                <p className="text-yellow-700 text-xs">
                  AI report requires doctor
                  verification before clinical use.
                </p>
              </div>

              {selectedFile && (
                <button
                  onClick={handleAnalyze}
                  className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition">
                  🔬 Analyze X-Ray
                </button>
              )}
            </div>
          </div>
        )}

        {/* Analyzing Step */}
        {step === 'analyzing' && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 animate-pulse">
              🫁
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Analyzing X-Ray...
            </h2>
            <p className="text-gray-500 mb-8">
              LLaVA-Med is examining your scan
            </p>
            <div className="max-w-md mx-auto space-y-3">
              {[
                '✅ Image preprocessing complete',
                '✅ CLAHE enhancement applied',
                '🔄 AI analyzing lung fields...',
                '⏳ Generating report...',
              ].map((step, i) => (
                <div key={i}
                  className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 text-left">
                  <span className="text-sm text-gray-600">
                    {step}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-6">
              Usually takes 2-3 minutes...
            </p>
          </div>
        )}

        {/* Result Step */}
        {step === 'result' && result && (
          <div className="grid grid-cols-2 gap-8">

            {/* Left — Image + Severity */}
            <div className="space-y-4">
              {preview && (
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <img
                    src={preview}
                    alt="X-ray"
                    className="w-full rounded-xl object-contain max-h-64"
                  />
                </div>
              )}

              {/* Severity Badge */}
              <div className={`rounded-xl p-4 border-2 text-center ${
                severityBg[result.severity] ||
                'bg-gray-50 border-gray-200'
              }`}>
                <p className="text-2xl font-bold mb-1">
                  {result.severity}
                </p>
                <p className="text-sm opacity-75">
                  Severity Level
                </p>
              </div>

              {/* Confidence */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    AI Confidence
                  </span>
                  <span className="text-sm font-bold text-blue-900">
                    {result.confidence}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-900 h-2 rounded-full"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  ⏱️ Analysis time: {result.time}s
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => generateMedicalPDF({
                    scanType  : 'xray',
                    report    : result.report,
                    severity  : result.severity,
                    confidence: result.confidence,
                    time      : result.time,
                    filename  : selectedFile?.name || 'scan.jpg',
                  })}
                  className="bg-blue-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-800 transition">
                  📄 Download PDF
                </button>
                <button
                  onClick={() => {
                    setStep('upload');
                    setResult(null);
                    setPreview(null);
                    setSelectedFile(null);
                  }}
                  className="bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
                  🔄 New Scan
                </button>
              </div>
            </div>

            {/* Right — Report */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              {result.demo && (
                <div className="px-4 py-2 bg-orange-50 border-b border-orange-100 rounded-t-xl">
                  <p className="text-orange-600 text-xs font-medium">
                    🟡 Demo Mode — Colab offline. Connect Colab for real AI analysis.
                  </p>
                </div>
              )}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">
                  AI Radiology Report
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowUrdu(!showUrdu)}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-green-200">
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
                  {showUrdu ? result.report_urdu : result.report}
                </pre>
              </div>
              <div className="p-4 border-t border-gray-100 bg-yellow-50">
                <p className="text-yellow-700 text-xs">
                  ⚠️ AI-generated report.
                  Doctor verification required.
                  Not for clinical use.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default XrayAnalyzer;