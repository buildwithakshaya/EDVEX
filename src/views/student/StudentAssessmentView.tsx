import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import { AssessmentCategory, AssessmentQuestion, AssessmentAttempt } from '../../types';
import { Award, CheckCircle2, RotateCcw, ArrowRight, Clock, HelpCircle } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';

export const StudentAssessmentView: React.FC = () => {
  const { studentProfile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<AssessmentCategory>('Technical');
  const [inProgress, setInProgress] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [testResult, setTestResult] = useState<AssessmentAttempt | null>(null);

  if (!studentProfile) return null;

  const attempts = db.getAssessmentAttempts(studentProfile.id);
  const questions: AssessmentQuestion[] = db.getAssessmentQuestions(selectedCategory);

  const startAssessment = () => {
    setInProgress(true);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setTestResult(null);
  };

  const handleSelectAnswer = (optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (questions.length === 0) return;

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);

    const attemptRecord: AssessmentAttempt = {
      id: `att_${Date.now()}`,
      studentId: studentProfile.id,
      category: selectedCategory,
      scorePercentage,
      totalQuestions: questions.length,
      correctCount,
      completedAt: new Date().toISOString()
    };

    db.recordAssessmentAttempt(attemptRecord);
    setTestResult(attemptRecord);
    setInProgress(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Skill Competency Assessments</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real dynamic tests across Technical, Aptitude, and Communication. Real scores feed into the 20% assessment quota.
          </p>
        </div>
      </div>

      {/* QUIZ ACTIVE VIEW */}
      {inProgress ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <Badge variant="indigo" size="md">
                {selectedCategory} Assessment
              </Badge>
              <span className="text-xs text-slate-500 ml-2">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Self-Paced</span>
            </div>
          </div>

          <ProgressBar
            value={((currentIndex + 1) / questions.length) * 100}
            size="sm"
            color="indigo"
          />

          {questions.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold tracking-wide uppercase text-indigo-600">
                  Topic: {questions[currentIndex].skillName} &bull; {questions[currentIndex].difficulty}
                </span>
                <h3 className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                  {questions[currentIndex].question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2 pt-2">
                {questions[currentIndex].options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectAnswer(optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold ring-1 ring-indigo-500'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation controls */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={handlePrev}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 disabled:opacity-40 rounded-lg hover:bg-slate-100 transition"
                >
                  Previous
                </button>

                {currentIndex === questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition cursor-pointer"
                  >
                    Submit Test & Calculate Score
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition cursor-pointer flex items-center gap-1"
                  >
                    Next Question <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No questions found in this assessment category.</p>
          )}
        </div>
      ) : (
        /* TEST SELECTION & PAST ATTEMPTS VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Start Test Card */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Start a Validated Assessment</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select category to test and record score directly to the database.
              </p>
            </div>

            {/* Category Selector */}
            <div className="grid grid-cols-3 gap-3">
              {(['Technical', 'Aptitude', 'Communication'] as AssessmentCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">{cat}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {cat === 'Technical' ? 'Domain & Engineering' : cat === 'Aptitude' ? 'Quant & Reasoning' : 'Workplace Soft Skills'}
                  </p>
                </button>
              ))}
            </div>

            {/* Test info */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between">
                <span>Available Questions:</span>
                <span className="font-bold text-slate-900">{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Scoring Format:</span>
                <span className="font-bold text-slate-900">Automatic percentage</span>
              </div>
              <div className="flex justify-between">
                <span>Impact:</span>
                <span className="font-bold text-indigo-700">Dynamic Job Readiness (20% quota)</span>
              </div>
            </div>

            {testResult && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between animate-in fade-in">
                <div>
                  <p className="text-xs font-bold text-emerald-900">Assessment Successfully Completed!</p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Score: <b>{testResult.scorePercentage}%</b> ({testResult.correctCount} / {testResult.totalQuestions} correct). Stored in DB.
                  </p>
                </div>
                <Badge variant="emerald" size="md">
                  {testResult.scorePercentage}%
                </Badge>
              </div>
            )}

            <button
              type="button"
              onClick={startAssessment}
              disabled={questions.length === 0}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              Begin {selectedCategory} Assessment
            </button>
          </div>

          {/* Past Attempts History */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Attempt History</h3>
                <span className="text-[11px] text-slate-400 font-mono">{attempts.length} attempts</span>
              </div>

              {attempts.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  No assessment attempts yet.<br />Take your first test to improve your score.
                </div>
              ) : (
                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                  {attempts.map((att) => (
                    <div
                      key={att.id}
                      className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-800">{att.category}</p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(att.completedAt).toLocaleDateString()} &bull; {att.correctCount}/{att.totalQuestions}
                        </p>
                      </div>
                      <Badge
                        variant={att.scorePercentage >= 70 ? 'emerald' : att.scorePercentage >= 50 ? 'amber' : 'rose'}
                        size="sm"
                      >
                        {att.scorePercentage}%
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {attempts.length > 0 && (
              <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-500">
                Average Assessment Score:{' '}
                <b className="text-slate-900">
                  {Math.round(attempts.reduce((a, b) => a + b.scorePercentage, 0) / attempts.length)}%
                </b>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
