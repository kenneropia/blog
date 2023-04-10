import React, { useState, useEffect } from "react";
import axios from "axios";
import EditCategoryModal from "../../components/EditCategoryModal";
import { EntityType } from "../../../../server/src/db";
import API from "../../api";
import Loading from "../../components/Loading";

const CategoriesTable = () => {
  type TypedCategory = EntityType.Category & { _count: { posts: number } };
  const [categories, setCategories] = useState<TypedCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TypedCategory | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    API.get("/categories")
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsLoading(false);
  }, []);
  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await API.post<{ category: TypedCategory }>("/categories", {
      name: newCategoryName,
    });
    setCategories([...categories, res.data.category]);
    setNewCategoryName("");
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await API.delete<{ category: TypedCategory }>(
        `/categories/${categoryId}`
      );
      const updatedCategories = categories.filter(
        (category) => category.id !== categoryId
      );
      setCategories(updatedCategories);
    } catch (err) {
      console.log(err);
    }
  };

  const handleModal = (category: TypedCategory) => {
    setEditingCategory(category);
    setEditModalOpen(true);
  };

  const handleEditCategory = async (updatedCategory: TypedCategory) => {
    try {
      const { data } = await API.patch<{ category: TypedCategory }>(
        `/categories/${updatedCategory.id}`,
        { name: updatedCategory.name }
      );

      const updatedCategories = categories.map((category) => {
        if (category.id === data.category.id) {
          return data.category;
        }
        return category;
      });
      setCategories(updatedCategories);
      setEditModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseModal = () => {
    setEditingCategory(null);
    setEditModalOpen(false);
  };

  if (isLoading) return <Loading />;
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleAddCategory} className="mb-4">
        <div className="flex md:flex-nowrap flex-wrap justify-between items-center">
          <input
            type="text"
            placeholder="Enter category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="rounded-l-md p-2 w-full border-gray-300 border-r-0"
          />
          <button
            type="submit"
            disabled={!Boolean(newCategoryName) && true}
            className={`${
              !Boolean(newCategoryName) && "opacity-50"
            } bg-gray-200 w-full md:w-2/12 rounded-r-md px-4 py-2 hover:bg-gray-300 transition-colors`}
          >
            Add Category
          </button>
        </div>
      </form>
      <table className="w-full border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Noumber of posts</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b border-gray-300">
              <td className="p-2">{category.id}</td>
              <td className="p-2">{category.name}</td>
              <td className="p-2">{category._count.posts}</td>
              <td className="p-2">
                <button
                  onClick={async () => await handleDeleteCategory(category.id)}
                  className="md:mr-5 bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleModal(category)}
                  className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 hover:text-gray-900 transition-colors"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editModalOpen && editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onSave={handleEditCategory}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CategoriesTable;
