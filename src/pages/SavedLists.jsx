import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SavedLists() {
  const [savedLists, setSavedLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("saved_load_lists")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSavedLists(data);
    } catch (error) {
      console.error("Error loading saved lists:", error);
      toast.error("Failed to load saved lists");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadClick = async (listId) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("saved_load_items")
        .select("*")
        .eq("list_id", listId);

      if (error) throw error;

      localStorage.setItem("loadedLoads", JSON.stringify(data));
      toast.success("List loaded successfully");
      navigate("/new");
    } catch (error) {
      console.error("Error loading list:", error);
      toast.error("Failed to load list items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (listId) => {
    const confirmed = window.confirm("Are you sure you want to delete this list? This action cannot be undone.");
    if (!confirmed) return;

    setDeleteLoading(listId);
    try {
      const { error } = await supabase
        .from("saved_load_lists")
        .delete()
        .eq("id", listId);

      if (error) throw error;
      
      setSavedLists((prev) => prev.filter((list) => list.id !== listId));
      toast.success("List deleted successfully");
    } catch (error) {
      console.error("Error deleting list:", error);
      toast.error("Failed to delete list");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">📄 Saved Load Lists</h1>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : savedLists.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No saved load lists found.</p>
          <button 
            onClick={() => navigate('/calculator')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Create your first list →
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-sm">
                <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 font-medium text-gray-600">Building</th>
                <th className="px-4 py-3 font-medium text-gray-600">Space</th>
                <th className="px-4 py-3 font-medium text-gray-600">Created</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {savedLists.map((list) => (
                <tr key={list.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">{list.name}</td>
                  <td className="px-4 py-3">{list.building_id}</td>
                  <td className="px-4 py-3">{list.space_number}</td>
                  <td className="px-4 py-3">
                    {new Date(list.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleLoadClick(list.id)}
                      disabled={isLoading}
                      className="bg-blue-600 text-white px-3 py-1 rounded 
                               hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDelete(list.id)}
                      disabled={deleteLoading === list.id}
                      className="bg-red-600 text-white px-3 py-1 rounded 
                               hover:bg-red-700 transition-colors disabled:bg-gray-400"
                    >
                      {deleteLoading === list.id ? "Deleting..." : "Delete"}
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
}
