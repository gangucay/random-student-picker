
import React from 'react';
import { Settings, RandomizeMode } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsChange: React.Dispatch<React.SetStateAction<Settings>>;
  students: string[];
  onStudentsChange: React.Dispatch<React.SetStateAction<string[]>>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRun: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  students,
  onStudentsChange,
  onFileChange,
  onRun
}) => {
  if (!isOpen) return null;

  const handleStudentTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onStudentsChange(e.target.value.split('\n'));
  };

  const studentListText = students.join('\n');
  const studentCount = students.filter(s => s.trim() !== '').length;

  const isRunDisabled = studentCount === 0 ||
    (settings.mode === RandomizeMode.SELECT && settings.selectCount > studentCount) ||
    (settings.mode === RandomizeMode.SELECT && settings.selectCount < 1) ||
    (settings.mode === RandomizeMode.GROUP && settings.groupCount > studentCount) ||
    (settings.mode === RandomizeMode.GROUP && settings.groupCount < 2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4 animate__animated animate__fadeIn animate__faster">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-slate-800">Cài đặt</h2>
          <p className="text-slate-500 mt-1">Thiết lập danh sách và các tuỳ chọn ngẫu nhiên.</p>
        </div>

        <div className="p-6 flex-grow overflow-y-auto space-y-6">
          {/* Student List */}
          <div>
            <label htmlFor="student-list" className="block text-sm font-semibold text-slate-700 mb-2">
              Danh sách học sinh ({studentCount})
            </label>
            <textarea
              id="student-list"
              value={studentListText}
              onChange={handleStudentTextChange}
              placeholder="Nhập mỗi tên trên một dòng..."
              className="w-full h-40 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            <label htmlFor="file-upload" className="mt-3 inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition cursor-pointer font-semibold text-sm">
              <UploadIcon />
              <span className="ml-2">Tải lên từ tệp (.txt)</span>
              <input id="file-upload" type="file" accept=".txt" className="hidden" onChange={onFileChange} />
            </label>
          </div>

          {/* Mode Selection */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Chế độ</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button onClick={() => onSettingsChange(s => ({ ...s, mode: RandomizeMode.SELECT }))} className={`p-4 rounded-lg border-2 text-left transition ${settings.mode === RandomizeMode.SELECT ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-slate-400'}`}>
                <span className="font-bold text-slate-800">Chọn ngẫu nhiên</span>
                <p className="text-sm text-slate-500">Chọn ra một hoặc nhiều học sinh.</p>
              </button>
              <button onClick={() => onSettingsChange(s => ({ ...s, mode: RandomizeMode.GROUP }))} className={`p-4 rounded-lg border-2 text-left transition ${settings.mode === RandomizeMode.GROUP ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-slate-400'}`}>
                <span className="font-bold text-slate-800">Chia nhóm</span>
                <p className="text-sm text-slate-500">Chia danh sách thành các nhóm.</p>
              </button>
            </div>
          </div>

          {/* Mode-specific Options */}
          {settings.mode === RandomizeMode.SELECT ? (
            <div className="p-4 bg-slate-50 rounded-lg space-y-4 animate__animated animate__fadeIn animate__faster">
              <div>
                <label htmlFor="select-count" className="block text-sm font-semibold text-slate-700">Số lượng cần chọn</label>
                <input
                  type="number"
                  id="select-count"
                  min="1"
                  max={studentCount}
                  value={settings.selectCount}
                  onChange={e => onSettingsChange(s => ({ ...s, selectCount: parseInt(e.target.value, 10) || 1 }))}
                  className="mt-1 w-full p-2 border border-slate-300 rounded-md"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remove-after-select"
                  checked={settings.removeAfterSelect}
                  onChange={e => onSettingsChange(s => ({ ...s, removeAfterSelect: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="remove-after-select" className="ml-2 block text-sm text-slate-700">Loại bỏ học sinh đã chọn khỏi danh sách</label>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-lg animate__animated animate__fadeIn animate__faster">
              <label htmlFor="group-count" className="block text-sm font-semibold text-slate-700">Số lượng nhóm</label>
              <input
                type="number"
                id="group-count"
                min="2"
                max={studentCount}
                value={settings.groupCount}
                onChange={e => onSettingsChange(s => ({ ...s, groupCount: parseInt(e.target.value, 10) || 2 }))}
                className="mt-1 w-full p-2 border border-slate-300 rounded-md"
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-slate-50 flex justify-end items-center space-x-3 rounded-b-2xl">
          <button onClick={onClose} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition">Huỷ</button>
          <button onClick={onRun} disabled={isRunDisabled} className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-300 disabled:cursor-not-allowed">Thực hiện</button>
        </div>
      </div>
    </div>
  );
};
