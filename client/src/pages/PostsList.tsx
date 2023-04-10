import React, { useEffect, useReducer, useState } from "react";
import { EntityType } from "../../../server/src/db";
import API from "../api";
import { useLocation } from "react-router-dom";
import PostSearchForm from "../components/SearchForm";
import Loading from "../components/Loading";

type State = {
  search: string;
  page: number;
  totalPage: number;
  posts: EntityType.Post[];
  isLoading: boolean;
};

type Action =
  | {
      type: "SET_SEARCH";
      payload: string;
    }
  | {
      type: "SET_PAGE";
      payload: number;
    }
  | {
      type: "SET_POST";
      payload: EntityType.Post[];
    }
  | {
      type: "SET_TOTAL_PAGE";
      payload: number;
    }
  | {
      type: "SET_IS_LOADING";
      payload: boolean;
    };
function reducer(state: State, action: Action) {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_POST":
      return { ...state, posts: action.payload };
    case "SET_TOTAL_PAGE":
      return { ...state, totalPage: action.payload };
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      throw new Error(`Invalid action type`);
  }
}

const PostsList = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [state, dispatch] = useReducer(reducer, {
    search: searchParams.get("q") || "",
    page: parseInt(searchParams.get("page") as string) || 1,
    posts: [],
    totalPage: 1,
    isLoading: false,
  });

  const fetchdata = async () => {
    dispatch({ type: "SET_IS_LOADING", payload: true });
    const res = await API.get(`/posts`, {
      params: {
        page: state.page,
        search: state.search,
      },
    });

    dispatch({ type: "SET_POST", payload: res.data.posts });
    console.log(res.data.totalPage);
    dispatch({ type: "SET_TOTAL_PAGE", payload: res.data.totalPage });
    dispatch({ type: "SET_IS_LOADING", payload: false });
  };

  useEffect(() => {
    fetchdata();
  }, [state.search, state.page]);

  const handleNextPage = () => {
    if (state.page < state.totalPage) {
      dispatch({ type: "SET_PAGE", payload: state.page + 1 });
    }
  };

  const handlePrevPage = () => {
    if (state.page > 1) {
      dispatch({ type: "SET_PAGE", payload: state.page - 1 });
    }
  };

  const handleSearchQuery = (search: string) => {
    dispatch({ type: "SET_SEARCH", payload: search });
    dispatch({ type: "SET_PAGE", payload: 1 });
  };
  return (
    <div className="container mx-auto py-10">
      <PostSearchForm
        searchQuery={state.search}
        setSearchQuery={handleSearchQuery}
        page={state.page}
      />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
        {state.isLoading ? (
          <Loading />
        ) : (
          <div className="grid gap-8">
            {state.posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-lg">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-500 text-sm">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <a
                      href={`/${post.id}`}
                      className="bg-gray-900 text-white text-sm font-bold py-2 px-4 rounded-full hover:bg-gray-800"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap self-center justify-between">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mx-2"
                onClick={handlePrevPage}
              >
                Previous Page
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mx-2"
                onClick={handleNextPage}
              >
                Next Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsList;
