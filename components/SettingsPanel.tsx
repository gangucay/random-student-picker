import React, { useState, useCallback } from 'react';
import { RandomMode, StudentGroup } from '../types';
import { CloseIcon, UsersIcon, LayersIcon, UploadIcon } from './icons';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onRandomize: (selected: string[], groups: StudentGroup[]) => void;
  studentList: string;
  setStudentList: (list: string) => void;
  masterStudentList: string;
  excludeSelected: boolean;
  setExcludeSelected: (exclude: boolean) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
    isOpen, 
    onClose, 
    onRandomize, 
import React, { useState, useCallback } from 'react';
import { RandomMode, StudentGroup } from '../types.ts';
import { CloseIcon, UsersIcon, LayersIcon, UploadIcon } from './icons.tsx';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onRandomize: (selected: string[], groups: StudentGroup[]) => void;
  studentList: string;
  setStudentList: (list: string) => void;
  masterStudentList: string;
  excludeSelected: boolean;
  setExcludeSelected: (exclude: boolean) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
    isOpen, 
    onClose, 
    onRandomize, 
    studentList, 
    setStudentList,
    masterStudentList,
    excludeSelected,
    setExcludeSelected
}) => {
  const [mode, setMode] = useState<RandomMode>(RandomMode.MULTIPLE);
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          setStudentList(text);
        }
      };
      reader.onerror = () => {
        setError("Không thể đọc tệp đã chọn.");
      };
      reader.readAsText(file);
      event.target.value = ''; // Allow re-uploading the same file
    }
  };

  const handleRandomize = useCallback(() => {
    setError(null);
    
    const listToUse = mode === RandomMode.GROUPS ? masterStudentList : studentList;
    const students = listToUse.split('\n').map(s => s.trim()).filter(s => s.length > 0);

    if (students.length === 0) {
      setError("Vui lòng nhập danh sách học sinh.");
      return;
    }

    // Fisher-Yates shuffle algorithm
    const shuffle = (array: string[]): string[] => {
      let currentIndex = array.length, randomIndex;
      const newArray = [...array];
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
      }
      return newArray;
    };

    const shuffledStudents = shuffle(students);
    let selected: string[] = [];
    let groups: StudentGroup[] = [];

    switch (mode) {
      case RandomMode.MULTIPLE:
        if (quantity > students.length || quantity < 1) {
          setError(`Số lượng chọn phải từ 1 đến ${students.length}.`);
          return;
        }
        selected = shuffledStudents.slice(0, quantity);
        break;
      case RandomMode.GROUPS:
        if (quantity > students.length || quantity < 1) {
          setError(`Số nhóm phải từ 1 đến ${students.length}.`);
          return;
        }
        const groupSize = Math.floor(students.length / quantity);
        const remainder = students.length % quantity;
        let currentStudentIndex = 0;

        for (let i = 0; i < quantity; i++) {
          const size = groupSize + (i < remainder ? 1 : 0);
          const groupStudents = shuffledStudents.slice(currentStudentIndex, currentStudentIndex + size);
          groups.push({ id: i + 1, students: groupStudents });
          currentStudentIndex += size;
        }
        break;
    }

    onRandomize(selected, groups);
    onClose();
  }, [studentList, masterStudentList, mode, quantity, onRandomize, onClose]);
  
  const ModeButton = ({ icon, label, currentMode, targetMode }: {icon: React.ReactNode, label: string, currentMode: RandomMode, targetMode: RandomMode}) => (
     <button
        onClick={() => setMode(targetMode)}
        className={`flex-1 p-3 rounded-lg text-center transition-all duration-200 flex items-center justify-center gap-2 border-2 ${
        currentMode === targetMode
            ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg'
            : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Cài đặt</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <CloseIcon className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto mt-6 pr-2">
           <div className="flex justify-between items-center mb-2">
                <label htmlFor="student-list" className="block text-lg font-semibold text-slate-700">
                    Danh sách học sinh
                </label>
                <label htmlFor="file-upload" className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 cursor-pointer transition-colors">
                    <UploadIcon className="w-4 h-4" />
                    <span>Tải lên tệp</span>
                </label>
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".txt,text/plain"
                    onChange={handleFileUpload}
                />
            </div>
          <p className="text-sm text-slate-500 mb-3">Nhập mỗi tên trên một dòng hoặc tải lên từ tệp .txt.</p>
          <textarea
            id="student-list"
            value={studentList}
            onChange={(e) => setStudentList(e.target.value)}
            placeholder="Nguyễn Văn A&#10;Trần Thị B&#10;Lê Văn C"
            className="w-full h-48 p-3 bg-slate-100 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-800 resize-none"
          />

          <h3 className="text-lg font-semibold text-slate-700 mt-6 mb-3">Chế độ</h3>
          <div className="flex gap-2">
            <ModeButton icon={<UsersIcon className="w-5 h-5"/>} label="Chọn ngẫu nhiên" currentMode={mode} targetMode={RandomMode.MULTIPLE} />
            <ModeButton icon={<LayersIcon className="w-5 h-5"/>} label="Chia nhóm" currentMode={mode} targetMode={RandomMode.GROUPS} />
          </div>

          {mode === RandomMode.MULTIPLE && (
            <div className="mt-4 flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 animate-fade-in">
              <input
                type="checkbox"
                id="exclude-selected"
                checked={excludeSelected}
                onChange={(e) => setExcludeSelected(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                aria-describedby="exclude-description"
              />
              <div className="flex flex-col">
                <label htmlFor="exclude-selected" className="text-md font-medium text-slate-700 select-none">
                  Loại bỏ học sinh đã chọn
                </label>
                <p id="exclude-description" className="text-xs text-slate-500">Học sinh được chọn sẽ bị xóa khỏi danh sách cho lần sau.</p>
              </div>
            </div>
          )}

          {(mode === RandomMode.MULTIPLE || mode === RandomMode.GROUPS) && (
            <div className="mt-4 animate-fade-in">
              <label htmlFor="quantity" className="block text-md font-semibold text-slate-700 mb-2">
                {mode === RandomMode.MULTIPLE ? 'Số lượng học sinh cần chọn' : 'Số lượng nhóm cần chia'}
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                min="1"
                className="w-full p-3 bg-slate-100 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          )}
           {error && <p className="mt-4 text-red-700 bg-red-100 border border-red-200 p-3 rounded-lg">{error}</p>}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-200">
          <button
            onClick={handleRandomize}
            className="w-full py-4 bg-indigo-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Thực Hiện
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
    studentList, 
    setStudentList,
    masterStudentList,
    excludeSelected,
    setExcludeSelected
}) => {
  const [mode, setMode] = useState<RandomMode>(RandomMode.MULTIPLE);
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          setStudentList(text);
        }
      };
      reader.onerror = () => {
        setError("Không thể đọc tệp đã chọn.");
      };
      reader.readAsText(file);
      event.target.value = ''; // Allow re-uploading the same file
    }
  };

  const handleRandomize = useCallback(() => {
    setError(null);
    
    const listToUse = mode === RandomMode.GROUPS ? masterStudentList : studentList;
    const students = listToUse.split('\n').map(s => s.trim()).filter(s => s.length > 0);

    if (students.length === 0) {
      setError("Vui lòng nhập danh sách học sinh.");
      return;
    }

    // Fisher-Yates shuffle algorithm
    const shuffle = (array: string[]): string[] => {
      let currentIndex = array.length, randomIndex;
      const newArray = [...array];
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
      }
      return newArray;
    };

    const shuffledStudents = shuffle(students);
    let selected: string[] = [];
    let groups: StudentGroup[] = [];

    switch (mode) {
      case RandomMode.MULTIPLE:
        if (quantity > students.length || quantity < 1) {
          setError(`Số lượng chọn phải từ 1 đến ${students.length}.`);
          return;
        }
        selected = shuffledStudents.slice(0, quantity);
        break;
      case RandomMode.GROUPS:
        if (quantity > students.length || quantity < 1) {
          setError(`Số nhóm phải từ 1 đến ${students.length}.`);
          return;
        }
        const groupSize = Math.floor(students.length / quantity);
        const remainder = students.length % quantity;
        let currentStudentIndex = 0;

        for (let i = 0; i < quantity; i++) {
          const size = groupSize + (i < remainder ? 1 : 0);
          const groupStudents = shuffledStudents.slice(currentStudentIndex, currentStudentIndex + size);
          groups.push({ id: i + 1, students: groupStudents });
          currentStudentIndex += size;
        }
        break;
    }

    onRandomize(selected, groups);
    onClose();
  }, [studentList, masterStudentList, mode, quantity, onRandomize, onClose]);
  
  const ModeButton = ({ icon, label, currentMode, targetMode }: {icon: React.ReactNode, label: string, currentMode: RandomMode, targetMode: RandomMode}) => (
     <button
        onClick={() => setMode(targetMode)}
        className={`flex-1 p-3 rounded-lg text-center transition-all duration-200 flex items-center justify-center gap-2 border-2 ${
        currentMode === targetMode
            ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg'
            : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Cài đặt</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <CloseIcon className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto mt-6 pr-2">
           <div className="flex justify-between items-center mb-2">
                <label htmlFor="student-list" className="block text-lg font-semibold text-slate-700">
                    Danh sách học sinh
                </label>
                <label htmlFor="file-upload" className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 cursor-pointer transition-colors">
                    <UploadIcon className="w-4 h-4" />
                    <span>Tải lên tệp</span>
                </label>
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".txt,text/plain"
                    onChange={handleFileUpload}
                />
            </div>
          <p className="text-sm text-slate-500 mb-3">Nhập mỗi tên trên một dòng hoặc tải lên từ tệp .txt.</p>
          <textarea
            id="student-list"
            value={studentList}
            onChange={(e) => setStudentList(e.target.value)}
            placeholder="Nguyễn Văn A&#10;Trần Thị B&#10;Lê Văn C"
            className="w-full h-48 p-3 bg-slate-100 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-800 resize-none"
          />

          <h3 className="text-lg font-semibold text-slate-700 mt-6 mb-3">Chế độ</h3>
          <div className="flex gap-2">
            <ModeButton icon={<UsersIcon className="w-5 h-5"/>} label="Chọn ngẫu nhiên" currentMode={mode} targetMode={RandomMode.MULTIPLE} />
            <ModeButton icon={<LayersIcon className="w-5 h-5"/>} label="Chia nhóm" currentMode={mode} targetMode={RandomMode.GROUPS} />
          </div>

          {mode === RandomMode.MULTIPLE && (
            <div className="mt-4 flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 animate-fade-in">
              <input
                type="checkbox"
                id="exclude-selected"
                checked={excludeSelected}
                onChange={(e) => setExcludeSelected(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                aria-describedby="exclude-description"
              />
              <div className="flex flex-col">
                <label htmlFor="exclude-selected" className="text-md font-medium text-slate-700 select-none">
                  Loại bỏ học sinh đã chọn
                </label>
                <p id="exclude-description" className="text-xs text-slate-500">Học sinh được chọn sẽ bị xóa khỏi danh sách cho lần sau.</p>
              </div>
            </div>
          )}

          {(mode === RandomMode.MULTIPLE || mode === RandomMode.GROUPS) && (
            <div className="mt-4 animate-fade-in">
              <label htmlFor="quantity" className="block text-md font-semibold text-slate-700 mb-2">
                {mode === RandomMode.MULTIPLE ? 'Số lượng học sinh cần chọn' : 'Số lượng nhóm cần chia'}
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                min="1"
                className="w-full p-3 bg-slate-100 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          )}
           {error && <p className="mt-4 text-red-700 bg-red-100 border border-red-200 p-3 rounded-lg">{error}</p>}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-200">
          <button
            onClick={handleRandomize}
            className="w-full py-4 bg-indigo-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Thực Hiện
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;