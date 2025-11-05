
import React from 'react';
import { RandomizeMode } from '../types';
import { UserIcon } from './icons/UserIcon';
import { UsersIcon } from './icons/UsersIcon';

interface ResultsDisplayProps {
  result: string[] | string[][] | null;
  mode: RandomizeMode;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, mode }) => {
  if (!result) {
    return (
      <div className="text-center text-slate-500">
        <h1 className="text-4xl font-bold text-slate-700">Trình Lựa Chọn Ngẫu Nhiên</h1>
        <p className="mt-4 text-lg">Chào mừng bạn! Hãy nhấn nút cài đặt ở góc trên bên phải để bắt đầu.</p>
      </div>
    );
  }

  if (mode === RandomizeMode.SELECT && Array.isArray(result) && typeof result[0] === 'string') {
    const selected = result as string[];
    return (
      <div className="w-full max-w-4xl text-center animate__animated animate__zoomIn animate__faster">
        <h2 className="text-3xl font-bold mb-8">Học sinh được chọn</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {selected.map((name, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
              <div className="bg-indigo-100 text-indigo-600 rounded-full p-4 mb-4">
                <UserIcon />
              </div>
              <p className="text-2xl font-semibold text-slate-800">{name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (mode === RandomizeMode.GROUP && Array.isArray(result) && (result.length === 0 || Array.isArray(result[0]))) {
    const groups = result as string[][];
    return (
      <div className="w-full max-w-6xl text-center animate__animated animate__fadeInUp animate__faster">
        <h2 className="text-3xl font-bold mb-8">Kết quả chia nhóm</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {groups.map((group, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg flex flex-col">
              <div className="flex items-center mb-4">
                 <div className="bg-emerald-100 text-emerald-600 rounded-full p-2 mr-3">
                    <UsersIcon />
                 </div>
                <h3 className="text-xl font-bold text-slate-800">Nhóm {index + 1}</h3>
              </div>
              <ul className="space-y-3 text-left">
                {group.map((name, nameIndex) => (
                  <li key={nameIndex} className="text-slate-600 text-lg border-b border-slate-100 pb-2">{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
