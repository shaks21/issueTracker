import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IssueType } from "../types/Issue";
import useLoggedInUser from "../hooks/useLoggedInUser";
import { useAtom } from "jotai";
import { usersAtom } from "../utils/Atoms";
import User from "@/types/user.model";

const NewIssue = () => {
  const { loggedInUser, handleLogout } = useLoggedInUser();
  const [users, setUsers] = useAtom(usersAtom);
  const [id, setId] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<IssueType["status"]>("Open");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState("");
  const [assignee, setAssignee] = useState<{ user: string }[]>([]);

  const [comments, setComments] = useState<
    { id: number; user: string; comment: string; replies: [] }[]
  >([]);

  const router = useRouter();

 const fetchIssues = useCallback(async () => {
  if (users.length < 1) {
    try {
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
}, [users.length, setUsers]);

useEffect(() => {
  fetchIssues();
}, [fetchIssues]);

  

  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!loggedInUser) {
      alert("You must be logged in to submit an issue.");
      return;
    }

    const issue: IssueType = {
      id,
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
      const res = await fetch("../api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(issue),
      });
      if (res.ok) {
        alert("Issue created successfully");
        router.push("/");
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error:", error);
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

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">Add New Issue:</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="description"
            >
              Description:
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="status"
            >
              Status:
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as IssueType["status"])
              }
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
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="comments"
              onChange={(event) =>
                setComments([
                  {
                    id: 1,
                    user: loggedInUser?.username,
                    comment: event.target.value,
                    replies: [],
                  },
                ])
              }
            />
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewIssue;
