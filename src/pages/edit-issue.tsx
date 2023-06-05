import type { NextPage } from 'next';
import Layout from '../components/Layout';
import EditIssue from '../components/EditIssue';

const EditIssuePage: NextPage = () => {
  return (
    <Layout>
      <EditIssue />
    </Layout>
  );
};    

export default EditIssuePage;
