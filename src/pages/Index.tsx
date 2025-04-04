
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Dashboard from "./Dashboard";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Index;
