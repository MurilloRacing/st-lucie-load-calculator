import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const LoadList = ({ loads, selectedLoads, toggleLoad, editLoad, deleteLoad }) => {
  return (
    <div className="bg-white rounded shadow p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Load List</h2>
      {loads.length === 0 ? (
        <p className="text-gray-500">No loads available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="p-2">Select</th>
                <th className="p-2">Name</th>
                <th className="p-2">Power (W)</th>
                <th className="p-2">Voltage</th>
                <th className="p-2">Type</th>
                <th className="p-2">Motor?</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loads.map((load) => (
                <tr key={load.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedLoads.includes(load.id)}
                      onChange={() => toggleLoad(load.id)}
                    />
                  </td>
                  <td className="p-2">
                    {load.name}
                    {load.is_essential && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-green-600 text-white rounded-full">
                        Essential
                      </span>
                    )}
                  </td>
                  <td className="p-2">{load.power}</td>
                  <td className="p-2">{load.voltage}V</td>
                  <td className="p-2">{load.type}</td>
                  <td className="p-2">{load.isMotor || load.is_motor ? "Yes" : "No"}</td>
                  <td className="p-2 text-right space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => editLoad(load)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => deleteLoad(load.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LoadList;
