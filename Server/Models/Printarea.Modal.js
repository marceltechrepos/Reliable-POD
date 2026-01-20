import mongoose from "mongoose";

// const cornerSchema = new mongoose.Schema({
//     x: { type: Number, required: true },
//     y: { type: Number, required: true }
// }, { _id: false });

// const printAreaSchema = new mongoose.Schema({
//     border: { type: Boolean, default: false },
//     corners: { type: [cornerSchema], required: true },
//     enablePerspective: { type: Boolean, default: false },
//     fit: { type: String, enum: ["cover", "contain", "fill"], default: "cover" },
//     hasImage: { type: Boolean, default: false },
//     height: { type: Number, required: true },
//     id: { type: String, required: true, unique: true },
//     productId: { type: String, required: true },
//     imageSrc: { type: String, default: null },
//     locked: { type: Boolean, default: false },
//     name: { type: String, required: true },
//     opacity: { type: Number, default: 1 },
//     perspective: { type: Number, default: 0 },
//     rotateX: { type: Number, default: 0 },
//     rotateY: { type: Number, default: 0 },
//     rotateZ: { type: Number, default: 0 },
//     rotation: { type: Number, default: 0 },
//     skewX: { type: Number, default: 0 },
//     skewY: { type: Number, default: 0 },
//     transformOrigin: { type: String, default: "center center" },
//     type: { type: String, default: "printarea" },
//     visible: { type: Boolean, default: true },
//     width: { type: Number, required: true },
//     x: { type: Number, default: 0 },
//     y: { type: Number, default: 0 },
//     _naturalHeight: { type: Number, default: null },
//     _naturalWidth: { type: Number, default: null }
// }, { timestamps: true });

// export default mongoose.model("PrintArea", printAreaSchema);



const baseLayerSchema = new mongoose.Schema({
  id: { type: String, required: true},
  type: { type: String, }, // background / printarea / text
  width: Number,
  height: Number,
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  rotation: { type: Number, default: 0 },
  opacity: { type: Number, default: 1 },
  locked: { type: Boolean, default: false },
  productId: { type: String,  },
  visible: { type: Boolean, default: true },
}, { timestamps: true, discriminatorKey: "type" });

export const Layer = mongoose.model("Layer", baseLayerSchema);


const cornerSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true }
}, { _id: false });

export const PrintAreaLayer = Layer.discriminator("printarea",
  new mongoose.Schema({
    border: { type: Boolean, default: false },
    corners: { type: [cornerSchema], default: [] },
    enablePerspective: { type: Boolean, default: false },
    fit: { type: String, enum: ["cover", "contain", "fill"], default: "cover" },
    hasImage: { type: Boolean, default: false },
    imageSrc: { type: String, default: null },
    name: { type: String, required: true },
    perspective: { type: Number, default: 0 },
    rotateX: { type: Number, default: 0 },
    rotateY: { type: Number, default: 0 },
    rotateZ: { type: Number, default: 0 },
    skewX: { type: Number, default: 0 },
    skewY: { type: Number, default: 0 },
    transformOrigin: { type: String, default: "center center" },
    _naturalHeight: { type: Number },
    _naturalWidth: { type: Number },
    productId: { type: String, required: true }
  })
);


export const BackgroundLayer = Layer.discriminator("background",
  new mongoose.Schema({
    src: { type: String, required: true },
    _naturalWidth: Number,
    _naturalHeight: Number,
  })
);

export const ImageLayer = Layer.discriminator("image",
  new mongoose.Schema({
    src: { type: String, required: true },
    naturalWidth: Number,
    naturalHeight: Number,
    scaleX: { type: Number, default: 1 },
    scaleY: { type: Number, default: 1 },
    flipX: { type: Boolean, default: false },
    flipY: { type: Boolean, default: false },
    productId: { type: String, required: true }
  })
);

export const TextLayer = Layer.discriminator("text",
  new mongoose.Schema({
    text: { type: String, default: "" },
    fontSize: { type: Number, default: 16 },
    color: { type: String, default: "#000000" },
    name: { type: String, default: "" },
    productId: { type: String, required: true }
  })
);
