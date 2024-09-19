import { QuartzTransformerPlugin } from "../types"

export interface CommonMarkOptions {
  option1: Boolean
}

const defaultCommonMarkOptions: CommonMarkOptions = {
  option1: true,
}

export interface CustomOptions {
  option1: Boolean
}

const defaultCustomOptions: CustomOptions = {
  option1: true,
}

export interface GitHubOptions {
  enableSmartyPants: boolean
  linkHeadings: boolean
}

const defaultGitHubOptions: GitHubOptions = {
  enableSmartyPants: true,
  linkHeadings: true,
}

export interface ObsidianOptions {
  comments: boolean
  highlight: boolean
  wikilinks: boolean
  callouts: boolean
  mermaid: boolean
  parseTags: boolean
  parseArrows: boolean
  parseBlockReferences: boolean
  enableInHtmlEmbed: boolean
  enableYouTubeEmbed: boolean
  enableVideoEmbed: boolean
  enableCheckbox: boolean
}

const defaultObsidianOptions: ObsidianOptions = {
  comments: true,
  highlight: true,
  wikilinks: true,
  callouts: true,
  mermaid: true,
  parseTags: true,
  parseArrows: true,
  parseBlockReferences: true,
  enableInHtmlEmbed: false,
  enableYouTubeEmbed: true,
  enableVideoEmbed: true,
  enableCheckbox: false,
}

export interface OxHugoOptions {
  /** Replace {{ relref }} with quartz wikilinks []() */
  wikilinks: boolean
  /** Remove pre-defined anchor (see https://ox-hugo.scripter.co/doc/anchors/) */
  removePredefinedAnchor: boolean
  /** Remove hugo shortcode syntax */
  removeHugoShortcode: boolean
  /** Replace <figure/> with ![]() */
  replaceFigureWithMdImg: boolean

  /** Replace org latex fragments with $ and $$ */
  replaceOrgLatex: boolean
}

const defaultOxHugoOptions: OxHugoOptions = {
  wikilinks: true,
  removePredefinedAnchor: true,
  removeHugoShortcode: true,
  replaceFigureWithMdImg: true,
  replaceOrgLatex: true,
}

export interface RoamOptions {
  orComponent: boolean
  TODOComponent: boolean
  DONEComponent: boolean
  videoComponent: boolean
  audioComponent: boolean
  pdfComponent: boolean
  blockquoteComponent: boolean
  tableComponent: boolean
  attributeComponent: boolean
}

const defaultRoamOptions: RoamOptions = {
  orComponent: true,
  TODOComponent: true,
  DONEComponent: true,
  videoComponent: true,
  audioComponent: true,
  pdfComponent: true,
  blockquoteComponent: true,
  tableComponent: true,
  attributeComponent: true,
}

export const CommonMarkFlavoredMarkdown: QuartzTransformerPlugin<Partial<CommonMarkOptions>> = (
  userOpts,
) => {
  const opts = { ...defaultCommonMarkOptions, ...userOpts }
  return {
    name: "CommonMarkFlavoredMarkdown",
  }
}

export const CustomFlavoredMarkdown: QuartzTransformerPlugin<Partial<CustomOptions>> = (
  userOpts,
) => {
  const opts = { ...defaultCustomOptions, ...userOpts }
  return {
    name: "CustomFlavoredMarkdown",
  }
}

export const GitHubFlavoredMarkdown: QuartzTransformerPlugin<Partial<GitHubOptions>> = (
  userOpts,
) => {
  const opts = { ...defaultGitHubOptions, ...userOpts }
  return {
    name: "GitHubFlavoredMarkdown",
  }
}

export const ObsidianFlavoredMarkdown: QuartzTransformerPlugin<Partial<ObsidianOptions>> = (
  userOpts,
) => {
  const opts = { ...defaultObsidianOptions, ...userOpts }
  return {
    name: "ObsidianFlavoredMarkdown",
  }
}

export const OxHugoFlavoredMarkdown: QuartzTransformerPlugin<Partial<OxHugoOptions>> = (
  userOpts,
) => {
  const opts = { ...defaultOxHugoOptions, ...userOpts }
  return {
    name: "OxHugoFlavoredMarkdown",
  }
}

export const RoamFlavoredMarkdown: QuartzTransformerPlugin<Partial<RoamOptions> | undefined> = (
  userOpts,
) => {
  const opts = { ...defaultRoamOptions, ...userOpts }
  return {
    name: "RoamFlavoredMarkdown",
  }
}
