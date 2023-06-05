import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { IssueType } from "../types/Issue";
import useLoggedInUser from "../hooks/useLoggedInUser";
import { useAtom } from "jotai";
import { issuesAtom } from "../utils/Atoms";
import { usersAtom } from "../utils/Atoms";
import User from "@/types/user.model";

const EditIssue = () => {
  const { loggedInUser, handleLogout } = useLoggedInUser();
  const [issues, setIssues] = useAtom(issuesAtom);
  const [users, setUsers] = useAtom(usersAtom);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<IssueType["status"]>("Open");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState("");
  const [assignee, setAssignee] = useState<{ user: string }[]>([]);
  const [comments, setComments] = useState<
    { id: number; user: string; comment: string; replies: any }[]
  >([]);
  //const [issueList, setIssueList] = useState<IssueType[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    if (issues.length < 1 || users.length < 1) {
      try {
        const res = await fetch("../api/issues");
        if (res.ok) {
          const issues: IssueType[] = await res.json();
          setIssues(issues);
        } else {
          throw new Error("Network response was not ok");
        }

        const res2 = await fetch("../api/users");
        if (res2.ok) {
          const users: User[] = await res2.json();
          setUsers(users);
        } else {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Error:", error);
        // You can display the error message to the user or handle it in any other way you see fit.
      }
    }
  };

  const handleIdChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = event.target.value;
    if (selectedId) {
      const issue = issues.find(
        (issue: IssueType) => issue.id.toString() === selectedId
      );
      if (issue) {
        setId(issue.id.toString());
        setTitle(issue.title);
        setDescription(issue.description);
        setStatus(issue.status);
        setCategory(issue.category);
        setPriority(issue.priority);
        setDate(issue.date);
        setAssignee(issue.assignee);
        setComments(issue.comments);
      }
    }
  };

  const handleDelete = async () => {
    if (!loggedInUser) {
      alert("You must be logged in to update an issue.");
      return;
    }
    // alert(loggedInUser);
    if (confirm("Are you sure you want to delete this issue?")) {
      try {
        const res = await fetch(`../api/issues?id=${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          alert("delete successful");
          //router.push("/");
          router.reload();
        } else {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!loggedInUser) {
      alert("You must be logged in to update an issue.");
      return;
    }
    // alert(loggedInUser);

    const issue: IssueType = {
      id: parseInt(id),
      title,
      description,
      status,
      category,
      priority,
      date,
      assignee,
      comments,
    };
    try {
      const res = await fetch(`../api/issues`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(issue),
      });
      //alert(JSON.stringify(issue));
      if (res.ok) {
        alert("Update successful");
        //router.push("/");
        router.reload();
      } else {
        alert("Update unsuccessful");

        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error:", error);
      //alert(error);
      // You can display the error message to the user or handle it in any other way you see fit.
    }
  };

  const handleAssigneeChange =
    (index: number) => (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newAssignees = [...assignee];
      newAssignees[index] = { user: event.target.value };
      setAssignee(newAssignees);
    };

  // const handleAssigneeChange =
  //   (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
  //     const newAssignees = [...assignee];
  //     newAssignees[index] = { user: event.target.value };
  //     setAssignee(newAssignees);
  //   };

  const handleAddAssignee = () => {
    setAssignee([...assignee, { user: "" }]);
  };

  const handleRemoveAssignee = (index: number) => () => {
    const newAssignees = [...assignee];
    newAssignees.splice(index, 1);
    setAssignee(newAssignees);
  };

  // const handleAddComment = () => {
  //   setComments([...comments, { user:"", comment: "" }]);
  // };

  const handleRemoveComment = (index: number) => () => {
    const newComments = [...comments];
    newComments.splice(index, 1);
    setComments(newComments);
  };

  const handleRemoveReply = (commentIndex: number, replyIndex: number) => () => {
    const newComments = [...comments];
    const replies = [...newComments[commentIndex].replies];
    replies.splice(replyIndex, 1);
    newComments[commentIndex].replies = replies;
    setComments(newComments);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit Issue:</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="id">
              Select Issue:
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="id"
              name="id"
              value={id}
              onChange={handleIdChange}
            >
              <option value="">Select an issue</option>
              {issues.map((issue: IssueType) => (
                <option key={issue.id} value={issue.id}>
                  {issue.id + ": " + issue.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="title"
            >
              Title:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="description"
            >
              Description:
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="status"
            >
              Status:
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as IssueType["status"])}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="category"
            >
              Category:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="category"
              type="text"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="priority"
            >
              Priority:
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="date"
            >
              Date:
            </label>
            <input
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="assignee"
            >
              Assignee:
            </label>
            {assignee.map((assigneeUser, index) => (
              <div key={index} className="flex items-center mb-2">
                {/* <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder={`Assignee ${index + 1}`}
                  value={assigneeUser.user}
                  onChange={handleAssigneeChange(index)}
                  required
                /> */}
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="id"
                  name="id"
                  value={assigneeUser.user}
                  onChange={handleAssigneeChange(index)}
                  required
                >
                  <option value="">Select a user</option>
                  {users.map((user: User) => (
                    <option key={user.username} value={user.username}>
                      {user.username + ": " + user.email}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleRemoveAssignee(index)}
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              onClick={handleAddAssignee}
            >
              Add Assignee
            </button>
          </div>
          <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="comments"
          >
            Comments:
          </label>
          {comments.map((comment, commentIndex) => (
            <div>
            <div key={comment.id} className="flex items-center mb-2 ">
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-blue-50 leading-tight focus:outline-none focus:shadow-outline"
                disabled
                value={comment.user + ": " + comment.comment}
              />
              <button
                type="button"
                className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                onClick={handleRemoveComment(commentIndex)}
              >
                X
              </button>              
            </div>
            <div className="ml-4">
                {comment.replies && comment.replies.map((reply : any, replyIndex : any) => (
                  <div key={reply.id} className="flex items-center mb-2">
                    <textarea
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-red-50 leading-tight focus:outline-none focus:shadow-outline"
                      disabled
                      value={reply.user + ": " + reply.comment}
                    />
                    <button
                      type="button"
                      className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      onClick={handleRemoveReply(commentIndex, replyIndex)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="comments"
            >
              Comments:
            </label>
            {comments.map((comment, index) => (
              <div key={index} className="flex items-center mb-2">
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled
                  value={comment.user + ": " + comment.comment}
                />
                <button
                  type="button"
                  className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleRemoveComment(index)}
                >
                  X
                </button>
              </div>
            ))} */}
            
            {/* <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              onClick={handleAddComment}
            >
              Add Comment
            </button> */}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Save Changes
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIssue;
