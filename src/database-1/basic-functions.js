
import mysql from "mysql"
import fs from "fs"

import MySQLConfig from "./mysql-config.js"

// var connectionPool
var connection = null
// connect to mysql
function connectMySQL() {
	return new Promise((resolve, reject) => {
		if (!connection) {
			connection = mysql.createConnection({
				host: MySQLConfig.mysql_url,
				user: MySQLConfig.user,
				password: MySQLConfig.password,
				database: MySQLConfig.database,
				ssl: {
					ca: fs.readFileSync(MySQLConfig.access_private_key)
				}
			})
			connection.connect((err) => {
				if (err) {
					return reject(new Error("ErrorWhenConnectMySQL"))
				}
				resolve(connection)
			})
		}
		else {
			resolve(connection)
		}
	})
}



// Query from database
function insertRowsIntoTable(table, data) {
	return new Promise((resolve, reject) => {
		connectMySQL()
		.then((connection)=>{
			connection.query("INSERT INTO " + table + " SET ?", data, (err, result) => {
				// connection.release()
				if (err) {
					return reject(new Error("ErrorWhenInsertIntoDB"))
				}
				console.log(result.insertId)
				resolve(result)
			})
		})
		.catch((err)=>{
			console.log(err.message)
			return reject(err)
		})
		// connectMySQL((err, connection) => {
		// 	if (err) {
		// 		console.log("There is an error while getting connction from connection pool.")
		// 		throw err
		// 	}
			

		// })
	})


}


function executeQuery(query) {

	return new Promise((resolve,reject)=>{
		connectMySQL()
			.then((connection)=>{
				connection.query(query, (err, rows, fields) => {
					closeMySQL()
					// connection.release()
					if (err) {
						console.log("error while querying from database: " + query)
						return reject(err)
					}

					resolve({rows:rows,feilds:fields})
				})
			})
			.catch((err)=>{
				return reject(err)
			})
		
	})
	
}

// close 
function closeMySQL() {
	return new Promise((resolve,reject)=>{
		if (connection) {
			connection.end((err) => {
				if (err) {
					console.log("There is an error while closing connection.")
					return reject(err)
				}
				connection = null
				console.log("Closing connection")
				resolve()
			})
		}
	})
	

}

export { connectMySQL, closeMySQL, executeQuery, insertRowsIntoTable }