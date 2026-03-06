// src/pages/EmergencyAid.tsx
import React, { useState } from 'react';

const emergencies = [
  {
    id: 'heart',
    icon: '💓',
    title: 'Heart Attack',
    color: 'red',
    symptoms: ['Chest pain', 'Left arm pain', 'Shortness of breath', 'Sweating'],
    steps: [
      'Call 1122 or 115 immediately',
      'Make patient sit or lie down comfortably',
      'Loosen tight clothing around chest',
      'Give aspirin 325mg if available and not allergic',
      'Do NOT give food or water',
      'Start CPR if patient becomes unconscious',
    ],
    warning: 'Every minute matters! Call emergency services FIRST!'
  },
  {
    id: 'stroke',
    icon: '🧠',
    title: 'Stroke',
    color: 'red',
    symptoms: ['Face drooping', 'Arm weakness', 'Speech difficulty', 'Sudden confusion'],
    steps: [
      'Call 1122 immediately — time is critical',
      'Use FAST test: Face, Arms, Speech, Time',
      'Note exact time symptoms started',
      'Keep patient calm and still',
      'Do NOT give food, water or medicines',
      'Do NOT let patient sleep',
    ],
    warning: 'Brain cells die every minute. Act FAST!'
  },
  {
    id: 'choking',
    icon: '😮',
    title: 'Choking',
    color: 'orange',
    symptoms: ['Cannot speak', 'Cannot breathe', 'Turning blue', 'Hands on throat'],
    steps: [
      'Ask "Are you choking?" — if yes, act immediately',
      'Give 5 back blows between shoulder blades',
      'Give 5 abdominal thrusts (Heimlich maneuver)',
      'Alternate back blows and abdominal thrusts',
      'If unconscious — start CPR',
      'Call 1122 if object not removed in 1 minute',
    ],
    warning: 'Act immediately — unconsciousness can occur in minutes!'
  },
  {
    id: 'bleeding',
    icon: '🩸',
    title: 'Severe Bleeding',
    color: 'red',
    symptoms: ['Heavy blood loss', 'Deep wound', 'Blood not stopping', 'Pale skin'],
    steps: [
      'Call 1122 for severe bleeding',
      'Apply firm direct pressure with clean cloth',
      'Do NOT remove the cloth — add more on top',
      'Elevate injured area above heart level',
      'Keep patient warm and calm',
      'Monitor for signs of shock',
    ],
    warning: 'Severe blood loss can cause death within minutes!'
  },
  {
    id: 'burn',
    icon: '🔥',
    title: 'Burns',
    color: 'orange',
    symptoms: ['Red skin', 'Blisters', 'Severe pain', 'Charred skin'],
    steps: [
      'Remove from heat source immediately',
      'Cool burn with cool (not cold) running water for 20 mins',
      'Do NOT use ice, butter or toothpaste',
      'Remove jewelry near the burn',
      'Cover with clean non-fluffy material',
      'Call 1122 for severe or large burns',
    ],
    warning: 'Never use ice or home remedies on burns!'
  },
  {
    id: 'fracture',
    icon: '🦴',
    title: 'Bone Fracture',
    color: 'yellow',
    symptoms: ['Severe pain', 'Swelling', 'Deformity', 'Cannot move limb'],
    steps: [
      'Do NOT move the injured area',
      'Immobilize with splint if available',
      'Apply ice wrapped in cloth for 20 mins',
      'Elevate the injured limb if possible',
      'Do NOT try to straighten the bone',
      'Call 1122 for spine/neck fractures',
    ],
    warning: 'Never try to realign a broken bone yourself!'
  },
  {
    id: 'unconscious',
    icon: '😴',
    title: 'Unconscious Person',
    color: 'red',
    symptoms: ['Not responding', 'Not breathing', 'No pulse', 'Eyes closed'],
    steps: [
      'Check for response — tap shoulders, shout',
      'Call 1122 immediately',
      'Check breathing — look, listen, feel',
      'If not breathing — start CPR immediately',
      '30 chest compressions then 2 rescue breaths',
      'Continue until help arrives',
    ],
    warning: 'Start CPR immediately if no breathing or pulse!'
  },
  {
    id: 'allergic',
    icon: '⚠️',
    title: 'Allergic Reaction',
    color: 'orange',
    symptoms: ['Hives/rash', 'Throat swelling', 'Difficulty breathing', 'Dizziness'],
    steps: [
      'Call 1122 for severe reactions immediately',
      'Use EpiPen if available and prescribed',
      'Help patient sit upright if breathing difficulty',
      'Lay patient flat if dizzy or faint',
      'Remove or avoid allergen if known',
      'Monitor breathing closely',
    ],
    warning: 'Anaphylaxis can be fatal — act immediately!'
  },
];

