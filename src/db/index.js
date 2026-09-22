const mongoodb = require("mongoose");
const mysql = require("mysql2");
const { Sequelize } = require("sequelize");
 
// two db --> mongo | Mysql 


// Main function to call db base on type of db
exports.ConnectDataBase = async () => {
    const type = process.env.DB_TYPE;
    if (type === "mongo") {
        await exports.connectMONGODB();
    } else if (type === "Mysql") {
        await exports.connectMySQL();
    } else if(type === "postgres"){
        await exports.connectPostgressSql()
    }else {
        console.error("❌ Invalid DB_TYPE. Check your .env file.");
    }
};
// Main function to call db base on type of db




// ----------------- MONGODB CONNECTION -----------------//
exports.connectMONGODB = async () => {
  try {
    await mongoodb
      .connect(process.env.MONGO_URL)
      .then(() => console.log("Database Connected successfully.."))
      .catch((err) => console.log(err));
    process.exit(1);
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      success: false,
      message: error?.message || "Mongoodb error when try to conncet to db",
    };
  }
};
// ----------------- MONGODB CONNECTION -----------------//

// ----------------- My SQL CONNECTION -----------------//


// note : if we used sequelize cli for mysql so dont need to export this controller , for that we used config file in that we mention all things
exports.connectMySQL = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port : process.env.DB_PORT
    });

    console.log("MySQL connected successfully...");
    return connection;
  } catch (error) {
    console.error("MySQL connection error:", error.message);
    process.exit(1);
  }
};
// ----------------- My SQL CONNECTION -----------------//


// ----------------- Postgres CONNECTION -----------------//


exports.connectPostgressSql = async () => {
    try { 
        const sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT || 5432,
                dialect: "postgres",
                logging: false,
            }
        );
 
        await sequelize.authenticate();
        console.log("PostgreSQL connected successfully");
    } catch (error) {
        console.error("PostgreSQL connection failed:", error.message);
        process.exit(1);
    }
}

