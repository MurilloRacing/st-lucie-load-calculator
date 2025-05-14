import React from "react";

const Results = ({ loads = [] }) => {
  // Filter only enabled loads
  const activeLoads = loads.filter((load) => load.enabled !== false);

  if (!Array.isArray(activeLoads) || activeLoads.length === 0) {
    return <p className="text-gray-500 mt-4">Select at least one load to see results.</p>;
  }

  const toKW = (watts) => watts / 1000;

  const continuousLoads = activeLoads.filter((load) => load.type === "Continuous");
  const nonContinuousLoads = activeLoads.filter((load) => load.type !== "Continuous");
  const motorLoads = activeLoads.filter((load) => load.isMotor || load.is_motor);

  const totalConnectedLoadKW = activeLoads.reduce((sum, load) => sum + toKW(load.power), 0);
  const continuousLoadKW = continuousLoads.reduce((sum, load) => sum + toKW(load.power), 0) * 1.25;
  const nonContinuousLoadKW = nonContinuousLoads.reduce((sum, load) => sum + toKW(load.power), 0);
  const largestMotorKW = motorLoads.length > 0 ? Math.max(...motorLoads.map((load) => toKW(load.power))) * 0.25 : 0;

  const totalAdjustedLoadKW = continuousLoadKW + nonContinuousLoadKW + largestMotorKW;
  const demandLoadKW = totalAdjustedLoadKW * 0.8;

  const amperage208 = demandLoadKW / (208 * Math.sqrt(3) / 1000);
  const amperage480 = demandLoadKW / (480 * Math.sqrt(3) / 1000);

  const recommendedPanel208 = Math.ceil(amperage208 * 1.25 / 100) * 100;
  const recommendedPanel480 = Math.ceil(amperage480 * 1.25 / 100) * 100;

  return (
    <div className="mt-6 p-6 border border-gray-300 rounded-xl bg-[#f4f4f4] shadow text-[#292929]">
      <h2 className="text-2xl font-bold mb-4">Load Calculation Results</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-[#333]">
        <li><strong>Total Connected Load:</strong> {totalConnectedLoadKW.toFixed(2)} kW</li>
        <li><strong>Continuous Load (125%):</strong> {continuousLoadKW.toFixed(2)} kW</li>
        <li><strong>Non-Continuous Load:</strong> {nonContinuousLoadKW.toFixed(2)} kW</li>
        <li><strong>Largest Motor (25%):</strong> {largestMotorKW.toFixed(2)} kW</li>
        <li><strong>Total Adjusted Load:</strong> {totalAdjustedLoadKW.toFixed(2)} kW</li>
        <li><strong>Demand Load (80%):</strong> {demandLoadKW.toFixed(2)} kW</li>
        <li><strong>Amperage (208V 3∅):</strong> {amperage208.toFixed(1)} A</li>
        <li><strong>Amperage (480V 3∅):</strong> {amperage480.toFixed(1)} A</li>
        <li><strong>Recommended Panel (208V):</strong> {recommendedPanel208} A</li>
        <li><strong>Recommended Panel (480V):</strong> {recommendedPanel480} A</li>
      </ul>
      <p className="text-xs text-gray-500 mt-4">
        Calculations are based on NEC adjustments. Consult a Florida-licensed electrician for NEC Article 220 compliance and FPL coordination.
      </p>
    </div>
  );
};

export default Results;
