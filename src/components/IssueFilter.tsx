import { useState } from "react";

type Props = {
  filter: string;
  setFilter: (filter: string) => void;
};

const IssueFilter = ({ filter, setFilter }: Props) => {
  const handleFilterClick = (filterValue: string) => {
    setFilter(filterValue);
  };

  return (
    <div className="">
      <label className="text-xl text-gray-100">Filter by status:</label>
      <div className="space-y-2">
        <button
          onClick={() => handleFilterClick("")}
          className={filter === "" ? "bg-blue-500 text-white px-2 rounded-md mr-2" : "bg-gray-200 px-2 rounded-md mr-2"}
        >
          All
        </button>
        <button
          onClick={() => handleFilterClick("Open")}
          className={filter === "Open" ? "bg-blue-500 text-white px-2 rounded-md mr-2" : "bg-gray-200 px-2 rounded-md mr-2"}
        >
          Open
        </button>
        <button
          onClick={() => handleFilterClick("Closed")}
          className={filter === "Closed" ? "bg-blue-500 text-white px-2 rounded-md mr-2" : "bg-gray-200 px-2 rounded-md mr-2"}
        >
          Closed
        </button>
        <button
          onClick={() => handleFilterClick("In Progress")}
          className={filter === "In Progress" ? "bg-blue-500 text-white px-2 rounded-md mr-2" : "bg-gray-200 px-2 rounded-md mr-2"}
        >
          In Progress
        </button>
      </div>
    </div>
  );
};

export default IssueFilter;
