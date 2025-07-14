interface ChartData {
  initial: number;
  rate: number;
}

interface AreaMirrorChartProps {
  type: "cashflow" | "assets";
  years: number;
  incomeData?: ChartData;
  expenseData?: ChartData;
  assetsData?: ChartData;
  debtsData?: ChartData;
}

export function AreaMirrorChart({
  type,
  years,
  incomeData,
  expenseData,
  assetsData,
  debtsData,
}: AreaMirrorChartProps) {
  const currentYear = 2024;

  // Generate points for mirror chart
  const generateMirrorPoints = (data: ChartData, isUpper: boolean) => {
    const points = [];
    const baseY = 120; // Zero line (center)

    for (let i = 0; i <= years; i++) {
      const x = 60 + (i / years) * 400;
      const value = data.initial * Math.pow(1 + data.rate / 100, i);
      const scaledValue = ((value - data.initial) / (data.initial * 2)) * 60;

      let y;
      if (isUpper) {
        // Upper area (negative direction from center)
        y = baseY - Math.abs(scaledValue);
      } else {
        // Lower area (positive direction from center)
        y = baseY + Math.abs(scaledValue);
      }

      points.push(`${x},${Math.max(30, Math.min(210, y))}`);
    }

    // Add area closing points
    const endX = 60 + 400;
    points.push(`${endX},${baseY}`);
    points.push(`60,${baseY}`);

    return points.join(" ");
  };

  const renderCashflowChart = () => {
    if (!incomeData || !expenseData) return null;

    const incomePoints = generateMirrorPoints(incomeData, true);
    const expensePoints = generateMirrorPoints(expenseData, false);

    return (
      <>
        {/* Income area (upper) */}
        <polygon
          fill="rgba(5, 150, 105, 0.2)"
          stroke="#059669"
          strokeWidth="2"
          points={incomePoints}
        />

        {/* Expense area (lower) */}
        <polygon
          fill="rgba(220, 38, 38, 0.2)"
          stroke="#dc2626"
          strokeWidth="2"
          points={expensePoints}
        />

        {/* Legend */}
        <text x="380" y="25" fontSize="12" fill="#059669">
          ■ 収入
        </text>
        <text x="380" y="45" fontSize="12" fill="#dc2626">
          ■ 支出
        </text>
      </>
    );
  };

  const renderAssetsChart = () => {
    if (!assetsData || !debtsData) return null;

    const assetsPoints = generateMirrorPoints(assetsData, true);
    const debtsPoints = generateMirrorPoints(debtsData, false);

    return (
      <>
        {/* Assets area (upper) */}
        <polygon
          fill="rgba(5, 150, 105, 0.3)"
          stroke="#059669"
          strokeWidth="2"
          points={assetsPoints}
        />

        {/* Debts area (lower) */}
        <polygon
          fill="rgba(245, 158, 11, 0.3)"
          stroke="#F59E0B"
          strokeWidth="2"
          points={debtsPoints}
        />

        {/* Legend */}
        <text x="380" y="25" fontSize="12" fill="#059669">
          ■ 資産
        </text>
        <text x="380" y="45" fontSize="12" fill="#F59E0B">
          ■ 負債
        </text>
      </>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/20 w-full h-full rounded-xl p-2">
      <svg viewBox="0 0 500 240" className="w-full h-full">
        {/* Background grid */}
        <defs>
          <pattern
            id={`grid-${type}`}
            width="50"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 24"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${type})`} />

        {/* Amount guide lines */}
        <line
          x1="60"
          y1="60"
          x2="460"
          y2="60"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          strokeDasharray="3,3"
        />
        <line
          x1="60"
          y1="180"
          x2="460"
          y2="180"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          strokeDasharray="3,3"
        />

        {/* Zero line (center baseline) */}
        <line
          x1="60"
          y1="120"
          x2="460"
          y2="120"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Chart areas */}
        {type === "cashflow" ? renderCashflowChart() : renderAssetsChart()}

        {/* Year axis labels (5-6 points) */}
        {Array.from({ length: 6 }, (_, i) => {
          const yearStep = years / 5;
          const year = currentYear + Math.round(i * yearStep);
          const x = 60 + (i / 5) * 400;
          return (
            <text
              key={i}
              x={x}
              y="235"
              fontSize="14"
              fill="#6B7280"
              textAnchor="middle"
            >
              {year}
            </text>
          );
        })}

        {/* Amount axis labels */}
        <text x="45" y="65" fontSize="12" fill="#6B7280" textAnchor="end">
          +2000万
        </text>
        <text x="45" y="125" fontSize="12" fill="#6B7280" textAnchor="end">
          0円
        </text>
        <text x="45" y="185" fontSize="12" fill="#6B7280" textAnchor="end">
          -2000万
        </text>
      </svg>
    </div>
  );
}
