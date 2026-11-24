# Dictionaries

Personal glossaries hosted at https://dictionaries.deltadelta.dev. Each dictionary collects the terms I know in one field (for example, software engineering).

Built with Next.js (static export) and served by Cloudflare Workers. Every push to `main` deploys automatically.

## Adding a word

Open the dictionary file in `dictionaries/` and add a block anywhere in the file. Order does not matter: the site sorts words alphabetically.

```toml
["Ralph Loop"]
definition = "A bash for loop that ..."
```

A draft word with no definition yet is just the header: `["Some Term"]`.

Quote the word in the brackets if it contains spaces or punctuation. Use `"""` for text that spans several lines.

## Adding a dictionary

Create a new file `dictionaries/<name>.toml`. The file name becomes the URL (`/<name>`), so use only lowercase letters, numbers and hyphens. The only required field is `title`.

## Fields

Dictionary fields go at the top of the file, before the first word.

| Field | Required | Shown on site | Purpose |
| --- | --- | --- | --- |
| `title` | yes | yes | Dictionary name |
| `subtitle` | no | yes | Subtitle |
| `author` | no | yes | Author name |
| `description` | no | yes (index page) | One-line summary |
| `foreword` | no | yes | Foreword. Blank lines separate paragraphs. |
| `preface`, `afterword` | no | not yet | Extra front/back matter for a book |
| `edition`, `publisher`, `published`, `language`, `copyright`, `license`, `isbn` | no | not yet | Book metadata |

Word fields:

| Field | Required | Purpose |
| --- | --- | --- |
| `definition` | no | Short definition. Leave it out for a draft word: the card shows "Definition coming soon." |
| `extended_def` | no | Longer explanation |
| `etymology` | no | Origin. A URL is shown as a link. |
| `pronunciation` | no | Pronunciation |
| `part_of_speech` | no | For example `noun` |
| `see_also` | no | List of related words, e.g. `["Agent"]` |

Unknown fields stop the build with an error that names the file and word, so typos never reach the live site.

## Development

```bash
npm install
npm run dev        # local dev server
npm run build      # static build to out/
npm run lint
npm run test:e2e   # end-to-end tests (Playwright) against test fixtures
```
