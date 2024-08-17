# Frostbitten hair WebGPU ([Demo](https://scthe.github.io/frostbitten-hair-webgpu/))

Software rasterizing hair strands with analytical anti-aliasing and order-independent transparency. Inspired by Frostbite's hair system: ["Every Strand Counts: Physics and Rendering Behind Frostbite's Hair"](https://www.youtube.com/watch?v=ool2E8SQPGU) as presented by Robin Taillandier and Jon Valdes.

Interactive [Demo](https://scthe.github.io/frostbitten-hair-webgpu/). **WebGPU is only available in Chrome!** Use the `[W, S, A, D]` keys to move and `[Z, SPACEBAR]` to fly up or down. `[Shift]` to move faster.  Check [src/constants.ts](src/constants.ts) for full documentation.




https://github.com/user-attachments/assets/02859b92-a940-42b6-8381-dcac4b81b4d4



*Nice hair rendering? Yes! Interactive physics? Yes! But is it fun? YES!*


![frostbitten-hair-static-img](https://github.com/user-attachments/assets/4deeb2b0-e753-4e6a-acb5-201854214b0d)


*A static image of software-rasterized hair. You can zoom in and inspect the anti-aliasing and order-independent transparency techniques.*

## Features

### Features: Rendering

* **Analytical anti-aliasing using software rasterizer**.
* **Order-independent transparency** using 2 passes and depth slices.
    * The first pass calculates min and max depth for a tile as well as a list of its visible hair segments.
        * I've also implemented the [ponytail optimization](https://youtu.be/ool2E8SQPGU?si=C0zOZh1mrB8hX_jY&t=1880) so it's actually min and max depth for each of the tile's depth bins. Frostbite uses different terminology, but I found "depth bin" more intuitive.
        * The speakers actually undersold the **ponytail/depth bins optimization** for each tile. It allows A LOT of further improvements. But they only had so much time to present and the presentation is already dense with cool tricks and tips.
    * The second pass is dispatched for every tile and blends its hair segments in a front-to-back order. Done by dividing each depth bin into slices, assigning segments to each, and blending.
        * It uses a task queue internally. Each "processor" grabs the next tile from a list once it's done with the current tile.
* Separate [strand-space shading calculation](https://youtu.be/ool2E8SQPGU?si=T0YirLDpKp83CjD2&t=1339). Instead of calculating shading for every pixel, I precalculate the values for every strand. You can select how many points are shaded for each strand. The last point always fades to transparency for a nice, thin tip.
    * **Kajiya-Kay diffuse, Marschner specular.** Although I do not calculate depth maps for lights, so TT lobe's weight is 0 by default. I like how the current initial scene looks and reconfiguring lights is booooring!
    * **Fake multiple scattering** [like in UE5](https://blog.selfshadow.com/publications/s2016-shading-course/karis/s2016_pbs_epic_hair.pdf#page=39). See "Physically based hair shading in Unreal" by Brian Karis slide 39 if SIGGRAPH does not allow link.
    * **Fake attenuation** mimicking [Beer–Lambert law](https://en.wikipedia.org/wiki/Beer%E2%80%93Lambert_law).
    * It also **casts and receives shadows as well as AO**. You can also randomize some settings for each strand.
* [LOD](https://youtu.be/ool2E8SQPGU?si=Zv-1N5Y4-nWvlB6v&t=1643) - the user has strand% slider. In a production system, you would automate this and increase hair width with distance. The randomization happens [in my blender exporter](scripts/tfx_exporter.py).
* Blender exporter for the older Blender hair system. It's actually the same file format as I've used in my TressFX ports ([1](https://github.com/Scthe/TressFX-OpenGL), [2](https://github.com/Scthe/WebFX), [3](https://github.com/Scthe/Rust-Vulkan-TressFX)).
* Uses [Sintel Lite 2.57b](http://www.blendswap.com/blends/view/7093) by BenDansie as a 3D model. There were no changes to "make it work" or optimize. Only selecting how many points per each strand.

### Features: Physics simulation

Check [src/constants.ts](src/constants.ts) for full documentation.

* **Constraints:** length, global shape, local shape, primitives and SDF collisions.
* **Grids:** average velocity, density gradient, wind force.
    * Use [friction](https://youtu.be/ool2E8SQPGU?si=JORsKS0Y6UQGpJ5C&t=814) to mix between each particle's velocity and the average velocity around it. Prevents single strands from fluttering in the wind.
    * Use **density gradient** to make the hair more "puffy". Useful if stronger wind squishes all hair strands into the character's head.
* **A Wind** that respects collisions. I differentiate 3 regions: lull (inside the mesh), half-lull (grid point is behind a collider, half-strength), and full strength.
    * Randomize strength, phase, etc.
* **Physics colliders.** Both **sphere primitives** and **Signed Distance Fields**.
    * [Offline-generated SDF](https://github.com/Azkellas/mesh_to_sdf) is used to approximate intersections with more complex meshes. Like the character's face. TEST IT NOW!
* Tons of **debug views** for physics values.

### Features: Other

* Shadow Mapping - both [Percentage Closer Filter (PCF)](https://en.wikipedia.org/wiki/Texture_filtering#Percentage_Closer_filtering) and [Percentage-Closer Soft Shadows (PCSS)](https://developer.download.nvidia.com/shaderlibrary/docs/shadow_PCSS.pdf). If you want, you can make the strands wider so they cast bigger shadows.
    * Yes, the hair can cast and receive shadows too.
* GTAO for materials ambient occlusion.
* HDR, gamma, dithering, and exposure control. While dithering might seem unnecessary, I'm allergic to it not being present.
* GUI to adjust most of the settings. Stats for memory, etc. And a "Profiler" button that shows time spent in each pass.
    * Check [src/constants.ts](src/constants.ts) for full documentation.

## Compared to Frostbite's implementation

I'm using Robin Taillandier and Jon Valdes's presentation ["Every Strand Counts: Physics and Rendering Behind Frostbite’s Hair"](https://www.youtube.com/watch?v=ool2E8SQPGU) as a reference point.

* No skinning to triangles. If a character has a beard, it should move based on the underlying mesh.
* There is a [pass that takes all strands and writes their shaded values](https://youtu.be/ool2E8SQPGU?si=HKPzUIWsHh75qBps&t=1333) (in strand-space) into a buffer. I do this for every strand, Frostbite only for visible ones. This pass is entirely separate from rasterization.
* No hair color from texture. The shading pass has the `strandIdx`, so it's a matter of fetching uv and sampling texture.
* Frostbite uses a software rasterizer to write to a depth (and maybe normal) buffer. This is a bit of a problem because of how software rasterizers work. So I re-render the hair using a hardware rasterizer just for depth and normals. Only the color is software rasterized.
    * Depth is not a problem (just an atomic op on a separate buffer), normals are. However, the Frostbite presentation does not mention normals. Don't they need them for AO or other stuff? Hair shading can omit AO (I even have supplementary [Beer–Lambert law](https://en.wikipedia.org/wiki/Beer%E2%80%93Lambert_law) attenuation). But what about the skin from which the hair grows? Is it faked in diffuse texture? Or is the hair always dense?
    * I also use a hardware rasterizer to render hair into shadow maps. Again, it's not complicated, but someone would have to spend time writing it. And I can't be bothered.
* No pre-sorting of tiles, which can result in some frames taking a bit longer than others.
* No curly hair subdivisions.
    * The algorithm they use is part of my Blender exporter. In Blender, each hair is a spline. I convert it to equidistant points. Although implementing this in software rasterizer is *a bit* different.
* No specialized support for [headgear](https://youtu.be/ool2E8SQPGU?si=aAFV_WnUwxJPoIRM&t=2071) like headbands. In Frostbite it requires content authoring to mark selected points as non-dynamic.
* No automatic LODs.Instead, you have a slider that works [exactly like Frostbite's system](https://youtu.be/ool2E8SQPGU?si=NTmreF8azhRz4sVB&t=1646). I randomize the strand order in my Blender exporter.
* A different set of constraints. We both have stretch/length constraints and colliders (both Signed Distance Fields and primitives).
    * I have extra global shape constraints, based on my experience with [TressFX](https://github.com/Scthe/Rust-Vulkan-TressFX). I assume that Frostbite also has this, but maybe under a different term (like "shape matching")?
    * Frostbite has a global length constraint.
    * We have different implementations for local shape constraints. Mine is based on "A Triangle Bending Constraint Model for Position-Based Dynamics" - [Kelager10](http://image.diku.dk/kenny/download/kelager.niebe.ea10.pdf).
* I simulate all hair strands. Frostbite can choose how much and interpolate the rest.

Some things were not explained in the presentation, so I gave my best guess. E.g. the aero grid update step takes wind and colliders as input.  But does it do fluid simulation for nice turbulence and vortexes? Possible, but not likely. I just mark 3 regions: lull (inside the mesh), half-lull (grid point is shielded by a collider, half strength), and full strength.

Ofc. I cannot rival Frostbite's performance. I am a single person and I have much better things to do than pore over a side project. I get stable <16ms on RTX3060 in the default view. It's enough FPS so that swinging the ball through the hair is FUN! There is a button to hide the ball, which is EVEN MORE FUN!!!


## Usage

* Firefox does not support WebGPU. Use Chrome instead.
* Use the `[W, S, A, D]` keys to move and `[Z, SPACEBAR]` to fly up or down. `[Shift]` to move faster. `[E]` to toggle depth pyramid debug mode.
* As all browsers enforce VSync, use the "Profile" button for accurate timings.

### Running the app locally

WebGPU does not work on Firefox. On Chrome, it requires HTTPS even during development.

1. `openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`. Move both files to `./static`.
2. `yarn install`.
3. `yarn dev`. Start a dev server that watches and compiles the code into `./build`. It also copies stuff from `./static`.
4. `yarn serve` in a separate terminal. Starts `http-server`. It's not included in `package.json`, but let's be honest - you already have it installed globally.

Or `yarn build` for prod build.

### Running the app in Deno

Node.js does not support WebGPU. Deno does (since [version 1.39](https://deno.com/blog/v1.39), December 14, 2023 - 8 months ago). Internally, it uses Firefox's [wgpu](https://github.com/gfx-rs/wgpu).

1. Download the `.zip` file from [deno/releases](https://github.com/denoland/deno/releases).
2. Your code editor might automatically install libs from `deno.json`. Or you might have to do it manually.
3. Run unit tests:
    1. `"<path-to-unzipped-deno>/deno.exe" task test`.
4. Render to `./output.png`:
    1. `"<path-to-unzipped-deno>/deno.exe" task start`.

Personally, I just use the [makefile](makefile). Update paths there and you should be good to go.

For generating SDF and Blender hair export see [makefile](makefile). They both call separate [scripts](scripts). For SDF it loads the OBJ file that I've included in this repo. The Blender file is not included (file size!), but it's similar as in my [Unity hair](https://github.com/Scthe/unity-hair) repo.



## FAQ

### How does this work?

See documentation for each pass in [src/passes/README.md](src/passes).

### How many hacks are there in the codebase?

Not really? There are always bugs. I'm a solo dev, so there probably is some incorrectness. The parameters have to be fine-tuned (as one could expect). Performance can be improved, but it's a matter of raw man-hours and experiments. Surely there **has** to be something obvious missing, but..

Instead, let's list some more interesting aspects:

* There is only a single hair model, but I don't think that changes much in practice. Using its `pointsInStrand` as a workgroup dimension is the most basic optimization one can make.
* If you set the fiber radius too large, some other settings should also change. Not all are accessible in GUI, check [src/constants.ts](src/constants.ts). E.g. you need to allocate more memory to PPLLs' data storage buffers.
* Software rasterization for quads calls `edgeFunction()` 4 times. But how do you get barycentric coordinates? Well, they are not needed for hair. Instead, you need to know the pixel's position in segment space. E.g. the pixel is around halfway between the segment's start and end points, and closer to the "left" edge than to the "right" one (hair has width). My algorithm for these calculations works well, but there are known bugs.
* `invalidTilesPerSegmentThreshold` is a config value that discards hair segments if they span too many tiles. Maybe the physics simulation launched them into the stratosphere and they somehow filled the whole screen? It's a reasonable precaution. But tuning it too low makes parts of the hair strand disappear.
    * Increase this value for smaller tile sizes.
    * Increase this value if the hair has a low number of points in each strand (longer segments).
    * Increase this value for closeups (segments are shown larger).
* Global shape constraint does a lot of heavy lifting.
* Isolated pixel flickering sometimes. Often you can fix this with more conservative settings. But when both strands are close [even in Frostbite it would be RNG](https://youtu.be/ool2E8SQPGU?si=4DZBkQeVoUvWgmxk&t=1601). Sintel's hair was not authored with this in mind, so it's more visible than it should be.
    * We do AA ourselves, there is no TAA to save us from flicker.
* Hair casts a shadow, but bias is complicated.
* Slices debug view might not be accurate as we can return early due to optimizations.
* The simulation uses hardcoded delta time. From what I've seen it's not uncommon, especially as the hair never drives the gameplay behavior. More advanced implementations often skip/simulate hair twice per frame instead of changing the delta time. It's a hair simulation, stability is the only concern. Browsers also have enforced VSync.
* Individual hair strands can sometimes jitter. Increase friction and play with constraints stiffness. It's the usual fine-tuning of the physics system issue.
* Ball control gizmo can be finicky. Especially at acute angles to the camera. But you are not here for the gizmo, are you? There is a ball reset button in the GUI if needed.


### How does the software rasterization differ from Nanite's?

In the last few years, we have seen more rendering systems that lean on software rasterization. Two of the most known examples are [UE5's Nanite](https://advances.realtimerendering.com/s2021/Karis_Nanite_SIGGRAPH_Advances_2021_final.pdf#page=81) and [Frostbite's hair system](https://www.youtube.com/watch?v=ool2E8SQPGU). My previous project was [Nanite WebGPU](https://github.com/Scthe/nanite-webgpu), which is a Nanite implementation that works in a browser. It has a meshlet hierarchy, software rasterizer, impostor billboards, etc.  We can compare how software rasterization is used in both projects.

* For Nanite WebGPU, I've opened the first 3 links from Google, adapted the code, and called it done. Better implementations would have to also add a visibility buffer. I was limited by WGSL's lack of 64-bit atomics. But, after the basic implementation, you don't spend time actually developing on top of it. For hair, software rasterization is only a beginning. It's used in both `TilePass` and `FinePass`. Most of the code is the respective shaders implements the pass' logic. Software rasterization is just a utility function for them.
* Nanite uses the software rasterization as it's faster for its use case. As the triangles become pixel-sized (with inevitable overdraw), it becomes inefficient to run the whole pipeline or waste 75% of the performance.
* Nanite can switch meshlet rasterization techniques on the fly. Neighboring meshlets can be rasterized differently. It's important that both methods use the exact same rules and settings to not leave holes in the model.
* For hair, there are 2 main use cases: analytical anti-aliasing and control over the result (e.g. 2-pass with depth bins).
* While hair also consists of thin triangles, I feel like this is not as important. That might be because I've spent hours working with software rasterization and forgot that this can be a problem.
* Nanite works on triangles, while hair segments are quads. Triangles are well documented. I had trouble getting barycentric coordinates for quads, so I had to roll my own algorithm.
* Some optimizations do not work that well with quads. You can the rewrite edge function as `Ax + By + C`, but in TilePass this takes too many registers and is actually slower.

### Anything about performance optimization?

WebGPU does not offer access to profilers. Or debuggers. With custom shader language (WGSL), writing isolated tests is painful. It's designed with no visibility in mind. The performance tests were done manually. By commenting out code, testing alternatives, etc. Here are a few things I've seen.

* Fix the major bugs first. You can find an "interesting" commit if you look for it. I'm not going to spoil it, so here is some other issue:
    * Just before finishing the project, I noticed a problem when calculating `cross(tangent, toCamera)` in view space. Depending on `toCamera.z` (either 1 or -1), it rendered only some strands. I had to switch to world space calculation. Then all strands rendered fine. Somehow this bugfix decreased HairFinePass time from 30ms to 27ms.
* Make it easy to check. For me, profiling it's just a button right below the GitHub link. Ofc. mashing the button is not the most scientific approach. But it's the best that the WebGPU can offer.
* Test it. For triangles, it's a [common optimization](https://fgiesen.wordpress.com/2013/02/10/optimizing-the-basic-rasterizer/) to write the edge function as `Ax + By + C`. You pre-calculate A, B, C. Then, the pixel iteration is a single addition. IIRC from [Nanite WebGPU](https://github.com/Scthe/nanite-webgpu), it was 7% faster for my test scene. For quads, this is not always the case. The `HairTilesPass` is **slower** with this optimization, but the HairFinePass is faster. I assume it hits a register breakpoint?
* Early returns from for loops can be slower. You think you are doing less work. In [one place](src/passes/swHair/shaderImpl/processHairSegment.wgsl.ts#L59) it increases frame time by 0.4ms.
    * Basically, do not assume you know how to write a for-loop.
* Don't test things when you have 300+ fps. Set the test scene. If you have <20 FPS and save 5ms you know you did the right thing. You can go line-by-line and find the exact line that contributes to a problem.
* For this app, frame time can be similar no matter if you render all strands or only half. The number of points in a strand also has a low impact. In foresight, it's not exactly unexpected.
* Algorithms are one thing, but config is the other. Switching from tile size 16px to 8px decreases HairFinePass time from ~19ms to ~10ms. Some workgroup sizes matter, and some do not. For some reason, the `HairTilesPass` has a lot of irrational workgroup sizes that are only marginally slower than the prod values.
* A lot of experiments. A lot of [throwaway code](src/passes/swHair/hairTilesPass.perStrand.wgsl.ts).
* Have a quick, reproducible environment. I can write `make run` and compare what Deno spews out to check if it seems OK.
* Decide if it's worth it. This app is a side project. Performance is often a matter of staring at something long enough. Works fine (<16ms) on my RTX3060.

After merging the `physics` branch into `master` I was able to bring the HairFinePass from 30ms to 10ms. Mostly done by fixing a bug, which allowed for a much more aggressive config. E.g. half the tile size to 8px, smaller memory allocations, etc. I suspect there are a few low-hanging fruits still left. I just wish I had a profiler to know what is actually going on.

I also wonder if Frostbite's team were able to have a more optimal HairFinePass workgroup size than `(1, 1, 1)` (99.9% sure they did). There is a lot of thread divergence. Usually, GPU task queues have a single task representing SIMD. E.g. it assigns a separate game object to each workgroup thread. And taking a task is a simple atomic counter increase op. But HairFinePass operates on tiles. Taking a single task would mean each of the workgroup threads would receive its own tile. Even with Frostbite's pre-sorted tile list, this could run into issues. You would also have to change memory access patterns (tried this and it by itself does nothing). I'd say this is the no. 1 priority in the codebase, as the findings would be interesting. There is not much info on the internet on GPU task queues. I know UE5's Nanite uses one. They have heterogeneous tasks, but each is easier to SIMD-ify.


## Honourable mentions

* Robin Taillandier and Jon Valdes for the ["Every Strand Counts: Physics and Rendering Behind Frostbite’s Hair"](https://www.youtube.com/watch?v=ool2E8SQPGU) presentation. It was clear and informative.
    * I also like that you can look at the slides and get extra information that the speakers did not have time to cover. For example, the aero grid simulation step takes both wind settings and the colliders. Then you realize, the wind is actually affected by the colliders. I've implemented this as 2 queries into SDF.
* [Matthias Müller](https://www.youtube.com/watch?v=iKAVRgIrUOU) cause everything simulation. While he authored tons of physics papers as principal engineer at NVIDIA, I'm purposefully linking his YouTube channel.
* [AMD TressFX](https://gpuopen.com/tressfx/) team. 6 years ago I [ported it to OpenGL](https://github.com/Scthe/TressFX-OpenGL). I also wrote a [web viewer for .tfx files](https://github.com/Scthe/WebFX) (along with tons of other advanced graphic effects - check it out, it's a cool demo). I even used it to [learn Vulkan](https://github.com/Scthe/Rust-Vulkan-TressFX).
* [Sintel Lite 2.57b](http://www.blendswap.com/blends/view/7093) by BenDansie.
* Myself for ["Animation workshop"](https://github.com/Scthe/Animation-workshop). It was a pain to write, but at least I could steal the gizmo and raycast code.
