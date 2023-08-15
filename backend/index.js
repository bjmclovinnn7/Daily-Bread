const express = require("express")
const app = express()
const PORT = 8080
const mysql = require("mysql2")
const cors = require("cors")
const { error } = require("console")

app.use(cors())

const pool = mysql.createPool({
  host: "127.0.0.1",
  port: 3000,
  user: "root",
  password: "Thepatriot7!!!!!",
  database: "bible",
})

//app.get('/', (req, res) => {
//serve the static react on development
//})

app.get("/random", (req, res) => {
  pool.query(
    "SELECT name, chapter, versecount, verse FROM entire ORDER BY RAND() LIMIT 2;",
    (error, results, fields) => {
      if (error) {
        console.error(error)
        // Handle query error
      } else {
        // Process query results
        res.send(results[0]) // Send each object individually
      }
    }
  )

  app.get("/popular", (req, res) => {
    pool.query(
      "SELECT name, chapter, versecount, verse FROM entire WHERE popular = 1 ORDER BY RAND() LIMIT 1;",
      (error, results, fields) => {
        if (error) {
          console.error(error)
        } else {
          res.send(results[0])
        }
      }
    )
  })

  app.get("/search", (req, res) => {
    const { name, chapter, versecount } = req.query

    // Modify the table name and column names based on your database schema
    const query =
      "SELECT * FROM entire WHERE name = ? AND chapter = ? AND versecount = ?"

    pool.query(query, [name, chapter, versecount], (error, results) => {
      if (error) {
        console.error("Error executing query:", error)
        res.status(500).json({ error: "Internal Server Error" })
        return
      }

      if (results.length > 0) {
        const verse = results[0] // Assuming only one verse is returned
        res.status(200).json(verse)
      } else {
        res.status(404).json({ error: "Verse not found" })
      }
    })
  })
})

app.listen(PORT, () =>
  console.log(`It's all good on http://localhost:${PORT}/popular`)
)
