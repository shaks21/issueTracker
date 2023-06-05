import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../utils/mongodb';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { db } = await connectToDatabase();

    switch (req.method) {
      case "GET": {
        const { status } = req.query;
  
        const query = status ? { status } : {};
        const issues = await db.collection("users").find(query).toArray();
  
        const mappedUsers = issues.map((user) => ({           
          username: user.username,
          email: user.email,
          password: user.password,
        }));
        //console.log(mappedUsers);
        res.status(200).json(mappedUsers);
        break;
      }
    }
}
