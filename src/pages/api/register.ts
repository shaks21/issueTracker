import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../utils/mongodb";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { db } = await connectToDatabase();
  const usersCollection = db.collection("users");

  const existingEmail = await usersCollection.findOne({
    email: { $regex: new RegExp("^" + email + "$", "i") },
  });
  if (existingEmail) {
    return res.status(409).json({ message: "User already exists" });
  }

  const existingUser = await usersCollection.findOne({
    username: { $regex: new RegExp("^" + username + "$", "i") },
  });
  if (existingUser) {
    return res
      .status(409)
      .json({
        message: 'Username "' + username + '" taken. Please try something else',
      });
  }

  try {
    const result = await usersCollection.insertOne({
      username,
      email,
      password: hashedPassword,
    });

    const user = result.insertedId;

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating new user" });
  }
}
