document.addEventListener("DOMContentLoaded", async function() {

    /*************** Récupération de données ***********/
    try {
        const reponseworks = await fetch('http://localhost:5678/api/works');
        if (!reponseworks.ok) {
            throw new Error(`Erreur HTTP: ${reponseworks.status}`);
        }
        var works = await reponseworks.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des travaux:', error);
        alert('Erreur lors de la récupération des travaux');
        return; // Arrête l'exécution si une erreur survient
    }

    /*********************** Gallery **********************/
    function affichageworks(works, gallerySelector) {
        const gallery = document.querySelector(gallerySelector);
        gallery.innerHTML = ""; 

        for (let i = 0; i < works.length; i++) {
            const cadrephoto = document.createElement('figure');
            const titrephoto = document.createElement('figcaption');
            const worksphoto = document.createElement('img');
            worksphoto.src = works[i].imageUrl;
            worksphoto.alt = works[i].title;
            titrephoto.innerText = works[i].title;

            // Galerie modale
            if (gallerySelector === '.gallery-modal') {
                const deleteIcon = document.createElement('span');
                deleteIcon.innerHTML = '<i class="fa-regular fa-trash-can"></i>'; 
                deleteIcon.classList.add('delete-icon');
                deleteIcon.addEventListener('click', function() {
                    deleteWork(works[i].id, cadrephoto);
                });
                cadrephoto.appendChild(deleteIcon);
            }

            cadrephoto.appendChild(worksphoto);
            cadrephoto.appendChild(titrephoto);
            gallery.appendChild(cadrephoto);
        }
    }

    async function deleteWork(id, element) {
        const authToken = window.localStorage.getItem('authToken');
        console.log(`Attempting to delete work with id: ${id}`); 
        console.log(`Using auth token: ${authToken}`); 

        try {
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`, 
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            element.remove();
            works = works.filter(work => work.id !== id);
            affichageworks(works, ".gallery");
        } catch (error) {
            alert('Erreur lors de la suppression de l\'élément');
            console.error('Fetch error:', error); 
        }
    }

    affichageworks(works, ".gallery"); // Affichage galerie principale

    /******************* Filtres ************************/
    const filtresPhoto = document.querySelector(".filter-bar");
    const selectCategorie = document.getElementById("categorie");

    try {
        // Récupération des catégories depuis le backend
        const responseCategories = await fetch('http://localhost:5678/api/categories');
        if (!responseCategories.ok) {
            throw new Error(`Erreur HTTP: ${responseCategories.status}`);
        }
        var categories = await responseCategories.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        alert('Erreur lors de la récupération des catégories');
        return; // Arrête l'exécution si une erreur survient
    }

    // Ajouter bouton "Tous" dans la barre de filtres
    const buttonTous = document.createElement("button");
    buttonTous.innerText = "Tous";
    buttonTous.classList.add("button_inactive");
    buttonTous.addEventListener("click", function() {
        document.querySelectorAll(".filter-bar button").forEach(button => {
            button.classList.remove("button_active");
            button.classList.add("button_inactive");
        });
        buttonTous.classList.add("button_active");
        buttonTous.classList.remove("button_inactive");

        affichageworks(works, ".gallery");
    });
    filtresPhoto.appendChild(buttonTous);

    // Ajouter l'option "Tous" dans le select de la modale d'ajout
    const optionTous = document.createElement("option");
    optionTous.value = "tous";
    optionTous.text = "Tous";
    selectCategorie.appendChild(optionTous);

    // Ajouter boutons catégories dynamiques
    categories.forEach(category => {
        const button = document.createElement("button");
        button.innerText = category.name;
        button.classList.add("button_inactive");
        if (category.id !== null) {
            button.dataset.categoryId = category.id;
        }
        button.addEventListener("click", function() {
            document.querySelectorAll(".filter-bar button").forEach(button => {
                button.classList.remove("button_active");
                button.classList.add("button_inactive");
            });
            button.classList.add("button_active");
            button.classList.remove("button_inactive");

            const categoryId = category.id ? parseInt(category.id) : null;
            document.querySelector(".gallery").innerHTML = ""; // Vider la galerie avant d'ajouter les nouvelles images filtrées

            if (categoryId !== null) {
                affichageworks(works.filter(work => work.categoryId === categoryId), ".gallery");
            } else {
                affichageworks(works, ".gallery");
            }
        });
        filtresPhoto.appendChild(button);

        // Ajouter les catégories au select de la modale d'ajout
        const option = document.createElement("option");
        option.value = category.id;
        option.text = category.name;
        selectCategorie.appendChild(option);
    });

    /********** Gestion de l'authentification **********/
    const loginLogoutLink = document.getElementById("LoginLogout"); 
    const buttonModifier = document.getElementById("button-modifier"); 
    const editionDiv = document.querySelector(".edition"); // Sélectionner la div édition

    const userIsLoggedIn = !!window.localStorage.getItem('authToken');
    console.log(userIsLoggedIn);
    console.log(window.localStorage.getItem('authToken'));

    if (userIsLoggedIn) {
        const logoutLink = document.createElement("a");
        logoutLink.href = "#";
        logoutLink.innerText = "logout";
        logoutLink.id = "LoginLogout";
        logoutLink.addEventListener("click", function(event) {
            event.preventDefault();
            window.localStorage.removeItem('authToken');
            document.location.href = "index.html";
        });
        loginLogoutLink.parentNode.replaceChild(logoutLink, loginLogoutLink); // Remplacement login par logout

        if (filtresPhoto) {
            filtresPhoto.classList.add('hidden'); // Masquer filtres si connecté
        }

        if (buttonModifier) {
            buttonModifier.style.display = "inline-block"; // Afficher bouton si connecté
        }

        if (editionDiv) {
            editionDiv.style.display = "flex"; // Afficher édition si connecté
        }
    } else {
        if (buttonModifier) {
            buttonModifier.style.display = "none"; // Masquer bouton si déconnecté
        }

        if (editionDiv) {
            editionDiv.style.display = "none"; // Masquer édition si déconnecté
        }
    }

    /********** Gestion de la modale **********/
    const modal = document.getElementById("modal");
    const closeModal = document.querySelector(".close");
    const ajouterPhotoBtn = document.getElementById("ajouter-photo-btn");
    const modaleAdd = document.getElementById("modale-add");
    const modaleContent = document.querySelector(".modal-content");

    // Lien entre le bouton "modifier" et l'ouverture de la modale
    buttonModifier.addEventListener("click", function() {
        modaleContent.style.display = "block"; // Afficher la vue principale
        modaleAdd.style.display = "none"; // Masquer la vue d'ajout de photo
        modal.style.display = "block";
        affichageworks(works, ".gallery-modal"); // Affichage de la galerie dans la modale
    });

    // Lien entre le bouton "Ajouter une photo" et l'ouverture de la modale d'ajout de photo
    ajouterPhotoBtn.addEventListener("click", function() {
        modaleContent.style.display = "none"; // Masquer la vue principale
        modaleAdd.style.display = "block"; // Afficher la vue d'ajout de photo
    });

    // Activer le clic sur l'input file lorsque l'utilisateur clique sur le span
    const imageLabel = document.getElementById("image_Label");
    const addImageInput = document.getElementById("add-image");
    const imagePreview = document.getElementById("image-preview");

    imageLabel.addEventListener("click", function(event) {
        event.preventDefault(); // Empêche toute action par défaut
        addImageInput.click();
    });

    // Afficher l'image sélectionnée
    addImageInput.addEventListener("change", function() {
        const file = addImageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = "block";
                imageLabel.style.display = "none";
            }
            reader.readAsDataURL(file);
        }
    });

    // Fermeture de la modale principale
    closeModal.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Fermeture de la modale d'ajout de photo
    const closeModaleAdd = document.querySelector(".modale-close");
    const backModaleAdd = document.querySelector(".modale-back");

    closeModaleAdd.addEventListener("click", function() {
        modaleAdd.style.display = "none"; // Masquer la vue d'ajout de photo
        modaleContent.style.display = "block"; // Afficher la vue principale
        modal.style.display = "none"; // Masquer complètement la modale
    });

    backModaleAdd.addEventListener("click", function() {
        modaleAdd.style.display = "none"; // Masquer la vue d'ajout de photo
        modaleContent.style.display = "block"; // Afficher la vue principale
    });

    // Fermeture de la modale en cliquant en dehors de celle-ci
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    /********** Gestion de l'ajout de photo **********/
    const formSendImg = document.getElementById("Form-send-img");
    formSendImg.addEventListener("submit", async function(event){
        event.preventDefault();
        const formData = new FormData(formSendImg);
        const authToken = window.localStorage.getItem('authToken');

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const result = await response.json();
            works.push(result);
            affichageworks(works, ".gallery");
            affichageworks(works, ".gallery-modal");
            modal.style.display = "none";
            formSendImg.reset();
            imagePreview.style.display = "none";
            imageLabel.style.display = "flex";

            alert("L'ajout du projet est réussi");
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la photo:', error);
            alert('Erreur lors de l\'ajout de la photo');
        }
    });

});
