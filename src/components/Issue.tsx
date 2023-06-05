// import { IssueType } from "../types/Issue";

// type Props = {
//   issue: IssueType;
// };

// const Issue = ({ issue }: Props) => {
//   return (
//     <div className="bg-white overflow-hidden shadow rounded-lg">
//       <div className="px-4 py-5 sm:p-6">
//         <h2 className="text-xl font-semibold text-gray-800">{issue.title}</h2>
//         <p className="mt-1 text-md text-gray-600">{issue.description}</p>
//         <p className="mt-1 text-sm text-gray-600">{issue.status}</p>        
//         <p>{issue.category}</p>
//         <p>{issue.priority}</p>
//         <p>{issue.assignee.user}</p>
//         <p>{issue.assignee.email}</p>
//         <ul>
//           {issue.comments.map((comment, index) => (
//             <li key={index}>
//               <p>{comment.user}</p>
//               <p>{comment.comment}</p>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Issue;
