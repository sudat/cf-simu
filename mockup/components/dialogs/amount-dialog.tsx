'use client';

import React, { useState, useEffect } from 'react';
import { AmountDialogProps, FlowFormData, StockFormData, CalculationExample } from '../../lib/types';

export default function AmountDialog({
  isOpen,
  onClose,
  itemName,
  itemType,
  initialData,
  onSave
}: AmountDialogProps) {
  const [flowData, setFlowData] = useState<FlowFormData>({
    startYear: new Date().getFullYear(),
    amount: 0,
    frequency: 'monthly'
  });

  const [stockData, setStockData] = useState<StockFormData>({
    baseYear: new Date().getFullYear(),
    baseAmount: 0
  });

  const [calculationExample, setCalculationExample] = useState<CalculationExample[]>([]);

  useEffect(() => {
    if (initialData) {
      if (itemType === 'flow') {
        setFlowData(initialData as FlowFormData);
      } else {
        setStockData(initialData as StockFormData);
      }
    }
  }, [initialData, itemType]);

  useEffect(() => {
    if (itemType === 'flow') {
      updateFlowCalculation();
    } else {
      updateStockCalculation();
    }
  }, [itemType, flowData, stockData]);

  const updateFlowCalculation = () => {
    if (!flowData.amount || !flowData.startYear) {
      setCalculationExample([]);
      return;
    }

    const examples: CalculationExample[] = [];
    const rate = flowData.flowRate ? flowData.flowRate / 100 : 0;
    let currentAmount = flowData.amount;

    for (let i = 0; i < 3; i++) {
      const year = flowData.startYear + i;
      examples.push({
        year,
        amount: Math.round(currentAmount),
        formula: i === 0 ? 'Initial' : `Previous × ${(1 + rate).toFixed(2)}`
      });
      currentAmount = currentAmount * (1 + rate);
    }

    setCalculationExample(examples);
  };

  const updateStockCalculation = () => {
    if (!stockData.baseAmount || !stockData.baseYear) {
      setCalculationExample([]);
      return;
    }

    const examples: CalculationExample[] = [];
    const rate = stockData.rate ? stockData.rate / 100 : 0;
    const yearlyChange = stockData.yearlyChange || 0;
    let currentAmount = stockData.baseAmount;

    for (let i = 0; i < 3; i++) {
      const year = stockData.baseYear + i;
      examples.push({
        year,
        amount: Math.round(currentAmount),
        formula: i === 0 ? 'Base Amount' : `${(currentAmount / (1 + rate) - yearlyChange).toFixed(0)} × ${(1 + rate).toFixed(2)} ${yearlyChange >= 0 ? '+' : ''}${yearlyChange}`
      });
      currentAmount = currentAmount * (1 + rate) + yearlyChange;
    }

    setCalculationExample(examples);
  };

  const handleSave = () => {
    const dataToSave = itemType === 'flow' ? flowData : stockData;
    onSave(dataToSave);
    onClose();
  };

  const handleBackClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-70">
      <div className="glass-modal rounded-2xl w-full max-w-sm shadow-2xl">
        {/* Header with back button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBackClick}
              className="w-8 h-8 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <h2 className="text-xl font-semibold">{itemName} - 金額設定</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-2xl text-gray-600 hover:text-gray-800 p-1"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          {itemType === 'flow' ? (
            /* Flow Form */
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">開始年度 (4/1～)</label>
                <input 
                  type="number" 
                  value={flowData.startYear}
                  onChange={(e) => setFlowData(prev => ({ ...prev, startYear: parseInt(e.target.value) || new Date().getFullYear() }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  終了年度 (～3/31) <span className="text-xs text-gray-500">※空欄で永続</span>
                </label>
                <input 
                  type="number" 
                  value={flowData.endYear || ''}
                  onChange={(e) => setFlowData(prev => ({ ...prev, endYear: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="未入力で永続"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">支払い頻度</label>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="frequency" 
                      value="monthly"
                      checked={flowData.frequency === 'monthly'}
                      onChange={(e) => setFlowData(prev => ({ ...prev, frequency: e.target.value as 'monthly' | 'yearly' }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">月額</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="frequency" 
                      value="yearly"
                      checked={flowData.frequency === 'yearly'}
                      onChange={(e) => setFlowData(prev => ({ ...prev, frequency: e.target.value as 'monthly' | 'yearly' }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">年額</span>
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">¥</span>
                  <input 
                    type="number" 
                    value={flowData.amount}
                    onChange={(e) => setFlowData(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                    className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  年率増減 <span className="text-xs text-gray-500">※空欄で変動なし</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    value={flowData.flowRate || ''}
                    onChange={(e) => setFlowData(prev => ({ ...prev, flowRate: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    className="w-full pr-8 pl-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="例: 3 (年3%増の場合)"
                  />
                  <span className="absolute right-3 top-3 text-gray-500">%</span>
                </div>
              </div>

              {/* Flow Calculation Example */}
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                <div className="mb-1"><strong>計算例:</strong></div>
                {calculationExample.length > 0 ? (
                  calculationExample.map((example, index) => (
                    <div key={index}>
                      {example.year}/4/1: {example.amount.toLocaleString()}円 
                      {index > 0 && flowData.flowRate && ` (${flowData.flowRate}%増)`}
                    </div>
                  ))
                ) : (
                  <div>金額を入力して計算例を表示</div>
                )}
              </div>
            </div>
          ) : (
            /* Stock Form */
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">基準年度</label>
                <input 
                  type="number" 
                  value={stockData.baseYear}
                  onChange={(e) => setStockData(prev => ({ ...prev, baseYear: parseInt(e.target.value) || new Date().getFullYear() }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">基準時点の金額</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">¥</span>
                  <input 
                    type="number" 
                    value={stockData.baseAmount}
                    onChange={(e) => setStockData(prev => ({ ...prev, baseAmount: parseInt(e.target.value) || 0 }))}
                    className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  年率増減 <span className="text-xs text-gray-500">※空欄で変動なし</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    value={stockData.rate || ''}
                    onChange={(e) => setStockData(prev => ({ ...prev, rate: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    className="w-full pr-8 pl-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="例: 10 (10%の場合)"
                  />
                  <span className="absolute right-3 top-3 text-gray-500">%</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  年額増減 <span className="text-xs text-gray-500">※空欄で変動なし</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">¥</span>
                  <input 
                    type="number" 
                    value={stockData.yearlyChange || ''}
                    onChange={(e) => setStockData(prev => ({ ...prev, yearlyChange: e.target.value ? parseInt(e.target.value) : undefined }))}
                    className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="例: 1200000 (年120万積立)、-1200000 (年120万減少)"
                  />
                </div>
              </div>

              {/* Stock Calculation Example */}
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                <div className="mb-1"><strong>計算例:</strong></div>
                {calculationExample.length > 0 ? (
                  calculationExample.map((example, index) => (
                    <div key={index}>
                      {example.year}/4/1: {(example.amount / 10000).toFixed(0)}万円
                      {index > 0 && ` (${example.formula})`}
                    </div>
                  ))
                ) : (
                  <div>基準年度と基準金額を入力して計算例を表示</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-200">
          <button 
            onClick={onClose}
            className="flex-1 bg-white/60 backdrop-blur-md border border-white/30 text-gray-700 py-3 rounded-xl font-medium hover:bg-white/80 transition-all duration-200"
          >
            キャンセル
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 bg-brand-500 text-white py-3 rounded-xl font-medium hover:bg-brand-600 transition-all duration-200"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}