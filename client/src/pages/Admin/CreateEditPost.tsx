import React, { useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EditorState } from "draft-js";

import { convertToHTML } from "draft-convert";
import API from "../../api";
import { EntityType } from "../../api/schema";
import { z } from "zod";
import toast from "react-hot-toast";
import { AxiosResponse } from "axios";
import DraftEditor from "../../components/DraftEditor";

type TypedPost = EntityType.Post & { category: EntityType.Category } & {
  tags: EntityType.Tag[];
};

type State = {
  post: Partial<TypedPost> | null;
  categories: EntityType.Category[];
  tags: EntityType.Tag[];
  selectedTags: string[];
  error: string;
  content: EditorState;
  isLoading: boolean;
};

type Action =
  | { type: "SET_POST"; payload: Partial<TypedPost> | null }
  | { type: "ADD_TAG"; payload: string }
  | { type: "REMOVE_TAG"; payload: string }
  | { type: "SET_CATEGORIES"; payload: EntityType.Category[] }
  | { type: "SET_TAGS"; payload: EntityType.Tag[] }
  | { type: "SET_SELECTED_TAGS"; payload: string[] }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_IS_LOADING"; payload: boolean }
  | { type: "SET_CONTENT"; payload: EditorState };

const initialState: State = {
  post: null,
  content: EditorState.createEmpty(),
  categories: [],
  tags: [],
  selectedTags: [],
  error: "",
  isLoading: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_POST":
      return { ...state, post: action.payload };
    case "SET_CONTENT":
      return { ...state, content: action.payload };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "SET_TAGS":
      return { ...state, tags: action.payload };
    case "SET_SELECTED_TAGS":
      return { ...state, selectedTags: action.payload };
    case "ADD_TAG":
      return {
        ...state,
        selectedTags: [...state.selectedTags, action.payload],
      };
    case "REMOVE_TAG":
      return {
        ...state,
        selectedTags: state.selectedTags.filter((id) => id !== action.payload),
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

const CreateEditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    API.get("/categories").then((res) => {
      dispatch({ type: "SET_CATEGORIES", payload: res.data.categories });
    });
    API.get("/tags").then((res) => {
      dispatch({ type: "SET_TAGS", payload: res.data.tags });
    });
    if (id) {
      API.get(`/posts/${id}`).then((res) => {
        dispatch({ type: "SET_POST", payload: res.data.post });

        dispatch({
          type: "SET_SELECTED_TAGS",
          payload: res.data.post.tags.map((tag: EntityType.Tag) => tag.id),
        });
      });
    }
  }, [id]);

  useEffect(() => {
    let html = convertToHTML(state.content.getCurrentContent());

    handleContentChange(html);
  }, [state.content]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      let response: AxiosResponse<EntityType.Post>;
      if (id) {
        response = await API.patch(`/posts/${id}`, {
          ...post,
          tags: selectedTags,
          category: undefined,
          comments: undefined,
        });
      } else {
        response = await API.post(`/posts`, {
          ...post,
          tags: selectedTags,
        });
      }

      if (response.status === 201 || response.status === 200) {
        toast.success("Post submitted successfully");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        dispatch({ type: "SET_ERROR", payload: err.errors[0].message });
      } else {
        dispatch({
          type: "SET_ERROR",
          payload: "An error has occurred. Please try again later.",
        });
      }
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_POST",
      payload: { ...state.post, title: event.target.value },
    });
  };

  const handleContentChange = (content: string) => {
    dispatch({
      type: "SET_POST",
      payload: { ...state.post, content: content },
    });
  };
  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCategory = state.categories.find(
      (category) => category.name === event.target.value
    );
    dispatch({
      type: "SET_POST",
      payload: { ...state.post, categoryId: selectedCategory?.id },
    });
  };
  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tagId = event.target.value;
    const tagData = state.tags.find((tag) => tag.id == tagId);
    if (event.target.checked) {
      dispatch({ type: "ADD_TAG", payload: tagData?.id! });
    } else {
      dispatch({ type: "REMOVE_TAG", payload: tagData?.id! });
    }
  };
  const handleEditorChange = (editorState: EditorState) => {
    dispatch({ type: "SET_CONTENT", payload: editorState });
  };
  const { post, categories, tags, selectedTags, error, content, isLoading } =
    state;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-2">
        {id ? "Edit Post" : "Create Post"}
      </h2>
      {error && (
        <div className="text-red-600 mb-2">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Enter title"
            value={post?.title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="content"
          >
            Content
          </label>
          <DraftEditor
            content={content}
            handleEditorChange={handleEditorChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="category"
          >
            Category
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category"
            value={post?.category?.name}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="tags">
            Tags
          </label>
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center mb-2">
              <input
                className="mr-2"
                id={`tag-${tag.id}`}
                type="checkbox"
                value={tag.id}
                checked={selectedTags.includes(tag.id)}
                onChange={handleTagChange}
              />
              <label htmlFor={`tag-${tag.id}`}>{tag.name}</label>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {id ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditPost;
