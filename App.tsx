
import React, { useState, useCallback } from 'react';
import ResultDisplay from './components/ResultDisplay.tsx';
import SettingsPanel from './components/SettingsPanel.tsx';
import { StudentGroup } from './types.ts';
import { SettingsIcon } from './components/icons.tsx';

const App: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [studentList, setStudentList] = useState('');
  const [masterStudentList, setMasterStudentList] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [resultKey, setResultKey] = useState(0);
  const [excludeSelected, setExcludeSelected] = useState(false);

  const handleStudentListChange = useCallback((newList: string) => {
    setStudentList(newList);
    setMasterStudentList(newList);
  }, []);

  const handleRandomize = useCallback((newSelected: string[], newGroups: StudentGroup[]) => {
    setSelectedStudents(newSelected);
    setGroups(newGroups);
    setResultKey(prevKey => prevKey + 1);

    if (excludeSelected && newSelected.length > 0) {
      const currentStudents = studentList.split('\n').map(s => s.trim()).filter(s => s.length > 0);
      const remainingStudents = currentStudents.filter(s => !newSelected.includes(s));
      setStudentList(remainingStudents.join('\n'));
    }
  }, [excludeSelected, studentList]);
  
  const isInitialState = selectedStudents.length === 0 && groups.length === 0;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-100">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
      `}</style>
      
      <main className="w-full h-full">
        <ResultDisplay
          key={resultKey}
          selectedStudents={selectedStudents}
          groups={groups}
          isInitialState={isInitialState}
        />
      </main>

      <button
        onClick={() => setIsPanelOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md-right-8 w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-500 transition-all duration-300 transform hover:rotate-12 hover:scale-110 z-40"
        aria-label="Mở cài đặt"
      >
        <SettingsIcon className="w-8 h-8" />
      </button>

      {isPanelOpen && <div className="fixed inset-0 bg-black/50 z-40 animate-fade-in" onClick={() => setIsPanelOpen(false)} />}
      
      <SettingsPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onRandomize={handleRandomize}
        studentList={studentList}
        setStudentList={handleStudentListChange}
        masterStudentList={masterStudentList}
        excludeSelected={excludeSelected}
        setExcludeSelected={setExcludeSelected}
      />
    </div>
  );
};

export default App;