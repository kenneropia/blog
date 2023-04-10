import React, { useState, useEffect } from "react";
import { EntityType } from "../api/schema";

type TypedCategory = EntityType.Category & { _count: { posts: number } };

const EditCategoryModal = ({
  category,
  onSave,
  onClose,
}: {
  category: TypedCategory;
  onSave: (category: TypedCategory) => void;
  onClose: () => void;
}) => {
  const [updatedCategoryName, setUpdatedCategoryName] = useState(category.name);

  useEffect(() => {
    setUpdatedCategoryName(category.name);
  }, [category]);

  const handleSave = () => {
    const updatedCategory = { ...category, name: updatedCategoryName };
    onSave(updatedCategory);
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-lg overflow-hidden w-full max-w-md">
          <div className="bg-gray-100 px-4 py-2">
            <h2 className="text-lg font-medium text-gray-800">Edit Category</h2>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="categoryName"
              >
                Category Name
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="categoryName"
                value={updatedCategoryName}
                onChange={(e) => setUpdatedCategoryName(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                className="text-gray-700 py-2 px-4 mr-2 rounded-lg border border-gray-500 hover:bg-gray-100 focus:outline-none"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 focus:outline-none"
                onClick={(e) => {
                  handleSave();
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;
