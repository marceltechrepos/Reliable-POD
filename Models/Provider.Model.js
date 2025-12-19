import { Schema } from "mongoose";

const ProviderSchema = new Schema({
    provider: { type: String, required: true },
});

const Provider = mongoose.model("Provider", ProviderSchema);
export default Provider;