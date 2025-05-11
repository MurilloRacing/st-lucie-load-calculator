import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

const SaveLoadListControls = ({ loads, onSaveSuccess }) => {
  const [existingLists, setExistingLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState("");
  const [newListName, setNewListName] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [spaceNumber, setSpaceNumber] = useState("");
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    const fetchLists = async () => {
      const { data, error } = await supabase.from("saved_load_lists").select("*");
      if (error) {
        console.error("Error fetching lists:", error);
      } else {
        setExistingLists(data);
      }
    };
    fetchLists();
  }, []);

  const handleSave = async () => {
    if (!newListName && !selectedListId) {
      toast.error("Please select or name a list.");
      return;
    }

    let listId = selectedListId;

    if (!listId) {
      // Create new list first
      const { data, error } = await supabase
        .from("saved_load_lists")
        .insert([
          {
            name: newListName,
            building_id: buildingId,
            space_number: spaceNumber,
            user_id: null // Replace with actual user_id if using auth
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("List creation failed:", error);
        toast.error("Failed to save list.");
        return;
      }

      listId = data.id;
    }

    // Insert items
    const listItems = loads.map((l) => ({
      list_id: listId,
      name: l.name,
      power: l.power,
      voltage: l.voltage,
      type: l.type,
      is_motor: l.is_motor
    }));

    const { error: itemsError } = await supabase.from("saved_load_items").insert(listItems);

    if (itemsError) {
      console.error("Failed to save items:", itemsError);
      toast.error("Could not save list items.");
    } else {
      toast.success("Load list saved successfully!");
      onSaveSuccess?.();
      setIsEdited(false);
    }
  };

  useEffect(() => {
    setIsEdited(true);
  }, [loads]);

  return (
    <div className="bg-gray-50 border p-4 rounded mb-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          className="border p-2 rounded"
          value={selectedListId}
          onChange={(e) => setSelectedListId(e.target.value)}
        >
          <option value="">Select Existing Load List</option>
          {existingLists.map((list) => (
            <option key={list.id} value={list.id}>{list.name}</option>
          ))}
        </select>

        <input
          type="text"
          className="border p-2 rounded"
          placeholder="New List Name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />

        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Building ID"
          value={buildingId}
          onChange={(e) => setBuildingId(e.target.value)}
        />

        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Space Number"
          value={spaceNumber}
          onChange={(e) => setSpaceNumber(e.target.value)}
        />

        <button
          onClick={handleSave}
          className={`px-4 py-2 text-white rounded ${isEdited ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          disabled={!isEdited}
        >
          Save Load List
        </button>
      </div>
    </div>
  );
};

export default SaveLoadListControls;
