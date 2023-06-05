//Issues.tsx
import { useState, useEffect, useCallback } from "react";
import { IssueType } from "../types/Issue";
import IssueList from "./IssueList";
import IssueFilter from "./IssueFilter";
import SortDropdown from "./SortDropdown";
import React from "react";
import { useAtom } from "jotai";
import { issuesAtom } from "../utils/Atoms";
import { tableViewAtom } from "../utils/Atoms";
import IssuesSummary from "./IssuesSummary";
import SearchBar from "./SearchBar";

const Issues = () => {
  const [issues, setIssues] = useAtom(issuesAtom);
  const [filteredIssues, setFilteredIssues] = useState<IssueType[]>([]);
  const [tableView, setTableView] = useAtom(tableViewAtom);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // default sorting order is ascending
  const [filter, setFilter] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState("title");

  useEffect(() => {
    setFilteredIssues(issues);
  }, [issues]);

  useEffect(() => {
    if (filter === "") {
      setFilteredIssues(issues);
    } else {
      const filtered = issues.filter((issue) => issue.status === filter);
      setFilteredIssues(filtered);
    }
  }, [issues, filter]);

  const handleFilter = useCallback((filter: string) => {
    setFilter(filter);
  }, []);

  const handleSort = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc") => {
      setSelectedSort(sortBy);
      setSortOrder(sortOrder);
    },
    []
  );

  const handleSearch = useCallback(
    (searchText: string) => {
      const filtered = issues.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchText.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredIssues(filtered);
    },
    [issues]
  );

  const sortedIssues = React.useMemo(() => {
    const compareValues = (a: any, b: any) => {
      if (typeof a === "string" && typeof b === "string") {
        return a.localeCompare(b, "en", { numeric: true, sensitivity: "base" });
      } else {
        return a > b ? 1 : -1;
      }
    };

    const compareIssues = (a: IssueType, b: IssueType) => {
      return compareValues(a[selectedSort], b[selectedSort]);
    };

    return [...filteredIssues].sort((a, b) =>
      sortOrder === "asc" ? compareIssues(a, b) : compareIssues(b, a)
    );
  }, [filteredIssues, sortOrder, selectedSort]);

  const handleFilterClick = (bool: boolean) => {
    setTableView(bool);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 flex bg-gray-100">
      {/* <div className="flex space-x-4 mb-4 bg-blue-100 "> */}
      <div className="bg-gray-200 space-y-24 ">
        <div className="p-10 bg-gray-600 rounded-lg">
          <IssueFilter filter={filter} setFilter={handleFilter} />{" "}
        </div>
        <div className="p-10 border-5 bg-gray-600 rounded-lg">
          <IssuesSummary />
        </div>
      </div>

      {/* </div> */}
      <div className=" mx-auto bg-white rounded-lg ">
        {/* <div className="flex justify-start">
          <SortDropdown onSort={handleSort} />
        </div> */}

        <div className="flex p-2 space-x-10">
          <h1 className="text-2xl font-bold mb-4 ">List of Issues:</h1>
          <SearchBar onSearch={handleSearch} />
          {tableView ? (
            ""
          ) : (
            <div className="flex justify-start">
              <SortDropdown onSort={handleSort} />
            </div>
          )}          
        </div>        
        <div className=" flex justify-end p-2 space-x-5 ">
          <button
            onClick={() => handleFilterClick(!tableView)}
            className="bg-blue-500 float-right text-white px-2 rounded-md mr-2"
          >
            {tableView ? "Normal view" : "Table view"}
          </button>
        </div>
        <IssueList
          issues={sortedIssues}
          //sortOrder={sortOrder}
          //sortBy={selectedSort}
        />
      </div>
    </div>
  );
};

export default Issues;
