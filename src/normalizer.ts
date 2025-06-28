import axios from "axios";
import { NormalizedUserRecord, UserRecord } from "./userSchema.js";
import { legacyRecordValidation } from "./validator.js";

export async function normalize(): Promise<UserRecord> {
    const url = `https://us-central1-txtsmarter-dev.cloudfunctions.net/codeassessment/user`;
    const options = {
        url,
        headers: {
            "Authorization": `Bearer ${process.env.AUTH_TOKEN}`,
        }
    }
    const response = await axios(options);
    const legacyData = response.data;

    console.log("Original Record", legacyData);

    // Validate received message
    const initValidation = legacyRecordValidation(legacyData);
    if (!initValidation.success) {
        console.log("Record is not in expected format, initiating normalization ,fixing following issues... ", initValidation.error.message);
    }

    // Normalize and validate again
    const normalizedRecord = NormalizedUserRecord.parse(legacyData);

    const validationResult = legacyRecordValidation(normalizedRecord);

    if (validationResult.success) {
        console.log("Got a valid record after normalization, returning result");
        return normalizedRecord;
    }

    throw new Error(validationResult.error.message);
}