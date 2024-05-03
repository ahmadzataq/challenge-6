require('dotenv').config();
const express = require('express');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()
const router = express.Router();
const bcrypt = require('bcrypt')
const imagekit = require('../libs/imagekit');
const { artimg } = require('../libs/multer');

// upload an art
router.post('/art/upload', artimg.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
    }
    try {
        const { title, description } = req.body;
        const uploadResponse = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
        });

        const newArt = await prisma.art.create({
            data: {
                title,
                description,
                imageUrl: uploadResponse.url,
            },
        });

        res.json(newArt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get all art
router.get('/art', async (req, res) => {
    try {
        const arts = await prisma.art.findMany();
        res.json(arts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get art by ID
router.get('/art/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const art = await prisma.art.findUnique({
            where: { id: parseInt(id) },
        });
        if (art) {
            res.json(art);
        } else {
            res.status(404).json({ message: "Art not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// delete an art
router.delete('/art/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.art.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// update art title n desc
router.put('/art/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const updatedArt = await prisma.art.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
            },
        });
        res.json(updatedArt);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;