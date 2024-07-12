import { MongoClient } from 'mongodb';


export const client = new MongoClient('mongodb+srv://alexandrufiodor95:qwe123@cluster0.9ypc02u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

export const runDB = async () => {
  try {
    await client.connect();
    await client.db("home_work").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.log('DB error', error);
    await client.close();
  }
}

export const clientDB = client.db("home_work");
