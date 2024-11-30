// @ts-ignore
import clipboardScript from "./scripts/clipboard.inline"
import clipboardStyle from "./styles/clipboard.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Body: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return <main id="quartz-body">{children}</main>
}

Body.afterDOMLoaded = clipboardScript
Body.css = clipboardStyle

export default (() => Body) satisfies QuartzComponentConstructor
