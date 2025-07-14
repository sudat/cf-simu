import React from 'react';
import CurrentPlanCard from './components/dashboard/CurrentPlanCard';
import TransitionHeader from './components/transition/TransitionHeader';
import './styles/globals.css';

const ExampleUsage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* TransitionHeader の使用例 */}
      <TransitionHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CurrentPlanCard の使用例 */}
          <CurrentPlanCard className="lg:col-span-1" />
          
          {/* 他のコンポーネントのプレースホルダー */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">シミュレーション結果</h2>
            <p className="text-gray-600">
              ここにキャッシュフローのチャートやテーブルが表示されます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleUsage;