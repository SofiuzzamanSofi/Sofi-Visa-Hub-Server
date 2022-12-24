const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require("colors");
require('dotenv').config();


//middleware -------
app.use(cors());
app.use(express.json());


// mongodb -----
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { userInfo } = require('os');
const uri = `mongodb+srv://${process.env.VISA_USER}:${process.env.VISA_SECRET}@cluster0.zwgt8km.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    const database = client.db("sofi-visa-hub-server");
    const servicesCollection = database.collection("services");
    const commentCollection = database.collection("allComment");
    // console.log(servicesCollection);

    try {

        app.get("/", (req, res) => {
            res.send("Bismillahir Rahmainr Rahim, from:- Sofi Visa Hub, SERVER-SIDE");
        });


        // service by pagination and all services  ---------------
        app.get("/services", async (req, res) => {
            const pageNo = parseInt(req?.query?.pageNo);
            const perPageContentSize = parseInt(req?.query?.perPageContentSize);
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.skip(pageNo * perPageContentSize).limit(perPageContentSize).toArray();
            const count = await servicesCollection.countDocuments();
            res.send({
                success: true,
                message: "Successfully got services data",
                count: count,
                data: services
            });
        });


        // service details by id-------------------------
        app.get("/service/:id", async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) }
            // const { id } = req.params;
            // const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send({
                success: true,
                message: "Successfully got the service by id",
                data: service
            });
        });


        // add comment / post methods------------------
        app.post("/comment/:id", async (req, res) => {
            const { id } = req.params;
            const comment = req.body;
            // console.log(id, comment.serviceName);
            // const commentCollection = database.collection(comment?.serviceName);
            const result = await commentCollection.insertOne(comment);
            res.send({
                success: true,
                message: "Successfully got the service by id",
                data: result
            });
        });


        // get all comments by service to service sections --------------
        app.get("/comment/:id", async (req, res) => {
            const { id } = req.params;
            console.log(id);
            console.log("query, is it");
            // const query = { _id: ObjectId(id) }
            // const service = await servicesCollection.findOne(query);
            // const serviceName = service?.name;
            // console.log(serviceName);
            // const commentCollection = database.collection(serviceName);
            const commentQuery = { serviceId: id };
            const cursor = commentCollection.find(commentQuery);
            const allComments = await cursor.toArray();
            // console.log(services);
            res.send({
                success: true,
                message: "Successfully got the service by id",
                data: allComments
            });
        });


        // get all comments by by users --------------
        app.get("/commentsbyuser", async (req, res) => {
            const email = req?.query?.email;
            // console.log(email);
            // let query = { userInfl: { email: email } };
            // console.log(query);
            const cursor = commentCollection.find({
                userInfl: { $elemMatch: { email: email } }
            });
            // console.log(cursor);
            const comments = await cursor.toArray();
            // console.log(comments)
            res.send({
                success: true,
                message: "Successfully got the service by id",
                data: comments
            });
        });



        // edit review / comments from my review section------
        app.put("/commentsbyuser/:id", async (req, res) => {
            const id = req.params.id;
            const currentComment = req.body.currentComment;
            const query = { _id: ObjectId(id) };
            console.log(currentComment, id)
            const updateDoc = {
                $set: {
                    commentText: currentComment
                }
            };
            const result = await commentCollection.updateOne(query, updateDoc);
            if (result?.modifiedCount) {
                res.send({
                    success: true,
                    message: "Approved success",
                    data: result
                })
            }
            else {
                res.send({
                    success: true,
                    message: "Approved not success",
                    data: result
                })
            };
        })



        // delete review / comments from my review section------
        app.delete("/commentsbyuser/:id", async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            console.log(query);
            const result = await commentCollection.deleteOne(query);
            res.send({
                success: true,
                message: "successfully delete this services",
                data: result
            });
        });


        // add services by email -------------
        // add comment / post methods------------------
        app.post("/addservice/:id", async (req, res) => {
            const { id } = req.params;
            const email = req.body.email;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query);
            const addServiceCollection = database.collection(email)
            const addServiceData = await addServiceCollection.insertOne(service);
            res.send({
                success: true,
                message: "Successfully got the service by id",
                data: addServiceData
            });
        });

    }
    catch (error) {
        console.log(`error from under function try> catch ${error}`);
        res.send({
            success: false,
            error: error?.message || "error from try> catch "
        })
    };
};

run().catch(error => console.log(`error from run function catch: ${error}`.bgYellow))



app.listen(port, () => {
    console.log(`Sofi Visa Hub Server Runnig on Port:${port}.`.bgCyan)
})