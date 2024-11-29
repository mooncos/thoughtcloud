import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Header: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return children.length > 0 ? <header>{children}</header> : <header className={"empty"}></header>
}

Header.css = `
header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem 2rem;
  gap: 1.5rem;
}

header h1 {
  margin: 0;
  flex: auto;
}
`

export default (() => Header) satisfies QuartzComponentConstructor
