import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ClipboardList, CheckCircle, Clock, XCircle, Upload, Link as LinkIcon, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  instructions: string | null;
  rewardUsd: string;
  proofType: string;
  isActive: boolean;
  hasSubmitted: boolean;
  submission?: {
    id: string;
    status: string;
    proofData: string;
    adminNotes: string | null;
    submittedAt: string;
  };
}

export default function TasksPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [proofUrl, setProofUrl] = useState("");
  const [proofText, setProofText] = useState("");
  const [screenshotLinks, setScreenshotLinks] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    enabled: !!user,
  });

  const submitMutation = useMutation({
    mutationFn: async ({ taskId, proofUrl, proofText, screenshotLinks }: { taskId: string; proofUrl: string; proofText: string; screenshotLinks: string }) => {
      await apiRequest("POST", `/api/tasks/${taskId}/submit`, { proofUrl, proofText, screenshotLinks });
    },
    onSuccess: () => {
      toast({ title: "Task submitted!", description: "Your submission is pending review." });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setDialogOpen(false);
      setProofUrl("");
      setProofText("");
      setScreenshotLinks("");
      setSelectedTask(null);
    },
    onError: (error: Error) => {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
    },
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Tasks</h1>
        <p className="text-muted-foreground mb-6">Please log in to access tasks.</p>
        <Link href="/login">
          <Button data-testid="button-login">Log In</Button>
        </Link>
      </div>
    );
  }

  const getStatusBadge = (submission: Task["submission"]) => {
    if (!submission) return null;
    switch (submission.status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  const getProofIcon = (type: string) => {
    switch (type) {
      case "screenshot":
        return <Upload className="h-4 w-4" />;
      case "link":
        return <LinkIcon className="h-4 w-4" />;
      case "username":
        return <User className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getProofLabel = (type: string) => {
    switch (type) {
      case "screenshot":
        return "Screenshot URL (upload to Imgur or similar)";
      case "link":
        return "Profile/Post Link";
      case "username":
        return "Username";
      default:
        return "Proof";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/earn" className="text-primary hover:underline text-sm mb-2 inline-block">
          ← Back to Earn
        </Link>
        <h1 className="text-3xl font-bold mb-2">Tasks</h1>
        <p className="text-muted-foreground">Complete tasks and submit proof to earn rewards.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Tasks Available</h3>
            <p className="text-muted-foreground">
              Check back later for new tasks.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="hover-elevate">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <CardDescription>{task.description}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      ${parseFloat(task.rewardUsd).toFixed(2)}
                    </Badge>
                    {task.hasSubmitted && getStatusBadge(task.submission)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {task.instructions && (
                  <div className="mb-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Instructions:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task.instructions}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getProofIcon(task.proofType)}
                    <span>Proof required: {task.proofType}</span>
                  </div>
                  
                  {task.hasSubmitted ? (
                    <div className="text-sm">
                      {task.submission?.status === "rejected" && task.submission.adminNotes && (
                        <p className="text-red-500">Note: {task.submission.adminNotes}</p>
                      )}
                    </div>
                  ) : (
                    <Dialog open={dialogOpen && selectedTask?.id === task.id} onOpenChange={(open) => {
                      setDialogOpen(open);
                      if (!open) {
                        setSelectedTask(null);
                        setProofUrl("");
                        setProofText("");
                        setScreenshotLinks("");
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => setSelectedTask(task)}
                          data-testid={`button-submit-task-${task.id}`}
                        >
                          Submit Proof
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Submit Task Proof</DialogTitle>
                          <DialogDescription>
                            Submit proof for: {task.title}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label htmlFor="proofUrl">Profile/Post Link</Label>
                            <Input
                              id="proofUrl"
                              placeholder="https://example.com/your-profile"
                              value={proofUrl}
                              onChange={(e) => setProofUrl(e.target.value)}
                              data-testid="input-proof-url"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Paste the link to your profile or post here.
                            </p>
                          </div>
                          
                          <div>
                            <Label htmlFor="proofText">Additional Information</Label>
                            <Textarea
                              id="proofText"
                              placeholder="Your username, additional notes, or any other proof text..."
                              value={proofText}
                              onChange={(e) => setProofText(e.target.value)}
                              data-testid="input-proof-text"
                              className="min-h-[80px]"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="screenshotLinks">Screenshot Proof Links</Label>
                            <Textarea
                              id="screenshotLinks"
                              placeholder="https://i.ibb.co/xxx, https://postimg.cc/xxx"
                              value={screenshotLinks}
                              onChange={(e) => setScreenshotLinks(e.target.value)}
                              data-testid="input-screenshot-links"
                              className="min-h-[60px]"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Please submit your proof screenshots using imgbb.com or postimages.org.
                              If you have more than one proof, put a comma between the links.
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={() => task && submitMutation.mutate({ 
                              taskId: task.id, 
                              proofUrl, 
                              proofText,
                              screenshotLinks 
                            })}
                            disabled={(!proofUrl && !proofText && !screenshotLinks) || submitMutation.isPending}
                            data-testid="button-confirm-submit"
                          >
                            {submitMutation.isPending ? "Submitting..." : "Submit"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
