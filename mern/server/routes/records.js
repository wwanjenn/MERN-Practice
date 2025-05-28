import express from "express";

import db from "../db/connection.js";

import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res)=>{
    let collection = await db.collection("records");
    let result = await collection.find({}).toArray()
    res.send(result).status(200);
}) 

router.get("/:id", async (req, res) => {
    let collection = await db.collection("records");
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.findOne(query);

    if (!result) res.send("Not Found").status(404);
    else res.status(200).send(result);
})

router.post("/", async (req, res) => {
    try {
        let newDocument = {
            name: req.body.name,
            position: req.body.position,
            level: req.body.level,
        };
        let collection = await db.collection("records");
        let result = await collection .insertOne(newDocument);
        res.status(201).send(result);
    } catch(err) {
        console.error(err);
        res.status(500).send("Error adding Record");    
    }
        
});

router.patch("/:id", async(req, res) =>{
    try {
        const query = { _id: new ObjectId(req.params.id)};
        const updates = {
            $set: {
                name: req.body.name,
                position: req.body.position,
                level: req.body.level,
            },
        };
        let collection = await db.collection("records");
        let result = await collection.updateOne(query, updates);
        res.status(200).send(result)
    } catch (err) {
        console.error(err)
        res.status(500).send("Error updating record");
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const query = {
            _id: new ObjectId(req.params.id)
        };
        const collection = await db.collection("records");
        
        let result = await collection.deleteOne(query);
        res.status(200).send(result);
    } catch (err) {
        console.error(err)
        res.status(500).send("Error deleting record");
    };
});

export default router;