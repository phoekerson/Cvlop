import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <main>
    <section className="main-section">
      <div className="page-heading">
        <h1>Track Your Resume Ratings</h1>
        <h2>Review your submissions and check AI powered feedback.</h2>
      </div>
    </section>
  </main> ;
}
