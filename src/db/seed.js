import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { Community } from "../models/community.model.js";
import { Comment } from "../models/comment.model.js"; // Added Comment Model
import dotenv from "dotenv";
import connectDB from "./index.js";

dotenv.config({ path: "./.env" });

// A list of reliable sample video URLs for variety
const sampleVideos = [
    "https://res.cloudinary.com/demo/video/upload/dog.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
];

const seedData = async () => {
    try {
        await connectDB();

        console.log("Cleaning database...");
        await User.deleteMany({});
        await Video.deleteMany({});
        await Community.deleteMany({});
        await Comment.deleteMany({}); // Clear comments too

        // 1. Create Dummy Users
        console.log("Seeding users...");
        const users = [];
        for (let i = 0; i < 10; i++) {
            users.push({
                username: faker.internet.username().toLowerCase(),
                email: faker.internet.email().toLowerCase(),
                fullName: faker.person.fullName(),
                avatar: `https://i.pravatar.cc/150?u=${faker.string.uuid()}`, // Better avatar service
                coverImage: `https://picsum.photos/seed/${faker.string.uuid()}/1200/400`,
                password: "password123", 
            });
        }
        const createdUsers = await User.insertMany(users);

        // 2. Create Dummy Videos
        console.log("Seeding videos...");
        const videos = [];
        for (let i = 0; i < 20; i++) {
            const randomOwner = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            const randomVideo = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
            
            videos.push({
                videoFile: randomVideo,
                thumbnail: `https://picsum.photos/seed/${faker.string.uuid()}/640/480`,
                title: faker.lorem.sentence(5),
                description: faker.lorem.paragraph(),
                duration: faker.number.int({ min: 60, max: 600 }),
                views: faker.number.int({ min: 0, max: 10000 }),
                isPublished: true,
                owner: randomOwner._id,
            });
        }
        const createdVideos = await Video.insertMany(videos);

        // 3. Create Dummy Comments for each video
        console.log("Seeding comments...");
        const comments = [];
        createdVideos.forEach((video) => {
            const numComments = faker.number.int({ min: 2, max: 6 });
            for (let j = 0; j < numComments; j++) {
                const randomCommenter = createdUsers[Math.floor(Math.random() * createdUsers.length)];
                comments.push({
                    content: faker.lorem.sentence(),
                    video: video._id,
                    owner: randomCommenter._id,
                });
            }
        });
        await Comment.insertMany(comments);

        // 4. Create Community Posts
        console.log("Seeding community posts...");
        const posts = [];
        for (let i = 0; i < 15; i++) {
            const randomOwner = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            posts.push({
                content: faker.lorem.sentences(2),
                owner: randomOwner._id,
            });
        }
        await Community.insertMany(posts);

        console.log("✅ Database Seeded with Videos and Comments!");
        process.exit();
    } catch (error) {
        console.error("❌ Seed Error:", error);
        process.exit(1);
    }
};

seedData();