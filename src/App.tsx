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
      annualConversionCosts: (dailyPaymentVolume - internalNettingEfficiency) * averageConversionCostBps * operationalDays / 10000,
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
      <h1>PayGrid Calculator</h1>

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
            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Stablecoin Float Required:</span>
                <span className="result-value">{formatNumber(results.stablecoinFloatRequired)}</span>
              </div>

              <div className="result-item">
                <span className="result-label">Annual Capital Cost:</span>
                <span className="result-value">{formatNumber(results.annualCapitalCost)}</span>
              </div>

              <div className="result-item">
                <span className="result-label">Daily Conversion Volume:</span>
                <span className="result-value">{formatNumber(results.dailyConversionVolume)}</span>
              </div>

              <div className="result-item">
                <span className="result-label">Annual Conversion Volume:</span>
                <span className="result-value">{formatNumber(results.annualConversionVolume)}</span>
              </div>

              <div className="result-item">
                <span className="result-label">Annual Conversion Costs:</span>
                <span className="result-value">{formatNumber(results.annualConversionCosts)}</span>
              </div>

              <div className="result-item">
                <span className="result-label">Daily Borrowing Needed:</span>
                <span className="result-value">{formatNumber(results.dailyBorrowingNeeded)}</span>
              </div>

              <div className="result-item">
                <span className="result-label">Annual Borrowing Volume:</span>
                <span className="result-value">{formatNumber(results.annualBorrowingVolume)}</span>
              </div>

              <div className="result-item">
                <span className="result-label">Annual Borrowing Costs:</span>
                <span className="result-value">{formatNumber(results.annualBorrowingCosts)}</span>
              </div>

              <div className="result-item total-cost">
                <span className="result-label">Total Annual Costs:</span>
                <span className="result-value">{formatNumber(results.totalAnnualCosts)}</span>
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
