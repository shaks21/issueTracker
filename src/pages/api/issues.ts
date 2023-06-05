import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase, disconnectFromDatabase } from "../../utils/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db } = await connectToDatabase();

  switch (req.method) {
    case "GET": {
      const { status } = req.query;

      const query = status ? { status } : {};
      const issues = await db.collection("issues").find(query).toArray();

      const mappedIssues = issues.map((issue) => ({
        id: issue.id.toString(),
        title: issue.title,
        description: issue.description,
        status: issue.status,
        category: issue.category,
        priority: issue.priority,
        date: issue.date,
        assignee: issue.assignee,
        comments: issue.comments,
      }));

      res.status(200).json(mappedIssues);
      break;
    }

    case "POST": {
      const {
        title,
        description,
        status,
        category,
        priority,
        date,
        assignee,
        comments,
      } = req.body;

      // Find the maximum id value in the collection
      const issues = await db.collection("issues").find().toArray();
      const maxId = issues.reduce((acc, curr) => {
        return curr.id > acc ? curr.id : acc;
      }, 0);

      // Create a new issue object with the next id value
      const newIssue = {
        id: maxId + 1,
        title,
        description,
        status,
        category,
        priority,
        date,
        assignee,
        comments,
      };

      // Insert the new issue into the collection
      await db.collection("issues").insertOne(newIssue);

      res.status(201).json({ message: "Issue added successfully!" });
      break;
    }
    case "PUT": {
      try {
        const {
          id,
          title,
          description,
          status,
          category,
          priority,
          date,
          assignee,
          comments,
          updateCommentsOnly,
        } = req.body;
        console.log(req.body);
        console.log(title);

        if (updateCommentsOnly) {
          const {
            issue
          } = req.body;
          console.log(issue);

          // Update only the comments of the issue
          const result = await db.collection("issues").updateOne(
            { id: Number(issue.id) },
            {
              $set: { comments : issue.comments },
            }
          );

          if (result.modifiedCount > 0) {
            res.status(200).json({ message: "Comments updated successfully!" });
            console.log("Comments updated successfully!");
          } else {
            res.status(404).json({ message: "Issue not found." });
            console.log("Issue not found.");
          }
        } else {
          //Update all fields of the issue
          console.log(id);
          const result = await db.collection("issues").updateOne(
            { id: Number(id) },
            {
              $set: {
                title,
                description,
                status,
                category,
                priority,
                date,
                assignee,
                comments,
              },
            }
          );

          if (result.modifiedCount > 0) {
            res.status(200).json({ message: "Issue updated successfully!" });
            console.log("Issue updated successfully!");
          } else {
            res.status(404).json({ message: "Issue not found." });
            console.log("Issue not found.");            
          }
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
      }

      break;
    }
    case "DELETE": {
      const id = req.query.id as string;

      // Delete the issue from the collection
      const result = await db
        .collection("issues")
        .deleteOne({ id: Number(id) });

      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Issue deleted successfully!" });
      } else {
        res.status(404).json({ message: "Issue not found." });
      }
      break;
    }

    default: {
      res.status(405).json({ message: "Method not allowed." });
      break;
    }
  }
  
  await disconnectFromDatabase();

  
}

export { default as Issues } from "../../components/Issues";
