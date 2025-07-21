import NavBar from "~/components/NavBar";
import type { Route } from "./+types/home";


export function meta({}: Route.MetaArgs) {
  return [

    { title: "CVlop" },
    { name: "Analyze our resume", content: "Opensource web app to help student and others analyzing resume by AI" },

  ];
}

export default function Home() {
  return <main>


    <NavBar/>
    <section className="main-section">
      <div className="page-heading">
        <h1>Track Your Resume Ratings</h1>
        <h2>Review your submissions and check AI powered feedback.</h2>
      </div>
    </section>
  </main> ;

}
