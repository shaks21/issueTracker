export type IssueType = {
  id: number;
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Closed";
  category: string;
  priority: string;
  date: string;
  assignee: {
    user: string;
  }[];
  comments: {
    id: number;
    user: string;
    comment: string;
    replies: {
      id: number;
      user: string;
      comment: string;
    }[];
  }[];
  [key: string]: any;
};
// export type IssueType = {
//   id: number;
//   title: string;
//   description: string;
//   status: "Open" | "In Progress" | "Closed";
//   category: string;
//   priority: string;
//   date: string;
//   assignee: {
//         user: string;
//       }[];
//   comments: CommentType[];
// };

// export type CommentType = {
//   id: number;
//   user: string;
//   comment: string;
//   replies: ReplyType[];
// };

// export type ReplyType = {
//   id: number;
//   user: string;
//   comment: string;
// };
