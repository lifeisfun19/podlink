// test-connection.js
import mongoose from 'mongoose';

const uri = 'mongodb+srv://riyakaushik1910:q9AJf7SvOwr3MKce@cluster0.0e0mvq3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(uri)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ Connection failed:', err));
