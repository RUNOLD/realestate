console.log("Node Version:", process.version);
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    console.log("DATABASE_URL starts with:", process.env.DATABASE_URL.substring(0, 10) + "...");
}
console.log("DIRECT_URL exists:", !!process.env.DIRECT_URL);
