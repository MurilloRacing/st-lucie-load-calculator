import { useId } from 'react';

export default function UnitInfoHeader({
  unitName,
  setUnitName,
  buildingId,
  setBuildingId,
  spaceNumber,
  setSpaceNumber,
}) {
  // Generate unique IDs for form fields
  const unitNameId = useId();
  const buildingInputId = useId(); // Renamed to avoid conflict
  const spaceNumberId = useId();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="space-y-1">
        <label 
          htmlFor={unitNameId} 
          className="block text-sm font-medium text-gray-700"
        >
          Unit / Project Name
        </label>
        <input
          id={unitNameId}
          type="text"
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)}
          placeholder="e.g. East Paddock 01"
          className="w-full border border-gray-300 rounded-md px-3 py-2
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   transition-colors"
        />
      </div>

      <div className="space-y-1">
        <label 
          htmlFor={buildingInputId}
          className="block text-sm font-medium text-gray-700"
        >
          Building ID
        </label>
        <input
          id={buildingInputId}
          type="text"
          value={buildingId}
          onChange={(e) => setBuildingId(e.target.value)}
          placeholder="e.g. B-2"
          className="w-full border border-gray-300 rounded-md px-3 py-2
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   transition-colors"
        />
      </div>

      <div className="space-y-1">
        <label 
          htmlFor={spaceNumberId}
          className="block text-sm font-medium text-gray-700"
        >
          Space Number
        </label>
        <input
          id={spaceNumberId}
          type="text"
          value={spaceNumber}
          onChange={(e) => setSpaceNumber(e.target.value)}
          placeholder="e.g. 104"
          className="w-full border border-gray-300 rounded-md px-3 py-2
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   transition-colors"
        />
      </div>
    </div>
  );
}
