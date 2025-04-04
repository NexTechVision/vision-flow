
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Dashboard from "./Dashboard";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="p-4 md:p-6">
        <Dashboard />
      </div>
    </Layout>
  );
};

export default Index;
