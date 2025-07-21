import NavBar from "~/components/NavBar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants"
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CVlop" },
    { name: "Analyze our resume", content: "Opensource web app to help student and others analyzing resume by AI" },
  ];
}

export default function Home() {
  function callbackfn(resumes: any): any {
    throw new Error("Function not implemented.");
  }

  const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated])
  return <main>
    <NavBar/>
    <section className="main-section">
      <div className="page-heading">
        <h1>Track Your Resume Ratings</h1>
        <h2>Review your submissions and check AI powered feedback.</h2>
      </div>
    {resumes.length > 0 && (
      <div className="resumes-section">
    {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
    ))}
    </div>
    )}
    
    </section>
  </main> ;
}
