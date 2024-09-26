package com.example.ubicacion

import android.content.Context
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.Manifest
import android.app.Activity
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import java.net.HttpURLConnection
import java.net.URL
import android.view.WindowManager
import android.content.Intent

class MainActivity : AppCompatActivity() {

    private lateinit var texto: TextView
    private lateinit var locationManager: LocationManager
    private lateinit var locationListener: LocationListener

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        texto = findViewById(R.id.textViewUbicacion)
        val botonComprobar = findViewById<Button>(R.id.buttonComprobar)
        botonComprobar.setOnClickListener { checarPermisos() }

        locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
        locationListener = object : LocationListener {
            override fun onLocationChanged(location: Location) {
                val latitud = location.latitude
                val longitud = location.longitude
                texto.text = "Ubicación actual:\nLatitud: $latitud\nLongitud: $longitud"
                enviarUbicacion(latitud, longitud)
            }

            override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
            override fun onProviderEnabled(provider: String) {}
            override fun onProviderDisabled(provider: String) {
                texto.text = "Proveedor de ubicación deshabilitado."
            }
        }
    }

    private fun checarPermisos() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            pedirPermisoUbicacion()
        } else {
            actualizaTexyView()
        }
    }

    private fun pedirPermisoUbicacion() {
        if (ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.ACCESS_FINE_LOCATION)) {
            Toast.makeText(this, "Permisos rechazados", Toast.LENGTH_SHORT).show()
        } else {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.ACCESS_FINE_LOCATION), 1)
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == 1) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                actualizaTexyView()
            } else {
                Toast.makeText(this, "Permisos rechazados por primera vez", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onResume() {
        super.onResume()
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
    }

    override fun onPause() {
        super.onPause()
        window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
    }

    private fun actualizaTexyView() {
        texto.text = "Obteniendo ubicación..."

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            Toast.makeText(this, "Permisos de ubicación no otorgados", Toast.LENGTH_SHORT).show()
            return
        }

        // Inicia el servicio para obtener actualizaciones de ubicación
        val intent = Intent(this, LocationService::class.java)
        startService(intent)

        // Solicitar actualizaciones de ubicación de GPS y red
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 5000, 0f, locationListener)
        locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 5000, 0f, locationListener)
    }

    private fun enviarUbicacion(latitud: Double, longitud: Double) {
        Thread {
            var urlConnection: HttpURLConnection? = null
            try {
                val url = URL("http://20.163.180.10:5000/ubicacion")
                urlConnection = url.openConnection() as HttpURLConnection
                urlConnection.requestMethod = "POST"
                urlConnection.setRequestProperty("Content-Type", "application/json")
                urlConnection.doOutput = true

                val jsonInputString = "{\"latitud\": $latitud, \"longitud\": $longitud}"

                urlConnection.outputStream.use { outputStream ->
                    outputStream.write(jsonInputString.toByteArray())
                }

                val responseCode = urlConnection.responseCode
                Log.i("Ubicacion", "Código de respuesta: $responseCode")

                if (responseCode == HttpURLConnection.HTTP_OK) {
                    Log.i("Ubicacion", "Ubicación enviada exitosamente.")
                } else {
                    Log.e("Ubicacion", "Error al enviar ubicación: $responseCode")
                }
            } catch (e: Exception) {
                Log.e("Ubicacion", "Error: ${e.message}")
            } finally {
                urlConnection?.disconnect()
            }
        }.start()
    }
}
