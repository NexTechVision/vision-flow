
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { teams, users } from "../data/mockData";
import { Plus, MoreHorizontal, Users, Settings } from "lucide-react";
import Avatar from "../components/Avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Layout from "../components/Layout";

const Teams = () => {
  return (
    <Layout>
      <Helmet>
        <title>Teams | NexTechVision</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
            <p className="text-muted-foreground">
              Manage your teams and members
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card key={team.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{team.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Users className="h-4 w-4 mr-2" />
                        Manage Members
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Team Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Delete Team
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>{team.description || "No description provided"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Team Members</h4>
                    <div className="flex -space-x-2">
                      {team.members.slice(0, 5).map((member) => (
                        <div key={member.id} className="relative">
                          <Avatar user={member} size="sm" />
                        </div>
                      ))}
                      {team.members.length > 5 && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-medium">
                          +{team.members.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Projects</h4>
                    {team.projects.length > 0 ? (
                      <div className="space-y-1">
                        {team.projects.map((projectId) => {
                          const project = { name: "NexTechVision Development" }; // Mock project data
                          return (
                            <div key={projectId} className="text-sm px-2 py-1 bg-muted rounded-md">
                              {project.name}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No projects assigned</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 justify-between">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
                <Button size="sm">
                  Manage Team
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1">Create a New Team</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Add members and collaborate on projects together
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Teams;
