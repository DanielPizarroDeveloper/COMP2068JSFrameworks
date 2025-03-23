document.addEventListener('DOMContentLoaded', () => {
    const radios = document.querySelectorAll('input[name="option"]');
    const createElement = document.getElementById('createSection');
    const updateElement = document.getElementById('updateSection');
    const deleteElement = document.getElementById('deleteSection');
    
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'create') {
                createElement.classList.remove('hidden');
                updateElement.classList.add('hidden');
                deleteElement.classList.add('hidden');
            } else if (radio.value === 'update') {
                createElement.classList.add('hidden');
                updateElement.classList.remove('hidden');
                deleteElement.classList.add('hidden');
            }
            else if (radio.value === 'delete'){
                createElement.classList.add('hidden');
                updateElement.classList.add('hidden');
                deleteElement.classList.remove('hidden');
            }
        });
    });
});