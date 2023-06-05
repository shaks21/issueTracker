interface User {
    username: string;
    email: string;
    password: string;
  }
  
  export default User;
  

// import { getDb } from "../utils/mongodb";

// interface User {
//   _id: string;
//   email: string;
//   password: string;
// }

// const UserModel = {
//   async findByEmail(email: string): Promise<User | null> {
//     const db = getDb();
//     const user = await db.collection("users").findOne({ email });
//     return user ? (user as User) : null;
//   },

//   async create(user: User): Promise<void> {
//     const db = getDb();
//     await db.collection("users").insertOne(user);
//   },
// };

// export default UserModel;
