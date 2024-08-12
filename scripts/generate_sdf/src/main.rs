
use std::{
  path::{Path},
  io::{Write},
  fs::File,
};
use mesh_to_sdf::{generate_grid_sdf, SignMethod, Topology, Grid};


fn main() {
  // let path = Path::new("../../static/models/sdf-test.obj");
  let path = Path::new("../../static/models/sintel-collider.obj");
  let dims: usize = 64;
  let padding = 1.30;

  ///////////////
  let obj = tobj::load_obj(
    path,
    &tobj::LoadOptions {
        // triangulate: true,
        // single_index: true,
        ..Default::default()
    },
  );
  assert!(obj.is_ok());
  let (models, _materials) = obj.unwrap();

  assert!(models.len() == 1);
  let mesh = &models[0].mesh;
  // println!("{:?}", mesh);
  
  let mut vertices: Vec<[f32; 3]> = Vec::new();
  let vert_cnt = mesh.positions.len() / 3;

  // calculate bounding box
  let mut bounds_min = [mesh.positions[0], mesh.positions[1], mesh.positions[2]];
  let mut bounds_max = [mesh.positions[0], mesh.positions[1], mesh.positions[2]];
  for index in 0..vert_cnt {
    let p = [
        mesh.positions[index * 3],
        mesh.positions[index * 3 + 1],
        mesh.positions[index * 3 + 2],
    ];
    for co in 0..3 {
      bounds_min[co] = bounds_min[co].min(p[co]);
      bounds_max[co] = bounds_max[co].max(p[co]);
    }
    vertices.push(p);
  }
  
  // add padding
  for co in 0..3 {
    let center = (bounds_min[co] + bounds_max[co]) / 2.0;
    let delta = padding * (bounds_max[co] - center);
    bounds_min[co] = center - delta;
    bounds_max[co] = center + delta;
  }

  
  // if you can, use generate_grid_sdf instead of generate_sdf as it's optimized and much faster.
  let cell_count = [dims, dims, dims];

  let grid = Grid::from_bounding_box(&bounds_min, &bounds_max, cell_count);

  let sdf: Vec<f32> = generate_grid_sdf(
    &vertices,
    Topology::TriangleList(Some(&mesh.indices)),
    &grid,
    SignMethod::Raycast // Normal/Raycast
  );

  let mut file = File::create("sintel-sdf.bin").unwrap();
  // let cursor = Cursor::new(&mut f);
  // cursor.write_i32::<LittleEndian>(10).unwrap();
  // cursor.write_i32(10.to_le_bytes()).unwrap();
  file.write_all(&dims.to_le_bytes()).unwrap();
  file.write_all(&bounds_min[0].to_le_bytes()).unwrap();
  file.write_all(&bounds_min[1].to_le_bytes()).unwrap();
  file.write_all(&bounds_min[2].to_le_bytes()).unwrap();
  file.write_all(&bounds_max[0].to_le_bytes()).unwrap();
  file.write_all(&bounds_max[1].to_le_bytes()).unwrap();
  file.write_all(&bounds_max[2].to_le_bytes()).unwrap();
  
    
  for z in 0..cell_count[2] {
    for y in 0..cell_count[1] {
      for x in 0..cell_count[0] {
            let index = grid.get_cell_idx(&[x, y, z]);
            let value = sdf[index as usize];
            // println!("Distance to cell [{}, {}, {}]: {}", x, y, z, value);
            // println!("{}", value);
            file.write_all(&value.to_le_bytes()).unwrap();
        }
    }
  }
}