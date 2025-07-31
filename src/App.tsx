import { useState } from 'react'
import './App.css'

interface CalculationInputs {
  annualPaymentValue: number
  dailyPaymentVolume: number
  floatRequirements: number
  costOfCapital: number
  averageConversionCost: number
  operationalDays: number
  averageConversionCostBps: number
  annualBorrowingDays: number
  internalNettingEfficiency: number
}

interface CalculationResults {
  stablecoinFloatRequired: number
  annualCapitalCost: number
  annualConversionVolume: number
  dailyConversionVolume: number
  annualConversionCosts: number
  dailyBorrowingNeeded: number
  annualBorrowingVolume: number
  annualBorrowingCosts: number
  totalAnnualCosts: number
  sum: number
  product: number
  average: number
  difference: number
  ratio: number
}

function App() {
  const [inputs, setInputs] = useState<CalculationInputs>({
    annualPaymentValue: 1000000000,
    dailyPaymentVolume: 1000000,
    floatRequirements: 20,
    costOfCapital: 10,
    operationalDays: 365,
    averageConversionCostBps: 20,
    annualBorrowingDays: 0,
    internalNettingEfficiency: 0
  })

  const [results, setResults] = useState<CalculationResults | null>(null)

  const handleInputChange = (field: keyof CalculationInputs, value: string) => {
    const numValue = parseFloat(value) || 0
    setInputs(prev => ({
      ...prev,
      [field]: numValue
    }))
  }

  const calculateResults = () => {
    const { annualPaymentValue, dailyPaymentVolume, floatRequirements, costOfCapital, operationalDays, averageConversionCostBps, annualBorrowingDays, internalNettingEfficiency } = inputs

    // Convert percentages to decimals
    const floatRequirementsDecimal = floatRequirements / 100
    const costOfCapitalDecimal = costOfCapital / 100

    const calculatedResults: CalculationResults = {
      stablecoinFloatRequired: dailyPaymentVolume * floatRequirementsDecimal,
      annualCapitalCost: dailyPaymentVolume * floatRequirementsDecimal * costOfCapitalDecimal,
      annualConversionVolume: dailyPaymentVolume * operationalDays,
      dailyConversionVolume: dailyPaymentVolume - internalNettingEfficiency,
      annualConversionCosts: (dailyPaymentVolume - internalNettingEfficiency) * averageConversionCostBps * operationalDays / 10000, // Convert bps to decimal
      dailyBorrowingNeeded: dailyPaymentVolume * floatRequirementsDecimal,
      annualBorrowingVolume: dailyPaymentVolume * floatRequirementsDecimal * operationalDays,
      annualBorrowingCosts: (floatRequirementsDecimal * operationalDays) * averageConversionCostBps / 10000,
      totalAnnualCosts: (floatRequirementsDecimal * costOfCapitalDecimal) + ((dailyPaymentVolume - internalNettingEfficiency) * averageConversionCostBps * operationalDays / 10000) + ((floatRequirementsDecimal * operationalDays) * averageConversionCostBps / 10000),
    }

    setResults(calculatedResults)
  }

  const resetCalculator = () => {
    setResults(null)
    setInputs({
      annualPaymentValue: 1000000000,
      dailyPaymentVolume: 1000000,
      floatRequirements: 20,
      costOfCapital: 10,
      operationalDays: 365,
      averageConversionCostBps: 20,
      annualBorrowingDays: 0,
      internalNettingEfficiency: 0
    })
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  return (
    <div className="calculator-container">
      <h1>Paygrid Calculator</h1>

      <div className={`main-section ${results ? 'show-results' : 'show-inputs'}`}>
        {!results ? (
          <div className="input-content">
            <h2>Input Values</h2>
            <div className="input-group">
              <label>
                Annual Payment Value:
                <input
                  type="text"
                  value={inputs.annualPaymentValue}
                  onChange={(e) => handleInputChange('annualPaymentValue', e.target.value)}
                  placeholder="Enter annual payment value"
                />
              </label>

              <label>
                Daily Payment Volume:
                <input
                  type="text"
                  value={inputs.dailyPaymentVolume}
                  onChange={(e) => handleInputChange('dailyPaymentVolume', e.target.value)}
                  placeholder="Enter daily payment volume"
                />
              </label>

              <label>
                Float Requirements:
                <input
                  type="text"
                  value={inputs.floatRequirements}
                  onChange={(e) => handleInputChange('floatRequirements', e.target.value)}
                  placeholder="Enter float requirements"
                />
              </label>

              <label>
                Cost of Capital:
                <input
                  type="text"
                  value={inputs.costOfCapital}
                  onChange={(e) => handleInputChange('costOfCapital', e.target.value)}
                  placeholder="Enter cost of capital"
                />
              </label>

              <label>
                Operational Days:
                <input
                  type="text"
                  value={inputs.operationalDays}
                  onChange={(e) => handleInputChange('operationalDays', e.target.value)}
                  placeholder="Enter operational days"
                />
              </label>

              <label>
                Average Conversion Cost (bps):
                <input
                  type="text"
                  value={inputs.averageConversionCostBps}
                  onChange={(e) => handleInputChange('averageConversionCostBps', e.target.value)}
                  placeholder="Enter average conversion cost in bps"
                />
              </label>

              <label>
                Annual Borrowing Days:
                <input
                  type="text"
                  value={inputs.annualBorrowingDays}
                  onChange={(e) => handleInputChange('annualBorrowingDays', e.target.value)}
                  placeholder="Enter annual borrowing days"
                />
              </label>

              <label>
                Internal Netting Efficiency:
                <input
                  type="text"
                  value={inputs.internalNettingEfficiency}
                  onChange={(e) => handleInputChange('internalNettingEfficiency', e.target.value)}
                  placeholder="Enter internal netting efficiency"
                />
              </label>
            </div>

            <button onClick={calculateResults} className="calculate-btn">
              Calculate ROI
            </button>
          </div>
        ) : (
          <div className="results-content">
            <h2>Calculation Results</h2>

            <div className="comparison-summary">
              <div className="comparison-row">
                <div className="comparison-item">
                  <span className="comparison-label">Without Paygrid:</span>
                  <span className="comparison-value">{formatNumber(results.totalAnnualCosts)}</span>
                </div>
                <div className="comparison-item">
                  <span className="comparison-label">With Paygrid:</span>
                  <span className="comparison-value">{formatNumber(results.totalAnnualCosts * 0.3)}</span>
                </div>
              </div>
              <div className="comparison-row">
                <div className="comparison-item savings">
                  <span className="comparison-label">Savings:</span>
                  <span className="comparison-value">{formatNumber(results.totalAnnualCosts * 0.7)}</span>
                </div>
              </div>
            </div>

            <div className="results-table">

              <div className="table-row">
                <div className="table-cell metric-cell">Stablecoin Float Required</div>
                <div className="table-cell value-cell">{formatNumber(results.stablecoinFloatRequired)}</div>
                <div className="table-cell value-cell">{formatNumber(results.stablecoinFloatRequired * 0.3)}</div>
              </div>

              <div className="table-row">
                <div className="table-cell metric-cell">Annual Capital Cost</div>
                <div className="table-cell value-cell">{formatNumber(results.annualCapitalCost)}</div>
                <div className="table-cell value-cell">{formatNumber(results.annualCapitalCost * 0.3)}</div>
              </div>

              <div className="table-row">
                <div className="table-cell metric-cell">Daily Conversion Volume</div>
                <div className="table-cell value-cell">{formatNumber(results.dailyConversionVolume)}</div>
                <div className="table-cell value-cell">{formatNumber(results.dailyConversionVolume * 0.3)}</div>
              </div>

              <div className="table-row">
                <div className="table-cell metric-cell">Annual Conversion Volume</div>
                <div className="table-cell value-cell">{formatNumber(results.annualConversionVolume)}</div>
                <div className="table-cell value-cell">{formatNumber(results.annualConversionVolume * 0.3)}</div>
              </div>

              <div className="table-row">
                <div className="table-cell metric-cell">Annual Conversion Costs</div>
                <div className="table-cell value-cell">{formatNumber(results.annualConversionCosts)}</div>
                <div className="table-cell value-cell">{formatNumber(results.annualConversionCosts * 0.3)}</div>
              </div>

              <div className="table-row">
                <div className="table-cell metric-cell">Daily Borrowing Needed</div>
                <div className="table-cell value-cell">{formatNumber(results.dailyBorrowingNeeded)}</div>
                <div className="table-cell value-cell">{formatNumber(results.dailyBorrowingNeeded * 0.3)}</div>
              </div>

              <div className="table-row">
                <div className="table-cell metric-cell">Annual Borrowing Volume</div>
                <div className="table-cell value-cell">{formatNumber(results.annualBorrowingVolume)}</div>
                <div className="table-cell value-cell">{formatNumber(results.annualBorrowingVolume * 0.3)}</div>
              </div>

              <div className="table-row">
                <div className="table-cell metric-cell">Annual Borrowing Costs</div>
                <div className="table-cell value-cell">{formatNumber(results.annualBorrowingCosts)}</div>
                <div className="table-cell value-cell">{formatNumber(results.annualBorrowingCosts * 0.3)}</div>
              </div>

              <div className="table-row total-row">
                <div className="table-cell metric-cell">Total Annual Costs</div>
                <div className="table-cell value-cell">{formatNumber(results.totalAnnualCosts)}</div>
                <div className="table-cell value-cell">{formatNumber(results.totalAnnualCosts * 0.3)}</div>
              </div>
            </div>

            <button onClick={resetCalculator} className="reset-btn">
              Calculate Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
