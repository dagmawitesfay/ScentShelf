
const express = require("express")

const app = express()

const mongoose = require("mongoose") 

const{ObjectId} =require("mongodb") // works with id 
 
const PORT = process.env.PORT || 3000;

require("dotenv").config()
app.use(express.json()) 
app.use(express.static('public')) 
app.set("view engine","ejs") 
app.use(express.urlencoded({extended:true}))

const convertedNotes = notes => notes.replace("and",",").split(",").map(note=>note.trim()).filter(Boolean)

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

// edit route for the edit form
app.get("/perfume/:id/edit",async(req,res)=>{
    try{
    const perfume = await mongoose.connection.db.collection("ScentShelf").findOne({_id:new ObjectId(req.params.id)}) // oen car document where the IRL matched the ID
if(!perfume) return res.redirect("/")
    res.render("edit.ejs",{perfume}) // render the edit form

    } catch(err){
        console.error("Error loading perfume for editing", err)
        res.status(500).send("Unable to load perfume for editing")
    }
})

app.post("/perfume/:id/edit",async(req,res)=>{
    try{
   const {image,name,notes,season,rating,brand} = req.body
   await mongoose.connection.db.collection("ScentShelf").updateOne(
        {_id: new ObjectId(req.params.id) } , // find this document
        { $set : {image,name,notes:convertedNotes(notes),season,rating,brand} // update these properties of the document

    })
       res.redirect("/"); // list of all perfumes
    } catch(err){
     console.log(err)
    res.status(500).send("Couldnt save chnages")
    }
})
app.post("/perfume",async(req,res)=>{
    console.log(req)
    try{
    // get the form values
    const {image,name,notes,season,rating,brand} = req.body
   

    // convert the  notes string into an array and remove fasly such as empty string
    const arrayNotes = convertedNotes(notes)
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
