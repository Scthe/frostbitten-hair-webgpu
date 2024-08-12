import bpy
import struct
import cmath
from array import array
import random

# DONE co.w defines if is movable, set 1 for root
# DONE increase sintel scale
# TODO wmtx?
# TODO check if conversion to mesh is required
# TODO remove tmp object

HEADER_SIZE_BYTES = 160


def to_opengl_coordinates(co):
    return [co[0], co[2], -co[1]]


def create_header_bytes(num_strands, verts_per_strand):
    reserved_cnt = 32
    reserved = ("I", 0, "_pad")
    fields = [
        ("f", 4.0, "version"),
        ("I", num_strands, "numHairStrands"),
        ("I", verts_per_strand, "numVerticesPerStrand"),
        ("I", HEADER_SIZE_BYTES, "offsetVertexPosition"),
        ("I", 0, "offsetStrandUV"),
        ("I", 0, "offsetVertexUV"),
        ("I", 0, "offsetStrandThickness"),
        ("I", 0, "offsetVertexColor"),
        *([reserved] * reserved_cnt),  # spread_op(array of 32 of 'reserved')
    ]
    # print('write ' +str(len(fields))+' fields')
    # print(fields[16])

    pack_fmt = "".join([x[0] for x in fields])
    size = struct.calcsize(pack_fmt)
    if size != HEADER_SIZE_BYTES:
        err = f"Expected header data to take {HEADER_SIZE_BYTES} bytes, it took {size} bytes"
        return 0, err
    data = struct.pack(pack_fmt, *[x[1] for x in fields])
    return size, data


def find_strands(hair_mesh_object):
    edges = [(e.vertices[0], e.vertices[1]) for e in hair_mesh_object.data.edges]
    # print("Edges", edges)

    # for each strand we have array of vertex ids
    strands = []
    last_vertex_id = None
    for edge in edges:
        if edge[0] != last_vertex_id:  # new strand
            strands.append([edge[0]])
        current_strand = strands[-1]
        current_strand.append(edge[1])
        last_vertex_id = edge[1]

    # debug - print indices
    # for i, s in enumerate(strands):
    # vs = ", ".join([str(x) for x in s])
    # print(f"strand {i} vertices({len(s)}): [{vs}]")
    # print(strands)

    # debug - add 1st vertex from each strand to vertex group 'roots'
    # roots_vertex_group = hair_mesh_object.vertex_groups.new(name="roots")
    # for s in strands:
    # roots_vertex_group.add([s[0]], 1.0, "ADD")

    return strands


def get_strand_vertex_locations(object, vertex_ids):
    def get_vert_location(vert_id):
        co = object.data.vertices[vert_id].co
        return [*to_opengl_coordinates(co)]

    return [get_vert_location(x) for x in vertex_ids]


class StrandVertexDistributor:
    "this class is only to not have n functions in global namespace, feelsbadman"
    expected_vertices_cnt = 0

    def __init__(self, expected_vertices_cnt):
        self.expected_vertices_cnt = expected_vertices_cnt

    def distribute(self, strand):
        vertices = [self._create_point(strand[0], False)]
        segment_length = self._get_strand_len(strand) / (self.expected_vertices_cnt - 1)
        # id of last used point from original strand collection
        last_original_vertex = 0
        measure_start_point = strand[0]  # coordinates from which we start measurement

        for i in range(self.expected_vertices_cnt - 2):
            next_point_in = segment_length
            to_next_orginal_vertex = self._distance(
                measure_start_point, strand[last_original_vertex + 1]
            )
            while next_point_in > to_next_orginal_vertex:
                last_original_vertex += 1
                measure_start_point = strand[last_original_vertex]
                next_point_in -= to_next_orginal_vertex
                to_next_orginal_vertex = self._distance(
                    measure_start_point, strand[last_original_vertex + 1]
                )
            p = self._get_point(
                measure_start_point, strand[last_original_vertex + 1], next_point_in
            )
            measure_start_point = p
            vertices.append(self._create_point(p, True))

        # add last vertex
        vertices.append(self._create_point(strand[-1], True))
        return vertices

    def _distance(self, p1, p2):
        """p1, p2 <- arrays of 3 values [x, y, z]"""
        L = [p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]]
        return abs(cmath.sqrt(L[0] * L[0] + L[1] * L[1] + L[2] * L[2]))

    def _get_point(self, start, end, dist):
        """point between start and end in range of 'dist' from start"""
        percent = dist / self._distance(start, end)
        l = [0, 0, 0]
        delta = [0, 0, 0]
        for i in range(3):
            delta[i] = end[i] - start[i]
            l[i] = start[i] + (percent * delta[i])
        return l

    def _get_strand_len(self, strand):
        d = 0
        for i in range(1, len(strand)):
            d += self._distance(strand[i - 1], strand[i])
        return d

    def _create_point(self, co, is_movable):
        return [*co, 1.0 if is_movable else 0.0]


