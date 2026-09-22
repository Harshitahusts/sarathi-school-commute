import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login, { type UserProfile } from "./pages/Login";

function Router({ profile }: { profile: UserProfile }) {
  return (
    <Switch>
      <Route path="/">
        <Home firstName={profile.firstName} />
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function readProfile(): UserProfile | null {
  try {
    const saved = window.localStorage.getItem("sarathi-profile");
    if (!saved) return null;
    const profile = JSON.parse(saved) as Partial<UserProfile>;
    return profile.firstName &&
      profile.lastName &&
      profile.mobile &&
      profile.email
      ? (profile as UserProfile)
      : null;
  } catch {
    return null;
  }
}

function App() {
  const [profile, setProfile] = useState<UserProfile | null>(readProfile);

  const completeLogin = (nextProfile: UserProfile) => {
    window.localStorage.setItem("sarathi-profile", JSON.stringify(nextProfile));
    setProfile(nextProfile);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          {profile ? (
            <Router profile={profile} />
          ) : (
            <Login onComplete={completeLogin} />
          )}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
