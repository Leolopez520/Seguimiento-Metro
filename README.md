# Instrucciones para configurar el entorno, este entorno debe ser personal, se debe de crear en una carpeta externa a la del proyecto.

1. **Crear un entorno virtual**. Esto se puede hacer con los siguientes comandos:
   ```bash
   pip install virtualenv
   virtualenv venv

2. Activar el entorno virtual:
   ```python
   #En windows:
   venv\Scripts\activate
   #En linux:
   source venv/bin/activate

3. Instalar dependencias:
   Una vez activado el entorno virtual, moverse entre carpeta hasta llegar a la carpeta donde se encuentra el archivo "requirements.txt" y ejecutar el siguiente comando:
   ```bash
   pip install -r requirements.txt
  El archivo requirements.txt ya se encuentra dentro de este repositorio. Recuerden que el entorno virtual es personal, así que no lo suban al repositorio para evitar problemas.
   
 
