// écouteur d'événement pour exécuter la fonction lorsque le DOM est complètement chargé
document.addEventListener("DOMContentLoaded", async function() {
    
/*************** 1 Récupération de données ***********/

    let works; // Déclare une variable pour stocker les travaux récupérés
    try {
        // Envoie une requête HTTP GET pour récupérer les travaux depuis l'API
        const reponseworks = await fetch("http://localhost:5678/api/works");
        if (!reponseworks.ok) { // Vérifie si la réponse n'est pas correcte
            throw new Error(`Erreur HTTP: ${reponseworks.status}`); // Lance une erreur avec le statut HTTP si la réponse n'est pas correcte
        }
        // Convertit la réponse en JSON et assigne les données à la variable 'works'
        works = await reponseworks.json();
    } catch (error) {
        // Capture les erreurs et affiche un message dans la console
        console.error('Erreur lors de la récupération des travaux:', error);
        alert('Erreur lors de la récupération des travaux');
        return; // Arrête l'exécution si une erreur survient
    }

/*************** 5 Vérification de l'authentification ***********/
    
    // Vérifie si l'utilisateur est connecté en cherchant un token dans le stockage local
    let userIsLoggedIn = window.localStorage.getItem("tokenSophieBluel01") !== null;
    let Token = window.localStorage.getItem("tokenSophieBluel01"); // Récupère le token depuis le stockage local

/*************** 3 Récupération des catégories ***********/

    let categories; // Déclare une variable pour stocker les catégories récupérées
    try {
        // Envoie une requête HTTP GET pour récupérer les catégories depuis l'API
        const reponseCategories = await fetch("http://localhost:5678/api/categories");
        if (!reponseCategories.ok) { // Vérifie si la réponse n'est pas correcte (statut HTTP en dehors de 200-299)
            throw new Error(`Erreur HTTP: ${reponseCategories.status}`); // Lance une erreur avec le statut HTTP si la réponse n'est pas correcte
        }
        // Convertit la réponse en JSON et assigne les données à la variable 'categories'
        categories = await reponseCategories.json();
    } catch (error) {
        // Capture les erreurs et affiche un message dans la console et une alerte à l'utilisateur
        console.error('Erreur lors de la récupération des catégories:', error);
        alert('Erreur lors de la récupération des catégories');
        return; // Arrête l'exécution si une erreur survient
    }

/*************** 4 Gestion des filtres ***********/

// Sélectionne l'élément de la barre de filtres
const filtresPhoto = document.querySelector(".filter-bar");

// Fonction pour créer un bouton de filtre
function createFilterButton(className, text, filterFn) {
    const button = document.createElement("button"); // Crée bouton
    button.classList.add(className, "button_inactive"); //css
    button.innerText = text; //texte
    button.addEventListener("click", function() { // Ajoute un écouteur d'événement pour le clic
        // Désactive tous les autres boutons de filtre
        document.querySelectorAll(".filter-bar button").forEach(btn => btn.classList.remove("button_active"));
        button.classList.add("button_active"); // Active le bouton cliqué
        document.querySelector(".gallery").innerHTML = ""; // Vide la galerie
        affichageworks(filterFn()); // Affiche les travaux filtrés
    });
    return button; // Retourne le bouton créé
}

// Configuration boutons de filtre
const filterButtonsConfig = [
    { class: "filtres_Tous", text: "Tous", filterFn: () => works }, // Bouton pour afficher tous les travaux
    ...categories.map(category => ({ // Pour chaque catégorie, crée une configuration de bouton
        class: `filtres_${category.name.replace(/\s+/g, '')}`, // Classe CSS basée sur le nom de la catégorie
        text: category.name, // Texte du bouton basé sur le nom de la catégorie
        filterFn: () => works.filter(work => work.categoryId === category.id) // Fonction de filtre pour cette catégorie
    }))
];

// Fonction pour afficher les boutons de filtre
function renderFilterButtons() {
    filtresPhoto.innerHTML = ""; // Vide la barre de filtres
    filterButtonsConfig.forEach(({ class: className, text, filterFn }) => { // Pour chaque configuration de bouton
        const button = createFilterButton(className, text, filterFn); // Crée un bouton de filtre
        filtresPhoto.appendChild(button); // Ajoute le bouton à la barre de filtres
    });
}

// Appelle la fonction pour afficher les boutons de filtre
renderFilterButtons();

/*************** 2 Affichage des images ***********/

// Fonction pour afficher les travaux dans la galerie
function affichageworks(works) {
    const galleryPhoto = document.querySelector(".gallery"); // Sélectionne l'élément de la galerie
    galleryPhoto.innerHTML = ""; // Vide la galerie

    // Pour chaque travail, crée et ajoute les éléments nécessaires dans la galerie
    works.forEach(work => {
        const figurePhoto = document.createElement("figure"); // Crée un élément <figure>
        const titrePhoto = document.createElement("figcaption"); // Crée un élément <figcaption> pour le titre
        const worksPhoto = document.createElement("img"); // Crée un élément <img> pour l'image
        worksPhoto.src = work.imageUrl; // Définit l'URL de l'image
        worksPhoto.alt = work.title; // Définit le texte alternatif de l'image
        titrePhoto.innerText = work.title; // Définit le texte du titre
        figurePhoto.appendChild(worksPhoto); // Ajoute l'image au <figure>
        figurePhoto.appendChild(titrePhoto); // Ajoute le titre au <figure>
        galleryPhoto.appendChild(figurePhoto); // Ajoute le <figure> à la galerie
    });
}

// Appelle la fonction pour afficher les travaux initialement
affichageworks(works);


 /*************** 7 Fonctions de gestion de la modale ***********/

let modal = null; // Déclare une variable pour stocker la référence de la modale ouverte
const modaleSuppressionProjet = document.getElementById("modale-delete"); // Sélectionne la modale de suppression de projet
const modaleAjoutProjet = document.getElementById("modale-add"); // Sélectionne la modale d'ajout de projet

const boutonsFermetureModale = document.querySelectorAll(".modale-close"); // Sélectionne tous les boutons de fermeture de modale
const stoppeursPropagationModale = document.querySelectorAll(".modale-stop"); // Sélectionne tous les éléments qui arrêtent la propagation des clics

const openModal = function(e) {
    e.preventDefault(); // Empêche le comportement par défaut du clic
    modal = document.querySelector(".modale"); // Sélectionne la modale à ouvrir
    modal.style.display = "flex"; // Affiche la modale en mode flex
    modal.removeAttribute("aria-hidden"); // Supprime l'attribut aria-hidden pour indiquer que la modale est visible
    modal.setAttribute("aria-modal", "true"); // Définit l'attribut aria-modal pour indiquer que c'est une modale active
    modal.addEventListener("click", closeModal); // Ajoute un écouteur d'événement pour fermer la modale au clic

    boutonsFermetureModale.forEach(btn => btn.addEventListener("click", closeModal)); // Ajout écouteurs d'événement pour fermer la modale(clique)
    stoppeursPropagationModale.forEach(btn => btn.addEventListener("click", stopPropagation)); // Ajout écouteurs d'événement pour arrêter la propagation des clics sur certains éléments
}

const closeModal = function(e) {
    if (modal === null) {
        return; // Si aucune modale n'est ouverte, ne fait rien
    }
    e.preventDefault(); // Empêche le comportement par défaut du clic
    modal.style.display = "none"; // Cache la modale
    modal.setAttribute("aria-hidden", "true"); // Définit l'attribut aria-hidden pour indiquer que la modale est cachée
    modal.removeAttribute("aria-modal"); // Supprime l'attribut aria-modal
    modal.removeEventListener("click", closeModal); // Retire l'écouteur d'événement pour fermer la modale au clic
    boutonsFermetureModale.forEach(btn => btn.removeEventListener("click", closeModal)); // Retire les écouteurs d'événement des boutons de fermeture
    stoppeursPropagationModale.forEach(btn => btn.removeEventListener("click", stopPropagation)); // Retire les écouteurs d'événement des éléments qui arrêtent la propagation des clics

    modal = null; // Réinitialise la variable de la modale
    modaleSuppressionProjet.style.display = "flex"; // Affiche la modale de suppression de projet
    modaleAjoutProjet.style.display = "none"; // Cache la modale d'ajout de projet
}

const stopPropagation = function(e) {
    e.stopPropagation(); // Empêche la propagation de l'événement
}

/*************** 8) Gestion du formulaire d'ajout de projets ***********/

const Formulaire = document.querySelector("#Form-send-img"); // Sélectionne le formulaire d'envoi d'image
const BoutonValidationFormulaire = document.createElement("input"); // Crée un bouton de validation de formulaire
BoutonValidationFormulaire.setAttribute("type", "button"); // Définit le type de l'input comme un bouton
BoutonValidationFormulaire.setAttribute("value", "Valider"); // Définit le texte du bouton
BoutonValidationFormulaire.classList.add("button-form", "button-form-inactive"); // Ajoute des classes CSS au bouton

const ZoneImage = document.getElementById("add-image"); // Sélectionne la zone d'ajout d'image
const ZoneTitre = document.getElementById("titreImg"); // Sélectionne la zone de titre d'image
const ZoneCategorie = document.getElementById("categorie"); // Sélectionne la zone de catégorie
const LabelZoneImg = document.getElementById("image_Label"); // Sélectionne le label de la zone d'image
const ImagePrevisualisée = document.createElement("img"); // Crée un élément <img> pour la prévisualisation

/* Prévisualisation image */
ZoneImage.onchange = function() {
    let LectureFichier = new FileReader(); // Crée un lecteur de fichier
    LectureFichier.readAsDataURL(ZoneImage.files[0]); // Lit le fichier image sélectionné

    LectureFichier.onload = function() {
        LabelZoneImg.innerHTML = ""; // Vide le label de la zone d'image
        ImagePrevisualisée.setAttribute("src", LectureFichier.result); // Définit la source de l'image prévisualisée
        LabelZoneImg.appendChild(ImagePrevisualisée); // Ajoute l'image prévisualisée au label
    }
}

/* Récupération des catégories depuis la base de données et ajout des options au formulaire */
categories.forEach(category => {
    let OptionCategorie = document.createElement("option"); // Crée un élément <option> pour chaque catégorie
    OptionCategorie.setAttribute("value", category.id); // Définit la valeur de l'option comme l'ID de la catégorie
    OptionCategorie.innerText = category.name; // Définit le texte de l'option comme le nom de la catégorie
    ZoneCategorie.appendChild(OptionCategorie); // Ajoute l'option à la zone de catégorie
});

/* Validation du formulaire */
function VerificationChampFormulaire(balise) {
    if (balise.value === "") {
        balise.classList.add("champ-formulaire_incorrect"); // Ajoute une classe indiquant que le champ est incorrect si vide
    } else {
        balise.classList.remove("champ-formulaire_incorrect"); // Retire la classe indiquant que le champ est incorrect
    }
}

function VerificationFichier(balise) {
    if (balise.files[0].type == "image/png" || balise.files[0].type == "image/jpg" || balise.files[0].type == "image/jpeg" || balise.files[0].size < 4000000) {
        balise.classList.remove("champ-formulaire_incorrect"); // Retire la classe indiquant que le champ est incorrect si le fichier est valide
    } else {
        balise.classList.add("champ-formulaire_incorrect"); // Ajoute une classe indiquant que le champ est incorrect si le fichier est invalide
        alert("Fichier de type incorrect ou taille supérieure à 4 Mo"); // Alerte l'utilisateur en cas de fichier incorrect
    }
}

function ValidationBoutonEnvoiFormulaire(bouton) {
    if (ZoneTitre.classList.contains("champ-formulaire_incorrect") || ZoneCategorie.classList.contains("champ-formulaire_incorrect") || ZoneImage.classList.contains("champ-formulaire_incorrect")) {
        bouton.classList.add("button-form-inactive"); // Désactive le bouton si un champ est incorrect
        bouton.setAttribute("disabled", ""); // Désactive le bouton en ajoutant l'attribut disabled
    } else {
        bouton.classList.remove("button-form-inactive"); // Active le bouton si tous les champs sont corrects
        bouton.classList.add("button-form-active"); // Ajoute une classe pour styliser le bouton actif
        bouton.removeAttribute("disabled"); // Retire l'attribut disabled du bouton
    }
}

// Ajoute des écouteurs d'événement pour valider les champs du formulaire
[ZoneTitre, ZoneCategorie].forEach(zone => {
    zone.addEventListener("change", () => {
        VerificationChampFormulaire(zone); // Vérifie le champ de formulaire
        ValidationBoutonEnvoiFormulaire(BoutonValidationFormulaire); // Valide le bouton de soumission du formulaire
    });
});

ZoneImage.addEventListener("change", () => {
    VerificationFichier(ZoneImage); // Vérifie le fichier image
    ValidationBoutonEnvoiFormulaire(BoutonValidationFormulaire); // Valide le bouton de soumission du formulaire
});

/* Envoi du formulaire pour requête POST */
BoutonValidationFormulaire.addEventListener("click", async function(event) {
    event.preventDefault(); // Empêche le comportement par défaut du clic
    let formData = new FormData(); // Crée un nouvel objet FormData
    formData.append("image", ZoneImage.files[0]); // Ajoute le fichier image à FormData
    formData.append("title", ZoneTitre.value); // Ajoute le titre à FormData
    formData.append("category", ZoneCategorie.value); // Ajoute la catégorie à FormData

    for (const value of formData.values()) {
        console.log(value); // Affiche chaque valeur de FormData dans la console
    }

    try {
        // Envoie une requête POST à l'API pour ajouter un nouveau projet
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST", // Utilise la méthode POST
            headers: {
                accept: "application/json", // Accepte les réponses JSON
                Authorization: `Bearer ${Token}`, // Ajoute le token d'autorisation dans les en-têtes
            },
            body: formData, // Envoie les données du formulaire
        });

        if (!response.ok) { // Vérifie si la réponse n'est pas correcte
            const errorMessage = await response.text(); // Récupère le message d'erreur
            throw new Error(`Erreur HTTP: ${response.status} - ${errorMessage}`); // Lance une erreur avec le statut HTTP et le message
        }

        // Récupère la liste mise à jour des projets après l'ajout
        const ReponseWorksUpdated = await fetch("http://localhost:5678/api/works");
        const worksUpdated = await ReponseWorksUpdated.json();
        document.querySelector(".gallery").innerHTML = ""; // Efface la galerie principale
        affichageworks(worksUpdated); // Affiche les projets mis à jour dans la galerie principale
        document.querySelector(".modale-gallery").innerHTML = ""; // Efface la galerie de la modale
        affichageEtSuppressionworks(worksUpdated); // Affiche les projets mis à jour dans la modale
        alert("L'ajout du projet est réussi"); // Alerte l'utilisateur que l'ajout a réussi

    } catch (error) { // Capture et gère les erreurs
        alert(`Échec de l'ajout du projet : ${error.message}`); // Affiche une alerte avec le message d'erreur
    }
});

