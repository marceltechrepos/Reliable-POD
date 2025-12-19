import { model, Schema } from "mongoose";

const ProviderSchema = new Schema({
    provider: { type: String, required: true },
});

const Provider = model("Provider", ProviderSchema);
export default Provider;