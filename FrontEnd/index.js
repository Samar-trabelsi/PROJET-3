document.addEventListener("DOMContentLoaded", async function() {

/***************récuperation de données***********/

    const reponseworks = await fetch('http://localhost:5678/api/works');
    let works = await reponseworks.json();

/***********************Gallery**********************/

    function affichageworks(works) {
        for (let i = 0; i < works.length; i++) {
            const cadrephoto = document.createElement('figure');
            const titrephoto = document.createElement('figcaption');
            const worksphoto = document.createElement('img');
            worksphoto.src = works[i].imageUrl;
            worksphoto.alt = works[i].title;
            titrephoto.innerText = works[i].title;
            cadrephoto.appendChild(worksphoto);
            cadrephoto.appendChild(titrephoto);

            const galleryImage = document.querySelector(".gallery");
            galleryImage.appendChild(cadrephoto);
        }
    }

    affichageworks(works);

/*******************Filtres************************/

    const filtresPhoto = document.querySelector(".filter-bar");

    const categories = [
        { name: "Tous", id: null },
        { name: "Objets", id: 1 },
        { name: "Appartements", id: 2 },
        { name: "Hotel & restaurants", id: 3 }
    ];

    categories.forEach(category => {
        const button = document.createElement("button");
        button.innerText = category.name;
        button.classList.add("button_inactive");
        if (category.id !== null) {
            button.dataset.categoryId = category.id;
        }
        filtresPhoto.appendChild(button);
    });

    filtresPhoto.addEventListener("click", function(event) {
        if (event.target.tagName === "BUTTON") {
            document.querySelectorAll(".filter-bar button").forEach(button => {
                button.classList.remove("button_active");
                button.classList.add("button_inactive");
            });
            event.target.classList.add("button_active");
            event.target.classList.remove("button_inactive");

            const categoryId = event.target.dataset.categoryId ? parseInt(event.target.dataset.categoryId) : null;
            document.querySelector(".gallery").innerHTML = ""; // Vider la galerie avant d'ajouter les nouvelles images filtrées

            if (categoryId !== null) {
                affichageworks(works.filter(work => work.categoryId === categoryId));
            } else {
                affichageworks(works);
            }
        }
    });

/********** Gestion de l'authentification **********/

    const loginLogoutLink = document.getElementById("LoginLogout"); 
    const buttonModifier = document.getElementById("button-modifier"); 
    const editionDiv = document.querySelector(".edition"); // Sélectionner la div édition

    const userIsLoggedIn = !!window.localStorage.getItem("authToken");
    console.log(userIsLoggedIn);
    console.log(window.localStorage.getItem("authToken"));

    if (userIsLoggedIn) {
        const logoutLink = document.createElement("a");
        logoutLink.href = "#";
        logoutLink.innerText = "logout";
        logoutLink.id = "LoginLogout";
        logoutLink.addEventListener("click", function(event) {
            event.preventDefault();
            window.localStorage.removeItem("authToken");
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
});
