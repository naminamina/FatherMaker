import { useState, useEffect, useRef, useCallback } from "react";
import { IntroScreen } from "./components/IntroScreen";
import { ExplanationScreen } from "./components/ExplanationScreen";
import { QuizScreen } from "./components/QuizScreen";
import { ResultScreen } from "./components/ResultScreen";
import { FatherScene } from "./components/FatherScene";
import { FatherLogPanel } from "./components/FatherLogPanel";
import { ItemPanel } from "./components/ItemPanel";
import { SummaryScreen } from "./components/SummaryScreen";
import type {
  AppStep,
  FatherProfile,
  LogEntry,
  FatherStats,
  QuizAnswer,
  FatherState,
  FatherTypeId,
} from "./types/father";
import { fatherProfiles } from "./data/fatherTypes";
import { quizQuestions } from "./data/quizQuestions";
import { quizToFatherType } from "./lib/quizToFatherType";
import { getTimeBasedState, updateStats } from "./lib/stateManagement";
import { generateLogEntry } from "./lib/textGenerator";
import { clearStorage, getStoredValue, setStoredValue } from "./lib/storage";
import "./App.css";
import "./styles/global.css";

const STATE_CHECK_INTERVAL_MS = 60 * 1000; // check once per minute
const STATE_MIN_DURATION_MS = 5 * 60 * 1000; // hold state for 5 minutes when possible
const LOG_SAVE_INTERVAL = 90 * 1000; // 90 seconds between logs for a calmer rhythm
const STORAGE_KEYS = {
  appState: "app-state",
};
const INITIAL_STATS: FatherStats = {
  energy: 60,
  fatigue: 40,
  mood: 70,
};

interface DiagnosisResult {
  typeId: FatherTypeId;
  answers: QuizAnswer[];
  completedAt: string;
}

