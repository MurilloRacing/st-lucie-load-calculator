import React, { useState, useEffect } from "react";

const LoadModal = ({ closeModal, addLoad, updateLoad, editingLoad }) => {
  const [form, setForm] = useState({
    name: "",
    power: "",
    voltage: "120",
    type: "Non-Continuous",
    isMotor: false,
  });

  useEffect(() => {
    if (editingLoad) {
      setForm(editingLoad);
    } else {
      setForm({
        name: "",
        power: "",
        voltage: "120",
        type: "Non-Continuous",
        isMotor: false,
      });
    }
  }, [editingLoad]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const load = {
      ...form,
      power: parseInt(form.power, 10),
      voltage: parseInt(form.voltage, 10),
    };
    editingLoad ? updateLoad(load) : addLoad(load);
    closeModal();
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        {editingLoad ? "Edit Load" : "Add Load"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Power (Watts)</label>
          <input
            name="power"
            type="number"
            value={form.power}
            onChange={handleChange}
            required
            min={0}
            step={100}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Voltage</label>
          <select
            name="voltage"
            value={form.voltage}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="120">120V</option>
            <option value="208">208V</option>
            <option value="480">480V</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Load Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Continuous">Continuous</option>
            <option value="Non-Continuous">Non-Continuous</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isMotor"
            checked={form.isMotor}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm">Is Motor Load?</label>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {editingLoad ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoadModal;
