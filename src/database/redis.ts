import * as redis from "redis";

// TODO: for test is  OK ,  better to use redis factorial pattern

export const redisClient = redis.createClient("redis://localhost:6379");
redisClient.on("connect", () => {
    console.log("Redis connected.");
});
