import fs from "fs"
import path from "path"
import { DateTime, DateTimeOptions } from "luxon"
import { Repository } from "@napi-rs/simple-git"
import { QuartzTransformerPlugin } from "../types"
import chalk from "chalk"

export interface Options {
  priority: ("frontmatter" | "git" | "filesystem")[]
}

const defaultOptions: Options = {
  priority: ["frontmatter", "git", "filesystem"],
}

function parseDateString(fp: string, d: string | number | unknown): DateTime<true> | undefined {
  // handle cases where frontmatter property is a number (e.g. YYYYMMDD or even just YYYY)
  if (d == null) return
  if (typeof d === "number") d = d.toString()
  if (typeof d !== "string") {
    console.log(
      chalk.yellow(`\nWarning: unexpected type (${typeof d}) for date "${d}" in \`${fp}\`.`),
    )
    return
  }
  // Luxon is stricter about the format of the date string
  // so fallback to the `Date` object only if parsing as ISO8601 or RFC2822 fails
  const dt = [
    DateTime.fromISO,
    DateTime.fromRFC2822,
    (s: string, opts: DateTimeOptions) => DateTime.fromJSDate(new Date(s), opts),
  ]
    .values()
    .map((f) => {
      try {
        return f(d, { setZone: true })
      } catch {}
    })
    // find the first parseable date (Luxon is strict so invalid parseable dates don't need a fallback)
    .find((dt) => dt)
  if (dt == null || !dt.isValid) {
    console.log(
      chalk.yellow(
        `\nWarning: found invalid date "${d}" in \`${fp}\`. Supported formats: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format`,
      ),
    )
    return
  }
  return dt
}

export const CreatedModifiedDate: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "CreatedModifiedDate",
    markdownPlugins() {
      return [
        () => {
          let repo: Repository | undefined = undefined
          return async (_tree, file) => {
            let created: DateTime | undefined = undefined
            let modified: DateTime | undefined = undefined
            let published: DateTime | undefined = undefined

            const fp = file.data.filePath!
            const fullFp = path.isAbsolute(fp) ? fp : path.posix.join(file.cwd, fp)
            for (const source of opts.priority) {
              if (source === "filesystem") {
                const st = await fs.promises.stat(fullFp)
                created ||= DateTime.fromMillis(st.birthtimeMs)
                modified ||= DateTime.fromMillis(st.mtimeMs)
              } else if (source === "frontmatter" && file.data.frontmatter) {
                created ||= parseDateString(fp, file.data.frontmatter.date)
                modified ||= parseDateString(fp, file.data.frontmatter.lastmod)
                modified ||= parseDateString(fp, file.data.frontmatter.updated)
                modified ||= parseDateString(fp, file.data.frontmatter["last-modified"])
                published ||= parseDateString(fp, file.data.frontmatter.publishDate)
              } else if (source === "git") {
                if (!repo) {
                  // Get a reference to the main git repo.
                  // It's either the same as the workdir,
                  // or 1+ level higher in case of a submodule/subtree setup
                  repo = Repository.discover(file.cwd)
                }

                try {
                  modified ||= DateTime.fromMillis(
                    await repo.getFileLatestModifiedDateAsync(file.data.filePath!),
                  )
                } catch {
                  console.log(
                    chalk.yellow(
                      `\nWarning: ${file.data
                        .filePath!} isn't yet tracked by git, last modification date is not available for this file`,
                    ),
                  )
                }
              }
            }

            file.data.dates = {
              created: created ?? DateTime.now(),
              modified: modified ?? DateTime.now(),
              published: published ?? DateTime.now(),
            }
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    dates: {
      created: DateTime
      modified: DateTime
      published: DateTime
    }
  }
}
