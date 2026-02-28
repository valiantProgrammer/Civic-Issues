import mongoose from "mongoose";
import { connectToDatabase } from "../lib/db.js";

const OtherMunicipalDataSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
    }
}, { _id: false });


const MunicipalitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Municipality name is required.'],
        unique: true,
        trim: true,
    },
    fileName: {
        type: String,
        required: [true, 'GeoJSON filename is required.'],
        trim: true,
    },
    municipalId: {
        type: String,
    },
    lastAssignedId: {
        type: Number,
    },
    other_municipal_data: OtherMunicipalDataSchema
}, {
    collection: "municipals",
    timestamps: true,
});


MunicipalitySchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastMunicipality = await this.constructor.findOne({}, {}, { sort: { 'municipalId': -1 } });
        
        let nextId;
        if (lastMunicipality && lastMunicipality.municipalId) {
            nextId = lastMunicipality.municipalId + 10000000; 
        } else {
            nextId = 111110000000;
        }

        this.municipalId = nextId;
        this.lastAssignedId = nextId;
    }
    next();
});


export async function getMunicipalityModel() {
    const conn = await connectToDatabase("municipalities");
    return conn.models.Municipality || conn.model("Municipality", MunicipalitySchema);
}