def export_hair(particle_modifier, verts_per_strand):
    # create mesh from hair object to get nicer b-spline interpolated version
    # TBH we prob. can remove this and use raw hair system
    bpy.ops.object.modifier_convert(modifier=particle_modifier.name)
    hair_mesh_object = bpy.context.object
    print(f"Created tmp object: '{hair_mesh_object.name}'")

    # process mesh version of hair
    strands = find_strands(hair_mesh_object)
    # shuffle hair strands order so it works better with LOD system
    random.shuffle(strands)
    # print(strands)
    strands_cnt = len(strands)
    print(f"Found {strands_cnt} strands")

    # save strands to vertex positions
    locations = []
    vert_distributor = StrandVertexDistributor(verts_per_strand)
    for i, strand in enumerate(strands):
        vertex_locations = get_strand_vertex_locations(hair_mesh_object, strand)
        for vert in vert_distributor.distribute(vertex_locations):
            locations.extend(vert)
    print(f"Created {len(locations)} points ({verts_per_strand} per strand)")

    # dbg
    # for i in range(0, len(locations), 4):
    # vert_in_strand_id = (i/4)%verts_per_strand
    # if (vert_in_strand_id == 0): print('EDGE ', int((i/4)/verts_per_strand))
    # print('  vert {:4}: (x={:7.4}, y={:7.4}, z={:7.4}, w={:.4})'.format(i, locations[i], locations[i+1], locations[i+2], locations[i+3]))

    strands_array = array("f", locations)

    # create header
    header_bytes, header_data = create_header_bytes(strands_cnt, verts_per_strand)
    if header_bytes == 0:
        return False, header_data

    return True, (header_data, strands_array)


def export_hair_systems(out_dir, hair_object, verts_per_strand, dry_run=False):
    from os import path

    #  TODO raise if verts_per_strand < len(strand.vertices), as this requires cutting vertices
    hair_modifiers = [x for x in hair_object.modifiers if x.type == "PARTICLE_SYSTEM"]
    if len(hair_modifiers) == 0:
        return "Object '{hair_object.name}' does not have any hair systems"

    for mod in hair_modifiers:
        particle_system = mod.particle_system
        print(f"Exporting hair: '{hair_object.name}'.'{particle_system.name}'")

        ok, data = export_hair(mod, verts_per_strand)
        if not ok:
            return data

        if dry_run:
            print("Dry run: skipping writing to file")
            continue

        filename = (
            f"{hair_object.name}-{particle_system.name}.{verts_per_strand}points.tfx"
        )
        filepath = path.join(out_dir, filename)
        print(f"Exporting to: '{filepath}'")
        with open(filepath, "wb") as file:
            # debug("processing went ok, writing file")
            for d in data:
                file.write(d)

    return None


if __name__ == "__main__":
    print("----------------------")
    from os import path

    verts_per_strand = 8  # 24, 16, 12, 8
    object_name = "SintelHairOriginal"
    # object_name = "TestPlane"
    dry_run = False  # True

    hair_object = bpy.data.objects[object_name]
    out_dir = path.join(path.dirname(__file__), "static", "models")
    # print(out_dir)
    # print(hair_object)

    bpy.context.view_layer.objects.active = hair_object

    err_msg = export_hair_systems(
        out_dir, hair_object, verts_per_strand, dry_run=dry_run
    )
    if err_msg:
        print("[Error]", err_msg)

    print("--- fin ---")
