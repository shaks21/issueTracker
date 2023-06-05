import type { NextPage } from 'next';
import Layout from '../components/Layout';
import NewIssue from '../components/NewIssue';

const NewIssuePage: NextPage = () => {
  
  return (
    <Layout>
      <NewIssue />
    </Layout>
  );
};    

export default NewIssuePage;
