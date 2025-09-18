
import React from 'react';
import { StudentGroup } from '../types';

interface ResultDisplayProps {
  selectedStudents: string[];
  groups: StudentGroup[];
  isInitialState: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ selectedStudents, groups, isInitialState }) => {
  if (isInitialState) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-400">
          Trình Chọn Ngẫu Nhiên
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-slate-600">
          Sẵn sàng để tìm ra người may mắn hoặc chia nhóm công bằng!
        </p>
        <p className="mt-8 text-lg text-slate-500">
          Nhấn vào nút cài đặt <span className="font-mono bg-slate-200 rounded-md p-1">⚙️</span> ở góc dưới để bắt đầu.
        </p>
      </div>
    );
  }

  const hasGroups = groups.length > 0;
  const hasSelectedStudents = selectedStudents.length > 0;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 md:p-8 overflow-y-auto">
      {hasSelectedStudents && (
        <div className="animate-fade-in-up text-center">
            <h2 className="text-2xl md:text-4xl font-semibold text-indigo-600 mb-6">Học sinh được chọn:</h2>
            <div className="flex flex-wrap justify-center gap-4">
            {selectedStudents.map((student, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-xl shadow-lg p-6">
                     <p className="text-4xl md:text-7xl font-bold text-indigo-600">{student}</p>
                </div>
            ))}
            </div>
        </div>
      )}

      {hasGroups && (
        <div className="w-full animate-fade-in-up mt-8">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-8 text-center">Kết quả chia nhóm:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {groups.map((group) => (
                    <div key={group.id} className="bg-white border border-slate-200 rounded-xl shadow-lg p-5 flex flex-col min-h-[150px]">
                        <h3 className="text-2xl font-bold text-indigo-500 border-b-2 border-slate-200 pb-2 mb-3">
                            Nhóm {group.id}
                        </h3>
                        <ul className="space-y-2">
                            {group.students.map((student, studentIndex) => (
                                <li key={studentIndex} className="text-xl text-slate-700">
                                    {student}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;