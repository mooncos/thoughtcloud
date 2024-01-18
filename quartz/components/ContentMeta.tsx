import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"


interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  hideReadingTime: boolean
}

const defaultOptions: ContentMetaOptions = {
  hideReadingTime: false,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: string[] = []

      if (fileData.dates) {
        segments.push(formatDate(getDate(cfg, fileData)!))
      }

      // Hide reading time if enabled
      if (options.hideReadingTime == false) {
        const { text: timeTaken, words: _words } = readingTime(text)
        segments.push(timeTaken)
      }

      return <p class={`content-meta ${displayClass ?? ""}`}>{segments.join(", ")}</p>
    } else {
      return null
    }
  }

  ContentMetadata.css = `
  .content-meta {
    margin-top: 0;
    color: var(--gray);
  }
  `
  return ContentMetadata
}) satisfies QuartzComponentConstructor
