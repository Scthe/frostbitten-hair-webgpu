DENO = "C:\\programs\\portable\\deno\\deno.exe"
BLENDER = "C:\\programs\\portable\\blender-4.0.2-windows-x64\\blender.exe"
BLENDER_FILE = "_references/models/frostbite-hair.blend"

# install dependencies before first run
install:
	$(DENO) cache "src/index.deno.ts"

# Render to an image
run:
	$(DENO) task start
# DENO_NO_PACKAGE_JSON=1 && "_references/deno.exe" run --allow-read=. --allow-write=. --unstable-webgpu src/index.deno.ts

# Run all tests
test:
	$(DENO) task test

testSort:
	$(DENO) task testSort

# Generate .exe
compile:
	$(DENO) task compile

# Export hair object from Blender. Has hardcoded params, but whatever.
export_hair:
	$(BLENDER) $(BLENDER_FILE) --background --python "./scripts/tfx_exporter.py"

# Create SDF file
export_sdf:
	cd "scripts\generate_sdf" && cargo run
	cp "scripts\generate_sdf\sintel-sdf.bin" "static\models\sintel-sdf.bin"
