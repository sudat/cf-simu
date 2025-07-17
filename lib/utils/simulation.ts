import { PlanState, FlowItemDetail, StockItemDetail, SimulationDataPoint, PlanDefinition } from '../types';

/**
 * 収支計算のためのシミュレーション関数
 */
export class SimulationCalculator {
  /**
   * 指定された年数分のシミュレーションデータを計算する
   */
  static calculateSimulation(
    planState: PlanState,
    activePlan: PlanDefinition,
    years: number,
    startYear: number = 2024
  ): SimulationDataPoint[] {
    const results: SimulationDataPoint[] = [];

    for (let i = 0; i <= years; i++) {
      const year = startYear + i;
      
      // 収入計算（項目別アクティブプランを考慮）
      const income = this.calculateYearlyIncome(planState, year);
      
      // 支出計算（項目別アクティブプランを考慮）
      const expense = this.calculateYearlyExpense(planState, year);
      
      // 資産計算（項目別アクティブプランを考慮）
      const assets = this.calculateYearlyAssets(planState, year);
      
      // 負債計算（項目別アクティブプランを考慮）
      const debts = this.calculateYearlyDebts(planState, year);
      
      results.push({
        year,
        income,
        expense,
        netIncome: income - expense,
        assets,
        debts,
        netAssets: assets - debts,
      });
    }

    return results;
  }

