import React, { useState, useEffect } from "react";
import axios from "axios";
import EditTagModal from "../../components/EditTagModal";
import { EntityType } from "../../../../server/src/db";
import API from "../../api";
import Loading from "../../components/Loading";

const TagsTable = () => {
  type TypedTags = EntityType.Tag[];
  const [tags, setTags] = useState<TypedTags>([]);
  const [newTagName, setNewTagName] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<EntityType.Tag | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    API.get("/tags")
      .then((response) => {
        setTags(response.data.tags);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsLoading(false);
  }, []);
  const handleAddTag = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = await API.post<{ tag: EntityType.Tag }>("/tags", {
      name: newTagName,
    });

    setTags([...tags, data.data.tag]);
    setNewTagName("");
  };

  const handleDeleteTag = async (tagId: string) => {
    const { data } = await API.delete<{ tag: EntityType.Tag }>(
      `/tags/${tagId}`
    );
    const updatedTags = tags.filter((tag) => tag.id !== tagId);
    setTags(updatedTags);
  };

  const handleModal = (tag: EntityType.Tag) => {
    setEditingTag(tag);
    setEditModalOpen(true);
  };

  const handleEditTag = async (updatedTag: EntityType.Tag) => {
    try {
      const { data } = await API.patch<{ tag: EntityType.Tag }>(
        `/tags/${updatedTag.id}`,
        { name: updatedTag.name }
      );

      const updatedTags = tags.map((tag) => {
        if (tag.id === data.tag.id) {
          return data.tag;
        }
        return tag;
      });
      setTags(updatedTags);
      setEditModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseModal = () => {
    setEditingTag(null);
    setEditModalOpen(false);
  };

  if (isLoading) return <Loading />;
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleAddTag} className="mb-4">
        <div className="flex md:flex-nowrap flex-wrap justify-between items-center">
          <input
            type="text"
            placeholder="Enter tag name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="rounded-l-md p-2 w-full border-gray-300 border-r-0"
          />
          <button
            type="submit"
            className="bg-gray-200 w-full md:w-2/12 rounded-r-md px-4 py-2 hover:bg-gray-300 transition-colors"
          >
            Add Tag
          </button>
        </div>
      </form>
      <table className="w-full border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.id} className="border-b border-gray-300">
              <td className="p-2">{tag.id}</td>
              <td className="p-2">{tag.name}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="md:mr-5 bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleModal(tag)}
                  className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 hover:text-gray-900 transition-colors"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editModalOpen && editingTag && (
        <EditTagModal
          tag={editingTag}
          onSave={handleEditTag}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default TagsTable;
