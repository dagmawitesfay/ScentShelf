
const express = require("express")

const app = express()

const mongoose = require("mongoose") 

const{ObjectId} =require("mongodb") // works with id 
 
const PORT = 8001

require("dotenv").config()
app.use(express.json()) 
app.use(express.static('public')) 
app.set("view engine","ejs") 
app.use(express.urlencoded({extended:true}))

// get list fo all perfumes sorted by rating
app.get("/",async(req,res)=>{
    try{
        const perfumes = await mongoose.connection.db.collection("ScentShelf")
        .find().sort({rating:-1}).toArray()
        res.render("scent.ejs",{
            perfumes : perfumes
        })
    } catch(err){
        console.log(err)
        res.status(500).json({error:"Server Error"})
    }
})

app.post("/perfume",async(req,res)=>{
    console.log(req)
    try{
    // get the form values
    const {image,name,notes,season,rating,brand} = req.body
   

    // convert the  notes string into an array and remove fasly such as empty string
    const arrayNotes = notes.replace("and",",").split(",").map(note=>note.trim()).filter(Boolean)
     console.log(typeof notes, typeof arrayNotes)

    // create a payload
    const perfumeData = {
        image,
        name,
        notes : arrayNotes  , 
        season, 
        rating,brand
    } 
    await mongoose.connection.db.collection("ScentShelf").insertOne(perfumeData)
    res.redirect("/")
} catch(error){
    res.status(500).send("Server Error")
} 
})

app.delete("/perfume",async(req,res)=>{
    try{
        await mongoose.connection.db.collection("ScentShelf").findOneAndDelete({
            _id: new ObjectId(req.body.id)
        })

        res.status(204).end()
    } catch(err) {
        res.status(500).send("Server Error")
    }
})

// Connections
 mongoose.connect(process.env.MONGODB_CONNECTIION,{
 }).then(()=>{
    console.log("Connected to the MongodDB")
    app.listen(PORT,()=>console.log("Connected to port", PORT))
 }) .catch(err=>console.log("Error connecting to the database",err))

