// Results.jsx

const Results = ({ loads }) => {
  if (loads.length === 0) return null;

  const totalConnected = loads.reduce((sum, l) => sum + l.power, 0);
  const continuous = loads
    .filter((l) => l.type === 'Continuous')
    .reduce((sum, l) => sum + l.power * 1.25, 0);
  const nonContinuous = loads
    .filter((l) => l.type !== 'Continuous')
    .reduce((sum, l) => sum + l.power, 0);
  const largestMotor = Math.max(0, ...loads.filter((l) => l.isMotor).map((l) => l.power)) * 0.25;
  const totalAdjusted = continuous + nonContinuous + largestMotor;
  const demandLoad = totalAdjusted * 0.8;
  const amps208 = demandLoad / (208 * Math.sqrt(3));
  const amps480 = demandLoad / (480 * Math.sqrt(3));
  const panelSize208 = Math.ceil((amps208 * 1.25) / 100) * 100;
  const panelSize480 = Math.ceil((amps480 * 1.25) / 100) * 100;

  return (
    <div className="bg-[#f4f4f4] rounded-xl shadow border border-gray-300 p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-[#292929]">NEC Load Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#333]">
        <div><strong>Total Connected Load:</strong> {totalConnected} W</div>
        <div><strong>Continuous Load (×1.25):</strong> {continuous.toFixed(1)} W</div>
        <div><strong>Non-Continuous Load:</strong> {nonContinuous.toFixed(1)} W</div>
        <div><strong>Largest Motor (×0.25):</strong> {largestMotor.toFixed(1)} W</div>
        <div><strong>Total Adjusted Load:</strong> {totalAdjusted.toFixed(1)} W</div>
        <div><strong>Demand Load (×0.8):</strong> {demandLoad.toFixed(1)} W</div>
        <div><strong>Amps @ 208V:</strong> {amps208.toFixed(1)} A</div>
        <div><strong>Amps @ 480V:</strong> {amps480.toFixed(1)} A</div>
        <div><strong>Panel Size @ 208V:</strong> {panelSize208} A</div>
        <div><strong>Panel Size @ 480V:</strong> {panelSize480} A</div>
      </div>
    </div>
  );
};

export default Results;
