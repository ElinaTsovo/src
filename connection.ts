import  mongoose from 'mongoose'

const url = process.env.DB_LINK!
export const connectioDB = async () =>{
    try {
        await mongoose.connect(url)
        console.log('DataBase connected')
    } catch (error) {
        console.log(error)
        
    }
}

