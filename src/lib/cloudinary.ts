import { v2 as cloudinary } from "cloudinary";

import config from "../app/config";
import AppError from "../app/errors/appError";

const { cloudName, apiKey, apiSecret } = config.cloudinary;

const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });
}

export const getCloudinary = () => {
    if (!isCloudinaryConfigured) {
        throw new AppError(503, "Cloudinary is not configured. Set CLOUDINARY_* env vars.");
    }
    return cloudinary;
};

export { cloudinary };