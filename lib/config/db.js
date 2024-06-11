import mongoose from "mongoose"

export const ConnectDB = async () => {
    await mongoose.connect('mongodb+srv://<username>:<password>.mongodb.net/todo-app');
    console.log("DB Connected");
}