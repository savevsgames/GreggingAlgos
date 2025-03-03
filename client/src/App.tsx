import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/Navigation";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/hooks/use-theme";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import TopicPage from "@/pages/TopicPage";
import AuthPage from "@/pages/AuthPage";
import DiscussionsPage from "@/pages/DiscussionsPage";
import ProfilePage from "@/pages/ProfilePage"; // Added import

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={Home} />
      <ProtectedRoute path="/topic/:slug" component={TopicPage} />
      <ProtectedRoute path="/discussions" component={DiscussionsPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} /> {/* Added route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Navigation />
          <main>
            <Router />
          </main>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;