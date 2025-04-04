
import { Helmet } from "react-helmet";
import Layout from "../components/Layout";

const MyTasks = () => {
  return (
    <Layout>
      <div className="p-4 md:p-6">
        <Helmet>
          <title>My Tasks | NexTechVision</title>
        </Helmet>
        <h1 className="text-3xl font-bold tracking-tight mb-6">My Tasks</h1>
        
        {/* Task content would go here */}
        <div className="bg-card rounded-md border shadow-sm p-6">
          <p className="text-muted-foreground">Your tasks will appear here.</p>
        </div>
      </div>
    </Layout>
  );
};

export default MyTasks;
