"use client";

import { useMemo, useState } from "react";
import type { Entry } from "@/lib/dictionaries";

const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });

function anchor(term: string) {
  return term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function EntryList({ entries }: { entries: Entry[] }) {
  const [query, setQuery] = useState("");
  const [ascending, setAscending] = useState(true);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? entries.filter((e) =>
          [e.term, e.definition ?? "", e.extended_def ?? ""].some((s) => s.toLowerCase().includes(q)),
        )
      : entries;
    return [...filtered].sort((a, b) => (ascending ? 1 : -1) * collator.compare(a.term, b.term));
  }, [entries, query, ascending]);

  return (
    <>
      <div className="controls">
        <input
          type="search"
          placeholder="Search words and definitions"
          aria-label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          aria-label="Sort"
          value={ascending ? "asc" : "desc"}
          onChange={(e) => setAscending(e.target.value === "asc")}
        >
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </select>
      </div>
      <p className="count" aria-live="polite">
        {shown.length} of {entries.length} {entries.length === 1 ? "word" : "words"}
      </p>
      <div className="entries">
        {shown.map((e) => (
          <article className="card" key={e.term} id={anchor(e.term)}>
            <h3>{e.term}</h3>
            {(e.pronunciation || e.part_of_speech) && (
              <p className="meta">
                {[e.pronunciation, e.part_of_speech].filter(Boolean).join(" · ")}
              </p>
            )}
            {e.definition ? (
              <p className="definition">{e.definition}</p>
            ) : (
              <p className="draft">Definition coming soon.</p>
            )}
            {e.extended_def && <p className="extended">{e.extended_def}</p>}
            {e.etymology && (
              <>
              <hr />
              <p className="etymology">
                Etymology:{" "}
                {/^https?:\/\//.test(e.etymology) ? (
                  <a href={e.etymology} target="_blank" rel="noreferrer">{e.etymology}</a>
                ) : (
                  e.etymology
                )}
              </p>
              </>
            )}
            {e.see_also && e.see_also.length > 0 && (
              <p className="see-also">
                See also:{" "}
                {e.see_also.map((s, i) => (
                  <span key={s}>{i > 0 && ", "}<a href={`#${anchor(s)}`}>{s}</a></span>
                ))}
              </p>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