  /**
   * 指定年度の収入を計算（項目別アクティブプランを考慮）
   */
  private static calculateYearlyIncome(
    planState: PlanState,
    year: number
  ): number {
    let totalIncome = 0;

    for (const [itemName, item] of Object.entries(planState.incomes)) {
      // 項目別アクティブプランを取得
      const activePlanName = planState.plans[itemName]?.activePlan || 'デフォルトプラン';
      const setting = item.settings[activePlanName] as FlowItemDetail | undefined;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[収入計算] ${itemName}: アクティブプラン="${activePlanName}"`, {
          利用可能プラン: planState.plans[itemName]?.availablePlans,
          全設定データ: item.settings,
          使用中設定データ: setting,
          年: year,
        });
      }
      
      if (!setting) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[収入計算] ${itemName}: プラン"${activePlanName}"の設定が見つかりません`);
        }
        continue;
      }

      const amount = this.calculateFlowAmount(setting, year);
      totalIncome += amount;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[収入計算] ${itemName}: ${year}年の金額=${amount.toLocaleString()}円`);
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[収入計算] ${year}年の総収入: ${totalIncome.toLocaleString()}円`);
    }

    return totalIncome;
  }

  /**
   * 指定年度の支出を計算（項目別アクティブプランを考慮）
   */
  private static calculateYearlyExpense(
    planState: PlanState,
    year: number
  ): number {
    let totalExpense = 0;

    for (const [itemName, item] of Object.entries(planState.expenses)) {
      // 項目別アクティブプランを取得
      const activePlanName = planState.plans[itemName]?.activePlan || 'デフォルトプラン';
      const setting = item.settings[activePlanName] as FlowItemDetail | undefined;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[支出計算] ${itemName}: アクティブプラン="${activePlanName}"`, {
          利用可能プラン: planState.plans[itemName]?.availablePlans,
          設定データ: setting,
          年: year,
        });
      }
      
      if (!setting) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[支出計算] ${itemName}: プラン"${activePlanName}"の設定が見つかりません`);
        }
        continue;
      }

      const amount = this.calculateFlowAmount(setting, year);
      totalExpense += amount;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[支出計算] ${itemName}: ${year}年の金額=${amount.toLocaleString()}円`);
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[支出計算] ${year}年の総支出: ${totalExpense.toLocaleString()}円`);
    }

    return totalExpense;
  }

  /**
   * 指定年度の資産を計算（項目別アクティブプランを考慮）
   */
  private static calculateYearlyAssets(
    planState: PlanState,
    year: number
  ): number {
    let totalAssets = 0;

    for (const [itemName, item] of Object.entries(planState.assets)) {
      // 項目別アクティブプランを取得
      const activePlanName = planState.plans[itemName]?.activePlan || 'デフォルトプラン';
      const setting = item.settings[activePlanName] as StockItemDetail | undefined;
      if (!setting) continue;

      const amount = this.calculateStockAmount(setting, year);
      totalAssets += amount;
    }

    return totalAssets;
  }

  /**
   * 指定年度の負債を計算（項目別アクティブプランを考慮）
   */
  private static calculateYearlyDebts(
    planState: PlanState,
    year: number
  ): number {
    let totalDebts = 0;

    for (const [itemName, item] of Object.entries(planState.debts)) {
      // 項目別アクティブプランを取得
      const activePlanName = planState.plans[itemName]?.activePlan || 'デフォルトプラン';
      const setting = item.settings[activePlanName] as StockItemDetail | undefined;
      if (!setting) continue;

      const amount = this.calculateStockAmount(setting, year);
      totalDebts += amount;
    }

    return totalDebts;
  }

  /**
   * フロー項目（収入・支出）の金額を計算
   */
  private static calculateFlowAmount(setting: FlowItemDetail, year: number): number {
    // 年度範囲外の場合は0
    if (year < setting.startYear) return 0;
    if (setting.endYear && year > setting.endYear) return 0;

    const baseYear = setting.startYear;
    const yearsPassed = year - baseYear;
    
    // 年額に統一
    const yearlyAmount = setting.frequency === 'monthly' ? setting.amount * 12 : setting.amount;
    
    // 複利計算
    let calculatedAmount = yearlyAmount;
    
    if (setting.growthRate && setting.growthRate !== 0) {
      calculatedAmount = yearlyAmount * Math.pow(1 + setting.growthRate / 100, yearsPassed);
    }
    
    // 年額増減の適用
    if (setting.yearlyChange) {
      const yearlyChangeAmount = setting.frequency === 'monthly' ? setting.yearlyChange * 12 : setting.yearlyChange;
      calculatedAmount += yearlyChangeAmount * yearsPassed;
    }

    return Math.round(calculatedAmount);
  }

  /**
   * ストック項目（資産・負債）の金額を計算
   */
  private static calculateStockAmount(setting: StockItemDetail, year: number): number {
    // 基準年度以前の場合は基準額
    if (year <= setting.baseYear) return setting.baseAmount;

    const yearsPassed = year - setting.baseYear;
    let amount = setting.baseAmount;
    
    // 年次計算（複利 + 年額増減）
    for (let i = 0; i < yearsPassed; i++) {
      // 複利計算
      if (setting.rate && setting.rate !== 0) {
        amount = amount * (1 + setting.rate / 100);
      }
      
      // 年額増減（積立/取崩）
      if (setting.yearlyChange) {
        amount += setting.yearlyChange;
      }
    }

    return Math.round(amount);
  }

  /**
   * 月別の収支データを計算（詳細分析用）（項目別アクティブプランを考慮）
   */
  static calculateMonthlyData(
    planState: PlanState,
    activePlan: PlanDefinition,
    year: number
  ): { month: number; income: number; expense: number; net: number }[] {
    const monthlyData = [];
    
    for (let month = 1; month <= 12; month++) {
      let monthlyIncome = 0;
      let monthlyExpense = 0;
      
      // 収入計算（月別）（項目別アクティブプランを考慮）
      for (const [itemName, item] of Object.entries(planState.incomes)) {
        const activePlanName = planState.plans[itemName]?.activePlan || 'デフォルトプラン';
        const setting = item.settings[activePlanName] as FlowItemDetail | undefined;
        if (!setting) continue;
        
        const monthlyAmount = this.calculateMonthlyFlowAmount(setting, year, month);
        monthlyIncome += monthlyAmount;
      }
      
      // 支出計算（月別）（項目別アクティブプランを考慮）
      for (const [itemName, item] of Object.entries(planState.expenses)) {
        const activePlanName = planState.plans[itemName]?.activePlan || 'デフォルトプラン';
        const setting = item.settings[activePlanName] as FlowItemDetail | undefined;
        if (!setting) continue;
        
        const monthlyAmount = this.calculateMonthlyFlowAmount(setting, year, month);
        monthlyExpense += monthlyAmount;
      }
      
      monthlyData.push({
        month,
        income: monthlyIncome,
        expense: monthlyExpense,
        net: monthlyIncome - monthlyExpense,
      });
    }
    
    return monthlyData;
  }

  /**
   * 月別フロー項目の金額計算
   */
  private static calculateMonthlyFlowAmount(
    setting: FlowItemDetail,
    year: number,
    month: number
  ): number {
    // 年度範囲外の場合は0
    if (year < setting.startYear) return 0;
    if (setting.endYear && year > setting.endYear) return 0;

    const baseYear = setting.startYear;
    const yearsPassed = year - baseYear;
    
    // 年額計算
    let yearlyAmount = setting.frequency === 'monthly' ? setting.amount * 12 : setting.amount;
    
    // 複利計算
    if (setting.growthRate && setting.growthRate !== 0) {
      yearlyAmount = yearlyAmount * Math.pow(1 + setting.growthRate / 100, yearsPassed);
    }
    
    // 年額増減の適用
    if (setting.yearlyChange) {
      const yearlyChangeAmount = setting.frequency === 'monthly' ? setting.yearlyChange * 12 : setting.yearlyChange;
      yearlyAmount += yearlyChangeAmount * yearsPassed;
    }

    // 月額に戻す
    if (setting.frequency === 'monthly') {
      return Math.round(yearlyAmount / 12);
    } else {
      // 年額の場合は特定の月（例：3月）にのみ計上
      return month === 3 ? Math.round(yearlyAmount) : 0;
    }
  }
}