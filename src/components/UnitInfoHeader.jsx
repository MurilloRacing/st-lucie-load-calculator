export default function UnitInfoHeader({
  unitName,
  setUnitName,
  buildingId,
  setBuildingId,
  spaceNumber,
  setSpaceNumber,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded shadow">
      <div>
        <label className="block text-sm font-medium mb-1">Unit / Project Name</label>
        <input
          type="text"
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)}
          placeholder="e.g. East Paddock 01"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Building ID</label>
        <input
          type="text"
          value={buildingId}
          onChange={(e) => setBuildingId(e.target.value)}
          placeholder="e.g. B-2"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Space Number</label>
        <input
          type="text"
          value={spaceNumber}
          onChange={(e) => setSpaceNumber(e.target.value)}
          placeholder="e.g. 104"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
    </div>
  );
}
