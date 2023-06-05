import React from "react";
import { useAtom } from "jotai";
import { issuesAtom } from "../utils/Atoms";

const IssuesSummary: React.FC = () => {

  const [issues, setIssues] = useAtom(issuesAtom);

  const getStatusCounts = () => {
    const statusCounts: { [status: string]: number } = {};

    issues.forEach((issue) => {
      const { status } = issue;
      if (statusCounts[status]) {
        statusCounts[status]++;
      } else {
        statusCounts[status] = 1;
      }
    });

    return statusCounts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div>
      <h2 className="text-2xl text-gray-100 font-bold mb-2">Issues:</h2>
      <ul>
        {Object.entries(statusCounts).map(([status, count]) => (
          <li key={status} className="text-gray-100 text-2xl">
            {status}: {count} {count === 1 ? "issue" : "issues"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IssuesSummary;
