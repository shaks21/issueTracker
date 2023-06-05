import { IssueType } from "../types/Issue";
import React, { useState } from "react";
import { useAtom } from "jotai";
import { tableViewAtom } from "../utils/Atoms";
import { sortOrderAtom } from "../utils/Atoms";
import { sortByAtom } from "../utils/Atoms";
import useLoggedInUser from "../hooks/useLoggedInUser";
import { connectToDatabase, disconnectFromDatabase } from "../utils/mongodb";
import router from "next/router";

type Props = {
  issues: IssueType[];
};

type SortOrder = "asc" | "desc";
type SortBy = string; //keyof IssueType;

const IssueList = ({ issues }: Props) => {
  const { loggedInUser, handleLogout } = useLoggedInUser();
  const [showComments, setShowComments] = useState(true || false);
  const [tableView, setTableView] = useAtom(tableViewAtom);
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom);
  const [sortBy, setSortBy] = useAtom(sortByAtom);
  const [showDetails, setShowDetails] = useState(false);
  const [newComment, setNewComment] = useState("");
  //const [newReply, setNewReply] = useState("");
  const [isReply, setIsReply] = useState(-1);
  const [isAddComment, setIsAddComment] = useState(0);
  const [clickedIssueId, setClickedIssueId] = useState(-1);
  const sortedIssues = React.useMemo(() => {
    const sortedArray = [...issues].sort((a, b) => {
      if (a[sortBy] === b[sortBy]) {
        return 0;
      } else if (sortOrder === "asc") {
        return a[sortBy] < b[sortBy] ? -1 : 1;
      } else {
        return a[sortBy] > b[sortBy] ? -1 : 1;
      }
    });

    return sortedArray;
  }, [issues, sortBy, sortOrder]);

  const handleSort = (key: SortBy) => {
    if (key === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const getSortArrow = (key: SortBy) => {
    if (key === sortBy) {
      if (sortOrder === "asc") {
        return <span>▲</span>; // Upward arrow for ascending order
      } else {
        return <span>▼</span>; // Downward arrow for descending order
      }
    }
    return null; // No arrow when the column is not selected for sorting
  };

  const getValue = (id: number) => {
    if (clickedIssueId === id) {
      return newComment;
    } else {
      return "";
    }

  };


  const handleCommentChange = (id: number) => {
    if (clickedIssueId !== id) {
      setNewComment("");
    }
    setClickedIssueId(id);
  };

  const handleReply = (issueId: number, commentId: number) => {
    if (!loggedInUser) {
      alert("You must be logged in to leave a comment.");
      return;
    }

    if (isReply === commentId && clickedIssueId === issueId) {
      // If the same comment is clicked again, reset the reply state
      setIsReply(-1);
      setIsAddComment(0); //enable add comment feature
      setNewComment("");
    } else {
      setIsReply(commentId); // Store the comment ID
      setClickedIssueId(issueId); // Store the issue ID
      setIsAddComment(-1); //disable add comment feature
    }
  };

  const handleCommentSubmit = async (
    issueId: number,
    commentId: number
    //isReplyToReply: boolean = false,
    //replyToReplyId: number = -1
  ) => {
    if (!loggedInUser) {
      alert("You must be logged in to leave a comment.");
      return;
    }
    // Check if the new comment is not empty
    if (newComment.trim() === "") {
      alert("Please enter a comment.");
      return;
    }

    try {
      const issue = sortedIssues.find((issue) => issue.id === issueId); // Find the specific issue to update
      if (!issue) {
        alert("Issue not found.");
        return;
      }

      // If new comment, add new comment to array of comments
      if (commentId === -1) {
        issue.comments = issue.comments || [];
        issue.comments.push({
          id: issue.comments.length + 1,
          user: loggedInUser.username,
          comment: newComment,
          replies: [],
        });
      } else {
        let commentIndex = issue.comments.findIndex(
          (comment) => comment.id === commentId
        ); // Find the index of the specific comment within the issue

        // if (isReplyToReply) {
        //   // If it's a reply to a reply, find the index of the parent reply
        //   const parentComment = issue.comments.find(
        //     (comment) => comment.id === commentId
        //   );

        //   if (parentComment && Array.isArray(parentComment.replies)) {
        //     commentIndex = parentComment.replies.findIndex(
        //       (reply) => reply.id === replyToReplyId
        //     );
        //   }
        // }

        if (commentIndex !== -1) {
          // if (isReplyToReply) {
          //   // If it's a reply to a reply, add the reply to the corresponding parent reply
          //   issue.comments[commentIndex].replies =
          //     issue.comments[commentIndex].replies || [];
          //   issue.comments[commentIndex].replies.push({
          //     id: replyToReplyId, // Use the same comment ID for the reply
          //     user: loggedInUser.username,
          //     comment: newComment,
          //   });
          // } else {

          // If it's a reply to the main comment, add the reply to the comment
          issue.comments[commentIndex].replies =
            issue.comments[commentIndex].replies || [];
          issue.comments[commentIndex].replies.push({
            id: commentId, // Use the same comment ID for the reply
            user: loggedInUser.username,
            comment: newComment,
          });
          // }
        }
      }

      const res = await fetch(`../api/issues`, {
        // Assuming there is an endpoint to update a specific issue
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          issue, // Pass the updated issue directly
          updateCommentsOnly: true, // Optional, depending on your server-side implementation
        }),
      });

      if (res.ok) {
        alert("Update successful");
        //setShowComments(!showComments);
        setIsReply(-1);
        setNewComment("");
        setIsAddComment(0);
      } else {
        alert("Update unsuccessful");
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const returnTableView = () => {
    return (
      <table className=" border-4 border border-slate-400 rounded-lg max-w-prose  shadow-md text-center">
        <thead>
          <tr className="bg-gray-600  text-white">
            <th className="py-2 w-full">#</th>
            <th className="py-2 w-full" onClick={() => handleSort("id")}>
              ID {getSortArrow("id")}
            </th>
            <th className="py-2 w-full" onClick={() => handleSort("title")}>
              Title {getSortArrow("title")}
            </th>
            <th
              className="py-2 w-full"
              onClick={() => handleSort("description")}
            >
              Description {getSortArrow("description")}
            </th>
            <th className="py-2 w-full" onClick={() => handleSort("status")}>
              Status {getSortArrow("status")}
            </th>
            <th className="py-2 w-full" onClick={() => handleSort("category")}>
              Category {getSortArrow("category")}
            </th>
            <th className="py-2 w-full" onClick={() => handleSort("priority")}>
              Priority {getSortArrow("priority")}
            </th>
            <th className="py-2 w-full" onClick={() => handleSort("date")}>
              Date {getSortArrow("date")}
            </th>
            <th className="py-2 w-full" onClick={() => handleSort("assignee")}>
              Assignee {getSortArrow("assignee")}
            </th>
            <th className="py-2 w-full">Comments</th>
          </tr>
        </thead>
        <tbody>
          {sortedIssues.map((issue, index) => (
            <React.Fragment key={issue.id}>
              <tr className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                <td className="py-4 px-4">{`${index + 1}`}</td>
                <td className="py-4 px-4">{issue.id}</td>
                <td className="py-4 px-4">{issue.title}</td>
                <td className="py-4 px-4">{issue.description}</td>
                <td className="py-4 px-4">{issue.status}</td>
                <td className="py-4 px-4">{issue.category}</td>
                <td className="py-4 px-4">{issue.priority}</td>
                <td className="py-4 px-4">
                  {new Date(issue.date).toLocaleDateString()}
                </td>
                <td className="py-4 px-4">
                  {Array.isArray(issue.assignee) &&
                    issue.assignee.map((user, index) => (
                      <p key={index} className="text-gray-600 text-sm">
                        <span className="font-bold">{user.user}</span>
                      </p>
                    ))}
                </td>
                <td className="py-4 px-4">
                  {Array.isArray(issue.comments) && (
                    <div>
                      <span
                        className="font-bold text-blue-600 cursor-pointer text-sm"
                        onClick={() => setShowComments((prev) => !prev)}
                      >
                        {showComments ? "Hide Comments" : "Show Comments"}
                      </span>
                    </div>
                  )}
                </td>
              </tr>
              {showComments &&
                issue.comments.map((comment) => (
                  <React.Fragment key={comment.id}>
                    <tr
                      key={comment.id}
                      className={index % 2 === 0 ? "bg-white" : " bg-gray-100"}
                    >
                      <td colSpan={10} className="py-4 px-4">
                        <div className="text-gray-600 mb-1 py-4 border rounded-lg shadow-md px-8 bg-blue-50 flex flex-row">
                          <span className="font-bold">
                            {comment.user}:&nbsp;
                          </span>{" "}
                          {comment.comment}
                          <button
                            className="text-blue-600  px-10"
                            onClick={() => {
                              handleReply(issue.id, comment.id);
                              setNewComment("");
                            }}
                          >
                            {isReply === comment.id &&
                            clickedIssueId === issue.id
                              ? "Cancel Reply"
                              : "Reply"}
                          </button>
                        </div>
                        {comment.replies &&
                          comment.replies.map((reply) => (
                            <tr
                              key={reply.id}
                              className={
                                index % 2 === 0 ? "bg-white" : " bg-gray-100"
                              }
                            >
                              <td colSpan={10} className="py-4 px-4">
                                <div className="text-gray-600 mb-1 py-4 border rounded-lg shadow-md px-8 bg-red-100 flex flex-row">
                                  <span className="font-bold">
                                    {reply.user}:&nbsp;
                                  </span>{" "}
                                  {reply.comment}
                                </div>
                              </td>
                            </tr>
                          ))}
                        {showComments &&
                          isReply === comment.id &&
                          clickedIssueId === issue.id && (
                            <tr
                              className={
                                index % 2 === 0 ? "bg-white" : " bg-gray-100"
                              }
                            >
                              <td colSpan={10} className="py-4 px-4">
                                <div className="text-gray-600 mb-1 space-x-4 py-4 border rounded-lg shadow-md px-8 bg-red-100 flex flex-row">
                                  <span className="font-bold">
                                    {loggedInUser? loggedInUser.username : ""}:&nbsp;
                                  </span>{" "}
                                  <textarea
                                    //type="text"
                                    value={newComment}
                                    onChange={(e) =>
                                      setNewComment(e.target.value)
                                    }
                                    className="w-full px-2 py-1 border rounded-lg shadow-md"
                                  />
                                  <button
                                    className="text-blue-600 px-10"
                                    onClick={() =>
                                      handleCommentSubmit(issue.id, comment.id)
                                    }
                                  >
                                    Add Reply
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              {showComments && isAddComment > -1 && (
                <tr className={index % 2 === 0 ? "bg-white" : " bg-gray-100"}>
                  <td colSpan={10} className="py-4 px-4">
                    <div className="text-gray-600 mb-1 space-x-4 items-center py-4 border rounded-lg shadow-md px-8 bg-green-50 flex flex-row">
                      <span className="font-bold">
                        {loggedInUser? loggedInUser.username : ""}:
                      </span>{" "}
                      <textarea
                        id={String(issue.id)}
                        value={getValue(issue.id)}
                        onClick={() => handleCommentChange(issue.id)}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full px-2 py-1 border rounded-lg shadow-md"
                      />
                      <button
                        className="text-blue-600 px-10"
                        onClick={() => handleCommentSubmit(issue.id, -1)}
                      >
                        Add Comment
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  };

  const returnNormalView = () => {

    return (
      <ul className="divide-y divide-gray-200">
        {sortedIssues.map((issue) => (
          <li key={issue.id} >
            <div className="py-4 border border-slate-800 bg-gray-50 rounded-lg shadow-md px-8">
            <div className="flex space-x-10 ">
              <h2 className="text-lg font-bold mb-2">{issue.id}</h2>
              <h2 className="text-lg font-bold mb-2">{issue.title}</h2>
            </div>

            {showDetails && (
              <>
                {issue.description && (
                  <p className="text-gray-600 mb-2 border-b pb-2">
                    {issue.description}
                  </p>
                )}
                {issue.status && (
                  <p className="text-gray-600 mb-2 border-b pb-2">
                    <span className="font-bold">Status:</span>{" "}
                    {issue.status}
                  </p>
                )}
                {issue.category && (
                  <p className="text-gray-600 mb-2 border-b pb-2">
                    <span className="font-bold">Category:</span>{" "}
                    {issue.category}
                  </p>
                )}
                {issue.date && (
                  <p className="text-gray-600 mb-2 border-b pb-2">
                    <span className="font-bold">Date:</span>{" "}
                    {new Date(issue.date).toLocaleDateString()}
                  </p>
                )}
                {issue.assignee && Array.isArray(issue.assignee) && (
                  <div className="border-b pb-2 flex">
                    <div>
                      <span className="font-bold">Assignee:&nbsp;</span>
                    </div>
                    <div>
                      {issue.assignee.map((user, index) => (
                        <p key={index} className="text-gray-600 mb-1 flex-col">
                          <span className="">{user.user}</span>{" "}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Display comments */}
                {issue.comments && Array.isArray(issue.comments) && (
                  <div>
                    <div className="border-b pb-2">
                      <span
                        className="font-bold text-blue-600 cursor-pointer"
                        onClick={() => setShowComments((prev) => !prev)}
                      >
                        {showComments ? "Hide Comments" : "Show Comments"}
                      </span>
                    </div>
                    {showComments && (
                      <ul className="divide-y divide-gray-200 mt-4 max-w-prose">
                        {issue.comments.map((comment, index) => (
                          <li key={index} className="py-2">
                            <p className="text-gray-600 break-all mb-1 py-4 border rounded-lg shadow-md px-8 bg-blue-50">
                              <span className="font-bold">{comment.user}:</span>{" "}
                              {comment.comment}
                              {/* Button to show/hide replies */}
                              <button
                                className="text-blue-600 mt-2 px-10"
                                onClick={() => {
                                  handleReply(issue.id, comment.id);
                                  setNewComment("");
                                }}
                              >
                                {isReply === comment.id &&
                                clickedIssueId === issue.id
                                  ? "Cancel Reply"
                                  : "Reply"}
                              </button>
                            </p>

                            {/* Display replies to the comment */}
                            {comment.replies &&
                              Array.isArray(comment.replies) && (
                                <ul className="divide-y divide-gray-200 mt-2">
                                  {comment.replies.map((reply, replyIndex) => (
                                    <li key={replyIndex} className="py-2 pl-4">
                                      <p className="text-gray-600 break-all mb-1 py-4 border rounded-lg shadow-md px-8 bg-gray-100">
                                        <span className="font-bold">
                                          {reply.user}:
                                        </span>{" "}
                                        {reply.comment}
                                      </p>
                                    </li>
                                  ))}
                                </ul>
                              )}

                            {/* Add reply form */}
                            {isReply === comment.id &&
                              clickedIssueId === issue.id && (
                                <div className="text-gray-600  mb-1 py-4 space-x-4 border rounded-lg shadow-md px-8 bg-gray-50 flex flex-row">
                                  <span className="font-bold">
                                    {loggedInUser? loggedInUser.username : ""}:&nbsp;
                                  </span>
                                  <textarea
                                    value={newComment}
                                    onChange={(e) =>
                                      setNewComment(e.target.value)
                                    }
                                    className="w-full px-2 py-1 border rounded-lg shadow-md"
                                  />
                                  <button
                                    className="text-blue-600 px-10"
                                    onClick={() =>
                                      handleCommentSubmit(issue.id, comment.id)
                                    }
                                  >
                                    Add Reply
                                  </button>
                                </div>
                              )}
                          </li>
                        ))}
                        {showComments && isAddComment > -1 && (
                          <div className="text-gray-600 space-x-4 items-center mb-1 py-4 border rounded-lg shadow-md px-8 bg-green-50 flex flex-row">
                            <span className="font-bold">
                              {loggedInUser? loggedInUser.username : ""}
                            </span>
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="w-full px-2 py-1 border rounded-lg shadow-md"
                            />
                            <button
                              className="text-blue-600 px-10"
                              onClick={() => handleCommentSubmit(issue.id, -1)}
                            >
                              Add Comment
                            </button>
                          </div>
                        )}
                      </ul>
                    )}
                  </div>
                )}
              </>
            )}

            <button
              className="text-blue-600 mt-2"
              onClick={() => setShowDetails((prev) => !prev)}
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return tableView ? returnTableView() : returnNormalView();
};

export default React.memo(IssueList);
