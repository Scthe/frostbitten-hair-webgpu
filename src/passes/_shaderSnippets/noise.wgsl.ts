/**
 * https://www.shadertoy.com/view/lsf3WH
 *
 * The MIT License
 * Copyright © 2013 Inigo Quilez
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * https://www.youtube.com/c/InigoQuilez
 * https://iquilezles.org/
 *
 * Converted to WGSL by me.
 */
export const SNIPPET_NOISE = /* wgsl */ `

/** range: [-1, 1] */
fn hash(p0: vec2f) -> f32 {
  let p  = 50.0 * fract(p0 * 0.3183099 + vec2f(0.71, 0.113));
  return -1.0 + 2.0 * fract(p.x * p.y * (p.x + p.y));
}

/** range: [-1, 1] */
fn noise(p: vec2f) -> f32 {
    let i = floor(p);
    let f = fract(p);
	
    // quintic interpolant
    let u = f*f*f*(f*(f*6.0-15.0)+10.0);

    return mix(mix(hash(i + vec2(0.0,0.0)), 
                   hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), 
                   hash(i + vec2(1.0,1.0)), u.x), u.y);
}

/** range: [-1, 1] */
fn fractalNoise(p: vec2f, scale: f32) -> f32 {
  var uv = p * scale;
  let m = mat2x2f(1.6,  1.2, -1.2,  1.6);
  var f  = 0.5000 * noise(uv); uv = m * uv;
      f += 0.2500 * noise(uv); uv = m * uv;
      f += 0.1250 * noise(uv); uv = m * uv;
      f += 0.0625 * noise(uv); uv = m * uv;
  return f;
}
`;
