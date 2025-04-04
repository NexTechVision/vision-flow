
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Dashboard from "./Dashboard";
import { Helmet } from "react-helmet";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <Helmet>
        <title>Dashboard | VisionFlow</title>
      </Helmet>
      <div className="p-6 md:p-8">
        <Dashboard />
      </div>
    </Layout>
  );
};

export default Index;