// Ajoute le bouton de validation au formulaire
Formulaire.appendChild(BoutonValidationFormulaire);


   /*************** 9 Affichage des projets dans la modale et suppression ***********/

// Fonction pour afficher les projets dans la modale et gérer leur suppression
function affichageEtSuppressionworks(works) {
    const GallerieModale = document.querySelector(".modale-gallery"); // Sélectionne l'élément de la galerie dans la modale
    GallerieModale.innerHTML = ""; // Efface le contenu existant de la galerie

    // Pour chaque projet, crée et ajoute les éléments nécessaires dans la modale
    works.forEach(work => {
        const figureModale = document.createElement("figure"); // Crée un élément <figure> pour le projet
        const worksModale = document.createElement("img"); // Crée un élément <img> pour l'image du projet
        const DivSuppression = document.createElement("div"); // Crée un élément <div> pour contenir l'icône de suppression
        const IconeCorbeille = document.createElement("i"); // Crée un élément <i> pour l'icône de la corbeille
        IconeCorbeille.classList.add("fa-solid", "fa-trash-can"); // Ajoute des classes pour styliser l'icône de la corbeille
        DivSuppression.classList.add("button-delete-modale"); // Ajoute une classe pour styliser le bouton de suppression
        worksModale.src = work.imageUrl; // Définit l'URL de l'image du projet
        worksModale.alt = work.title; // Définit le texte alternatif de l'image du projet

        figureModale.appendChild(worksModale); // Ajoute l'image au <figure>
        DivSuppression.appendChild(IconeCorbeille); // Ajoute l'icône de la corbeille au <div>
        figureModale.appendChild(DivSuppression); // Ajoute le <div> de suppression au <figure>
        GallerieModale.appendChild(figureModale); // Ajoute le <figure> à la galerie de la modale

        // Ajoute un écouteur d'événement pour gérer la suppression du projet au clic sur l'icône de la corbeille
        DivSuppression.addEventListener("click", async function(event) {
            event.preventDefault(); // Empêche le comportement par défaut du clic
            event.stopPropagation(); // Empêche la propagation de l'événement
            const IDSuppression = work.id; // Récupère l'ID du projet à supprimer

            try {
                // Envoie une requête DELETE à l'API pour supprimer le projet
                const response = await fetch(`http://localhost:5678/api/works/${IDSuppression}`, {
                    method: "DELETE", // Utilise la méthode DELETE
                    headers: {
                        accept: "*/*", // Accepte tous les types de réponses
                        Authorization: `Bearer ${Token}`, // Ajoute le token d'autorisation dans les en-têtes
                    }
                });

                if (!response.ok) { // Vérifie si la réponse n'est pas correcte
                    const errorMessage = await response.text(); // Récupère le message d'erreur
                    throw new Error(`Erreur HTTP: ${response.status} - ${errorMessage}`); // Lance une erreur avec le statut HTTP et le message
                }

                // Récupère la liste mise à jour des projets après la suppression
                const ReponseWorksUpdated = await fetch("http://localhost:5678/api/works");
                const worksUpdated = await ReponseWorksUpdated.json();
                document.querySelector(".gallery").innerHTML = ""; // Efface la galerie principale
                affichageworks(worksUpdated); // Affiche les projets mis à jour dans la galerie principale
                GallerieModale.innerHTML = ""; // Efface la galerie de la modale
                affichageEtSuppressionworks(worksUpdated); // Affiche les projets mis à jour dans la modale

            } catch (error) { // Capture et gère les erreurs
                alert(`Échec de la suppression du projet : ${error.message}`); // Affiche une alerte avec le message d'erreur
            }
        });
    });
}


