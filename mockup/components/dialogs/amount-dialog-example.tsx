'use client';

import React, { useState } from 'react';
import AmountDialog from './amount-dialog';
import { FlowFormData, StockFormData } from '../../lib/types';

export default function AmountDialogExample() {
  const [isFlowDialogOpen, setIsFlowDialogOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [savedData, setSavedData] = useState<{ flow?: FlowFormData; stock?: StockFormData }>({});

  const handleFlowSave = (data: FlowFormData | StockFormData) => {
    setSavedData(prev => ({ ...prev, flow: data as FlowFormData }));
  };

  const handleStockSave = (data: FlowFormData | StockFormData) => {
    setSavedData(prev => ({ ...prev, stock: data as StockFormData }));
  };

  return (
    <div className="max-w-sm mx-auto glass min-h-screen p-4">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">AmountDialog テスト</h1>
        
        {/* Flow Dialog Button */}
        <button
          onClick={() => setIsFlowDialogOpen(true)}
          className="w-full bg-brand-500 text-white py-3 rounded-xl font-medium hover:bg-brand-600 transition-all duration-200"
        >
          フロー項目（給与）を設定
        </button>

        {/* Stock Dialog Button */}
        <button
          onClick={() => setIsStockDialogOpen(true)}
          className="w-full bg-brand-500 text-white py-3 rounded-xl font-medium hover:bg-brand-600 transition-all duration-200"
        >
          ストック項目（貯金）を設定
        </button>

        {/* Display saved data */}
        {savedData.flow && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2">フロー項目データ:</h3>
            <div className="text-sm text-gray-600">
              <p>開始年度: {savedData.flow.startYear}</p>
              <p>終了年度: {savedData.flow.endYear || '永続'}</p>
              <p>金額: {savedData.flow.amount.toLocaleString()}円</p>
              <p>頻度: {savedData.flow.frequency === 'monthly' ? '月額' : '年額'}</p>
              <p>年率: {savedData.flow.flowRate || 0}%</p>
            </div>
          </div>
        )}

        {savedData.stock && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2">ストック項目データ:</h3>
            <div className="text-sm text-gray-600">
              <p>基準年度: {savedData.stock.baseYear}</p>
              <p>基準金額: {savedData.stock.baseAmount.toLocaleString()}円</p>
              <p>年率: {savedData.stock.rate || 0}%</p>
              <p>年額変動: {savedData.stock.yearlyChange?.toLocaleString() || 0}円</p>
            </div>
          </div>
        )}
      </div>

      {/* Flow Dialog */}
      <AmountDialog
        isOpen={isFlowDialogOpen}
        onClose={() => setIsFlowDialogOpen(false)}
        itemName="給与"
        itemType="flow"
        onSave={handleFlowSave}
      />

      {/* Stock Dialog */}
      <AmountDialog
        isOpen={isStockDialogOpen}
        onClose={() => setIsStockDialogOpen(false)}
        itemName="貯金"
        itemType="stock"
        onSave={handleStockSave}
      />
    </div>
  );
}