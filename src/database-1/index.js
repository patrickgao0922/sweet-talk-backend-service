import { createMySQLConnectionPool, closeMySQL, executeQuery } from "./basic-functions.js"


let table_device_info_aok = "device_info_aok"
function queryAOKDeviceInforFromDB(type,mac) {
	return new Promise((resolve, reject) => {
		// let sql = "select laravel_device.username, laravel_user_mqtt_password.other_encrypt_password, laravel_user_mqtt_password.other_encrypt_password_iv from laravel_device join device_info_aok on laravel_device.id = device_info_aok.device_id join laravel_user_mqtt_password on laravel_device.username = laravel_user_mqtt_password.username where device_info_aok.mac_address = " + "'" + mac + "'"
		let sql = "select laravel_device.username from device_info_aok join laravel_device on device_info_aok.device_id = laravel_device.id where device_info_aok.mac_address = " + "'" + mac + "'"
		executeQuery(sql).then((result) => {
			resolve(result.rows[0])
		})
		.catch((error) => {
			reject(error)
		})
	})

}

export {queryAOKDeviceInforFromDB}