# Passes


## Before the first frame

Before rendering the first frame, `Renderer.beforeFirstFrame()` is called. It calculates the initial values for the density/velocity grid, AO, and hair shading.


## Frame

Passes:

1. Simulation
   1. [GridPreSimPass](simulation/gridPreSimPass.ts) updates density gradients and wind values. Dispatches a thread for each grid point.
   2. [HairSimIntegrationPass](simulation/hairSimIntegrationPass.ts) updates hair points. Includes Verlet integration using forces from grids. Dispatches a thread for each strand.
   3. [GridPostSimPass](simulation/gridPostSimPass.ts) calculates points' velocity and density. The integration pass reads from these buffers, so we have to do this as a separate pass. Dispatches a thread for each strand.
2. Rendering
   1. [DrawBackgroundGradientPass](drawBackgroundGradient) first as we will have a lot of transparency with hair.
   2. [ShadowMapPass](shadowMapPass) to update shadow map. Has separate `GPURenderPipeline` for meshes and hair. Uses a hardware rasterizer for hair, but you should change this if you have extra time.
   3. [DrawMeshesPass](drawMeshes) draws solid objects. This also includes a special code for the ball collider.
   4. [HairTilesPass](swHair/hairTilesPass.ts) software rasterizes hair segments into tiles. Or, to be more precise, into each tile's depth bins. Dispatches a thread for each hair segment.
   5. [HairFinePass](swHair/hairFinePass.ts) software rasterizes each tile and writes the final pixel colors into the buffer. It contains the main part of the order-independent transparency implementation. It uses a task queue internally. Each "processor" grabs the next tile from a list once it's done with the current one. Dispatches a thread for each processor.
   6. [HairCombinePass](hairCombine) writes the software-rasterized hair into the HDR texture. Has special code for debug modes.
   7. Update depth and normal buffers using [hardware rasterizer](hwHair).
   8. [AoPass](aoPass) - GTAO.
   9. [HairShadingPass](hairShadingPass) updates the shading for each hair strand. Requires AO and normals. Dispatches a thread for each shading point on each hair strand.
      1. You might consider moving this before the software rasterizer if you want.
3. Finish
   1. [DrawGizmoPass](drawGizmo) renders the move gizmo for the ball collider.
   2. [DrawSdfColliderPass](drawSdfCollider) and [DrawGridDbgPass](drawGridDbg) are debug views for physics simulation.
   3. [PresentPass](presentPass). Dither, exposure, tonemapping, gamma.
