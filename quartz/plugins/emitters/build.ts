import { QuartzComponent } from "../../components/types"
import DepGraph from "../../depgraph"
import { BuildCtx } from "../../util/ctx"
import { FilePath } from "../../util/path"
import { StaticResources } from "../../util/resources"
import { QuartzEmitterPlugin, QuartzEmitterPluginInstance } from "../types"
import { ProcessedContent } from "../vfile"

interface Options {
  emitter: QuartzEmitterPluginInstance
}

export const BuildOnly: QuartzEmitterPlugin<Options> = (opts) => {
  const emitter = opts?.emitter as QuartzEmitterPluginInstance
  return {
    name: `BuildOnly<${emitter.name}>`,
    getQuartzComponents(ctx: BuildCtx): QuartzComponent[] {
      if (ctx.argv.serve) return []
      return emitter.getQuartzComponents(ctx)
    },
    async getDependencyGraph(
      ctx: BuildCtx,
      content: ProcessedContent[],
      resources: StaticResources,
    ) {
      if (ctx.argv.serve) return new DepGraph<FilePath>()
      return await emitter.getDependencyGraph!(ctx, content, resources)
    },
    async emit(ctx: BuildCtx, content: ProcessedContent[], resources: StaticResources) {
      if (ctx.argv.serve) return []
      return emitter.emit(ctx, content, resources)
    },
  }
}