interface PersistedAppState {
  currentStep: AppStep;
  fatherProfile: FatherProfile | null;
  fatherProfileId: FatherTypeId | null;
  currentFatherState: FatherState;
  stats: FatherStats;
  logs: LogEntry[];
  diagnosisResult: DiagnosisResult | null;
  lastStateChange: string | null;
}

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>("intro");
  const [fatherProfile, setFatherProfile] = useState<FatherProfile | null>(null);
  const [currentFatherState, setCurrentFatherState] = useState<FatherState>("resting");
  const [stats, setStats] = useState<FatherStats>({ ...INITIAL_STATS });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showPanel, setShowPanel] = useState<"logs" | "items" | "summary" | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [lastStateChange, setLastStateChange] = useState<string | null>(null);
  const lastStateChangeRef = useRef<number>(Date.now());

  // Load from cache
  useEffect(() => {
    const saved = getStoredValue<PersistedAppState>(STORAGE_KEYS.appState);
    if (saved) {
      if (saved.currentStep) {
        setCurrentStep(saved.currentStep);
      }
      if (saved.fatherProfile) {
        setFatherProfile(saved.fatherProfile);
      } else if (saved.fatherProfileId) {
        setFatherProfile(fatherProfiles[saved.fatherProfileId]);
      }
      if (saved.currentFatherState) {
        setCurrentFatherState(saved.currentFatherState);
      }
      if (saved.stats) {
        setStats(saved.stats);
      }
      if (saved.logs) {
        setLogs(saved.logs);
      }
      if (saved.diagnosisResult) {
        setDiagnosisResult(saved.diagnosisResult);
      }
      if (saved.lastStateChange) {
        setLastStateChange(saved.lastStateChange);
        lastStateChangeRef.current = new Date(saved.lastStateChange).getTime();
      } else {
        lastStateChangeRef.current = Date.now();
      }
    } else {
      lastStateChangeRef.current = Date.now();
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (lastStateChange) {
      lastStateChangeRef.current = new Date(lastStateChange).getTime();
    }
  }, [lastStateChange]);

  // Save to cache
  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    const stateToSave: PersistedAppState = {
      currentStep,
      fatherProfile,
      fatherProfileId: fatherProfile?.id || null,
      currentFatherState,
      stats,
      logs,
      diagnosisResult,
      lastStateChange,
    };
    setStoredValue(STORAGE_KEYS.appState, stateToSave);
  }, [
    currentStep,
    fatherProfile,
    currentFatherState,
    stats,
    logs,
    diagnosisResult,
    isHydrated,
  ]);

  const syncStateWithTime = useCallback(() => {
    if (!fatherProfile) {
      return;
    }

    const now = new Date();
    setCurrentFatherState((prev) => {
      const { desiredState, slotStates } = getTimeBasedState(now, fatherProfile, prev);
      const elapsed = now.getTime() - lastStateChangeRef.current;

      if (desiredState === prev) {
        return prev;
      }

      if (elapsed < STATE_MIN_DURATION_MS && slotStates.includes(prev)) {
        return prev;
      }

      lastStateChangeRef.current = now.getTime();
      setLastStateChange(now.toISOString());
      return desiredState;
    });
  }, [fatherProfile]);

  useEffect(() => {
    if (currentStep !== "main" || !fatherProfile) return;

    syncStateWithTime();
    const interval = window.setInterval(syncStateWithTime, STATE_CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [currentStep, fatherProfile, syncStateWithTime]);

  // Add log entry periodically
  useEffect(() => {
    if (currentStep !== "main" || !fatherProfile) return;

    const interval = setInterval(async () => {
      const logText = await generateLogEntry(currentFatherState, fatherProfile.id);
      const newLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        state: currentFatherState,
        text: logText,
      };
      setLogs((prev) => [...prev, newLog]);
    }, LOG_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [currentStep, fatherProfile, currentFatherState]);

  // Update stats when state changes
  useEffect(() => {
    if (currentStep === "main") {
      setStats((prev) => updateStats(currentFatherState, prev));
    }
  }, [currentFatherState, currentStep]);

  // Handle steps
  const handleIntroNext = () => {
    setCurrentStep("explanation");
  };

  const handleExplanationNext = () => {
    setCurrentStep("quiz");
  };

  const handleQuizComplete = (answers: QuizAnswer[]) => {
    const typeId = quizToFatherType(answers);
    const profile = fatherProfiles[typeId];
    setFatherProfile(profile);
    setDiagnosisResult({ typeId, answers, completedAt: new Date().toISOString() });
    setCurrentStep("result");
  };

  const handleResultNext = () => {
    if (!fatherProfile) return;
    setCurrentStep("main");
    setLogs([]);
    const now = new Date();
    const { desiredState } = getTimeBasedState(now, fatherProfile, "working");
    setCurrentFatherState(desiredState);
    setLastStateChange(now.toISOString());
    lastStateChangeRef.current = now.getTime();
    setStats({ ...INITIAL_STATS });
  };

  const handleNavigate = (tab: "logs" | "items" | "summary") => {
    setShowPanel(tab);
  };

  const handlePanelClose = () => {
    setShowPanel(null);
  };

  const handleReset = () => {
    setCurrentStep("intro");
    setFatherProfile(null);
    setCurrentFatherState("resting");
    setStats({ ...INITIAL_STATS });
    setLogs([]);
    setDiagnosisResult(null);
    setShowPanel(null);
    const resetTimestamp = new Date().toISOString();
    setLastStateChange(resetTimestamp);
    lastStateChangeRef.current = Date.now();
    clearStorage();
  };

  return (
    <div className="app">
      <div className="app-shell">
        {currentStep === "intro" && <IntroScreen onNext={handleIntroNext} />}
        {currentStep === "explanation" && <ExplanationScreen onNext={handleExplanationNext} />}
        {currentStep === "quiz" && <QuizScreen questions={quizQuestions} onComplete={handleQuizComplete} />}
        {currentStep === "result" && fatherProfile && (
          <ResultScreen fatherProfile={fatherProfile} onNext={handleResultNext} />
        )}
        {currentStep === "main" && fatherProfile && (
          <>
            <FatherScene
              profile={fatherProfile}
              currentState={currentFatherState}
              stats={stats}
              onNavigate={handleNavigate}
            />
            {showPanel === "logs" && <FatherLogPanel logs={logs} onBack={handlePanelClose} />}
            {showPanel === "items" && (
              <ItemPanel profile={fatherProfile} stats={stats} onStats={setStats} onBack={handlePanelClose} />
            )}
            {showPanel === "summary" && (
              <SummaryScreen
                logs={logs}
                typeId={fatherProfile?.id}
                onBack={handlePanelClose}
                onReset={handleReset}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
