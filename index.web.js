(()=>{var Ds=Object.create;var Bi=Object.defineProperty;var Cs=Object.getOwnPropertyDescriptor;var Rs=Object.getOwnPropertyNames;var Bs=Object.getPrototypeOf,Os=Object.prototype.hasOwnProperty;var Fs=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var Gs=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Rs(e))!Os.call(t,i)&&i!==n&&Bi(t,i,{get:()=>e[i],enumerable:!(r=Cs(e,i))||r.enumerable});return t};var Ns=(t,e,n)=>(n=t!=null?Ds(Bs(t)):{},Gs(e||!t||!t.__esModule?Bi(n,"default",{value:t,enumerable:!0}):n,t));var hs=Fs((exports,module)=>{(function(t,e){if(typeof exports=="object"&&typeof module=="object")module.exports=e();else if(typeof define=="function"&&define.amd)define([],e);else{var n=e();for(var r in n)(typeof exports=="object"?exports:t)[r]=n[r]}})(typeof self<"u"?self:exports,function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=t,n.c=e,n.d=function(r,i,o){n.o(r,i)||Object.defineProperty(r,i,{enumerable:!0,get:o})},n.r=function(r){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(r,"__esModule",{value:!0})},n.t=function(r,i){if(1&i&&(r=n(r)),8&i||4&i&&typeof r=="object"&&r&&r.__esModule)return r;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:r}),2&i&&typeof r!="string")for(var a in r)n.d(o,a,(function(s){return r[s]}).bind(null,a));return o},n.n=function(r){var i=r&&r.__esModule?function(){return r.default}:function(){return r};return n.d(i,"a",i),i},n.o=function(r,i){return Object.prototype.hasOwnProperty.call(r,i)},n.p="/",n(n.s=0)}({"./src/index.ts":function(module,__webpack_exports__,__webpack_require__){"use strict";eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OBJ", function() { return OBJ; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "version", function() { return version; });
/* harmony import */ var _mesh__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mesh */ "./src/mesh.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Mesh", function() { return _mesh__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./material */ "./src/material.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Material", function() { return _material__WEBPACK_IMPORTED_MODULE_1__["Material"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MaterialLibrary", function() { return _material__WEBPACK_IMPORTED_MODULE_1__["MaterialLibrary"]; });

/* harmony import */ var _layout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./layout */ "./src/layout.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Attribute", function() { return _layout__WEBPACK_IMPORTED_MODULE_2__["Attribute"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DuplicateAttributeException", function() { return _layout__WEBPACK_IMPORTED_MODULE_2__["DuplicateAttributeException"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Layout", function() { return _layout__WEBPACK_IMPORTED_MODULE_2__["Layout"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TYPES", function() { return _layout__WEBPACK_IMPORTED_MODULE_2__["TYPES"]; });

/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "downloadModels", function() { return _utils__WEBPACK_IMPORTED_MODULE_3__["downloadModels"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "downloadMeshes", function() { return _utils__WEBPACK_IMPORTED_MODULE_3__["downloadMeshes"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "initMeshBuffers", function() { return _utils__WEBPACK_IMPORTED_MODULE_3__["initMeshBuffers"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "deleteMeshBuffers", function() { return _utils__WEBPACK_IMPORTED_MODULE_3__["deleteMeshBuffers"]; });





const version = "2.0.3";
const OBJ = {
    Attribute: _layout__WEBPACK_IMPORTED_MODULE_2__["Attribute"],
    DuplicateAttributeException: _layout__WEBPACK_IMPORTED_MODULE_2__["DuplicateAttributeException"],
    Layout: _layout__WEBPACK_IMPORTED_MODULE_2__["Layout"],
    Material: _material__WEBPACK_IMPORTED_MODULE_1__["Material"],
    MaterialLibrary: _material__WEBPACK_IMPORTED_MODULE_1__["MaterialLibrary"],
    Mesh: _mesh__WEBPACK_IMPORTED_MODULE_0__["default"],
    TYPES: _layout__WEBPACK_IMPORTED_MODULE_2__["TYPES"],
    downloadModels: _utils__WEBPACK_IMPORTED_MODULE_3__["downloadModels"],
    downloadMeshes: _utils__WEBPACK_IMPORTED_MODULE_3__["downloadMeshes"],
    initMeshBuffers: _utils__WEBPACK_IMPORTED_MODULE_3__["initMeshBuffers"],
    deleteMeshBuffers: _utils__WEBPACK_IMPORTED_MODULE_3__["deleteMeshBuffers"],
    version,
};
/**
 * @namespace
 */



//# sourceURL=webpack:///./src/index.ts?`)},"./src/layout.ts":function(module,__webpack_exports__,__webpack_require__){"use strict";eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TYPES", function() { return TYPES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DuplicateAttributeException", function() { return DuplicateAttributeException; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Attribute", function() { return Attribute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Layout", function() { return Layout; });
var TYPES;
(function (TYPES) {
    TYPES["BYTE"] = "BYTE";
    TYPES["UNSIGNED_BYTE"] = "UNSIGNED_BYTE";
    TYPES["SHORT"] = "SHORT";
    TYPES["UNSIGNED_SHORT"] = "UNSIGNED_SHORT";
    TYPES["FLOAT"] = "FLOAT";
})(TYPES || (TYPES = {}));
/**
 * An exception for when two or more of the same attributes are found in the
 * same layout.
 * @private
 */
class DuplicateAttributeException extends Error {
    /**
     * Create a DuplicateAttributeException
     * @param {Attribute} attribute - The attribute that was found more than
     *        once in the {@link Layout}
     */
    constructor(attribute) {
        super(\`found duplicate attribute: \${attribute.key}\`);
    }
}
/**
 * Represents how a vertex attribute should be packed into an buffer.
 * @private
 */
class Attribute {
    /**
     * Create an attribute. Do not call this directly, use the predefined
     * constants.
     * @param {string} key - The name of this attribute as if it were a key in
     *        an Object. Use the camel case version of the upper snake case
     *        const name.
     * @param {number} size - The number of components per vertex attribute.
     *        Must be 1, 2, 3, or 4.
     * @param {string} type - The data type of each component for this
     *        attribute. Possible values:<br/>
     *        "BYTE": signed 8-bit integer, with values in [-128, 127]<br/>
     *        "SHORT": signed 16-bit integer, with values in
     *            [-32768, 32767]<br/>
     *        "UNSIGNED_BYTE": unsigned 8-bit integer, with values in
     *            [0, 255]<br/>
     *        "UNSIGNED_SHORT": unsigned 16-bit integer, with values in
     *            [0, 65535]<br/>
     *        "FLOAT": 32-bit floating point number
     * @param {boolean} normalized - Whether integer data values should be
     *        normalized when being casted to a float.<br/>
     *        If true, signed integers are normalized to [-1, 1].<br/>
     *        If true, unsigned integers are normalized to [0, 1].<br/>
     *        For type "FLOAT", this parameter has no effect.
     */
    constructor(key, size, type, normalized = false) {
        this.key = key;
        this.size = size;
        this.type = type;
        this.normalized = normalized;
        switch (type) {
            case "BYTE":
            case "UNSIGNED_BYTE":
                this.sizeOfType = 1;
                break;
            case "SHORT":
            case "UNSIGNED_SHORT":
                this.sizeOfType = 2;
                break;
            case "FLOAT":
                this.sizeOfType = 4;
                break;
            default:
                throw new Error(\`Unknown gl type: \${type}\`);
        }
        this.sizeInBytes = this.sizeOfType * size;
    }
}
/**
 * A class to represent the memory layout for a vertex attribute array. Used by
 * {@link Mesh}'s TBD(...) method to generate a packed array from mesh data.
 * <p>
 * Layout can sort of be thought of as a C-style struct declaration.
 * {@link Mesh}'s TBD(...) method will use the {@link Layout} instance to
 * pack an array in the given attribute order.
 * <p>
 * Layout also is very helpful when calling a WebGL context's
 * <code>vertexAttribPointer</code> method. If you've created a buffer using
 * a Layout instance, then the same Layout instance can be used to determine
 * the size, type, normalized, stride, and offset parameters for
 * <code>vertexAttribPointer</code>.
 * <p>
 * For example:
 * <pre><code>
 *
 * const index = glctx.getAttribLocation(shaderProgram, "pos");
 * glctx.vertexAttribPointer(
 *   layout.position.size,
 *   glctx[layout.position.type],
 *   layout.position.normalized,
 *   layout.position.stride,
 *   layout.position.offset);
 * </code></pre>
 * @see {@link Mesh}
 */
class Layout {
    /**
     * Create a Layout object. This constructor will throw if any duplicate
     * attributes are given.
     * @param {Array} ...attributes - An ordered list of attributes that
     *        describe the desired memory layout for each vertex attribute.
     *        <p>
     *
     * @see {@link Mesh}
     */
    constructor(...attributes) {
        this.attributes = attributes;
        this.attributeMap = {};
        let offset = 0;
        let maxStrideMultiple = 0;
        for (const attribute of attributes) {
            if (this.attributeMap[attribute.key]) {
                throw new DuplicateAttributeException(attribute);
            }
            // Add padding to satisfy WebGL's requirement that all
            // vertexAttribPointer calls have an offset that is a multiple of
            // the type size.
            if (offset % attribute.sizeOfType !== 0) {
                offset += attribute.sizeOfType - (offset % attribute.sizeOfType);
                console.warn("Layout requires padding before " + attribute.key + " attribute");
            }
            this.attributeMap[attribute.key] = {
                attribute: attribute,
                size: attribute.size,
                type: attribute.type,
                normalized: attribute.normalized,
                offset: offset,
            };
            offset += attribute.sizeInBytes;
            maxStrideMultiple = Math.max(maxStrideMultiple, attribute.sizeOfType);
        }
        // Add padding to the end to satisfy WebGL's requirement that all
        // vertexAttribPointer calls have a stride that is a multiple of the
        // type size. Because we're putting differently sized attributes into
        // the same buffer, it must be padded to a multiple of the largest
        // type size.
        if (offset % maxStrideMultiple !== 0) {
            offset += maxStrideMultiple - (offset % maxStrideMultiple);
            console.warn("Layout requires padding at the back");
        }
        this.stride = offset;
        for (const attribute of attributes) {
            this.attributeMap[attribute.key].stride = this.stride;
        }
    }
}
// Geometry attributes
/**
 * Attribute layout to pack a vertex's x, y, & z as floats
 *
 * @see {@link Layout}
 */
Layout.POSITION = new Attribute("position", 3, TYPES.FLOAT);
/**
 * Attribute layout to pack a vertex's normal's x, y, & z as floats
 *
 * @see {@link Layout}
 */
Layout.NORMAL = new Attribute("normal", 3, TYPES.FLOAT);
/**
 * Attribute layout to pack a vertex's normal's x, y, & z as floats.
 * <p>
 * This value will be computed on-the-fly based on the texture coordinates.
 * If no texture coordinates are available, the generated value will default to
 * 0, 0, 0.
 *
 * @see {@link Layout}
 */
Layout.TANGENT = new Attribute("tangent", 3, TYPES.FLOAT);
/**
 * Attribute layout to pack a vertex's normal's bitangent x, y, & z as floats.
 * <p>
 * This value will be computed on-the-fly based on the texture coordinates.
 * If no texture coordinates are available, the generated value will default to
 * 0, 0, 0.
 * @see {@link Layout}
 */
Layout.BITANGENT = new Attribute("bitangent", 3, TYPES.FLOAT);
/**
 * Attribute layout to pack a vertex's texture coordinates' u & v as floats
 *
 * @see {@link Layout}
 */
Layout.UV = new Attribute("uv", 2, TYPES.FLOAT);
// Material attributes
/**
 * Attribute layout to pack an unsigned short to be interpreted as a the index
 * into a {@link Mesh}'s materials list.
 * <p>
 * The intention of this value is to send all of the {@link Mesh}'s materials
 * into multiple shader uniforms and then reference the current one by this
 * vertex attribute.
 * <p>
 * example glsl code:
 *
 * <pre><code>
 *  // this is bound using MATERIAL_INDEX
 *  attribute int materialIndex;
 *
 *  struct Material {
 *    vec3 diffuse;
 *    vec3 specular;
 *    vec3 specularExponent;
 *  };
 *
 *  uniform Material materials[MAX_MATERIALS];
 *
 *  // ...
 *
 *  vec3 diffuse = materials[materialIndex];
 *
 * </code></pre>
 * TODO: More description & test to make sure subscripting by attributes even
 * works for webgl
 *
 * @see {@link Layout}
 */
Layout.MATERIAL_INDEX = new Attribute("materialIndex", 1, TYPES.SHORT);
Layout.MATERIAL_ENABLED = new Attribute("materialEnabled", 1, TYPES.UNSIGNED_SHORT);
Layout.AMBIENT = new Attribute("ambient", 3, TYPES.FLOAT);
Layout.DIFFUSE = new Attribute("diffuse", 3, TYPES.FLOAT);
Layout.SPECULAR = new Attribute("specular", 3, TYPES.FLOAT);
Layout.SPECULAR_EXPONENT = new Attribute("specularExponent", 3, TYPES.FLOAT);
Layout.EMISSIVE = new Attribute("emissive", 3, TYPES.FLOAT);
Layout.TRANSMISSION_FILTER = new Attribute("transmissionFilter", 3, TYPES.FLOAT);
Layout.DISSOLVE = new Attribute("dissolve", 1, TYPES.FLOAT);
Layout.ILLUMINATION = new Attribute("illumination", 1, TYPES.UNSIGNED_SHORT);
Layout.REFRACTION_INDEX = new Attribute("refractionIndex", 1, TYPES.FLOAT);
Layout.SHARPNESS = new Attribute("sharpness", 1, TYPES.FLOAT);
Layout.MAP_DIFFUSE = new Attribute("mapDiffuse", 1, TYPES.SHORT);
Layout.MAP_AMBIENT = new Attribute("mapAmbient", 1, TYPES.SHORT);
Layout.MAP_SPECULAR = new Attribute("mapSpecular", 1, TYPES.SHORT);
Layout.MAP_SPECULAR_EXPONENT = new Attribute("mapSpecularExponent", 1, TYPES.SHORT);
Layout.MAP_DISSOLVE = new Attribute("mapDissolve", 1, TYPES.SHORT);
Layout.ANTI_ALIASING = new Attribute("antiAliasing", 1, TYPES.UNSIGNED_SHORT);
Layout.MAP_BUMP = new Attribute("mapBump", 1, TYPES.SHORT);
Layout.MAP_DISPLACEMENT = new Attribute("mapDisplacement", 1, TYPES.SHORT);
Layout.MAP_DECAL = new Attribute("mapDecal", 1, TYPES.SHORT);
Layout.MAP_EMISSIVE = new Attribute("mapEmissive", 1, TYPES.SHORT);


//# sourceURL=webpack:///./src/layout.ts?`)},"./src/material.ts":function(module,__webpack_exports__,__webpack_require__){"use strict";eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Material", function() { return Material; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaterialLibrary", function() { return MaterialLibrary; });
/**
 * The Material class.
 */
class Material {
    constructor(name) {
        this.name = name;
        /**
         * Constructor
         * @param {String} name the unique name of the material
         */
        // The values for the following attibutes
        // are an array of R, G, B normalized values.
        // Ka - Ambient Reflectivity
        this.ambient = [0, 0, 0];
        // Kd - Defuse Reflectivity
        this.diffuse = [0, 0, 0];
        // Ks
        this.specular = [0, 0, 0];
        // Ke
        this.emissive = [0, 0, 0];
        // Tf
        this.transmissionFilter = [0, 0, 0];
        // d
        this.dissolve = 0;
        // valid range is between 0 and 1000
        this.specularExponent = 0;
        // either d or Tr; valid values are normalized
        this.transparency = 0;
        // illum - the enum of the illumination model to use
        this.illumination = 0;
        // Ni - Set to "normal" (air).
        this.refractionIndex = 1;
        // sharpness
        this.sharpness = 0;
        // map_Kd
        this.mapDiffuse = emptyTextureOptions();
        // map_Ka
        this.mapAmbient = emptyTextureOptions();
        // map_Ks
        this.mapSpecular = emptyTextureOptions();
        // map_Ns
        this.mapSpecularExponent = emptyTextureOptions();
        // map_d
        this.mapDissolve = emptyTextureOptions();
        // map_aat
        this.antiAliasing = false;
        // map_bump or bump
        this.mapBump = emptyTextureOptions();
        // disp
        this.mapDisplacement = emptyTextureOptions();
        // decal
        this.mapDecal = emptyTextureOptions();
        // map_Ke
        this.mapEmissive = emptyTextureOptions();
        // refl - when the reflection type is a cube, there will be multiple refl
        //        statements for each side of the cube. If it's a spherical
        //        reflection, there should only ever be one.
        this.mapReflections = [];
    }
}
const SENTINEL_MATERIAL = new Material("sentinel");
/**
 * https://en.wikipedia.org/wiki/Wavefront_.obj_file
 * http://paulbourke.net/dataformats/mtl/
 */
class MaterialLibrary {
    constructor(data) {
        this.data = data;
        /**
         * Constructs the Material Parser
         * @param mtlData the MTL file contents
         */
        this.currentMaterial = SENTINEL_MATERIAL;
        this.materials = {};
        this.parse();
    }
    /* eslint-disable camelcase */
    /* the function names here disobey camelCase conventions
     to make parsing/routing easier. see the parse function
     documentation for more information. */
    /**
     * Creates a new Material object and adds to the registry.
     * @param tokens the tokens associated with the directive
     */
    parse_newmtl(tokens) {
        const name = tokens[0];
        // console.info('Parsing new Material:', name);
        this.currentMaterial = new Material(name);
        this.materials[name] = this.currentMaterial;
    }
    /**
     * See the documenation for parse_Ka below for a better understanding.
     *
     * Given a list of possible color tokens, returns an array of R, G, and B
     * color values.
     *
     * @param tokens the tokens associated with the directive
     * @return {*} a 3 element array containing the R, G, and B values
     * of the color.
     */
    parseColor(tokens) {
        if (tokens[0] == "spectral") {
            throw new Error("The MTL parser does not support spectral curve files. You will " +
                "need to convert the MTL colors to either RGB or CIEXYZ.");
        }
        if (tokens[0] == "xyz") {
            throw new Error("The MTL parser does not currently support XYZ colors. Either convert the " +
                "XYZ values to RGB or create an issue to add support for XYZ");
        }
        // from my understanding of the spec, RGB values at this point
        // will either be 3 floats or exactly 1 float, so that's the check
        // that i'm going to perform here
        if (tokens.length == 3) {
            const [x, y, z] = tokens;
            return [parseFloat(x), parseFloat(y), parseFloat(z)];
        }
        // Since tokens at this point has a length of 3, we're going to assume
        // it's exactly 1, skipping the check for 2.
        const value = parseFloat(tokens[0]);
        // in this case, all values are equivalent
        return [value, value, value];
    }
    /**
     * Parse the ambient reflectivity
     *
     * A Ka directive can take one of three forms:
     *   - Ka r g b
     *   - Ka spectral file.rfl
     *   - Ka xyz x y z
     * These three forms are mutually exclusive in that only one
     * declaration can exist per material. It is considered a syntax
     * error otherwise.
     *
     * The "Ka" form specifies the ambient reflectivity using RGB values.
     * The "g" and "b" values are optional. If only the "r" value is
     * specified, then the "g" and "b" values are assigned the value of
     * "r". Values are normally in the range 0.0 to 1.0. Values outside
     * of this range increase or decrease the reflectivity accordingly.
     *
     * The "Ka spectral" form specifies the ambient reflectivity using a
     * spectral curve. "file.rfl" is the name of the ".rfl" file containing
     * the curve data. "factor" is an optional argument which is a multiplier
     * for the values in the .rfl file and defaults to 1.0 if not specified.
     *
     * The "Ka xyz" form specifies the ambient reflectivity using CIEXYZ values.
     * "x y z" are the values of the CIEXYZ color space. The "y" and "z" arguments
     * are optional and take on the value of the "x" component if only "x" is
     * specified. The "x y z" values are normally in the range of 0.0 to 1.0 and
     * increase or decrease ambient reflectivity accordingly outside of that
     * range.
     *
     * @param tokens the tokens associated with the directive
     */
    parse_Ka(tokens) {
        this.currentMaterial.ambient = this.parseColor(tokens);
    }
    /**
     * Diffuse Reflectivity
     *
     * Similar to the Ka directive. Simply replace "Ka" with "Kd" and the rules
     * are the same
     *
     * @param tokens the tokens associated with the directive
     */
    parse_Kd(tokens) {
        this.currentMaterial.diffuse = this.parseColor(tokens);
    }
    /**
     * Spectral Reflectivity
     *
     * Similar to the Ka directive. Simply replace "Ks" with "Kd" and the rules
     * are the same
     *
     * @param tokens the tokens associated with the directive
     */
    parse_Ks(tokens) {
        this.currentMaterial.specular = this.parseColor(tokens);
    }
    /**
     * Emissive
     *
     * The amount and color of light emitted by the object.
     *
     * @param tokens the tokens associated with the directive
     */
    parse_Ke(tokens) {
        this.currentMaterial.emissive = this.parseColor(tokens);
    }
    /**
     * Transmission Filter
     *
     * Any light passing through the object is filtered by the transmission
     * filter, which only allows specific colors to pass through. For example, Tf
     * 0 1 0 allows all of the green to pass through and filters out all of the
     * red and blue.
     *
     * Similar to the Ka directive. Simply replace "Ks" with "Tf" and the rules
     * are the same
     *
     * @param tokens the tokens associated with the directive
     */
    parse_Tf(tokens) {
        this.currentMaterial.transmissionFilter = this.parseColor(tokens);
    }
    /**
     * Specifies the dissolve for the current material.
     *
     * Statement: d [-halo] \`factor\`
     *
     * Example: "d 0.5"
     *
     * The factor is the amount this material dissolves into the background. A
     * factor of 1.0 is fully opaque. This is the default when a new material is
     * created. A factor of 0.0 is fully dissolved (completely transparent).
     *
     * Unlike a real transparent material, the dissolve does not depend upon
     * material thickness nor does it have any spectral character. Dissolve works
     * on all illumination models.
     *
     * The dissolve statement allows for an optional "-halo" flag which indicates
     * that a dissolve is dependent on the surface orientation relative to the
     * viewer. For example, a sphere with the following dissolve, "d -halo 0.0",
     * will be fully dissolved at its center and will appear gradually more opaque
     * toward its edge.
     *
     * "factor" is the minimum amount of dissolve applied to the material. The
     * amount of dissolve will vary between 1.0 (fully opaque) and the specified
     * "factor". The formula is:
     *
     *    dissolve = 1.0 - (N*v)(1.0-factor)
     *
     * @param tokens the tokens associated with the directive
     */
    parse_d(tokens) {
        // this ignores the -halo option as I can't find any documentation on what
        // it's supposed to be.
        this.currentMaterial.dissolve = parseFloat(tokens.pop() || "0");
    }
    /**
     * The "illum" statement specifies the illumination model to use in the
     * material. Illumination models are mathematical equations that represent
     * various material lighting and shading effects.
     *
     * The illumination number can be a number from 0 to 10. The following are
     * the list of illumination enumerations and their summaries:
     * 0. Color on and Ambient off
     * 1. Color on and Ambient on
     * 2. Highlight on
     * 3. Reflection on and Ray trace on
     * 4. Transparency: Glass on, Reflection: Ray trace on
     * 5. Reflection: Fresnel on and Ray trace on
     * 6. Transparency: Refraction on, Reflection: Fresnel off and Ray trace on
     * 7. Transparency: Refraction on, Reflection: Fresnel on and Ray trace on
     * 8. Reflection on and Ray trace off
     * 9. Transparency: Glass on, Reflection: Ray trace off
     * 10. Casts shadows onto invisible surfaces
     *
     * Example: "illum 2" to specify the "Highlight on" model
     *
     * @param tokens the tokens associated with the directive
     */
    parse_illum(tokens) {
        this.currentMaterial.illumination = parseInt(tokens[0]);
    }
    /**
     * Optical Density (AKA Index of Refraction)
     *
     * Statement: Ni \`index\`
     *
     * Example: Ni 1.0
     *
     * Specifies the optical density for the surface. \`index\` is the value
     * for the optical density. The values can range from 0.001 to 10.  A value of
     * 1.0 means that light does not bend as it passes through an object.
     * Increasing the optical_density increases the amount of bending. Glass has
     * an index of refraction of about 1.5. Values of less than 1.0 produce
     * bizarre results and are not recommended
     *
     * @param tokens the tokens associated with the directive
     */
    parse_Ni(tokens) {
        this.currentMaterial.refractionIndex = parseFloat(tokens[0]);
    }
    /**
     * Specifies the specular exponent for the current material. This defines the
     * focus of the specular highlight.
     *
     * Statement: Ns \`exponent\`
     *
     * Example: "Ns 250"
     *
     * \`exponent\` is the value for the specular exponent. A high exponent results
     * in a tight, concentrated highlight. Ns Values normally range from 0 to
     * 1000.
     *
     * @param tokens the tokens associated with the directive
     */
    parse_Ns(tokens) {
        this.currentMaterial.specularExponent = parseInt(tokens[0]);
    }
    /**
     * Specifies the sharpness of the reflections from the local reflection map.
     *
     * Statement: sharpness \`value\`
     *
     * Example: "sharpness 100"
     *
     * If a material does not have a local reflection map defined in its material
     * defintions, sharpness will apply to the global reflection map defined in
     * PreView.
     *
     * \`value\` can be a number from 0 to 1000. The default is 60. A high value
     * results in a clear reflection of objects in the reflection map.
     *
     * Tip: sharpness values greater than 100 introduce aliasing effects in
     * flat surfaces that are viewed at a sharp angle.
     *
     * @param tokens the tokens associated with the directive
     */
    parse_sharpness(tokens) {
        this.currentMaterial.sharpness = parseInt(tokens[0]);
    }
    /**
     * Parses the -cc flag and updates the options object with the values.
     *
     * @param values the values passed to the -cc flag
     * @param options the Object of all image options
     */
    parse_cc(values, options) {
        options.colorCorrection = values[0] == "on";
    }
    /**
     * Parses the -blendu flag and updates the options object with the values.
     *
     * @param values the values passed to the -blendu flag
     * @param options the Object of all image options
     */
    parse_blendu(values, options) {
        options.horizontalBlending = values[0] == "on";
    }
    /**
     * Parses the -blendv flag and updates the options object with the values.
     *
     * @param values the values passed to the -blendv flag
     * @param options the Object of all image options
     */
    parse_blendv(values, options) {
        options.verticalBlending = values[0] == "on";
    }
    /**
     * Parses the -boost flag and updates the options object with the values.
     *
     * @param values the values passed to the -boost flag
     * @param options the Object of all image options
     */
    parse_boost(values, options) {
        options.boostMipMapSharpness = parseFloat(values[0]);
    }
    /**
     * Parses the -mm flag and updates the options object with the values.
     *
     * @param values the values passed to the -mm flag
     * @param options the Object of all image options
     */
    parse_mm(values, options) {
        options.modifyTextureMap.brightness = parseFloat(values[0]);
        options.modifyTextureMap.contrast = parseFloat(values[1]);
    }
    /**
     * Parses and sets the -o, -s, and -t  u, v, and w values
     *
     * @param values the values passed to the -o, -s, -t flag
     * @param {Object} option the Object of either the -o, -s, -t option
     * @param {Integer} defaultValue the Object of all image options
     */
    parse_ost(values, option, defaultValue) {
        while (values.length < 3) {
            values.push(defaultValue.toString());
        }
        option.u = parseFloat(values[0]);
        option.v = parseFloat(values[1]);
        option.w = parseFloat(values[2]);
    }
    /**
     * Parses the -o flag and updates the options object with the values.
     *
     * @param values the values passed to the -o flag
     * @param options the Object of all image options
     */
    parse_o(values, options) {
        this.parse_ost(values, options.offset, 0);
    }
    /**
     * Parses the -s flag and updates the options object with the values.
     *
     * @param values the values passed to the -s flag
     * @param options the Object of all image options
     */
    parse_s(values, options) {
        this.parse_ost(values, options.scale, 1);
    }
    /**
     * Parses the -t flag and updates the options object with the values.
     *
     * @param values the values passed to the -t flag
     * @param options the Object of all image options
     */
    parse_t(values, options) {
        this.parse_ost(values, options.turbulence, 0);
    }
    /**
     * Parses the -texres flag and updates the options object with the values.
     *
     * @param values the values passed to the -texres flag
     * @param options the Object of all image options
     */
    parse_texres(values, options) {
        options.textureResolution = parseFloat(values[0]);
    }
    /**
     * Parses the -clamp flag and updates the options object with the values.
     *
     * @param values the values passed to the -clamp flag
     * @param options the Object of all image options
     */
    parse_clamp(values, options) {
        options.clamp = values[0] == "on";
    }
    /**
     * Parses the -bm flag and updates the options object with the values.
     *
     * @param values the values passed to the -bm flag
     * @param options the Object of all image options
     */
    parse_bm(values, options) {
        options.bumpMultiplier = parseFloat(values[0]);
    }
    /**
     * Parses the -imfchan flag and updates the options object with the values.
     *
     * @param values the values passed to the -imfchan flag
     * @param options the Object of all image options
     */
    parse_imfchan(values, options) {
        options.imfChan = values[0];
    }
    /**
     * This only exists for relection maps and denotes the type of reflection.
     *
     * @param values the values passed to the -type flag
     * @param options the Object of all image options
     */
    parse_type(values, options) {
        options.reflectionType = values[0];
    }
    /**
     * Parses the texture's options and returns an options object with the info
     *
     * @param tokens all of the option tokens to pass to the texture
     * @return {Object} a complete object of objects to apply to the texture
     */
    parseOptions(tokens) {
        const options = emptyTextureOptions();
        let option;
        let values;
        const optionsToValues = {};
        tokens.reverse();
        while (tokens.length) {
            // token is guaranteed to exists here, hence the explicit "as"
            const token = tokens.pop();
            if (token.startsWith("-")) {
                option = token.substr(1);
                optionsToValues[option] = [];
            }
            else if (option) {
                optionsToValues[option].push(token);
            }
        }
        for (option in optionsToValues) {
            if (!optionsToValues.hasOwnProperty(option)) {
                continue;
            }
            values = optionsToValues[option];
            const optionMethod = this[\`parse_\${option}\`];
            if (optionMethod) {
                optionMethod.bind(this)(values, options);
            }
        }
        return options;
    }
    /**
     * Parses the given texture map line.
     *
     * @param tokens all of the tokens representing the texture
     * @return a complete object of objects to apply to the texture
     */
    parseMap(tokens) {
        // according to wikipedia:
        // (https://en.wikipedia.org/wiki/Wavefront_.obj_file#Vendor_specific_alterations)
        // there is at least one vendor that places the filename before the options
        // rather than after (which is to spec). All options start with a '-'
        // so if the first token doesn't start with a '-', we're going to assume
        // it's the name of the map file.
        let optionsString;
        let filename = "";
        if (!tokens[0].startsWith("-")) {
            [filename, ...optionsString] = tokens;
        }
        else {
            filename = tokens.pop();
            optionsString = tokens;
        }
        const options = this.parseOptions(optionsString);
        options.filename = filename.replace(/\\\\/g, "/");
        return options;
    }
    /**
     * Parses the ambient map.
     *
     * @param tokens list of tokens for the map_Ka direcive
     */
    parse_map_Ka(tokens) {
        this.currentMaterial.mapAmbient = this.parseMap(tokens);
    }
    /**
     * Parses the diffuse map.
     *
     * @param tokens list of tokens for the map_Kd direcive
     */
    parse_map_Kd(tokens) {
        this.currentMaterial.mapDiffuse = this.parseMap(tokens);
    }
    /**
     * Parses the specular map.
     *
     * @param tokens list of tokens for the map_Ks direcive
     */
    parse_map_Ks(tokens) {
        this.currentMaterial.mapSpecular = this.parseMap(tokens);
    }
    /**
     * Parses the emissive map.
     *
     * @param tokens list of tokens for the map_Ke direcive
     */
    parse_map_Ke(tokens) {
        this.currentMaterial.mapEmissive = this.parseMap(tokens);
    }
    /**
     * Parses the specular exponent map.
     *
     * @param tokens list of tokens for the map_Ns direcive
     */
    parse_map_Ns(tokens) {
        this.currentMaterial.mapSpecularExponent = this.parseMap(tokens);
    }
    /**
     * Parses the dissolve map.
     *
     * @param tokens list of tokens for the map_d direcive
     */
    parse_map_d(tokens) {
        this.currentMaterial.mapDissolve = this.parseMap(tokens);
    }
    /**
     * Parses the anti-aliasing option.
     *
     * @param tokens list of tokens for the map_aat direcive
     */
    parse_map_aat(tokens) {
        this.currentMaterial.antiAliasing = tokens[0] == "on";
    }
    /**
     * Parses the bump map.
     *
     * @param tokens list of tokens for the map_bump direcive
     */
    parse_map_bump(tokens) {
        this.currentMaterial.mapBump = this.parseMap(tokens);
    }
    /**
     * Parses the bump map.
     *
     * @param tokens list of tokens for the bump direcive
     */
    parse_bump(tokens) {
        this.parse_map_bump(tokens);
    }
    /**
     * Parses the disp map.
     *
     * @param tokens list of tokens for the disp direcive
     */
    parse_disp(tokens) {
        this.currentMaterial.mapDisplacement = this.parseMap(tokens);
    }
    /**
     * Parses the decal map.
     *
     * @param tokens list of tokens for the map_decal direcive
     */
    parse_decal(tokens) {
        this.currentMaterial.mapDecal = this.parseMap(tokens);
    }
    /**
     * Parses the refl map.
     *
     * @param tokens list of tokens for the refl direcive
     */
    parse_refl(tokens) {
        this.currentMaterial.mapReflections.push(this.parseMap(tokens));
    }
    /**
     * Parses the MTL file.
     *
     * Iterates line by line parsing each MTL directive.
     *
     * This function expects the first token in the line
     * to be a valid MTL directive. That token is then used
     * to try and run a method on this class. parse_[directive]
     * E.g., the \`newmtl\` directive would try to call the method
     * parse_newmtl. Each parsing function takes in the remaining
     * list of tokens and updates the currentMaterial class with
     * the attributes provided.
     */
    parse() {
        const lines = this.data.split(/\\r?\\n/);
        for (let line of lines) {
            line = line.trim();
            if (!line || line.startsWith("#")) {
                continue;
            }
            const [directive, ...tokens] = line.split(/\\s/);
            const parseMethod = this[\`parse_\${directive}\`];
            if (!parseMethod) {
                console.warn(\`Don't know how to parse the directive: "\${directive}"\`);
                continue;
            }
            // console.log(\`Parsing "\${directive}" with tokens: \${tokens}\`);
            parseMethod.bind(this)(tokens);
        }
        // some cleanup. These don't need to be exposed as public data.
        delete this.data;
        this.currentMaterial = SENTINEL_MATERIAL;
    }
}
function emptyTextureOptions() {
    return {
        colorCorrection: false,
        horizontalBlending: true,
        verticalBlending: true,
        boostMipMapSharpness: 0,
        modifyTextureMap: {
            brightness: 0,
            contrast: 1,
        },
        offset: { u: 0, v: 0, w: 0 },
        scale: { u: 1, v: 1, w: 1 },
        turbulence: { u: 0, v: 0, w: 0 },
        clamp: false,
        textureResolution: null,
        bumpMultiplier: 1,
        imfChan: null,
        filename: "",
    };
}


//# sourceURL=webpack:///./src/material.ts?`)},"./src/mesh.ts":function(module,__webpack_exports__,__webpack_require__){"use strict";eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Mesh; });
/* harmony import */ var _layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./layout */ "./src/layout.ts");

/**
 * The main Mesh class. The constructor will parse through the OBJ file data
 * and collect the vertex, vertex normal, texture, and face information. This
 * information can then be used later on when creating your VBOs. See
 * OBJ.initMeshBuffers for an example of how to use the newly created Mesh
 */
class Mesh {
    /**
     * Create a Mesh
     * @param {String} objectData - a string representation of an OBJ file with
     *     newlines preserved.
     * @param {Object} options - a JS object containing valid options. See class
     *     documentation for options.
     * @param {bool} options.enableWTextureCoord - Texture coordinates can have
     *     an optional "w" coordinate after the u and v coordinates. This extra
     *     value can be used in order to perform fancy transformations on the
     *     textures themselves. Default is to truncate to only the u an v
     *     coordinates. Passing true will provide a default value of 0 in the
     *     event that any or all texture coordinates don't provide a w value.
     *     Always use the textureStride attribute in order to determine the
     *     stride length of the texture coordinates when rendering the element
     *     array.
     * @param {bool} options.calcTangentsAndBitangents - Calculate the tangents
     *     and bitangents when loading of the OBJ is completed. This adds two new
     *     attributes to the Mesh instance: \`tangents\` and \`bitangents\`.
     */
    constructor(objectData, options) {
        this.name = "";
        this.indicesPerMaterial = [];
        this.materialsByIndex = {};
        this.tangents = [];
        this.bitangents = [];
        options = options || {};
        options.materials = options.materials || {};
        options.enableWTextureCoord = !!options.enableWTextureCoord;
        // the list of unique vertex, normal, texture, attributes
        this.vertexNormals = [];
        this.textures = [];
        // the indicies to draw the faces
        this.indices = [];
        this.textureStride = options.enableWTextureCoord ? 3 : 2;
        /*
        The OBJ file format does a sort of compression when saving a model in a
        program like Blender. There are at least 3 sections (4 including textures)
        within the file. Each line in a section begins with the same string:
          * 'v': indicates vertex section
          * 'vn': indicates vertex normal section
          * 'f': indicates the faces section
          * 'vt': indicates vertex texture section (if textures were used on the model)
        Each of the above sections (except for the faces section) is a list/set of
        unique vertices.

        Each line of the faces section contains a list of
        (vertex, [texture], normal) groups.

        **Note:** The following documentation will use a capital "V" Vertex to
        denote the above (vertex, [texture], normal) groups whereas a lowercase
        "v" vertex is used to denote an X, Y, Z coordinate.

        Some examples:
            // the texture index is optional, both formats are possible for models
            // without a texture applied
            f 1/25 18/46 12/31
            f 1//25 18//46 12//31

            // A 3 vertex face with texture indices
            f 16/92/11 14/101/22 1/69/1

            // A 4 vertex face
            f 16/92/11 40/109/40 38/114/38 14/101/22

        The first two lines are examples of a 3 vertex face without a texture applied.
        The second is an example of a 3 vertex face with a texture applied.
        The third is an example of a 4 vertex face. Note: a face can contain N
        number of vertices.

        Each number that appears in one of the groups is a 1-based index
        corresponding to an item from the other sections (meaning that indexing
        starts at one and *not* zero).

        For example:
            \`f 16/92/11\` is saying to
              - take the 16th element from the [v] vertex array
              - take the 92nd element from the [vt] texture array
              - take the 11th element from the [vn] normal array
            and together they make a unique vertex.
        Using all 3+ unique Vertices from the face line will produce a polygon.

        Now, you could just go through the OBJ file and create a new vertex for
        each face line and WebGL will draw what appears to be the same model.
        However, vertices will be overlapped and duplicated all over the place.

        Consider a cube in 3D space centered about the origin and each side is
        2 units long. The front face (with the positive Z-axis pointing towards
        you) would have a Top Right vertex (looking orthogonal to its normal)
        mapped at (1,1,1) The right face would have a Top Left vertex (looking
        orthogonal to its normal) at (1,1,1) and the top face would have a Bottom
        Right vertex (looking orthogonal to its normal) at (1,1,1). Each face
        has a vertex at the same coordinates, however, three distinct vertices
        will be drawn at the same spot.

        To solve the issue of duplicate Vertices (the \`(vertex, [texture], normal)\`
        groups), while iterating through the face lines, when a group is encountered
        the whole group string ('16/92/11') is checked to see if it exists in the
        packed.hashindices object, and if it doesn't, the indices it specifies
        are used to look up each attribute in the corresponding attribute arrays
        already created. The values are then copied to the corresponding unpacked
        array (flattened to play nice with WebGL's ELEMENT_ARRAY_BUFFER indexing),
        the group string is added to the hashindices set and the current unpacked
        index is used as this hashindices value so that the group of elements can
        be reused. The unpacked index is incremented. If the group string already
        exists in the hashindices object, its corresponding value is the index of
        that group and is appended to the unpacked indices array.
       */
        const verts = [];
        const vertNormals = [];
        const textures = [];
        const materialNamesByIndex = [];
        const materialIndicesByName = {};
        // keep track of what material we've seen last
        let currentMaterialIndex = -1;
        let currentObjectByMaterialIndex = 0;
        // unpacking stuff
        const unpacked = {
            verts: [],
            norms: [],
            textures: [],
            hashindices: {},
            indices: [[]],
            materialIndices: [],
            index: 0,
        };
        const VERTEX_RE = /^v\\s/;
        const NORMAL_RE = /^vn\\s/;
        const TEXTURE_RE = /^vt\\s/;
        const FACE_RE = /^f\\s/;
        const WHITESPACE_RE = /\\s+/;
        const USE_MATERIAL_RE = /^usemtl/;
        // array of lines separated by the newline
        const lines = objectData.split("\\n");
        for (let line of lines) {
            line = line.trim();
            if (!line || line.startsWith("#")) {
                continue;
            }
            const elements = line.split(WHITESPACE_RE);
            elements.shift();
            if (VERTEX_RE.test(line)) {
                // if this is a vertex
                verts.push(...elements);
            }
            else if (NORMAL_RE.test(line)) {
                // if this is a vertex normal
                vertNormals.push(...elements);
            }
            else if (TEXTURE_RE.test(line)) {
                let coords = elements;
                // by default, the loader will only look at the U and V
                // coordinates of the vt declaration. So, this truncates the
                // elements to only those 2 values. If W texture coordinate
                // support is enabled, then the texture coordinate is
                // expected to have three values in it.
                if (elements.length > 2 && !options.enableWTextureCoord) {
                    coords = elements.slice(0, 2);
                }
                else if (elements.length === 2 && options.enableWTextureCoord) {
                    // If for some reason W texture coordinate support is enabled
                    // and only the U and V coordinates are given, then we supply
                    // the default value of 0 so that the stride length is correct
                    // when the textures are unpacked below.
                    coords.push("0");
                }
                textures.push(...coords);
            }
            else if (USE_MATERIAL_RE.test(line)) {
                const materialName = elements[0];
                // check to see if we've ever seen it before
                if (!(materialName in materialIndicesByName)) {
                    // new material we've never seen
                    materialNamesByIndex.push(materialName);
                    materialIndicesByName[materialName] = materialNamesByIndex.length - 1;
                    // push new array into indices
                    // already contains an array at index zero, don't add
                    if (materialIndicesByName[materialName] > 0) {
                        unpacked.indices.push([]);
                    }
                }
                // keep track of the current material index
                currentMaterialIndex = materialIndicesByName[materialName];
                // update current index array
                currentObjectByMaterialIndex = currentMaterialIndex;
            }
            else if (FACE_RE.test(line)) {
                // if this is a face
                /*
                split this face into an array of Vertex groups
                for example:
                   f 16/92/11 14/101/22 1/69/1
                becomes:
                  ['16/92/11', '14/101/22', '1/69/1'];
                */
                const triangles = triangulate(elements);
                for (const triangle of triangles) {
                    for (let j = 0, eleLen = triangle.length; j < eleLen; j++) {
                        const hash = triangle[j] + "," + currentMaterialIndex;
                        if (hash in unpacked.hashindices) {
                            unpacked.indices[currentObjectByMaterialIndex].push(unpacked.hashindices[hash]);
                        }
                        else {
                            /*
                        Each element of the face line array is a Vertex which has its
                        attributes delimited by a forward slash. This will separate
                        each attribute into another array:
                            '19/92/11'
                        becomes:
                            Vertex = ['19', '92', '11'];
                        where
                            Vertex[0] is the vertex index
                            Vertex[1] is the texture index
                            Vertex[2] is the normal index
                         Think of faces having Vertices which are comprised of the
                         attributes location (v), texture (vt), and normal (vn).
                         */
                            const vertex = triangle[j].split("/");
                            // it's possible for faces to only specify the vertex
                            // and the normal. In this case, vertex will only have
                            // a length of 2 and not 3 and the normal will be the
                            // second item in the list with an index of 1.
                            const normalIndex = vertex.length - 1;
                            /*
                         The verts, textures, and vertNormals arrays each contain a
                         flattend array of coordinates.

                         Because it gets confusing by referring to Vertex and then
                         vertex (both are different in my descriptions) I will explain
                         what's going on using the vertexNormals array:

                         vertex[2] will contain the one-based index of the vertexNormals
                         section (vn). One is subtracted from this index number to play
                         nice with javascript's zero-based array indexing.

                         Because vertexNormal is a flattened array of x, y, z values,
                         simple pointer arithmetic is used to skip to the start of the
                         vertexNormal, then the offset is added to get the correct
                         component: +0 is x, +1 is y, +2 is z.

                         This same process is repeated for verts and textures.
                         */
                            // Vertex position
                            unpacked.verts.push(+verts[(+vertex[0] - 1) * 3 + 0]);
                            unpacked.verts.push(+verts[(+vertex[0] - 1) * 3 + 1]);
                            unpacked.verts.push(+verts[(+vertex[0] - 1) * 3 + 2]);
                            // Vertex textures
                            if (textures.length) {
                                const stride = options.enableWTextureCoord ? 3 : 2;
                                unpacked.textures.push(+textures[(+vertex[1] - 1) * stride + 0]);
                                unpacked.textures.push(+textures[(+vertex[1] - 1) * stride + 1]);
                                if (options.enableWTextureCoord) {
                                    unpacked.textures.push(+textures[(+vertex[1] - 1) * stride + 2]);
                                }
                            }
                            // Vertex normals
                            unpacked.norms.push(+vertNormals[(+vertex[normalIndex] - 1) * 3 + 0]);
                            unpacked.norms.push(+vertNormals[(+vertex[normalIndex] - 1) * 3 + 1]);
                            unpacked.norms.push(+vertNormals[(+vertex[normalIndex] - 1) * 3 + 2]);
                            // Vertex material indices
                            unpacked.materialIndices.push(currentMaterialIndex);
                            // add the newly created Vertex to the list of indices
                            unpacked.hashindices[hash] = unpacked.index;
                            unpacked.indices[currentObjectByMaterialIndex].push(unpacked.hashindices[hash]);
                            // increment the counter
                            unpacked.index += 1;
                        }
                    }
                }
            }
        }
        this.vertices = unpacked.verts;
        this.vertexNormals = unpacked.norms;
        this.textures = unpacked.textures;
        this.vertexMaterialIndices = unpacked.materialIndices;
        this.indices = unpacked.indices[currentObjectByMaterialIndex];
        this.indicesPerMaterial = unpacked.indices;
        this.materialNames = materialNamesByIndex;
        this.materialIndices = materialIndicesByName;
        this.materialsByIndex = {};
        if (options.calcTangentsAndBitangents) {
            this.calculateTangentsAndBitangents();
        }
    }
    /**
     * Calculates the tangents and bitangents of the mesh that forms an orthogonal basis together with the
     * normal in the direction of the texture coordinates. These are useful for setting up the TBN matrix
     * when distorting the normals through normal maps.
     * Method derived from: http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-13-normal-mapping/
     *
     * This method requires the normals and texture coordinates to be parsed and set up correctly.
     * Adds the tangents and bitangents as members of the class instance.
     */
    calculateTangentsAndBitangents() {
        console.assert(!!(this.vertices &&
            this.vertices.length &&
            this.vertexNormals &&
            this.vertexNormals.length &&
            this.textures &&
            this.textures.length), "Missing attributes for calculating tangents and bitangents");
        const unpacked = {
            tangents: [...new Array(this.vertices.length)].map(_ => 0),
            bitangents: [...new Array(this.vertices.length)].map(_ => 0),
        };
        // Loop through all faces in the whole mesh
        const indices = this.indices;
        const vertices = this.vertices;
        const normals = this.vertexNormals;
        const uvs = this.textures;
        for (let i = 0; i < indices.length; i += 3) {
            const i0 = indices[i + 0];
            const i1 = indices[i + 1];
            const i2 = indices[i + 2];
            const x_v0 = vertices[i0 * 3 + 0];
            const y_v0 = vertices[i0 * 3 + 1];
            const z_v0 = vertices[i0 * 3 + 2];
            const x_uv0 = uvs[i0 * 2 + 0];
            const y_uv0 = uvs[i0 * 2 + 1];
            const x_v1 = vertices[i1 * 3 + 0];
            const y_v1 = vertices[i1 * 3 + 1];
            const z_v1 = vertices[i1 * 3 + 2];
            const x_uv1 = uvs[i1 * 2 + 0];
            const y_uv1 = uvs[i1 * 2 + 1];
            const x_v2 = vertices[i2 * 3 + 0];
            const y_v2 = vertices[i2 * 3 + 1];
            const z_v2 = vertices[i2 * 3 + 2];
            const x_uv2 = uvs[i2 * 2 + 0];
            const y_uv2 = uvs[i2 * 2 + 1];
            const x_deltaPos1 = x_v1 - x_v0;
            const y_deltaPos1 = y_v1 - y_v0;
            const z_deltaPos1 = z_v1 - z_v0;
            const x_deltaPos2 = x_v2 - x_v0;
            const y_deltaPos2 = y_v2 - y_v0;
            const z_deltaPos2 = z_v2 - z_v0;
            const x_uvDeltaPos1 = x_uv1 - x_uv0;
            const y_uvDeltaPos1 = y_uv1 - y_uv0;
            const x_uvDeltaPos2 = x_uv2 - x_uv0;
            const y_uvDeltaPos2 = y_uv2 - y_uv0;
            const rInv = x_uvDeltaPos1 * y_uvDeltaPos2 - y_uvDeltaPos1 * x_uvDeltaPos2;
            const r = 1.0 / Math.abs(rInv < 0.0001 ? 1.0 : rInv);
            // Tangent
            const x_tangent = (x_deltaPos1 * y_uvDeltaPos2 - x_deltaPos2 * y_uvDeltaPos1) * r;
            const y_tangent = (y_deltaPos1 * y_uvDeltaPos2 - y_deltaPos2 * y_uvDeltaPos1) * r;
            const z_tangent = (z_deltaPos1 * y_uvDeltaPos2 - z_deltaPos2 * y_uvDeltaPos1) * r;
            // Bitangent
            const x_bitangent = (x_deltaPos2 * x_uvDeltaPos1 - x_deltaPos1 * x_uvDeltaPos2) * r;
            const y_bitangent = (y_deltaPos2 * x_uvDeltaPos1 - y_deltaPos1 * x_uvDeltaPos2) * r;
            const z_bitangent = (z_deltaPos2 * x_uvDeltaPos1 - z_deltaPos1 * x_uvDeltaPos2) * r;
            // Gram-Schmidt orthogonalize
            //t = glm::normalize(t - n * glm:: dot(n, t));
            const x_n0 = normals[i0 * 3 + 0];
            const y_n0 = normals[i0 * 3 + 1];
            const z_n0 = normals[i0 * 3 + 2];
            const x_n1 = normals[i1 * 3 + 0];
            const y_n1 = normals[i1 * 3 + 1];
            const z_n1 = normals[i1 * 3 + 2];
            const x_n2 = normals[i2 * 3 + 0];
            const y_n2 = normals[i2 * 3 + 1];
            const z_n2 = normals[i2 * 3 + 2];
            // Tangent
            const n0_dot_t = x_tangent * x_n0 + y_tangent * y_n0 + z_tangent * z_n0;
            const n1_dot_t = x_tangent * x_n1 + y_tangent * y_n1 + z_tangent * z_n1;
            const n2_dot_t = x_tangent * x_n2 + y_tangent * y_n2 + z_tangent * z_n2;
            const x_resTangent0 = x_tangent - x_n0 * n0_dot_t;
            const y_resTangent0 = y_tangent - y_n0 * n0_dot_t;
            const z_resTangent0 = z_tangent - z_n0 * n0_dot_t;
            const x_resTangent1 = x_tangent - x_n1 * n1_dot_t;
            const y_resTangent1 = y_tangent - y_n1 * n1_dot_t;
            const z_resTangent1 = z_tangent - z_n1 * n1_dot_t;
            const x_resTangent2 = x_tangent - x_n2 * n2_dot_t;
            const y_resTangent2 = y_tangent - y_n2 * n2_dot_t;
            const z_resTangent2 = z_tangent - z_n2 * n2_dot_t;
            const magTangent0 = Math.sqrt(x_resTangent0 * x_resTangent0 + y_resTangent0 * y_resTangent0 + z_resTangent0 * z_resTangent0);
            const magTangent1 = Math.sqrt(x_resTangent1 * x_resTangent1 + y_resTangent1 * y_resTangent1 + z_resTangent1 * z_resTangent1);
            const magTangent2 = Math.sqrt(x_resTangent2 * x_resTangent2 + y_resTangent2 * y_resTangent2 + z_resTangent2 * z_resTangent2);
            // Bitangent
            const n0_dot_bt = x_bitangent * x_n0 + y_bitangent * y_n0 + z_bitangent * z_n0;
            const n1_dot_bt = x_bitangent * x_n1 + y_bitangent * y_n1 + z_bitangent * z_n1;
            const n2_dot_bt = x_bitangent * x_n2 + y_bitangent * y_n2 + z_bitangent * z_n2;
            const x_resBitangent0 = x_bitangent - x_n0 * n0_dot_bt;
            const y_resBitangent0 = y_bitangent - y_n0 * n0_dot_bt;
            const z_resBitangent0 = z_bitangent - z_n0 * n0_dot_bt;
            const x_resBitangent1 = x_bitangent - x_n1 * n1_dot_bt;
            const y_resBitangent1 = y_bitangent - y_n1 * n1_dot_bt;
            const z_resBitangent1 = z_bitangent - z_n1 * n1_dot_bt;
            const x_resBitangent2 = x_bitangent - x_n2 * n2_dot_bt;
            const y_resBitangent2 = y_bitangent - y_n2 * n2_dot_bt;
            const z_resBitangent2 = z_bitangent - z_n2 * n2_dot_bt;
            const magBitangent0 = Math.sqrt(x_resBitangent0 * x_resBitangent0 +
                y_resBitangent0 * y_resBitangent0 +
                z_resBitangent0 * z_resBitangent0);
            const magBitangent1 = Math.sqrt(x_resBitangent1 * x_resBitangent1 +
                y_resBitangent1 * y_resBitangent1 +
                z_resBitangent1 * z_resBitangent1);
            const magBitangent2 = Math.sqrt(x_resBitangent2 * x_resBitangent2 +
                y_resBitangent2 * y_resBitangent2 +
                z_resBitangent2 * z_resBitangent2);
            unpacked.tangents[i0 * 3 + 0] += x_resTangent0 / magTangent0;
            unpacked.tangents[i0 * 3 + 1] += y_resTangent0 / magTangent0;
            unpacked.tangents[i0 * 3 + 2] += z_resTangent0 / magTangent0;
            unpacked.tangents[i1 * 3 + 0] += x_resTangent1 / magTangent1;
            unpacked.tangents[i1 * 3 + 1] += y_resTangent1 / magTangent1;
            unpacked.tangents[i1 * 3 + 2] += z_resTangent1 / magTangent1;
            unpacked.tangents[i2 * 3 + 0] += x_resTangent2 / magTangent2;
            unpacked.tangents[i2 * 3 + 1] += y_resTangent2 / magTangent2;
            unpacked.tangents[i2 * 3 + 2] += z_resTangent2 / magTangent2;
            unpacked.bitangents[i0 * 3 + 0] += x_resBitangent0 / magBitangent0;
            unpacked.bitangents[i0 * 3 + 1] += y_resBitangent0 / magBitangent0;
            unpacked.bitangents[i0 * 3 + 2] += z_resBitangent0 / magBitangent0;
            unpacked.bitangents[i1 * 3 + 0] += x_resBitangent1 / magBitangent1;
            unpacked.bitangents[i1 * 3 + 1] += y_resBitangent1 / magBitangent1;
            unpacked.bitangents[i1 * 3 + 2] += z_resBitangent1 / magBitangent1;
            unpacked.bitangents[i2 * 3 + 0] += x_resBitangent2 / magBitangent2;
            unpacked.bitangents[i2 * 3 + 1] += y_resBitangent2 / magBitangent2;
            unpacked.bitangents[i2 * 3 + 2] += z_resBitangent2 / magBitangent2;
            // TODO: check handedness
        }
        this.tangents = unpacked.tangents;
        this.bitangents = unpacked.bitangents;
    }
    /**
     * @param layout - A {@link Layout} object that describes the
     * desired memory layout of the generated buffer
     * @return The packed array in the ... TODO
     */
    makeBufferData(layout) {
        const numItems = this.vertices.length / 3;
        const buffer = new ArrayBuffer(layout.stride * numItems);
        buffer.numItems = numItems;
        const dataView = new DataView(buffer);
        for (let i = 0, vertexOffset = 0; i < numItems; i++) {
            vertexOffset = i * layout.stride;
            // copy in the vertex data in the order and format given by the
            // layout param
            for (const attribute of layout.attributes) {
                const offset = vertexOffset + layout.attributeMap[attribute.key].offset;
                switch (attribute.key) {
                    case _layout__WEBPACK_IMPORTED_MODULE_0__["Layout"].POSITION.key:
                        dataView.setFloat32(offset, this.vertices[i * 3], true);
                        dataView.setFloat32(offset + 4, this.vertices[i * 3 + 1], true);
                        dataView.setFloat32(offset + 8, this.vertices[i * 3 + 2], true);
                        break;
                    case _layout__WEBPACK_IMPORTED_MODULE_0__["Layout"].UV.key:
                        dataView.setFloat32(offset, this.textures[i * 2], true);
                        dataView.setFloat32(offset + 4, this.textures[i * 2 + 1], true);
                        break;
                    case _layout__WEBPACK_IMPORTED_MODULE_0__["Layout"].NORMAL.key:
                        dataView.setFloat32(offset, this.vertexNormals[i * 3], true);
                        dataView.setFloat32(offset + 4, this.vertexNormals[i * 3 + 1], true);
                        dataView.setFloat32(offset + 8, this.vertexNormals[i * 3 + 2], true);
                        break;
                    case _layout__WEBPACK_IMPORTED_MODULE_0__["Layout"].MATERIAL_INDEX.key:
                        dataView.setInt16(offset, this.vertexMaterialIndices[i], true);
                        break;
                    case _layout__WEBPACK_IMPORTED_MODULE_0__["Layout"].AMBIENT.key: {
                        const materialIndex = this.vertexMaterialIndices[i];
                        const material = this.materialsByIndex[materialIndex];
                        if (!material) {
                            console.warn('Material "' +
                                this.materialNames[materialIndex] +
                                '" not found in mesh. Did you forget to call addMaterialLibrary(...)?"');
                            break;
                        }
                        dataView.setFloat32(offset, material.ambient[0], true);
                        dataView.setFloat32(offset + 4, material.ambient[1], true);
                        dataView.setFloat32(offset + 8, material.ambient[2], true);
                        break;
                    }
                    case _layout__WEBPACK_IMPORTED_MODULE_0__["Layout"].DIFFUSE.key: {
                        const materialIndex = this.vertexMaterialIndices[i];
                        const material = this.materialsByIndex[materialIndex];
                        if (!material) {
                            console.warn('Material "' +
                                this.materialNames[materialIndex] +
                                '" not found in mesh. Did you forget to call addMaterialLibrary(...)?"');
                            break;
                        }
                        dataView.setFloat32(offset, material.diffuse[0], true);
                        dataView.setFloat32(offset + 4, material.diffuse[1], true);
                        dataView.setFloat32(offset + 8, material.diffuse[2], true);
                        break;
                    }
                    case _layout__WEBPACK_IMPORTED_MODULE_0__["Layout"].SPECULAR.key: {
                        const materialIndex = this.vertexMaterialIndices[i];
                        const material = this.materialsByIndex[materialIndex];
                        if (!material) {
                            console.warn('Material "' +
                                this.materialNames[materialIndex] +
                                '" not found in mesh. Did you forget to call addMaterialLibrary(...)?"');
                            break;
                        }
                        dataView.setFloat32(offset, material.specular[0], true);
                        dataView.setFloat32(offset + 4, material.specular[1], true);
                        dataView.setFloat32(offset + 8, material.specular[2], true);
                        break;
                    }
                    case _layout__WEBPACK_IMPORTED_MODULE_0__["Layout"].SPECULAR_EXPONENT.key: {
                        const materialIndex = this.vertexMaterialIndices[i];
                        const material = this.materialsByIndex[materialIndex];
                        if (!material) {
                            console.warn('Material "' +
                                this.materialNames[materialIndex] +
                                '" not found in mesh. Did you forget to call addMaterialLibrary(...)?"');
                            break;
                        }
                        dataView.setFloat32(offset, material.specularExponent, true);
                        break;
                    }
                    case _layout__WEBPACK_IMPORTED_MODULE_0__["Layout"].EMISSIVE.key: {
                        const materialIndex = this.vertexMaterialIndices[i];
                        const material = this.materialsByIndex[materialIndex];
                        if (!material) {
                            console.warn('Material "' +
                                this.materialNames[materialIndex] +
                                '" not found in mesh. Did you forget to call addMaterialLibrary(...)?"');
                            break;
                        }
                        dataView.setFloat32(offset, material.emissive[0], true);
                        dataView.setFloat32(offset + 4, material.emissive[1], true);
                        dataView.setFloat32(offset + 8, material.emissive[2], true);
                        break;
                    }
                    case _layout__WEBPACK_IMPORTED_MODULE_0__["Layout"].TRANSMISSION_FILTER.key: {
                        const materialIndex = this.vertexMaterialIndices[i];
                        const material = this.materialsByIndex[materialIndex];
                        if (!material) {
                            console.warn('Material "' +
                                this.materialNames[materialIndex] +
                                '" not found in mesh. Did you forget to call addMaterialLibrary(...)?"');
                            break;
                        }
                        dataView.setFloat32(offset, material.transmissionFilter[0], true);
                        dataView.setFloat32(offset + 4, material.transmissionFilter[1], true);
                        dataView.setFloat32(offset + 8, material.transmissionFilter[2], true);
                        break;
                    }
                    case _layout__WEBPACK_IMPORTED_MODULE_0__["Layout"].DISSOLVE.key: {
                        const materialIndex = this.vertexMaterialIndices[i];
                        const material = this.materialsByIndex[materialIndex];
                        if (!material) {
                            console.warn('Material "' +
                                this.materialNames[materialIndex] +
                                '" not found in mesh. Did you forget to call addMaterialLibrary(...)?"');
                            break;
                        }
                        dataView.setFloat32(offset, material.dissolve, true);
                        break;
                    }
                    case _layout__WEBPACK_IMPORTED_MODULE_0__["Layout"].ILLUMINATION.key: {
                        const materialIndex = this.vertexMaterialIndices[i];
                        const material = this.materialsByIndex[materialIndex];
                        if (!material) {
                            console.warn('Material "' +
                                this.materialNames[materialIndex] +
                                '" not found in mesh. Did you forget to call addMaterialLibrary(...)?"');
                            break;
                        }
                        dataView.setInt16(offset, material.illumination, true);
                        break;
                    }
                    case _layout__WEBPACK_IMPORTED_MODULE_0__["Layout"].REFRACTION_INDEX.key: {
                        const materialIndex = this.vertexMaterialIndices[i];
                        const material = this.materialsByIndex[materialIndex];
                        if (!material) {
                            console.warn('Material "' +
                                this.materialNames[materialIndex] +
                                '" not found in mesh. Did you forget to call addMaterialLibrary(...)?"');
                            break;
                        }
                        dataView.setFloat32(offset, material.refractionIndex, true);
                        break;
                    }
                    case _layout__WEBPACK_IMPORTED_MODULE_0__["Layout"].SHARPNESS.key: {
                        const materialIndex = this.vertexMaterialIndices[i];
                        const material = this.materialsByIndex[materialIndex];
                        if (!material) {
                            console.warn('Material "' +
                                this.materialNames[materialIndex] +
                                '" not found in mesh. Did you forget to call addMaterialLibrary(...)?"');
                            break;
                        }
                        dataView.setFloat32(offset, material.sharpness, true);
                        break;
                    }
                    case _layout__WEBPACK_IMPORTED_MODULE_0__["Layout"].ANTI_ALIASING.key: {
                        const materialIndex = this.vertexMaterialIndices[i];
                        const material = this.materialsByIndex[materialIndex];
                        if (!material) {
                            console.warn('Material "' +
                                this.materialNames[materialIndex] +
                                '" not found in mesh. Did you forget to call addMaterialLibrary(...)?"');
                            break;
                        }
                        dataView.setInt16(offset, material.antiAliasing ? 1 : 0, true);
                        break;
                    }
                }
            }
        }
        return buffer;
    }
    makeIndexBufferData() {
        const buffer = new Uint16Array(this.indices);
        buffer.numItems = this.indices.length;
        return buffer;
    }
    makeIndexBufferDataForMaterials(...materialIndices) {
        const indices = new Array().concat(...materialIndices.map(mtlIdx => this.indicesPerMaterial[mtlIdx]));
        const buffer = new Uint16Array(indices);
        buffer.numItems = indices.length;
        return buffer;
    }
    addMaterialLibrary(mtl) {
        for (const name in mtl.materials) {
            if (!(name in this.materialIndices)) {
                // This material is not referenced by the mesh
                continue;
            }
            const material = mtl.materials[name];
            // Find the material index for this material
            const materialIndex = this.materialIndices[material.name];
            // Put the material into the materialsByIndex object at the right
            // spot as determined when the obj file was parsed
            this.materialsByIndex[materialIndex] = material;
        }
    }
}
function* triangulate(elements) {
    if (elements.length <= 3) {
        yield elements;
    }
    else if (elements.length === 4) {
        yield [elements[0], elements[1], elements[2]];
        yield [elements[2], elements[3], elements[0]];
    }
    else {
        for (let i = 1; i < elements.length - 1; i++) {
            yield [elements[0], elements[i], elements[i + 1]];
        }
    }
}


//# sourceURL=webpack:///./src/mesh.ts?`)},"./src/utils.ts":function(module,__webpack_exports__,__webpack_require__){"use strict";eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "downloadModels", function() { return downloadModels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "downloadMeshes", function() { return downloadMeshes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initMeshBuffers", function() { return initMeshBuffers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteMeshBuffers", function() { return deleteMeshBuffers; });
/* harmony import */ var _mesh__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mesh */ "./src/mesh.ts");
/* harmony import */ var _material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./material */ "./src/material.ts");


function downloadMtlTextures(mtl, root) {
    const mapAttributes = [
        "mapDiffuse",
        "mapAmbient",
        "mapSpecular",
        "mapDissolve",
        "mapBump",
        "mapDisplacement",
        "mapDecal",
        "mapEmissive",
    ];
    if (!root.endsWith("/")) {
        root += "/";
    }
    const textures = [];
    for (const materialName in mtl.materials) {
        if (!mtl.materials.hasOwnProperty(materialName)) {
            continue;
        }
        const material = mtl.materials[materialName];
        for (const attr of mapAttributes) {
            const mapData = material[attr];
            if (!mapData || !mapData.filename) {
                continue;
            }
            const url = root + mapData.filename;
            textures.push(fetch(url)
                .then(response => {
                if (!response.ok) {
                    throw new Error();
                }
                return response.blob();
            })
                .then(function (data) {
                const image = new Image();
                image.src = URL.createObjectURL(data);
                mapData.texture = image;
                return new Promise(resolve => (image.onload = resolve));
            })
                .catch(() => {
                console.error(\`Unable to download texture: \${url}\`);
            }));
        }
    }
    return Promise.all(textures);
}
function getMtl(modelOptions) {
    if (!(typeof modelOptions.mtl === "string")) {
        return modelOptions.obj.replace(/\\.obj$/, ".mtl");
    }
    return modelOptions.mtl;
}
/**
 * Accepts a list of model request objects and returns a Promise that
 * resolves when all models have been downloaded and parsed.
 *
 * The list of model objects follow this interface:
 * {
 *  obj: 'path/to/model.obj',
 *  mtl: true | 'path/to/model.mtl',
 *  downloadMtlTextures: true | false
 *  mtlTextureRoot: '/models/suzanne/maps'
 *  name: 'suzanne'
 * }
 *
 * The \`obj\` attribute is required and should be the path to the
 * model's .obj file relative to the current repo (absolute URLs are
 * suggested).
 *
 * The \`mtl\` attribute is optional and can either be a boolean or
 * a path to the model's .mtl file relative to the current URL. If
 * the value is \`true\`, then the path and basename given for the \`obj\`
 * attribute is used replacing the .obj suffix for .mtl
 * E.g.: {obj: 'models/foo.obj', mtl: true} would search for 'models/foo.mtl'
 *
 * The \`name\` attribute is optional and is a human friendly name to be
 * included with the parsed OBJ and MTL files. If not given, the base .obj
 * filename will be used.
 *
 * The \`downloadMtlTextures\` attribute is a flag for automatically downloading
 * any images found in the MTL file and attaching them to each Material
 * created from that file. For example, if material.mapDiffuse is set (there
 * was data in the MTL file), then material.mapDiffuse.texture will contain
 * the downloaded image. This option defaults to \`true\`. By default, the MTL's
 * URL will be used to determine the location of the images.
 *
 * The \`mtlTextureRoot\` attribute is optional and should point to the location
 * on the server that this MTL's texture files are located. The default is to
 * use the MTL file's location.
 *
 * @returns {Promise} the result of downloading the given list of models. The
 * promise will resolve with an object whose keys are the names of the models
 * and the value is its Mesh object. Each Mesh object will automatically
 * have its addMaterialLibrary() method called to set the given MTL data (if given).
 */
function downloadModels(models) {
    const finished = [];
    for (const model of models) {
        if (!model.obj) {
            throw new Error('"obj" attribute of model object not set. The .obj file is required to be set ' +
                "in order to use downloadModels()");
        }
        const options = {
            indicesPerMaterial: !!model.indicesPerMaterial,
            calcTangentsAndBitangents: !!model.calcTangentsAndBitangents,
        };
        // if the name is not provided, dervive it from the given OBJ
        let name = model.name;
        if (!name) {
            const parts = model.obj.split("/");
            name = parts[parts.length - 1].replace(".obj", "");
        }
        const namePromise = Promise.resolve(name);
        const meshPromise = fetch(model.obj)
            .then(response => response.text())
            .then(data => {
            return new _mesh__WEBPACK_IMPORTED_MODULE_0__["default"](data, options);
        });
        let mtlPromise;
        // Download MaterialLibrary file?
        if (model.mtl) {
            const mtl = getMtl(model);
            mtlPromise = fetch(mtl)
                .then(response => response.text())
                .then((data) => {
                const material = new _material__WEBPACK_IMPORTED_MODULE_1__["MaterialLibrary"](data);
                if (model.downloadMtlTextures !== false) {
                    let root = model.mtlTextureRoot;
                    if (!root) {
                        // get the directory of the MTL file as default
                        root = mtl.substr(0, mtl.lastIndexOf("/"));
                    }
                    // downloadMtlTextures returns a Promise that
                    // is resolved once all of the images it
                    // contains are downloaded. These are then
                    // attached to the map data objects
                    return Promise.all([Promise.resolve(material), downloadMtlTextures(material, root)]);
                }
                return Promise.all([Promise.resolve(material), undefined]);
            })
                .then((value) => {
                return value[0];
            });
        }
        const parsed = [namePromise, meshPromise, mtlPromise];
        finished.push(Promise.all(parsed));
    }
    return Promise.all(finished).then(ms => {
        // the "finished" promise is a list of name, Mesh instance,
        // and MaterialLibary instance. This unpacks and returns an
        // object mapping name to Mesh (Mesh points to MTL).
        const models = {};
        for (const model of ms) {
            const [name, mesh, mtl] = model;
            mesh.name = name;
            if (mtl) {
                mesh.addMaterialLibrary(mtl);
            }
            models[name] = mesh;
        }
        return models;
    });
}
/**
 * Takes in an object of \`mesh_name\`, \`'/url/to/OBJ/file'\` pairs and a callback
 * function. Each OBJ file will be ajaxed in and automatically converted to
 * an OBJ.Mesh. When all files have successfully downloaded the callback
 * function provided will be called and passed in an object containing
 * the newly created meshes.
 *
 * **Note:** In order to use this function as a way to download meshes, a
 * webserver of some sort must be used.
 *
 * @param {Object} nameAndAttrs an object where the key is the name of the mesh and the value is the url to that mesh's OBJ file
 *
 * @param {Function} completionCallback should contain a function that will take one parameter: an object array where the keys will be the unique object name and the value will be a Mesh object
 *
 * @param {Object} meshes In case other meshes are loaded separately or if a previously declared variable is desired to be used, pass in a (possibly empty) json object of the pattern: { '<mesh_name>': OBJ.Mesh }
 *
 */
function downloadMeshes(nameAndURLs, completionCallback, meshes) {
    if (meshes === undefined) {
        meshes = {};
    }
    const completed = [];
    for (const mesh_name in nameAndURLs) {
        if (!nameAndURLs.hasOwnProperty(mesh_name)) {
            continue;
        }
        const url = nameAndURLs[mesh_name];
        completed.push(fetch(url)
            .then(response => response.text())
            .then(data => {
            return [mesh_name, new _mesh__WEBPACK_IMPORTED_MODULE_0__["default"](data)];
        }));
    }
    Promise.all(completed).then(ms => {
        for (const [name, mesh] of ms) {
            meshes[name] = mesh;
        }
        return completionCallback(meshes);
    });
}
function _buildBuffer(gl, type, data, itemSize) {
    const buffer = gl.createBuffer();
    const arrayView = type === gl.ARRAY_BUFFER ? Float32Array : Uint16Array;
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, new arrayView(data), gl.STATIC_DRAW);
    buffer.itemSize = itemSize;
    buffer.numItems = data.length / itemSize;
    return buffer;
}
/**
 * Takes in the WebGL context and a Mesh, then creates and appends the buffers
 * to the mesh object as attributes.
 *
 * @param {WebGLRenderingContext} gl the \`canvas.getContext('webgl')\` context instance
 * @param {Mesh} mesh a single \`OBJ.Mesh\` instance
 *
 * The newly created mesh attributes are:
 *
 * Attrbute | Description
 * :--- | ---
 * **normalBuffer**       |contains the model&#39;s Vertex Normals
 * normalBuffer.itemSize  |set to 3 items
 * normalBuffer.numItems  |the total number of vertex normals
 * |
 * **textureBuffer**      |contains the model&#39;s Texture Coordinates
 * textureBuffer.itemSize |set to 2 items
 * textureBuffer.numItems |the number of texture coordinates
 * |
 * **vertexBuffer**       |contains the model&#39;s Vertex Position Coordinates (does not include w)
 * vertexBuffer.itemSize  |set to 3 items
 * vertexBuffer.numItems  |the total number of vertices
 * |
 * **indexBuffer**        |contains the indices of the faces
 * indexBuffer.itemSize   |is set to 1
 * indexBuffer.numItems   |the total number of indices
 *
 * A simple example (a lot of steps are missing, so don't copy and paste):
 *
 *     const gl   = canvas.getContext('webgl'),
 *         mesh = OBJ.Mesh(obj_file_data);
 *     // compile the shaders and create a shader program
 *     const shaderProgram = gl.createProgram();
 *     // compilation stuff here
 *     ...
 *     // make sure you have vertex, vertex normal, and texture coordinate
 *     // attributes located in your shaders and attach them to the shader program
 *     shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
 *     gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
 *
 *     shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
 *     gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
 *
 *     shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
 *     gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
 *
 *     // create and initialize the vertex, vertex normal, and texture coordinate buffers
 *     // and save on to the mesh object
 *     OBJ.initMeshBuffers(gl, mesh);
 *
 *     // now to render the mesh
 *     gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
 *     gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
 *     // it's possible that the mesh doesn't contain
 *     // any texture coordinates (e.g. suzanne.obj in the development branch).
 *     // in this case, the texture vertexAttribArray will need to be disabled
 *     // before the call to drawElements
 *     if(!mesh.textures.length){
 *       gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
 *     }
 *     else{
 *       // if the texture vertexAttribArray has been previously
 *       // disabled, then it needs to be re-enabled
 *       gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
 *       gl.bindBuffer(gl.ARRAY_BUFFER, mesh.textureBuffer);
 *       gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
 *     }
 *
 *     gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
 *     gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
 *
 *     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.mesh.indexBuffer);
 *     gl.drawElements(gl.TRIANGLES, model.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
 */
function initMeshBuffers(gl, mesh) {
    mesh.normalBuffer = _buildBuffer(gl, gl.ARRAY_BUFFER, mesh.vertexNormals, 3);
    mesh.textureBuffer = _buildBuffer(gl, gl.ARRAY_BUFFER, mesh.textures, mesh.textureStride);
    mesh.vertexBuffer = _buildBuffer(gl, gl.ARRAY_BUFFER, mesh.vertices, 3);
    mesh.indexBuffer = _buildBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, mesh.indices, 1);
    return mesh;
}
function deleteMeshBuffers(gl, mesh) {
    gl.deleteBuffer(mesh.normalBuffer);
    gl.deleteBuffer(mesh.textureBuffer);
    gl.deleteBuffer(mesh.vertexBuffer);
    gl.deleteBuffer(mesh.indexBuffer);
}


//# sourceURL=webpack:///./src/utils.ts?`)},0:function(module,exports,__webpack_require__){eval(`module.exports = __webpack_require__(/*! /home/aaron/google_drive/projects/webgl-obj-loader/src/index.ts */"./src/index.ts");


//# sourceURL=webpack:///multi_./src/index.ts?`)}})})});function un(t){return{width:Math.ceil(t.width),height:Math.ceil(t.height)}}var De=t=>t*Math.PI/180;function Ct(t){return t.constructor.name}function Oi(t){return Array.isArray(t)?"Array":typeof t=="object"?Ct(t):typeof t}function Rt(t,e,n){return Math.min(Math.max(t,e),n)}function Fi(t,e){let n;return(...r)=>{clearTimeout(n),n=setTimeout(()=>t(...r),e)}}var dt=(t,e,n,r)=>(n==="dgr"&&(t=De(t),e=De(e)),r[0]=Math.cos(t)*Math.sin(e),r[1]=Math.cos(e),r[2]=Math.sin(t)*Math.sin(e),r),ot=(t,e)=>Math.ceil(t/e),Ls=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],fn=(t,e)=>{let n=Ls.indexOf(e),r=Math.floor(Math.pow(1024,n));return t*r};var Gi=async t=>{let e=await fetch(t);if(!e.ok)throw`Could not download mesh file '${t}'`;return e.text()},Ni=async t=>(await fetch(t)).arrayBuffer(),Li=async(t,e,n,r)=>{let i=await fetch(e),o=await createImageBitmap(await i.blob()),a=t.createTexture({label:e,dimension:"2d",size:[o.width,o.height,1],format:n,usage:r});return t.queue.copyExternalImageToTexture({source:o},{texture:a},[o.width,o.height]),a};var Us=1,Te=4,X=4,Ui=8,ki=Te*2,pr=Te*3,J=Te*4,Rd=X*2,zi=X*4,Bd=Us*4,oe=Te*16,Vi=1e-6,Hi=.001,mr=3,Ce=3,Bt=window.Deno!==void 0;var dn=Bt,pn=Bt?"static/models":"models",mn="depth24plus",He="rgba16float",hn="rg16float",hr="r16float",$i=[0,1,0],D={FINAL:0,TILES:1,TILES_PPLL:2,HW_RENDER:3,USED_SLICES:4,DEPTH:5,NORMALS:6,AO:7},Ee={AXIS_X:0,AXIS_Y:1,AXIS_Z:2,NONE:3},xe={DENSITY:0,DENSITY_GRADIENT:1,VELOCITY:2,WIND:3},u={isTest:!1,githubRepoLink:"https://github.com/Scthe/frostbitten-hair-webgpu",loaders:{textFileReader:Gi,binaryFileReader:Ni,createTextureFromFile:Li},increaseStorageMemoryLimits:!0,displayMode:D.FINAL,clearColor:[.2,.2,.2,0],clearNormals:[0,0,0,0],clearAo:[0,0,0,0],background:{color0:at(22,162,188),color1:at(14,103,120),noiseScale:5,gradientStrength:.5},colliderGizmo:{lineLength:.04,lineWidth:.002,hoverPadding:1.5,activeAxis:Ee.NONE,isDragging:!1},drawColliders:!0,camera:{position:{position:[.25,1.6,.6],rotation:[-.4,.1]},projection:{fovDgr:30,near:.01,far:100},rotationSpeed:1,movementSpeed:.5,movementSpeedFaster:3},lightAmbient:{color:[1,1,1],energy:.05},lights:[{posPhi:60,posTheta:20,color:at(255,244,204),energy:.8},{posPhi:100,posTheta:97,color:at(204,249,255),energy:.8},{posPhi:-90,posTheta:30,color:at(255,242,204),energy:.8}],shadows:{showDebugView:!1,debugViewPosition:Bt?[0,0]:[250,0],depthFormat:"depth24plus",textureSize:1024*2,usePCSS:!1,PCF_Radius:3,bias:5e-4,strength:.4,hairFiberWidthMultiplier:1,source:{posPhi:37,posTheta:45,distance:5,target:[0,2,0]}},ao:{textureSizeMul:.5,radius:2,directionOffset:0,falloffStart2:.16,falloffEnd2:4,numDirections:12,numSteps:8,strength:.4},hairFile:"SintelHairOriginal-sintel_hair.16points.tfx",pointsPerStrand:-1,hairRender:{fiberRadius:6e-4,dbgTileModeMaxSegments:370,dbgSlicesModeMaxSlices:50,dbgShowTiles:!1,material:{color0:at(119,43,119),color1:at(76,0,255),specular:.9,weightTT:0,weightTRT:1.4,shift:0,roughness:.3,colorRng:.1,lumaRng:.1,attenuation:30,shadows:.5},shadingPoints:64,tileSize:8,tileDepthBins:32,avgSegmentsPerTile:128,invalidTilesPerSegmentThreshold:64*2,sortBuckets:64,sortBucketSize:16,slicesPerPixel:8,avgFragmentsPerSlice:16,processorCount:64*8,sliceHeadsMemory:"registers",alphaQuadratic:!1,alphaMultipler:1.1,lodRenderPercent:100},hairSimulation:{enabled:!0,deltaTime:1/30,nextFrameResetSimulation:!1,gravity:.03,friction:.3,volumePreservation:3e-5,collisionSphere:[-.18,1.56,.06,.06],collisionSphereInitial:[0,0,0,0],constraints:{constraintIterations:7,stiffnessLengthConstr:1,stiffnessGlobalConstr:.2,globalExtent:.1,globalFade:.75,stiffnessLocalConstr:.3,stiffnessCollisions:1,stiffnessSDF:1},wind:{dirPhi:18,dirTheta:91,strength:0,strengthLull:.75,strengthFrequency:1.8,strengthJitter:.7,phaseOffset:.45,colisionTraceOffset:1.5},physicsForcesGrid:{dims:64,enableUpdates:!0,scale:2,showDebugView:!1,debugSlice:.5,debugValue:xe.DENSITY_GRADIENT,debugAbsValue:!0},sdf:{distanceOffset:-.0015,showDebugView:!1,debugSlice:.5,debugSemitransparent:!0}},colors:{gamma:2.2,ditherStrength:1,exposure:.85}};function at(...t){if(t.length!==3)throw new Error(`Config color value ${JSON.stringify(t)} is invalid`);return t.map(e=>e/255)}var Ye=t=>Array(t).fill(0);function ks(t,e){let n=new t(e.length);return e.forEach((r,i)=>n[i]=r),n}function Ot(t,e){return e instanceof t?e:ks(t,e)}var gr=Bt,zs=1024,pt=2,Vs=zs*pt,Ft=()=>performance.now(),Hs=t=>Ft()-t,gn=class{_profileThisFrame=!1;hasRequiredFeature;queryPool;queryInProgressBuffer;resultsBuffer;currentFrameScopes=[];get enabled(){return this._profileThisFrame&&this.hasRequiredFeature}constructor(e){if(this.hasRequiredFeature=e.features.has("timestamp-query"),!this.hasRequiredFeature||gr){this.queryPool=void 0,this.queryInProgressBuffer=void 0,this.resultsBuffer=void 0;return}this.queryPool=e.createQuerySet({type:"timestamp",count:Vs}),this.queryInProgressBuffer=e.createBuffer({label:"profiler-in-progress",size:this.queryPool.count*Ui,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC}),this.resultsBuffer=e.createBuffer({label:"profiler-results",size:this.queryInProgressBuffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ})}profileNextFrame(e){this._profileThisFrame=e}beginFrame(){for(;this.currentFrameScopes.length>0;)this.currentFrameScopes.pop()}endFrame(e){if(!this.enabled||gr)return;let n=this.currentFrameScopes.length*pt;e.resolveQuerySet(this.queryPool,0,n,this.queryInProgressBuffer,0),this.resultsBuffer.mapState==="unmapped"&&e.copyBufferToBuffer(this.queryInProgressBuffer,0,this.resultsBuffer,0,this.resultsBuffer.size)}async scheduleRaportIfNeededAsync(e){if(!this.enabled||this.currentFrameScopes.length==0){this._profileThisFrame=!1;return}this._profileThisFrame=!1;let n=this.currentFrameScopes.slice();if(gr){let r=new BigInt64Array,i=this.parseScopeTimers(n,r);e?.(i);return}if(this.resultsBuffer.mapState==="unmapped"){await this.resultsBuffer.mapAsync(GPUMapMode.READ);let r=new BigInt64Array(this.resultsBuffer.getMappedRange()),i=this.parseScopeTimers(n,r);this.resultsBuffer.unmap(),e?.(i)}}parseScopeTimers(e,n){return e.map(([r,i,o],a)=>{let s=0;if(i==="gpu"){let l=n[a*pt],c=n[a*pt+1];s=Number(c-l)*Vi}else s=o;return[r,s]})}createScopeGpu(e){if(!this.enabled)return;let n=this.currentFrameScopes.length;return this.currentFrameScopes.push([e,"gpu",0]),{querySet:this.queryPool,beginningOfPassWriteIndex:n*pt,endOfPassWriteIndex:n*pt+1}}startRegionCpu(e){if(!this.enabled)return;let n=this.currentFrameScopes.length,r=performance.now();return this.currentFrameScopes.push([e,"cpu",r]),n}endRegionCpu(e){if(!this.enabled||e===void 0)return;let n=this.currentFrameScopes[e];if(n){let[r,i,o]=n;n[2]=Hs(o)}}};var _r=t=>t&&t.style.display!=="none",st=(t,e="block")=>{t&&(t.style.display=e)},_n=t=>{t&&(t.style.display="none")};var Wi={fps:{hideLabel:!0},ms:{hideLabel:!0},"Camera pos":{},"Camera rot":{},Strands:{},"Points per strand":{},Segments:{},Tiles:{},s0:{categoryName:"Memory"},"Tiles heads":{},"Tiles segments":{},"Slices heads":{}," \\ Per processor":{},"Slices data":{},"Hair FBO":{},"Physics grid":{},s1:{categoryName:"Render"},"Rendered strands":{},"Rendered segments":{}},ji=.95,$s=1e3,xr=class{values={};lastRenderedValues={};frameStart=0;deltaTimeMS=0;deltaTimeSmoothMS=void 0;parentEl;lastDOMUpdate=0;constructor(){window&&window.document?(this.parentEl=window.document.getElementById("stats-window"),this.frameStart=Ft(),this.lastDOMUpdate=this.frameStart):this.parentEl=void 0}update(e,n){this.values[e]=n}show=()=>st(this.parentEl);onBeginFrame=()=>{this.frameStart=Ft()};onEndFrame=()=>{let e=Ft();this.deltaTimeMS=e-this.frameStart,this.deltaTimeSmoothMS===void 0?this.deltaTimeSmoothMS=this.deltaTimeMS:this.deltaTimeSmoothMS=this.deltaTimeSmoothMS*ji+this.deltaTimeMS*(1-ji);let n=1/this.deltaTimeMS*1e3;this.update("fps",`${n.toFixed(2)} fps`),this.update("ms",`${this.deltaTimeMS.toFixed(2)}ms`),e-this.lastDOMUpdate>$s&&(this.lastDOMUpdate=e,setTimeout(this.renderStats,0))};printStats=()=>{let e="  ";console.log("STATS {"),Object.entries(Wi).forEach(([n,r])=>{let i=n;if(r.categoryName)console.log(`%c${e}--- ${r.categoryName} ---`,"color: blue");else{let o=this.values[i];o!=null&&console.log(`%c${e}${i}:`,"color: green",o)}}),console.log("}")};renderStats=()=>{let e=Array.from(this.parentEl.children);Object.entries(Wi).forEach(([n,r])=>{let i=n,o=this.getStatsHtmlEl(e,i,r);if(r.categoryName){o.textContent!==r.categoryName&&(o.innerHTML=r.categoryName),o.classList.add("stats-category-name");return}let a=this.values[i],s=this.lastRenderedValues[i];if(a==s)return;let l=`${i}: ${a}`;r.hideLabel&&(l=String(a)),o.innerHTML=l}),this.lastRenderedValues={...this.values}};getStatsHtmlEl=(e,n,r)=>{let i="data-stats-attr";if(r.el)return r.el;let o=e.find(a=>a.getAttribute(i)===n);return o||(o=document.createElement("p"),o.setAttribute(i,n),this.parentEl.appendChild(o)),r.el=o,o};setElVisible(e,n){n&&!_r(e)&&(st(e),this.lastRenderedValues={}),!n&&_r(e)&&(_n(e),this.lastRenderedValues={})}},z=new xr;function Se(t,e=0){if(t<=0)return"0 Bytes";let n=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],r=1024,i=Math.floor(Math.log(t)/Math.log(r));return`${(t/Math.pow(r,i)).toFixed(e)} ${n[i]}`}function xn(t,e=2){if(t===0)return"0";let n=t<0?"-":"";t=Math.abs(t);let r=["","k","m","b"],i=1e3,o=Math.floor(Math.log(t)/Math.log(i)),a=(t/Math.pow(i,o)).toFixed(e);return`${n}${a}${r[o]}`}function Sr(t,e,n=2){let r=e>0?t/e*100:0;return`${xn(t,n)} (${r.toFixed(1)}%)`}var Gt=u.hairRender.tileSize*u.hairRender.tileSize*u.hairRender.slicesPerPixel,Yi=u.hairRender.tileSize,Xi=Yi*Yi,Ws=u.hairRender.processorCount,Re=u.hairRender.sliceHeadsMemory,qi=()=>Re==="workgroup"?Gt*X:0,js=()=>Re==="workgroup"?Xi:Re==="global"?Ws:1,Ys=()=>Re==="workgroup"?"_local_invocation_index":Re==="global"?"processorId":"0u",Ki=`

const INVALID_SLICE_DATA_PTR: u32 = 0xffffffffu;

fn _getHeadsSliceIdx(
  processorId: u32,
  pixelInTile: vec2u, sliceIdx: u32,
) -> u32 {
  let OFFSET = ${js()}u;
  return (
    pixelInTile.y * OFFSET * TILE_SIZE * SLICES_PER_PIXEL +
    pixelInTile.x * OFFSET * SLICES_PER_PIXEL +
    sliceIdx * OFFSET +
    ${Ys()}
  );
}

fn _setSlicesHeadPtr(
  processorId: u32,
  pixelInTile: vec2u, sliceIdx: u32,
  nextPtr: u32
) -> u32 {
  let idx = _getHeadsSliceIdx(processorId, pixelInTile, sliceIdx);
  let prevPtr = _hairSliceHeads[idx];
  _hairSliceHeads[idx] = nextPtr;
  return prevPtr;
}

fn _getSlicesHeadPtr(
  processorId: u32,
  pixelInTile: vec2u, sliceIdx: u32,
) -> u32 {
  let idx = _getHeadsSliceIdx(processorId, pixelInTile, sliceIdx);
  return _hairSliceHeads[idx];
}

fn _clearSlicesHeadPtrs(pixelInTilePos: vec2u, processorId: u32) {
  for (var s: u32 = 0u; s < SLICES_PER_PIXEL; s += 1u) {
    _clearSliceHeadPtr(processorId, pixelInTilePos, s);
  }
}

fn _clearSliceHeadPtr(
  processorId: u32,
  pixelInTile: vec2u, sliceIdx: u32,
) {
  let idx = _getHeadsSliceIdx(processorId, pixelInTile, sliceIdx);
  _hairSliceHeads[idx] = INVALID_SLICE_DATA_PTR;
}
`,Xs=(t,e)=>`


@group(0) @binding(${t})
var<storage, ${e}> _hairSliceHeads: array<u32>;

${Ki}
`,qs=Re==="workgroup"?"workgroup":"private",Ks=Re==="workgroup"?Gt*Xi:Gt,Zs=(t,e)=>`

var<${qs}> _hairSliceHeads: array<u32, ${Ks}u>;

${Ki}
`,Zi=Re==="global"?Xs:Zs;function Js(t){let e=Qi();return t.createBuffer({label:"hair-slices-heads",size:Math.max(e,ve),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})}function Qs(t){Qi()}var Ji=Re==="global"?Js:Qs;function Qi(){let{processorCount:t}=u.hairRender,e=t*Gt,n=X,r=e*n,o={global:"VRAM",workgroup:"WKGRP",registers:"REGS"}[Re];return z.update("Slices heads",`${o} ${Se(r)}`),z.update(" \\ Per processor",Se(Gt*n)),r}var ve=256;async function eo(){try{let t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"}),e=a=>console.error(`WebGPU init error: '${a}'`);if(!t){e("No adapter found. WebGPU seems to be unavailable.");return}let n=t.features.has("timestamp-query"),r=["float32-filterable"];n&&r.push("timestamp-query");let i={};if(u.increaseStorageMemoryLimits){let a=t.limits;Number.isSafeInteger(a.maxStorageBufferBindingSize)&&(i.maxStorageBufferBindingSize=Number(a.maxStorageBufferBindingSize)),Number.isSafeInteger(a.maxBufferSize)&&(i.maxBufferSize=Number(a.maxBufferSize)),i.maxStorageBufferBindingSize||=fn(1024,"MB"),i.maxBufferSize||=fn(1024,"MB")}i.maxComputeWorkgroupStorageSize=Math.max(qi(),t.limits.maxComputeWorkgroupStorageSize||fn(16,"KB")),i.maxStorageBuffersPerShaderStage=10;let o=await t?.requestDevice({requiredFeatures:r,requiredLimits:i});if(!o){e("Failed to get GPUDevice from the adapter.");return}return o}catch(t){console.error(t);return}}function vr(t,e,n,r){let i=t.createBuffer({label:e,size:r.byteLength,usage:n});return t.queue.writeBuffer(i,0,r,0),i}function Sn(t,e,n,r=0){let i=Ot(Float32Array,n);return vr(t,e,GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|r,i)}function vn(t,e,n){let r=Ot(Uint32Array,n);return vr(t,e,GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST,r)}function be(t,e,n,r=0){let i=Ct(n);if(![Uint32Array.name,Float32Array.name,Int32Array.name].includes(i))throw new Error(`Invalid data provided to createGPU_StorageBuffer(). Expected TypedArray, got ${i}`);return vr(t,e,GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|r,n)}function Xe(t,e){t.clearBuffer(e,0,e.size)}var pe=ot,de=t=>t==="read_write"?"atomic<u32>":"u32",Nt=t=>t==="read_write"?"atomic<i32>":"i32",L=(t,e)=>({binding:t,resource:{buffer:e}});var el=t=>typeof t=="object"&&Ct(t)===GPUTextureView.name,$=t=>{if(!el(t))throw new Error(`Expected ${GPUTextureView.name}, got ${Oi(t)}`)};var lt={CAMERA_FORWARD:"w",CAMERA_BACK:"s",CAMERA_LEFT:"a",CAMERA_RIGHT:"d",CAMERA_UP:" ",CAMERA_DOWN:"z",CAMERA_GO_FASTER:"shift"},tl=()=>({directions:{forward:!1,backward:!1,left:!1,right:!1,up:!1,down:!1,goFaster:!1},mouse:{x:0,y:0,dragX:0,dragY:0,touching:!1}});function to(t,e){let{directions:n,mouse:r}=tl(),i=(o,a)=>{switch(o.key.toLowerCase()){case lt.CAMERA_FORWARD:n.forward=a,o.preventDefault(),o.stopPropagation();break;case lt.CAMERA_BACK:n.backward=a,o.preventDefault(),o.stopPropagation();break;case lt.CAMERA_LEFT:n.left=a,o.preventDefault(),o.stopPropagation();break;case lt.CAMERA_RIGHT:n.right=a,o.preventDefault(),o.stopPropagation();break;case lt.CAMERA_UP:n.up=a,o.preventDefault(),o.stopPropagation();break;case lt.CAMERA_DOWN:n.down=a,o.preventDefault(),o.stopPropagation();break;case lt.CAMERA_GO_FASTER:n.goFaster=a,o.preventDefault(),o.stopPropagation();break}};return t.addEventListener("keydown",o=>i(o,!0)),t.addEventListener("keyup",o=>i(o,!1)),e.style.touchAction="pinch-zoom",e.addEventListener("pointerdown",()=>{r.touching=!0}),e.addEventListener("pointerup",()=>{r.touching=!1}),e.addEventListener("pointermove",o=>{r.x=o.clientX,r.y=o.clientY,r.touching&&(r.dragX+=o.movementX,r.dragY+=o.movementY)}),()=>{let o={directions:{...n},mouse:{...r}};return r.dragX=0,r.dragY=0,o}}var Y=1e-6;var U=Float32Array;function nl(t){let e=U;return U=t,e}function no(t=0,e=0){let n=new U(2);return t!==void 0&&(n[0]=t,e!==void 0&&(n[1]=e)),n}var M=Float32Array;function rl(t){let e=M;return M=t,e}function me(t,e,n){let r=new M(3);return t!==void 0&&(r[0]=t,e!==void 0&&(r[1]=e,n!==void 0&&(r[2]=n))),r}var il=no;function ol(t,e,n){return n=n||new U(2),n[0]=t,n[1]=e,n}function al(t,e){return e=e||new U(2),e[0]=Math.ceil(t[0]),e[1]=Math.ceil(t[1]),e}function sl(t,e){return e=e||new U(2),e[0]=Math.floor(t[0]),e[1]=Math.floor(t[1]),e}function ll(t,e){return e=e||new U(2),e[0]=Math.round(t[0]),e[1]=Math.round(t[1]),e}function cl(t,e=0,n=1,r){return r=r||new U(2),r[0]=Math.min(n,Math.max(e,t[0])),r[1]=Math.min(n,Math.max(e,t[1])),r}function ul(t,e,n){return n=n||new U(2),n[0]=t[0]+e[0],n[1]=t[1]+e[1],n}function fl(t,e,n,r){return r=r||new U(2),r[0]=t[0]+e[0]*n,r[1]=t[1]+e[1]*n,r}function dl(t,e){let n=t[0],r=t[1],i=e[0],o=e[1],a=Math.sqrt(n*n+r*r),s=Math.sqrt(i*i+o*o),l=a*s,c=l&&ao(t,e)/l;return Math.acos(c)}function ro(t,e,n){return n=n||new U(2),n[0]=t[0]-e[0],n[1]=t[1]-e[1],n}var pl=ro;function ml(t,e){return Math.abs(t[0]-e[0])<Y&&Math.abs(t[1]-e[1])<Y}function hl(t,e){return t[0]===e[0]&&t[1]===e[1]}function io(t,e,n,r){return r=r||new U(2),r[0]=t[0]+n*(e[0]-t[0]),r[1]=t[1]+n*(e[1]-t[1]),r}function gl(t,e,n,r){return r=r||new U(2),r[0]=t[0]+n[0]*(e[0]-t[0]),r[1]=t[1]+n[1]*(e[1]-t[1]),r}function _l(t,e,n){return n=n||new U(2),n[0]=Math.max(t[0],e[0]),n[1]=Math.max(t[1],e[1]),n}function xl(t,e,n){return n=n||new U(2),n[0]=Math.min(t[0],e[0]),n[1]=Math.min(t[1],e[1]),n}function br(t,e,n){return n=n||new U(2),n[0]=t[0]*e,n[1]=t[1]*e,n}var Sl=br;function vl(t,e,n){return n=n||new U(2),n[0]=t[0]/e,n[1]=t[1]/e,n}function oo(t,e){return e=e||new U(2),e[0]=1/t[0],e[1]=1/t[1],e}var bl=oo;function wl(t,e,n){n=n||new M(3);let r=t[0]*e[1]-t[1]*e[0];return n[0]=0,n[1]=0,n[2]=r,n}function ao(t,e){return t[0]*e[0]+t[1]*e[1]}function wr(t){let e=t[0],n=t[1];return Math.sqrt(e*e+n*n)}var Pl=wr;function so(t){let e=t[0],n=t[1];return e*e+n*n}var yl=so;function lo(t,e){let n=t[0]-e[0],r=t[1]-e[1];return Math.sqrt(n*n+r*r)}var Tl=lo;function co(t,e){let n=t[0]-e[0],r=t[1]-e[1];return n*n+r*r}var El=co;function uo(t,e){e=e||new U(2);let n=t[0],r=t[1],i=Math.sqrt(n*n+r*r);return i>1e-5?(e[0]=n/i,e[1]=r/i):(e[0]=0,e[1]=0),e}function Il(t,e){return e=e||new U(2),e[0]=-t[0],e[1]=-t[1],e}function Pr(t,e){return e=e||new U(2),e[0]=t[0],e[1]=t[1],e}var Ml=Pr;function fo(t,e,n){return n=n||new U(2),n[0]=t[0]*e[0],n[1]=t[1]*e[1],n}var Al=fo;function po(t,e,n){return n=n||new U(2),n[0]=t[0]/e[0],n[1]=t[1]/e[1],n}var Dl=po;function Cl(t=1,e){e=e||new U(2);let n=Math.random()*2*Math.PI;return e[0]=Math.cos(n)*t,e[1]=Math.sin(n)*t,e}function Rl(t){return t=t||new U(2),t[0]=0,t[1]=0,t}function Bl(t,e,n){n=n||new U(2);let r=t[0],i=t[1];return n[0]=r*e[0]+i*e[4]+e[12],n[1]=r*e[1]+i*e[5]+e[13],n}function Ol(t,e,n){n=n||new U(2);let r=t[0],i=t[1];return n[0]=e[0]*r+e[4]*i+e[8],n[1]=e[1]*r+e[5]*i+e[9],n}function Fl(t,e,n,r){r=r||new U(2);let i=t[0]-e[0],o=t[1]-e[1],a=Math.sin(n),s=Math.cos(n);return r[0]=i*s-o*a+e[0],r[1]=i*a+o*s+e[1],r}function mo(t,e,n){return n=n||new U(2),uo(t,n),br(n,e,n)}function Gl(t,e,n){return n=n||new U(2),wr(t)>e?mo(t,e,n):Pr(t,n)}function Nl(t,e,n){return n=n||new U(2),io(t,e,.5,n)}var yr={__proto__:null,add:ul,addScaled:fl,angle:dl,ceil:al,clamp:cl,clone:Ml,copy:Pr,create:no,cross:wl,dist:Tl,distSq:El,distance:lo,distanceSq:co,div:Dl,divScalar:vl,divide:po,dot:ao,equals:hl,equalsApproximately:ml,floor:sl,fromValues:il,inverse:oo,invert:bl,len:Pl,lenSq:yl,length:wr,lengthSq:so,lerp:io,lerpV:gl,max:_l,midpoint:Nl,min:xl,mul:Al,mulScalar:br,multiply:fo,negate:Il,normalize:uo,random:Cl,rotate:Fl,round:ll,scale:Sl,set:ol,setDefaultType:nl,setLength:mo,sub:pl,subtract:ro,transformMat3:Ol,transformMat4:Bl,truncate:Gl,zero:Rl};var Ll=new Map([[Float32Array,()=>new Float32Array(12)],[Float64Array,()=>new Float64Array(12)],[Array,()=>new Array(12).fill(0)]]),rp=Ll.get(Float32Array);var Ul=me;function kl(t,e,n,r){return r=r||new M(3),r[0]=t,r[1]=e,r[2]=n,r}function zl(t,e){return e=e||new M(3),e[0]=Math.ceil(t[0]),e[1]=Math.ceil(t[1]),e[2]=Math.ceil(t[2]),e}function Vl(t,e){return e=e||new M(3),e[0]=Math.floor(t[0]),e[1]=Math.floor(t[1]),e[2]=Math.floor(t[2]),e}function Hl(t,e){return e=e||new M(3),e[0]=Math.round(t[0]),e[1]=Math.round(t[1]),e[2]=Math.round(t[2]),e}function $l(t,e=0,n=1,r){return r=r||new M(3),r[0]=Math.min(n,Math.max(e,t[0])),r[1]=Math.min(n,Math.max(e,t[1])),r[2]=Math.min(n,Math.max(e,t[2])),r}function Wl(t,e,n){return n=n||new M(3),n[0]=t[0]+e[0],n[1]=t[1]+e[1],n[2]=t[2]+e[2],n}function jl(t,e,n,r){return r=r||new M(3),r[0]=t[0]+e[0]*n,r[1]=t[1]+e[1]*n,r[2]=t[2]+e[2]*n,r}function Yl(t,e){let n=t[0],r=t[1],i=t[2],o=e[0],a=e[1],s=e[2],l=Math.sqrt(n*n+r*r+i*i),c=Math.sqrt(o*o+a*a+s*s),d=l*c,f=d&&_o(t,e)/d;return Math.acos(f)}function Lt(t,e,n){return n=n||new M(3),n[0]=t[0]-e[0],n[1]=t[1]-e[1],n[2]=t[2]-e[2],n}var Xl=Lt;function ql(t,e){return Math.abs(t[0]-e[0])<Y&&Math.abs(t[1]-e[1])<Y&&Math.abs(t[2]-e[2])<Y}function Kl(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]}function ho(t,e,n,r){return r=r||new M(3),r[0]=t[0]+n*(e[0]-t[0]),r[1]=t[1]+n*(e[1]-t[1]),r[2]=t[2]+n*(e[2]-t[2]),r}function Zl(t,e,n,r){return r=r||new M(3),r[0]=t[0]+n[0]*(e[0]-t[0]),r[1]=t[1]+n[1]*(e[1]-t[1]),r[2]=t[2]+n[2]*(e[2]-t[2]),r}function Jl(t,e,n){return n=n||new M(3),n[0]=Math.max(t[0],e[0]),n[1]=Math.max(t[1],e[1]),n[2]=Math.max(t[2],e[2]),n}function Ql(t,e,n){return n=n||new M(3),n[0]=Math.min(t[0],e[0]),n[1]=Math.min(t[1],e[1]),n[2]=Math.min(t[2],e[2]),n}function Tr(t,e,n){return n=n||new M(3),n[0]=t[0]*e,n[1]=t[1]*e,n[2]=t[2]*e,n}var ec=Tr;function tc(t,e,n){return n=n||new M(3),n[0]=t[0]/e,n[1]=t[1]/e,n[2]=t[2]/e,n}function go(t,e){return e=e||new M(3),e[0]=1/t[0],e[1]=1/t[1],e[2]=1/t[2],e}var nc=go;function ct(t,e,n){n=n||new M(3);let r=t[2]*e[0]-t[0]*e[2],i=t[0]*e[1]-t[1]*e[0];return n[0]=t[1]*e[2]-t[2]*e[1],n[1]=r,n[2]=i,n}function _o(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}function Er(t){let e=t[0],n=t[1],r=t[2];return Math.sqrt(e*e+n*n+r*r)}var rc=Er;function xo(t){let e=t[0],n=t[1],r=t[2];return e*e+n*n+r*r}var ic=xo;function So(t,e){let n=t[0]-e[0],r=t[1]-e[1],i=t[2]-e[2];return Math.sqrt(n*n+r*r+i*i)}var oc=So;function vo(t,e){let n=t[0]-e[0],r=t[1]-e[1],i=t[2]-e[2];return n*n+r*r+i*i}var ac=vo;function Ie(t,e){e=e||new M(3);let n=t[0],r=t[1],i=t[2],o=Math.sqrt(n*n+r*r+i*i);return o>1e-5?(e[0]=n/o,e[1]=r/o,e[2]=i/o):(e[0]=0,e[1]=0,e[2]=0),e}function sc(t,e){return e=e||new M(3),e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e}function Ir(t,e){return e=e||new M(3),e[0]=t[0],e[1]=t[1],e[2]=t[2],e}var lc=Ir;function bo(t,e,n){return n=n||new M(3),n[0]=t[0]*e[0],n[1]=t[1]*e[1],n[2]=t[2]*e[2],n}var cc=bo;function wo(t,e,n){return n=n||new M(3),n[0]=t[0]/e[0],n[1]=t[1]/e[1],n[2]=t[2]/e[2],n}var uc=wo;function fc(t=1,e){e=e||new M(3);let n=Math.random()*2*Math.PI,r=Math.random()*2-1,i=Math.sqrt(1-r*r)*t;return e[0]=Math.cos(n)*i,e[1]=Math.sin(n)*i,e[2]=r*t,e}function dc(t){return t=t||new M(3),t[0]=0,t[1]=0,t[2]=0,t}function pc(t,e,n){n=n||new M(3);let r=t[0],i=t[1],o=t[2],a=e[3]*r+e[7]*i+e[11]*o+e[15]||1;return n[0]=(e[0]*r+e[4]*i+e[8]*o+e[12])/a,n[1]=(e[1]*r+e[5]*i+e[9]*o+e[13])/a,n[2]=(e[2]*r+e[6]*i+e[10]*o+e[14])/a,n}function mc(t,e,n){n=n||new M(3);let r=t[0],i=t[1],o=t[2];return n[0]=r*e[0*4+0]+i*e[1*4+0]+o*e[2*4+0],n[1]=r*e[0*4+1]+i*e[1*4+1]+o*e[2*4+1],n[2]=r*e[0*4+2]+i*e[1*4+2]+o*e[2*4+2],n}function hc(t,e,n){n=n||new M(3);let r=t[0],i=t[1],o=t[2];return n[0]=r*e[0]+i*e[4]+o*e[8],n[1]=r*e[1]+i*e[5]+o*e[9],n[2]=r*e[2]+i*e[6]+o*e[10],n}function gc(t,e,n){n=n||new M(3);let r=e[0],i=e[1],o=e[2],a=e[3]*2,s=t[0],l=t[1],c=t[2],d=i*c-o*l,f=o*s-r*c,m=r*l-i*s;return n[0]=s+d*a+(i*m-o*f)*2,n[1]=l+f*a+(o*d-r*m)*2,n[2]=c+m*a+(r*f-i*d)*2,n}function _c(t,e){return e=e||new M(3),e[0]=t[12],e[1]=t[13],e[2]=t[14],e}function xc(t,e,n){n=n||new M(3);let r=e*4;return n[0]=t[r+0],n[1]=t[r+1],n[2]=t[r+2],n}function Sc(t,e){e=e||new M(3);let n=t[0],r=t[1],i=t[2],o=t[4],a=t[5],s=t[6],l=t[8],c=t[9],d=t[10];return e[0]=Math.sqrt(n*n+r*r+i*i),e[1]=Math.sqrt(o*o+a*a+s*s),e[2]=Math.sqrt(l*l+c*c+d*d),e}function vc(t,e,n,r){r=r||new M(3);let i=[],o=[];return i[0]=t[0]-e[0],i[1]=t[1]-e[1],i[2]=t[2]-e[2],o[0]=i[0],o[1]=i[1]*Math.cos(n)-i[2]*Math.sin(n),o[2]=i[1]*Math.sin(n)+i[2]*Math.cos(n),r[0]=o[0]+e[0],r[1]=o[1]+e[1],r[2]=o[2]+e[2],r}function bc(t,e,n,r){r=r||new M(3);let i=[],o=[];return i[0]=t[0]-e[0],i[1]=t[1]-e[1],i[2]=t[2]-e[2],o[0]=i[2]*Math.sin(n)+i[0]*Math.cos(n),o[1]=i[1],o[2]=i[2]*Math.cos(n)-i[0]*Math.sin(n),r[0]=o[0]+e[0],r[1]=o[1]+e[1],r[2]=o[2]+e[2],r}function wc(t,e,n,r){r=r||new M(3);let i=[],o=[];return i[0]=t[0]-e[0],i[1]=t[1]-e[1],i[2]=t[2]-e[2],o[0]=i[0]*Math.cos(n)-i[1]*Math.sin(n),o[1]=i[0]*Math.sin(n)+i[1]*Math.cos(n),o[2]=i[2],r[0]=o[0]+e[0],r[1]=o[1]+e[1],r[2]=o[2]+e[2],r}function Po(t,e,n){return n=n||new M(3),Ie(t,n),Tr(n,e,n)}function Pc(t,e,n){return n=n||new M(3),Er(t)>e?Po(t,e,n):Ir(t,n)}function yc(t,e,n){return n=n||new M(3),ho(t,e,.5,n)}var y={__proto__:null,add:Wl,addScaled:jl,angle:Yl,ceil:zl,clamp:$l,clone:lc,copy:Ir,create:me,cross:ct,dist:oc,distSq:ac,distance:So,distanceSq:vo,div:uc,divScalar:tc,divide:wo,dot:_o,equals:Kl,equalsApproximately:ql,floor:Vl,fromValues:Ul,getAxis:xc,getScaling:Sc,getTranslation:_c,inverse:go,invert:nc,len:rc,lenSq:ic,length:Er,lengthSq:xo,lerp:ho,lerpV:Zl,max:Jl,midpoint:yc,min:Ql,mul:cc,mulScalar:Tr,multiply:bo,negate:sc,normalize:Ie,random:fc,rotateX:vc,rotateY:bc,rotateZ:wc,round:Hl,scale:ec,set:kl,setDefaultType:rl,setLength:Po,sub:Xl,subtract:Lt,transformMat3:hc,transformMat4:pc,transformMat4Upper3x3:mc,transformQuat:gc,truncate:Pc,zero:dc},O=Float32Array;function Tc(t){let e=O;return O=t,e}function Ec(t,e,n,r,i,o,a,s,l,c,d,f,m,v,b,x){let g=new O(16);return t!==void 0&&(g[0]=t,e!==void 0&&(g[1]=e,n!==void 0&&(g[2]=n,r!==void 0&&(g[3]=r,i!==void 0&&(g[4]=i,o!==void 0&&(g[5]=o,a!==void 0&&(g[6]=a,s!==void 0&&(g[7]=s,l!==void 0&&(g[8]=l,c!==void 0&&(g[9]=c,d!==void 0&&(g[10]=d,f!==void 0&&(g[11]=f,m!==void 0&&(g[12]=m,v!==void 0&&(g[13]=v,b!==void 0&&(g[14]=b,x!==void 0&&(g[15]=x)))))))))))))))),g}function Ic(t,e,n,r,i,o,a,s,l,c,d,f,m,v,b,x,g){return g=g||new O(16),g[0]=t,g[1]=e,g[2]=n,g[3]=r,g[4]=i,g[5]=o,g[6]=a,g[7]=s,g[8]=l,g[9]=c,g[10]=d,g[11]=f,g[12]=m,g[13]=v,g[14]=b,g[15]=x,g}function Mc(t,e){return e=e||new O(16),e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=0,e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=0,e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Ac(t,e){e=e||new O(16);let n=t[0],r=t[1],i=t[2],o=t[3],a=n+n,s=r+r,l=i+i,c=n*a,d=r*a,f=r*s,m=i*a,v=i*s,b=i*l,x=o*a,g=o*s,T=o*l;return e[0]=1-f-b,e[1]=d+T,e[2]=m-g,e[3]=0,e[4]=d-T,e[5]=1-c-b,e[6]=v+x,e[7]=0,e[8]=m+g,e[9]=v-x,e[10]=1-c-f,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Dc(t,e){return e=e||new O(16),e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e[3]=-t[3],e[4]=-t[4],e[5]=-t[5],e[6]=-t[6],e[7]=-t[7],e[8]=-t[8],e[9]=-t[9],e[10]=-t[10],e[11]=-t[11],e[12]=-t[12],e[13]=-t[13],e[14]=-t[14],e[15]=-t[15],e}function Mr(t,e){return e=e||new O(16),e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}var Cc=Mr;function Rc(t,e){return Math.abs(t[0]-e[0])<Y&&Math.abs(t[1]-e[1])<Y&&Math.abs(t[2]-e[2])<Y&&Math.abs(t[3]-e[3])<Y&&Math.abs(t[4]-e[4])<Y&&Math.abs(t[5]-e[5])<Y&&Math.abs(t[6]-e[6])<Y&&Math.abs(t[7]-e[7])<Y&&Math.abs(t[8]-e[8])<Y&&Math.abs(t[9]-e[9])<Y&&Math.abs(t[10]-e[10])<Y&&Math.abs(t[11]-e[11])<Y&&Math.abs(t[12]-e[12])<Y&&Math.abs(t[13]-e[13])<Y&&Math.abs(t[14]-e[14])<Y&&Math.abs(t[15]-e[15])<Y}function Bc(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]&&t[6]===e[6]&&t[7]===e[7]&&t[8]===e[8]&&t[9]===e[9]&&t[10]===e[10]&&t[11]===e[11]&&t[12]===e[12]&&t[13]===e[13]&&t[14]===e[14]&&t[15]===e[15]}function yo(t){return t=t||new O(16),t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function Oc(t,e){if(e=e||new O(16),e===t){let P;return P=t[1],t[1]=t[4],t[4]=P,P=t[2],t[2]=t[8],t[8]=P,P=t[3],t[3]=t[12],t[12]=P,P=t[6],t[6]=t[9],t[9]=P,P=t[7],t[7]=t[13],t[13]=P,P=t[11],t[11]=t[14],t[14]=P,e}let n=t[0*4+0],r=t[0*4+1],i=t[0*4+2],o=t[0*4+3],a=t[1*4+0],s=t[1*4+1],l=t[1*4+2],c=t[1*4+3],d=t[2*4+0],f=t[2*4+1],m=t[2*4+2],v=t[2*4+3],b=t[3*4+0],x=t[3*4+1],g=t[3*4+2],T=t[3*4+3];return e[0]=n,e[1]=a,e[2]=d,e[3]=b,e[4]=r,e[5]=s,e[6]=f,e[7]=x,e[8]=i,e[9]=l,e[10]=m,e[11]=g,e[12]=o,e[13]=c,e[14]=v,e[15]=T,e}function To(t,e){e=e||new O(16);let n=t[0*4+0],r=t[0*4+1],i=t[0*4+2],o=t[0*4+3],a=t[1*4+0],s=t[1*4+1],l=t[1*4+2],c=t[1*4+3],d=t[2*4+0],f=t[2*4+1],m=t[2*4+2],v=t[2*4+3],b=t[3*4+0],x=t[3*4+1],g=t[3*4+2],T=t[3*4+3],P=m*T,_=g*v,S=l*T,E=g*c,N=l*v,R=m*c,V=i*T,w=g*o,Q=i*v,ne=m*o,re=i*c,le=l*o,ce=d*x,ue=b*f,fe=a*x,ge=b*s,_e=a*f,nn=d*s,rn=n*x,on=b*r,an=n*f,sn=d*r,ln=n*s,cn=a*r,Ai=P*s+E*f+N*x-(_*s+S*f+R*x),Di=_*r+V*f+ne*x-(P*r+w*f+Q*x),Ci=S*r+w*s+re*x-(E*r+V*s+le*x),Ri=R*r+Q*s+le*f-(N*r+ne*s+re*f),ie=1/(n*Ai+a*Di+d*Ci+b*Ri);return e[0]=ie*Ai,e[1]=ie*Di,e[2]=ie*Ci,e[3]=ie*Ri,e[4]=ie*(_*a+S*d+R*b-(P*a+E*d+N*b)),e[5]=ie*(P*n+w*d+Q*b-(_*n+V*d+ne*b)),e[6]=ie*(E*n+V*a+le*b-(S*n+w*a+re*b)),e[7]=ie*(N*n+ne*a+re*d-(R*n+Q*a+le*d)),e[8]=ie*(ce*c+ge*v+_e*T-(ue*c+fe*v+nn*T)),e[9]=ie*(ue*o+rn*v+sn*T-(ce*o+on*v+an*T)),e[10]=ie*(fe*o+on*c+ln*T-(ge*o+rn*c+cn*T)),e[11]=ie*(nn*o+an*c+cn*v-(_e*o+sn*c+ln*v)),e[12]=ie*(fe*m+nn*g+ue*l-(_e*g+ce*l+ge*m)),e[13]=ie*(an*g+ce*i+on*m-(rn*m+sn*g+ue*i)),e[14]=ie*(rn*l+cn*g+ge*i-(ln*g+fe*i+on*l)),e[15]=ie*(ln*m+_e*i+sn*l-(an*l+cn*m+nn*i)),e}function Fc(t){let e=t[0],n=t[0*4+1],r=t[0*4+2],i=t[0*4+3],o=t[1*4+0],a=t[1*4+1],s=t[1*4+2],l=t[1*4+3],c=t[2*4+0],d=t[2*4+1],f=t[2*4+2],m=t[2*4+3],v=t[3*4+0],b=t[3*4+1],x=t[3*4+2],g=t[3*4+3],T=f*g,P=x*m,_=s*g,S=x*l,E=s*m,N=f*l,R=r*g,V=x*i,w=r*m,Q=f*i,ne=r*l,re=s*i,le=T*a+S*d+E*b-(P*a+_*d+N*b),ce=P*n+R*d+Q*b-(T*n+V*d+w*b),ue=_*n+V*a+ne*b-(S*n+R*a+re*b),fe=N*n+w*a+re*d-(E*n+Q*a+ne*d);return e*le+o*ce+c*ue+v*fe}var Gc=To;function Eo(t,e,n){n=n||new O(16);let r=t[0],i=t[1],o=t[2],a=t[3],s=t[4],l=t[5],c=t[6],d=t[7],f=t[8],m=t[9],v=t[10],b=t[11],x=t[12],g=t[13],T=t[14],P=t[15],_=e[0],S=e[1],E=e[2],N=e[3],R=e[4],V=e[5],w=e[6],Q=e[7],ne=e[8],re=e[9],le=e[10],ce=e[11],ue=e[12],fe=e[13],ge=e[14],_e=e[15];return n[0]=r*_+s*S+f*E+x*N,n[1]=i*_+l*S+m*E+g*N,n[2]=o*_+c*S+v*E+T*N,n[3]=a*_+d*S+b*E+P*N,n[4]=r*R+s*V+f*w+x*Q,n[5]=i*R+l*V+m*w+g*Q,n[6]=o*R+c*V+v*w+T*Q,n[7]=a*R+d*V+b*w+P*Q,n[8]=r*ne+s*re+f*le+x*ce,n[9]=i*ne+l*re+m*le+g*ce,n[10]=o*ne+c*re+v*le+T*ce,n[11]=a*ne+d*re+b*le+P*ce,n[12]=r*ue+s*fe+f*ge+x*_e,n[13]=i*ue+l*fe+m*ge+g*_e,n[14]=o*ue+c*fe+v*ge+T*_e,n[15]=a*ue+d*fe+b*ge+P*_e,n}var Nc=Eo;function Lc(t,e,n){return n=n||yo(),t!==n&&(n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n[9]=t[9],n[10]=t[10],n[11]=t[11]),n[12]=e[0],n[13]=e[1],n[14]=e[2],n[15]=1,n}function Uc(t,e){return e=e||me(),e[0]=t[12],e[1]=t[13],e[2]=t[14],e}function kc(t,e,n){n=n||me();let r=e*4;return n[0]=t[r+0],n[1]=t[r+1],n[2]=t[r+2],n}function zc(t,e,n,r){r!==t&&(r=Mr(t,r));let i=n*4;return r[i+0]=e[0],r[i+1]=e[1],r[i+2]=e[2],r}function Vc(t,e){e=e||me();let n=t[0],r=t[1],i=t[2],o=t[4],a=t[5],s=t[6],l=t[8],c=t[9],d=t[10];return e[0]=Math.sqrt(n*n+r*r+i*i),e[1]=Math.sqrt(o*o+a*a+s*s),e[2]=Math.sqrt(l*l+c*c+d*d),e}function Hc(t,e,n,r,i){i=i||new O(16);let o=Math.tan(Math.PI*.5-.5*t);if(i[0]=o/e,i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[5]=o,i[6]=0,i[7]=0,i[8]=0,i[9]=0,i[11]=-1,i[12]=0,i[13]=0,i[15]=0,Number.isFinite(r)){let a=1/(n-r);i[10]=r*a,i[14]=r*n*a}else i[10]=-1,i[14]=-n;return i}function $c(t,e,n,r=1/0,i){i=i||new O(16);let o=1/Math.tan(t*.5);if(i[0]=o/e,i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[5]=o,i[6]=0,i[7]=0,i[8]=0,i[9]=0,i[11]=-1,i[12]=0,i[13]=0,i[15]=0,r===1/0)i[10]=0,i[14]=n;else{let a=1/(r-n);i[10]=n*a,i[14]=r*n*a}return i}function Wc(t,e,n,r,i,o,a){return a=a||new O(16),a[0]=2/(e-t),a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=2/(r-n),a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=1/(i-o),a[11]=0,a[12]=(e+t)/(t-e),a[13]=(r+n)/(n-r),a[14]=i/(i-o),a[15]=1,a}function jc(t,e,n,r,i,o,a){a=a||new O(16);let s=e-t,l=r-n,c=i-o;return a[0]=2*i/s,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=2*i/l,a[6]=0,a[7]=0,a[8]=(t+e)/s,a[9]=(r+n)/l,a[10]=o/c,a[11]=-1,a[12]=0,a[13]=0,a[14]=i*o/c,a[15]=0,a}function Yc(t,e,n,r,i,o=1/0,a){a=a||new O(16);let s=e-t,l=r-n;if(a[0]=2*i/s,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=2*i/l,a[6]=0,a[7]=0,a[8]=(t+e)/s,a[9]=(r+n)/l,a[11]=-1,a[12]=0,a[13]=0,a[15]=0,o===1/0)a[10]=0,a[14]=i;else{let c=1/(o-i);a[10]=i*c,a[14]=o*i*c}return a}var W,q,k;function Xc(t,e,n,r){return r=r||new O(16),W=W||me(),q=q||me(),k=k||me(),Ie(Lt(e,t,k),k),Ie(ct(n,k,W),W),Ie(ct(k,W,q),q),r[0]=W[0],r[1]=W[1],r[2]=W[2],r[3]=0,r[4]=q[0],r[5]=q[1],r[6]=q[2],r[7]=0,r[8]=k[0],r[9]=k[1],r[10]=k[2],r[11]=0,r[12]=t[0],r[13]=t[1],r[14]=t[2],r[15]=1,r}function qc(t,e,n,r){return r=r||new O(16),W=W||me(),q=q||me(),k=k||me(),Ie(Lt(t,e,k),k),Ie(ct(n,k,W),W),Ie(ct(k,W,q),q),r[0]=W[0],r[1]=W[1],r[2]=W[2],r[3]=0,r[4]=q[0],r[5]=q[1],r[6]=q[2],r[7]=0,r[8]=k[0],r[9]=k[1],r[10]=k[2],r[11]=0,r[12]=t[0],r[13]=t[1],r[14]=t[2],r[15]=1,r}function Kc(t,e,n,r){return r=r||new O(16),W=W||me(),q=q||me(),k=k||me(),Ie(Lt(t,e,k),k),Ie(ct(n,k,W),W),Ie(ct(k,W,q),q),r[0]=W[0],r[1]=q[0],r[2]=k[0],r[3]=0,r[4]=W[1],r[5]=q[1],r[6]=k[1],r[7]=0,r[8]=W[2],r[9]=q[2],r[10]=k[2],r[11]=0,r[12]=-(W[0]*t[0]+W[1]*t[1]+W[2]*t[2]),r[13]=-(q[0]*t[0]+q[1]*t[1]+q[2]*t[2]),r[14]=-(k[0]*t[0]+k[1]*t[1]+k[2]*t[2]),r[15]=1,r}function Zc(t,e){return e=e||new O(16),e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=t[0],e[13]=t[1],e[14]=t[2],e[15]=1,e}function Jc(t,e,n){n=n||new O(16);let r=e[0],i=e[1],o=e[2],a=t[0],s=t[1],l=t[2],c=t[3],d=t[1*4+0],f=t[1*4+1],m=t[1*4+2],v=t[1*4+3],b=t[2*4+0],x=t[2*4+1],g=t[2*4+2],T=t[2*4+3],P=t[3*4+0],_=t[3*4+1],S=t[3*4+2],E=t[3*4+3];return t!==n&&(n[0]=a,n[1]=s,n[2]=l,n[3]=c,n[4]=d,n[5]=f,n[6]=m,n[7]=v,n[8]=b,n[9]=x,n[10]=g,n[11]=T),n[12]=a*r+d*i+b*o+P,n[13]=s*r+f*i+x*o+_,n[14]=l*r+m*i+g*o+S,n[15]=c*r+v*i+T*o+E,n}function Qc(t,e){e=e||new O(16);let n=Math.cos(t),r=Math.sin(t);return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=n,e[6]=r,e[7]=0,e[8]=0,e[9]=-r,e[10]=n,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function eu(t,e,n){n=n||new O(16);let r=t[4],i=t[5],o=t[6],a=t[7],s=t[8],l=t[9],c=t[10],d=t[11],f=Math.cos(e),m=Math.sin(e);return n[4]=f*r+m*s,n[5]=f*i+m*l,n[6]=f*o+m*c,n[7]=f*a+m*d,n[8]=f*s-m*r,n[9]=f*l-m*i,n[10]=f*c-m*o,n[11]=f*d-m*a,t!==n&&(n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15]),n}function tu(t,e){e=e||new O(16);let n=Math.cos(t),r=Math.sin(t);return e[0]=n,e[1]=0,e[2]=-r,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=r,e[9]=0,e[10]=n,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function nu(t,e,n){n=n||new O(16);let r=t[0*4+0],i=t[0*4+1],o=t[0*4+2],a=t[0*4+3],s=t[2*4+0],l=t[2*4+1],c=t[2*4+2],d=t[2*4+3],f=Math.cos(e),m=Math.sin(e);return n[0]=f*r-m*s,n[1]=f*i-m*l,n[2]=f*o-m*c,n[3]=f*a-m*d,n[8]=f*s+m*r,n[9]=f*l+m*i,n[10]=f*c+m*o,n[11]=f*d+m*a,t!==n&&(n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15]),n}function ru(t,e){e=e||new O(16);let n=Math.cos(t),r=Math.sin(t);return e[0]=n,e[1]=r,e[2]=0,e[3]=0,e[4]=-r,e[5]=n,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function iu(t,e,n){n=n||new O(16);let r=t[0*4+0],i=t[0*4+1],o=t[0*4+2],a=t[0*4+3],s=t[1*4+0],l=t[1*4+1],c=t[1*4+2],d=t[1*4+3],f=Math.cos(e),m=Math.sin(e);return n[0]=f*r+m*s,n[1]=f*i+m*l,n[2]=f*o+m*c,n[3]=f*a+m*d,n[4]=f*s-m*r,n[5]=f*l-m*i,n[6]=f*c-m*o,n[7]=f*d-m*a,t!==n&&(n[8]=t[8],n[9]=t[9],n[10]=t[10],n[11]=t[11],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15]),n}function Io(t,e,n){n=n||new O(16);let r=t[0],i=t[1],o=t[2],a=Math.sqrt(r*r+i*i+o*o);r/=a,i/=a,o/=a;let s=r*r,l=i*i,c=o*o,d=Math.cos(e),f=Math.sin(e),m=1-d;return n[0]=s+(1-s)*d,n[1]=r*i*m+o*f,n[2]=r*o*m-i*f,n[3]=0,n[4]=r*i*m-o*f,n[5]=l+(1-l)*d,n[6]=i*o*m+r*f,n[7]=0,n[8]=r*o*m+i*f,n[9]=i*o*m-r*f,n[10]=c+(1-c)*d,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,n}var ou=Io;function Mo(t,e,n,r){r=r||new O(16);let i=e[0],o=e[1],a=e[2],s=Math.sqrt(i*i+o*o+a*a);i/=s,o/=s,a/=s;let l=i*i,c=o*o,d=a*a,f=Math.cos(n),m=Math.sin(n),v=1-f,b=l+(1-l)*f,x=i*o*v+a*m,g=i*a*v-o*m,T=i*o*v-a*m,P=c+(1-c)*f,_=o*a*v+i*m,S=i*a*v+o*m,E=o*a*v-i*m,N=d+(1-d)*f,R=t[0],V=t[1],w=t[2],Q=t[3],ne=t[4],re=t[5],le=t[6],ce=t[7],ue=t[8],fe=t[9],ge=t[10],_e=t[11];return r[0]=b*R+x*ne+g*ue,r[1]=b*V+x*re+g*fe,r[2]=b*w+x*le+g*ge,r[3]=b*Q+x*ce+g*_e,r[4]=T*R+P*ne+_*ue,r[5]=T*V+P*re+_*fe,r[6]=T*w+P*le+_*ge,r[7]=T*Q+P*ce+_*_e,r[8]=S*R+E*ne+N*ue,r[9]=S*V+E*re+N*fe,r[10]=S*w+E*le+N*ge,r[11]=S*Q+E*ce+N*_e,t!==r&&(r[12]=t[12],r[13]=t[13],r[14]=t[14],r[15]=t[15]),r}var au=Mo;function su(t,e){return e=e||new O(16),e[0]=t[0],e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=t[1],e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=t[2],e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function lu(t,e,n){n=n||new O(16);let r=e[0],i=e[1],o=e[2];return n[0]=r*t[0*4+0],n[1]=r*t[0*4+1],n[2]=r*t[0*4+2],n[3]=r*t[0*4+3],n[4]=i*t[1*4+0],n[5]=i*t[1*4+1],n[6]=i*t[1*4+2],n[7]=i*t[1*4+3],n[8]=o*t[2*4+0],n[9]=o*t[2*4+1],n[10]=o*t[2*4+2],n[11]=o*t[2*4+3],t!==n&&(n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15]),n}function cu(t,e){return e=e||new O(16),e[0]=t,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=t,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=t,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function uu(t,e,n){return n=n||new O(16),n[0]=e*t[0*4+0],n[1]=e*t[0*4+1],n[2]=e*t[0*4+2],n[3]=e*t[0*4+3],n[4]=e*t[1*4+0],n[5]=e*t[1*4+1],n[6]=e*t[1*4+2],n[7]=e*t[1*4+3],n[8]=e*t[2*4+0],n[9]=e*t[2*4+1],n[10]=e*t[2*4+2],n[11]=e*t[2*4+3],t!==n&&(n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15]),n}var I={__proto__:null,aim:Xc,axisRotate:Mo,axisRotation:Io,cameraAim:qc,clone:Cc,copy:Mr,create:Ec,determinant:Fc,equals:Bc,equalsApproximately:Rc,fromMat3:Mc,fromQuat:Ac,frustum:jc,frustumReverseZ:Yc,getAxis:kc,getScaling:Vc,getTranslation:Uc,identity:yo,inverse:To,invert:Gc,lookAt:Kc,mul:Nc,multiply:Eo,negate:Dc,ortho:Wc,perspective:Hc,perspectiveReverseZ:$c,rotate:au,rotateX:eu,rotateY:nu,rotateZ:iu,rotation:ou,rotationX:Qc,rotationY:tu,rotationZ:ru,scale:lu,scaling:su,set:Ic,setAxis:zc,setDefaultType:Tc,setTranslation:Lc,translate:Jc,translation:Zc,transpose:Oc,uniformScale:uu,uniformScaling:cu};var H=Float32Array;function fu(t){let e=H;return H=t,e}function Ao(t,e,n,r){let i=new H(4);return t!==void 0&&(i[0]=t,e!==void 0&&(i[1]=e,n!==void 0&&(i[2]=n,r!==void 0&&(i[3]=r)))),i}var du=Ao;function pu(t,e,n,r,i){return i=i||new H(4),i[0]=t,i[1]=e,i[2]=n,i[3]=r,i}function mu(t,e){return e=e||new H(4),e[0]=Math.ceil(t[0]),e[1]=Math.ceil(t[1]),e[2]=Math.ceil(t[2]),e[3]=Math.ceil(t[3]),e}function hu(t,e){return e=e||new H(4),e[0]=Math.floor(t[0]),e[1]=Math.floor(t[1]),e[2]=Math.floor(t[2]),e[3]=Math.floor(t[3]),e}function gu(t,e){return e=e||new H(4),e[0]=Math.round(t[0]),e[1]=Math.round(t[1]),e[2]=Math.round(t[2]),e[3]=Math.round(t[3]),e}function _u(t,e=0,n=1,r){return r=r||new H(4),r[0]=Math.min(n,Math.max(e,t[0])),r[1]=Math.min(n,Math.max(e,t[1])),r[2]=Math.min(n,Math.max(e,t[2])),r[3]=Math.min(n,Math.max(e,t[3])),r}function xu(t,e,n){return n=n||new H(4),n[0]=t[0]+e[0],n[1]=t[1]+e[1],n[2]=t[2]+e[2],n[3]=t[3]+e[3],n}function Su(t,e,n,r){return r=r||new H(4),r[0]=t[0]+e[0]*n,r[1]=t[1]+e[1]*n,r[2]=t[2]+e[2]*n,r[3]=t[3]+e[3]*n,r}function Do(t,e,n){return n=n||new H(4),n[0]=t[0]-e[0],n[1]=t[1]-e[1],n[2]=t[2]-e[2],n[3]=t[3]-e[3],n}var vu=Do;function bu(t,e){return Math.abs(t[0]-e[0])<Y&&Math.abs(t[1]-e[1])<Y&&Math.abs(t[2]-e[2])<Y&&Math.abs(t[3]-e[3])<Y}function wu(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]}function Co(t,e,n,r){return r=r||new H(4),r[0]=t[0]+n*(e[0]-t[0]),r[1]=t[1]+n*(e[1]-t[1]),r[2]=t[2]+n*(e[2]-t[2]),r[3]=t[3]+n*(e[3]-t[3]),r}function Pu(t,e,n,r){return r=r||new H(4),r[0]=t[0]+n[0]*(e[0]-t[0]),r[1]=t[1]+n[1]*(e[1]-t[1]),r[2]=t[2]+n[2]*(e[2]-t[2]),r[3]=t[3]+n[3]*(e[3]-t[3]),r}function yu(t,e,n){return n=n||new H(4),n[0]=Math.max(t[0],e[0]),n[1]=Math.max(t[1],e[1]),n[2]=Math.max(t[2],e[2]),n[3]=Math.max(t[3],e[3]),n}function Tu(t,e,n){return n=n||new H(4),n[0]=Math.min(t[0],e[0]),n[1]=Math.min(t[1],e[1]),n[2]=Math.min(t[2],e[2]),n[3]=Math.min(t[3],e[3]),n}function Ar(t,e,n){return n=n||new H(4),n[0]=t[0]*e,n[1]=t[1]*e,n[2]=t[2]*e,n[3]=t[3]*e,n}var Eu=Ar;function Iu(t,e,n){return n=n||new H(4),n[0]=t[0]/e,n[1]=t[1]/e,n[2]=t[2]/e,n[3]=t[3]/e,n}function Ro(t,e){return e=e||new H(4),e[0]=1/t[0],e[1]=1/t[1],e[2]=1/t[2],e[3]=1/t[3],e}var Mu=Ro;function Au(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]+t[3]*e[3]}function Dr(t){let e=t[0],n=t[1],r=t[2],i=t[3];return Math.sqrt(e*e+n*n+r*r+i*i)}var Du=Dr;function Bo(t){let e=t[0],n=t[1],r=t[2],i=t[3];return e*e+n*n+r*r+i*i}var Cu=Bo;function Oo(t,e){let n=t[0]-e[0],r=t[1]-e[1],i=t[2]-e[2],o=t[3]-e[3];return Math.sqrt(n*n+r*r+i*i+o*o)}var Ru=Oo;function Fo(t,e){let n=t[0]-e[0],r=t[1]-e[1],i=t[2]-e[2],o=t[3]-e[3];return n*n+r*r+i*i+o*o}var Bu=Fo;function Go(t,e){e=e||new H(4);let n=t[0],r=t[1],i=t[2],o=t[3],a=Math.sqrt(n*n+r*r+i*i+o*o);return a>1e-5?(e[0]=n/a,e[1]=r/a,e[2]=i/a,e[3]=o/a):(e[0]=0,e[1]=0,e[2]=0,e[3]=0),e}function Ou(t,e){return e=e||new H(4),e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e[3]=-t[3],e}function Cr(t,e){return e=e||new H(4),e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e}var Fu=Cr;function No(t,e,n){return n=n||new H(4),n[0]=t[0]*e[0],n[1]=t[1]*e[1],n[2]=t[2]*e[2],n[3]=t[3]*e[3],n}var Gu=No;function Lo(t,e,n){return n=n||new H(4),n[0]=t[0]/e[0],n[1]=t[1]/e[1],n[2]=t[2]/e[2],n[3]=t[3]/e[3],n}var Nu=Lo;function Lu(t){return t=t||new H(4),t[0]=0,t[1]=0,t[2]=0,t[3]=0,t}function Uu(t,e,n){n=n||new H(4);let r=t[0],i=t[1],o=t[2],a=t[3];return n[0]=e[0]*r+e[4]*i+e[8]*o+e[12]*a,n[1]=e[1]*r+e[5]*i+e[9]*o+e[13]*a,n[2]=e[2]*r+e[6]*i+e[10]*o+e[14]*a,n[3]=e[3]*r+e[7]*i+e[11]*o+e[15]*a,n}function Uo(t,e,n){return n=n||new H(4),Go(t,n),Ar(n,e,n)}function ku(t,e,n){return n=n||new H(4),Dr(t)>e?Uo(t,e,n):Cr(t,n)}function zu(t,e,n){return n=n||new H(4),Co(t,e,.5,n)}var K={__proto__:null,add:xu,addScaled:Su,ceil:mu,clamp:_u,clone:Fu,copy:Cr,create:Ao,dist:Ru,distSq:Bu,distance:Oo,distanceSq:Fo,div:Nu,divScalar:Iu,divide:Lo,dot:Au,equals:wu,equalsApproximately:bu,floor:hu,fromValues:du,inverse:Ro,invert:Mu,len:Du,lenSq:Cu,length:Dr,lengthSq:Bo,lerp:Co,lerpV:Pu,max:yu,midpoint:zu,min:Tu,mul:Gu,mulScalar:Ar,multiply:No,negate:Ou,normalize:Go,round:gu,scale:Eu,set:pu,setDefaultType:fu,setLength:Uo,sub:vu,subtract:Do,transformMat4:Uu,truncate:ku,zero:Lu};var qe=class{constructor(e,n=0,r=0){this.buffer=e;this.byteOffset=n;this.byteSize=r;this.byteSize=r===0?e.byteLength:r,this.asF32=new Float32Array(e),this.asU32=new Uint32Array(e)}asF32;asU32;offsetBytes=0;f32=e=>this.asF32[e];u32=e=>this.asU32[e];cursor=()=>this.offsetBytes;resetCursor(){this.offsetBytes=0}padding(e){this.offsetBytes+=e}assertWrittenBytes(e){if(this.offsetBytes!==e)throw new Error(`Written invalid byte count ${this.offsetBytes}. Expected ${e}.`);if(this.offsetBytes%16!==0){let n=ot(this.offsetBytes,16)*16,r=(n-this.offsetBytes)/X;throw new Error(`Byte count ${this.offsetBytes} does not cleanly divide by 16. This might lead to errors. Add padding to fill to ${n} bytes (${r} u32 elements is enough).`)}}writeMat4(e){for(let n=0;n<16;n++)this.writeF32(e[n])}writeF32Array(e){for(let n=0;n<e.length;n++)this.writeF32(e[n])}writeF32(e){let n=(this.byteOffset+this.offsetBytes)/Te;this.asF32[n]=e,this.offsetBytes+=Te}writeU32(e){let n=(this.byteOffset+this.offsetBytes)/X;this.asU32[n]=Math.floor(e),this.offsetBytes+=X}upload(e,n,r){e.queue.writeBuffer(n,r,this.buffer,this.byteOffset,this.byteSize)}};var Be=t=>{let{tileSize:e}=u.hairRender;return{width:ot(t.width,e),height:ot(t.height,e)}};var Vu=`

fn _storeTileSegment(
  nextPtr: u32, prevPtr: u32,
  strandIdx: u32, segmentIdx: u32
) {
  let encodedSegment = (segmentIdx << 24) | strandIdx;
  _hairTileSegments.data[nextPtr].strandAndSegmentIdxs = encodedSegment;
  _hairTileSegments.data[nextPtr].next = prevPtr;
}
`,Hu=`

fn _getTileSegment(
  maxDrawnSegments: u32,
  tileSegmentPtr: u32,
  /** strandIdx, segmentIdx, nextPtr */
  result: ptr<function, vec3u>
) -> bool {
  if (tileSegmentPtr >= maxDrawnSegments || tileSegmentPtr == INVALID_TILE_SEGMENT_PTR) {
    return false;
  }

  let data = _hairTileSegments.data[tileSegmentPtr];
  (*result).x = data.strandAndSegmentIdxs & 0x00ffffff;
  (*result).y = data.strandAndSegmentIdxs >> 24;
  (*result).z = data.next;
  return true;
}
`,mt=(t,e)=>`

struct LinkedListElement {
  strandAndSegmentIdxs: u32,
  next: u32
};

struct DrawnHairSegments {
  drawnSegmentsCount: ${de(e)},
  data: array<LinkedListElement>
};

@group(0) @binding(${t})
var<storage, ${e}> _hairTileSegments: DrawnHairSegments;


${e=="read_write"?Vu:Hu}
`;function Rr(t){let e=Be(t);return 1+Math.ceil(e.width*e.height*u.hairRender.avgSegmentsPerTile)}function ko(t,e){let n=Rr(e),r=2*X,i=Math.max(n*r,ve);z.update("Tiles segments",Se(i));let o=u.isTest?GPUBufferUsage.COPY_SRC:0;return t.createBuffer({label:"hair-segments-per-tile",size:i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|o})}function Br(t,e){let n=e.width/e.height;return I.perspective(De(t.fovDgr),n,t.near,t.far)}function bn(t,e,n){return I.multiply(e,t,n)}function Or(t,e,n,r){return r=I.multiply(e,t,r),r=I.multiply(n,r,r),r}function ht(t,e,n){let r;if(e.length===4){if(e[3]!==1)throw new Error("Tried to project a point, but provided Vec4 has .w !== 1");r=e}else r=K.create(e[0],e[1],e[2],1);return K.transformMat4(r,t,n)}function Fr(t,e,n){let r=ht(t,e,n);return K.divScalar(r,r[3],r),r}var $u=I.create(),Wu=I.create(),ju=I.create(),Yu=y.create(),Gr=K.create();function Nr(){let t=u.shadows.source,e=dt(t.posPhi,t.posTheta,"dgr",Yu);return y.scale(e,t.distance,e),e}function zo(t){let e=Nr(),n=u.shadows.source,r=ht(t,n.target,Gr);return I.lookAt(e,r,$i,Wu)}var wn=1.05,Pn=9999999;function Vo(t,e,n){let r=I.multiply(e,t,ju),i=Pn,o=-Pn,a=Pn,s=-Pn,l=.1,c=20,d=f=>{let m=K.set(f.center[0],f.center[1],f.center[2],1,Gr),v=ht(r,m,Gr);i=Math.min(i,v[0]-f.radius),o=Math.max(o,v[0]+f.radius),a=Math.min(a,v[1]-f.radius),s=Math.max(s,v[1]+f.radius)};d(n.hairObject.bounds.sphere);for(let f of n.objects)f.isColliderPreview||d(f.bounds.sphere);return I.ortho(i*wn,o*wn,a*wn,s*wn,l,c,$u)}var Xu=500;function yn(t){return Math.floor(Math.min(Xu,t.width/3,t.height/3))}var ae=class{constructor(e,n,r,i,o,a){this.name=e;this.bounds=n;this.dims=r;this.texture=i;this.textureView=o;this.sampler=a;u.isTest||$(o);let[s,l]=n,c=y.subtract(l,s),d=y.scale(c,1/(r-1));u.isTest||console.log(`SDF collider '${e}' (dims=${r}, cellSize=${d}), bounds:`,n)}static SDF_DATA_SNIPPET=`
    struct SDFCollider {
      boundsMin: vec4f,
      boundsMax: vec4f,
    };

    fn getSdfDebugDepthSlice() -> f32 {
      var s = _uniforms.sdf.boundsMin.w;
      if (s > 1.0) { return s - 2.0; }
      return s;
    }
    fn isSdfDebugSemiTransparent() -> bool { return _uniforms.sdf.boundsMin.w > 1.0; }
    fn getSDF_Offset() -> f32 { return _uniforms.sdf.boundsMax.w; }
  `;static BUFFER_SIZE=2*J;static TEXTURE_SDF=(e,n)=>`
    @group(0) @binding(${e})
    var _sdfTexture: texture_3d<f32>;

    @group(0) @binding(${n}) 
    var _sdfSampler: sampler;

    fn sampleSDFCollider(sdfBoundsMin: vec3f, sdfBoundsMax: vec3f, p: vec3f) -> f32 {
      // TBH bounds can be as bound sphere if mesh is cube-ish in shape
      var t: vec3f = saturate(
        (p - sdfBoundsMin) / (sdfBoundsMax - sdfBoundsMin)
      );
      // t.y = 1.0 - t.y; // WebGPU reverted Y-axis
      // t.z = 1.0 - t.z; // WebGPU reverted Z-axis (I guess?)
      return textureSampleLevel(_sdfTexture, _sdfSampler, t, 0.0).x;
    }
  `;bindTexture=e=>({binding:e,resource:this.textureView});bindSampler=e=>({binding:e,resource:this.sampler});writeToDataView(e){let n=u.hairSimulation.sdf,[r,i]=this.bounds;e.writeF32(r[0]),e.writeF32(r[1]),e.writeF32(r[2]);let o=n.debugSemitransparent?2:0;e.writeF32(n.debugSlice+o),e.writeF32(i[0]),e.writeF32(i[1]),e.writeF32(i[2]),e.writeF32(n.distanceOffset)}};function Ho(t,e){let n=e?Zu(t,e):Lr(t);return{box:n,sphere:Ur(n)}}function qu(t,e=mr,n){let r=t.length/e,i=[0,0,0];for(let o=0;o<r;o++){let a=o*e;i[0]=t[a],i[1]=t[a+1],i[2]=t[a+2],n(i)}}function Ku(t,e,n){let r=[0,0,0];for(let i=0;i<e.length;i++){let o=e[i]*Ce;r[0]=t[o],r[1]=t[o+1],r[2]=t[o+2],n(r)}}function $o(){let t=[void 0,void 0,void 0],e=[void 0,void 0,void 0];return[[e,t],r=>{for(let i=0;i<3;i++)t[i]=t[i]!==void 0?Math.max(t[i],r[i]):r[i],e[i]=e[i]!==void 0?Math.min(e[i],r[i]):r[i]}]}function Lr(t,e=mr){let[n,r]=$o();return qu(t,e,r),n}function Zu(t,e){let[n,r]=$o();return Ku(t,e,r),n}function Ur([t,e]){let n=y.midpoint(t,e),r=y.distance(n,e);return{center:n,radius:r}}function Wo(t,e){if(e<=0)throw new Error(`Invalid scale=${e}`);let[n,r]=t,i=y.midpoint(n,r),o=y.subtract(r,i),a=y.scale(o,e);return[y.subtract(i,a),y.add(i,a)]}var kr=1e6,Ke=`

const GRID_DIMS: u32 = ${u.hairSimulation.physicsForcesGrid.dims}u;

// There are no float atomics in WGSL. Convert to i32
const GRID_FLOAT_TO_U32_MUL: f32 = ${kr};
fn gridEncodeValue(v: f32) -> i32 { return i32(v * GRID_FLOAT_TO_U32_MUL); }
fn gridDecodeValue(v: i32) -> f32 { return f32(v) / GRID_FLOAT_TO_U32_MUL; }


fn _getGridIdx(p: vec3u) -> u32 {
  return (
    clamp(p.z, 0u, GRID_DIMS - 1u) * GRID_DIMS * GRID_DIMS +
    clamp(p.y, 0u, GRID_DIMS - 1u) * GRID_DIMS +
    clamp(p.x, 0u, GRID_DIMS - 1u)
  );
}

fn getGridCellSize(gridBoundsMin: vec3f, gridBoundsMax: vec3f) -> vec3f {
  let size = gridBoundsMax - gridBoundsMin;
  return size / f32(GRID_DIMS - 1u);
}

/** Take (0,1,4) grid point and turn into vec3f coords */
fn getGridPointPositionWS(
  gridBoundsMin: vec3f,
  gridBoundsMax: vec3f,
  p: vec3u
) -> vec3f {
  let cellSize = getGridCellSize(gridBoundsMin, gridBoundsMax);
  return gridBoundsMin + cellSize * vec3f(p);
}

fn getClosestGridPoint(
  gridBoundsMin: vec3f,
  gridBoundsMax: vec3f,
  p: vec3f
) -> vec3u {
  var t: vec3f = saturate(
    (p - gridBoundsMin) / (gridBoundsMax - gridBoundsMin)
  );
  var r: GridCoordinates;
  return vec3u(round(t * f32(GRID_DIMS - 1u)));
}

struct GridCoordinates {
  // XYZ of the 'lower' cell-cube corner. E.g [0, 1, 2]
  cellMin: vec3u,
   // XYZ of the 'upper' cell-cube corner. E.g [1, 2, 3]
   // Effectively $cellMin + (1,1,1)$
  cellMax: vec3u,
  // provided point $p in grid coordinates. E.g. [1.1, 2.4, 3.4]
  pInGrid: vec3f
}


fn _getGridCell(
  gridBoundsMin: vec3f,
  gridBoundsMax: vec3f,
  p: vec3f,
) -> GridCoordinates {
  var t: vec3f = saturate(
    (p - gridBoundsMin) / (gridBoundsMax - gridBoundsMin)
  );
  var r: GridCoordinates;
  r.pInGrid = t * f32(GRID_DIMS - 1u);
  r.cellMin = vec3u(floor(t * f32(GRID_DIMS - 1u)));
  r.cellMax = vec3u( ceil(t * f32(GRID_DIMS - 1u)));
  return r;
}

fn _getGridCellWeights(
  cellCornerCo: vec3u,
  originalPoint: vec3f,
) -> vec3f {
  let w_x = clamp(1.0 - f32(abs(originalPoint.x - f32(cellCornerCo.x))), 0.0, 1.0);
  let w_y = clamp(1.0 - f32(abs(originalPoint.y - f32(cellCornerCo.y))), 0.0, 1.0);
  let w_z = clamp(1.0 - f32(abs(originalPoint.z - f32(cellCornerCo.z))), 0.0, 1.0);
  return vec3f(w_x, w_y, w_z);
}

/** 
 * Compress '_getGridCellWeights()' into a single value. Used when stored value is not a vector.
 * Not amazing, but..
*/
fn _getGridCellWeight(cellW: vec3f) -> f32 {
  return length(cellW);
}
`;var Oe=class{static GRID_DATA_SNIPPET=`

  struct GridData {
    boundsMin: vec4f,
    boundsMax: vec3f,
    debugDisplayValue: u32, // also encodes if abs the value
  }
  
  fn getGridDebugDepthSlice() -> f32 {
    let FLOAT_EPSILON: f32 = 1e-7;
    return clamp(_uniforms.gridData.boundsMin.w, FLOAT_EPSILON, 1.0 - FLOAT_EPSILON);
  }
  `;static BUFFER_SIZE=2*J;densityVelocityBuffer;densityGradAndWindBuffer;bounds;constructor(e,n){if(this.bounds=Wo(n,u.hairSimulation.physicsForcesGrid.scale),u.isTest){this.densityVelocityBuffer=void 0,this.densityGradAndWindBuffer=void 0;return}let r=u.hairSimulation.physicsForcesGrid.dims,[i,o]=this.bounds,a=y.subtract(o,i),s=y.scale(a,1/(r-1)),l=r*r*r;console.log(`Physics grid (dims=${r}x${r}x${r}, ${l} points, cellSize=${s}), bounds:`,this.bounds),this.densityVelocityBuffer=jo(e,"grid-density-velocity",r),this.densityGradAndWindBuffer=jo(e,"grid-density-grad-and-wind",r)}clearDensityVelocityBuffer(e){e.clearBuffer(this.densityVelocityBuffer,0,this.densityVelocityBuffer.size)}clearDensityGradAndWindBuffer(e){e.clearBuffer(this.densityGradAndWindBuffer,0,this.densityGradAndWindBuffer.size)}bindDensityVelocityBuffer=e=>L(e,this.densityVelocityBuffer);bindDensityGradAndWindBuffer=e=>L(e,this.densityGradAndWindBuffer);getDebuggedGridBuffer(){let e=u.hairSimulation.physicsForcesGrid.debugValue;return e==xe.WIND||e==xe.DENSITY_GRADIENT?this.densityGradAndWindBuffer:this.densityVelocityBuffer}writeToDataView(e){let n=u.hairSimulation.physicsForcesGrid,[r,i]=this.bounds;e.writeF32(r[0]),e.writeF32(r[1]),e.writeF32(r[2]),e.writeF32(n.debugSlice),e.writeF32(i[0]),e.writeF32(i[1]),e.writeF32(i[2]),e.writeU32(n.debugValue+(n.debugAbsValue?16:0))}};function jo(t,e,n){let r=n*n*n,o=Math.max(ve,r*4),a=new Int32Array(o),s=c=>Math.floor(c*kr);for(let c=0;c<n;c++)for(let d=0;d<n;d++)for(let f=0;f<n;f++){let m=c*n*n+d*n+f,v=f==1||f==5;a[4*m+3]=s(v?1:0)}let l=be(t,e,a);return z.update("Physics grid","2 * "+Se(l.size)),l}var $e=I.create(),Ju=I.create(),A=class t{static SHADER_SNIPPET=e=>`
    const b11 = 3u; // binary 0b11
    const b111 = 7u; // binary 0b111
    const b1111 = 15u; // binary 0b1111
    const b11111 = 31u; // binary 0b11111
    const b111111 = 63u; // binary 0b111111

    const DISPLAY_MODE_FINAL = ${D.FINAL}u;
    const DISPLAY_MODE_TILES = ${D.TILES}u;
    const DISPLAY_MODE_TILES_PPLL = ${D.TILES_PPLL}u;
    const DISPLAY_MODE_HW_RENDER = ${D.HW_RENDER}u;
    const DISPLAY_MODE_USED_SLICES = ${D.USED_SLICES}u;
    const DISPLAY_MODE_DEPTH = ${D.DEPTH}u;
    const DISPLAY_MODE_NORMALS = ${D.NORMALS}u;
    const DISPLAY_MODE_AO = ${D.AO}u;

    struct Light {
      position: vec4f, // [x, y, z, 0.0]
      colorAndEnergy: vec4f, // [r, g, b, energy]
    }

    // https://github.com/Scthe/WebFX/blob/09713a3e7ebaa1484ff53bd8a007908a5340ca8e/src/webfx/passes/ForwardPass.ts#L65
    struct Shadows {
      sourceModelViewMat: mat4x4<f32>,
      sourceProjMatrix: mat4x4<f32>,
      sourceMVP_Matrix: mat4x4<f32>,
      sourcePosition: vec4f, // xyz, but .w is fiber width
      usePCSS: u32,
      PCF_Radius: u32,
      bias: f32,
      strength: f32,
    }
    fn getShadowFiberRadius() -> f32 { return _uniforms.shadows.sourcePosition.w; }

    struct AmbientOcclusion {
      radius: f32, // in world space
      directionOffset: f32,
      falloffStart2: f32,
      falloffEnd2: f32,
      // vec4f end, start vec4u
      numDirections: u32,
      numSteps: u32,
      strength: f32,
      padding0: f32,
    }

    struct HairMaterialParams {
      // 1 * vec4f
      color0: vec3f,
      specular: f32,
      // 1 * vec4f
      color1: vec3f,
      shadows: f32,
      // 4 * f32
      weightTT: f32,
      weightTRT: f32,
      shift: f32,
      roughness: f32,
      // 4 * f32
      colorRng: f32,
      lumaRng: f32,
      attenuation: f32,
      padding1: f32,
    }

    struct Background {
      color0: vec3f,
      noiseScale: f32,
      color1: vec3f,
      gradientStrength: f32,
    }

    ${ae.SDF_DATA_SNIPPET}
    ${Oe.GRID_DATA_SNIPPET}

    struct Uniforms {
      vpMatrix: mat4x4<f32>,
      vpMatrixInv: mat4x4<f32>,
      viewMatrix: mat4x4<f32>,
      projMatrix: mat4x4<f32>,
      projMatrixInv: mat4x4<f32>,
      modelMatrix: mat4x4<f32>,
      modelViewMat: mat4x4<f32>,
      mvpMatrix: mat4x4<f32>,
      collisionSphereModelMatrix: mat4x4<f32>,
      viewport: vec4f,
      cameraPosition: vec4f,
      colorMgmt: vec4f,
      lightAmbient: vec4f,
      light0: Light,
      light1: Light,
      light2: Light,
      shadows: Shadows,
      ao: AmbientOcclusion,
      hairMaterial: HairMaterialParams,
      sdf: SDFCollider,
      gridData: GridData,
      // START: misc vec4f
      fiberRadius: f32,
      dbgShadowMapPreviewSize: f32,
      maxDrawnHairSegments: u32,
      displayMode: u32, // display mode + some of it's settings
      // back to proper align
      background: Background,
      // collider sphere vec4f
      collisionSpherePosition: vec3f,
      gizmoActiveState: u32,
    };
    @group(0) @binding(${e})
    var<uniform> _uniforms: Uniforms;

    fn getDisplayMode() -> u32 { return _uniforms.displayMode & 0xff; }
    fn getDbgModeExtra() -> u32 { return (_uniforms.displayMode >> 8) & 0xffff; }
    fn getDbgTileModeMaxSegments() -> u32 { return getDbgModeExtra(); }
    fn getDbgSlicesModeMaxSlices() -> u32 { 
      return select(0u, getDbgModeExtra(), getDisplayMode() == DISPLAY_MODE_USED_SLICES);
    }
    fn getDbgFinalModeShowTiles() -> bool {
      let flags = select(0u, getDbgModeExtra(), getDisplayMode() == DISPLAY_MODE_FINAL);
      return (flags & 1u) > 0u;
    }
  `;static LIGHT_SIZE=2*J;static SHADOWS_SIZE=oe+oe+oe+J+J;static AO_SIZE=J+zi;static BACKGROUND_SIZE=2*J;static BUFFER_SIZE=oe+oe+oe+oe+oe+oe+oe+oe+oe+J+J+J+J+3*t.LIGHT_SIZE+t.SHADOWS_SIZE+t.AO_SIZE+4*J+ae.BUFFER_SIZE+Oe.BUFFER_SIZE+4*Te+t.BACKGROUND_SIZE+J;gpuBuffer;data=new ArrayBuffer(t.BUFFER_SIZE);dataView;constructor(e){this.gpuBuffer=e.createBuffer({label:"render-uniforms-buffer",size:t.BUFFER_SIZE,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.dataView=new qe(this.data)}createBindingDesc=e=>({binding:e,resource:{buffer:this.gpuBuffer}});update(e){let{device:n,vpMatrix:r,viewMatrix:i,projMatrix:o,viewport:a,cameraPositionWorldSpace:s,scene:l}=e,{modelMatrix:c}=e.scene,d=u,f=d.colors,m=s;this.dataView.resetCursor(),this.dataView.writeMat4(r),this.dataView.writeMat4(I.invert(r,$e)),this.dataView.writeMat4(i),this.dataView.writeMat4(o),this.dataView.writeMat4(I.invert(o,$e)),this.dataView.writeMat4(c),I.multiply(i,c,$e),this.dataView.writeMat4($e),Or(c,i,o,$e),this.dataView.writeMat4($e);let v=u.hairSimulation.collisionSphere,b=v[3]*.95,x=I.translation(v,Ju),g=I.scale(x,[b,b,b],$e);this.dataView.writeMat4(g),this.dataView.writeF32(a.width),this.dataView.writeF32(a.height),this.dataView.writeF32(0),this.dataView.writeF32(0),this.dataView.writeF32(m[0]),this.dataView.writeF32(m[1]),this.dataView.writeF32(m[2]),this.dataView.writeF32(0),this.dataView.writeF32(f.gamma),this.dataView.writeF32(f.exposure),this.dataView.writeF32(f.ditherStrength),this.dataView.writeF32(0),this.dataView.writeF32(d.lightAmbient.color[0]),this.dataView.writeF32(d.lightAmbient.color[1]),this.dataView.writeF32(d.lightAmbient.color[2]),this.dataView.writeF32(d.lightAmbient.energy),this.writeLight(d.lights[0]),this.writeLight(d.lights[1]),this.writeLight(d.lights[2]),this.writeShadows(l,c),this.writeAo(),this.writeHairMaterial(),e.scene.sdfCollider.writeToDataView(this.dataView),e.scene.physicsGrid.writeToDataView(this.dataView),this.dataView.writeF32(d.hairRender.fiberRadius),this.dataView.writeF32(yn(a)),this.dataView.writeU32(Rr(a)),this.dataView.writeU32(this.encodeDebugMode()),this.writeBackground(),this.dataView.writeF32(v[0]),this.dataView.writeF32(v[1]),this.dataView.writeF32(v[2]),this.dataView.writeU32(u.colliderGizmo.activeAxis),this.dataView.assertWrittenBytes(t.BUFFER_SIZE),this.dataView.upload(n,this.gpuBuffer,0)}writeLight(e){let n=dt(e.posPhi,e.posTheta,"dgr",Qu),r=2;this.dataView.writeF32(n[0]*r),this.dataView.writeF32(n[1]*r),this.dataView.writeF32(n[2]*r),this.dataView.writeF32(0),this.dataView.writeF32(e.color[0]),this.dataView.writeF32(e.color[1]),this.dataView.writeF32(e.color[2]),this.dataView.writeF32(e.energy)}writeShadows(e,n){let r=u.shadows,i=zo(n),o=Vo(n,i,e),a=I.multiply(i,n,$e);this.dataView.writeMat4(a),this.dataView.writeMat4(o);let s=Or(n,i,o,$e);this.dataView.writeMat4(s);let l=Nr();this.dataView.writeF32(l[0]),this.dataView.writeF32(l[1]),this.dataView.writeF32(l[2]);let c=r.hairFiberWidthMultiplier*u.hairRender.fiberRadius;this.dataView.writeF32(c),this.dataView.writeU32(r.usePCSS?1:0),this.dataView.writeU32(r.PCF_Radius),this.dataView.writeF32(r.bias),this.dataView.writeF32(r.strength)}writeAo(){let e=u.ao;this.dataView.writeF32(e.radius),this.dataView.writeF32(e.directionOffset),this.dataView.writeF32(e.falloffStart2),this.dataView.writeF32(e.falloffEnd2),this.dataView.writeU32(e.numDirections),this.dataView.writeU32(e.numSteps);let n=e.strength;this.dataView.writeF32(n),this.dataView.writeU32(0)}writeHairMaterial(){let e=u.hairRender.material;this.dataView.writeF32(e.color0[0]),this.dataView.writeF32(e.color0[1]),this.dataView.writeF32(e.color0[2]),this.dataView.writeF32(e.specular),this.dataView.writeF32(e.color1[0]),this.dataView.writeF32(e.color1[1]),this.dataView.writeF32(e.color1[2]),this.dataView.writeF32(e.shadows),this.dataView.writeF32(e.weightTT),this.dataView.writeF32(e.weightTRT),this.dataView.writeF32(e.shift),this.dataView.writeF32(e.roughness),this.dataView.writeF32(e.colorRng),this.dataView.writeF32(e.lumaRng),this.dataView.writeF32(e.attenuation),this.dataView.writeF32(0)}writeBackground(){let e=u.background;this.dataView.writeF32(e.color0[0]),this.dataView.writeF32(e.color0[1]),this.dataView.writeF32(e.color0[2]),this.dataView.writeF32(e.noiseScale),this.dataView.writeF32(e.color1[0]),this.dataView.writeF32(e.color1[1]),this.dataView.writeF32(e.color1[2]),this.dataView.writeF32(e.gradientStrength)}encodeDebugMode(){let e=u,n=u.hairRender,r=0;return e.displayMode===D.TILES||e.displayMode===D.TILES_PPLL?r=n.dbgTileModeMaxSegments:e.displayMode===D.USED_SLICES?r=n.dbgSlicesModeMaxSlices:e.displayMode===D.FINAL&&(r=n.dbgShowTiles?1:0),e.displayMode|r<<8}},Qu=y.create();var ef=Math.PI/2,gt=0,Tn=1,En=class{_viewMatrix=I.identity();_tmpMatrix=I.identity();_angles=[0,0];_position=[0,0,0];constructor(e=u.camera.position){this.resetPosition(e)}get positionWorldSpace(){return this._position}resetPosition=(e=u.camera.position)=>{e.position?.length===3&&(this._position[0]=e.position[0],this._position[1]=e.position[1],this._position[2]=e.position[2]),e.rotation?.length===2&&(this._angles[gt]=e.rotation[1],this._angles[Tn]=e.rotation[0])};update(e,n){this.applyMovement(e,n),this.applyRotation(e,n),this.updateShownStats()}applyMovement(e,n){let r=(d,f)=>(d?1:0)-(f?1:0),i=u.camera,o=n.directions,a=e*(o.goFaster?i.movementSpeedFaster:i.movementSpeed),s=[0,0,0,1];s[0]=a*r(o.right,o.left),s[1]=a*r(o.up,o.down),s[2]=a*r(o.backward,o.forward);let l=I.transpose(this.getRotationMat(),this._tmpMatrix),c=ht(l,s,s);y.add(this._position,c,this._position)}applyRotation(e,n){let r=u.camera,i=n.mouse.dragX*e*r.rotationSpeed,o=n.mouse.dragY*e*r.rotationSpeed;this._angles[Tn]+=i,this._angles[gt]+=o;let a=ef*.95;this._angles[gt]=Rt(this._angles[gt],-a,a)}updateShownStats(){let e=i=>i.toFixed(1),n=this._position,r=this._angles;z.update("Camera pos",`[${e(n[0])}, ${e(n[1])}, ${e(n[2])}]`),z.update("Camera rot",`[${e(r[Tn])}, ${e(r[gt])}]`)}getRotationMat(){let e=this._angles,n=I.identity(this._tmpMatrix);return I.rotateX(n,e[gt],n),I.rotateY(n,e[Tn],n),n}get viewMatrix(){let e=this.getRotationMat(),n=this._position;return I.translate(e,[-n[0],-n[1],-n[2]],this._viewMatrix)}};var Fe=`

/** https://www.saschawillems.de/blog/2016/08/13/vulkan-tutorial-on-rendering-a-fullscreen-quad-without-buffers/ */
fn getFullscreenTrianglePosition(vertIdx: u32) -> vec4f {
  let outUV = vec2u((vertIdx << 1) & 2, vertIdx & 2);
  return vec4f(vec2f(outUV) * 2.0 - 1.0, 0.0, 1.0);
}
`;function We(t){t.draw(3)}var C=class{cache={};getBindings(e,n){let r=this.cache[e];if(r)return r;let i=n();return this.cache[e]=i,i}clear(){this.cache={}}};var Ut=(t,e="")=>`${t.NAME}${e?"-"+e:""}`,B=(t,e="")=>`${Ut(t,e)}-shader`,F=(t,e="")=>`${Ut(t,e)}-pipeline`,tf=(t,e="")=>`${Ut(t,e)}-uniforms`,_t={cullMode:"back",topology:"triangle-list",stripIndexFormat:void 0},xt={format:mn,depthWriteEnabled:!0,depthCompare:"less"},se=(t,e,n,r)=>Z(t,"",e,n,r),Z=(t,e,n,r,i)=>{let o=r.getBindGroupLayout(0);return n.createBindGroup({label:tf(t,e),layout:o,entries:i})},ee=(t,e,n,r="store")=>($(t),{view:t,loadOp:n,storeOp:r,clearValue:e}),St=(t,e,n="store")=>($(t),{view:t,depthClearValue:1,depthLoadOp:e,depthStoreOp:n}),zr=(t,e,n,r="",i="main")=>{let o=t.createShaderModule({label:B(e,r),code:n});return t.createComputePipeline({label:F(e,r),layout:"auto",compute:{module:o,entryPoint:i}})};var Yo=`

fn doACES_Tonemapping(x: vec3f) -> vec3f {
  let a = 2.51;
  let b = 0.03;
  let c = 2.43;
  let d = 0.59;
  let e = 0.14;
  return saturate((x*(a*x+b)) / (x*(c*x+d)+e));
}
`;var Xo=`

const DITHER_ELEMENT_RANGE: f32 = 63.0;

/** No. of possible colors in u8 color value */
const DITHER_LINEAR_COLORSPACE_COLORS: f32 = 256.0;

// Too lazy to use texture or smth
const DITHER_MATRIX = array<u32, 64>(
  0, 32,  8, 40,  2, 34, 10, 42,
 48, 16, 56, 24, 50, 18, 58, 26,
 12, 44,  4, 36, 14, 46,  6, 38,
 60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43,  1, 33,  9, 41,
 51, 19, 59, 27, 49, 17, 57, 25,
 15, 47,  7, 39, 13, 45,  5, 37,
 63, 31, 55, 23, 61, 29, 53, 21
);

/** Returns 0-1 dithered value
 * @ Param gl_FragCoord - fragment coordinate (in pixels)
 */
fn getDitherForPixel(gl_FragCoord: vec2u) -> f32 {
  let pxPos = vec2u(
    gl_FragCoord.x % 8u,
    gl_FragCoord.y % 8u
  );
  let idx = pxPos.y * 8u + pxPos.x;
  // Disabled on Deno, as Naga does not allow indexing 'array<u32, 64>'
  // with nonconst values. See 'nagaFixes.ts'.
  let matValue = DITHER_MATRIX[${dn?"0":"idx"}]; // [1-64]
  return f32(matValue) / DITHER_ELEMENT_RANGE;
}

/**
 * Add some random value to each pixel,
 * hoping it would make it different than neighbours
 */
fn ditherColor (
  gl_FragCoord: vec2u,
  originalColor: vec3f,
  strength: f32
) -> vec3f {
  let ditherMod = getDitherForPixel(gl_FragCoord) * strength  / DITHER_LINEAR_COLORSPACE_COLORS;
  return originalColor + ditherMod;
}

`;var In=u.camera.projection,vt=`

/** Returns value [zNear, zFar] */
fn linearizeDepth(depth: f32) -> f32 {
  let zNear: f32 = ${In.near}f;
  let zFar: f32 = ${In.far}f;
  
  // PP := projection matrix
  // PP[10] = zFar / (zNear - zFar);
  // PP[14] = (zFar * zNear) / (zNear - zFar);
  // PP[11] = -1 ; PP[15] = 0 ; w = 1 
  // z = PP[10] * p.z + PP[14] * w; // matrix mul, but x,y do not matter for z,w coords
  // w = PP[11] * p.z + PP[15] * w;
  // z' = z / w = (zFar / (zNear - zFar) * p.z + (zFar * zNear) / (zNear - zFar)) / (-p.z)
  // p.z = (zFar * zNear) / (zFar + (zNear - zFar) * z')
  return zNear * zFar / (zFar + (zNear - zFar) * depth);
  
  // OpenGL:
  // let z = depth * 2.0 - 1.0; // back to NDC
  // let z = depth;
  // return (2.0 * zNear * zFar) / (zFar + zNear - z * (zFar - zNear));
}

/** Returns value [0, 1] */
fn linearizeDepth_0_1(depth: f32) -> f32 {
  let zNear: f32 = ${In.near}f;
  let zFar: f32 = ${In.far}f;
  let d2 = linearizeDepth(depth);
  return d2 / (zFar - zNear);
}
`;var Mn="mat4x4<f32>",he=`
fn getMVP_Mat(modelMat: ${Mn}, viewMat: ${Mn}, projMat: ${Mn}) -> ${Mn} {
  let a = viewMat * modelMat;
  return projMat * a;
}
`,Ge=`

// WARNING: This is true only when you do not have scale (only rotation and transpose).
// https://paroj.github.io/gltut/Illumination/Tut09%20Normal%20Transformation.html
fn transformNormalToWorldSpace(modelMat: mat4x4f, normalV: vec3f) -> vec3f {
  let normalMatrix = modelMat; // !
  let normalWS = normalMatrix * vec4f(normalV, 0.0);
  return normalize(normalWS.xyz);
}


/** https://knarkowicz.wordpress.com/2014/04/16/octahedron-normal-vector-encoding/
 * 
 * NOTE: I'm running of of patience writing this code, do not judge */
fn OctWrap(v: vec2f) -> vec2f {
  // https://gpuweb.github.io/gpuweb/wgsl/#select-builtin
  // select(f, t, cond); // yes, this is the actuall syntax..
  let signX = select(-1.0, 1.0, v.x >= 0.0);
  let signY = select(-1.0, 1.0, v.y >= 0.0);
  return (1.0 - abs(v.yx)) * vec2f(signX, signY);
}
 
/** https://knarkowicz.wordpress.com/2014/04/16/octahedron-normal-vector-encoding/
 * 
 * Result is in [0 .. 1]
 * 
 * NOTE: I'm running of of patience writing this code, do not judge */
fn encodeOctahedronNormal(n0: vec3f) -> vec2f {
  var n = n0 / (abs(n0.x) + abs(n0.y) + abs(n0.z));
  if (n.z < 0.0) {
    let a = OctWrap(n.xy);
    n.x = a.x;
    n.y = a.y;
  }
  return n.xy * 0.5 + 0.5;
}

/** https://knarkowicz.wordpress.com/2014/04/16/octahedron-normal-vector-encoding/ */
fn decodeOctahedronNormal(f_: vec2f) -> vec3f {
  let f = f_ * 2.0 - 1.0;
 
  // https://twitter.com/Stubbesaurus/status/937994790553227264
  var n = vec3f(f.x, f.y, 1.0 - abs(f.x) - abs(f.y));
  let t = saturate(-n.z);
  if (n.x >= 0.0){ n.x -= t; } else { n.x += t; }
  if (n.y >= 0.0){ n.y -= t; } else { n.y += t; }
  return normalize(n);
}
`,G=`

const PI: f32 = ${Math.PI};
const HALF_PI: f32 = ${.5*Math.PI};
const TWO_PI: f32 = ${2*Math.PI};
const ONE_OVER_PI: f32 = ${1/Math.PI};
const FLOAT_EPSILON: f32 = 1e-7;

fn safeNormalize3(v: vec3f) -> vec3f {
  return select(
    vec3f(0., 0., 0.), // when not OK
    normalize(v), // when OK
    dot(v, v) >= FLOAT_EPSILON
  );
}

fn safeNormalize2(v: vec2f) -> vec2f {
  return select(
    vec2f(0., 0.), // when not OK
    normalize(v), // when OK
    dot(v, v) >= FLOAT_EPSILON
  );
}

fn divideCeil(a: u32, b: u32) -> u32 {
  return (a + b - 1) / b;
}

fn projectVertex(mvpMat: mat4x4f, pos: vec4f) -> vec3f {
  let posClip = mvpMat * pos;
  let posNDC = posClip / posClip.w;
  return posNDC.xyz;
}

/** https://stackoverflow.com/a/64330724 */
fn projectPointToLine(l1: vec2f, l2: vec2f, p: vec2f) -> vec2f {
  let ab = l2 - l1;
  let ac = p - l1;
  let ad = ab * dot(ab, ac) / dot(ab, ab);
  let d = l1 + ad;
  return d;
}

fn ndc2viewportPx(viewportSize: vec2f, pos: vec3f) -> vec2f {
  let pos_0_1 = pos.xy * 0.5 + 0.5; // to [0-1]
  return pos_0_1 * viewportSize.xy;
}

fn dotMax0 (n: vec3f, toEye: vec3f) -> f32 {
  return max(0.0, dot(n, toEye));
}

/**
 * Takes param 't' in range [0.0 .. 1.0] and 'maxIdx'. Returns u32 indices
 * of points before 't' and after 't' as well as the fract between these points.
 * 
 * E.g.
 * When 't=0.6' and 'maxIdx=4', it returns indices 1, 2 and the fract is 0.4.
 */
fn remapToIndices(maxIdx: u32, t: f32, outIdx: ptr<function, vec2u>) -> f32 {
  let a = t * (f32(maxIdx) - 1.);
  let a_u32 = u32(a);
  (*outIdx).x = clamp(a_u32,      0u, maxIdx - 1u);
  (*outIdx).y = clamp(a_u32 + 1u, 0u, maxIdx - 1u);
  return fract(a);
}

/** https://github.com/Scthe/WebFX/blob/09713a3e7ebaa1484ff53bd8a007908a5340ca8e/src/shaders/_utils.glsl#L41 */
fn toLuma_fromLinear(rgbCol: vec3f) -> f32 {
  let toLumaCoef = vec3f(0.2126729,  0.7151522, 0.0721750);
  return dot(toLumaCoef, rgbCol);
}

fn scissorWithViewport(viewportSize: vec2u, posPx: vec2u) -> vec2u {
  return vec2u(
    clamp(posPx.x, 0u, viewportSize.x - 1u),
    clamp(posPx.y, 0u, viewportSize.y - 1u)
  );
}

fn outOfScreen(coord: vec2f) -> bool {
  return (
    coord.x < 0.0 || coord.x > 1.0 ||
    coord.y < 0.0 || coord.y > 1.0
  );
}

fn getDepthBin(
  binCount: u32,
  tileDepth: vec2f,
  pixelDepth: f32,
) -> u32 {
  let tileDepthSpan = abs(tileDepth.y - tileDepth.x);
  let t = (pixelDepth - tileDepth.x) / tileDepthSpan;
  return clamp(u32(t * f32(binCount)), 0u, binCount - 1u);
}

fn mapRange(
  inMin: f32, inMax: f32,
  outMin: f32, outMax: f32,
  value: f32
) -> f32 {
  let t = saturate((value - inMin) / (inMax - inMin));
  return mix(outMin, outMax, t);
}

`;var bt=t=>`

@group(0) @binding(${t})
var _aoTexture: texture_2d<f32>;

// TODO [IGNORE] add blur pass or at least bilinear sampling to smooth AO out
fn sampleAo(viewport: vec2f, positionPx: vec2f) -> f32 {
  let aoTexSize = textureDimensions(_aoTexture);
  let t = positionPx.xy / viewport.xy;
  let aoSamplePx = vec2i(vec2f(aoTexSize) * t);
  return textureLoad(_aoTexture, aoSamplePx, 0).r;
}
`;var Vr={bindings:{renderUniforms:0,resultHDR_Texture:1,depthTexture:2,normalsTexture:3,aoTexture:4}},kt=Vr.bindings,qo=()=>`

${Fe}
${Xo}
${Yo}
${vt}
${G}
${Ge}

${A.SHADER_SNIPPET(kt.renderUniforms)}
${bt(kt.aoTexture)}

@group(0) @binding(${kt.resultHDR_Texture})
var _resultHDR_Texture: texture_2d<f32>;

@group(0) @binding(${kt.depthTexture})
var _depthTexture: texture_depth_2d;

@group(0) @binding(${kt.normalsTexture})
var _normalsTexture: texture_2d<f32>;


@vertex
fn main_vs(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4f {
  return getFullscreenTrianglePosition(VertexIndex);
}

fn doGamma (color: vec3f, gammaValue: f32) -> vec3f {
  return pow(color, vec3f(1.0 / gammaValue));
}

@fragment
fn main_fs(
  @builtin(position) positionPxF32: vec4<f32>
) -> @location(0) vec4<f32> {
  let gamma = _uniforms.colorMgmt.x;
  let exposure = _uniforms.colorMgmt.y;
  let ditherStr = _uniforms.colorMgmt.z;

  let fragPositionPx = vec2u(positionPxF32.xy);
  var color = vec3f(0.0);
  let resultColor = textureLoad(_resultHDR_Texture, fragPositionPx, 0).rgb;
  let displayMode = getDisplayMode();
  
  if (
    displayMode == DISPLAY_MODE_FINAL || 
    displayMode == DISPLAY_MODE_HW_RENDER
  ) {
    color = resultColor;
    color = ditherColor(fragPositionPx, color, ditherStr);
    color = color * exposure;
    color = saturate(doACES_Tonemapping(color));
    color = doGamma(color, gamma);

  } else if (displayMode == DISPLAY_MODE_DEPTH) {
    let depth: f32 = textureLoad(_depthTexture, fragPositionPx, 0);
    var c = linearizeDepth_0_1(depth);
    // let rescale = vec2f(0.005, 0.009);
    let rescale = vec2f(0.002, 0.01);
    c = mapRange(rescale.x, rescale.y, 0., 1., c);
    color = vec3f(c);
  
  } else if (displayMode == DISPLAY_MODE_NORMALS) {
    let normalsOct: vec2f = textureLoad(_normalsTexture, fragPositionPx, 0).xy;
    let normal = decodeOctahedronNormal(normalsOct);
    color = vec3f(abs(normal.xyz));

  } else if (displayMode == DISPLAY_MODE_AO) {
    let ao = sampleAo(vec2f(_uniforms.viewport.xy), positionPxF32.xy);
    color = vec3f(ao);
  
  } else {
    color = resultColor;
  }

  return vec4(color.xyz, 1.0);
}

`;var Hr={bindings:{renderUniforms:0,depthTexture:1}},Ko=Hr.bindings,Zo=()=>`

${Fe}

${A.SHADER_SNIPPET(Ko.renderUniforms)}

@group(0) @binding(${Ko.depthTexture})
var _depthTexture: texture_depth_2d;


@vertex
fn main_vs(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4f {
  return getFullscreenTrianglePosition(VertexIndex);
}


@fragment
fn main_fs(
  @builtin(position) positionPxF32: vec4<f32>
) -> @location(0) vec4<f32> {
  let previewSize = _uniforms.dbgShadowMapPreviewSize;
  // THIS DEPENDS ON THE POSITION OF THE PREVIEW ON SCREEN. CHANGE .TS CODE TOO!
  let previewPosition = vec2f(
    ${u.shadows.debugViewPosition[0]},
    ${u.shadows.debugViewPosition[1]},
  );

  let shadowMapSize: f32 = ${u.shadows.textureSize}.0;
  let sample_0_1 = (positionPxF32.xy - previewPosition) / vec2f(previewSize, previewSize);
  let fragPositionPx = vec2u(shadowMapSize * sample_0_1);
  
  let depthTextSamplePx: vec2i = vec2i(i32(fragPositionPx.x), i32(fragPositionPx.y)); // wgpu's naga requiers vec2i..
  var depth: f32 = 1.0 - textureLoad(_depthTexture, depthTextSamplePx, 0);

  return vec4(depth, depth, depth, 1.0);
  // return vec4(sample_0_1.xy, 0., 1.0);
}

`;var An="dbg-shadow-map",Dn=class t{static NAME="PresentPass";pipeline;pipelineDbgShadowMap;bindingsCache=new C;constructor(e,n){let r=e.createShaderModule({label:B(t),code:qo()});this.pipeline=this.createPipeline(e,n,r,""),r=e.createShaderModule({label:B(t,An),code:Zo()}),this.pipelineDbgShadowMap=this.createPipeline(e,n,r,An)}createPipeline=(e,n,r,i)=>e.createRenderPipeline({label:F(t,i),layout:"auto",vertex:{module:r,entryPoint:"main_vs",buffers:[]},fragment:{module:r,entryPoint:"main_fs",targets:[{format:n}]},primitive:{topology:"triangle-list"}});onViewportResize=()=>this.bindingsCache.clear();cmdDraw(e,n,r){let{cmdBuf:i,profiler:o}=e;$(n);let a=i.beginRenderPass({label:t.NAME,colorAttachments:[ee(n,u.clearColor,r)],timestampWrites:o?.createScopeGpu(t.NAME)}),s=this.bindingsCache.getBindings("-",()=>this.createBindings(e));a.setBindGroup(0,s),a.setPipeline(this.pipeline),We(a),u.shadows.showDebugView&&this.renderDbgShadowMap(e,a),a.end()}createBindings=e=>{let{device:n,globalUniforms:r,hdrRenderTexture:i,normalsTexture:o,depthTexture:a,aoTexture:s}=e,l=Vr.bindings;return $(i),se(t,n,this.pipeline,[r.createBindingDesc(l.renderUniforms),{binding:l.resultHDR_Texture,resource:i},{binding:l.depthTexture,resource:a},{binding:l.normalsTexture,resource:o},{binding:l.aoTexture,resource:s}])};renderDbgShadowMap(e,n){let{viewport:r}=e,i=this.pipelineDbgShadowMap,o=this.bindingsCache.getBindings(An,()=>this.createDbgShadowMapBindings(e,i)),a=yn(r);n.setBindGroup(0,o),n.setPipeline(i);let s=u.shadows.debugViewPosition,l=s[0],c=s[1];n.setViewport(l,c,a,a,0,1),We(n)}createDbgShadowMapBindings=(e,n)=>{let{device:r,globalUniforms:i,shadowDepthTexture:o}=e,a=Hr.bindings;return $(o),Z(t,An,r,n,[i.createBindingDesc(a.renderUniforms),{binding:a.depthTexture,resource:o}])}};var $r={attributes:[{shaderLocation:0,offset:0,format:"float32x3"}],arrayStride:pr,stepMode:"vertex"},Jo=[$r,{attributes:[{shaderLocation:1,offset:0,format:"float32x3"}],arrayStride:pr,stepMode:"vertex"},{attributes:[{shaderLocation:2,offset:0,format:"float32x2"}],arrayStride:ki,stepMode:"vertex"}];var Wr=`


/**
 * Fresnel (F): Schlick's version
 *
 * If cosTheta 0 means 90dgr, so return big value, if is 1 means 0dgr return
 * just F0. Function modeled to have shape of most common fresnel
 * reflectance function shape.
 *
 * @param float cosTheta - cos(viewDirection V, halfway vector H),
 * @param vec3 F0 - surface reflectance at 0dgr. vec3 somewhat models wavelengths
 */
fn FresnelSchlick(cosTheta: f32, F0: vec3f) -> vec3f {
  return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}
/** Same as above, but for a single value (no color) */
fn FresnelSchlick1(cosTheta: f32, F0: f32) -> f32 {
  return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

/**
* Normal distribution function (D): GGX
*
* Just standard implementation ('Real Shading in Unreal Engine 4' equation 2)
*
* @param vec3 N - normalized normal
* @param vec3 H - halfway vector
* @param float roughness [0,1]
*/
fn DistributionGGX(N: vec3f, H: vec3f, roughness: f32) -> f32 {
  let a      = roughness * roughness;
  let a2     = a * a;
  let NdotH  = dotMax0(N, H);
  let NdotH2 = NdotH * NdotH;

  var denom = NdotH2 * (a2 - 1.0) + 1.0;
  denom = PI * denom * denom;
  return a2 / denom;
}

/**
* Self-shadowing Smith helper function.
*
* @see 'Real Shading in Unreal Engine 4' equation 4 line 1,2
*
* @param vec3 NdotV dot prod. between normal and vector to camera/light source
* @param float roughness material property
*/
fn GeometrySchlickGGX(NdotV: f32, roughness: f32) -> f32 {
  let r = (roughness + 1.0);
  let k = (r * r) / 8.0;
  let denom = NdotV * (1.0 - k) + k;
  return NdotV / denom;
}

/**
* Self-shadowing (G): GGX
*
* Just standard implementation ('Real Shading in Unreal Engine 4' equation 4 line 3). We do calculate self-shadowing in directions light-point and point-camera, then mul.
*
* @param vec3 N normal at current frag
* @param vec3 V frag -> point
* @param vec3 L frag -> light
* @param float roughness material property
*
*/
fn GeometrySmith(N: vec3f, V: vec3f, L: vec3f, roughness: f32) -> f32 {
  let NdotV = dotMax0(N, V);
  let NdotL = dotMax0(N, L);
  let ggx2  = GeometrySchlickGGX(NdotV, roughness);
  let ggx1  = GeometrySchlickGGX(NdotL, roughness);
  return ggx1 * ggx2;
}

`,Qo=`

${Wr}

const DIELECTRIC_FRESNEL = vec3f(0.04, 0.04, 0.04); // nearly black
const METALLIC_DIFFUSE_CONTRIBUTION = vec3(0.0, 0.0, 0.0); // none

struct Material {
  positionWS: vec3f,
  normal: vec3f,
  toEye: vec3f,
  // disney pbr:
  albedo: vec3f,
  roughness: f32,
  isMetallic: f32,
  ao: f32,
  shadow: f32
};


fn pbr_LambertDiffuse(material: Material) -> vec3f {
  // return material.albedo / PI;
  return material.albedo;
}

fn pbr_CookTorrance(
  material: Material,
  V: vec3f,
  L: vec3f,
  // out parameter
  // https://www.w3.org/TR/WGSL/#ref-ptr-use-cases
  F: ptr<function,vec3f>
) -> vec3f {
  let H = normalize(V + L); // halfway vector
  let N = material.normal; // normal at fragment

  // F - Fresnel
  let F0 = mix(DIELECTRIC_FRESNEL, material.albedo, material.isMetallic);
  *F = FresnelSchlick(dotMax0(H, V), F0);
  // G - microfacet self-shadowing
  let G = GeometrySmith(N, V, L, material.roughness);
  // D - Normals distribution
  let NDF = DistributionGGX(N, H, material.roughness);

  // Cook-Torrance BRDF using NDF,G,F
  let numerator = NDF * G * (*F);
  let denominator = 4.0 * dotMax0(N, V) * dotMax0(N, L);
  return numerator / max(denominator, 0.001);
}

fn pbr_mixDiffuseAndSpecular(material: Material, diffuse: vec3f, specular: vec3f, F: vec3f) -> vec3f {
  let kS = F;
  // kD for metalics is ~0 (means they have pure black diffuse color, but take color of specular)
  let kD = mix(vec3f(1.0, 1.0, 1.0) - kS, METALLIC_DIFFUSE_CONTRIBUTION, material.isMetallic);
  return kD * diffuse + specular;
}


fn disneyPBR(material: Material, light: Light) -> vec3f {
  let N = material.normal; // normal at fragment
  let V = material.toEye; // viewDir
  let L = normalize(light.position.xyz - material.positionWS.xyz); // wi in integral
  let attenuation = 1.0; // hardcoded for this demo

  // diffuse
  let lambert = pbr_LambertDiffuse(material);

  // specular
  var F: vec3f = vec3f();
  let specular = pbr_CookTorrance(material, V, L, &F);

  // final light calc.
  let NdotL = dotMax0(N, L);
  let brdfFinal = pbr_mixDiffuseAndSpecular(material, lambert, specular, F);
  let radiance = light.colorAndEnergy.rgb * attenuation * light.colorAndEnergy.a; // incoming color from light
  return brdfFinal * radiance * NdotL;
}
`;var Cn=t=>`

@group(0) @binding(${t.bindingTexture})
var _shadowMapTexture: texture_depth_2d;

@group(0) @binding(${t.bindingSampler})
// var _shadowMapSampler: sampler_comparison;
var _shadowMapSampler: sampler;

const IN_SHADOW = 1.0;
const NOT_IN_SHADOW = 0.0;

// settings
const PCSS_PENUMBRA_WIDTH = 10.0;
const PCSS_PENUMBRA_BASE: i32 = 1; // we want at least some blur

fn projectToShadowSpace(
  mvpShadowSourceMatrix: mat4x4f,
  positionWS: vec4f
) -> vec3f {
  // https://github.com/Scthe/WebFX/blob/09713a3e7ebaa1484ff53bd8a007908a5340ca8e/src/shaders/sintel.vert.glsl
  // XY is in (-1, 1) space, Z is in (0, 1) space
  let posFromLight = mvpShadowSourceMatrix * positionWS;
  // Convert XY to (0, 1)
  return vec3f(
    posFromLight.x * 0.5 + 0.5,
    1.0 - (posFromLight.y * 0.5 + 0.5), // Y is flipped because texture coords are Y-down.
    posFromLight.z
  );
}

/*
--- MINIMAL IMPLEMENTATION ---
var shadowMapDepth : f32 = textureSample(
  _shadowMapTexture,
  _shadowMapSampler,
  postionShadowSourceSpace.xy
);
let isInShadow = postionShadowSourceSpace.z - bias > shadowMapDepth;
return select(NOT_IN_SHADOW, IN_SHADOW, isInShadow);
*/

fn calculateDirectionalShadow(
  usePcss: bool,
  shadowSourcePositionWS: vec3f,
  positionWS: vec3f,
  normalWS: vec3f,
  /** positionWS that was multiplied by shadow sources $mvpMatrix
   * AKA position of fragment as rendered from light POV */
  postionShadowSourceSpace: vec3f,
  sampleRadiusPCF: u32,
  bias: f32,
) -> f32 {
  // GDC_Poster_NormalOffset.png
  let toShadowSource = normalize(shadowSourcePositionWS - positionWS);
  let actualBias: f32 = max(abs(bias) * (1.0 - dot(normalWS, toShadowSource)), 0.0005);

  var actualSampleRadius: i32 = i32(sampleRadiusPCF); // PCF

  if (usePcss) {
    // PCSS
    let fragmentDepth = postionShadowSourceSpace.z;
    let shadowMapDepth4 = textureGather(
      _shadowMapTexture,
      _shadowMapSampler,
      postionShadowSourceSpace.xy
    );
    let shadowMapDepth = (shadowMapDepth4.x + shadowMapDepth4.y + shadowMapDepth4.z + shadowMapDepth4.w) / 4.0;
    let depthDiff = max(fragmentDepth - shadowMapDepth, 0.0);
    actualSampleRadius = PCSS_PENUMBRA_BASE + i32(depthDiff / shadowMapDepth * PCSS_PENUMBRA_WIDTH);
  }

  let result = _sampleShadowMap(actualSampleRadius, postionShadowSourceSpace, actualBias);
  
  
  if (!_isValidShadowSample(postionShadowSourceSpace)){
    return NOT_IN_SHADOW;
  }
  return result;
}

// There are following cases:
//  * fragmentDepth > shadowMapDepth
//      there exist some object that is closer to shadow source than object
//      Means object is IN SHADOW
//  * fragmentDepth == shadowMapDepth
//      this is the object that casts the shadow
//      Means NO SHADOW
//  * fragmentDepth < shadowMapDepth
//      would probably happen if object is not shadow-caster
//      Means NO SHADOW
fn _sampleShadowMap(sampleRadius: i32, lightPosProj: vec3f, bias: f32) -> f32 {
  // depth of current fragment (we multiplied by light-shadow matrix
  // in vert. shader, did w-divide here)
  let fragmentDepth = lightPosProj.z;
  let shadowTextureSize = textureDimensions(_shadowMapTexture, 0).x;
  let texelSize: vec2f = vec2f(1. / f32(shadowTextureSize));
  var shadow = 0.0;

  for (var x: i32 = -sampleRadius; x <= sampleRadius; x++) {
  for (var y: i32 = -sampleRadius; y <= sampleRadius; y++) {
    let offset = vec2f(f32(x), f32(y)) * texelSize;
    
    // Btw. PCSS has variable radius, which can trigger: "Variable radius triggers nonuniform flow analysis error"
    /* // The docs for this fn are even worse than for OpenGL. And that's saying something..
    let shadowMapDepth = textureSampleCompare(
      _shadowMapTexture,
      _shadowMapSampler,
      lightPosProj.xy + offset,
      fragmentDepth - bias
    );
    shadow += shadowMapDepth;*/

    // textureSample() - only fragment shaders. No compute? Prob. cause mipmaps. Try textureSampleLevel()
    // let shadowMapDepth: f32 = textureSample(_shadowMapTexture, _shadowMapSampler, lightPosProj.xy + offset);
    let shadowMapDepth4 = textureGather(
      _shadowMapTexture,
      _shadowMapSampler,
      lightPosProj.xy + offset
    );
    let shadowMapDepth = (shadowMapDepth4.x + shadowMapDepth4.y + shadowMapDepth4.z + shadowMapDepth4.w) / 4.0;
    let isInShadow = fragmentDepth - bias > shadowMapDepth;
    shadow += select(NOT_IN_SHADOW, IN_SHADOW, isInShadow);
  }
  }

  let pcfSize = f32(sampleRadius * 2 + 1);
  return shadow / (pcfSize * pcfSize);
}

// for special cases we cannot early return cause:
// "error: 'textureSampleCompare' must only be called from uniform control flow".
// So do the samples ALWAYS, regardless of everything
fn _isValidShadowSample(postionShadowSourceSpace: vec3f) -> bool {
  // Special case if we went beyond the far plane of the frustum.
  // Mark no shadow, cause it's better than dark region
  // far away (or whatever relative light-camera postion is)
  if (postionShadowSourceSpace.z > 1.0) {
    return false;
  }
  // would cause 'invalid' sampling, mark as no shadow too.
  if (outOfScreen(postionShadowSourceSpace.xy)) {
    return false;
  }
  return true;
}

`;function ea(t){return t.createSampler({label:"shadow-map-sampler"})}var wt={firstInstance:{sintel:0,colliderPreview:1},bindings:{renderUniforms:0,shadowMapTexture:1,shadowMapSampler:2,aoTexture:3}},jr=[.9,.9,.9],rf=wt,Rn=wt.bindings,ta=()=>`

${he}
${G}
${Ge}
${Qo}
${Cn({bindingTexture:Rn.shadowMapTexture,bindingSampler:Rn.shadowMapSampler})}

${A.SHADER_SNIPPET(Rn.renderUniforms)}
${bt(Rn.aoTexture)}


struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) positionWS: vec4f,
  @location(1) normalWS: vec3f,
  @location(2) uv: vec2f,
  // vertex transformed by shadow source's MVP matrix
  @location(3) positionShadowSpace: vec3f,
  @location(4) @interpolate(flat) isColliderPreview: u32,
};


@vertex
fn main_vs(
  @builtin(instance_index) instanceIdx: u32,
  @location(0) inWorldPos : vec3f,
  @location(1) inNormal : vec3f,
  @location(2) inUV : vec2f,
) -> VertexOutput {
  var result: VertexOutput;
  var mvpMatrix = _uniforms.mvpMatrix;
  var mvpShadowSourceMatrix = _uniforms.shadows.sourceMVP_Matrix;
  var modelMat = _uniforms.modelMatrix;
  
  if (instanceIdx == ${rf.firstInstance.colliderPreview}u) {
    modelMat = _uniforms.collisionSphereModelMatrix;
    mvpMatrix = getMVP_Mat(modelMat, _uniforms.viewMatrix, _uniforms.projMatrix);
    mvpShadowSourceMatrix = mat4x4<f32>();
    result.isColliderPreview = 1u;
  }

  let vertexPos = vec4<f32>(inWorldPos.xyz, 1.0);
  result.position = mvpMatrix * vertexPos;
  result.positionWS = vertexPos;
  result.normalWS = transformNormalToWorldSpace(modelMat, inNormal);
  result.uv = inUV;
  result.positionShadowSpace = projectToShadowSpace(
    mvpShadowSourceMatrix, vertexPos
  );

  return result;
}


struct FragmentOutput {
  @location(0) color: vec4<f32>,
  @location(1) normals: vec2<f32>,
};


@fragment
fn main_fs(fragIn: VertexOutput) -> FragmentOutput {
  // https://github.com/Scthe/WebFX/blob/09713a3e7ebaa1484ff53bd8a007908a5340ca8e/src/shaders/sintel.frag.glsl
  // material
  var material: Material;
  createDefaultMaterial(&material, fragIn.positionWS, normalize(fragIn.normalWS));
  
  // shadow
  let shadowSourcePositionWS = _uniforms.shadows.sourcePosition.xyz;
  material.shadow = 1.0 - calculateDirectionalShadow(
    _uniforms.shadows.usePCSS > 0u,
    shadowSourcePositionWS,
    fragIn.positionWS.xyz,
    normalize(fragIn.normalWS),
    fragIn.positionShadowSpace,
    _uniforms.shadows.PCF_Radius,
    _uniforms.shadows.bias
  );
  var c = material.shadow;

  // ao
  let ao = sampleAo(vec2f(_uniforms.viewport.xy), fragIn.position.xy);
  material.ao = mix(1.0, ao, _uniforms.ao.strength);
  // c = material.ao;

  // collider
  let isColliderPreview = fragIn.isColliderPreview > 0u;
  if (isColliderPreview) {
    material.albedo = vec3f(1., 1., 1.);
    material.shadow = 1.0;
    material.ao = 1.0;
    material.roughness = 1.0;
    material.isMetallic = 0.4;
  }

  // shading
  var color = doShading(material);
  if (isColliderPreview) {
    color = mix(color, vec3f(1., 1., 0.0), 0.5);
  }

  var result: FragmentOutput;
  result.color = vec4f(color.xyz, 1.0);
  // result.color = vec4f(c,c,c, 1.0); // dbg
  result.normals = encodeOctahedronNormal(material.normal);
  return result;
}


fn doShading(material: Material) -> vec3f {
  let ambient = _uniforms.lightAmbient.rgb * _uniforms.lightAmbient.a;
  var radianceSum = vec3(0.0);

  radianceSum += disneyPBR(material, _uniforms.light0);
  radianceSum += disneyPBR(material, _uniforms.light1);
  radianceSum += disneyPBR(material, _uniforms.light2);

  radianceSum *= saturate(material.ao);
  let maxShadowStr = _uniforms.shadows.strength;
  radianceSum *= clamp(material.shadow, 1.0 - maxShadowStr, 1.0);

  return ambient + radianceSum;
}

fn createDefaultMaterial(
  material: ptr<function, Material>,
  positionWS: vec4f,
  normalWS: vec3f
){
  let cameraPos = _uniforms.cameraPosition.xyz;
  
  (*material).positionWS = positionWS.xyz;
  (*material).normal = normalWS;
  (*material).toEye = normalize(cameraPos - positionWS.xyz);
  // brdf params:
  (*material).albedo = vec3f(
    ${jr[0]},
    ${jr[1]},
    ${jr[2]});
  (*material).roughness = 0.8;
  (*material).isMetallic = 0.0;
  (*material).ao = 1.0;
  (*material).shadow = 1.0;
}
`;var Bn=class t{static NAME="DrawMeshesPass";pipeline;bindingsCache=new C;constructor(e,n,r){let i=e.createShaderModule({label:B(t),code:ta()});this.pipeline=e.createRenderPipeline({label:F(t),layout:"auto",vertex:{module:i,entryPoint:"main_vs",buffers:Jo},fragment:{module:i,entryPoint:"main_fs",targets:[{format:n},{format:r}]},primitive:_t,depthStencil:xt})}onViewportResize=()=>{this.bindingsCache.clear()};cmdDrawMeshes(e){let{cmdBuf:n,profiler:r,depthTexture:i,hdrRenderTexture:o,normalsTexture:a,scene:s}=e,l=n.beginRenderPass({label:t.NAME,colorAttachments:[ee(o,u.clearColor,"load"),ee(a,u.clearNormals,"clear")],depthStencilAttachment:St(i,"clear"),timestampWrites:r?.createScopeGpu(t.NAME)});l.setPipeline(this.pipeline);for(let c of s.objects)this.renderObject(e,l,c);l.end()}renderObject(e,n,r){if(r.isColliderPreview&&!u.drawColliders)return;let i=this.bindingsCache.getBindings(r.name,()=>this.createBindings(e,r));n.setBindGroup(0,i),n.setVertexBuffer(0,r.positionsBuffer),n.setVertexBuffer(1,r.normalsBuffer),n.setVertexBuffer(2,r.uvBuffer),n.setIndexBuffer(r.indexBuffer,"uint32");let o=r.triangleCount*Ce,a=r.isColliderPreview?wt.firstInstance.colliderPreview:wt.firstInstance.sintel;n.drawIndexed(o,1,0,0,a)}createBindings=(e,n)=>{let{device:r,globalUniforms:i,shadowDepthTexture:o,shadowMapSampler:a,aoTexture:s}=e,l=wt.bindings;return $(o),$(s),Z(t,n.name,r,this.pipeline,[i.createBindingDesc(l.renderUniforms),{binding:l.shadowMapTexture,resource:o},{binding:l.shadowMapSampler,resource:a},{binding:l.aoTexture,resource:s}])}};var On=`

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

fn randomRGB(v: u32, brightnessMod: f32) -> vec3f {
  return saturate(vec3f(
    fract(f32(v) * 1.73) * brightnessMod,
    fract(f32(v) * 1.17) * brightnessMod,
    fract(f32(v) * 1.31) * brightnessMod,
  ));
}
`;var Yr={bindings:{renderUniforms:0}},of=Yr.bindings,na=()=>`

${Fe}
${On}

${A.SHADER_SNIPPET(of.renderUniforms)}


@vertex
fn main_vs(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4f {
  return getFullscreenTrianglePosition(VertexIndex);
}


@fragment
fn main_fs(
  @builtin(position) positionPxF32: vec4<f32>
) -> @location(0) vec4<f32> {
  let color0 = _uniforms.background.color0;
  let color1 = _uniforms.background.color1;
  let noiseScale = _uniforms.background.noiseScale;
  let gradientStrength = _uniforms.background.gradientStrength;

  // get noise
  let uv = positionPxF32.xy / _uniforms.viewport.xy;
  let c = fractalNoise(uv, noiseScale) * 0.5 + 0.5;
  
  // mix colors
  var color = mix(color0, color1, c);
  color = mix(color, vec3f(1.0 - uv.y), gradientStrength);
  return vec4(color.xyz, 1.0);
}

`;var Fn=class t{static NAME="DrawBackgroundGradientPass";pipeline;bindingsCache=new C;constructor(e,n){let r=e.createShaderModule({label:B(t),code:na()});this.pipeline=e.createRenderPipeline({label:F(t),layout:"auto",vertex:{module:r,entryPoint:"main_vs",buffers:[]},fragment:{module:r,entryPoint:"main_fs",targets:[{format:n}]},primitive:{topology:"triangle-list"}})}onViewportResize=()=>this.bindingsCache.clear();cmdDraw(e){let{cmdBuf:n,profiler:r,hdrRenderTexture:i}=e;$(i);let o=n.beginRenderPass({label:t.NAME,colorAttachments:[ee(i,u.clearColor,"load")],timestampWrites:r?.createScopeGpu(t.NAME)}),a=this.bindingsCache.getBindings("-",()=>this.createBindings(e));o.setBindGroup(0,a),o.setPipeline(this.pipeline),We(o),o.end()}createBindings=({device:e,globalUniforms:n})=>{let r=Yr.bindings;return se(t,e,this.pipeline,[n.createBindingDesc(r.renderUniforms)])}};var ra=(t,e)=>{let n=t*(e-1)*6;return Math.floor(n/3)};function ia(t,e,n){let{numHairStrands:r,numVerticesPerStrand:i}=n.header,o=r*(i-1),a=Array(o*6).fill(0),s=0,l=0;for(let f=0;f<r;f++){for(let m=0;m<i-1;m++)a[l++]=2*s,a[l++]=2*s+1,a[l++]=2*s+2,a[l++]=2*s+2,a[l++]=2*s+1,a[l++]=2*s+3,s++;s++}let c=Uint32Array.from(a);return{indexBuffer:vn(t,`${e}-indices`,c),indexFormat:"uint32",triangleCount:Math.floor(l/3)}}var Pe=t=>`

struct HairData {
  boundingSphere: vec4f,
  strandsCount: u32,
  pointsPerStrand: u32,
};

@group(0) @binding(${t})
var<storage, read> _hairData: HairData;
`;function oa(t,e,n,r){let i=ve,o=new ArrayBuffer(i),a=new qe(o);return a.writeF32(r.center[0]),a.writeF32(r.center[1]),a.writeF32(r.center[2]),a.writeF32(r.radius),a.writeU32(n.header.numHairStrands),a.writeU32(n.header.numVerticesPerStrand),be(t,`${e}-hair-data`,a.asU32)}var ut=(t,e)=>`

@group(0) @binding(${t})
var<storage, read> ${e.bufferName}: array<vec4f>;

fn ${e.getterName}(
  pointsPerStrand: u32,
  strandIdx: u32,
  pointIdx: u32
) -> vec4f {
  return ${e.bufferName}[strandIdx * pointsPerStrand + pointIdx];
}
`,Ne=t=>ut(t,{bufferName:"_hairPointPositions",getterName:"_getHairPointPosition"}),aa=(t,e)=>`

@group(0) @binding(${t})
var<storage, read_write> ${e.bufferName}: array<vec4f>;

fn ${e.getterName}(
  pointsPerStrand: u32,
  strandIdx: u32,
  pointIdx: u32
) -> vec4f {
  return ${e.bufferName}[strandIdx * pointsPerStrand + pointIdx];
}

fn ${e.setterName}(
  pointsPerStrand: u32,
  strandIdx: u32,
  pointIdx: u32,
  value: vec4f,
) {
  ${e.bufferName}[strandIdx * pointsPerStrand + pointIdx] = value;
}
`;function sa(t,e,n,r){return be(t,`${e}-points-positions`,n,r)}var af=`

fn _setShadingPoint(strandId: u32, pointIdx: u32, color: vec4f) {
  let offset = strandId * SHADING_POINTS;
  let i0 = clamp(pointIdx, 0u, SHADING_POINTS - 1u);
  _hairShading[offset + i0] = color;
}
`,Pt=(t,e)=>`

const SHADING_POINTS = ${u.hairRender.shadingPoints}u;

@group(0) @binding(${t})
var<storage, ${e}> _hairShading: array<vec4f>;

fn _sampleShading(strandId: u32, t: f32) -> vec4f {
  let offset = strandId * SHADING_POINTS;
  let SHADING_POINTS_f32 = f32(SHADING_POINTS);

  var indices: vec2u;
  let fractMod = remapToIndices(SHADING_POINTS, t, &indices);
  let c0 = _hairShading[offset + indices.x];
  let c1 = _hairShading[offset + indices.y];
  return mix(c0, c1, fractMod);
}

${e==="read_write"?af:""}

`;function la(t,e,n){let{header:{numHairStrands:r}}=n,{shadingPoints:i}=u.hairRender,o=Ye(i).map((s,l)=>{let c=l/(i-1);return[1-c,c,0,1]}),a=new Float32Array(Ye(r).map(()=>o).flat().flat());return be(t,`${e}-shading`,a)}var Le=t=>`

@group(0) @binding(${t})
var<storage, read> _hairTangents: array<vec4f>;

fn _getHairTangent(
  pointsPerStrand: u32,
  strandIdx: u32,
  pointIdx: u32
) -> vec4f {
  return _hairTangents[strandIdx * pointsPerStrand + pointIdx];
}
`;function sf(t,e){let n=y.subtract(t,e);return y.normalize(n,n)}function ca(t,e,n){let{vertexPositions:r,header:{numHairStrands:i,numVerticesPerStrand:o}}=n,a=new Float32Array(r.length),s=c=>[r[c*4],r[c*4+1],r[c*4+2]],l=(c,d)=>{a[c*4+0]=d[0],a[c*4+1]=d[1],a[c*4+2]=d[2],a[c*4+3]=0};for(let c=0;c<i;c++){let d=c*o;for(let f=0;f<o;f++){let v=f==o-1?f-1:f,b=s(d+v),x=s(d+v+1),g=sf(x,b);l(d+f,g)}}return be(t,`${e}-tangents`,a)}var Gn=`

struct HwHairRasterizeParams {
  modelViewMatrix: mat4x4f,
  projMatrix: mat4x4f,
  fiberRadius: f32,
  inVertexIndex: u32,
}

struct HwRasterizedHair {
  position: vec4f,
  tangentOBJ: vec3f,
}

/** NOTE: all the comments assume you have 32 verts per strand */
fn hwRasterizeHair(
  p: HwHairRasterizeParams,
) -> HwRasterizedHair {
  var result: HwRasterizedHair;

  let index: u32 = p.inVertexIndex / 2u; // each segment is 2 triangles, so we get same strand data twice.
  let isOdd = (p.inVertexIndex & 0x01u) > 0u;
  let positionOrg = _hairPointPositions[index].xyz;
  let tangentOrg = _hairTangents[index].xyz;
  let positionVS = p.modelViewMatrix * vec4f(positionOrg, 1.0);
  let tangentVS  = p.modelViewMatrix * vec4f(tangentOrg, 1.0);

  // Calculate bitangent vectors
  let right: vec3f = safeNormalize3(cross(tangentVS.xyz, vec3f(0., 0., 1.)));
  
  // Calculate the negative and positive offset screenspace positions
  // 0 is for odd vertexId, 1 is for even vertexId
  let thicknessVector: vec3f = right * p.fiberRadius;
  let hairEdgePositionsOdd  = vec4f(positionVS.xyz - thicknessVector, 1.0); // position 'left'
  let hairEdgePositionsEven = vec4f(positionVS.xyz + thicknessVector, 1.0); // position 'right'
  let hairEdgePosition = select( // DO NOT QUESTION THE ORDER OF PARAMS!
    hairEdgePositionsEven,
    hairEdgePositionsOdd,
    isOdd
  );
  
  result.position = p.projMatrix * hairEdgePosition;
  result.tangentOBJ = tangentOrg;
  return result;
}

struct HairStrandData {
  strandIdx: u32,
  tFullStrand: f32,
}

fn getHairStrandData(
  pointsPerStrand: u32,
  inVertexIndex : u32,
) -> HairStrandData {
  let pointIdx = inVertexIndex / 2u;
  let strandIdx = pointIdx / pointsPerStrand;
  let pointInStrandIdx = pointIdx % pointsPerStrand;
  let tFullStrand = f32(pointInStrandIdx) / f32(pointsPerStrand);
  return HairStrandData(strandIdx, tFullStrand);
}

`;var Xr={bindings:{renderUniforms:0,hairPositions:1,hairTangents:2,hairData:3,hairShading:4}},zt=Xr.bindings,ua=()=>`

${he}
${Ge}
${G}
${Gn}

${A.SHADER_SNIPPET(zt.renderUniforms)}
${Ne(zt.hairPositions)}
${Le(zt.hairTangents)}
${Pe(zt.hairData)}
${Pt(zt.hairShading,"read")}


struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) tangentWS: vec4f,
  @location(1) @interpolate(flat) strandIdx: u32,
  @location(2) tFullStrand: f32,
};


@vertex
fn main_vs(
  @builtin(vertex_index) inVertexIndex : u32
) -> VertexOutput {
  let hwRasterParams = HwHairRasterizeParams(
    _uniforms.modelViewMat,
    _uniforms.projMatrix,
    _uniforms.fiberRadius,
    inVertexIndex
  );
  let hwRasterResult = hwRasterizeHair(hwRasterParams);

  let strandData = getHairStrandData(
    _hairData.pointsPerStrand,
    inVertexIndex
  );

  var result: VertexOutput;
  result.position = hwRasterResult.position;
  result.tangentWS = _uniforms.modelMatrix * vec4f(hwRasterResult.tangentOBJ, 1.);
  result.strandIdx = strandData.strandIdx;
  result.tFullStrand = strandData.tFullStrand;
  return result;
}


struct FragmentOutput {
  @location(0) color: vec4<f32>,
  @location(1) normals: vec2<f32>,
};

@fragment
fn main_fs(fragIn: VertexOutput) -> FragmentOutput {
  let displayMode = getDisplayMode();

  var result: FragmentOutput;
  // result.color = vec4f(1.0, 0.0, 0.0, 1.0);
  // let c = 0.4;
  // result.color = vec4f(c, c, c, 1.0);

  if (displayMode == DISPLAY_MODE_HW_RENDER) {
    var color = _sampleShading(fragIn.strandIdx, fragIn.tFullStrand);
    result.color = vec4f(color.rgb, 1.0);
    // dbg: gradient root -> tip
    // result.color = mix(vec4f(1., 0., 0., 1.0), vec4f(0., 0., 1., 1.0), fragIn.tFullStrand);
  } else {
    result.color.a = 0.0;
  }

  let tangent = normalize(fragIn.tangentWS.xyz);
  result.normals = encodeOctahedronNormal(tangent);
  
  return result;
}
`;var Ze=class t{static NAME="HwHairPass";pipeline;bindingsCache=new C;constructor(e,n,r){let i=e.createShaderModule({label:B(t),code:ua()}),o=t.createPipelineDesc(i);o.fragment?.targets.push({format:n,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"}}},{format:r}),this.pipeline=e.createRenderPipeline(o)}static createPipelineDesc(e){return{label:F(t),layout:"auto",vertex:{module:e,entryPoint:"main_vs",buffers:[]},fragment:{module:e,entryPoint:"main_fs",targets:[]},primitive:{cullMode:"none",topology:"triangle-list",stripIndexFormat:void 0},depthStencil:xt}}cmdDrawHair(e){let{cmdBuf:n,profiler:r,depthTexture:i,hdrRenderTexture:o,normalsTexture:a,scene:s}=e,l=n.beginRenderPass({label:t.NAME,colorAttachments:[ee(o,u.clearColor,"load"),ee(a,u.clearNormals,"load")],depthStencilAttachment:St(i,"load"),timestampWrites:r?.createScopeGpu(t.NAME)});l.setPipeline(this.pipeline);let c=s.hairObject,d=this.bindingsCache.getBindings(c.name,()=>this.createBindings(e,c));l.setBindGroup(0,d),t.cmdRenderHair(l,c),l.end(),c.reportRenderedStrandCount()}static cmdRenderHair(e,n){n.bindIndexBuffer(e);let r=n.getRenderedStrandCount(),o=ra(r,n.pointsPerStrand)*Ce;e.drawIndexed(o,1,0,0,0)}createBindings=({device:e,globalUniforms:n},r)=>{let i=Xr.bindings;return Z(t,r.name,e,this.pipeline,[n.createBindingDesc(i.renderUniforms),r.bindPointsPositions(i.hairPositions),r.bindTangents(i.hairTangents),r.bindHairData(i.hairData),r.bindShading(i.hairShading)])}};var Nn=`


// test colors in ABGR
const COLOR_RED: u32 = 0xff0000ffu;
const COLOR_GREEN: u32 = 0xff00ff00u;
const COLOR_BLUE: u32 = 0xffff0000u;
const COLOR_TEAL: u32 = 0xffffff00u;
const COLOR_PINK: u32 = 0xffff00ffu;
const COLOR_YELLOW: u32 = 0xff00ffffu;
const COLOR_WHITE: u32 = 0xffffffffu;

struct ProjectHairParams {
  pointsPerStrand: u32,
  viewportSize: vec2f,
  fiberRadius: f32,
}

struct ProjectedHairSegment {
  v00: vec2f,
  v01: vec2f,
  v10: vec2f,
  v11: vec2f,
  depthsProj: vec4f,
}

/**
 * https://www.sctheblog.com/blog/hair-software-rasterize/#projecting-hair-as-billboards
 *  
 * NOTE: all the comments assume you have 32 verts per strand */
fn projectHairSegment(
  params: ProjectHairParams,
  strandIdx: u32,
  segmentIdx: u32, // [0...31], we later discard 31
) -> ProjectedHairSegment {
  var r: ProjectedHairSegment;

  var v0: vec2f;
  var v1: vec2f;
  var d01: vec2f;
  projectHairPoint(
    params, strandIdx, segmentIdx, 
    &v0, &v1, &d01
  );
  r.v00 = v0;
  r.v01 = v1;
  r.depthsProj.x = d01.x;
  r.depthsProj.y = d01.y;

  projectHairPoint(
    params, strandIdx, segmentIdx + 1, 
    &v0, &v1, &d01
  );
  r.v10 = v0;
  r.v11 = v1;
  r.depthsProj.z = d01.x;
  r.depthsProj.w = d01.y;

  return r;
}

/**
 * https://www.sctheblog.com/blog/hair-software-rasterize/#projecting-hair-as-billboards
 * 
 * NOTE: all the comments assume you have 32 verts per strand
 * 
 * Same as projectHairSegment(), but only for a single point, instead of both start and end points.
*/
fn projectHairPoint(
  p: ProjectHairParams,
  strandIdx: u32,
  pointIdx: u32, // [0...31], we later discard 31
  v0: ptr<function, vec2f>, v1: ptr<function, vec2f>,
  depthsProj: ptr<function, vec2f>,
) {
  // This used to be view-space calculation, but toCamera vector [0, 0, 1]
  // sometimes has to be [0, 0, -1]. Not sure when. So we do this in world space
  let cameraPosition = _uniforms.cameraPosition;
  let mMat = _uniforms.modelMatrix;
  let viewProjMat = _uniforms.vpMatrix;

  let p0_WS: vec4f = mMat * vec4f(_getHairPointPosition(p.pointsPerStrand, strandIdx, pointIdx).xyz, 1.0);
  let t0_WS: vec4f = mMat * vec4f(      _getHairTangent(p.pointsPerStrand, strandIdx, pointIdx).xyz, 1.0);
  
  // Calculate bitangent vectors (cross between tangent and to-camera vectors)
  let towardsCamera: vec3f = normalize(cameraPosition.xyz - p0_WS.xyz);
  let right0: vec3f = normalize(cross(t0_WS.xyz, towardsCamera)).xyz * p.fiberRadius;
  let v0_WS = vec4f(p0_WS.xyz - right0, 1.0);
  let v1_WS = vec4f(p0_WS.xyz + right0, 1.0);
  let v0_NDC: vec3f = projectVertex(viewProjMat, v0_WS);
  let v1_NDC: vec3f = projectVertex(viewProjMat, v1_WS);

  // Vertex positions
  (*v0) = ndc2viewportPx(p.viewportSize.xy, v0_NDC); // in pixels
  (*v1) = ndc2viewportPx(p.viewportSize.xy, v1_NDC); // in pixels
  (*depthsProj) = vec2f(v0_NDC.z, v1_NDC.z);
}

/** Get bounding box XY points. All values in pixels as f32
 * 
 * https://www.sctheblog.com/blog/hair-software-rasterize/#using-edge-function-to-rasterize-quads
 */
fn getRasterizedHairBounds(
  r: ProjectedHairSegment,
  viewportSize: vec2f,
) -> vec4f {
  // MAX: top right on screen, but remember Y is inverted!
  var boundRectMax = ceil(max(max(r.v00, r.v01), max(r.v10, r.v11)));
  // MIN: bottom left on screen, but remember Y is inverted!
  var boundRectMin = floor(min(min(r.v00, r.v01), min(r.v10, r.v11)));
  // scissor
  boundRectMax = min(boundRectMax, viewportSize.xy);
  boundRectMin = max(boundRectMin, vec2f(0.0, 0.0));
  return vec4f(boundRectMin, boundRectMax);
}


/** https://www.sctheblog.com/blog/hair-software-rasterize/#software-rasterization */
fn edgeFunction(v0: vec2f, v1: vec2f, p: vec2f) -> f32 {
  return (p.x - v0.x) * (v1.y - v0.y) - (p.y - v0.y) * (v1.x - v0.x);
}


/** https://www.sctheblog.com/blog/hair-software-rasterize/#optimization-or-not */
struct EdgeC{ A: f32, B: f32, C: f32 }

/** https://www.sctheblog.com/blog/hair-software-rasterize/#optimization-or-not */
fn edgeC(v0: vec2f, v1: vec2f) -> EdgeC{
  // from edgeFunction() formula we extract: A * p.x + B * p.y + C.
  // This way, when we iterate over x-axis, we can just add A for
  // next pixel, as the "B * p.y + C" part does not change
  var result: EdgeC;
  result.A = v1.y - v0.y; // for p.x
  result.B = -v1.x + v0.x; // for p.y
  result.C = -v0.x * v1.y + v0.y * v1.x; // rest
  return result;
}

////////////////
/// Some additional util functions below

fn debugBarycentric(w: vec4f) -> u32 {
  let color0: u32 = u32(saturate(w.x) * 255); // 0-255 as u32
  let color1: u32 = u32(saturate(w.y) * 255); // 0-255 as u32
  let color2: u32 = u32(saturate(w.z) * 255); // 0-255 as u32
  return (0xff000000u | // alpha
     color0 | // red
    (color1 << 8) | // green
    (color2 << 16) // blue
  );
}

/**
 * https://www.sctheblog.com/blog/hair-software-rasterize/#segment-space-coordinates
 * 
 * result[0] - value in 0-1 range along the width of the segment.
 *             0 is on the side edges, 1 is on the other one
 * result[1] - value in 0-1 range along the length of the segment,
 *             0 is near the segment start point,
 *             1 is near the segment end point
 */
fn interpolateHairQuad(projSegm: ProjectedHairSegment, c: vec2f) -> vec2f {
  // vertices for edge at the start of the segment: projSegm.v00 , projSegm.v01
  let startEdgeMidpoint = (projSegm.v00 + projSegm.v01) / 2.0;
  // vertices for edge at the end of the segment: projSegm.v10 , projSegm.v11
  let endEdgeMidpoint = (projSegm.v10 + projSegm.v11) / 2.0;
  
  // project the pixel onto the strand's segment
  // (the center line between 2 original points)
  let cProjected = projectPointToLine(startEdgeMidpoint, endEdgeMidpoint, c);
  // distance from the start of the strand's segment. Range: [0..1]
  let d1 = length(cProjected - startEdgeMidpoint) / length(startEdgeMidpoint - endEdgeMidpoint);
  
  // start edge is perpendicular to tangent of the current segment
  let widthStart = length(projSegm.v00 - projSegm.v01);
  // 'End' edge is at the angle to segment's tangent.
  // It's direction is determined by the NEXT segment's tangent.
  // Project the 'end' edge onto the 'start' edge
  // using the geometric definition of dot product.
  let widthEnd = widthStart * dot(normalize(projSegm.v00 - projSegm.v01), normalize(projSegm.v10 - projSegm.v11));
  let expectedWidth = mix(widthStart, widthEnd, d1);
  // project pixel to one of the side edges
  let e1 = projectPointToLine(projSegm.v00, projSegm.v10, c);
  // distance between pixel and it's projection on the edge.
  // Divided by full width of the strand around that point
  let d0 =  length(c - e1) / expectedWidth;

  return saturate(vec2f(d0, d1));
}

fn interpolateHairF32(w: vec2f, values: vec4f) -> f32 {
  let valueStart = mix(values.x, values.y, w.x);
  let valueEnd   = mix(values.z, values.w, w.x);
  return mix(valueStart, valueEnd, w.y);
}

`;var lf=`

fn _storeTileHead(
  viewportSize: vec2u,
  tileXY: vec2u, depthBin: u32,
  depthMin: f32, depthMax: f32,
  nextPtr: u32
) -> u32 {
  let tileIdx: u32 = getHairTileDepthBinIdx(viewportSize, tileXY, depthBin);
  
  // store depth
  // TODO [IGNORE] low precision. Convert this into 0-1 inside the bounding sphere and then quantisize
  let depthMax_U32 = u32(depthMax * f32(MAX_U32));
  // WebGPU clears to 0. So atomicMin() is pointless. Use atomicMax() with inverted values instead
  let depthMin_U32 = u32((1.0 - depthMin) * f32(MAX_U32));
  atomicMax(&_hairTilesResult[tileIdx].maxDepth, depthMax_U32);
  atomicMax(&_hairTilesResult[tileIdx].minDepth, depthMin_U32);

  // store pointer to 1st segment.
  // 0 is the value we cleared the buffer to. We always write +1, so previous value '0'
  // means this ptr was never modified. It signifies the end of the list.
  // But '0' is also a valid pointer into a linked list segments buffer.
  // That's why we add 1. To detect this case and turn it into $INVALID_TILE_SEGMENT_PTR.
  // This $INVALID_TILE_SEGMENT_PTR will be then written to the linked list segments buffer.
  let lastHeadPtr = atomicExchange(
    &_hairTilesResult[tileIdx].tileSegmentPtr,
    nextPtr + 1u
  );

  return _translateHeadPointer(lastHeadPtr);
}
`,cf=`

fn _getTileDepth(viewportSize: vec2u, tileXY: vec2u, depthBin: u32) -> vec2f {
  let tileIdx: u32 = getHairTileDepthBinIdx(viewportSize, tileXY, depthBin);
  let tile = _hairTilesResult[tileIdx];
  return vec2f(
    f32(MAX_U32 - tile.minDepth) / f32(MAX_U32),
    f32(tile.maxDepth) / f32(MAX_U32)
  );
}

fn _getTileSegmentPtr(viewportSize: vec2u, tileXY: vec2u, depthBin: u32) -> u32 {
  let tileIdx: u32 = getHairTileDepthBinIdx(viewportSize, tileXY, depthBin);
  let myPtr = _hairTilesResult[tileIdx].tileSegmentPtr;
  return _translateHeadPointer(myPtr);
}

`,yt=(t,e)=>`

const MAX_U32: u32 = 0xffffffffu;
const INVALID_TILE_SEGMENT_PTR: u32 = 0xffffffffu;

struct HairTileResult {
  minDepth: ${de(e)},
  maxDepth: ${de(e)},
  tileSegmentPtr: ${de(e)},
  padding0: u32
}

@group(0) @binding(${t})
var<storage, ${e}> _hairTilesResult: array<HairTileResult>;

${e=="read_write"?lf:cf}

fn _translateHeadPointer(segmentPtr: u32) -> u32 {
  // PS. there is no ternary in WGSL. There is select(). It was designed by someone THAT HAS NEVER WRITTEN A LINE OF CODE IN THEIR LIFE. I.N.C.O.M.P.E.T.E.N.C.E.
  if (segmentPtr == 0u) { return INVALID_TILE_SEGMENT_PTR; }
  return segmentPtr - 1u;
}
`;function fa(t,e){let n=u.hairRender.tileDepthBins,r=Be(e);console.log(`Creating hair tiles buffer: ${r.width}x${r.height}x${n} tiles`),z.update("Tiles",`${r.width} x ${r.height} x ${n}`);let i=r.width*r.height*n,o=4*X,a=i*o;z.update("Tiles heads",Se(a));let s=u.isTest?GPUBufferUsage.COPY_SRC:0;return t.createBuffer({label:"hair-tiles-result",size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|s})}var Ue=`

const TILE_SIZE: u32 = ${u.hairRender.tileSize}u;
const TILE_DEPTH_BINS_COUNT = ${u.hairRender.tileDepthBins}u;

fn getTileCount(viewportSize: vec2u) -> vec2u {
  return vec2u(
    divideCeil(viewportSize.x, TILE_SIZE),
    divideCeil(viewportSize.y, TILE_SIZE)
  );
}

fn getHairTileDepthBinIdx(viewportSize: vec2u, tileXY: vec2u, depthBin: u32) -> u32 {
  let tileCount = getTileCount(viewportSize);
  return (
    tileXY.y * tileCount.x * TILE_DEPTH_BINS_COUNT +
    tileXY.x * TILE_DEPTH_BINS_COUNT +
    depthBin
  );
}

fn getHairTileIdx(viewportSize: vec2u, tileXY: vec2u) -> u32 {
  let tileCount = getTileCount(viewportSize);
  return tileXY.y * tileCount.x + tileXY.x;
}

/** Changes tileIdx into (tileX, tileY) coordinates (NOT IN PIXELS!) */
fn getTileXY(viewportSize: vec2u, tileIdx: u32) -> vec2u {
  let tileCount = getTileCount(viewportSize);
  let row = tileIdx / tileCount.x;
  return vec2u(tileIdx - tileCount.x * row, row);
}

fn getHairTileXY_FromPx(px: vec2u) -> vec2u {
  return vec2u(
    px.x / TILE_SIZE,
    px.y / TILE_SIZE
  );
}

/** Get tile's bounding box IN PIXELS */
fn getTileBoundsPx(viewportSize: vec2u, tileXY: vec2u) -> vec4u {
  let boundsMin = scissorWithViewport(viewportSize, vec2u(
    tileXY.x * TILE_SIZE,
    tileXY.y * TILE_SIZE
  ));
  let boundsMax = scissorWithViewport(viewportSize, vec2u(
    (tileXY.x + 1u) * TILE_SIZE,
    (tileXY.y + 1u) * TILE_SIZE
  ));
  return vec4u(boundsMin, boundsMax);
}

`;var Je=(t,e)=>`

@group(0) @binding(${t})
var<storage, ${e}> _hairSegmentCountPerTile: array<${de(e)}>;

${e=="read_write"?uf:""}
`,uf=`
  fn _incTileSegmentCount(viewportSize: vec2u, tileXY: vec2u) {
    let tileIdx = getHairTileIdx(viewportSize, tileXY);
    atomicAdd(&_hairSegmentCountPerTile[tileIdx], 1u);
  }
`;function da(t,e){let n=Be(e),i=n.width*n.height*X;return t.createBuffer({label:"hair-segment-count-per-tile",size:i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})}var Tt={workgroupSizeX:4,workgroupSizeY:32,bindings:{renderUniforms:0,hairData:1,hairPositions:2,hairTangents:3,tilesBuffer:4,depthTexture:5,tileSegmentsBuffer:6,segmentCountPerTileBuffer:7}},pa=Tt,Qe=Tt.bindings,ma=()=>`


${he}
${G}
${Nn}
${Ue}

${A.SHADER_SNIPPET(Qe.renderUniforms)}
${Pe(Qe.hairData)}
${Ne(Qe.hairPositions)}
${Le(Qe.hairTangents)}
${yt(Qe.tilesBuffer,"read_write")}
${mt(Qe.tileSegmentsBuffer,"read_write")}
${Je(Qe.segmentCountPerTileBuffer,"read_write")}

@group(0) @binding(${Qe.depthTexture})
var _depthTexture: texture_depth_2d;

const INVALID_TILES_PER_SEGMENT_THRESHOLD = ${u.hairRender.invalidTilesPerSegmentThreshold}u;

@compute
@workgroup_size(${pa.workgroupSizeX}, ${pa.workgroupSizeY}, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
) {
  let viewportSize: vec2f = _uniforms.viewport.xy;
  let viewportSizeU32: vec2u = vec2u(viewportSize);
  let maxDrawnSegments: u32 = _uniforms.maxDrawnHairSegments;
  let mvMatrix = _uniforms.modelViewMat;
  let projMatrixInv = _uniforms.projMatrixInv;
  let strandsCount: u32 = _hairData.strandsCount;
  let pointsPerStrand: u32 = _hairData.pointsPerStrand;

  let strandIdx = global_id.x;
  let segmentIdx = global_id.y; // [0...31]
  
  // There are 32 points but only 31 segments. Dispatching 1 per point is suboptimal..
  // Discard 32th last invocation (so idx 31)
  if (segmentIdx >= pointsPerStrand - 1) { return; }
  if (strandIdx >= strandsCount) { return; }

  // get rasterize data
  let projParams = ProjectHairParams(
    pointsPerStrand,
    viewportSize,
    _uniforms.fiberRadius
  );
  let projSegm = projectHairSegment(
    projParams,
    strandIdx,
    segmentIdx
  );

  let hairDepthBoundsVS = getHairDepthBoundsVS(mvMatrix);

  // get segment bounds and convert to tiles
  let bounds4f = getRasterizedHairBounds(projSegm, viewportSize);
  let boundRectMin = bounds4f.xy;
  let boundRectMax = bounds4f.zw;
  let tileMinXY: vec2u = getHairTileXY_FromPx(vec2u(boundRectMin));
  let tileMaxXY: vec2u = getHairTileXY_FromPx(vec2u(boundRectMax));
  // reject degenerate strands from physics simulation.
  // If parts of the strand disappear, this is probably the cause.
  // Number tuned for Sintel's front hair lock
  let tileSize = (tileMaxXY - tileMinXY) + vec2u(1u, 1u);
  if (tileSize.x * tileSize.y > INVALID_TILES_PER_SEGMENT_THRESHOLD) {
    return;
  } 

  // for each affected tile
  // We could calculate affected tiles analytically, but we have to rasterize to test depth buffer.
  // But you can probably do some optimizations by calculating where the strand edge crosses the tile bounds.
  // Having tileMinXY + tileMaxXY iteration means we test all tiles in a rectangle.
  // Could use early out for diagonal segments.
  for (var tileY: u32 = tileMinXY.y; tileY <= tileMaxXY.y; tileY += 1u) {
  for (var tileX: u32 = tileMinXY.x; tileX <= tileMaxXY.x; tileX += 1u) {
    processTile(
      projSegm,
      viewportSizeU32,
      projMatrixInv,
      maxDrawnSegments,
      hairDepthBoundsVS,
      vec2u(tileX, tileY),
      strandIdx, segmentIdx
    );
  }}
}


fn processTile(
  projSegm: ProjectedHairSegment,
  viewportSize: vec2u,
  projMatrixInv: mat4x4f,
  maxDrawnSegments: u32,
  hairDepthBoundsVS: vec2f,
  tileXY: vec2u,
  strandIdx: u32, segmentIdx: u32
) {
  let bounds = getTileBoundsPx(viewportSize, tileXY);
  let boundsMin = bounds.xy;
  let boundsMax = bounds.zw;

  var depthMin =  999.0; // in proj. space, so *A BIT* overkill
  var depthMax = -999.0; // in proj. space, so *A BIT* overkill
  var depthBin = TILE_DEPTH_BINS_COUNT;

  /*// edgeFunction() as series of additions
  // For some reason this is SLOWER than repeated calling of edgeFunction()?! I assume too much registers spend on this..
  let CC0 = edgeC(projSegm.v01, projSegm.v00);
  let CC1 = edgeC(projSegm.v11, projSegm.v01);
  let CC2 = edgeC(projSegm.v10, projSegm.v11);
  let CC3 = edgeC(projSegm.v00, projSegm.v10);
  var CY0 = f32(boundsMin.x) * CC0.A + f32(boundsMin.y) * CC0.B + CC0.C;
  var CY1 = f32(boundsMin.x) * CC1.A + f32(boundsMin.y) * CC1.B + CC1.C;
  var CY2 = f32(boundsMin.x) * CC2.A + f32(boundsMin.y) * CC2.B + CC2.C;
  var CY3 = f32(boundsMin.x) * CC3.A + f32(boundsMin.y) * CC3.B + CC3.C;*/

  // iterate over all pixels in the tile
  for (var y: u32 = boundsMin.y; y < boundsMax.y; y += 1u) {
  // var CX0 = CY0; var CX1 = CY1; var CX2 = CY2; var CX3 = CY3;
  for (var x: u32 = boundsMin.x; x < boundsMax.x; x += 1u) {
      // You should NEVER multi-sample hair with Frostbite's technique.
      // Just make sure you understand the interaction with hardware rasterizer (through depth-buffer).
      // https://www.sctheblog.com/blog/hair-software-rasterize/#half-of-the-pixel-offset
      let posPx = vec2f(f32(x), f32(y)); // + vec2f(0.5); // Removed after testing. Causes tiny z-fighting like artefacts
      let C0 = edgeFunction(projSegm.v01, projSegm.v00, posPx);
      let C1 = edgeFunction(projSegm.v11, projSegm.v01, posPx);
      let C2 = edgeFunction(projSegm.v10, projSegm.v11, posPx);
      let C3 = edgeFunction(projSegm.v00, projSegm.v10, posPx);

      if (C0 >= 0 && C1 >= 0 && C2 >= 0 && C3 >= 0) { // if (CX0 >= 0 && CX1 >= 0 && CX2 >= 0 && CX3 >= 0) {
        // https://www.sctheblog.com/blog/hair-software-rasterize/#segment-space-coordinates
        let interpW = interpolateHairQuad(projSegm, posPx);
        // let value = 0xffff00ffu;
        // let value = debugBarycentric(vec4f(interpW.xy, 0.1, 0.));
        // storeResult(viewportSize, p_u32, value);
        
        let hairDepth: f32 = interpolateHairF32(interpW, projSegm.depthsProj);
        
        // sample depth buffer
        let depthTextSamplePx: vec2i = vec2i(i32(x), i32(viewportSize.y - y)); // wgpu's naga requiers vec2i..
        let depthBufferValue: f32 = textureLoad(_depthTexture, depthTextSamplePx, 0);

        if (hairDepth > depthBufferValue) { // depth test with GL_LESS
          continue;
        }

        // get depth bin based on view-space depth
        let hairDepthVS: vec3f = projectVertex(projMatrixInv, vec4f(posPx, hairDepth, 1.0));
        // view space means Z is reversed. But we want bin 0 to be close etc.
        // So we invert the bin idx.
        let hairDepthBin = (TILE_DEPTH_BINS_COUNT - 1u) - getDepthBin(TILE_DEPTH_BINS_COUNT, hairDepthBoundsVS, hairDepthVS.z);

        // store px result
        depthMin = min(depthMin, hairDepth);
        depthMax = max(depthMax, hairDepth);
        depthBin = min(depthBin, hairDepthBin); // closest bin
      }

      // move to next pixel
      // CX0 += CC0.A; CX1 += CC1.A; CX2 += CC2.A; CX3 += CC3.A;
  }
  // CY0 += CC0.B; CY1 += CC1.B; CY2 += CC2.B; CY3 += CC3.B;
  } // end xy-iter

  // no tile px passes
  if (depthMin > 1.0) {
    return;
  }
  
  // store the result
  let nextPtr = atomicAdd(&_hairTileSegments.drawnSegmentsCount, 1u);
  // If we run out of space to store the fragments we lose them
  if (nextPtr < maxDrawnSegments) {
    let prevPtr = _storeTileHead(
      viewportSize,
      tileXY, depthBin,
      depthMin, depthMax,
      nextPtr
    );
    _storeTileSegment(
      nextPtr, prevPtr,
      strandIdx, segmentIdx
    );

    // store for sorting
    _incTileSegmentCount(viewportSize, tileXY);
  }
}


/** NOTE: This is view space. View space is weird. Expect inverted z-axis etc. */
fn getHairDepthBoundsVS(mvMat: mat4x4f) -> vec2f {
  let bs = _hairData.boundingSphere;
  let bsCenterVS = mvMat * vec4f(bs.xyz, 1.0);
  return vec2f(bsCenterVS.z - bs.w, bsCenterVS.z + bs.w);
}

/** NOTE: if you want to store color for .png file, it's in ABGR format */
/*fn storeResult(viewportSize: vec2u, posPx: vec2u, value: u32) {
  // bitcast<u32>(value); <- if needed
  if(
    posPx.x < 0 || posPx.x >= viewportSize.x ||
    posPx.y < 0 || posPx.y >= viewportSize.y
  ) {
    return;
  }
  let y = viewportSize.y - posPx.y; // invert cause WebGPU coordinates
  let idx: u32 = y * viewportSize.x + posPx.x;
  // WebGPU clears to 0. So atomicMin is pointless..
  atomicMax(&_hairTilesResult[idx], value);
}*/

`;var Ln=class t{static NAME="HairTilesPass";pipeline;bindingsCache=new C;hairTilesBuffer=void 0;hairTileSegmentsBuffer=void 0;segmentCountPerTileBuffer=void 0;constructor(e){let n=e.createShaderModule({label:B(t),code:ma()});this.pipeline=e.createComputePipeline({label:F(t),layout:"auto",compute:{module:n,entryPoint:"main"}})}cmdClearBeforeRender(e){Xe(e.cmdBuf,this.hairTilesBuffer),Xe(e.cmdBuf,this.segmentCountPerTileBuffer),e.cmdBuf.clearBuffer(this.hairTileSegmentsBuffer,0,X)}onViewportResize=(e,n)=>{this.bindingsCache.clear(),this.hairTilesBuffer&&this.hairTilesBuffer.destroy(),this.hairTileSegmentsBuffer&&this.hairTileSegmentsBuffer.destroy(),this.segmentCountPerTileBuffer&&this.segmentCountPerTileBuffer.destroy(),this.hairTilesBuffer=fa(e,n),this.hairTileSegmentsBuffer=ko(e,n),this.segmentCountPerTileBuffer=da(e,n)};cmdDrawHairToTiles(e,n){let{cmdBuf:r,profiler:i}=e,o=r.beginComputePass({label:t.NAME,timestampWrites:i?.createScopeGpu(t.NAME)}),a=this.bindingsCache.getBindings(n.name,()=>this.createBindings(e,n));o.setPipeline(this.pipeline),o.setBindGroup(0,a),this.cmdDispatchPerSegment(o,n),o.end(),n.reportRenderedStrandCount()}cmdDispatchPerSegment(e,n){let r=pe(n.getRenderedStrandCount(),Tt.workgroupSizeX),i=pe(n.pointsPerStrand,Tt.workgroupSizeY);e.dispatchWorkgroups(r,i,1)}createBindings=({device:e,globalUniforms:n,depthTexture:r},i)=>{let o=Tt.bindings;return $(r),Z(t,i.name,e,this.pipeline,[n.createBindingDesc(o.renderUniforms),L(o.tilesBuffer,this.hairTilesBuffer),L(o.tileSegmentsBuffer,this.hairTileSegmentsBuffer),L(o.segmentCountPerTileBuffer,this.segmentCountPerTileBuffer),i.bindHairData(o.hairData),i.bindPointsPositions(o.hairPositions),i.bindTangents(o.hairTangents),{binding:o.depthTexture,resource:r}])}};var ff=`
fn _setRasterizerResult(viewportSize: vec2u, posPx: vec2u, color: vec4f) {
  if(
    posPx.x < 0 || posPx.x >= viewportSize.x ||
    posPx.y < 0 || posPx.y >= viewportSize.y
  ) { return; }

  let idx = viewportSize.x * posPx.y + posPx.x;
  _hairRasterizerResults.data[idx] = color;
}
`,Un=(t,e)=>`

struct HairRasterResult {
  // there is a limit of 8 storage buffers. We are reaching this limit right now.
  // So pack this counter 'somewhere'. I could raise a limit, but..
  // https://gpuweb.github.io/gpuweb/#gpusupportedlimits
  tileQueueAtomicIdx: ${de(e)},
  data: array<vec4f>,
}

@group(0) @binding(${t})
var<storage, ${e}> _hairRasterizerResults: HairRasterResult;

fn _getRasterizerResult(viewportSize: vec2u, posPx: vec2u) -> vec4f {
  let idx = viewportSize.x * posPx.y + posPx.x;
  return _hairRasterizerResults.data[idx];
}

${e=="read_write"?ff:""}
`;function ha(t,e){let i=e.width*e.height*J;return z.update("Hair FBO",Se(i)),t.createBuffer({label:"hair-rasterizer-result",size:i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})}var qr={bindings:{renderUniforms:0,tilesBuffer:1,tileSegmentsBuffer:2,rasterizeResultBuffer:3,segmentCountPerTile:4}},Vt=qr.bindings,ga=()=>`

${Fe}
${G}
${Ue}

${A.SHADER_SNIPPET(Vt.renderUniforms)}
${yt(Vt.tilesBuffer,"read")}
${mt(Vt.tileSegmentsBuffer,"read")}
${Un(Vt.rasterizeResultBuffer,"read")}
${Je(Vt.segmentCountPerTile,"read")}


@vertex
fn main_vs(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4f {
  return getFullscreenTrianglePosition(VertexIndex);
}

struct FragmentOutput {
  // @builtin(frag_depth) fragDepth: f32,
  @location(0) color: vec4<f32>,
};

@fragment
fn main_fs(
  @builtin(position) positionPxF32: vec4<f32>
) -> FragmentOutput {
  var result: FragmentOutput;

  let viewportSize: vec2f = _uniforms.viewport.xy;
  let viewportSizeU32 = vec2u(viewportSize.xy);
  // invert cause it's WebGPU thing
  let fragPositionPx = vec2u(
    u32(positionPxF32.x),
    u32(viewportSize.y - positionPxF32.y)
  );

  let tileXY = getHairTileXY_FromPx(fragPositionPx);
  let displayMode = getDisplayMode();

  if (displayMode == DISPLAY_MODE_TILES || displayMode == DISPLAY_MODE_TILES_PPLL) {
    result.color = renderTileSegmentCount(displayMode, viewportSizeU32, tileXY);

  } else {
    var color = vec4f(0.0, 0.0, 0.0, 1.0);
    color = _getRasterizerResult(viewportSizeU32, fragPositionPx);
    
    // fill tile bg with some pattern
    if (color.a <= 0. && getDbgFinalModeShowTiles()) {
      let dbgTileColor = getDebugTileColor(tileXY);
      color = dbgTileColor + color * color.a;
    }
    result.color = color;

    // write depth to depth bufer
    //    > NOPE, done by separate hair hardware raster pass
    // let hairResult = _getTileDepth(viewportSizeU32, tileXY);
    // result.fragDepth = hairResult.x;
  }

  return result;
}


fn getDebugTileColor(tileXY: vec2u) -> vec4f {
  var dbgTileColor = vec4f(1.0);
  dbgTileColor.r = 0.0;
  dbgTileColor.g = f32(tileXY.x % 2) / 2.0;
  dbgTileColor.b = f32(tileXY.y % 2) / 2.0;
  return dbgTileColor;
}

fn renderTileSegmentCount(
  displayMode: u32,
  viewportSize: vec2u,
  tileXY: vec2u
) -> vec4f {
  var color = vec4f(0.0, 0.0, 0.0, 1.0);

  // output: segment count in each tile normalized by UI provided value
  let maxSegmentsCount = getDbgTileModeMaxSegments();
  var segments = 0u;
  if (displayMode == DISPLAY_MODE_TILES) {
    segments = getSegmentCountInTiles_Count(viewportSize, maxSegmentsCount, tileXY);
  } else {
    segments = getSegmentCountInTiles_PPLL(viewportSize, maxSegmentsCount, tileXY);
  }
  
  color.r = f32(segments) / f32(maxSegmentsCount);
  color.g = 1.0 - color.r;

  // dbg: tile bounds
  // let tileIdx: u32 = getHairTileDepthBinIdx(viewportSize, tileXY, 0u);
  // color.r = f32((tileIdx * 17) % 33) / 33.0;
  // color.a = 1.0;
  
  if (segments == 0u) {
    discard;
  }
  return color;
}

fn getSegmentCountInTiles_PPLL(
  viewportSize: vec2u,
  maxSegmentsCount: u32,
  tileXY: vec2u
) -> u32 {
  let maxDrawnSegments: u32 = _uniforms.maxDrawnHairSegments;
  var segmentData = vec3u();
  var count = 0u;

  for (var binIdx = 0u; binIdx < TILE_DEPTH_BINS_COUNT; binIdx++) {
    var segmentPtr = _getTileSegmentPtr(viewportSize, tileXY, binIdx);

    while (count < maxSegmentsCount) {
      if (_getTileSegment(maxDrawnSegments, segmentPtr, &segmentData)) {
        count = count + 1;
        segmentPtr = segmentData.z;
      } else {
        break;
      }
    }
  }

  return count;
}

fn getSegmentCountInTiles_Count(
  viewportSize: vec2u,
  maxSegmentsCount: u32,
  tileXY: vec2u
) -> u32 {
  let tileIdx = getHairTileIdx(viewportSize, tileXY);
  return _hairSegmentCountPerTile[tileIdx];
}

`;var kn=class t{static NAME="HairCombinePass";pipeline;bindingsCache=new C;constructor(e,n){let r=e.createShaderModule({label:B(t),code:ga()});this.pipeline=e.createRenderPipeline({label:F(t),layout:"auto",vertex:{module:r,entryPoint:"main_vs",buffers:[]},fragment:{module:r,entryPoint:"main_fs",targets:[{format:n,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one",operation:"add"}}}]},primitive:{topology:"triangle-list"}})}onViewportResize=()=>this.bindingsCache.clear();cmdCombineRasterResults(e){let{cmdBuf:n,profiler:r,hdrRenderTexture:i,depthTexture:o}=e;$(i);let a=n.beginRenderPass({label:t.NAME,colorAttachments:[ee(i,u.clearColor,"load")],timestampWrites:r?.createScopeGpu(t.NAME)}),s=this.bindingsCache.getBindings(o.label,()=>this.createBindings(e));a.setBindGroup(0,s),a.setPipeline(this.pipeline),We(a),a.end()}createBindings=e=>{let{device:n,globalUniforms:r,hairTilesBuffer:i,hairTileSegmentsBuffer:o,hairRasterizerResultsBuffer:a,hairSegmentCountPerTileBuffer:s}=e,l=qr.bindings;return se(t,n,this.pipeline,[r.createBindingDesc(l.renderUniforms),L(l.tilesBuffer,i),L(l.tileSegmentsBuffer,o),L(l.rasterizeResultBuffer,a),L(l.segmentCountPerTile,s)])}};var zn=u.hairRender,_a=zn.avgFragmentsPerSlice*zn.slicesPerPixel*zn.tileSize*zn.tileSize,xa=(t,e)=>`

const SLICE_DATA_PER_PROCESSOR_COUNT = ${_a}u;

struct SliceData {
  /** [encodedColor.rg, encodedColor.ba, nextSlicePtr, 0u] */
  value: vec4u,
}

@group(0) @binding(${t})
var<storage, ${e}> _hairSliceData: array<SliceData>;

fn _getSliceDataProcessorOffset(processorId: u32) -> u32 {
  return processorId * SLICE_DATA_PER_PROCESSOR_COUNT;
}

fn _hasMoreSliceDataSlots(slicePtr: u32) -> bool {
  return slicePtr < SLICE_DATA_PER_PROCESSOR_COUNT;
}

fn _setSliceData(
  processorId: u32,
  slicePtr: u32,
  color: vec4f, previousPtr: u32 // both are data to be written
) {
  let offset = _getSliceDataProcessorOffset(processorId) + slicePtr;
  let value = vec4u(
    pack2x16float(color.rg),
    pack2x16float(color.ba),
    previousPtr,
    0u
  );
  _hairSliceData[offset].value = value;
}

fn _getSliceData(
  processorId: u32,
  slicePtr: u32,
  data: ptr<function, SliceData>
) -> bool {
  if (
    slicePtr == INVALID_SLICE_DATA_PTR || 
    slicePtr >= SLICE_DATA_PER_PROCESSOR_COUNT
  ) { return false; }
  
  let offset = _getSliceDataProcessorOffset(processorId) + slicePtr;
  (*data).value = _hairSliceData[offset].value;
  return true;
}
`;function Sa(t){let{processorCount:e}=u.hairRender,n=_a*e,r=4*X,i=Math.max(n*r,ve);return z.update("Slices data",Se(i)),t.createBuffer({label:"hair-slices-data",size:i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})}var va=()=>`

fn processHairSegment(
  params: FineRasterParams,
  tileBoundsPx: vec4u, tileDepth: vec2f,
  strandIdx: u32, segmentIdx: u32
) {
  // get pixel coordinates
  // Half-of-the-pixel offset not added as it causes problems (small random pixels around the strand)
  // https://www.sctheblog.com/blog/hair-software-rasterize/#half-of-the-pixel-offset
  let posPx = vec2f(tileBoundsPx.xy + _pixelInTilePos); // pixel coordinates wrt. viewport
  let CX0 = edgeFunction(_wkgrp_hairSegment.v01, _wkgrp_hairSegment.v00, posPx);
  let CX1 = edgeFunction(_wkgrp_hairSegment.v11, _wkgrp_hairSegment.v01, posPx);
  let CX2 = edgeFunction(_wkgrp_hairSegment.v10, _wkgrp_hairSegment.v11, posPx);
  let CX3 = edgeFunction(_wkgrp_hairSegment.v00, _wkgrp_hairSegment.v10, posPx);
  
  let isOutside = CX0 < 0 || CX1 < 0 || CX2 < 0 || CX3 < 0;
  if (isOutside) {
    return;
  }

  // https://www.sctheblog.com/blog/hair-software-rasterize/#segment-space-coordinates
  let interpW = interpolateHairQuad(_wkgrp_hairSegment, posPx);
  let t = interpW.y; // 0..1 wrt. to hair segment length: 0 is start, 1 is end
  let hairDepth: f32 = interpolateHairF32(interpW, _wkgrp_hairSegment.depthsProj);
  
  // sample depth buffer, depth test with GL_LESS
  let depthTextSamplePx: vec2i = vec2i(i32(posPx.x), i32(params.viewportSize.y - posPx.y)); // wgpu's naga requires vec2i..
  let depthBufferValue: f32 = textureLoad(_depthTexture, depthTextSamplePx, 0);
  if (hairDepth >= depthBufferValue) {
    return;
  }

  // allocate data pointer
  let nextSliceDataPtr = atomicAdd(&_wkgrp.sliceDataOffset, 1u);
  if (!_hasMoreSliceDataSlots(nextSliceDataPtr)) {
    return;
  }

  // calculate final color
  let alpha = getAlphaCoverage(interpW);
  let segmentCount = params.pointsPerStrand - 1;
  let tFullStrand = (f32(segmentIdx) + t) / f32(segmentCount);
  // var color = vec4f(1.0 - t, t, 0.0, alpha); // dbg: red at root, green at tip
  var color = _sampleShading(strandIdx, tFullStrand);
  color.a = color.a * alpha;
  
  // insert into per-slice linked list
  let sliceIdx = getSliceIdx(tileDepth, hairDepth);
  let previousPtr: u32 = _setSlicesHeadPtr(params.processorId, _pixelInTilePos, sliceIdx, nextSliceDataPtr);
  _setSliceData(params.processorId, nextSliceDataPtr, color, previousPtr);
}

fn getSliceIdx(tileDepth: vec2f, pixelDepth: f32) -> u32 {
  // reuse fn. Ignore the name
  return getDepthBin(SLICES_PER_PIXEL, tileDepth, pixelDepth);
}

fn getAlphaCoverage(interpW: vec2f) -> f32 {
  // interpW.x is in 0..1. Transform it so strand middle is 1.0 and then 0.0 at edges.
  var alpha = 1.0 - abs(interpW.x * 2. - 1.);
  if (${u.hairRender.alphaQuadratic}) { // see CONFIG docs
    alpha = sqrt(alpha);
  }
  // optimization: -0.5ms with x1.1 'fatter' strands. Fills the pixel/tiles faster
  alpha = saturate(alpha * ${u.hairRender.alphaMultipler});
  return alpha;
}

`;var ba=()=>`

fn reduceHairSlices(
  processorId: u32,
  viewportSizeU32: vec2u,
  dbgSlicesModeMaxSlices: u32,
  tileBoundsPx: vec4u
) -> bool {
  var sliceData: SliceData;
  let posPx = tileBoundsPx.xy + _pixelInTilePos; // pixel coordinates wrt. viewport
  let isDbgSliceCnt = dbgSlicesModeMaxSlices != 0u;
  
  var finalColor = _getRasterizerResult(viewportSizeU32, posPx);
  var sliceCount = select(0u, u32(finalColor.r * f32(dbgSlicesModeMaxSlices)), isDbgSliceCnt); // debug value
  
  // START: ITERATE SLICES (front to back)
  // We know the start/end slices from 'processHairSegment'. But iterating with consts is faster
  var s: u32 = 0u;
  for (; s < SLICES_PER_PIXEL; s += 1u) {
    if (isPixelDone(finalColor, isDbgSliceCnt)) {
      // finalColor = vec4f(1., 0., 0., 1.); // dbg: highlight early out
      break;
    }

    var requiresSliceHeadClear = false;
    var slicePtr = _getSlicesHeadPtr(processorId, _pixelInTilePos, s);
    
    // aggregate colors in this slice
    while (_getSliceData(processorId, slicePtr, &sliceData)) {
      requiresSliceHeadClear = true;
      if (isPixelDone(finalColor, isDbgSliceCnt)) { break; }
      slicePtr = sliceData.value[2];
      sliceCount += 1u;
      
      let sliceColor = vec4f(
        unpack2x16float(sliceData.value[0]),
        unpack2x16float(sliceData.value[1])
      );
      finalColor += sliceColor * (1.0 - finalColor.a);
    }

    if (requiresSliceHeadClear) {
      _clearSliceHeadPtr(processorId, _pixelInTilePos, s);
    }

    // dbg: color using only head ptrs
    /*if (slicePtr != INVALID_SLICE_DATA_PTR) {
      finalColor.g = 1.0;
      finalColor.a = 1.0;
      break;
    }*/
  } // END: ITERATE SLICES
  

  // finish remaining iterations if we "break;" early
  for(; s < SLICES_PER_PIXEL; s += 1u) {
    _clearSliceHeadPtr(processorId, _pixelInTilePos, s);
  }

  // final write
  if (isDbgSliceCnt) { // debug value
    let c = saturate(f32(sliceCount) / f32(dbgSlicesModeMaxSlices));
    finalColor = vec4f(c, 0., 0., 1.0);
  }
  _setRasterizerResult(viewportSizeU32, posPx, finalColor);
  return isPixelDone(finalColor, isDbgSliceCnt);
}

/** Returns true if any subsequent hair segments/slices do not matter. */
fn isPixelDone(finalColor: vec4f, isDbgSliceCnt: bool) -> bool {
  return !isDbgSliceCnt && finalColor.a >= ALPHA_CUTOFF;
}
`;var Vn=(t,e)=>`

struct TilesList {
  drawnTiles: ${de(e)},
  // processedTiles: u32, // TODO [NO] move here instead of hairTileSegmentsBuffer? Or is it better if fine pass stays read-only there?
  data: array<u32>, // tileIds
}

@group(0) @binding(${t})
var<storage, ${e}> _hairTileData: TilesList;
`;function wa(t,e){let n=Be(e),i=4+n.width*n.height,o=u.isTest?GPUBufferUsage.COPY_SRC:0;return t.createBuffer({label:"hair-tile-list",size:i*X,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|o})}var Kr={bindings:{renderUniforms:0,hairData:1,hairPositions:2,tilesBuffer:3,tileSegmentsBuffer:4,hairSlicesHeads:5,hairSlicesData:6,rasterizerResult:7,depthTexture:8,hairShading:9,hairTangents:10,tileList:11}},ye=Kr.bindings,Pa=()=>`

const SLICES_PER_PIXEL: u32 = ${u.hairRender.slicesPerPixel}u;
const WORKGROUP_SIZE: u32 = TILE_SIZE * TILE_SIZE;
// Stop processing slices once we reach opaque color
const ALPHA_CUTOFF = 0.999;

${he}
${G}
${Ue}
${Nn}

${A.SHADER_SNIPPET(ye.renderUniforms)}
${Pe(ye.hairData)}
${Ne(ye.hairPositions)}
${Le(ye.hairTangents)}
${yt(ye.tilesBuffer,"read")}
${mt(ye.tileSegmentsBuffer,"read")}
${Un(ye.rasterizerResult,"read_write")}
${Zi(ye.hairSlicesHeads,"read_write")}
${xa(ye.hairSlicesData,"read_write")}
${Pt(ye.hairShading,"read")}
${Vn(ye.tileList,"read")}

@group(0) @binding(${ye.depthTexture})
var _depthTexture: texture_depth_2d;

// TODO [MEDIUM] into workgroup mem to save a few registers?
struct FineRasterParams {
  // START: vec4u
  strandsCount: u32, // u32's first
  pointsPerStrand: u32,
  viewportSizeU32: vec2u,
  // START: mixed
  viewportSize: vec2f, // f32's
  fiberRadius: f32,
  processorId: u32,
  dbgSlicesModeMaxSlices: u32,
}

// Extra code to make this file manageable
${va()}
${ba()}

struct WorkgroupVars {
  // Index of currently processed tile for this workgroup
  currentTileIdx: u32,
  // Stop condition for entire algorithm
  hasMoreTiles: bool,

  // Write offset into slices data buffer
  sliceDataOffset: atomic<u32>,
  // Same as above, but not atomic, so we can use workgroupUniformLoad()
  // fixes "workgroupUniformLoad must not be called with an argument that contains an atomic type"
  sliceDataOffset_NOT_ATOMIC: u32,

  // Actually a bool, where each thread will AND if they are done.
  // If the value is still TRUE afterwards, then all pixels in the tile are done
  arePixelsDone: atomic<i32>,
  // Same as above, but not atomic, so we can use workgroupUniformLoad()
  // fixes "workgroupUniformLoad must not be called with an argument that contains an atomic type"
  arePixelsDone_NOT_ATOMIC: bool,
}
var<workgroup> _wkgrp: WorkgroupVars;

// Current hair segment processed by the tile.
// All threads (1 per pixel) will test against it.
// This value is only calculated by the first thread.
var<workgroup> _wkgrp_hairSegment: ProjectedHairSegment;

// Thread ID
var<private> _local_invocation_index: u32;
// Per-thread position of the pixel inside the tile.
// Both coordinates are in range: 0..TILE_SIZE
var<private> _pixelInTilePos: vec2u;
// Flag if pixel alpha is saturated and no futher hair segments will change it's color
var<private> _isPixelDone: bool;


// We run a thread per each pixel in a tile.
// A lot of work will be done only on the 1st thread
// (e.g. calculating hair segment raster params).
// Rest of the threads will just compare it's pixel coordinates to the result.
//
// See https://research.nvidia.com/sites/default/files/pubs/2011-08_High-Performance-Software-Rasterization/laine2011hpg_paper.pdf
@compute
@workgroup_size(TILE_SIZE, TILE_SIZE, 1)
fn main(
  // global index for entire workgroup
  @builtin(workgroup_id) workgroup_id: vec3<u32>,
  // threadId inside workgroup
  @builtin(local_invocation_index) local_invocation_index: u32,
) {
  let processorId = workgroup_id.x;
  let viewportSize: vec2f = _uniforms.viewport.xy;
  let maxDrawnSegments: u32 = _uniforms.maxDrawnHairSegments;
  let strandsCount: u32 = _hairData.strandsCount;
  let pointsPerStrand: u32 = _hairData.pointsPerStrand;
  _local_invocation_index = local_invocation_index;

  let params = FineRasterParams(
    strandsCount,
    pointsPerStrand,
    vec2u(viewportSize),
    viewportSize,
    _uniforms.fiberRadius,
    processorId,
    getDbgSlicesModeMaxSlices(),
  );

  _pixelInTilePos = vec2u(
    _local_invocation_index % TILE_SIZE,
    _local_invocation_index / TILE_SIZE
  );

  // clear memory before starting work
  _clearSlicesHeadPtrs(_pixelInTilePos, processorId);

  // tile count based on screen size. Used to check if tile is valid
  let tileCount2d = getTileCount(params.viewportSizeU32);
  let tileCount = tileCount2d.x * tileCount2d.y;
  // size of task queue
  let tilesToProcess = _hairTileData.drawnTiles;
  var tileIdx = getNextTileIdx(_local_invocation_index, tilesToProcess);

  while (!workgroupUniformLoad(&_wkgrp.hasMoreTiles)) {
    // prepare for new tile
    let tileXY = getTileXY(params.viewportSizeU32, tileIdx);
    var tileBoundsPx: vec4u = getTileBoundsPx(params.viewportSizeU32, tileXY);
    _isPixelDone = false;
    
    // iterate over depth bins
    for (
      var depthBin = 0u;
      depthBin < TILE_DEPTH_BINS_COUNT && tileIdx < tileCount;
      depthBin += 1u
    ) {
      // reset offset into slices data
      if (_local_invocation_index == 0u) {
        atomicStore(&_wkgrp.sliceDataOffset, 0u);
      }
      workgroupBarrier();

      // main algorithm - process tile's depth bin
      processTile(
        params,
        maxDrawnSegments,
        tileXY,
        depthBin,
        tileBoundsPx
      );
      
      // early out for whole tile
      if (checkAllPixelsInWkgrpDone(_local_invocation_index)) {
        // debugColorWholeTile(tileBoundsPx, vec4f(1., 0., 0., 1.));
        break;
      }
    } // END: iterate over depth bins

    // move to next tile
    tileIdx = getNextTileIdx(_local_invocation_index, tilesToProcess);
  }
}

fn processTile(
  params: FineRasterParams,
  maxDrawnSegments: u32,
  tileXY: vec2u,
  depthBin: u32,
  tileBoundsPx: vec4u
) {
  let MAX_PROCESSED_SEGMENTS = params.strandsCount * params.pointsPerStrand; // just in case
  
  let tileDepth = _getTileDepth(params.viewportSizeU32, tileXY, depthBin);
  if (tileDepth.y == 0.0) { return; } // no depth written means empty tile
  var segmentPtr = _getTileSegmentPtr(params.viewportSizeU32, tileXY, depthBin);

  var segmentData = vec3u(); // [strandIdx, segmentIdx, nextPtr]
  var processedSegmentCnt = 0u;

  // iterate over hair segments in a tile.
  // The code is a bit strange to make it more obvious the flow is uniform for all threads
  while (processedSegmentCnt < MAX_PROCESSED_SEGMENTS){
    let hasValidSegment = _getTileSegment(maxDrawnSegments, segmentPtr, &segmentData);

    // set rasterize params for hair segment
    if (hasValidSegment && _local_invocation_index == 0u) {
      let projParams = ProjectHairParams(
        params.pointsPerStrand,
        params.viewportSize,
        params.fiberRadius,
      );
      _wkgrp_hairSegment = projectHairSegment(
        projParams,
        segmentData.x, // strandIdx,
        segmentData.y  // segmentIdx
      );
    }
    workgroupBarrier();

    // update tile pixels
    if (hasValidSegment && !_isPixelDone) {
      processHairSegment(
        params,
        tileBoundsPx, tileDepth,
        segmentData.x, segmentData.y // strandIdx, segmentIdx
      );
    }
    workgroupBarrier();


    // break condition if has no more hair segments in a tile
    if (!hasValidSegment && _local_invocation_index == 0u) {
      // set invalid index that will trigger 'break;'
      atomicStore(&_wkgrp.sliceDataOffset, SLICE_DATA_PER_PROCESSOR_COUNT);
    }

    // trigger 'break;' if:
    //   1. run out of PPLL memory
    //   2. no more hair segments in a tile (see $hasValidSegment)
    let sliceDataOffset = getUniformSliceDataOffset(_local_invocation_index);
    if (!_hasMoreSliceDataSlots(sliceDataOffset)) {
      break;
    }

    // move to next segment
    processedSegmentCnt = processedSegmentCnt + 1;
    segmentPtr = segmentData.z;
  }

  let sliceDataOffset = getUniformSliceDataOffset(_local_invocation_index);
  if (sliceDataOffset == 0) {
    // no pixels were changed. This can happen if depth bin is empty. Move to next depth bin in that case
    return;
  }

  // reduce over slices list and set the final color into result buffer
  // this also clears the current processor state for next tile
  // debugColorWholeTile(tileBoundsPx, vec4f(1., 0., 0., 1.));
  if (!_isPixelDone){
    _isPixelDone = reduceHairSlices(
      params.processorId,
      params.viewportSizeU32,
      params.dbgSlicesModeMaxSlices,
      tileBoundsPx
    );
  }
}


//////////////////////////
/// Tile/slice processing utils

fn getNextTileIdx(local_invocation_index: u32, tileCount: u32) -> u32 {
  if (local_invocation_index == 0u) {
    _wkgrp.currentTileIdx = atomicAdd(&_hairRasterizerResults.tileQueueAtomicIdx, 1u);
    _wkgrp.hasMoreTiles = _wkgrp.currentTileIdx >= tileCount;
  }
  workgroupBarrier();

  let idx = workgroupUniformLoad(&_wkgrp.currentTileIdx);
  return _hairTileData.data[idx];
}

fn checkAllPixelsInWkgrpDone(local_invocation_index: u32) -> bool {
  // set initial bool to TRUE
  if (local_invocation_index == 0u) {
    atomicStore(&_wkgrp.arePixelsDone, 1);
  }
  workgroupBarrier();

  // ATOMIC_AND across all 
  // the select() semantic in WGLS is ..........
  // Just read it as '_isPixelDone ? 1 : 0'
  atomicAnd(&_wkgrp.arePixelsDone, select(0, 1, _isPixelDone));
  workgroupBarrier();

  // broadcast the result
  // fixes: "workgroupUniformLoad must not be called with an argument that contains an atomic type"
  if (local_invocation_index == 0u) {
    let v = atomicLoad(&_wkgrp.arePixelsDone);
    _wkgrp.arePixelsDone_NOT_ATOMIC = v > 0;
  }

  // has implicit barrier
  return workgroupUniformLoad(&_wkgrp.arePixelsDone_NOT_ATOMIC);
}

// Cannot call workgroupUniformLoad() on atomic<u32>. Copy to normal u32 first
fn getUniformSliceDataOffset(local_invocation_index: u32) -> u32 {
  if (local_invocation_index == 0u) {
    _wkgrp.sliceDataOffset_NOT_ATOMIC = atomicLoad(&_wkgrp.sliceDataOffset);
  }
  return workgroupUniformLoad(&_wkgrp.sliceDataOffset_NOT_ATOMIC);
}


//////////////////////////
/// Debug utils

fn debugColorWholeTile(tileBoundsPx: vec4u, color: vec4f) {
  let viewportSize: vec2f = _uniforms.viewport.xy;
  let viewportSizeU32: vec2u = vec2u(viewportSize);

  let boundRectMin = tileBoundsPx.xy;
  let boundRectMax = tileBoundsPx.zw;
  
  for (var y = boundRectMin.y; y < boundRectMax.y; y += 1u) {
  for (var x = boundRectMin.x; x < boundRectMax.x; x += 1u) {
    let pos_u32 = vec2u(x, y);
    _setRasterizerResult(viewportSizeU32, pos_u32, color);
  }}
}

fn debugColorPointInTile(tileBoundsPx: vec4u, pos: vec2f, color: vec4f) {
  let viewportSize: vec2f = _uniforms.viewport.xy;
  let viewportSizeU32: vec2u = vec2u(viewportSize);
  let pos_u32 = vec2u(u32(pos.x), u32(pos.y));

  let boundRectMin = tileBoundsPx.xy;
  let boundRectMax = tileBoundsPx.zw;
  
  if (
    pos_u32.x >= boundRectMin.x && pos_u32.y >= boundRectMin.y &&
    pos_u32.x <  boundRectMax.x && pos_u32.y <  boundRectMax.y
  ) {
    _setRasterizerResult(viewportSizeU32, pos_u32, color);
  }
}

`;var Hn=class t{static NAME="HairFinePass";pipeline;bindingsCache=new C;hairSlicesHeadsBuffer;hairSlicesDataBuffer;hairRasterizerResultsBuffer=void 0;constructor(e){let n=e.createShaderModule({label:B(t),code:Pa()});this.pipeline=e.createComputePipeline({label:F(t),layout:"auto",compute:{module:n,entryPoint:"main"}}),this.hairSlicesHeadsBuffer=Ji(e),this.hairSlicesDataBuffer=Sa(e)}cmdClearBeforeRender(e){this.hairSlicesHeadsBuffer&&Xe(e.cmdBuf,this.hairSlicesHeadsBuffer),Xe(e.cmdBuf,this.hairRasterizerResultsBuffer)}onViewportResize=(e,n)=>{this.bindingsCache.clear(),this.hairRasterizerResultsBuffer&&this.hairRasterizerResultsBuffer.destroy(),this.hairRasterizerResultsBuffer=ha(e,n)};cmdRasterizeSlicesHair(e,n){let{cmdBuf:r,profiler:i}=e,o=r.beginComputePass({label:t.NAME,timestampWrites:i?.createScopeGpu(t.NAME)}),a=this.bindingsCache.getBindings(n.name,()=>this.createBindings(e,n));o.setPipeline(this.pipeline),o.setBindGroup(0,a);let s=u.hairRender.processorCount;o.dispatchWorkgroups(s,1,1),o.end()}createBindings=(e,n)=>{let{device:r,globalUniforms:i,depthTexture:o,hairTilesBuffer:a,hairTileSegmentsBuffer:s,hairTileListBuffer:l}=e,c=Kr.bindings;$(o);let d=[i.createBindingDesc(c.renderUniforms),L(c.tilesBuffer,a),L(c.tileSegmentsBuffer,s),L(c.hairSlicesData,this.hairSlicesDataBuffer),L(c.rasterizerResult,this.hairRasterizerResultsBuffer),L(c.tileList,l),n.bindHairData(c.hairData),n.bindPointsPositions(c.hairPositions),n.bindTangents(c.hairTangents),n.bindShading(c.hairShading),{binding:c.depthTexture,resource:o}];return this.hairSlicesHeadsBuffer&&d.push(L(c.hairSlicesHeads,this.hairSlicesHeadsBuffer)),Z(t,n.name,r,this.pipeline,d)}};var ya=`

struct MarschnerParams {
  // https://blog.selfshadow.com/publications/s2016-shading-course/karis/s2016_pbs_epic_hair.pdf#page=44
  baseColor: vec3f,
  // scales the R term
  specular: f32,
  // shift - based on the tilt of the cuticle scales
  // alpha_R = -2*s; alpha_{TT} = s; alpha_{TRT} = 4 * s
  weightTT: f32,
  weightTRT: f32,
  shift: f32,
  // hair roughness
  // \beta_R = r^2; \beta_{TT} = 0.5 * (r^2); \beta_{TRT} = 2 * (r^2)
  roughness: f32
}

fn hairSpecularMarschner(
  p: MarschnerParams,
  toLight: vec3f, // L
  toCamera: vec3f, // V
  tangent: vec3f,
) -> vec3f {
  // from [Marschner03]
  // w_i - direction of illumination (w Illumination/Incoming)
  // w_r - direction in which scattered light is being computed (w Result)
  // theta_d - difference angle (theta_r \u2212 theta_i) / 2
  // There is also 5.2.3 'Approximation for eccentricity' if you are not as lazy as me (not implemented)


  // For derivation we are following GPU gems chapter 23.
  // dot() is used for sin() value. Interesting, but depends on which angle we are calculating the value for?
  let sin_theta_i = dot(tangent, toLight);
  let sin_theta_r = dot(tangent, toCamera);
  // TODO [MEDIUM] does sign of cos matter for us?
	let cos_theta_i = sqrt(max(0., 1. - sin_theta_i * sin_theta_i)); // Pythagorean Identity
	let cos_theta_r = sqrt(max(0., 1. - sin_theta_r * sin_theta_r));
  // Cosine-difference formula: cos(\u03B1\u2212\u03B2) = cos\u03B1 \u22C5 cos\u03B2 + sin\u03B1 \u22C5 sin\u03B2 
	let cos_theta_d_fullAngle = cos_theta_i * cos_theta_r + sin_theta_i * sin_theta_r;
  let cos_theta_d = cosOfHalfAngle(cos_theta_d_fullAngle); // theta_d is half angle, see above
  // GPU gems chapter 23, page 374
  let lightPerp = toLight - sin_theta_i * tangent;
	let cameraPerp = toCamera - sin_theta_r * tangent;
  let cos_phi = dot(lightPerp, cameraPerp) * inverseSqrt(length(lightPerp) * length(cameraPerp) + 1e-4);
  let cos_half_phi = cosOfHalfAngle(cos_phi);

  // For each lobe (R, TT, TRT):
  // M_p(theta_i, theta_r) - longitudinal scattering function
  // N_p(theta_i, theta_r, phi) - azimuthal scattering function

  // R: The light ray **REFLECTS** off the front of the hair fiber.
  // Not much color (smth. like specular), as the light does not penetrate strand.
  var alpha = -2.0 * p.shift;
  var beta = p.roughness * p.roughness;
  let M_r = longitudinalScattering_Gaussian(sin_theta_i, sin_theta_r, alpha, beta);
  let N_r = azimuthalScattering_R(cos_theta_d, cos_half_phi);
  // TT: The light ray **TRANSMITS THROUGH** the front of the fiber,
  // passes through the interior which colors it due to absorption
  // and then transmits through the other side.
  // Some color. Light goes through the strand once.
  alpha = p.shift;
  beta = 0.5 * p.roughness * p.roughness;
  let M_tt = longitudinalScattering_Gaussian(sin_theta_i, sin_theta_r, alpha, beta);
  let N_tt = azimuthalScattering_TT(p.baseColor, cos_theta_d, cos_phi, cos_half_phi);
  // TRT: The light ray transmits through the front of the fiber,
  // 1. **PASSES THROUGH** the colored interior.
  // 2. **REFLECTS** off the opposite side.
  // 3. **PASSES THROUGH** the interior again and transmits out the front.
  // A LOT of color. Light goes through the strand twice.
  alpha = 4.0 * p.shift;
  beta = 2.0 * p.roughness * p.roughness;
  let M_trt = longitudinalScattering_Gaussian(sin_theta_i, sin_theta_r, alpha, beta);
  let N_trt = azimuthalScattering_TRT(p.baseColor, cos_theta_d, cos_phi);

  return (p.specular * M_r * N_r) + (p.weightTT * M_tt * N_tt) + (p.weightTRT * M_trt * N_trt);
  // DBG:
  // let r = (specular * M_r * N_r);
  // return vec3f(r, 0.0, 0.0); // dbg: r
  // return M_tt * N_tt; // dbg: tt
  // return M_trt * N_trt; // dbg: trt
}

/** https://blog.selfshadow.com/publications/s2016-shading-course/karis/s2016_pbs_epic_hair.pdf#page=20 */
fn cosOfHalfAngle(cosAngle: f32) -> f32 {
  return sqrt(saturate(0.5 + 0.5 * cosAngle));
}

const SQRT_TWO_PI: f32 = ${Math.sqrt(2*Math.PI)};
/** Index of refraction for human hair */
const ETA = 1.55;
const HAIR_F0 = (1. - ETA) * (1. - ETA) / ((1. + ETA) * (1. + ETA));

// Beta is based on the roughness of the fiber
// Alpha is based on the tilt of the cuticle scales
/** https://blog.selfshadow.com/publications/s2016-shading-course/karis/s2016_pbs_epic_hair.pdf#page=18 */
fn longitudinalScattering_Gaussian(
  sin_theta_i: f32, sin_theta_r: f32,
  alpha: f32, beta: f32
) -> f32 {
  let a = sin_theta_i + sin_theta_r - alpha; // sin(theta_i) + sin(theta_r) - alpha;
  let b = -(a * a) / (2.0 * beta * beta);
  return exp(b) / (beta * SQRT_TWO_PI);
}

/** https://blog.selfshadow.com/publications/s2016-shading-course/karis/s2016_pbs_epic_hair.pdf#page=20 */
fn azimuthalScattering_R(cos_theta_d: f32, cos_half_phi: f32) -> f32 {
  let attenuation = FresnelSchlick1(cos_theta_d, HAIR_F0);
  return 0.25 * cos_half_phi * attenuation;
}

/** https://blog.selfshadow.com/publications/s2016-shading-course/karis/s2016_pbs_epic_hair.pdf#page=23 */
fn azimuthalScattering_TT(
  baseColor: vec3f,
  cos_theta_d: f32, 
  cos_phi: f32,
  cos_half_phi: f32,
) -> vec3f {
  let eta_prime = (1.19 / cos_theta_d) + (0.36 * cos_theta_d); // slide 26
  let a = 1.0 / eta_prime; // slide 25, should be an alpha, but 'a' is less confusing
  let h_TT = (1.0 + a * (0.6 - 0.8 * cos_phi)) * cos_half_phi; // slide 25

  // slide 28: absorption term
  let T_powNum = sqrt(1.0 - h_TT * h_TT * a * a);
  let T_powDenum = 2.0 * cos_theta_d;
  let T_TT = pow(baseColor, vec3f(T_powNum / T_powDenum));
  // slide 29: distribution
  let D_TT = exp(-3.65 * cos_phi - 3.98);
  // slide 25
  let f_angle = cos_theta_d * sqrt(saturate(1.0 - h_TT * h_TT));
	let f = FresnelSchlick1(f_angle, HAIR_F0);
	let f_TT = (1.0 - f) * (1.0 - f); // there is also F(...)^{p-1}, but we can skip
	
	return f_TT * T_TT * D_TT; // slide 23
}

/** https://blog.selfshadow.com/publications/s2016-shading-course/karis/s2016_pbs_epic_hair.pdf#page=32 */
fn azimuthalScattering_TRT(
  baseColor: vec3f,
  cos_theta_d: f32, 
  cos_phi: f32,
) -> vec3f {
  // slide 32: absorption term
  let T_TRT = pow(baseColor, vec3f(0.8 / cos_theta_d));
  // slide 32: distribution
  let D_TRT = exp(17.0 * cos_phi - 16.78);
  // slide 32
  // const h_TRT = ${Math.sqrt(3)/2}; // slide 32
  // const f_angleMod_TRT = Math.sqrt(1.0 - h_TRT * h_TRT); // similar as for f_angle in TT
  let f_angle = cos_theta_d * 0.5; // substituted value from f_angleMod_TRT. It's literary 'Math.sqrt(1 - 3/4)'
	let f = FresnelSchlick1(f_angle, HAIR_F0);
  let f_TRT = (1.0 - f) * (1.0 - f) * f; // las multiply by 'f' cause F(...)^{p-1}
	
  return f_TRT * T_TRT * D_TRT; // like slide 23
}

`;var Et={workgroupSizeX:1,workgroupSizeY:u.hairRender.shadingPoints,bindings:{renderUniforms:0,hairData:1,hairPositions:2,hairTangents:3,hairShading:4,shadowMapTexture:5,shadowMapSampler:6,aoTexture:7,depthTexture:8}},Ta=Et,je=Et.bindings,Ea=()=>`

${he}
${G}
${Wr}
${ya}
${On}
${Cn({bindingTexture:je.shadowMapTexture,bindingSampler:je.shadowMapSampler})}

${A.SHADER_SNIPPET(je.renderUniforms)}
${Pe(je.hairData)}
${Ne(je.hairPositions)}
${Le(je.hairTangents)}
${Pt(je.hairShading,"read_write")}
${bt(je.aoTexture)}
${vt}

@group(0) @binding(${je.depthTexture})
var _depthTexture: texture_depth_2d;


@compute
@workgroup_size(${Ta.workgroupSizeX}, ${Ta.workgroupSizeY}, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
) {
  let strandIdx = global_id.x;
  let shadingPointId = global_id.y;
  let SHADING_POINTS_f32 = f32(SHADING_POINTS);
  let cameraPositionWS = _uniforms.cameraPosition.xyz;
  let viewport = vec2f(_uniforms.viewport.xy);
  let modelMatrix = _uniforms.modelMatrix;
  let vpMatrix = _uniforms.vpMatrix;
  let pointsPerStrand = _hairData.pointsPerStrand;

  var color = vec4f(0., 0., 0., 1.);

  // 0.0 at root, 1.0 at tip
  let t = f32(shadingPointId) / SHADING_POINTS_f32;
  // dbg: 't': // red at root, green at tip
  // color.r = 1.0 - t;
  // color.g = t;

  var segmentIndices: vec2u;
  let tInSegment = remapToIndices(pointsPerStrand, t, &segmentIndices);
  // color.r = select(1., 0., tInSegment > 0.5); // dbg: half of the segment is black, half is red
  // color.r = select(1., 0., (segmentIndices.x & 1) == 1); // dbg: alternate red-black segments

  let segment0_obj: vec3f = _getHairPointPosition(pointsPerStrand, strandIdx, segmentIndices.x).xyz;
  let segment1_obj: vec3f = _getHairPointPosition(pointsPerStrand, strandIdx, segmentIndices.y).xyz;
  let tangent0_obj = normalize(segment1_obj - segment0_obj);
  let tangent1_obj = _getHairTangent(pointsPerStrand, strandIdx, segmentIndices.y).xyz;
  let positionOBJ = mix(segment0_obj, segment1_obj, tInSegment);
  let tangentOBJ = mix(tangent0_obj, tangent1_obj, tInSegment);
  let positionWS = modelMatrix * vec4f(positionOBJ, 1.0);
  let tangentWS = modelMatrix * vec4f(tangentOBJ, 1.0);
  let positionProj = projectVertex(vpMatrix, positionWS);
  let positionPx_0_1 = vec2f( // range: [0, 1]
    (positionProj.x * 0.5 + 0.5),
    (positionProj.y * 0.5 + 0.5),
  );
  // let positionPx = viewport * positionPx_0_1; // range: [0.,  viewportPixels.xy]
  let positionTexSamplePx = viewport * vec2f(positionPx_0_1.x, 1.0 - positionPx_0_1.y); // range: [0.,  viewportPixels.xy]


  // base color
  let baseColor0 = _uniforms.hairMaterial.color0;
  let baseColor1 = _uniforms.hairMaterial.color1;
  var baseColor = mix(baseColor0, baseColor1, t);
  let randStrandColor = randomRGB(strandIdx, 1.0);
  // let randStrandColor = vec3f(0., 1., 0.);
  baseColor = mix(baseColor, randStrandColor, _uniforms.hairMaterial.colorRng);
  let rngBrightness = fract(f32(strandIdx) / 255.0);
  baseColor = mix(baseColor, baseColor * rngBrightness, _uniforms.hairMaterial.lumaRng);
  // baseColor = vec3f(rngBrightness);

  let toCamera: vec3f = normalize(cameraPositionWS - positionWS.xyz);
  let params = MarschnerParams(
    baseColor,
    _uniforms.hairMaterial.specular, // (weight for .r)
    _uniforms.hairMaterial.weightTT,
    _uniforms.hairMaterial.weightTRT,
    _uniforms.hairMaterial.shift,
    _uniforms.hairMaterial.roughness,
  );

  // shadow
  let maxShadowStr = _uniforms.hairMaterial.shadows;
  let mvpShadowSourceMatrix = _uniforms.shadows.sourceMVP_Matrix;
  var shadow = getShadow(
    mvpShadowSourceMatrix,
    positionWS,
    tangentWS.xyz,
  );
  shadow = clamp(shadow, 1.0 - maxShadowStr, 1.0);
  // baseColor = vec3f(shadow); // dbg

  // ao
  var ao = sampleAo(vec2f(viewport.xy), positionTexSamplePx);
  ao = 1.0 - mix(1.0, ao, _uniforms.ao.strength); // 0-unoccluded, 1-occluded
  // baseColor = vec3f(ao); // dbg

  // attenuation
  let attenuation = getAttenuation(
    positionProj,
    positionTexSamplePx,
    _uniforms.hairMaterial.attenuation,
  );
  ao = saturate(ao + attenuation);

  
  // start light/material calc.
  let ambient = _uniforms.lightAmbient.rgb * _uniforms.lightAmbient.a;
  var radianceSum = vec3(0.0);

  radianceSum += hairShading(params, _uniforms.light0, toCamera, tangentWS, positionWS, shadow, ao);
  radianceSum += hairShading(params, _uniforms.light1, toCamera, tangentWS, positionWS, shadow, ao);
  radianceSum += hairShading(params, _uniforms.light2, toCamera, tangentWS, positionWS, shadow, ao);

  // thin-tip alpha.
  let alpha = select(1.0, 0.0, shadingPointId >= SHADING_POINTS - 1);
  color = vec4f(radianceSum, alpha); // TODO [IGNORE] add material.alpha [0.8 .. 1.0]?
  _setShadingPoint(strandIdx, shadingPointId, color);
  // _setShadingPoint(strandIdx, shadingPointId, vec4f(baseColor, 1.0)); // dbg
}

fn hairShading(
  p: MarschnerParams,
  light: Light,
  toCamera: vec3f,
  tangentWS: vec4f,
  positionWS: vec4f,
  shadow: f32,
  aoTerm: f32, // 0-unoccluded, 1-occluded
) -> vec3f {
  let toLight: vec3f = normalize(light.position.xyz - positionWS.xyz);

  let diffuse = KajiyaKayDiffuse(p.baseColor, toLight, tangentWS.xyz);
  let multipleScatter = fakeMultipleScattering(
    toCamera,
    toLight,
    tangentWS,
    p.baseColor,
    shadow
  );
  var diffuseTotal = diffuse * multipleScatter * saturate(dot(tangentWS.xyz, toLight));
  // diffuseTotal *= shadow;
  // return diffuseTotal;

  let marschnerSpec = hairSpecularMarschner(
    p,
    toLight,
    toCamera,
    tangentWS.xyz,
  );

  // TODO [IGNORE] better tune diffuse-specular addition, see:
  //      https://www.fxguide.com/fxfeatured/pixars-renderman-marschner-hair (last section)
  let brdfFinal = diffuseTotal + marschnerSpec;
  // let brdfFinal = pbr_mixDiffuseAndSpecular(material, lambert, specular, F);
  
  let lightAttenuation = 1.0; // hardcoded for this demo
  let radiance = lightAttenuation * light.colorAndEnergy.rgb * light.colorAndEnergy.a; // incoming color from light

  return brdfFinal * radiance * (1.0 - aoTerm);
}


/** https://web.engr.oregonstate.edu/~mjb/cs557/Projects/Papers/HairRendering.pdf#page=12 */
fn KajiyaKayDiffuse(baseColor: vec3f, toLight: vec3f, tangent: vec3f) -> vec3f {
  // diffuse lighting: the lerp shifts the shadow boundary for a softer look
  let diffuse = mix(0.25, 1.0, dot(tangent, toLight));
  return diffuse * baseColor;
}

/** https://blog.selfshadow.com/publications/s2016-shading-course/karis/s2016_pbs_epic_hair.pdf#page=39 */
fn fakeMultipleScattering(
  toCamera: vec3f,
  toLight: vec3f,
  tangentWS: vec4f,
  baseColor: vec3f,
  shadow: f32,
) -> vec3f {
  let fakeNormal: vec3f = normalize(toCamera - tangentWS.xyz * dot(toCamera, tangentWS.xyz));

  // term 2
  let NoL = saturate(dot(fakeNormal, toLight));
  let diffuseScatter = (NoL + 1.0) / (4.0 * PI);
  // term 3
  let luma = toLuma_fromLinear(baseColor);
  let tint: vec3f = pow(baseColor / luma, vec3f(1. - shadow));

  // combine
  return sqrt(baseColor) * diffuseScatter * tint;
}

fn getShadow(
  mvpShadowSourceMatrix: mat4x4f,
  positionWS: vec4f,
  normalWS: vec3f,
) -> f32 {
  let shadowSourcePositionWS = _uniforms.shadows.sourcePosition.xyz;
  let positionShadowSpace = projectToShadowSpace(
    mvpShadowSourceMatrix, positionWS
  );
  return 1.0 - calculateDirectionalShadow(
    _uniforms.shadows.usePCSS > 0u,
    shadowSourcePositionWS,
    positionWS.xyz,
    normalWS,
    positionShadowSpace,
    _uniforms.shadows.PCF_Radius,
    _uniforms.shadows.bias
  );
}

/**
 * Fake attenuation mimicking https://en.wikipedia.org/wiki/Beer%E2%80%93Lambert_law
 */
fn getAttenuation(
  positionProj: vec3f,
  positionTexSamplePx: vec2f,
  attenuationFactor: f32,
) -> f32 {
  let myDepth = linearizeDepth(positionProj.z); // [zNear, zFar]
  let zBufferDepthProj = textureLoad(_depthTexture, vec2u(positionTexSamplePx), 0);
  let zBufferDepth = linearizeDepth(zBufferDepthProj); // [zNear, zFar]
  let depthDiff = abs(myDepth - zBufferDepth); // small value means near front. Bigger values further back
  // If you want, you can call exp() if you want. Not sure this fake impl is "standarized". But it looks nice.
  return depthDiff * attenuationFactor;

  // dbg
  // baseColor = vec3f(depthDiff * 10.0); // dbg
  // var c: f32; let rescale = vec2f(0.002, 0.01); // dbg
  // c = depthDiff * 10.0;
  // c = mapRange(rescale.x, rescale.y, 0., 1., myDepth / (100.0 - 0.1));
  // c = mapRange(rescale.x, rescale.y, 0., 1., zBufferDepth / (100.0 - 0.1));
  // c = positionPx.y / viewport.y;
  // c = mapRange(.2, .4, 0., 1., c);
  // c = select(0., 1., c > .5);
  // baseColor = vec3f(c); // dbg
  // baseColor = vec3f(attenuation); // dbg
}

`;var $n=class t{static NAME="HairShadingPass";pipeline;bindingsCache=new C;constructor(e){let n=e.createShaderModule({label:B(t),code:Ea()});this.pipeline=e.createComputePipeline({label:F(t),layout:"auto",compute:{module:n,entryPoint:"main"}})}onViewportResize=()=>{this.bindingsCache.clear()};cmdComputeShadingPoints(e,n){let{cmdBuf:r,profiler:i}=e,o=r.beginComputePass({label:t.NAME,timestampWrites:i?.createScopeGpu(t.NAME)}),a=this.bindingsCache.getBindings(n.name,()=>this.createBindings(e,n));o.setPipeline(this.pipeline),o.setBindGroup(0,a);let s=pe(n.strandsCount,Et.workgroupSizeX),l=pe(u.hairRender.shadingPoints,Et.workgroupSizeY);o.dispatchWorkgroups(s,l,1),o.end()}createBindings=(e,n)=>{let{device:r,globalUniforms:i,shadowDepthTexture:o,shadowMapSampler:a,depthTexture:s,aoTexture:l}=e,c=Et.bindings;return $(s),Z(t,n.name,r,this.pipeline,[i.createBindingDesc(c.renderUniforms),n.bindHairData(c.hairData),n.bindPointsPositions(c.hairPositions),n.bindTangents(c.hairTangents),n.bindShading(c.hairShading),{binding:c.shadowMapTexture,resource:o},{binding:c.shadowMapSampler,resource:a},{binding:c.aoTexture,resource:l},{binding:c.depthTexture,resource:s}])}};var Zr={bindings:{renderUniforms:0}},df=Zr.bindings,Ia=()=>`

${A.SHADER_SNIPPET(df.renderUniforms)}


@vertex
fn main_vs(
  @location(0) inWorldPos : vec3f,
) -> @builtin(position) vec4f {
  let mvpMatrix = _uniforms.shadows.sourceMVP_Matrix;
  return mvpMatrix * vec4<f32>(inWorldPos.xyz, 1.0);
}


@fragment
fn main_fs() -> @location(0) vec4<f32> {
  return vec4(0.0);
}
`;var Qr={bindings:{renderUniforms:0,hairPositions:1,hairTangents:2}},Jr=Qr.bindings,Ma=()=>`

${he}
${Ge}
${G}
${Gn}

${A.SHADER_SNIPPET(Jr.renderUniforms)}
${Ne(Jr.hairPositions)}
${Le(Jr.hairTangents)}


@vertex
fn main_vs(
  @builtin(vertex_index) inVertexIndex : u32
) -> @builtin(position) vec4f {
  let hwRasterParams = HwHairRasterizeParams(
    _uniforms.shadows.sourceModelViewMat,
    _uniforms.shadows.sourceProjMatrix,
    getShadowFiberRadius(),
    inVertexIndex
  );
  let hwRasterResult = hwRasterizeHair(hwRasterParams);

  return hwRasterResult.position;
}


@fragment
fn main_fs() -> @location(0) vec4<f32> {
  return vec4(0.0);
}
`;var Wn=class t{static NAME="ShadowMapPass";pipelineMeshes;pipelineHair;bindingsCache=new C;shadowMapSampler;shadowDepthTexture;shadowDepthTextureView;constructor(e){this.shadowMapSampler=ea(e);let n=e.createShaderModule({label:B(t),code:Ia()});this.pipelineMeshes=e.createRenderPipeline({label:F(t),layout:"auto",vertex:{module:n,entryPoint:"main_vs",buffers:[$r]},fragment:{module:n,entryPoint:"main_fs",targets:[]},primitive:{..._t,cullMode:"none"},depthStencil:{...xt,format:u.shadows.depthFormat}});let r=e.createShaderModule({label:B(t),code:Ma()}),i=Ze.createPipelineDesc(r);this.pipelineHair=e.createRenderPipeline(i);let o=u.shadows;this.shadowDepthTexture=e.createTexture({label:"shadowmap-depth-texture",size:[o.textureSize,o.textureSize,1],format:o.depthFormat,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.shadowDepthTextureView=this.shadowDepthTexture.createView()}cmdUpdateShadowMap(e){let{cmdBuf:n,profiler:r,shadowDepthTexture:i,scene:o}=e,a=n.beginRenderPass({label:t.NAME,colorAttachments:[],depthStencilAttachment:St(i,"clear"),timestampWrites:r?.createScopeGpu(t.NAME)});a.setPipeline(this.pipelineMeshes);let s=this.bindingsCache.getBindings("meshes",()=>this.createBindingsMeshes(e));a.setBindGroup(0,s);for(let c of o.objects)this.renderMesh(a,c);let l=o.hairObject;a.setPipeline(this.pipelineHair),s=this.bindingsCache.getBindings(`hair-${l.name}`,()=>this.createBindingsHair(e,l)),a.setBindGroup(0,s),Ze.cmdRenderHair(a,l),a.end()}renderMesh(e,n){if(n.isColliderPreview)return;e.setVertexBuffer(0,n.positionsBuffer),e.setIndexBuffer(n.indexBuffer,"uint32");let r=n.triangleCount*Ce;e.drawIndexed(r,1,0,0,0)}createBindingsMeshes=({device:e,globalUniforms:n})=>{let r=Zr.bindings;return se(t,e,this.pipelineMeshes,[n.createBindingDesc(r.renderUniforms)])};createBindingsHair=({device:e,globalUniforms:n},r)=>{let i=Qr.bindings;return Z(Ze,r.name,e,this.pipelineHair,[n.createBindingDesc(i.renderUniforms),r.bindPointsPositions(i.hairPositions),r.bindTangents(i.hairTangents)])}};var ei=u.camera,hf=2*Math.tan(De(ei.projection.fovDgr)*.5),Aa=`

const Z_FAR: f32 = ${ei.projection.far};
const Z_NEAR: f32 = ${ei.projection.near};
// used to calculate distance from camera to far plane in pixel-ish space
// const VIEWPORT_HEIGHT_OVER_DISTANCE_TO_CAMERA: f32 =  ${hf};

fn reprojectPositionToVS(
  projMatrixInv: mat4x4f,
  viewport: vec2f,
  positionPx: vec2f
) -> vec3f {
  // depth
  let depth: f32 = textureLoad(_depthTexture, vec2u(positionPx), 0);

  // get the projected position from pixel coords
  let posXY_0_1 = positionPx / viewport; // XY position in range [0 .. 1]
  let posXY_neg1_1 = posXY_0_1 * 2.0 - 1.0; // XY position in range [-1 .. 1]
  let posProj = vec4f(posXY_neg1_1, depth, 1.0);
  
  // reproject to view space
  var result = projectVertex(projMatrixInv, posProj);
  result.z = linearizeDepth(depth); // range: [zNear, Z_FAR]
  return result;
}

fn gtao(
  projMatrixInv: mat4x4f,
  viewMatrix: mat4x4f,
  /** FULLRES viewport size. If AO is half res, this parameter ignores this. */
  viewport: vec2f,
  /** Position in pixels for normal and depth textures (FULLRES). If AO is half res, this parameter ignores this. */
  positionPx: vec2f,
  normalWS: vec3f,
) -> f32 {
  let params = _uniforms.ao;

  let positionVS: vec3f = reprojectPositionToVS(projMatrixInv, viewport, positionPx);
  var normalVS: vec3f = (viewMatrix * vec4f(normalWS, 1.)).xyz;
  // calculation uses left handed system
  normalVS.z = -normalVS.z;
  
  let toCamera: vec3f	= normalize(-positionVS.xyz);
  
  // test for background
  if (positionVS.z >= (0.999 * Z_FAR)) { return 0.0; } // not perfect, but close enough?
  // return 1.0; // dbg: bg test

  // scale radius with distance. I left orignal code (commented), but we can do it simplier and good enough
  // clipInfoZ := distance from camera where 1px == 1 view space unit.
  // opengl multiplies by 0.5 cause [-1, 1] depth. WebGPU has [0, 1].
  // let clipInfoZ = viewport.y / VIEWPORT_HEIGHT_OVER_DISTANCE_TO_CAMERA; // 1343.5
  // var radius = params.radius * (clipInfoZ / positionVS.z);
  // radius = max(f32(params.numSteps), radius);
  let radius = max(f32(params.numSteps), params.radius * (positionVS.z / Z_FAR));
  // return radius / (f32(params.numSteps));
  
  let stepSize = radius / f32(params.numSteps);
  var ao = 0.0;
  
  // Rotation jitter approach from
  // https://github.com/MaxwellGengYF/Unity-Ground-Truth-Ambient-Occlusion/blob/9cc30e0f31eb950a994c71866d79b2798d1c508e/Shaders/GTAO_Common.cginc#L152-L155
  let rotJitterOffset = PI * fract(52.9829189 * fract(dot(positionPx, vec2(0.06711056, 0.00583715))));
  let jitterMod = (positionPx.x + positionPx.y) * 0.25;
  let radiusJitterOffset = fract(jitterMod) * stepSize * 0.25;
  
  
  for (var i = 0u; i < params.numDirections; i++) {
    var phi = f32(i) * (PI / f32(params.numDirections)) + params.directionOffset * PI;
    phi += rotJitterOffset;
    
    var currStep = 1.0 + 0.25 * stepSize; // * STEP_OFFSET;
    currStep += radiusJitterOffset;
    
    let dir = vec3(cos(phi), sin(phi), 0.0); // sample direction in pixel space
    var horizons = vec2(-1.0);
    
    // calculate horizon angles
    for (var j = 0u; j < params.numSteps; j++) {
      let offset = round_2f(dir.xy * currStep);

      // h1
      var s = reprojectPositionToVS(projMatrixInv, viewport, positionPx + offset); // sample point
      var ws = s.xyz - positionVS.xyz; // from fragment to sample point
      var dist2 = length(ws); // distance between fragment and sample
      var cosh = dot(ws, toCamera) * inverseSqrt(dist2); // just read the HBAO paper..
      var falloff = gtaoFalloff(dist2, params.falloffStart2, params.falloffEnd2);
      horizons.x = max(horizons.x, cosh - falloff);

      // h2
      s = reprojectPositionToVS(projMatrixInv, viewport, positionPx - offset);
      ws = s.xyz - positionVS.xyz;
      dist2 = length(ws);
      cosh = dot(ws, toCamera) * inverseSqrt(dist2);
      falloff = gtaoFalloff(dist2, params.falloffStart2, params.falloffEnd2);
      horizons.y = max(horizons.y, cosh - falloff);

      // increment
      currStep += stepSize;
    }

    horizons = acos(horizons);
    
    // calculate gamma angle
    let bitangent: vec3f = normalize(cross(dir, toCamera));
    let tangent: vec3f = cross(toCamera, bitangent);
    let nx: vec3f = normalVS - bitangent * dot(normalVS, bitangent);
    
    let nnx = length(nx);
    let nnxInv = 1.0 / (nnx + 1e-6); // to avoid division with zero
    let cosxi = dot(nx, tangent) * nnxInv; // xi = gamma + HALF_PI
    let gamma = acos(cosxi) - HALF_PI;
    let cosgamma = dot(nx, toCamera) * nnxInv;
    let singamma2 = -2.0 * cosxi; // cos(x + HALF_PI) = -sin(x)
    
    // clamp to normal hemisphere
    horizons.x = gamma + max(-horizons.x - gamma, -HALF_PI);
    horizons.y = gamma + min( horizons.y - gamma,  HALF_PI);

    // Riemann integral is additive
    ao += nnx * 0.25 * (
      (horizons.x * singamma2 + cosgamma - cos(2.0 * horizons.x - gamma)) +
      (horizons.y * singamma2 + cosgamma - cos(2.0 * horizons.y - gamma))
    );
  }

  return ao / f32(params.numDirections);
}

// Who tf wrote this docs: https://www.w3.org/TR/WGSL/#round-builtin ?
fn round_f(v: f32) -> f32 { return select(ceil(v), floor(v), v < 0.5); }
fn round_2f(v: vec2f) -> vec2f {
  return vec2f(round_f(v.x), round_f(v.y));
}

fn gtaoFalloff(dist: f32, falloffStart2: f32, falloffEnd2: f32) -> f32 {
  return 2.0 * saturate(
    (dist - falloffStart2) / (falloffEnd2 - falloffStart2)
  );
}

`;var ni={bindings:{renderUniforms:0,depthTexture:1,normalsTexture:2}},ti=ni.bindings,Da=()=>`

${Fe}
${vt}
${G}
${Ge}
${Aa}

${A.SHADER_SNIPPET(ti.renderUniforms)}

@group(0) @binding(${ti.depthTexture})
var _depthTexture: texture_depth_2d;

@group(0) @binding(${ti.normalsTexture})
var _normalsTexture: texture_2d<f32>;


@vertex
fn main_vs(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4f {
  return getFullscreenTrianglePosition(VertexIndex);
}

const AO_TEXTURE_SCALE = ${u.ao.textureSizeMul};

@fragment
fn main_fs(
  @builtin(position) fragPositionPxF32_halfRes: vec4<f32>
) -> @location(0) f32 {
  let projMatrixInv = _uniforms.projMatrixInv;
  let viewMatrix = _uniforms.viewMatrix;
  let viewport = vec2f(_uniforms.viewport.xy);

  // pixel position
  let fragPositionPxF32_fullRes = fragPositionPxF32_halfRes.xy / AO_TEXTURE_SCALE; // in [0, viewportPx.xy]
  let fragPositionPx_fullRes: vec2u = vec2u(fragPositionPxF32_fullRes); // in [0, viewportPx.xy]
 
  // normals
  let normalsOct: vec2f = textureLoad(_normalsTexture, fragPositionPx_fullRes, 0).xy;
  let normal = decodeOctahedronNormal(normalsOct);

  // depth
  let depth: f32 = textureLoad(_depthTexture, fragPositionPx_fullRes, 0);
  
  // get the projected position from pixel coords
  let posXY_0_1 = fragPositionPxF32_fullRes / viewport; // XY position in range [0 .. 1]
  let posXY_neg1_1 = posXY_0_1 * 2.0 - 1.0; // XY position in range [-1 .. 1]
  let positionProj = vec4f(posXY_neg1_1, depth, 1.0);

  return gtao(
    projMatrixInv,
    viewMatrix,
    viewport,
    fragPositionPxF32_fullRes,
    normal
  );
}

`;var jn=class t{static NAME="AoPass";pipeline;bindingsCache=new C;constructor(e,n){let r=e.createShaderModule({label:B(t),code:Da()});this.pipeline=e.createRenderPipeline({label:F(t),layout:"auto",vertex:{module:r,entryPoint:"main_vs",buffers:[]},fragment:{module:r,entryPoint:"main_fs",targets:[{format:n}]},primitive:{topology:"triangle-list"}})}onViewportResize=()=>this.bindingsCache.clear();cmdCalcAo(e){let{cmdBuf:n,profiler:r,aoTexture:i}=e;$(i);let o=n.beginRenderPass({label:t.NAME,colorAttachments:[ee(i,u.clearAo,"clear")],timestampWrites:r?.createScopeGpu(t.NAME)}),a=this.bindingsCache.getBindings("-",()=>this.createBindings(e));o.setBindGroup(0,a),o.setPipeline(this.pipeline),We(o),o.end()}createBindings=e=>{let{device:n,globalUniforms:r,hdrRenderTexture:i,normalsTexture:o,depthTexture:a}=e,s=ni.bindings;return $(i),se(t,n,this.pipeline,[r.createBindingDesc(s.renderUniforms),{binding:s.depthTexture,resource:a},{binding:s.normalsTexture,resource:o}])}};var gf=I.create(),Yn=K.create(),ke=class t{static SHADER_SNIPPET=e=>`

    ${ae.SDF_DATA_SNIPPET}
    ${Oe.GRID_DATA_SNIPPET}

    struct SimulationUniforms {
      modelMatrix: mat4x4<f32>,
      modelMatrixInv: mat4x4<f32>,
      collisionSphere: vec4f, // in OBJECT space!!!
      wind: vec4f, // [direction.xyz, strength]
      sdf: SDFCollider,
      gridData: GridData,
      // START: misc: vec4f
      deltaTime: f32,
      gravity: f32,
      constraintIterations: u32,
      frameIdx: u32,
      // START: misc2: vec4f
      windStrengthLull: f32,
      windColisionTraceOffset: f32,
      stiffnessLengthConstr: f32,
      stiffnessCollisions: f32,
      // START: misc3: vec4f
      stiffnessSDF: f32,
      volumePreservation: f32,
      friction: f32,
      stiffnessGlobalConstr: f32,
      // START: misc4: vec4f
      globalConstrExtent: f32,
      globalConstrFade: f32,
      stiffnessLocalConstr: f32,
      windPhaseOffset: f32,
      // START: misc5: vec4f
      windStrengthFrequency: f32,
      windStrengthJitter: f32,
      padding0: f32,
      padding1: f32,
    };
    @group(0) @binding(${e})
    var<uniform> _uniforms: SimulationUniforms;
  `;static BUFFER_SIZE=oe+oe+J+J+ae.BUFFER_SIZE+Oe.BUFFER_SIZE+5*J;gpuBuffer;data=new ArrayBuffer(t.BUFFER_SIZE);dataView;constructor(e){this.gpuBuffer=e.createBuffer({label:"simulation-uniforms-buffer",size:Math.max(t.BUFFER_SIZE,ve),usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.dataView=new qe(this.data)}createBindingDesc=e=>({binding:e,resource:{buffer:this.gpuBuffer}});update(e){let{device:n}=e,{modelMatrix:r}=e.scene,i=u.hairSimulation;this.dataView.resetCursor(),this.dataView.writeMat4(r);let o=I.invert(r,gf);this.dataView.writeMat4(o);let a=u.hairSimulation.collisionSphere,s=K.set(a[0],a[1],a[2],1,Yn),l=K.transformMat4(s,o,Yn);this.dataView.writeF32(l[0]),this.dataView.writeF32(l[1]),this.dataView.writeF32(l[2]),this.dataView.writeF32(a[3]);let c=dt(i.wind.dirPhi,i.wind.dirTheta,"dgr",Yn),d=K.transformMat4(c,o,Yn);this.dataView.writeF32(d[0]),this.dataView.writeF32(d[1]),this.dataView.writeF32(d[2]),this.dataView.writeF32(i.wind.strength),e.scene.sdfCollider.writeToDataView(this.dataView),e.scene.physicsGrid.writeToDataView(this.dataView),this.dataView.writeF32(this.getDeltaTime()),this.dataView.writeF32(i.gravity),this.dataView.writeU32(i.constraints.constraintIterations),this.dataView.writeU32(e.frameIdx),this.dataView.writeF32(i.wind.strengthLull),this.dataView.writeF32(i.wind.colisionTraceOffset),this.dataView.writeF32(i.constraints.stiffnessLengthConstr),this.dataView.writeF32(i.constraints.stiffnessCollisions),this.dataView.writeF32(i.constraints.stiffnessSDF),this.dataView.writeF32(i.volumePreservation),this.dataView.writeF32(i.friction),this.dataView.writeF32(i.constraints.stiffnessGlobalConstr),this.dataView.writeF32(i.constraints.globalExtent),this.dataView.writeF32(i.constraints.globalFade),this.dataView.writeF32(i.constraints.stiffnessLocalConstr),this.dataView.writeF32(i.wind.phaseOffset),this.dataView.writeF32(i.wind.strengthFrequency),this.dataView.writeF32(i.wind.strengthJitter),this.dataView.writeF32(0),this.dataView.writeF32(0),this.dataView.assertWrittenBytes(t.BUFFER_SIZE),this.dataView.upload(n,this.gpuBuffer,0)}getDeltaTime(){return u.hairSimulation.deltaTime}};var Ca=t=>`

@group(0) @binding(${t})
var<storage, read> _hairSegmentLengths: array<f32>;

fn _getHairSegmentLength(
  pointsPerStrand: u32,
  strandIdx: u32,
  segmentIdx: u32
) -> f32 {
  return _hairSegmentLengths[strandIdx * pointsPerStrand + segmentIdx];
}
`;function Ra(t,e,n,r){let i=s=>[r[s*4+0],r[s*4+1],r[s*4+2]],o=r.length/4,a=new Float32Array(o);for(let s=0;s<o;s++)s%n==n-1?a[s]=y.distance(i(s-1),i(s)):a[s]=y.distance(i(s),i(s+1));return be(t,`${e}-segmentLengths`,a)}var It=(t,e)=>`

struct DensityGradAndWind {
  densityGrad: vec3f,
  windStrength: f32, // we know direction from uniforms
}

@group(0) @binding(${t})
var<storage, ${e}> _gridDensityGradAndWindVelocity: array<DensityGradAndWind>;

${e==="read_write"?_f():""}



fn _getGridDensityGradAndWind(
  gridBoundsMin: vec3f,
  gridBoundsMax: vec3f,
  p: vec3f
) -> DensityGradAndWind {
  // get coords
  let co = _getGridCell(gridBoundsMin, gridBoundsMax, p);
  var result = DensityGradAndWind(vec3f(0.0), 0.0);

  // gather results from all 8 cell-points around
  // dbg: cellMax = cellMin; - only the min cell
  for (var z = co.cellMin.z; z <= co.cellMax.z; z += 1u) {
  for (var y = co.cellMin.y; y <= co.cellMax.y; y += 1u) {
  for (var x = co.cellMin.x; x <= co.cellMax.x; x += 1u) {
    let cellCorner = vec3u(x, y, z);
    let cornerWeights = _getGridCellWeights(cellCorner, co.pInGrid);
    let value = _getGridDensityGradAndWindAtPoint(cellCorner);

    // load
    result.densityGrad  += cornerWeights * value.densityGrad;
    result.windStrength += _getGridCellWeight(cornerWeights) * value.windStrength;
  }}}

  return result;
}


fn _getGridDensityGradAndWindAtPoint(p: vec3u) -> DensityGradAndWind {
  let idx = _getGridIdx(p);
  return _gridDensityGradAndWindVelocity[idx];
}

`;function _f(){return`

  fn _setGridDensityGradAndWind(
    p: vec3u,
    densityGrad: vec3f,
    windStrength: f32
  ) {
    let idx = _getGridIdx(p);
    _gridDensityGradAndWindVelocity[idx] = DensityGradAndWind(
      densityGrad,
      windStrength,
    );
  }

  `}var et=(t,e)=>`

struct DensityVelocityI32 {
  velocityX: ${Nt(e)},
  velocityY: ${Nt(e)},
  velocityZ: ${Nt(e)},
  density: ${Nt(e)},
}

@group(0) @binding(${t})
var<storage, ${e}> _gridDensityVelocity: array<DensityVelocityI32>;

${e==="read"?xf():Sf()}

`;function xf(){return`

  struct DensityVelocity {
    velocity: vec3f,
    density: f32,
  }

  fn _getGridDensityVelocity(
    gridBoundsMin: vec3f,
    gridBoundsMax: vec3f,
    p: vec3f
  ) -> DensityVelocity {
    // get coords
    let co = _getGridCell(gridBoundsMin, gridBoundsMax, p);
    var result = DensityVelocity(vec3f(0.0), 0.0);
  
    // gather results from all 8 cell-points around
    // dbg: cellMax = cellMin; - only the min cell
    for (var z = co.cellMin.z; z <= co.cellMax.z; z += 1u) {
    for (var y = co.cellMin.y; y <= co.cellMax.y; y += 1u) {
    for (var x = co.cellMin.x; x <= co.cellMax.x; x += 1u) {
      let cellCorner = vec3u(x, y, z);
      let cornerWeights = _getGridCellWeights(cellCorner, co.pInGrid);
      let value = _getGridDensityVelocityAtPoint(cellCorner);
  
      // load
      result.velocity += cornerWeights * value.velocity;
      result.density  += _getGridCellWeight(cornerWeights) * value.density;
      // result.density += cornerWeights.x * select(0., 1., x == 1u); // dbg:  NOTE: this samples 4 points (see y,z-axis) so the gradient is a bit strong
    }}}
  
    // dbg:
    /*// let idx = _getGridIdx(cellMax);
    // let idx = _getGridIdx(cellMin);
    // let idx = 0; // remember, this is cell idx, not u32's offset!
    // let idx = clamp(cellMax.x, 0u, GRID_DIMS - 1u);
    // let value: vec4i = _gridDensityVelocity[idx];
    // result.density = select(0.0, 1.0, value.w != 0);
    // result.density = select(0.0, 1.0, idx == 3u);
    // result.density = select(0.0, 1.0, result.density >= 4);
    // result.density = select(0.0, 1.0, cellMin.x == 2u);
    // result.density = select(0.0, 1.0, cellMax.x == 3u);
    var t: vec3f = saturate((p - gridBoundsMin) / (gridBoundsMax - gridBoundsMin));
    result.density = select(0.0, 1.0, t.z > 0.5); // dbg: mock*/
    return result;
  }

  
  fn _getGridDensityVelocityAtPoint(p: vec3u) -> DensityVelocity {
    var result = DensityVelocity(vec3f(0.0), 0.0);
    let idx = _getGridIdx(p);
    let value = _gridDensityVelocity[idx];

    result.velocity.x = gridDecodeValue(value.velocityX);
    result.velocity.y = gridDecodeValue(value.velocityY);
    result.velocity.z = gridDecodeValue(value.velocityZ);
    result.density = gridDecodeValue(value.density);
    return result;
  }

  fn _getGridDensityAtPoint(p: vec3u) -> f32 {
    let idx = _getGridIdx(p);
    return gridDecodeValue(_gridDensityVelocity[idx].density);
  }
  `}function Sf(){return`

  fn _addGridDensityVelocity(
    gridBoundsMin: vec3f,
    gridBoundsMax: vec3f,
    p: vec3f,
    velocity: vec3f
  ) {
    // get coords
    let co = _getGridCell(gridBoundsMin, gridBoundsMax, p);
  
    // store into all 8 cell-points around
    for (var z = co.cellMin.z; z <= co.cellMax.z; z += 1u) {
    for (var y = co.cellMin.y; y <= co.cellMax.y; y += 1u) {
    for (var x = co.cellMin.x; x <= co.cellMax.x; x += 1u) {
      let cellCorner = vec3u(x, y, z);
      let idx = _getGridIdx(cellCorner);
      let cornerWeights = _getGridCellWeights(cellCorner, co.pInGrid);
  
      // store
      // velocity
      let cellVelocity: vec3f = velocity * cornerWeights;
      var value: i32 = gridEncodeValue(cellVelocity.x);
      atomicAdd(&_gridDensityVelocity[idx].velocityX, value);
      value = gridEncodeValue(cellVelocity.y);
      atomicAdd(&_gridDensityVelocity[idx].velocityY, value);
      value = gridEncodeValue(cellVelocity.z);
      atomicAdd(&_gridDensityVelocity[idx].velocityZ, value);
      // density
      let density = _getGridCellWeight(cornerWeights);
      value = gridEncodeValue(density);
      atomicAdd(&_gridDensityVelocity[idx].density, value);
    }}}
  }

  `}var Ba=`

// assumes sphere is in object space!
fn applyCollisionsSphere (
  stiffness: f32,
  sphere: vec4f,
  pos: ptr<function, vec4f>,
) {
  let p = (*pos).xyz;
  let v = p - sphere.xyz; // from sphere to point

  // calculate distance from sphere shell to the point
  // if POSITIVE: point does not collide
  // if NEGATIVE: point inside the sphere, resolve collision
  let dist = length(v) - sphere.w;
  let distToShell = max(0.0, -dist);

  // apply resolution
  (*pos) += vec4f(normalize(v) * distToShell * stiffness , 0.0);
}

// We could get these from uniforms, but why bother?
const SDF_CELL_SIZE = 0.0033918858971446753;
const SDF_SAMPLE_GRAD_OFFSET = SDF_CELL_SIZE * 0.1;

fn applyCollisionsSdf (
  stiffness: f32,
  sdfBoundsMin: vec3f,
  sdfBoundsMax: vec3f,
  sdfOffset: f32,
  pos: ptr<function, vec4f>,
) {
  let p = (*pos).xyz;

  // negative distance - collision. Positive distance - OK.
  let sdfDistance = sampleSDFCollider(sdfBoundsMin, sdfBoundsMax, p.xyz);
  let sdfDistanceWithOffset = sdfDistance + sdfOffset;
  if (sdfDistanceWithOffset >= 0) { return; }

  // calculate gradient
  // https://github.com/GPUOpen-Effects/TressFX/blob/ba0bdacdfb964e38522fda812bf23169bc5fa603/src/Shaders/TressFXSDFCollision.hlsl#L559
  // let correctionDir = vec3f(0., 0., 1.); // dbg: hardcoded forward
  var correctionDir = vec3f(0., 0., 0.);
  correctionDir.x = sampleSDFCollider(
    sdfBoundsMin, sdfBoundsMax,
    p.xyz + SDF_SAMPLE_GRAD_OFFSET * vec3f(1., 0., 0.)
  );
  correctionDir.y = sampleSDFCollider(
    sdfBoundsMin, sdfBoundsMax,
    p.xyz + SDF_SAMPLE_GRAD_OFFSET * vec3f(0., 1., 0.)
  );
  correctionDir.z = sampleSDFCollider(
    sdfBoundsMin, sdfBoundsMax,
    p.xyz + SDF_SAMPLE_GRAD_OFFSET * vec3f(0., 0., 1.)
  );
  correctionDir = correctionDir - vec3f(sdfDistance, sdfDistance, sdfDistance);
  
  // apply resolution
  let correction: vec3f = -sdfDistanceWithOffset * normalize(correctionDir);
  (*pos) += vec4f(correction * stiffness , 0.0);
}

`;var Oa=`

// See [Bender15] "Position-Based Simulation Methods in Computer Graphics"
// Section "5.1. Stretching"
fn applyConstraint_Length (
  stiffness: f32,
  expectedLength: f32,
  pos0: ptr<function, vec4f>,
  pos1: ptr<function, vec4f>,
) {
  let w0 = isMovable(*pos0);
  let w1 = isMovable(*pos1);

  let tangent = (*pos1).xyz - (*pos0).xyz; // from pos0 toward pos1, unnormalized
  let actualLength = length(tangent);
  // if segment is SHORTER: (expectedLength / actualLength) > 1.
  // So we have to elongate it. $correction is negative, proportional to missing length.
  // if segment is LONGER: (expectedLength / actualLength) < 1.
  // So we have to shorten it. $correction is positive, proportional to extra length.
  let correction: f32 = 1.0 - expectedLength / actualLength;
  let deltaFactor: f32 = correction * stiffness / (w0 + w1 + FLOAT_EPSILON);
  let delta: vec3f = deltaFactor * tangent;

  // (*pos0) = getNextPosition((*pos0), (*pos0).xyz + delta);
  // (*pos1) = getNextPosition((*pos1), (*pos1).xyz - delta);
  (*pos0) += vec4f(w0 * delta, 0.0);
	(*pos1) -= vec4f(w1 * delta, 0.0);
}


fn globalConstraintAttenuation(
  globalExtent: f32, globalFade: f32,
  pointsPerStrand: u32,
  pointIdx: u32
) -> f32 {
  let x = f32(pointIdx) / f32(pointsPerStrand - 1u);
  return 1.0 - saturate((x - globalExtent) / globalFade);
}

fn applyConstraint_GlobalShape(
  wkGrpOffset: u32,
  stiffness: f32,
  posInitial: vec3f,
  pointIdx: u32
) {
  var pos = _positionsWkGrp[wkGrpOffset + pointIdx];
  let deltaVec: vec3f = posInitial.xyz - pos.xyz; // pos -> posInitial
  _positionsWkGrp[wkGrpOffset + pointIdx] += vec4f(deltaVec * pos.w * stiffness, 0.0);
}



// A Triangle Bending Constraint Model for Position-Based Dynamics
fn applyConstraint_LocalShape(
  wkGrpOffset: u32,
  pointsPerStrand: u32, strandIdx: u32,
  stiffness: f32,
  pointIdx: u32
) -> vec3f {
  // TODO [IGNORE] precompute
  let posInitial0 = _getHairPointPositionInitial(pointsPerStrand, strandIdx, pointIdx);
  let posInitial1 = _getHairPointPositionInitial(pointsPerStrand, strandIdx, pointIdx + 1u);
  let posInitial2 = _getHairPointPositionInitial(pointsPerStrand, strandIdx, pointIdx + 2u);
  let cInitial: vec3f = (posInitial0.xyz + posInitial1.xyz + posInitial2.xyz) / 3.;
  let h0 = length(cInitial - posInitial1.xyz);
  
  let wkOffset = wkGrpOffset + pointIdx;
  let pos0 = _positionsWkGrp[wkOffset];
  let pos1 = _positionsWkGrp[wkOffset + 1u];
  let pos2 = _positionsWkGrp[wkOffset + 2u];
  let c: vec3f = (pos0.xyz + pos1.xyz + pos2.xyz) / 3.;
  let hVec = pos1.xyz - c; // from median toward middle point
  let h = length(hVec);

  let wTotal = posInitial0.w + 2. * posInitial1.w + posInitial2.w;
  let w0 = posInitial0.w / wTotal *  2.;
  let w1 = posInitial1.w / wTotal * -4.;
  let w2 = posInitial2.w / wTotal *  2.;

  let delta = hVec * (1.0 - h0 / h);
  _positionsWkGrp[wkOffset + 0u] += vec4f(stiffness * w0 * delta, 0.0);
  _positionsWkGrp[wkOffset + 1u] += vec4f(stiffness * w1 * delta, 0.0);
  _positionsWkGrp[wkOffset + 2u] += vec4f(stiffness * w2 * delta, 0.0);

  let lastTangent = _positionsWkGrp[wkOffset + 2u] - _positionsWkGrp[wkOffset + 1u];
  return lastTangent.xyz;
}


fn applyConstraint_matchInitialTangent(
  wkGrpOffset: u32,
  pointsPerStrand: u32, strandIdx: u32,
  stiffness: f32,
  pointIdx: u32
) {
  // a bit wastefull, but ./shrug
  let posInitial0 = _getHairPointPositionInitial(pointsPerStrand, strandIdx, pointIdx - 1u);
  let posInitial1 = _getHairPointPositionInitial(pointsPerStrand, strandIdx, pointIdx);
  let tangentInitial = posInitial1.xyz - posInitial0.xyz;
  
  applyConstraint_matchTangent(
    stiffness, wkGrpOffset, pointIdx, tangentInitial
  );
}

fn applyConstraint_matchTangent(
  stiffness: f32,
  wkGrpOffset: u32,
  pointIdx: u32,
  tangent: vec3f
) {
  let wkOffset = wkGrpOffset + pointIdx;
  let pos0 = _positionsWkGrp[wkOffset - 1u];
  let pos1 = _positionsWkGrp[wkOffset];

  let positionProj = pos0.xyz + tangent;
  let delta = positionProj - pos1.xyz; // now -> projected
  let w = pos1.w;
  _positionsWkGrp[wkOffset] += vec4f(stiffness * w * delta, 0.0);
}

`;var Fa=`

// Positions have .w as isMovable flag. 1.0 if isMovable, 0.0 if is not (strand root).
// Returned as float to avoid branching. Just multiply delta instead.
fn isMovable(p: vec4f) -> f32 { return p.w; }

/** https://en.wikipedia.org/wiki/Verlet_integration */
fn verletIntegration (
  dt: f32,
  posPrev: vec4f,
  posNow: vec4f,
  gridDisp: vec3f,
  friction: f32,
  acceleration: vec3f,
) -> vec4f {
  // original verlet:
  // let posNext: vec3f = (2. * posNow.xyz - posPrev.xyz) + acceleration * dt * dt;

  // https://youtu.be/ool2E8SQPGU?si=yKgmYF6Wjbu6HXsF&t=815
  let pointDisp = posNow.xyz - posPrev.xyz;
  let finalPointDisp = mix(pointDisp, gridDisp, friction);
  
  let posNext: vec3f = posNow.xyz + finalPointDisp + acceleration * dt * dt;
  return vec4f(
    mix(posPrev.xyz, posNext, isMovable(posNow)),
    posNow.w
  );
}
`;var Ga=8,vf=()=>Ga*u.pointsPerStrand,Ht={workgroupSizeX:Ga,bindings:{simulationUniforms:0,hairData:1,positionsPrev:2,positionsNow:3,segmentLengths:4,sdfTexture:5,sdfSampler:6,densityVelocityBuffer:7,densityGradWindBuffer:8,positionsInitial:9}},bf=Ht,ze=Ht.bindings,Na=()=>`

${G}
${Ke}
${Oa}
${Fa}
${Ba}

${ke.SHADER_SNIPPET(ze.simulationUniforms)}
${ae.TEXTURE_SDF(ze.sdfTexture,ze.sdfSampler)}
${et(ze.densityVelocityBuffer,"read")}
${It(ze.densityGradWindBuffer,"read")}
${Pe(ze.hairData)}
${aa(ze.positionsPrev,{bufferName:"_hairPointPositionsPrev",getterName:"_getHairPointPositionPrev",setterName:"_setHairPointPositionPrev"})}
${ut(ze.positionsNow,{bufferName:"_hairPointPositionsNow",getterName:"_getHairPointPositionNow"})}
${ut(ze.positionsInitial,{bufferName:"_hairPointPositionsInitial",getterName:"_getHairPointPositionInitial"})}
${Ca(ze.segmentLengths)}


/** Temporary position storage for duration of the shader */
var<workgroup> _positionsWkGrp: array<vec4f, ${vf()}u>;


// Everything is in object space (unless noted otherwise).
// The comments assume 32 points per strand to make it easier
@compute
@workgroup_size(${bf.workgroupSizeX}, 1, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
  // id of the thread inside the workgroup
  @builtin(local_invocation_index) local_invocation_index: u32,
) {
  let strandsCount: u32 = _hairData.strandsCount;
  let pointsPerStrand: u32 = _hairData.pointsPerStrand; // 32
  let segmentCount: u32 = pointsPerStrand - 1u; // 31
  let wkGrpOffset = pointsPerStrand * local_invocation_index;

  let dt = _uniforms.deltaTime;
  let constraintIterations = _uniforms.constraintIterations;
  let stiffnessLengthConstr = _uniforms.stiffnessLengthConstr;
  let stiffnessGlobalConstr = _uniforms.stiffnessGlobalConstr;
  let stiffnessCollisions = _uniforms.stiffnessCollisions;
  let globalConstrExtent = _uniforms.globalConstrExtent;
  let globalConstrFade = _uniforms.globalConstrFade;
  let stiffnessLocalConstr = _uniforms.stiffnessLocalConstr;
  let stiffnessSDF = _uniforms.stiffnessSDF;
  let collisionSphere = _uniforms.collisionSphere;
  let gravity = _uniforms.gravity;
  let gravityForce = vec3f(0., -gravity, 0.);
  let wind = _uniforms.wind;
  let windStrengthLull = _uniforms.windStrengthLull;
  let windPhaseOffset = _uniforms.windPhaseOffset;
  let windStrengthFrequency = _uniforms.windStrengthFrequency;
  let windStrengthJitter = _uniforms.windStrengthJitter;
  let volumePreservation = _uniforms.volumePreservation;
  let friction = _uniforms.friction;
  let frameIdx = _uniforms.frameIdx;
  let gridBoundsMin = _uniforms.gridData.boundsMin.xyz;
  let gridBoundsMax = _uniforms.gridData.boundsMax.xyz;
  let sdfBoundsMin = _uniforms.sdf.boundsMin.xyz;
  let sdfBoundsMax = _uniforms.sdf.boundsMax.xyz;
  let sdfOffset = getSDF_Offset();

  let strandIdx = global_id.x;
  // if (strandIdx >= strandsCount) { return; } // "uniform control flow" error
  let isInvalidDispatch = strandIdx >= strandsCount; // some memory accesses will return garbage. It's OK as long as we don't try to override real data?



  // verlet integration. Also adds forces from grids.
  // Skips root point cause it never moves.
  _positionsWkGrp[wkGrpOffset + 0] = _getHairPointPositionNow(pointsPerStrand, strandIdx, 0u); // root
  for (var i = 1u; i < pointsPerStrand && !isInvalidDispatch; i += 1u) {
      let posPrev = _getHairPointPositionPrev(pointsPerStrand, strandIdx, i);
      let posNow = _getHairPointPositionNow(pointsPerStrand, strandIdx, i);
      var force = gravityForce;
      let densityGradAndWind = _getGridDensityGradAndWind(gridBoundsMin, gridBoundsMax, posNow.xyz);
      let densityVelocity = _getGridDensityVelocity(gridBoundsMin, gridBoundsMax, posNow.xyz);

      // wind
      let timer = f32(frameIdx) * 0.73 + windPhaseOffset * f32(strandIdx);
      let windJitter = fract(timer * windStrengthFrequency);
      let jitterDelta = mix(-0.5 * windStrengthJitter, 0.5 * windStrengthJitter, windJitter); // e.g. [-0.5 .. 0.5] when windStrengthJitter is 1.0
      let jitterStr = 1.0 + jitterDelta; // e.g. [0.5 .. 1.5] when windStrengthJitter is 1.0
      let windCellStr = saturate(mix(windStrengthLull, 1.0, densityGradAndWind.windStrength));
      force += wind.xyz * abs(wind.w * jitterStr * windCellStr);
      
      // density gradient
      // This is just an averaged direction to neighbouring cell - based on density difference.
      // No need to normalize by density, as it's a difference. But it's a value from grid,
      // so we have to use FLIP.
      force += densityGradAndWind.densityGrad * volumePreservation;
      
      // Velocity. Divide by density to get *average* value.
      // https://youtu.be/ool2E8SQPGU?si=yKgmYF6Wjbu6HXsF&t=815
      let gridDisp = select(
        vec3f(0.0),
        densityVelocity.velocity / densityVelocity.density,
        densityVelocity.density > 0 // happens on simulation reset
      );

      _positionsWkGrp[wkGrpOffset + i] = verletIntegration(
        dt,
        posPrev, posNow,
        gridDisp, friction,
        force
      );
      // _positionsWkGrp[wkGrpOffset + i] = posNow; // dbg: skip integration
  }

  workgroupBarrier();


  // solve constraints through iterations
  for (var i = 0u; i < constraintIterations && !isInvalidDispatch; i += 1u) {
    // NOTE: we could better manipulate stiffness between iters.
    // E.g.  First few iters affect more and last ones just nudge
    //       toward slightly better solutions.
    // E.g2. First few iters affect less to put strands in stable,
    //       solvable positions before bigger changes in later iters.

    // strech/length constraint
    let stiffnessLen_i = stiffnessLengthConstr; // / f32(constraintIterations);
    var posSegmentStart = _positionsWkGrp[wkGrpOffset + 0u];
    for (var j = 0u; j < segmentCount; j += 1u) { // from 0 to 30 (inclusive)
      var posSegmentEnd = _positionsWkGrp[wkGrpOffset + j + 1u];
      // let expectedLength0 = length(posSegmentEnd.xyz - posSegmentStart.xyz);
      let expectedLength1: f32 = _getHairSegmentLength(pointsPerStrand, strandIdx, j);
      applyConstraint_Length(
        stiffnessLen_i, expectedLength1,
        &posSegmentStart, &posSegmentEnd
      );
      _positionsWkGrp[wkGrpOffset + j + 0u] = posSegmentStart;
      _positionsWkGrp[wkGrpOffset + j + 1u] = posSegmentEnd;
      // move to next segment
      posSegmentStart = posSegmentEnd;
    }

    // global shape constraint
    let stiffnessGlobalShape_i = stiffnessGlobalConstr / f32(constraintIterations);
    for (var j = 1u; j < pointsPerStrand; j += 1u) { // from 0 to 30 (inclusive)
      let attenuation = globalConstraintAttenuation(
        globalConstrExtent, globalConstrFade,
        pointsPerStrand, j
      );
      let posInitial = _getHairPointPositionInitial(pointsPerStrand, strandIdx, j);
      applyConstraint_GlobalShape(
        wkGrpOffset,
        stiffnessGlobalShape_i * attenuation,
        posInitial.xyz,
        j
      );
    }

    // local shape constraint
    let stiffnessLocalShape_i = stiffnessLocalConstr / f32(constraintIterations);
    var jj = 0u;
    var lastTangent: vec3f;
    for (; jj < pointsPerStrand - 3; jj += 1u) { // from 0 to 30 (inclusive)
      lastTangent = applyConstraint_LocalShape(
        wkGrpOffset,
        pointsPerStrand, strandIdx,
        stiffnessLocalShape_i,
        jj
      );
    }
    for (; jj < pointsPerStrand; jj += 1u) { // last remaining points
      applyConstraint_matchInitialTangent(
        wkGrpOffset,
        pointsPerStrand, strandIdx,
        stiffnessLocalShape_i,
        jj
      );
      /*applyConstraint_matchTangent(
        stiffnessLocalShape_i,
        wkGrpOffset, jj,
        lastTangent
      );*/
    }

    // TODO [IGNORE] add global length (FTL) constraint
    
    // collisions (skip root)
    let stiffnessColl_i = stiffnessCollisions / f32(constraintIterations);
    let stiffnessSDF_i = stiffnessSDF / f32(constraintIterations);
    for (var j = 1u; j < pointsPerStrand; j += 1u) { // from 0 to 30 (inclusive)
      var pos = _positionsWkGrp[wkGrpOffset + j];
      // sphere
      applyCollisionsSphere(
        stiffnessColl_i,
        collisionSphere,
        &pos
      );

      // SDF. Skip for points close to root as they are going to be naturally close to mesh.
      // Hardcoding can be a problem for lower pointsPerStrand count.
      if (j > 2u) {
        applyCollisionsSdf(
          stiffnessSDF_i,
          sdfBoundsMin,
          sdfBoundsMax,
          sdfOffset,
          &pos
        );
      }

      _positionsWkGrp[wkGrpOffset + j] = pos;
    }
  }

  workgroupBarrier();


  // write back
  for (var i = 0u; i < pointsPerStrand && !isInvalidDispatch; i += 1u) {
    // tick-tock update. Leave positionNow, as it will be come positionPrev next frame
    let posNext: vec4f = _positionsWkGrp[wkGrpOffset + i];
    _setHairPointPositionPrev(pointsPerStrand, strandIdx, i, posNext);
  }
}

`;var Xn=class t{static NAME="HairSimIntegrationPass";pipeline;bindingsCache=new C;constructor(e){let n=e.createShaderModule({label:B(t),code:Na()});this.pipeline=e.createComputePipeline({label:F(t),layout:"auto",compute:{module:n,entryPoint:"main"}})}cmdSimulateHairPositions(e,n){let{cmdBuf:r,profiler:i}=e,o=r.beginComputePass({label:t.NAME,timestampWrites:i?.createScopeGpu(t.NAME)}),a=this.bindingsCache.getBindings(`${n.name}-${n.currentPositionsBufferIdx}`,()=>this.createBindings(e,n));o.setPipeline(this.pipeline),o.setBindGroup(0,a);let s=pe(n.strandsCount,Ht.workgroupSizeX);o.dispatchWorkgroups(s,1,1),o.end(),n.swapPositionBuffersAfterSimIntegration()}createBindings=(e,n)=>{let{device:r,simulationUniforms:i,scene:o,physicsForcesGrid:a}=e,s=Ht.bindings,l=o.sdfCollider;return Z(t,`${n.name}-${n.currentPositionsBufferIdx}`,r,this.pipeline,[i.createBindingDesc(s.simulationUniforms),n.bindHairData(s.hairData),n.bindInitialSegmentLengths(s.segmentLengths),n.bindPointsPositions_PREV(s.positionsPrev),n.bindPointsPositions(s.positionsNow),n.bindPointsPositions_INITIAL(s.positionsInitial),l.bindTexture(s.sdfTexture),l.bindSampler(s.sdfSampler),a.bindDensityVelocityBuffer(s.densityVelocityBuffer),a.bindDensityGradAndWindBuffer(s.densityGradWindBuffer)])}};function qn(t,e,n,r){return t.createRenderPipeline({label:r,layout:"auto",vertex:{module:e,entryPoint:"main_vs",buffers:[]},fragment:{module:e,entryPoint:"main_fs",targets:[{format:n,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one",operation:"add"}}}]},primitive:{..._t,cullMode:"none"}})}function Kn(t,e,n,r){let{cmdBuf:i,profiler:o,hdrRenderTexture:a}=t,s=i.beginRenderPass({label:e.NAME,colorAttachments:[ee(a,u.clearColor,"load")],timestampWrites:o?.createScopeGpu(e.NAME)});s.setPipeline(n),s.setBindGroup(0,r);let l=2*Ce;s.draw(l,1,0,0),s.end()}var wf=(t,e,n,r)=>{let i=(o,a)=>{let s=`${t}[${a}u]`,l=a==0?", default":"";return`case ${a}u ${l}: { ${r(s)} }`};return`
  switch (${n}) {
      ${Ye(e).map(i).join(`
`)}
  }`},Zn=(t,e,n,r)=>{let[i,o]=t.split(":").map(s=>s?.trim());if(i==null||o==null)throw new Error(`assignValueFromConstArray expected newVarDecl param to include variable name and type e.g. 'normal: vec3f'. Got '${t}', where name='${i}', type=${o}`);if(!dn)return`let ${t} = ${e}[${r}];`;let a=wf(e,n,r,s=>`${i} = ${s};`);return`var ${t};
  ${a}`};var ii={bindings:{renderUniforms:0,sdfTexture:1,sdfSampler:2}},ri=ii.bindings,La=()=>`

${A.SHADER_SNIPPET(ri.renderUniforms)}
${ae.TEXTURE_SDF(ri.sdfTexture,ri.sdfSampler)}


struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) positionOS: vec4f,
  @location(1) uv: vec2f,
};

const POSITIONS = array<vec2f, 6>(
  vec2(0, 0),
  vec2(0, 1),
  vec2(1, 0),
  vec2(0, 1),
  vec2(1, 1),
  vec2(1, 0)
);

@vertex
fn main_vs(
  @builtin(vertex_index) inVertexIndex : u32 // 0..6
) -> VertexOutput {
  let boundsMin = _uniforms.sdf.boundsMin.xyz;
  let boundsMax = _uniforms.sdf.boundsMax.xyz;
  let depthSlice = getSdfDebugDepthSlice();

  ${Zn("uv: vec2f","POSITIONS",6,"inVertexIndex")}
  var positionOS = mix(boundsMin, boundsMax, vec3f(uv, depthSlice));

  var result: VertexOutput;
  let mvpMatrix = _uniforms.mvpMatrix;

  result.position = mvpMatrix * vec4f(positionOS, 1.0);
  result.positionOS = vec4f(positionOS, 1.0);
  result.uv = uv;
  return result;
}


@fragment
fn main_fs(
  fragIn: VertexOutput
) -> @location(0) vec4f {
  let boundsMin = _uniforms.sdf.boundsMin.xyz;
  let boundsMax = _uniforms.sdf.boundsMax.xyz;
  let depthSlice = getSdfDebugDepthSlice();
  let opacity = select(1.0, 0.75, isSdfDebugSemiTransparent());

  var color = vec3f(0., 0., 0.);
  
  // let samplePos = vec3f(fragIn.uv, depthSlice);
  // let value = textureSampleLevel(_sdfTexture, _sdfSampler, samplePos, 0.0).x;
  
  let positionOS = fragIn.positionOS.xyz;
  let value = sampleSDFCollider(boundsMin, boundsMax, positionOS);
  if (value > 0.) { // outside
    color.r = value;
    color.r = 1.;
  } else {
    color.b = value;
    color.b = 1.;
  }
  
  // slight transparency for a bit easier debug
  return vec4f(color.xyz, opacity);
}


`;var Jn=class t{static NAME="DrawSdfColliderPass";pipeline;bindingsCache=new C;constructor(e,n){let r=e.createShaderModule({label:B(t),code:La()});this.pipeline=qn(e,r,n,F(t))}cmdDrawSdf(e){let n=e.scene.sdfCollider,r=this.bindingsCache.getBindings(n.name,()=>this.createBindings(e,n));Kn(e,t,this.pipeline,r)}createBindings=(e,n)=>{let{device:r,globalUniforms:i}=e,o=ii.bindings;return se(t,r,this.pipeline,[i.createBindingDesc(o.renderUniforms),n.bindTexture(o.sdfTexture),n.bindSampler(o.sdfSampler)])}};var ai={bindings:{renderUniforms:0,densityVelocityBuffer:1,densityGradWindBuffer:2}},oi=ai.bindings,Ua=()=>`

${G}
${Ke}

${A.SHADER_SNIPPET(oi.renderUniforms)}

${et(oi.densityVelocityBuffer,"read")}
${It(oi.densityGradWindBuffer,"read")}

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) positionOS: vec4f,
  @location(1) uv: vec2f,
};

const POSITIONS = array<vec2f, 6>(
  vec2(0, 0),
  vec2(0, 1),
  vec2(1, 0),
  vec2(0, 1),
  vec2(1, 1),
  vec2(1, 0)
);


@vertex
fn main_vs(
  @builtin(vertex_index) inVertexIndex : u32 // 0..6
) -> VertexOutput {
  let boundsMin = _uniforms.gridData.boundsMin.xyz;
  let boundsMax = _uniforms.gridData.boundsMax.xyz;
  let depthSlice = getGridDebugDepthSlice();

  // TODO [LOW] same as SDF. Move to shared lib
  ${Zn("uv: vec2f","POSITIONS",6,"inVertexIndex")}
  var positionOS = mix(boundsMin, boundsMax, vec3f(uv, depthSlice));

  var result: VertexOutput;
  let mvpMatrix = _uniforms.mvpMatrix;

  result.position = mvpMatrix * vec4f(positionOS, 1.0);
  result.positionOS = vec4f(positionOS, 1.0);
  result.uv = uv;
  return result;
}


@fragment
fn main_fs(
  fragIn: VertexOutput
) -> @location(0) vec4f {
  let boundsMin = _uniforms.gridData.boundsMin.xyz;
  let boundsMax = _uniforms.gridData.boundsMax.xyz;
  var opacity = 0.6;

  var displayMode = _uniforms.gridData.debugDisplayValue;
  let absTheVector: bool = displayMode >= 16u;
  displayMode = select(displayMode, displayMode - 16u, absTheVector);
  
  let positionOS = fragIn.positionOS.xyz;

  var color = vec3f(0., 0., 0.);
  let densityVelocity = _getGridDensityVelocity(
    boundsMin,
    boundsMax,
    positionOS
  );
  let gridPoint = getClosestGridPoint(
    boundsMin,
    boundsMax,
    positionOS
  );
  let densityGradAndWind = _getGridDensityGradAndWindAtPoint(gridPoint);


  if (displayMode == ${xe.VELOCITY}u) {
    getVectorColor(&color, densityVelocity.velocity, absTheVector);
  
  } else if (displayMode == ${xe.DENSITY_GRADIENT}u) {
    let grad = densityGradAndWind.densityGrad;
    getVectorColor(&color, grad, absTheVector);
  
  } else if (displayMode == ${xe.WIND}u) {
    let windStr = densityGradAndWind.windStrength;
    if (windStr < 0.01) { color.r = 1.0; }
    else if (windStr < 0.99) { color.b = 1.0; }
    else { color.g = 1.0; }

  } else {
    // color.r = select(0.0, 1.0, value.density != 0);
    color.r = densityVelocity.density;
  }

  // slight transparency for a bit easier debug
  return vec4f(color.xyz, opacity);
}

fn getVectorColor(color: ptr<function, vec3f>, v: vec3f, absTheVector: bool) {
  if (length(v) < 0.001){ return; }

  var result = normalize(v);
  if (absTheVector) {
    result = abs(result);
  }

  (*color) = result;
}

`;var Qn=class t{static NAME="DrawGridDbgPass";pipeline;bindingsCache=new C;constructor(e,n){let r=e.createShaderModule({label:B(t),code:Ua()});this.pipeline=qn(e,r,n,F(t))}cmdDrawGridDbg(e){let n=this.bindingsCache.getBindings("-",()=>this.createBindings(e));Kn(e,t,this.pipeline,n)}createBindings=e=>{let{device:n,globalUniforms:r,physicsForcesGrid:i}=e,o=ai.bindings;return se(t,n,this.pipeline,[r.createBindingDesc(o.renderUniforms),i.bindDensityVelocityBuffer(o.densityVelocityBuffer),i.bindDensityGradAndWindBuffer(o.densityGradWindBuffer)])}};var Wt={workgroupSizeX:32,bindings:{simulationUniforms:0,hairData:1,positionsPrev:2,positionsNow:3,gridBuffer:4}},Pf=Wt,$t=Wt.bindings,ka=()=>`

${G}
${Ke}

${ke.SHADER_SNIPPET($t.simulationUniforms)}
${et($t.gridBuffer,"read_write")}
${Pe($t.hairData)}
${ut($t.positionsPrev,{bufferName:"_hairPointPositionsPrev",getterName:"_getHairPointPositionPrev"})}
${ut($t.positionsNow,{bufferName:"_hairPointPositionsNow",getterName:"_getHairPointPositionNow"})}


// Everything is in object space (unless noted otherwise).
// The comments assume 32 points per strand to make it easier
@compute
@workgroup_size(${Pf.workgroupSizeX}, 1, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
) {
  let strandsCount: u32 = _hairData.strandsCount;
  let pointsPerStrand: u32 = _hairData.pointsPerStrand; // 32
  // let segmentCount: u32 = pointsPerStrand - 1u; // 31
  let boundsMin = _uniforms.gridData.boundsMin.xyz;
  let boundsMax = _uniforms.gridData.boundsMax.xyz;

  let strandIdx = global_id.x;
  if (strandIdx >= strandsCount) { return; }
  // let isInvalidDispatch = strandIdx >= strandsCount; // some memory accesses will return garbage. It's OK as long as we don't try to override real data?

  for (var i = 0u; i < pointsPerStrand; i += 1u) {
    let posPrev = _getHairPointPositionPrev(pointsPerStrand, strandIdx, i).xyz;
    let posNow  = _getHairPointPositionNow (pointsPerStrand, strandIdx, i).xyz;
    let velocity = posNow - posPrev; // we can div. by velocity during integration

    // density is just a 'I am here' counter. Weighted by triliner interpolation
    _addGridDensityVelocity(
      boundsMin, boundsMax,
      posNow,
      velocity
    );
  }
}

`;var er=class t{static NAME="GridPostSimPass";pipeline;bindingsCache=new C;constructor(e){let n=e.createShaderModule({label:B(t),code:ka()});this.pipeline=e.createComputePipeline({label:F(t),layout:"auto",compute:{module:n,entryPoint:"main"}})}cmdUpdateGridsAfterSim(e,n){let{cmdBuf:r,profiler:i,physicsForcesGrid:o}=e;o.clearDensityVelocityBuffer(r);let a=r.beginComputePass({label:t.NAME,timestampWrites:i?.createScopeGpu(t.NAME)}),s=this.bindingsCache.getBindings(`${n.name}-${n.currentPositionsBufferIdx}`,()=>this.createBindings(e,n));a.setPipeline(this.pipeline),a.setBindGroup(0,s);let l=pe(n.strandsCount,Wt.workgroupSizeX);a.dispatchWorkgroups(l,1,1),a.end()}createBindings=(e,n)=>{let{device:r,simulationUniforms:i,physicsForcesGrid:o}=e,a=Wt.bindings;return Z(t,`${n.name}-${n.currentPositionsBufferIdx}`,r,this.pipeline,[i.createBindingDesc(a.simulationUniforms),n.bindHairData(a.hairData),n.bindPointsPositions_PREV(a.positionsPrev),n.bindPointsPositions(a.positionsNow),o.bindDensityVelocityBuffer(a.gridBuffer)])}};var Yt={workgroupSizeX:32,bindings:{simulationUniforms:0,densityVelocityBuffer:1,densityGradWindBuffer:2,sdfTexture:3,sdfSampler:4}},yf=Yt,jt=Yt.bindings,za=()=>`

${G}
${Ke}

${ke.SHADER_SNIPPET(jt.simulationUniforms)}
${et(jt.densityVelocityBuffer,"read")}
${It(jt.densityGradWindBuffer,"read_write")}
${ae.TEXTURE_SDF(jt.sdfTexture,jt.sdfSampler)}


// Everything is in object space (unless noted otherwise).
// The comments assume 32 points per strand to make it easier
@compute
@workgroup_size(${yf.workgroupSizeX}, 1, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
) {
  let boundsMin = _uniforms.gridData.boundsMin.xyz;
  let boundsMax = _uniforms.gridData.boundsMax.xyz;
  let totalGridPoints = GRID_DIMS * GRID_DIMS * GRID_DIMS;
  
  // TBH. we could also skip if density near the point is 0
  if (global_id.x >= totalGridPoints) { return; }

  // get grid point e.g. (0,1,4)
  let gridPoint = deconstructId(global_id.x);
  // if (gridPoint.z < (GRID_DIMS / 2u)) { // dbg
    // _gridDensityGradAndWindVelocity[global_id.x].windStrength = gridEncodeValue(1.);
  // }
  
  // get world position
  let position = getGridPointPositionWS(boundsMin, boundsMax, gridPoint);
  // if (position.y < 1.5352792739868164) { // dbg
    // _gridDensityGradAndWindVelocity[global_id.x].windStrength = gridEncodeValue(1.);
  // }

  // wind
  let windStrength = getWindStrength(position);
  
  // density gradient
  let densityGrad = getDensityGradient(boundsMin, boundsMax, gridPoint);

  // write
  _setGridDensityGradAndWind(
    gridPoint,
    densityGrad,
    windStrength
  );
}


fn deconstructId(id: u32) -> vec3u {
  let z = id / (GRID_DIMS * GRID_DIMS);
  let idXY = id - (z * GRID_DIMS * GRID_DIMS);
  let y = idXY / GRID_DIMS;
  let x = idXY % GRID_DIMS;
  return vec3u(x, y, z);
}

const WIND_LULL = 0.0;
const WIND_HALF = 0.5;
const WIND_FULL = 1.0;

fn getWindStrength(p: vec3f) -> f32 {
  let sdfBoundsMin = _uniforms.sdf.boundsMin.xyz;
  let sdfBoundsMax = _uniforms.sdf.boundsMax.xyz;
  let windDirection = _uniforms.wind.xyz;
  let windColisionTraceOffset = _uniforms.windColisionTraceOffset;

  // ignore sdfOffset, as it would create big lull zone around the object
  let sdfDistance = sampleSDFCollider(sdfBoundsMin, sdfBoundsMax, p);
  if (sdfDistance < 0.) { return WIND_LULL; } // point inside mesh, no wind

  // check if there is a collider between the point and the wind origin.
  // TBH. You could make a fancy fluid sim here.
  let towardWindDir = -normalize(windDirection);
  // trace into the wind hoping to hit a mesh. Enlarge step by correction
  let rayTraceTowardWindPos = p + towardWindDir * sdfDistance * windColisionTraceOffset;
  let sdfDistance2 = sampleSDFCollider(sdfBoundsMin, sdfBoundsMax, rayTraceTowardWindPos);
  if (sdfDistance2 < 0.) { return WIND_HALF; }

  return WIND_FULL;
}

// https://youtu.be/XmzBREkK8kY?si=fzOcQi_47D9roJKY&t=644
fn getDensityGradient(
  gridBoundsMin: vec3f,
  gridBoundsMax: vec3f,
  gridPoint: vec3u
) -> vec3f {
  let density0 = _getGridDensityAtPoint(gridPoint);
  let idx0 = _getGridIdx(gridPoint);
  var result = vec3f(0.);

  result += getDensityGradientFromDirection(density0, idx0, gridPoint, vec3i( 1,  0,  0));
  result += getDensityGradientFromDirection(density0, idx0, gridPoint, vec3i(-1,  0,  0));
  result += getDensityGradientFromDirection(density0, idx0, gridPoint, vec3i( 0,  1,  0));
  result += getDensityGradientFromDirection(density0, idx0, gridPoint, vec3i( 0, -1,  0));
  result += getDensityGradientFromDirection(density0, idx0, gridPoint, vec3i( 0,  0,  1));
  result += getDensityGradientFromDirection(density0, idx0, gridPoint, vec3i( 0,  0, -1));

  return result;
}

fn getDensityGradientFromDirection(
  density0: f32,
  idx0: u32,
  p: vec3u,
  offset: vec3i,
) -> vec3f {
  let pOther_i = vec3i(p) + offset; // 'i' means signed. Coords can be <0
  if (pOther_i.x < 0 || pOther_i.y < 0 || pOther_i.z < 0) {
    return vec3f(0.);
    // return vec3f(1., 0., 0.); // dbg
  }

  let pOther = vec3u(pOther_i);
  var idxOther = _getGridIdx(pOther);
  // check near bounds. _getGridIdx() has a clamp()
  if (idx0 == idxOther) {
    return vec3f(0.);
    // return vec3f(0., 1., 0.); // dbg
  }

  let densityOther = _getGridDensityAtPoint(pOther);

  // densityDiff NEGATIVE: original point 'p' has LESS particles near than the 'pOther'. 
  //                       Do NOTHING, other cell will calculate it's best resolution.
  // densityDiff POSITIVE: original point 'p' has MORE particles near than the 'pOther'.
  //                       Move particles toward 'pOther'.
  let densityDiff = density0 - densityOther;
  return max(densityDiff, 0.) * vec3f(offset); // I though we should negate here, but it works if we don't?
  // return vec3f(0., 0., 1.); // dbg
}

`;var tr=class t{static NAME="GridPreSimPass";pipeline;bindingsCache=new C;constructor(e){let n=e.createShaderModule({label:B(t),code:za()});this.pipeline=e.createComputePipeline({label:F(t),layout:"auto",compute:{module:n,entryPoint:"main"}})}cmdUpdateGridsBeforeSim(e,n){let{cmdBuf:r,profiler:i,physicsForcesGrid:o}=e;o.clearDensityGradAndWindBuffer(r);let a=r.beginComputePass({label:t.NAME,timestampWrites:i?.createScopeGpu(t.NAME)}),s=this.bindingsCache.getBindings(`${n.name}-${n.currentPositionsBufferIdx}`,()=>this.createBindings(e,n));a.setPipeline(this.pipeline),a.setBindGroup(0,s);let l=u.hairSimulation.physicsForcesGrid.dims,c=l*l*l,d=pe(c,Yt.workgroupSizeX);a.dispatchWorkgroups(d,1,1),a.end()}createBindings=(e,n)=>{let{device:r,simulationUniforms:i,physicsForcesGrid:o,scene:a}=e,s=Yt.bindings,l=a.sdfCollider;return Z(t,`${n.name}-${n.currentPositionsBufferIdx}`,r,this.pipeline,[i.createBindingDesc(s.simulationUniforms),o.bindDensityVelocityBuffer(s.densityVelocityBuffer),o.bindDensityGradAndWindBuffer(s.densityGradWindBuffer),l.bindTexture(s.sdfTexture),l.bindSampler(s.sdfSampler)])}};var si={bindings:{renderUniforms:0}},Tf=si.bindings,Va=()=>`

${he}
${G}
${A.SHADER_SNIPPET(Tf.renderUniforms)}


struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) @interpolate(flat) axisIdx: u32,
};

const AXIS_X = 0u;
const AXIS_Y = 1u;
const AXIS_Z = 2u;

const LINE_LENGTH = ${u.colliderGizmo.lineLength};
const LINE_WIDTH = ${u.colliderGizmo.lineWidth};

@vertex
fn main_vs(
  @builtin(instance_index) inInstanceIdx: u32,
  @builtin(vertex_index) inVertexIndex : u32
) -> VertexOutput {
  let colSphereWS = _uniforms.collisionSpherePosition;
  let viewMatrix = _uniforms.viewMatrix;
  let projMatrix = _uniforms.projMatrix;

  let axisVec = getAxisVector(inInstanceIdx);

  let lineStartWS = vec4f(colSphereWS.xyz + axisVec * LINE_WIDTH, 1.0);
  let lineEndWS   = vec4f(lineStartWS.xyz + axisVec * LINE_LENGTH, 1.0);
  let lineStartVS = viewMatrix * lineStartWS;
  let lineEndVS = viewMatrix * lineEndWS;
  let tangentVS = lineEndVS.xyz - lineStartVS.xyz;
  let up: vec3f = safeNormalize3(cross(tangentVS.xyz, vec3f(0., 0., 1.)));

  let linePointVS = select(lineEndVS, lineStartVS, (inVertexIndex & 0x01u) == 0u);
  let deltaSign: f32 = select(1.0, -1.0, inVertexIndex == 2u || inVertexIndex == 3u || inVertexIndex == 4u);
  let positionVs = linePointVS.xyz + deltaSign * up * LINE_WIDTH;

  var result: VertexOutput;
  result.position = projMatrix * vec4f(positionVs, 1.0);
  result.axisIdx = inInstanceIdx;
  return result;
}


@fragment
fn main_fs(
  fragIn: VertexOutput
) -> @location(0) vec4f {
  // return vec4f(1.0, 0.0, 0.0, 1.0);
  let axisVec = getAxisVector(fragIn.axisIdx);
  
  let isActive = fragIn.axisIdx == _uniforms.gizmoActiveState;
  let stateMod: f32 = select(0.5, 1.0, isActive);
  
  return vec4f(axisVec.rgb * stateMod, 1.0);
}


fn getAxisVector(axisIdx: u32) -> vec3f {
  if (axisIdx == AXIS_Y) { return vec3f(0.0, 1.0, 0.0); }
  if (axisIdx == AXIS_Z) { return vec3f(0.0, 0.0, 1.0); }
  return vec3f(1.0, 0.0, 0.0);
}
`;var nr=class t{static NAME="DrawGizmoPass";pipeline;bindingsCache=new C;constructor(e,n){let r=e.createShaderModule({label:B(t),code:Va()});this.pipeline=e.createRenderPipeline({label:F(t),layout:"auto",vertex:{module:r,entryPoint:"main_vs"},fragment:{module:r,entryPoint:"main_fs",targets:[{format:n}]},primitive:{cullMode:"none",topology:"triangle-list"}})}onViewportResize=()=>{this.bindingsCache.clear()};cmdDrawGizmo(e){let{cmdBuf:n,profiler:r,hdrRenderTexture:i}=e,o=n.beginRenderPass({label:t.NAME,colorAttachments:[ee(i,u.clearColor,"load")],timestampWrites:r?.createScopeGpu(t.NAME)}),a=this.bindingsCache.getBindings("-",()=>this.createBindings(e));o.setPipeline(this.pipeline),o.setBindGroup(0,a);let s=u.colliderGizmo;s.isDragging?this.cmdDrawSingleAxis(o,s.activeAxis):this.cmdDrawAllAxis(o),o.end()}cmdDrawAllAxis(e){e.draw(6,3,0,0)}cmdDrawSingleAxis(e,n){n!==Ee.NONE&&e.draw(6,1,0,n)}createBindings=e=>{let{device:n,globalUniforms:r}=e,i=si.bindings;return se(t,n,this.pipeline,[r.createBindingDesc(i.renderUniforms)])}};var Xt={workgroupSizeX:256,bindings:{renderUniforms:0,segmentCountPerTile:1,sortBuckets:2}},ci=(t,e)=>`

const SORT_BUCKETS = ${u.hairRender.sortBuckets}u;
const BUCKET_SIZE = ${u.hairRender.sortBucketSize}u;

fn calcTileSortBucket(segmentCount: u32) -> u32 {
  let key = segmentCount / BUCKET_SIZE;
  return clamp(key, 0u, SORT_BUCKETS - 1u);
}

struct SortBucket {
  // 1 pass: WRITE: inc for each tile that has segment count in this bucket
  // 2 pass: READ: to get offsets
  tileCount: ${de(e==="count-tiles"?"read_write":"read")},
  // 1 pass: -
  // 2 pass: WRITE: in-bucket offsets
  writeOffset: ${de(e==="count-tiles"?"read":"read_write")},
}

@group(0) @binding(${t})
var<storage, read_write> _buckets: array<SortBucket>;
`,Ef=Xt,li=Xt.bindings,Ha=()=>`

${G}
${Ue}
${ci(li.sortBuckets,"count-tiles")}

${A.SHADER_SNIPPET(li.renderUniforms)}
${Je(li.segmentCountPerTile,"read")}


@compute
@workgroup_size(${Ef.workgroupSizeX}, 1, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
  @builtin(local_invocation_index) local_invocation_index: u32, // threadId inside workgroup
) {
  let tileIdx = global_id.x;
  let viewportSize: vec2f = _uniforms.viewport.xy;

  /*if (local_invocation_index == 0u) {
    for (var i = 0u; i < SORT_BUCKETS; i++) {
      atomicStore(_subResults[i], 0u);
    }
  }
  workgroupBarrier();*/

  let screenTileCount_2d = getTileCount(vec2u(viewportSize));
  let screenTileCount = screenTileCount_2d.x * screenTileCount_2d.y;
  let isValidTile = tileIdx < screenTileCount;

  let segmentCount = _hairSegmentCountPerTile[tileIdx];
  if (isValidTile && segmentCount > 0u) {
    let sortBucket = calcTileSortBucket(segmentCount);
    // atomicAdd(&_subResults[sortBucket], 1u);
    atomicAdd(&_buckets[sortBucket].tileCount, 1u);
  }
  /*workgroupBarrier();

  if (local_invocation_index == 0u) {
    for (var i = 0u; i < SORT_BUCKETS; i++) {
      let bucketValue = atomicLoad(_subResults[i]);
      _segmentsInBucket[i] = bucketValue;
    }
  }*/
}

`;var qt={workgroupSizeX:256,bindings:{renderUniforms:0,segmentCountPerTile:1,tileList:2,sortBuckets:3}},Mf=qt,rr=qt.bindings,$a=()=>`

${G}
${Ue}

${A.SHADER_SNIPPET(rr.renderUniforms)}
${Je(rr.segmentCountPerTile,"read")}
${Vn(rr.tileList,"read_write")}
${ci(rr.sortBuckets,"sort")}


var<workgroup> _bucketOffsets: array<u32, SORT_BUCKETS>;

@compute
@workgroup_size(${Mf.workgroupSizeX}, 1, 1)
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
  @builtin(local_invocation_index) local_invocation_index: u32, // threadId inside workgroup
) {
  let tileIdx = global_id.x;
  let viewportSize: vec2f = _uniforms.viewport.xy;

  if (local_invocation_index == 0u) {
    calculateOffsetsForEachBucket();
  }
  workgroupBarrier();

  let screenTileCount_2d = getTileCount(vec2u(viewportSize));
  let screenTileCount = screenTileCount_2d.x * screenTileCount_2d.y;
  let isValidTile = tileIdx < screenTileCount;

  let segmentCount = _hairSegmentCountPerTile[tileIdx];
  if (isValidTile && segmentCount > 0u) {
    let sortBucket = calcTileSortBucket(segmentCount);
    let bucketOffset = _bucketOffsets[sortBucket];
    let inBucketOffset = atomicAdd(&_buckets[sortBucket].writeOffset, 1u);
    let offset = bucketOffset + inBucketOffset;
    _hairTileData.data[offset] = tileIdx;

    // add to tile counter
    atomicAdd(&_hairTileData.drawnTiles, 1u);
  }
}

fn calculateOffsetsForEachBucket() {
  var offset = 0u;
  for (var i = 0u; i < SORT_BUCKETS; i++) {
    let idx = SORT_BUCKETS - 1u - i; // reverse sort: heavier tiles first
    _bucketOffsets[idx] = offset;
    offset += _buckets[idx].tileCount;
  }
}

`;var ui="count-tiles",fi="sort",ir=class t{static NAME="HairTileSortPass";pipelineCountPerBucket;pipelineSort;bindingsCache=new C;tileListBuffer=void 0;bucketsDataBuffer;constructor(e){let n=u.isTest?GPUBufferUsage.COPY_SRC:0;this.bucketsDataBuffer=e.createBuffer({label:Ut(t,"sortBuckets"),size:u.hairRender.sortBuckets*2*X,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|n}),this.pipelineCountPerBucket=zr(e,t,Ha(),ui),this.pipelineSort=zr(e,t,$a(),fi)}cmdClearBeforeRender(e){this.tileListBuffer&&e.cmdBuf.clearBuffer(this.tileListBuffer,0,X),Xe(e.cmdBuf,this.bucketsDataBuffer)}onViewportResize=(e,n)=>{this.bindingsCache.clear(),this.tileListBuffer&&this.tileListBuffer.destroy(),this.tileListBuffer=wa(e,n)};cmdSortHairTiles(e){let{cmdBuf:n,profiler:r}=e,i=n.beginComputePass({label:t.NAME,timestampWrites:r?.createScopeGpu(t.NAME)});this.cmdCountTilesPerBucket(e,i),this.cmdSort(e,i),i.end()}getDispatchDims_EachTile(e,n){let r=Be(e.viewport);return pe(r.width*r.height,n)}cmdCountTilesPerBucket(e,n){let r=this.bindingsCache.getBindings(ui,()=>this.createBindings_countTilesPerBucket(e));n.setPipeline(this.pipelineCountPerBucket),n.setBindGroup(0,r);let i=this.getDispatchDims_EachTile(e,Xt.workgroupSizeX);n.dispatchWorkgroups(i,1,1)}createBindings_countTilesPerBucket=e=>{let{device:n,globalUniforms:r,hairSegmentCountPerTileBuffer:i}=e,o=Xt.bindings;return Z(t,ui,n,this.pipelineCountPerBucket,[r.createBindingDesc(o.renderUniforms),L(o.segmentCountPerTile,i),L(o.sortBuckets,this.bucketsDataBuffer)])};cmdSort(e,n){let r=this.bindingsCache.getBindings(fi,()=>this.createBindings_Sort(e));n.setPipeline(this.pipelineSort),n.setBindGroup(0,r);let i=this.getDispatchDims_EachTile(e,qt.workgroupSizeX);n.dispatchWorkgroups(i,1,1)}createBindings_Sort=e=>{let{device:n,globalUniforms:r,hairSegmentCountPerTileBuffer:i,hairTileListBuffer:o}=e,a=qt.bindings;return Z(t,fi,n,this.pipelineSort,[r.createBindingDesc(a.renderUniforms),L(a.segmentCountPerTile,i),L(a.tileList,o),L(a.sortBuckets,this.bucketsDataBuffer)])}};var or=class{constructor(e,n,r,i){this.device=e;this.profiler=i;this.cameraCtrl=new En,this.projectionMat=Br(u.camera.projection,n),this.renderUniformBuffer=new A(e),this.drawBackgroundGradientPass=new Fn(e,He),this.shadowMapPass=new Wn(e),this.aoPass=new jn(e,hr),this.drawMeshesPass=new Bn(e,He,hn),this.drawGizmoPass=new nr(e,He),this.hwHairPass=new Ze(e,He,hn),this.hairTilesPass=new Ln(e),this.hairTileSortPass=new ir(e),this.hairShadingPass=new $n(e),this.hairFinePass=new Hn(e),this.hairCombinePass=new kn(e,He),this.presentPass=new Dn(e,r),this.simulationUniformsBuffer=new ke(e),this.hairSimIntegrationPass=new Xn(e),this.gridPreSimPass=new tr(e),this.gridPostSimPass=new er(e),this.drawSdfColliderPass=new Jn(e,He),this.drawGridDbgPass=new Qn(e,He),this.handleViewportResize(n)}cameraCtrl;projectionMat;_viewProjectionMatrix=I.identity();viewportSize={width:0,height:0};frameIdx=0;depthTexture=void 0;depthTextureView=void 0;hdrRenderTexture=void 0;hdrRenderTextureView=void 0;normalsTexture=void 0;normalsTextureView=void 0;aoTexture=void 0;aoTextureView=void 0;renderUniformBuffer;drawBackgroundGradientPass;shadowMapPass;aoPass;drawMeshesPass;drawGizmoPass;hwHairPass;hairTilesPass;hairShadingPass;hairFinePass;hairTileSortPass;hairCombinePass;presentPass;simulationUniformsBuffer;hairSimIntegrationPass;gridPreSimPass;gridPostSimPass;drawSdfColliderPass;drawGridDbgPass;updateCamera(e,n){this.cameraCtrl.update(e,n)}beforeFirstFrame(e){let n=this.device.createCommandEncoder({label:"renderer--before-first-frame"}),r=u.hairSimulation,i=this.createPassCtx(n,e);this.renderUniformBuffer.update(i),this.simulationUniformsBuffer.update(i),r.physicsForcesGrid.enableUpdates&&this.gridPostSimPass.cmdUpdateGridsAfterSim(i,e.hairObject),this.drawMeshesPass.cmdDrawMeshes(i);let{hairObject:o}=i.scene;this.updateResourcesForNextFrame(i,o),this.device.queue.submit([n.finish()])}cmdRender(e,n,r){$(r);let i=u.hairSimulation,o=this.createPassCtx(e,n),{displayMode:a}=u;this.renderUniformBuffer.update(o),this.simulationUniformsBuffer.update(o),this.simulateHair(o,n.hairObject),this.drawBackgroundGradientPass.cmdDraw(o),this.cmdDrawScene(o),(a===D.HW_RENDER||a===D.FINAL)&&this.drawGizmoPass.cmdDrawGizmo(o),i.sdf.showDebugView?this.drawSdfColliderPass.cmdDrawSdf(o):i.physicsForcesGrid.showDebugView&&this.drawGridDbgPass.cmdDrawGridDbg(o),this.presentPass.cmdDraw(o,r,"load"),this.frameIdx+=1}simulateHair(e,n){let{cmdBuf:r,physicsForcesGrid:i}=e,o=u.hairSimulation;if(o.nextFrameResetSimulation){n.resetSimulation(r),i.clearDensityGradAndWindBuffer(r),i.clearDensityVelocityBuffer(r),o.nextFrameResetSimulation=!1;return}if(!o.enabled){i.clearDensityGradAndWindBuffer(r),i.clearDensityVelocityBuffer(r);return}o.physicsForcesGrid.enableUpdates&&this.gridPreSimPass.cmdUpdateGridsBeforeSim(e,n),this.hairSimIntegrationPass.cmdSimulateHairPositions(e,n),o.physicsForcesGrid.enableUpdates&&this.gridPostSimPass.cmdUpdateGridsAfterSim(e,n)}cmdDrawScene(e){let{hairObject:n}=e.scene;this.shadowMapPass.cmdUpdateShadowMap(e),this.drawMeshesPass.cmdDrawMeshes(e);let{displayMode:r}=u;if(r===D.HW_RENDER||r===D.DEPTH||r===D.AO||r===D.NORMALS){this.hwHairPass.cmdDrawHair(e),this.aoPass.cmdCalcAo(e),this.hairShadingPass.cmdComputeShadingPoints(e,n);return}this.hairTilesPass.cmdClearBeforeRender(e),this.hairFinePass.cmdClearBeforeRender(e),this.hairTileSortPass.cmdClearBeforeRender(e),this.hairTilesPass.cmdDrawHairToTiles(e,n),r!==D.TILES&&r!==D.TILES_PPLL&&(this.hairTileSortPass.cmdSortHairTiles(e),this.hairFinePass.cmdRasterizeSlicesHair(e,n)),this.hairCombinePass.cmdCombineRasterResults(e),this.updateResourcesForNextFrame(e,n)}updateResourcesForNextFrame(e,n){this.hwHairPass.cmdDrawHair(e),this.aoPass.cmdCalcAo(e),this.hairShadingPass.cmdComputeShadingPoints(e,n)}get viewMatrix(){return this.cameraCtrl.viewMatrix}createPassCtx(e,n){let r=bn(this.viewMatrix,this.projectionMat,this._viewProjectionMatrix);return{frameIdx:this.frameIdx,device:this.device,cmdBuf:e,viewport:this.viewportSize,scene:n,hdrRenderTexture:this.hdrRenderTextureView,normalsTexture:this.normalsTextureView,aoTexture:this.aoTextureView,profiler:this.profiler,viewMatrix:this.viewMatrix,vpMatrix:r,projMatrix:this.projectionMat,cameraPositionWorldSpace:this.cameraCtrl.positionWorldSpace,depthTexture:this.depthTextureView,shadowDepthTexture:this.shadowMapPass.shadowDepthTextureView,shadowMapSampler:this.shadowMapPass.shadowMapSampler,globalUniforms:this.renderUniformBuffer,simulationUniforms:this.simulationUniformsBuffer,physicsForcesGrid:n.physicsGrid,hairTilesBuffer:this.hairTilesPass.hairTilesBuffer,hairTileSegmentsBuffer:this.hairTilesPass.hairTileSegmentsBuffer,hairSegmentCountPerTileBuffer:this.hairTilesPass.segmentCountPerTileBuffer,hairRasterizerResultsBuffer:this.hairFinePass.hairRasterizerResultsBuffer,hairTileListBuffer:this.hairTileSortPass.tileListBuffer}}handleViewportResize=e=>{e=un(e),console.log("Viewport resize",e),this.viewportSize.width=e.width,this.viewportSize.height=e.height,this.projectionMat=Br(u.camera.projection,e),this.recreateTextures(e),this.presentPass.onViewportResize(),this.drawBackgroundGradientPass.onViewportResize(),this.hairTilesPass.onViewportResize(this.device,e),this.hairFinePass.onViewportResize(this.device,e),this.hairTileSortPass.onViewportResize(this.device,e),this.hairCombinePass.onViewportResize(),this.aoPass.onViewportResize(),this.hairShadingPass.onViewportResize(),this.drawMeshesPass.onViewportResize()};recreateTextures(e){this.depthTexture&&this.depthTexture.destroy(),this.hdrRenderTexture&&this.hdrRenderTexture.destroy(),this.normalsTexture&&this.normalsTexture.destroy(),this.aoTexture&&this.aoTexture.destroy();let n=`${e.width}x${e.height}`,r=GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING;this.hdrRenderTexture=this.device.createTexture({label:`hdr-texture-${n}`,size:[e.width,e.height],format:He,usage:r}),this.hdrRenderTextureView=this.hdrRenderTexture.createView(),this.normalsTexture=this.device.createTexture({label:`normals-texture-${n}`,size:[e.width,e.height],format:hn,usage:r}),this.normalsTextureView=this.normalsTexture.createView(),this.depthTexture=this.device.createTexture({label:`depth-texture-${n}`,size:[e.width,e.height],format:mn,usage:r}),this.depthTextureView=this.depthTexture.createView();let i=u.ao.textureSizeMul,o={width:Math.ceil(e.width*i),height:Math.ceil(e.height*i)};this.aoTexture=this.device.createTexture({label:`ao-texture-${n}`,size:[o.width,o.height],format:hr,usage:r}),this.aoTextureView=this.aoTexture.createView()}onCanvasResize=Fi(this.handleViewportResize,500)};function Df(t){if(t&&!(typeof window>"u")){var e=document.createElement("style");return e.setAttribute("type","text/css"),e.innerHTML=t,document.head.appendChild(e),t}}function Dt(t,e){var n=t.__state.conversionName.toString(),r=Math.round(t.r),i=Math.round(t.g),o=Math.round(t.b),a=t.a,s=Math.round(t.h),l=t.s.toFixed(1),c=t.v.toFixed(1);if(e||n==="THREE_CHAR_HEX"||n==="SIX_CHAR_HEX"){for(var d=t.hex.toString(16);d.length<6;)d="0"+d;return"#"+d}else{if(n==="CSS_RGB")return"rgb("+r+","+i+","+o+")";if(n==="CSS_RGBA")return"rgba("+r+","+i+","+o+","+a+")";if(n==="HEX")return"0x"+t.hex.toString(16);if(n==="RGB_ARRAY")return"["+r+","+i+","+o+"]";if(n==="RGBA_ARRAY")return"["+r+","+i+","+o+","+a+"]";if(n==="RGB_OBJ")return"{r:"+r+",g:"+i+",b:"+o+"}";if(n==="RGBA_OBJ")return"{r:"+r+",g:"+i+",b:"+o+",a:"+a+"}";if(n==="HSV_OBJ")return"{h:"+s+",s:"+l+",v:"+c+"}";if(n==="HSVA_OBJ")return"{h:"+s+",s:"+l+",v:"+c+",a:"+a+"}"}return"unknown format"}var Wa=Array.prototype.forEach,Kt=Array.prototype.slice,h={BREAK:{},extend:function(e){return this.each(Kt.call(arguments,1),function(n){var r=this.isObject(n)?Object.keys(n):[];r.forEach((function(i){this.isUndefined(n[i])||(e[i]=n[i])}).bind(this))},this),e},defaults:function(e){return this.each(Kt.call(arguments,1),function(n){var r=this.isObject(n)?Object.keys(n):[];r.forEach((function(i){this.isUndefined(e[i])&&(e[i]=n[i])}).bind(this))},this),e},compose:function(){var e=Kt.call(arguments);return function(){for(var n=Kt.call(arguments),r=e.length-1;r>=0;r--)n=[e[r].apply(this,n)];return n[0]}},each:function(e,n,r){if(e){if(Wa&&e.forEach&&e.forEach===Wa)e.forEach(n,r);else if(e.length===e.length+0){var i=void 0,o=void 0;for(i=0,o=e.length;i<o;i++)if(i in e&&n.call(r,e[i],i)===this.BREAK)return}else for(var a in e)if(n.call(r,e[a],a)===this.BREAK)return}},defer:function(e){setTimeout(e,0)},debounce:function(e,n,r){var i=void 0;return function(){var o=this,a=arguments;function s(){i=null,r||e.apply(o,a)}var l=r||!i;clearTimeout(i),i=setTimeout(s,n),l&&e.apply(o,a)}},toArray:function(e){return e.toArray?e.toArray():Kt.call(e)},isUndefined:function(e){return e===void 0},isNull:function(e){return e===null},isNaN:function(t){function e(n){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}(function(t){return isNaN(t)}),isArray:Array.isArray||function(t){return t.constructor===Array},isObject:function(e){return e===Object(e)},isNumber:function(e){return e===e+0},isString:function(e){return e===e+""},isBoolean:function(e){return e===!1||e===!0},isFunction:function(e){return e instanceof Function}},Cf=[{litmus:h.isString,conversions:{THREE_CHAR_HEX:{read:function(e){var n=e.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);return n===null?!1:{space:"HEX",hex:parseInt("0x"+n[1].toString()+n[1].toString()+n[2].toString()+n[2].toString()+n[3].toString()+n[3].toString(),0)}},write:Dt},SIX_CHAR_HEX:{read:function(e){var n=e.match(/^#([A-F0-9]{6})$/i);return n===null?!1:{space:"HEX",hex:parseInt("0x"+n[1].toString(),0)}},write:Dt},CSS_RGB:{read:function(e){var n=e.match(/^rgb\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/);return n===null?!1:{space:"RGB",r:parseFloat(n[1]),g:parseFloat(n[2]),b:parseFloat(n[3])}},write:Dt},CSS_RGBA:{read:function(e){var n=e.match(/^rgba\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/);return n===null?!1:{space:"RGB",r:parseFloat(n[1]),g:parseFloat(n[2]),b:parseFloat(n[3]),a:parseFloat(n[4])}},write:Dt}}},{litmus:h.isNumber,conversions:{HEX:{read:function(e){return{space:"HEX",hex:e,conversionName:"HEX"}},write:function(e){return e.hex}}}},{litmus:h.isArray,conversions:{RGB_ARRAY:{read:function(e){return e.length!==3?!1:{space:"RGB",r:e[0],g:e[1],b:e[2]}},write:function(e){return[e.r,e.g,e.b]}},RGBA_ARRAY:{read:function(e){return e.length!==4?!1:{space:"RGB",r:e[0],g:e[1],b:e[2],a:e[3]}},write:function(e){return[e.r,e.g,e.b,e.a]}}}},{litmus:h.isObject,conversions:{RGBA_OBJ:{read:function(e){return h.isNumber(e.r)&&h.isNumber(e.g)&&h.isNumber(e.b)&&h.isNumber(e.a)?{space:"RGB",r:e.r,g:e.g,b:e.b,a:e.a}:!1},write:function(e){return{r:e.r,g:e.g,b:e.b,a:e.a}}},RGB_OBJ:{read:function(e){return h.isNumber(e.r)&&h.isNumber(e.g)&&h.isNumber(e.b)?{space:"RGB",r:e.r,g:e.g,b:e.b}:!1},write:function(e){return{r:e.r,g:e.g,b:e.b}}},HSVA_OBJ:{read:function(e){return h.isNumber(e.h)&&h.isNumber(e.s)&&h.isNumber(e.v)&&h.isNumber(e.a)?{space:"HSV",h:e.h,s:e.s,v:e.v,a:e.a}:!1},write:function(e){return{h:e.h,s:e.s,v:e.v,a:e.a}}},HSV_OBJ:{read:function(e){return h.isNumber(e.h)&&h.isNumber(e.s)&&h.isNumber(e.v)?{space:"HSV",h:e.h,s:e.s,v:e.v}:!1},write:function(e){return{h:e.h,s:e.s,v:e.v}}}}}],Zt=void 0,ar=void 0,pi=function(){ar=!1;var e=arguments.length>1?h.toArray(arguments):arguments[0];return h.each(Cf,function(n){if(n.litmus(e))return h.each(n.conversions,function(r,i){if(Zt=r.read(e),ar===!1&&Zt!==!1)return ar=Zt,Zt.conversionName=i,Zt.conversion=r,h.BREAK}),h.BREAK}),ar},ja=void 0,lr={hsv_to_rgb:function(e,n,r){var i=Math.floor(e/60)%6,o=e/60-Math.floor(e/60),a=r*(1-n),s=r*(1-o*n),l=r*(1-(1-o)*n),c=[[r,l,a],[s,r,a],[a,r,l],[a,s,r],[l,a,r],[r,a,s]][i];return{r:c[0]*255,g:c[1]*255,b:c[2]*255}},rgb_to_hsv:function(e,n,r){var i=Math.min(e,n,r),o=Math.max(e,n,r),a=o-i,s=void 0,l=void 0;if(o!==0)l=a/o;else return{h:NaN,s:0,v:0};return e===o?s=(n-r)/a:n===o?s=2+(r-e)/a:s=4+(e-n)/a,s/=6,s<0&&(s+=1),{h:s*360,s:l,v:o/255}},rgb_to_hex:function(e,n,r){var i=this.hex_with_component(0,2,e);return i=this.hex_with_component(i,1,n),i=this.hex_with_component(i,0,r),i},component_from_hex:function(e,n){return e>>n*8&255},hex_with_component:function(e,n,r){return r<<(ja=n*8)|e&~(255<<ja)}},Rf=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Me=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},Ae=function(){function t(e,n){for(var r=0;r<n.length;r++){var i=n[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),tt=function t(e,n,r){e===null&&(e=Function.prototype);var i=Object.getOwnPropertyDescriptor(e,n);if(i===void 0){var o=Object.getPrototypeOf(e);return o===null?void 0:t(o,n,r)}else{if("value"in i)return i.value;var a=i.get;return a===void 0?void 0:a.call(r)}},nt=function(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)},rt=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t},te=function(){function t(){if(Me(this,t),this.__state=pi.apply(this,arguments),this.__state===!1)throw new Error("Failed to interpret color arguments");this.__state.a=this.__state.a||1}return Ae(t,[{key:"toString",value:function(){return Dt(this)}},{key:"toHexString",value:function(){return Dt(this,!0)}},{key:"toOriginal",value:function(){return this.__state.conversion.write(this)}}]),t}();function Si(t,e,n){Object.defineProperty(t,e,{get:function(){return this.__state.space==="RGB"?this.__state[e]:(te.recalculateRGB(this,e,n),this.__state[e])},set:function(i){this.__state.space!=="RGB"&&(te.recalculateRGB(this,e,n),this.__state.space="RGB"),this.__state[e]=i}})}function vi(t,e){Object.defineProperty(t,e,{get:function(){return this.__state.space==="HSV"?this.__state[e]:(te.recalculateHSV(this),this.__state[e])},set:function(r){this.__state.space!=="HSV"&&(te.recalculateHSV(this),this.__state.space="HSV"),this.__state[e]=r}})}te.recalculateRGB=function(t,e,n){if(t.__state.space==="HEX")t.__state[e]=lr.component_from_hex(t.__state.hex,n);else if(t.__state.space==="HSV")h.extend(t.__state,lr.hsv_to_rgb(t.__state.h,t.__state.s,t.__state.v));else throw new Error("Corrupted color state")};te.recalculateHSV=function(t){var e=lr.rgb_to_hsv(t.r,t.g,t.b);h.extend(t.__state,{s:e.s,v:e.v}),h.isNaN(e.h)?h.isUndefined(t.__state.h)&&(t.__state.h=0):t.__state.h=e.h};te.COMPONENTS=["r","g","b","h","s","v","hex","a"];Si(te.prototype,"r",2);Si(te.prototype,"g",1);Si(te.prototype,"b",0);vi(te.prototype,"h");vi(te.prototype,"s");vi(te.prototype,"v");Object.defineProperty(te.prototype,"a",{get:function(){return this.__state.a},set:function(e){this.__state.a=e}});Object.defineProperty(te.prototype,"hex",{get:function(){return this.__state.space!=="HEX"&&(this.__state.hex=lr.rgb_to_hex(this.r,this.g,this.b),this.__state.space="HEX"),this.__state.hex},set:function(e){this.__state.space="HEX",this.__state.hex=e}});var ft=function(){function t(e,n){Me(this,t),this.initialValue=e[n],this.domElement=document.createElement("div"),this.object=e,this.property=n,this.__onChange=void 0,this.__onFinishChange=void 0}return Ae(t,[{key:"onChange",value:function(n){return this.__onChange=n,this}},{key:"onFinishChange",value:function(n){return this.__onFinishChange=n,this}},{key:"setValue",value:function(n){return this.object[this.property]=n,this.__onChange&&this.__onChange.call(this,n),this.updateDisplay(),this}},{key:"getValue",value:function(){return this.object[this.property]}},{key:"updateDisplay",value:function(){return this}},{key:"isModified",value:function(){return this.initialValue!==this.getValue()}}]),t}(),Bf={HTMLEvents:["change"],MouseEvents:["click","mousemove","mousedown","mouseup","mouseover"],KeyboardEvents:["keydown"]},ns={};h.each(Bf,function(t,e){h.each(t,function(n){ns[n]=e})});var Of=/(\d+(\.\d+)?)px/;function Ve(t){if(t==="0"||h.isUndefined(t))return 0;var e=t.match(Of);return h.isNull(e)?0:parseFloat(e[1])}var p={makeSelectable:function(e,n){e===void 0||e.style===void 0||(e.onselectstart=n?function(){return!1}:function(){},e.style.MozUserSelect=n?"auto":"none",e.style.KhtmlUserSelect=n?"auto":"none",e.unselectable=n?"on":"off")},makeFullscreen:function(e,n,r){var i=r,o=n;h.isUndefined(o)&&(o=!0),h.isUndefined(i)&&(i=!0),e.style.position="absolute",o&&(e.style.left=0,e.style.right=0),i&&(e.style.top=0,e.style.bottom=0)},fakeEvent:function(e,n,r,i){var o=r||{},a=ns[n];if(!a)throw new Error("Event type "+n+" not supported.");var s=document.createEvent(a);switch(a){case"MouseEvents":{var l=o.x||o.clientX||0,c=o.y||o.clientY||0;s.initMouseEvent(n,o.bubbles||!1,o.cancelable||!0,window,o.clickCount||1,0,0,l,c,!1,!1,!1,!1,0,null);break}case"KeyboardEvents":{var d=s.initKeyboardEvent||s.initKeyEvent;h.defaults(o,{cancelable:!0,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,keyCode:void 0,charCode:void 0}),d(n,o.bubbles||!1,o.cancelable,window,o.ctrlKey,o.altKey,o.shiftKey,o.metaKey,o.keyCode,o.charCode);break}default:{s.initEvent(n,o.bubbles||!1,o.cancelable||!0);break}}h.defaults(s,i),e.dispatchEvent(s)},bind:function(e,n,r,i){var o=i||!1;return e.addEventListener?e.addEventListener(n,r,o):e.attachEvent&&e.attachEvent("on"+n,r),p},unbind:function(e,n,r,i){var o=i||!1;return e.removeEventListener?e.removeEventListener(n,r,o):e.detachEvent&&e.detachEvent("on"+n,r),p},addClass:function(e,n){if(e.className===void 0)e.className=n;else if(e.className!==n){var r=e.className.split(/ +/);r.indexOf(n)===-1&&(r.push(n),e.className=r.join(" ").replace(/^\s+/,"").replace(/\s+$/,""))}return p},removeClass:function(e,n){if(n)if(e.className===n)e.removeAttribute("class");else{var r=e.className.split(/ +/),i=r.indexOf(n);i!==-1&&(r.splice(i,1),e.className=r.join(" "))}else e.className=void 0;return p},hasClass:function(e,n){return new RegExp("(?:^|\\s+)"+n+"(?:\\s+|$)").test(e.className)||!1},getWidth:function(e){var n=getComputedStyle(e);return Ve(n["border-left-width"])+Ve(n["border-right-width"])+Ve(n["padding-left"])+Ve(n["padding-right"])+Ve(n.width)},getHeight:function(e){var n=getComputedStyle(e);return Ve(n["border-top-width"])+Ve(n["border-bottom-width"])+Ve(n["padding-top"])+Ve(n["padding-bottom"])+Ve(n.height)},getOffset:function(e){var n=e,r={left:0,top:0};if(n.offsetParent)do r.left+=n.offsetLeft,r.top+=n.offsetTop,n=n.offsetParent;while(n);return r},isActive:function(e){return e===document.activeElement&&(e.type||e.href)}},rs=function(t){nt(e,t);function e(n,r){Me(this,e);var i=rt(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,n,r)),o=i;i.__prev=i.getValue(),i.__checkbox=document.createElement("input"),i.__checkbox.setAttribute("type","checkbox");function a(){o.setValue(!o.__prev)}return p.bind(i.__checkbox,"change",a,!1),i.domElement.appendChild(i.__checkbox),i.updateDisplay(),i}return Ae(e,[{key:"setValue",value:function(r){var i=tt(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"setValue",this).call(this,r);return this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue()),this.__prev=this.getValue(),i}},{key:"updateDisplay",value:function(){return this.getValue()===!0?(this.__checkbox.setAttribute("checked","checked"),this.__checkbox.checked=!0,this.__prev=!0):(this.__checkbox.checked=!1,this.__prev=!1),tt(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this)}}]),e}(ft),Ff=function(t){nt(e,t);function e(n,r,i){Me(this,e);var o=rt(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,n,r)),a=i,s=o;if(o.__select=document.createElement("select"),h.isArray(a)){var l={};h.each(a,function(c){l[c]=c}),a=l}return h.each(a,function(c,d){var f=document.createElement("option");f.innerHTML=d,f.setAttribute("value",c),s.__select.appendChild(f)}),o.updateDisplay(),p.bind(o.__select,"change",function(){var c=this.options[this.selectedIndex].value;s.setValue(c)}),o.domElement.appendChild(o.__select),o}return Ae(e,[{key:"setValue",value:function(r){var i=tt(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"setValue",this).call(this,r);return this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue()),i}},{key:"updateDisplay",value:function(){return p.isActive(this.__select)?this:(this.__select.value=this.getValue(),tt(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this))}}]),e}(ft),Gf=function(t){nt(e,t);function e(n,r){Me(this,e);var i=rt(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,n,r)),o=i;function a(){o.setValue(o.__input.value)}function s(){o.__onFinishChange&&o.__onFinishChange.call(o,o.getValue())}return i.__input=document.createElement("input"),i.__input.setAttribute("type","text"),p.bind(i.__input,"keyup",a),p.bind(i.__input,"change",a),p.bind(i.__input,"blur",s),p.bind(i.__input,"keydown",function(l){l.keyCode===13&&this.blur()}),i.updateDisplay(),i.domElement.appendChild(i.__input),i}return Ae(e,[{key:"updateDisplay",value:function(){return p.isActive(this.__input)||(this.__input.value=this.getValue()),tt(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this)}}]),e}(ft);function Ya(t){var e=t.toString();return e.indexOf(".")>-1?e.length-e.indexOf(".")-1:0}var is=function(t){nt(e,t);function e(n,r,i){Me(this,e);var o=rt(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,n,r)),a=i||{};return o.__min=a.min,o.__max=a.max,o.__step=a.step,h.isUndefined(o.__step)?o.initialValue===0?o.__impliedStep=1:o.__impliedStep=Math.pow(10,Math.floor(Math.log(Math.abs(o.initialValue))/Math.LN10))/10:o.__impliedStep=o.__step,o.__precision=Ya(o.__impliedStep),o}return Ae(e,[{key:"setValue",value:function(r){var i=r;return this.__min!==void 0&&i<this.__min?i=this.__min:this.__max!==void 0&&i>this.__max&&(i=this.__max),this.__step!==void 0&&i%this.__step!==0&&(i=Math.round(i/this.__step)*this.__step),tt(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"setValue",this).call(this,i)}},{key:"min",value:function(r){return this.__min=r,this}},{key:"max",value:function(r){return this.__max=r,this}},{key:"step",value:function(r){return this.__step=r,this.__impliedStep=r,this.__precision=Ya(r),this}}]),e}(ft);function Nf(t,e){var n=Math.pow(10,e);return Math.round(t*n)/n}var cr=function(t){nt(e,t);function e(n,r,i){Me(this,e);var o=rt(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,n,r,i));o.__truncationSuspended=!1;var a=o,s=void 0;function l(){var b=parseFloat(a.__input.value);h.isNaN(b)||a.setValue(b)}function c(){a.__onFinishChange&&a.__onFinishChange.call(a,a.getValue())}function d(){c()}function f(b){var x=s-b.clientY;a.setValue(a.getValue()+x*a.__impliedStep),s=b.clientY}function m(){p.unbind(window,"mousemove",f),p.unbind(window,"mouseup",m),c()}function v(b){p.bind(window,"mousemove",f),p.bind(window,"mouseup",m),s=b.clientY}return o.__input=document.createElement("input"),o.__input.setAttribute("type","text"),p.bind(o.__input,"change",l),p.bind(o.__input,"blur",d),p.bind(o.__input,"mousedown",v),p.bind(o.__input,"keydown",function(b){b.keyCode===13&&(a.__truncationSuspended=!0,this.blur(),a.__truncationSuspended=!1,c())}),o.updateDisplay(),o.domElement.appendChild(o.__input),o}return Ae(e,[{key:"updateDisplay",value:function(){return this.__input.value=this.__truncationSuspended?this.getValue():Nf(this.getValue(),this.__precision),tt(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this)}}]),e}(is);function Xa(t,e,n,r,i){return r+(i-r)*((t-e)/(n-e))}var mi=function(t){nt(e,t);function e(n,r,i,o,a){Me(this,e);var s=rt(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,n,r,{min:i,max:o,step:a})),l=s;s.__background=document.createElement("div"),s.__foreground=document.createElement("div"),p.bind(s.__background,"mousedown",c),p.bind(s.__background,"touchstart",m),p.addClass(s.__background,"slider"),p.addClass(s.__foreground,"slider-fg");function c(x){document.activeElement.blur(),p.bind(window,"mousemove",d),p.bind(window,"mouseup",f),d(x)}function d(x){x.preventDefault();var g=l.__background.getBoundingClientRect();return l.setValue(Xa(x.clientX,g.left,g.right,l.__min,l.__max)),!1}function f(){p.unbind(window,"mousemove",d),p.unbind(window,"mouseup",f),l.__onFinishChange&&l.__onFinishChange.call(l,l.getValue())}function m(x){x.touches.length===1&&(p.bind(window,"touchmove",v),p.bind(window,"touchend",b),v(x))}function v(x){var g=x.touches[0].clientX,T=l.__background.getBoundingClientRect();l.setValue(Xa(g,T.left,T.right,l.__min,l.__max))}function b(){p.unbind(window,"touchmove",v),p.unbind(window,"touchend",b),l.__onFinishChange&&l.__onFinishChange.call(l,l.getValue())}return s.updateDisplay(),s.__background.appendChild(s.__foreground),s.domElement.appendChild(s.__background),s}return Ae(e,[{key:"updateDisplay",value:function(){var r=(this.getValue()-this.__min)/(this.__max-this.__min);return this.__foreground.style.width=r*100+"%",tt(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this)}}]),e}(is),os=function(t){nt(e,t);function e(n,r,i){Me(this,e);var o=rt(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,n,r)),a=o;return o.__button=document.createElement("div"),o.__button.innerHTML=i===void 0?"Fire":i,p.bind(o.__button,"click",function(s){return s.preventDefault(),a.fire(),!1}),p.addClass(o.__button,"button"),o.domElement.appendChild(o.__button),o}return Ae(e,[{key:"fire",value:function(){this.__onChange&&this.__onChange.call(this),this.getValue().call(this.object),this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue())}}]),e}(ft),hi=function(t){nt(e,t);function e(n,r){Me(this,e);var i=rt(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,n,r));i.__color=new te(i.getValue()),i.__temp=new te(0);var o=i;i.domElement=document.createElement("div"),p.makeSelectable(i.domElement,!1),i.__selector=document.createElement("div"),i.__selector.className="selector",i.__saturation_field=document.createElement("div"),i.__saturation_field.className="saturation-field",i.__field_knob=document.createElement("div"),i.__field_knob.className="field-knob",i.__field_knob_border="2px solid ",i.__hue_knob=document.createElement("div"),i.__hue_knob.className="hue-knob",i.__hue_field=document.createElement("div"),i.__hue_field.className="hue-field",i.__input=document.createElement("input"),i.__input.type="text",i.__input_textShadow="0 1px 1px ",p.bind(i.__input,"keydown",function(x){x.keyCode===13&&f.call(this)}),p.bind(i.__input,"blur",f),p.bind(i.__selector,"mousedown",function(){p.addClass(this,"drag").bind(window,"mouseup",function(){p.removeClass(o.__selector,"drag")})}),p.bind(i.__selector,"touchstart",function(){p.addClass(this,"drag").bind(window,"touchend",function(){p.removeClass(o.__selector,"drag")})});var a=document.createElement("div");h.extend(i.__selector.style,{width:"122px",height:"102px",padding:"3px",backgroundColor:"#222",boxShadow:"0px 1px 3px rgba(0,0,0,0.3)"}),h.extend(i.__field_knob.style,{position:"absolute",width:"12px",height:"12px",border:i.__field_knob_border+(i.__color.v<.5?"#fff":"#000"),boxShadow:"0px 1px 3px rgba(0,0,0,0.5)",borderRadius:"12px",zIndex:1}),h.extend(i.__hue_knob.style,{position:"absolute",width:"15px",height:"2px",borderRight:"4px solid #fff",zIndex:1}),h.extend(i.__saturation_field.style,{width:"100px",height:"100px",border:"1px solid #555",marginRight:"3px",display:"inline-block",cursor:"pointer"}),h.extend(a.style,{width:"100%",height:"100%",background:"none"}),qa(a,"top","rgba(0,0,0,0)","#000"),h.extend(i.__hue_field.style,{width:"15px",height:"100px",border:"1px solid #555",cursor:"ns-resize",position:"absolute",top:"3px",right:"3px"}),Uf(i.__hue_field),h.extend(i.__input.style,{outline:"none",textAlign:"center",color:"#fff",border:0,fontWeight:"bold",textShadow:i.__input_textShadow+"rgba(0,0,0,0.7)"}),p.bind(i.__saturation_field,"mousedown",s),p.bind(i.__saturation_field,"touchstart",s),p.bind(i.__field_knob,"mousedown",s),p.bind(i.__field_knob,"touchstart",s),p.bind(i.__hue_field,"mousedown",l),p.bind(i.__hue_field,"touchstart",l);function s(x){v(x),p.bind(window,"mousemove",v),p.bind(window,"touchmove",v),p.bind(window,"mouseup",c),p.bind(window,"touchend",c)}function l(x){b(x),p.bind(window,"mousemove",b),p.bind(window,"touchmove",b),p.bind(window,"mouseup",d),p.bind(window,"touchend",d)}function c(){p.unbind(window,"mousemove",v),p.unbind(window,"touchmove",v),p.unbind(window,"mouseup",c),p.unbind(window,"touchend",c),m()}function d(){p.unbind(window,"mousemove",b),p.unbind(window,"touchmove",b),p.unbind(window,"mouseup",d),p.unbind(window,"touchend",d),m()}function f(){var x=pi(this.value);x!==!1?(o.__color.__state=x,o.setValue(o.__color.toOriginal())):this.value=o.__color.toString()}function m(){o.__onFinishChange&&o.__onFinishChange.call(o,o.__color.toOriginal())}i.__saturation_field.appendChild(a),i.__selector.appendChild(i.__field_knob),i.__selector.appendChild(i.__saturation_field),i.__selector.appendChild(i.__hue_field),i.__hue_field.appendChild(i.__hue_knob),i.domElement.appendChild(i.__input),i.domElement.appendChild(i.__selector),i.updateDisplay();function v(x){x.type.indexOf("touch")===-1&&x.preventDefault();var g=o.__saturation_field.getBoundingClientRect(),T=x.touches&&x.touches[0]||x,P=T.clientX,_=T.clientY,S=(P-g.left)/(g.right-g.left),E=1-(_-g.top)/(g.bottom-g.top);return E>1?E=1:E<0&&(E=0),S>1?S=1:S<0&&(S=0),o.__color.v=E,o.__color.s=S,o.setValue(o.__color.toOriginal()),!1}function b(x){x.type.indexOf("touch")===-1&&x.preventDefault();var g=o.__hue_field.getBoundingClientRect(),T=x.touches&&x.touches[0]||x,P=T.clientY,_=1-(P-g.top)/(g.bottom-g.top);return _>1?_=1:_<0&&(_=0),o.__color.h=_*360,o.setValue(o.__color.toOriginal()),!1}return i}return Ae(e,[{key:"updateDisplay",value:function(){var r=pi(this.getValue());if(r!==!1){var i=!1;h.each(te.COMPONENTS,function(s){if(!h.isUndefined(r[s])&&!h.isUndefined(this.__color.__state[s])&&r[s]!==this.__color.__state[s])return i=!0,{}},this),i&&h.extend(this.__color.__state,r)}h.extend(this.__temp.__state,this.__color.__state),this.__temp.a=1;var o=this.__color.v<.5||this.__color.s>.5?255:0,a=255-o;h.extend(this.__field_knob.style,{marginLeft:100*this.__color.s-7+"px",marginTop:100*(1-this.__color.v)-7+"px",backgroundColor:this.__temp.toHexString(),border:this.__field_knob_border+"rgb("+o+","+o+","+o+")"}),this.__hue_knob.style.marginTop=(1-this.__color.h/360)*100+"px",this.__temp.s=1,this.__temp.v=1,qa(this.__saturation_field,"left","#fff",this.__temp.toHexString()),this.__input.value=this.__color.toString(),h.extend(this.__input.style,{backgroundColor:this.__color.toHexString(),color:"rgb("+o+","+o+","+o+")",textShadow:this.__input_textShadow+"rgba("+a+","+a+","+a+",.7)"})}}]),e}(ft),Lf=["-moz-","-o-","-webkit-","-ms-",""];function qa(t,e,n,r){t.style.background="",h.each(Lf,function(i){t.style.cssText+="background: "+i+"linear-gradient("+e+", "+n+" 0%, "+r+" 100%); "})}function Uf(t){t.style.background="",t.style.cssText+="background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);",t.style.cssText+="background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",t.style.cssText+="background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",t.style.cssText+="background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",t.style.cssText+="background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"}var kf={load:function(e,n){var r=n||document,i=r.createElement("link");i.type="text/css",i.rel="stylesheet",i.href=e,r.getElementsByTagName("head")[0].appendChild(i)},inject:function(e,n){var r=n||document,i=document.createElement("style");i.type="text/css",i.innerHTML=e;var o=r.getElementsByTagName("head")[0];try{o.appendChild(i)}catch{}}},zf=`<div id="dg-save" class="dg dialogue">

  Here's the new load parameter for your <code>GUI</code>'s constructor:

  <textarea id="dg-new-constructor"></textarea>

  <div id="dg-save-locally">

    <input id="dg-local-storage" type="checkbox"/> Automatically save
    values to <code>localStorage</code> on exit.

    <div id="dg-local-explain">The values saved to <code>localStorage</code> will
      override those passed to <code>dat.GUI</code>'s constructor. This makes it
      easier to work incrementally, but <code>localStorage</code> is fragile,
      and your friends may not see the same values you do.

    </div>

  </div>

</div>`,Vf=function(e,n){var r=e[n];return h.isArray(arguments[2])||h.isObject(arguments[2])?new Ff(e,n,arguments[2]):h.isNumber(r)?h.isNumber(arguments[2])&&h.isNumber(arguments[3])?h.isNumber(arguments[4])?new mi(e,n,arguments[2],arguments[3],arguments[4]):new mi(e,n,arguments[2],arguments[3]):h.isNumber(arguments[4])?new cr(e,n,{min:arguments[2],max:arguments[3],step:arguments[4]}):new cr(e,n,{min:arguments[2],max:arguments[3]}):h.isString(r)?new Gf(e,n):h.isFunction(r)?new os(e,n,""):h.isBoolean(r)?new rs(e,n):null};function Hf(t){setTimeout(t,1e3/60)}var $f=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||Hf,Wf=function(){function t(){Me(this,t),this.backgroundElement=document.createElement("div"),h.extend(this.backgroundElement.style,{backgroundColor:"rgba(0,0,0,0.8)",top:0,left:0,display:"none",zIndex:"1000",opacity:0,WebkitTransition:"opacity 0.2s linear",transition:"opacity 0.2s linear"}),p.makeFullscreen(this.backgroundElement),this.backgroundElement.style.position="fixed",this.domElement=document.createElement("div"),h.extend(this.domElement.style,{position:"fixed",display:"none",zIndex:"1001",opacity:0,WebkitTransition:"-webkit-transform 0.2s ease-out, opacity 0.2s linear",transition:"transform 0.2s ease-out, opacity 0.2s linear"}),document.body.appendChild(this.backgroundElement),document.body.appendChild(this.domElement);var e=this;p.bind(this.backgroundElement,"click",function(){e.hide()})}return Ae(t,[{key:"show",value:function(){var n=this;this.backgroundElement.style.display="block",this.domElement.style.display="block",this.domElement.style.opacity=0,this.domElement.style.webkitTransform="scale(1.1)",this.layout(),h.defer(function(){n.backgroundElement.style.opacity=1,n.domElement.style.opacity=1,n.domElement.style.webkitTransform="scale(1)"})}},{key:"hide",value:function(){var n=this,r=function i(){n.domElement.style.display="none",n.backgroundElement.style.display="none",p.unbind(n.domElement,"webkitTransitionEnd",i),p.unbind(n.domElement,"transitionend",i),p.unbind(n.domElement,"oTransitionEnd",i)};p.bind(this.domElement,"webkitTransitionEnd",r),p.bind(this.domElement,"transitionend",r),p.bind(this.domElement,"oTransitionEnd",r),this.backgroundElement.style.opacity=0,this.domElement.style.opacity=0,this.domElement.style.webkitTransform="scale(1.1)"}},{key:"layout",value:function(){this.domElement.style.left=window.innerWidth/2-p.getWidth(this.domElement)/2+"px",this.domElement.style.top=window.innerHeight/2-p.getHeight(this.domElement)/2+"px"}}]),t}(),jf=Df(`.dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .cr.function .property-name{width:100%}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}
`);kf.inject(jf);var Ka="dg",Za=72,Ja=20,tn="Default",Jt=function(){try{return!!window.localStorage}catch{return!1}}(),Qt=void 0,Qa=!0,Mt=void 0,di=!1,as=[],j=function t(e){var n=this,r=e||{};this.domElement=document.createElement("div"),this.__ul=document.createElement("ul"),this.domElement.appendChild(this.__ul),p.addClass(this.domElement,Ka),this.__folders={},this.__controllers=[],this.__rememberedObjects=[],this.__rememberedObjectIndecesToControllers=[],this.__listening=[],r=h.defaults(r,{closeOnTop:!1,autoPlace:!0,width:t.DEFAULT_WIDTH}),r=h.defaults(r,{resizable:r.autoPlace,hideable:r.autoPlace}),h.isUndefined(r.load)?r.load={preset:tn}:r.preset&&(r.load.preset=r.preset),h.isUndefined(r.parent)&&r.hideable&&as.push(this),r.resizable=h.isUndefined(r.parent)&&r.resizable,r.autoPlace&&h.isUndefined(r.scrollable)&&(r.scrollable=!0);var i=Jt&&localStorage.getItem(At(this,"isLocal"))==="true",o=void 0,a=void 0;if(Object.defineProperties(this,{parent:{get:function(){return r.parent}},scrollable:{get:function(){return r.scrollable}},autoPlace:{get:function(){return r.autoPlace}},closeOnTop:{get:function(){return r.closeOnTop}},preset:{get:function(){return n.parent?n.getRoot().preset:r.load.preset},set:function(m){n.parent?n.getRoot().preset=m:r.load.preset=m,Kf(this),n.revert()}},width:{get:function(){return r.width},set:function(m){r.width=m,xi(n,m)}},name:{get:function(){return r.name},set:function(m){r.name=m,a&&(a.innerHTML=r.name)}},closed:{get:function(){return r.closed},set:function(m){r.closed=m,r.closed?p.addClass(n.__ul,t.CLASS_CLOSED):p.removeClass(n.__ul,t.CLASS_CLOSED),this.onResize(),n.__closeButton&&(n.__closeButton.innerHTML=m?t.TEXT_OPEN:t.TEXT_CLOSED)}},load:{get:function(){return r.load}},useLocalStorage:{get:function(){return i},set:function(m){Jt&&(i=m,m?p.bind(window,"unload",o):p.unbind(window,"unload",o),localStorage.setItem(At(n,"isLocal"),m))}}}),h.isUndefined(r.parent)){if(this.closed=r.closed||!1,p.addClass(this.domElement,t.CLASS_MAIN),p.makeSelectable(this.domElement,!1),Jt&&i){n.useLocalStorage=!0;var s=localStorage.getItem(At(this,"gui"));s&&(r.load=JSON.parse(s))}this.__closeButton=document.createElement("div"),this.__closeButton.innerHTML=t.TEXT_CLOSED,p.addClass(this.__closeButton,t.CLASS_CLOSE_BUTTON),r.closeOnTop?(p.addClass(this.__closeButton,t.CLASS_CLOSE_TOP),this.domElement.insertBefore(this.__closeButton,this.domElement.childNodes[0])):(p.addClass(this.__closeButton,t.CLASS_CLOSE_BOTTOM),this.domElement.appendChild(this.__closeButton)),p.bind(this.__closeButton,"click",function(){n.closed=!n.closed})}else{r.closed===void 0&&(r.closed=!0);var l=document.createTextNode(r.name);p.addClass(l,"controller-name"),a=bi(n,l);var c=function(m){return m.preventDefault(),n.closed=!n.closed,!1};p.addClass(this.__ul,t.CLASS_CLOSED),p.addClass(a,"title"),p.bind(a,"click",c),r.closed||(this.closed=!1)}r.autoPlace&&(h.isUndefined(r.parent)&&(Qa&&(Mt=document.createElement("div"),p.addClass(Mt,Ka),p.addClass(Mt,t.CLASS_AUTO_PLACE_CONTAINER),document.body.appendChild(Mt),Qa=!1),Mt.appendChild(this.domElement),p.addClass(this.domElement,t.CLASS_AUTO_PLACE)),this.parent||xi(n,r.width)),this.__resizeHandler=function(){n.onResizeDebounced()},p.bind(window,"resize",this.__resizeHandler),p.bind(this.__ul,"webkitTransitionEnd",this.__resizeHandler),p.bind(this.__ul,"transitionend",this.__resizeHandler),p.bind(this.__ul,"oTransitionEnd",this.__resizeHandler),this.onResize(),r.resizable&&qf(this),o=function(){Jt&&localStorage.getItem(At(n,"isLocal"))==="true"&&localStorage.setItem(At(n,"gui"),JSON.stringify(n.getSaveObject()))},this.saveToLocalStorageIfPossible=o;function d(){var f=n.getRoot();f.width+=1,h.defer(function(){f.width-=1})}r.parent||d()};j.toggleHide=function(){di=!di,h.each(as,function(t){t.domElement.style.display=di?"none":""})};j.CLASS_AUTO_PLACE="a";j.CLASS_AUTO_PLACE_CONTAINER="ac";j.CLASS_MAIN="main";j.CLASS_CONTROLLER_ROW="cr";j.CLASS_TOO_TALL="taller-than-window";j.CLASS_CLOSED="closed";j.CLASS_CLOSE_BUTTON="close-button";j.CLASS_CLOSE_TOP="close-top";j.CLASS_CLOSE_BOTTOM="close-bottom";j.CLASS_DRAG="drag";j.DEFAULT_WIDTH=245;j.TEXT_CLOSED="Close Controls";j.TEXT_OPEN="Open Controls";j._keydownHandler=function(t){document.activeElement.type!=="text"&&(t.which===Za||t.keyCode===Za)&&j.toggleHide()};p.bind(window,"keydown",j._keydownHandler,!1);h.extend(j.prototype,{add:function(e,n){return en(this,e,n,{factoryArgs:Array.prototype.slice.call(arguments,2)})},addColor:function(e,n){return en(this,e,n,{color:!0})},remove:function(e){this.__ul.removeChild(e.__li),this.__controllers.splice(this.__controllers.indexOf(e),1);var n=this;h.defer(function(){n.onResize()})},destroy:function(){if(this.parent)throw new Error("Only the root GUI should be removed with .destroy(). For subfolders, use gui.removeFolder(folder) instead.");this.autoPlace&&Mt.removeChild(this.domElement);var e=this;h.each(this.__folders,function(n){e.removeFolder(n)}),p.unbind(window,"keydown",j._keydownHandler,!1),es(this)},addFolder:function(e){if(this.__folders[e]!==void 0)throw new Error('You already have a folder in this GUI by the name "'+e+'"');var n={name:e,parent:this};n.autoPlace=this.autoPlace,this.load&&this.load.folders&&this.load.folders[e]&&(n.closed=this.load.folders[e].closed,n.load=this.load.folders[e]);var r=new j(n);this.__folders[e]=r;var i=bi(this,r.domElement);return p.addClass(i,"folder"),r},removeFolder:function(e){this.__ul.removeChild(e.domElement.parentElement),delete this.__folders[e.name],this.load&&this.load.folders&&this.load.folders[e.name]&&delete this.load.folders[e.name],es(e);var n=this;h.each(e.__folders,function(r){e.removeFolder(r)}),h.defer(function(){n.onResize()})},open:function(){this.closed=!1},close:function(){this.closed=!0},hide:function(){this.domElement.style.display="none"},show:function(){this.domElement.style.display=""},onResize:function(){var e=this.getRoot();if(e.scrollable){var n=p.getOffset(e.__ul).top,r=0;h.each(e.__ul.childNodes,function(i){e.autoPlace&&i===e.__save_row||(r+=p.getHeight(i))}),window.innerHeight-n-Ja<r?(p.addClass(e.domElement,j.CLASS_TOO_TALL),e.__ul.style.height=window.innerHeight-n-Ja+"px"):(p.removeClass(e.domElement,j.CLASS_TOO_TALL),e.__ul.style.height="auto")}e.__resize_handle&&h.defer(function(){e.__resize_handle.style.height=e.__ul.offsetHeight+"px"}),e.__closeButton&&(e.__closeButton.style.width=e.width+"px")},onResizeDebounced:h.debounce(function(){this.onResize()},50),remember:function(){if(h.isUndefined(Qt)&&(Qt=new Wf,Qt.domElement.innerHTML=zf),this.parent)throw new Error("You can only call remember on a top level GUI.");var e=this;h.each(Array.prototype.slice.call(arguments),function(n){e.__rememberedObjects.length===0&&Xf(e),e.__rememberedObjects.indexOf(n)===-1&&e.__rememberedObjects.push(n)}),this.autoPlace&&xi(this,this.width)},getRoot:function(){for(var e=this;e.parent;)e=e.parent;return e},getSaveObject:function(){var e=this.load;return e.closed=this.closed,this.__rememberedObjects.length>0&&(e.preset=this.preset,e.remembered||(e.remembered={}),e.remembered[this.preset]=sr(this)),e.folders={},h.each(this.__folders,function(n,r){e.folders[r]=n.getSaveObject()}),e},save:function(){this.load.remembered||(this.load.remembered={}),this.load.remembered[this.preset]=sr(this),gi(this,!1),this.saveToLocalStorageIfPossible()},saveAs:function(e){this.load.remembered||(this.load.remembered={},this.load.remembered[tn]=sr(this,!0)),this.load.remembered[e]=sr(this),this.preset=e,_i(this,e,!0),this.saveToLocalStorageIfPossible()},revert:function(e){h.each(this.__controllers,function(n){this.getRoot().load.remembered?ss(e||this.getRoot(),n):n.setValue(n.initialValue),n.__onFinishChange&&n.__onFinishChange.call(n,n.getValue())},this),h.each(this.__folders,function(n){n.revert(n)}),e||gi(this.getRoot(),!1)},listen:function(e){var n=this.__listening.length===0;this.__listening.push(e),n&&ls(this.__listening)},updateDisplay:function(){h.each(this.__controllers,function(e){e.updateDisplay()}),h.each(this.__folders,function(e){e.updateDisplay()})}});function bi(t,e,n){var r=document.createElement("li");return e&&r.appendChild(e),n?t.__ul.insertBefore(r,n):t.__ul.appendChild(r),t.onResize(),r}function es(t){p.unbind(window,"resize",t.__resizeHandler),t.saveToLocalStorageIfPossible&&p.unbind(window,"unload",t.saveToLocalStorageIfPossible)}function gi(t,e){var n=t.__preset_select[t.__preset_select.selectedIndex];e?n.innerHTML=n.value+"*":n.innerHTML=n.value}function Yf(t,e,n){if(n.__li=e,n.__gui=t,h.extend(n,{options:function(a){if(arguments.length>1){var s=n.__li.nextElementSibling;return n.remove(),en(t,n.object,n.property,{before:s,factoryArgs:[h.toArray(arguments)]})}if(h.isArray(a)||h.isObject(a)){var l=n.__li.nextElementSibling;return n.remove(),en(t,n.object,n.property,{before:l,factoryArgs:[a]})}},name:function(a){return n.__li.firstElementChild.firstElementChild.innerHTML=a,n},listen:function(){return n.__gui.listen(n),n},remove:function(){return n.__gui.remove(n),n}}),n instanceof mi){var r=new cr(n.object,n.property,{min:n.__min,max:n.__max,step:n.__step});h.each(["updateDisplay","onChange","onFinishChange","step","min","max"],function(o){var a=n[o],s=r[o];n[o]=r[o]=function(){var l=Array.prototype.slice.call(arguments);return s.apply(r,l),a.apply(n,l)}}),p.addClass(e,"has-slider"),n.domElement.insertBefore(r.domElement,n.domElement.firstElementChild)}else if(n instanceof cr){var i=function(a){if(h.isNumber(n.__min)&&h.isNumber(n.__max)){var s=n.__li.firstElementChild.firstElementChild.innerHTML,l=n.__gui.__listening.indexOf(n)>-1;n.remove();var c=en(t,n.object,n.property,{before:n.__li.nextElementSibling,factoryArgs:[n.__min,n.__max,n.__step]});return c.name(s),l&&c.listen(),c}return a};n.min=h.compose(i,n.min),n.max=h.compose(i,n.max)}else n instanceof rs?(p.bind(e,"click",function(){p.fakeEvent(n.__checkbox,"click")}),p.bind(n.__checkbox,"click",function(o){o.stopPropagation()})):n instanceof os?(p.bind(e,"click",function(){p.fakeEvent(n.__button,"click")}),p.bind(e,"mouseover",function(){p.addClass(n.__button,"hover")}),p.bind(e,"mouseout",function(){p.removeClass(n.__button,"hover")})):n instanceof hi&&(p.addClass(e,"color"),n.updateDisplay=h.compose(function(o){return e.style.borderLeftColor=n.__color.toString(),o},n.updateDisplay),n.updateDisplay());n.setValue=h.compose(function(o){return t.getRoot().__preset_select&&n.isModified()&&gi(t.getRoot(),!0),o},n.setValue)}function ss(t,e){var n=t.getRoot(),r=n.__rememberedObjects.indexOf(e.object);if(r!==-1){var i=n.__rememberedObjectIndecesToControllers[r];if(i===void 0&&(i={},n.__rememberedObjectIndecesToControllers[r]=i),i[e.property]=e,n.load&&n.load.remembered){var o=n.load.remembered,a=void 0;if(o[t.preset])a=o[t.preset];else if(o[tn])a=o[tn];else return;if(a[r]&&a[r][e.property]!==void 0){var s=a[r][e.property];e.initialValue=s,e.setValue(s)}}}}function en(t,e,n,r){if(e[n]===void 0)throw new Error('Object "'+e+'" has no property "'+n+'"');var i=void 0;if(r.color)i=new hi(e,n);else{var o=[e,n].concat(r.factoryArgs);i=Vf.apply(t,o)}r.before instanceof ft&&(r.before=r.before.__li),ss(t,i),p.addClass(i.domElement,"c");var a=document.createElement("span");p.addClass(a,"property-name"),a.innerHTML=i.property;var s=document.createElement("div");s.appendChild(a),s.appendChild(i.domElement);var l=bi(t,s,r.before);return p.addClass(l,j.CLASS_CONTROLLER_ROW),i instanceof hi?p.addClass(l,"color"):p.addClass(l,Rf(i.getValue())),Yf(t,l,i),t.__controllers.push(i),i}function At(t,e){return document.location.href+"."+e}function _i(t,e,n){var r=document.createElement("option");r.innerHTML=e,r.value=e,t.__preset_select.appendChild(r),n&&(t.__preset_select.selectedIndex=t.__preset_select.length-1)}function ts(t,e){e.style.display=t.useLocalStorage?"block":"none"}function Xf(t){var e=t.__save_row=document.createElement("li");p.addClass(t.domElement,"has-save"),t.__ul.insertBefore(e,t.__ul.firstChild),p.addClass(e,"save-row");var n=document.createElement("span");n.innerHTML="&nbsp;",p.addClass(n,"button gears");var r=document.createElement("span");r.innerHTML="Save",p.addClass(r,"button"),p.addClass(r,"save");var i=document.createElement("span");i.innerHTML="New",p.addClass(i,"button"),p.addClass(i,"save-as");var o=document.createElement("span");o.innerHTML="Revert",p.addClass(o,"button"),p.addClass(o,"revert");var a=t.__preset_select=document.createElement("select");if(t.load&&t.load.remembered?h.each(t.load.remembered,function(f,m){_i(t,m,m===t.preset)}):_i(t,tn,!1),p.bind(a,"change",function(){for(var f=0;f<t.__preset_select.length;f++)t.__preset_select[f].innerHTML=t.__preset_select[f].value;t.preset=this.value}),e.appendChild(a),e.appendChild(n),e.appendChild(r),e.appendChild(i),e.appendChild(o),Jt){var s=document.getElementById("dg-local-explain"),l=document.getElementById("dg-local-storage"),c=document.getElementById("dg-save-locally");c.style.display="block",localStorage.getItem(At(t,"isLocal"))==="true"&&l.setAttribute("checked","checked"),ts(t,s),p.bind(l,"change",function(){t.useLocalStorage=!t.useLocalStorage,ts(t,s)})}var d=document.getElementById("dg-new-constructor");p.bind(d,"keydown",function(f){f.metaKey&&(f.which===67||f.keyCode===67)&&Qt.hide()}),p.bind(n,"click",function(){d.innerHTML=JSON.stringify(t.getSaveObject(),void 0,2),Qt.show(),d.focus(),d.select()}),p.bind(r,"click",function(){t.save()}),p.bind(i,"click",function(){var f=prompt("Enter a new preset name.");f&&t.saveAs(f)}),p.bind(o,"click",function(){t.revert()})}function qf(t){var e=void 0;t.__resize_handle=document.createElement("div"),h.extend(t.__resize_handle.style,{width:"6px",marginLeft:"-3px",height:"200px",cursor:"ew-resize",position:"absolute"});function n(o){return o.preventDefault(),t.width+=e-o.clientX,t.onResize(),e=o.clientX,!1}function r(){p.removeClass(t.__closeButton,j.CLASS_DRAG),p.unbind(window,"mousemove",n),p.unbind(window,"mouseup",r)}function i(o){return o.preventDefault(),e=o.clientX,p.addClass(t.__closeButton,j.CLASS_DRAG),p.bind(window,"mousemove",n),p.bind(window,"mouseup",r),!1}p.bind(t.__resize_handle,"mousedown",i),p.bind(t.__closeButton,"mousedown",i),t.domElement.insertBefore(t.__resize_handle,t.domElement.firstElementChild)}function xi(t,e){t.domElement.style.width=e+"px",t.__save_row&&t.autoPlace&&(t.__save_row.style.width=e+"px"),t.__closeButton&&(t.__closeButton.style.width=e+"px")}function sr(t,e){var n={};return h.each(t.__rememberedObjects,function(r,i){var o={},a=t.__rememberedObjectIndecesToControllers[i];h.each(a,function(s,l){o[l]=e?s.initialValue:s.getValue()}),n[i]=o}),n}function Kf(t){for(var e=0;e<t.__preset_select.length;e++)t.__preset_select[e].value===t.preset&&(t.__preset_select.selectedIndex=e)}function ls(t){t.length!==0&&$f.call(window,function(){ls(t)}),h.each(t,function(e){e.updateDisplay()})}var cs=j;function us(t,e,n,r){let i=new cs,o={openGithub:()=>{window.location.href=u.githubRepoLink},profile:()=>{e.profileNextFrame(!0)},resetCamera:()=>{r.resetPosition()},resetSimulation:()=>{u.hairSimulation.nextFrameResetSimulation=!0},resetBall:()=>{K.copy(u.hairSimulation.collisionSphereInitial,u.hairSimulation.collisionSphere)},modelRotation:0};i.add(o,"openGithub").name("GITHUB"),i.add(o,"profile").name("Profile");let a=Pi(u,"displayMode",[{label:"Final",value:D.FINAL},{label:"DBG: tiles",value:D.TILES},{label:"DBG: tiles PPLL",value:D.TILES_PPLL},{label:"DBG: slices cnt",value:D.USED_SLICES},{label:"DBG: hw-render",value:D.HW_RENDER},{label:"DBG: depth",value:D.DEPTH},{label:"DBG: normals",value:D.NORMALS},{label:"DBG: ao",value:D.AO}]),s=i.add(a,"displayMode",a.values).name("Display mode");l(i),c(i),d(i),f(i),m(i),v(i,u.lights[0],"Light 0"),v(i,u.lights[1],"Light 1"),v(i,u.lights[2],"Light 2"),b(i),x(i),g();function l(P){let _=P.addFolder("Scene"),S=u.background;_.add(o,"resetCamera").name("Reset camera"),_.add(o,"modelRotation",0,360).step(1).name("Rotation").onChange(E=>{I.rotationY(De(E),n.modelMatrix)}),T(_,S,"color0","Bg color 0"),T(_,S,"color1","Bg color 1"),_.add(S,"noiseScale",0,10).name("Bg noise scale"),_.add(S,"gradientStrength",0,1).name("Bg gradient")}function c(P){let _=u.hairRender,S=P.addFolder("Hair render");S.open(),S.add(_,"lodRenderPercent",0,100).step(1).name("Render %"),S.add(_,"fiberRadius",1e-4,.002).name("Radius");let E=S.add(_,"dbgTileModeMaxSegments",1,512).step(1).name("Max segments"),N=S.add(_,"dbgSlicesModeMaxSlices",1,128).step(1).name("Max slices"),R=S.add(_,"dbgShowTiles").name("Show tiles");s.onFinishChange(V);function V(){let w=u.displayMode;wi(E,w===D.TILES||w===D.TILES_PPLL),wi(N,w===D.USED_SLICES),wi(R,w===D.FINAL)}}function d(P){let _=u.hairRender.material,S=P.addFolder("Hair material");T(S,_,"color0","Color root"),T(S,_,"color1","Color tip"),S.add(_,"colorRng",0,1).name("Color RNG"),S.add(_,"lumaRng",0,1).name("Luma RNG"),S.add(_,"specular",0,3,.01).name("Specular"),S.add(_,"weightTT",0,2,.01).name("Weight TT"),S.add(_,"weightTRT",0,2,.01).name("Weight TRT"),S.add(_,"shift",-1,1,.01).name("Shift"),S.add(_,"roughness",0,1,.01).name("Roughness"),S.add(_,"attenuation",0,40).name("Attenuation"),S.add(_,"shadows",0,1).name("Shadows")}function f(P){let _=u.hairSimulation,S=_.sdf,E=_.physicsForcesGrid,N=_.constraints,R=_.wind,V=P.addFolder("Hair simulation"),w=V;w.open(),w.add(o,"resetSimulation").name("Reset simulation"),w.add(_,"enabled").name("Enabled"),w.add(_,"gravity",0,.1).name("Gravity"),w.add(_,"friction",0,1).name("Friction"),w.add(_,"volumePreservation",0,25e-5).name("Vol. Preserv."),w.add(o,"resetBall").name("Reset ball"),w.add(u,"drawColliders").name("Draw ball"),w=V.addFolder("Constraints"),w.open(),w.add(N,"constraintIterations",1,10).step(1).name("Iterations"),w.add(N,"stiffnessLengthConstr",0,1).name("Stiff. len"),w.add(N,"stiffnessGlobalConstr",0,1).name("Stiff. global"),w.add(N,"globalExtent",0,1).name("Global extent"),w.add(N,"globalFade",0,1).name("Global fade"),w.add(N,"stiffnessLocalConstr",0,1).name("Stiff. local"),w.add(N,"stiffnessCollisions",0,1).name("Stiff. collisions"),w.add(N,"stiffnessSDF",0,1).name("Stiff. SDF"),w.add(S,"distanceOffset",-.003,.003).name("SDF offset"),w=V.addFolder("Wind"),w.open(),w.add(R,"dirPhi",-179,179).step(1).name("Dir phi"),w.add(R,"dirTheta",15,165).step(1).name("Dir th"),w.add(R,"strength",0,1).name("Strength"),w.add(R,"strengthLull",0,1).name("Lull strength"),w.add(R,"strengthFrequency",.001,2).name("Str. frequency"),w.add(R,"strengthJitter",0,1).name("Str. Jitter"),w.add(R,"phaseOffset",0,.5).name("Phase offset"),w.add(R,"colisionTraceOffset",1,5).name("Collision offset"),w=V.addFolder("SDF preview"),w.add(S,"showDebugView").name("Enabled"),w.add(S,"debugSemitransparent").name("Semitransparent"),w.add(S,"debugSlice",0,1,.01).name("Slice"),w=V.addFolder("Grids preview"),w.add(E,"showDebugView").name("Enabled");let Q=Pi(E,"debugValue",[{label:"Density",value:xe.DENSITY},{label:"Density Grad",value:xe.DENSITY_GRADIENT},{label:"Velocity",value:xe.VELOCITY},{label:"Wind",value:xe.WIND}]);w.add(Q,"debugValue",Q.values).name("Value"),w.add(E,"debugAbsValue").name("Vector abs"),w.add(E,"debugSlice",0,1,.01).name("Slice")}function m(P){let _=P.addFolder("Ambient light");T(_,u.lightAmbient,"color","Color"),_.add(u.lightAmbient,"energy",0,.2,.01).name("Energy")}function v(P,_,S){let E=P.addFolder(S);E.add(_,"posPhi",-179,179).step(1).name("Position phi"),E.add(_,"posTheta",15,165).step(1).name("Position th"),T(E,_,"color","Color"),E.add(_,"energy",0,2).name("Energy")}function b(P){let _=u.shadows,S=P.addFolder("Shadows"),E=Pi(_,"usePCSS",[{label:"PCF",value:!1},{label:"PCSS",value:!0}]);S.add(E,"usePCSS",E.values).name("Technique"),S.add(_,"strength",0,1).name("Strength"),S.add(_,"PCF_Radius",[0,1,2,3,4]).name("PCF radius"),S.add(_,"bias",0,.001).name("Bias"),S.add(_,"hairFiberWidthMultiplier",.5,6).name("Hair width mul"),S.add(_.source,"posPhi",-179,179).step(1).name("Position phi"),S.add(_.source,"posTheta",15,165).step(1).name("Position th"),S.add(_,"showDebugView").name("Show preview")}function x(P){let _=u.ao,S=P.addFolder("Ambient occl.");S.add(_,"strength",0,1).name("Strength"),S.add(_,"radius",.001,2.5).name("Radius"),S.add(_,"numDirections",0,128,1).name("Directions"),S.add(_,"numSteps",2,32,1).name("Steps"),S.add(_,"directionOffset",0,5).name("Dir. offset"),S.add(_,"falloffStart2",0,.5).name("Falloff start"),S.add(_,"falloffEnd2",1,5).name("Falloff end")}function g(){let P=i.addFolder("Color mgmt"),_=u.colors;P.add(_,"gamma",1,3).name("Gamma"),P.add(_,"exposure",0,2).name("Exposure"),P.add(_,"ditherStrength",0,2).name("Dithering")}function T(P,_,S,E){let N={value:[]};Object.defineProperty(N,"value",{enumerable:!0,get:()=>{let R=_[S];return[R[0]*255,R[1]*255,R[2]*255]},set:R=>{let V=_[S];V[0]=R[0]/255,V[1]=R[1]/255,V[2]=R[2]/255}}),P.addColor(N,"value").name(E)}}function wi(t,e){if(!t){console.error("Not controller for gui element found!");return}let n=t.__li;e?n.style.display="":n.style.display="none"}var Pi=(t,e,n)=>{let r={values:n.map(i=>i.label)};return Object.defineProperty(r,e,{enumerable:!0,get:()=>{let i=t[e];return(n.find(a=>a.value===i)||n[0]).label},set:i=>{let o=n.find(a=>a.label===i)||n[0];t[e]=o.value}}),r};function fs(t,e){let n=l();t.width=n.width,t.height=n.height,console.log("Init canvas size:",n);let r=[];return{revalidateCanvasSize:a,addListener:c=>r.push(c),getViewportSize:l,getScreenTextureView:()=>e.getCurrentTexture().createView()};function a(){let c=l();(c.width!==t.width||c.height!==t.height)&&c.width&&c.height&&s(c)}function s(c){t.width=c.width,t.height=c.height,r.forEach(d=>d(c))}function l(){let c=window.devicePixelRatio||1;return un({width:t.clientWidth*c,height:t.clientHeight*c})}}function ds(t){let e=["internal","out-of-memory","validation"],n=e.toReversed(),r="-";return{startErrorScope:i,reportErrorScopeAsync:o};function i(a="-"){r=a,e.forEach(s=>t.pushErrorScope(s))}async function o(a){let s;for(let l of n){let c=await t.popErrorScope();if(c){let d=`WebGPU error [${r}][${l}]: ${c.message}`;s=d,a?a(d):console.error(d)}}return s}}var ps=t=>t=="0"?"1":"0",ur=class{constructor(e,n,r,i,o){this.name=e;this.strandsCount=n;this.pointsPerStrand=r;this.bounds=i;this.buffers=o}_currentPositionsBuffer="0";get pointsCount(){return this.strandsCount*this.pointsPerStrand}get segmentCount(){return this.strandsCount*(this.pointsPerStrand-1)}get currentPositionsBufferIdx(){return this._currentPositionsBuffer}getRenderedStrandCount(){let e=Rt(u.hairRender.lodRenderPercent,0,100),{strandsCount:n}=this,r=Math.ceil(n*e/100);return Rt(r,0,n)}reportRenderedStrandCount(){let{strandsCount:e,pointsPerStrand:n,segmentCount:r}=this,i=this.getRenderedStrandCount();z.update("Rendered strands",Sr(i,e,0));let o=i*(n-1);return z.update("Rendered segments",Sr(o,r,0)),i}resetSimulation(e){let{initialPointsPositionsBuffer:n,pointsPositionsBuffer_0:r,pointsPositionsBuffer_1:i}=this.buffers,o=n.size;e.copyBufferToBuffer(n,0,r,0,o),e.copyBufferToBuffer(n,0,i,0,o)}swapPositionBuffersAfterSimIntegration(){this._currentPositionsBuffer=ps(this._currentPositionsBuffer)}bindPointsPositions=e=>this.bindPointsPositionsByPosIdx(e,this._currentPositionsBuffer);bindPointsPositions_PREV=e=>this.bindPointsPositionsByPosIdx(e,ps(this._currentPositionsBuffer));bindPointsPositionsByPosIdx=(e,n)=>{let r=n=="0"?this.buffers.pointsPositionsBuffer_0:this.buffers.pointsPositionsBuffer_1;return{binding:e,resource:{buffer:r}}};bindTangents=e=>L(e,this.buffers.tangentsBuffer);bindPointsPositions_INITIAL=e=>L(e,this.buffers.initialPointsPositionsBuffer);bindInitialSegmentLengths=e=>L(e,this.buffers.initialSegmentLengthsBuffer);bindHairData=e=>L(e,this.buffers.dataBuffer);bindShading=e=>L(e,this.buffers.shadingBuffer);bindIndexBuffer(e){e.setIndexBuffer(this.buffers.indicesData.indexBuffer,this.buffers.indicesData.indexFormat)}};var Jf=t=>{let e=new Float32Array(t,0,1)[0],n=new Uint32Array(t,4,7);return{version:e,numHairStrands:n[0],numVerticesPerStrand:n[1],offsetVertexPosition:n[2],offsetStrandUV:n[3],offsetVertexUV:n[4],offsetStrandThickness:n[5],offsetVertexColor:n[6]}},ms=(t,e)=>{let n=Jf(t);console.log("Loaded Tfx file with header",n);let i=n.numHairStrands*n.numVerticesPerStrand*4,a=new Float32Array(t,n.offsetVertexPosition,i).map(s=>s*e);return{header:n,vertexPositions:a}};var fr=Ns(hs());var Qf=fr.default?.Mesh||fr.Mesh,gs=t=>Math.ceil(t.vertices.length/3),ed=t=>Math.ceil(t.indices.length/3);function _s(t,e,n,r=1){let i=new Qf(n);rd(i,r);let o=gs(i),a=ed(i),s=Ot(Float32Array,i.vertices),l=Sn(t,`${e}-positions`,s),c=Sn(t,`${e}-normals`,i.vertexNormals),d=Sn(t,`${e}-uvs`,i.textures),f=vn(t,`${e}-indices`,i.indices),m=Ho(s);return console.log(`Loaded OBJ object '${e}', bounds`,m.sphere),{name:e,vertexCount:o,triangleCount:a,positionsBuffer:l,normalsBuffer:c,uvBuffer:d,indexBuffer:f,bounds:m,isColliderPreview:!1}}var td=t=>{if(!t.vertexNormals||!Array.isArray(t.vertexNormals))return!1;let e=t.vertexNormals[0];return typeof e=="number"&&!isNaN(e)},nd=t=>{if(!t.textures||!Array.isArray(t.textures))return!1;let e=t.textures[0];return typeof e=="number"&&!isNaN(e)};function rd(t,e){if(t.vertices=t.vertices.map(n=>n*e),!td(t))throw new Error("Expected normals in the OBJ file");if(nd(t))for(let n=0;n<t.textures.length;n+=1){let r=t.textures[n];r=r%1,r=r<0?1-Math.abs(r):r,r=(n&1)==1?1-r:r,t.textures[n]=r}else{let n=gs(t);t.textures=Ye(n*2).fill(.5)}}var id="r32float";function xs(t,e,n,r){let i={width:n,height:n,depthOrArrayLayers:n},o=t.createTexture({label:`${e}-texture`,dimension:"3d",size:i,format:id,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return t.queue.writeTexture({texture:o},r,{bytesPerRow:Te*n,rowsPerImage:n},i),o}function Ss(t,e){return t.createSampler({label:`${e}-sampler`,addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge",magFilter:"linear",minFilter:"linear"})}function vs(t,e,n){let r=new Uint32Array(n,0,1)[0],i=2,o=new Float32Array(n),a=[[o[i+0],o[i+1],o[i+2]],[o[i+3],o[i+4],o[i+5]]];i+=6;let s=o.slice(i),l=r*r*r;if(s.length!==l)throw new Error(`Invalid SDF binary file. With dims=${r} expected ${l} values. Got ${s.length}.`);let c=xs(t,e,r,s),d=c.createView(),f=Ss(t,e);return new ae(e,a,r,c,d,f)}var od=[{name:"sintel",file:"sintel.obj"},{name:"sintelEyes",file:"sintel-eyes.obj"},{name:"sphereCollider",file:"sphere.obj",isColliderPreview:!0}],bs={name:"sintel-sdf",file:"sintel-sdf.bin"};async function ws(t){let e=[];for(let l of od){console.groupCollapsed(l.name);let c=await u.loaders.textFileReader(`${pn}/${l.file}`),d=_s(t,l.name,c);d.isColliderPreview=!!l.isColliderPreview,e.push(d),console.groupEnd()}K.copy(u.hairSimulation.collisionSphere,u.hairSimulation.collisionSphereInitial);let n=await sd(u.hairFile,1),r=await ad(t,"sintelHair",n);u.pointsPerStrand=r.pointsPerStrand,z.update("Strands",xn(r.strandsCount,1)),z.update("Points per strand",r.pointsPerStrand),z.update("Segments",xn(r.segmentCount,0));let i=await u.loaders.binaryFileReader(`${pn}/${bs.file}`),o=vs(t,bs.name,i),a=new Oe(t,r.bounds.box),s=I.identity();return I.rotateY(s,De(0),s),{objects:e,hairObject:r,sdfCollider:o,modelMatrix:s,physicsGrid:a}}function ad(t,e,n){let r=Lr(n.vertexPositions,4),i={box:r,sphere:Ur(r)};console.log("Hair bounds",i.sphere);let o=oa(t,e,n,i.sphere),a=ca(t,e,n),s=la(t,e,n),l=ia(t,e,n),c=Ra(t,e,n.header.numVerticesPerStrand,n.vertexPositions),d=(b,x=0)=>sa(t,b,n.vertexPositions,x),f=d(`${e}-points-positions-initial`,GPUBufferUsage.COPY_SRC),m=d(`${e}-points-positions-0`),v=d(`${e}-points-positions-1`);return new ur(e,n.header.numHairStrands,n.header.numVerticesPerStrand,i,{dataBuffer:o,indicesData:l,initialPointsPositionsBuffer:f,initialSegmentLengthsBuffer:c,pointsPositionsBuffer_0:m,pointsPositionsBuffer_1:v,shadingBuffer:s,tangentsBuffer:a})}async function sd(t,e=1){console.log(`Loading hair file: '${t}'`);let n=await u.loaders.binaryFileReader(`${pn}/${t}`);return ms(n,e)}var ld=yr.create(),Ps=K.create(),yi=K.create(),cd=I.create(),ys=(t,e,n,r)=>{let i=yr.set(n[0]/t.width,n[1]/t.height,ld);i[0]=i[0]*2-1,i[1]=(1-i[1])*2-1;let o=I.invert(e,cd),a=K.set(i[0],i[1],0,1,Ps),s=K.set(i[0],i[1],1,1,yi),l=Fr(o,a,Ps),c=Fr(o,s,yi);return y.copy(l,r.origin),y.normalize(y.subtract(c,l,yi),r.dir),r},Ti=(t,e,n)=>y.addScaled(t.origin,t.dir,e,n),Ei=(t,e,n)=>{let r=y.subtract(e,t.origin,n),i=y.dot(r,t.dir);return Ti(t,i,n)},ud=y.create(),it=(t,e)=>{let n=Ei(t,e,ud);return y.distance(e,n)},fd=y.create(),dd=y.create(),Ts=(t,e,n,r=5)=>{let i=y.copy(e,fd),o=y.copy(n,dd);for(let l=0;l<r;l++){let c=it(t,i),d=it(t,o);c<d?y.midpoint(i,o,o):y.midpoint(i,o,i)}let a=it(t,i),s=it(t,o);return a<s?i:o};var pd=y.create(),md=(t,e)=>{let n=e.d+y.dot(t.origin,e.normal,pd),r=y.dot(t.dir,e.normal);return-n/r},Es=(t,e,n)=>{let r=md(t,e);return Ti(t,r,n)};var hd=y.create(1,0,0),gd=y.create(0,1,0),_d=y.create(0,0,1),Ii=[hd,gd,_d],xd=[Ee.AXIS_X,Ee.AXIS_Y,Ee.AXIS_Z],Sd=u.colliderGizmo.lineLength*.1,vd=K.create(),bd=K.create(),wd=I.create(),Pd={origin:y.create(),dir:y.create()},Mi=t=>document.body.style.cursor=t;function Ms(){let t=u.colliderGizmo,e=0;return function(n,r,i,o){let a=n.mouse.touching,s=[n.mouse.x,n.mouse.y],l=bn(i,o,wd),c=ys(r,l,s,Pd);if(t.isDragging)yd(c,e);else{let d=y.create(),f=Td(c,d);Ed(f);let m=u.hairSimulation.collisionSphere;e=y.distance(m,d),a&&(a=f!==Ee.NONE,Mi("grabbing"))}return t.isDragging=a,a}}function yd(t,e){let n=u.colliderGizmo,r=u.hairSimulation.collisionSphere,i=n.activeAxis,o={dir:Ii[i],origin:r},a={normal:t.dir,d:-y.dot(t.dir,r)},s=Es(t,a),l=Ei(o,s),c=e;l=y.addScaled(l,o.dir,-c),r[i]=l[i]}function Td(t,e){let{lineWidth:n,hoverPadding:r}=u.colliderGizmo,i=Number.MAX_SAFE_INTEGER,o=0;Ii.forEach((m,v)=>{let[b,x]=Is(m),g=Math.min(it(t,b),it(t,x));g<i&&(i=g,o=v)});let a=Ii[o],[s,l]=Is(a),c=Ts(t,s,l),d=it(t,c),f=n*r;return d<f?(y.copy(c,e),o):Ee.NONE}function Ed(t){t===Ee.NONE?(u.colliderGizmo.activeAxis=Ee.NONE,Mi("default")):(u.colliderGizmo.activeAxis=xd[t],Mi("grab"))}function Is(t){let{lineLength:e}=u.colliderGizmo,n=u.hairSimulation.collisionSphere,r=y.addScaled(n,t,Sd,vd),i=y.addScaled(r,t,e,bd);return[r,i]}function As(t){console.log("Profiler:",t);let e=document.getElementById("profiler-results");e.innerHTML="",st(e.parentNode);let n={},r=new Set;t.forEach(([a,s])=>{let l=n[a]||0;n[a]=l+s,r.add(a)});let i=0;r.forEach(a=>{let s=n[a],l=document.createElement("li");l.innerHTML=`${a}: ${s.toFixed(2)}ms`,e.appendChild(l),i+=s});let o=document.createElement("li");o.innerHTML=`--- TOTAL: ${i.toFixed(2)}ms ---`,e.appendChild(o)}(async function(){globalThis._config=u;let t=await eo();if(!t){dr();return}let e=ds(t);e.startErrorScope("init");let n=navigator.gpu.getPreferredCanvasFormat(),[r,i]=Id("#gpu-canvas",t,n),o=fs(r,i),a=to(window,r),s=await ws(t),l=new gn(t),c=new or(t,o.getViewportSize(),n,l);o.addListener(c.onCanvasResize),us(t,l,s,c.cameraCtrl);let d=Ms();z.show();let f=!1,m=await e.reportErrorScopeAsync();if(m){dr(m);return}if(e.startErrorScope("beforeFirstFrame"),c.beforeFirstFrame(s),m=await e.reportErrorScopeAsync(),m){dr(m);return}let v={label:"main-frame-cmd-buffer"},b=()=>{e.startErrorScope("frame"),z.onEndFrame(),z.onBeginFrame(),l.beginFrame();let g=z.deltaTimeMS*Hi;o.revalidateCanvasSize();let T=a();d(T,o.getViewportSize(),c.viewMatrix,c.projectionMat)||c.updateCamera(g,T);let _=t.createCommandEncoder(v),S=o.getScreenTextureView();c.cmdRender(_,s,S),l.endFrame(_),t.queue.submit([_.finish()]),l.scheduleRaportIfNeededAsync(As),f||(e.reportErrorScopeAsync(x),requestAnimationFrame(b))};requestAnimationFrame(b);function x(g){throw dr(g),f=!0,new Error(g)}})();function Id(t,e,n){let r=document.querySelector(t),i=r.getContext("webgpu");return i.configure({device:e,format:n,alphaMode:"premultiplied"}),[r,i]}function dr(t){_n(document.getElementById("gpu-canvas")),st(document.getElementById("no-webgpu"),"flex"),t&&(document.getElementById("error-msg").textContent=t)}})();
//# sourceMappingURL=index.web.js.map
