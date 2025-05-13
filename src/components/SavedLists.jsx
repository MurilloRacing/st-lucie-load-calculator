import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SavedLists() {
  const [savedLists, setSavedLists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLists = async () => {
      const { data, error } = await supabase
        .from("saved_load_lists")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading saved lists:", error);
        toast.error("Failed to load saved lists.");
      } else {
        setSavedLists(data);
      }
    };

    fetchLists();
  }, []);

  const handleLoadClick = async (listId) => {
    const { data, error } = await supabase
      .from("saved_load_items")
      .select("*")
      .eq("list_id", listId);

    if (error) {
      toast.error("Failed to load list items.");
      console.error(error);
      return;
    }

    localStorage.setItem("loadedLoads", JSON.stringify(data));
    navigate("/new");
  };

  const handleDelete = async (listId) => {
    const confirmed = window.confirm("Delete this load list?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("saved_load_lists")
      .delete()
      .eq("id", listId);

    if (error) {
      toast.error("Failed to delete list.");
    } else {
      toast.success("Deleted.");
      setSavedLists((prev) => prev.filter((list) => list.id !== listId));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">📄 Saved Load Lists</h1>

      {savedLists.length === 0 ? (
        <p className="text-gray-500 text-center">No saved load lists found.</p>
      ) : (
        <table className="w-full table-auto border-collapse bg-white shadow rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr className="text-left text-sm">
              <th className="p-3">Name</th>
              <th className="p-3">Building</th>
              <th className="p-3">Space</th>
              <th className="p-3">Created</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {savedLists.map((list) => (
              <tr key={list.id} className="border-t hover:bg-gray-50 text-sm">
                <td className="p-3">{list.name}</td>
                <td className="p-3">{list.building_id}</td>
                <td className="p-3">{list.space_number}</td>
                <td className="p-3">{new Date(list.created_at).toLocaleDateString()}</td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => handleLoadClick(list.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDelete(list.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
