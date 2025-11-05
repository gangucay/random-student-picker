
import React, { useState, useEffect, useCallback } from 'react';
import { Settings, RandomizeMode } from './types';
import { SettingsPanel } from './components/SettingsPanel';
import { ResultsDisplay } from './components/ResultsDisplay';
import { SettingsIcon } from './components/icons/SettingsIcon';

const App: React.FC = () => {
  const [students, setStudents] = useState<string[]>([]);
  const [settings, setSettings] = useState<Settings>({
    mode: RandomizeMode.SELECT,
    selectCount: 1,
    removeAfterSelect: true,
    groupCount: 2,
  });
  const [result, setResult] = useState<string[] | string[][] | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedStudents = localStorage.getItem('students');
      const storedSettings = localStorage.getItem('settings');
      if (storedStudents) {
        setStudents(JSON.parse(storedStudents));
      }
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
      setIsSettingsOpen(!storedStudents || JSON.parse(storedStudents).length === 0);
    } catch (e) {
      console.error("Failed to parse from localStorage", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);
  
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleRandomize = useCallback(() => {
    setError(null);
    const availableStudents = [...students];
    if (availableStudents.length === 0) {
      setError("Danh sách học sinh trống. Vui lòng thêm học sinh.");
      setIsSettingsOpen(true);
      return;
    }

    if (settings.mode === RandomizeMode.SELECT) {
      if (settings.selectCount > availableStudents.length) {
        setError("Số lượng chọn không thể lớn hơn số học sinh hiện có.");
        setIsSettingsOpen(true);
        return;
      }
      const shuffled = shuffleArray(availableStudents);
      const selected = shuffled.slice(0, settings.selectCount);
      setResult(selected);
      if (settings.removeAfterSelect) {
        setStudents(availableStudents.filter(s => !selected.includes(s)));
      }
    } else { // GROUP mode
      if (settings.groupCount > availableStudents.length) {
        setError("Số nhóm không thể nhiều hơn số học sinh.");
        setIsSettingsOpen(true);
        return;
      }
      const shuffled = shuffleArray(availableStudents);
      const groups: string[][] = Array.from({ length: settings.groupCount }, () => []);
      shuffled.forEach((student, index) => {
        groups[index % settings.groupCount].push(student);
      });
      setResult(groups);
    }
    setAnimationKey(prev => prev + 1);
    setIsSettingsOpen(false);
  }, [students, settings]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const names = text.split('\n').map(name => name.trim()).filter(name => name.length > 0);
        setStudents(names);
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col items-center justify-center p-4 relative">
      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-4 right-4 z-20 bg-white p-3 rounded-full shadow-lg hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Mở cài đặt"
      >
        <SettingsIcon />
      </button>

      <main className="w-full h-full flex-grow flex items-center justify-center">
        <ResultsDisplay key={animationKey} result={result} mode={settings.mode} />
      </main>

      {error && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md animate__animated animate__shakeX" role="alert">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
        students={students}
        onStudentsChange={setStudents}
        onFileChange={handleFileChange}
        onRun={handleRandomize}
      />
    </div>
  );
};

export default App;
