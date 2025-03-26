const fileInputCreate = document.getElementById('fileUploadCreate');
fileInputCreate.addEventListener('change', () => {
    loadImage(fileInputCreate, 'fileNameCreate', 'base64Create');
});

const fileLoad = (id) => {
    let fileInput = document.getElementById('fileUploadUpdate' + id);
    let fileName = document.getElementById('fileNameUpdate' + id);
    let base64 = document.getElementById('base64Update' + id);

    fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files.length > 0) {
            // Archivo seleccionado, procede a cargarlo
            loadImage(fileInput, fileName.id, base64.id);
        } else {
            console.error('No file was selected.');
        }
    });
};

const loadImage = (input, fileNameId, base64Id) => {
    const fileNameDisplay = document.getElementById(fileNameId);
    const base64 = document.getElementById(base64Id);
    const file = input.files[0]; // Obtener el archivo seleccionado
    
    if (file) {
        const fileName = file.name;
        fileNameDisplay.textContent = `Archivo seleccionado: ${fileName}`; // Mostrar nombre del archivo
        const reader = new FileReader();
        reader.onload = function () {
            const base64String = reader.result.split(',')[1]; // Obtener la cadena Base64
            base64.value = 'data:image/webp;base64,' + base64String; // Asignar el Base64 al input oculto
        };
        reader.onerror = function (error) {
            console.error('Error al leer el archivo:', error);
        };
        reader.readAsDataURL(file); // Leer el archivo como Data URL
    } else {
        fileNameDisplay.textContent = 'No se ha seleccionado ningún archivo.'; // Mensaje si no hay archivo
    }
};