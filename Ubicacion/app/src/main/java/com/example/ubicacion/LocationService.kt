package com.example.ubicacion

import android.app.Service
import android.content.Intent
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.IBinder
import android.os.Bundle
import androidx.core.app.ActivityCompat
import android.Manifest
import android.content.pm.PackageManager
import android.util.Log

class LocationService : Service() {

    private lateinit var locationManager: LocationManager
    private lateinit var locationListener: LocationListener

    override fun onCreate() {
        super.onCreate()
        locationManager = getSystemService(LOCATION_SERVICE) as LocationManager

        locationListener = object : LocationListener {
            override fun onLocationChanged(location: Location) {
                val latitud = location.latitude
                val longitud = location.longitude
                Log.d("LocationService", "Ubicación obtenida: Latitud: $latitud, Longitud: $longitud")
                enviarUbicacion(latitud, longitud)
            }

            override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
            override fun onProviderEnabled(provider: String) {}
            override fun onProviderDisabled(provider: String) {}
        }

        // Solicita actualizaciones de ubicación
        startLocationUpdates()
    }

    private fun startLocationUpdates() {
        // Verifica permisos antes de solicitar actualizaciones
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return
        }
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 5000, 0f, locationListener)
        locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 5000, 0f, locationListener)
    }

    private fun enviarUbicacion(latitud: Double, longitud: Double) {
        Thread {
            Log.i("LocationService", "Enviando ubicación: Latitud: $latitud, Longitud: $longitud")
            // Aquí va la lógica para enviar la ubicación al servidor
        }.start()
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null // No se necesita enlazar el servicio
    }

    override fun onDestroy() {
        super.onDestroy()
        locationManager.removeUpdates(locationListener) // Detiene las actualizaciones de ubicación
    }
}
