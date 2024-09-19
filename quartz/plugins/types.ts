import { PluggableList, Pluggable } from "unified"
import { JSResource, StaticResources } from "../util/resources"
import { ReplaceFunction, findAndReplace as mdastFindReplace } from "mdast-util-find-and-replace"
import { ProcessedContent } from "./vfile"
import { QuartzComponent } from "../components/types"
import { FilePath } from "../util/path"
import { BuildCtx } from "../util/ctx"
import DepGraph from "../depgraph"

export interface PluginTypes {
  transformers: QuartzTransformerPluginInstance[]
  filters: QuartzFilterPluginInstance[]
  emitters: QuartzEmitterPluginInstance[]
}

export interface ParserTypes {
  parsers: QuartzParserInstance[]
}

type OptionType = object | undefined
export type QuartzTransformerPlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => QuartzTransformerPluginInstance
export type QuartzTransformerPluginInstance = {
  name: string
  textTransform?: (ctx: BuildCtx, src: string | Buffer) => string | Buffer
  markdownPlugins?: (ctx: BuildCtx) => PluggableList
  htmlPlugins?: (ctx: BuildCtx) => PluggableList
  externalResources?: (ctx: BuildCtx) => Partial<StaticResources>
}

export type QuartzFilterPlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => QuartzFilterPluginInstance
export type QuartzFilterPluginInstance = {
  name: string
  shouldPublish(ctx: BuildCtx, content: ProcessedContent): boolean
}

export type QuartzEmitterPlugin<Options extends OptionType = undefined> = (
  opts?: Options,
) => QuartzEmitterPluginInstance
export type QuartzEmitterPluginInstance = {
  name: string
  emit(ctx: BuildCtx, content: ProcessedContent[], resources: StaticResources): Promise<FilePath[]>
  getQuartzComponents(ctx: BuildCtx): QuartzComponent[]
  getDependencyGraph?(
    ctx: BuildCtx,
    content: ProcessedContent[],
    resources: StaticResources,
  ): Promise<DepGraph<FilePath>>
}

export type QuartzParser<Options extends OptionType = undefined> = (
  opts?: Options,
) => QuartzParserInstance
export type QuartzParserInstance = {
  name: string
  textTransform: (ctx: BuildCtx, src: string | Buffer) => string | Buffer
  markdownPlugins: (ctx: BuildCtx) => [RegExp, string | ReplaceFunction][]
  htmlPlugins: () => Pluggable | Pluggable[]
  externalResources: () => JSResource | string
}