/*************** 6 Gestion de l'affichage selon l'état de connexion ***********/

const divHeader = document.getElementById("header_div"); // Sélection élément du header
const divProjets = document.querySelector(".Project"); // Sélection élément contenant les projets
const iconeEdition = document.createElement("i"); // Crée un élément <i> pour l'icône d'édition
const iconeEdition2 = document.createElement("i"); // Crée un deuxième élément <i> pour l'icône d'édition
const texteHeader = document.createElement("p"); // Crée un élément <p> pour le texte du header
const divModificationProjet = document.createElement("div"); // Crée un élément <div> pour la modification du projet
const texteProjets = document.createElement("p"); // Crée un élément <p> pour le texte de modification de projet
const LienLoginLogout = document.getElementById("Login_Logout"); // Sélectionne le lien pour le login/logout

if (userIsLoggedIn) { // Vérifie si l'utilisateur est connecté
    filtresPhoto.innerHTML = ""; // Efface le contenu de la barre de filtres

    divHeader.classList.remove("display_none"); // Affiche le header en mode édition
    divHeader.classList.add("header-edition"); // Ajoute une classe spécifique pour le mode édition
    iconeEdition.classList.add("fa-regular", "fa-pen-to-square"); // Ajoute des classes pour l'icône d'édition
    iconeEdition2.classList.add("fa-regular", "fa-pen-to-square"); // Ajoute des classes pour la deuxième icône d'édition
    texteHeader.innerText = "Mode édition"; // Définit le texte du header en mode édition
    texteProjets.innerText = "modifier"; // Définit le texte pour la modification de projet

    divHeader.appendChild(iconeEdition); // Ajoute l'icône d'édition au header
    divHeader.appendChild(texteHeader); // Ajoute le texte du header au header

    divProjets.appendChild(divModificationProjet); // Ajoute la div de modification de projet à l'élément projet
    divModificationProjet.appendChild(iconeEdition2); // Ajoute la deuxième icône d'édition à la div de modification
    divModificationProjet.appendChild(texteProjets); // Ajoute le texte de modification de projet à la div de modification

    LienLoginLogout.href = ""; // Définir l'URL de déconnexion
    LienLoginLogout.innerText = "logout"; // Change le texte du lien pour indiquer la déconnexion
    /* Suppression du token au clic sur le logout et rechargement de la page */
    LienLoginLogout.addEventListener("click", function() {
        window.localStorage.removeItem("tokenSophieBluel01"); // Supprime le token du stockage local
        document.location.href = "index.html"; // Recharge la page pour refléter l'état de déconnexion
    });

    /* Event Listener pour ouverture modale sur la div */
    divModificationProjet.addEventListener("click", openModal); // Ajoute un écouteur d'événement pour ouvrir la modale de modification

    /* Appel de la fonction d'affichage des éléments et de suppression des projets dans la modale */
    affichageEtSuppressionworks(works);

    /* Ajout du bouton pour accéder à la seconde modale et fonctionnement */
    const boutonChangementModale = document.createElement("button"); // Crée un bouton pour changer de modale
    boutonChangementModale.classList.add("button_active"); // css
    boutonChangementModale.innerText = "Ajouter une photo"; // nom bouton 

    modaleSuppressionProjet.appendChild(boutonChangementModale); // ajout bouton à modale suppression

    boutonChangementModale.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        modaleSuppressionProjet.style.display = "none";
        modaleAjoutProjet.style.display = "flex";
    });

    const boutonRetourModalePrecedente = document.querySelector(".modale-back");
    boutonRetourModalePrecedente.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        modaleSuppressionProjet.style.display = "flex";
        modaleAjoutProjet.style.display = "none"; 
    });

    /* Ajout bouton validation */
    Formulaire.appendChild(BoutonValidationFormulaire);
} else {
    renderFilterButtons(); // Si utilisateur logout, affiche les boutons filtre
}
});
