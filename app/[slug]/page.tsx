import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionaries, getDictionary } from "@/lib/dictionaries";
import EntryList from "./EntryList";

export const dynamicParams = false;

export function generateStaticParams() {
  return getDictionaries().map((d) => ({ slug: d.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = getDictionary((await params).slug);
  return { title: d ? `${d.title} · Dictionaries` : "Dictionaries", description: d?.description };
}

export default async function DictionaryPage({ params }: Props) {
  const d = getDictionary((await params).slug);
  if (!d) notFound();
  return (
    <main>
      <nav><Link href="/">← All dictionaries</Link></nav>
      <h1>{d.title}</h1>
      {d.subtitle && <p className="subtitle">{d.subtitle}</p>}
      {d.author && <p className="author">by {d.author}</p>}
      {d.foreword && (
        <section className="foreword" aria-label="Foreword">
          <h2>Foreword</h2>
          {d.foreword.trim().split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
        </section>
      )}
      <EntryList entries={d.entries} />
    </main>
  );
}
