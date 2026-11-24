import Link from "next/link";
import { getDictionaries } from "@/lib/dictionaries";

export default function Home() {
  const dictionaries = getDictionaries();
  return (
    <main>
      <h1>Dictionaries</h1>
      <ul className="dictionary-list">
        {dictionaries.map((d) => (
          <li key={d.slug}>
            <Link href={`/${d.slug}`}>{d.title}</Link>
            {d.description && <p>{d.description}</p>}
          </li>
        ))}
      </ul>
    </main>
  );
}
