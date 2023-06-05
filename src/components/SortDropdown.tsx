//SortDropdown.tsx
import { useState } from "react";
import { useAtom } from "jotai";
import { sortOrderAtom } from "../utils/Atoms";
import { sortByAtom } from "../utils/Atoms";
import { IssueType } from "@/types/Issue";

type Props = {
  onSort: (sortBy: string, sortOrder: "asc" | "desc") => void;
};

const SortDropdown = ({ onSort }: Props) => {
  // const [selectedSort, setSelectedSort] = useState("title");
  // const [selectedSortOrder, setSelectedSortOrder] = useState<"asc" | "desc">(
  //   "asc"
  // );
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom);
  const [sortBy, setSortBy] = useAtom(sortByAtom);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    setSortBy(selectedOption);
    onSort(sortBy, sortOrder);
  };

  const handleToggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    onSort(sortBy, newSortOrder);
  };

  return (
    <div className="inline-block relative">
      <select
        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        value={sortBy}
        onChange={handleSortChange}
      >
        <option value="" disabled>
          Sort by
        </option>
        <option value="id">ID</option>
        <option value="title">Title</option>
        <option value="description">Description</option>
        <option value="status">Status</option>
        <option value="category">Category</option>
        <option value="priority">Priority</option>
        <option value="date">Date</option>
        <option value="assignee">Assignee</option>
      </select>
      <button
        className="absolute right-0 top-0 h-full px-2 text-gray-700"
        onClick={handleToggleSortOrder}
        title={sortOrder === "asc" ? "asc" : "desc"}
      >
        {sortOrder === "asc" ? "▲" : "▼"}
      </button>
    </div>
  );
};

export default SortDropdown;
