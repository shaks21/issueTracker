import type { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import Issues from "../components/Issues";
import Login from "./login";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { issuesAtom } from "../utils/Atoms";
import { usersAtom } from "../utils/Atoms";

const Index: NextPage = () => {
  const [issues, setIssues] = useAtom(issuesAtom);
  const [users, setUsers] = useAtom(usersAtom);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`../api/issues`);
      const data = await res.json();
      setIssues(data);
      const res2 = await fetch(`../api/users`);
      const data2 = await res2.json();
      setUsers(data2);
    };

    fetchData();
  }, [setIssues, setUsers]);

  return (
    <>
      <Layout>
        <div className="flex flex-col justify-center min-h-screen py-4">
          <Issues />
        </div>
      </Layout>
    </>
  );
};

export default Index;
