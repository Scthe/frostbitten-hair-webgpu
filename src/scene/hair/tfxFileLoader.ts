export interface TfxFileHeader {
  // Specifies TressFX version number
  version: number; // float version;

  // Number of hair strands in this file. All strands in this file are guide strands.
  // Follow hair strands are generated procedurally.
  numHairStrands: number; // unsigned int numHairStrands;

  // From 4 to 64 inclusive (POW2 only). This should be a fixed value within tfx value.
  // The total vertices from the tfx file is numHairStrands * numVerticesPerStrand.
  numVerticesPerStrand: number; // unsigned int numVerticesPerStrand;

  // Offsets to array data starts here. Offset values are in bytes, aligned on 8 bytes boundaries,
  // and relative to beginning of the .tfx file
  // ALL ARE UNSIGNED INTS!
  offsetVertexPosition: number; // Array size: FLOAT4[numHairStrands]
  offsetStrandUV: number; // Array size: FLOAT2[numHairStrands], if 0 no texture coordinates
  offsetVertexUV: number; // Array size: FLOAT2[numHairStrands * numVerticesPerStrand], if 0, no per vertex texture coordinates
  offsetStrandThickness: number; // Array size: float[numHairStrands]
  offsetVertexColor: number; // Array size: FLOAT4[numHairStrands * numVerticesPerStrand], if 0, no vertex colors

  // unsigned int reserved[32];           // Reserved for future versions
}

export interface TfxFileData {
  header: TfxFileHeader;
  /** `array<vec4f>` */
  vertexPositions: Float32Array;
}

const parseHeader = (rawData: ArrayBuffer): TfxFileHeader => {
  const version = new Float32Array(rawData, 0, 1)[0]; // offset 0bytes, read single float
  const uints = new Uint32Array(rawData, 4, 7); // offset 4bytes cause version is float, read 7 uint-values

  return {
    version,
    numHairStrands: uints[0],
    numVerticesPerStrand: uints[1],
    offsetVertexPosition: uints[2],
    offsetStrandUV: uints[3],
    offsetVertexUV: uints[4],
    offsetStrandThickness: uints[5],
    offsetVertexColor: uints[6],
  };
};

export const parseTfxFile = (
  fileData: ArrayBuffer,
  scale: number
): TfxFileData => {
  const header = parseHeader(fileData);
  console.log('Loaded Tfx file with header', header);

  const totalVertices = header.numHairStrands * header.numVerticesPerStrand;
  const posCount = totalVertices * 4;
  const vertexPositions0 = new Float32Array(
    fileData,
    header.offsetVertexPosition,
    posCount
  );
  // Deno requires a copy, or it will fail upload to GPU with:
  // "Copy size 2406 does not respect `COPY_BUFFER_ALIGNMENT`"
  const vertexPositions = vertexPositions0.map((e) => e * scale);

  return {
    header,
    vertexPositions,
  };
};