const colorMap: Record<string, string> = {
  red:    'bg-red-50 border-red-200',
  orange: 'bg-orange-50 border-orange-200',
  yellow: 'bg-yellow-50 border-yellow-200',
};

const textMap: Record<string, string> = {
  red:    'text-red-700',
  orange: 'text-orange-700',
  yellow: 'text-yellow-700',
};

const badgeMap: Record<string, string> = {
  red:    'bg-red-100 text-red-700',
  orange: 'bg-orange-100 text-orange-700',
  yellow: 'bg-yellow-100 text-yellow-700',
};

const EmergencyAid = () => {
  const [selected, setSelected] =
    useState<any>(null);

  if (selected) return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 text-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{selected.icon}</span>
          <h1 className="text-xl font-bold">
            {selected.title} — First Aid
          </h1>
        </div>
        <button
          onClick={() => setSelected(null)}
          className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium text-sm">
          ← Back
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-8">

        {/* Warning */}
        <div className="bg-red-600 text-white rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">🚨</span>
          <p className="font-bold text-sm">
            {selected.warning}
          </p>
        </div>

        {/* Emergency Call */}
        <div className="bg-white rounded-xl p-6 border-2 border-red-200 mb-6 text-center">
          <p className="text-gray-600 text-sm mb-3">
            Pakistan Emergency Numbers
          </p>
          <div className="flex justify-center gap-6">
            {[
              { num: '1122', label: 'Rescue' },
              { num: '115',  label: 'Edhi' },
              { num: '1021', label: 'Chippa' },
            ].map((e, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {e.num}
                </p>
                <p className="text-gray-500 text-xs">{e.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
          <h3 className="font-bold text-gray-900 mb-4">
            ⚠️ Symptoms
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {selected.symptoms.map((s: string, i: number) => (
              <div key={i}
                className="flex items-center gap-2 bg-red-50 rounded-lg p-2">
                <span className="text-red-500">•</span>
                <span className="text-sm text-gray-700">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">
            ✅ First Aid Steps
          </h3>
          <div className="space-y-3">
            {selected.steps.map((step: string, i: number) => (
              <div key={i}
                className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-7 h-7 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-gray-700 text-sm pt-0.5">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 text-white px-8 py-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🚨</span>
          <div>
            <h1 className="text-xl font-bold">
              Emergency First Aid
            </h1>
            <p className="text-red-200 text-sm">
              Instant guidance for emergencies
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">

        {/* Emergency Numbers */}
        <div className="bg-red-600 text-white rounded-xl p-6 mb-8">
          <h2 className="font-bold mb-4 text-center">
            🚨 Pakistan Emergency Numbers
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { num: '1122', label: 'Rescue Punjab' },
              { num: '115',  label: 'Edhi Foundation' },
              { num: '1021', label: 'Chippa Welfare' },
            ].map((e, i) => (
              <div key={i}
                className="bg-red-700 rounded-xl p-4">
                <p className="text-3xl font-bold">{e.num}</p>
                <p className="text-red-200 text-sm mt-1">{e.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Select Emergency */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Select Emergency Type:
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {emergencies.map((em) => (
            <button
              key={em.id}
              onClick={() => setSelected(em)}
              className={`flex items-center gap-4 p-5 rounded-xl border-2 text-left hover:shadow-md transition ${colorMap[em.color]}`}>
              <span className="text-4xl">{em.icon}</span>
              <div>
                <p className={`font-bold ${textMap[em.color]}`}>
                  {em.title}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {em.symptoms.slice(0, 2).join(', ')}
                </p>
              </div>
              <span className={`ml-auto text-xs px-2 py-1 rounded-full font-medium ${badgeMap[em.color]}`}>
                {em.color === 'red' ? '🚨 Critical' : '⚠️ Urgent'}
              </span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default EmergencyAid;