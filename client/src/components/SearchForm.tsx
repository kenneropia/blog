import { useNavigate, useLocation } from "react-router-dom";

function PostSearchForm({
  searchQuery,
  setSearchQuery,
  page,
}: {
  page: number;
  searchQuery: string;
  setSearchQuery: (arg0: string) => void;
}) {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`?q=${searchQuery}&page=${page}`);
  };

  return (
    <form className="mb-4" onSubmit={handleSubmit}>
      <div className="flex md:space-y-0 space-y-2 p-2 md:flex-nowrap flex-wrap justify-between items-center">
        <input
          type="text"
          placeholder="search for posts"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-l-md p-2 w-full border-gray-300 border"
        />
        <button
          className=" bg-gray-200 w-full md:w-2/12 rounded-r-md px-4 py-2 hover:bg-gray-300 transition-colors"
          type="submit"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default PostSearchForm;
