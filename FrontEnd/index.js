document.addEventListener("DOMContentLoaded", async function() {
    /*************** Récupération de données ***********/
    let works;
    try {
        const reponseworks = await fetch("http://localhost:5678/api/works");
        if (!reponseworks.ok) {
            throw new Error(`Erreur HTTP: ${reponseworks.status}`);
        }
        works = await reponseworks.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des travaux:', error);
        alert('Erreur lors de la récupération des travaux');
        return; // Arrête l'exécution si une erreur survient
    }

    /*************** Vérification de l'authentification ***********/
    let userIsLoggedIn = window.localStorage.getItem("tokenSophieBluel01") !== null;
    let Token = window.localStorage.getItem("tokenSophieBluel01");

    /*************** Récupération des catégories ***********/
    let categories;
    try {
        const reponseCategories = await fetch("http://localhost:5678/api/categories");
        if (!reponseCategories.ok) {
            throw new Error(`Erreur HTTP: ${reponseCategories.status}`);
        }
        categories = await reponseCategories.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        alert('Erreur lors de la récupération des catégories');
        return; // Arrête l'exécution si une erreur survient
    }

    /*************** Gestion des filtres ***********/
    const filtresPhoto = document.querySelector(".filter-bar");

    function createFilterButton(className, text, filterFn) {
        const button = document.createElement("button");
        button.classList.add(className, "button_inactive");
        button.innerText = text;
        button.addEventListener("click", function() {
            document.querySelectorAll(".filter-bar button").forEach(btn => btn.classList.remove("button_active"));
            button.classList.add("button_active");
            document.querySelector(".gallery").innerHTML = "";
            affichageworks(filterFn());
        });
        return button;
    }

    const filterButtonsConfig = [
        { class: "filtres_Tous", text: "Tous", filterFn: () => works },
        ...categories.map(category => ({
            class: `filtres_${category.name.replace(/\s+/g, '')}`,
            text: category.name,
            filterFn: () => works.filter(work => work.categoryId === category.id)
        }))
    ];

    function renderFilterButtons() {
        filtresPhoto.innerHTML = "";
        filterButtonsConfig.forEach(({ class: className, text, filterFn }) => {
            const button = createFilterButton(className, text, filterFn);
            filtresPhoto.appendChild(button);
        });
    }

    renderFilterButtons();

    /*************** Affichage des images ***********/
    function affichageworks(works) {
        const galleryPhoto = document.querySelector(".gallery");
        galleryPhoto.innerHTML = "";

        works.forEach(work => {
            const figurePhoto = document.createElement("figure");
            const titrePhoto = document.createElement("figcaption");
            const worksPhoto = document.createElement("img");
            worksPhoto.src = work.imageUrl;
            worksPhoto.alt = work.title;
            titrePhoto.innerText = work.title;
            figurePhoto.appendChild(worksPhoto);
            figurePhoto.appendChild(titrePhoto);
            galleryPhoto.appendChild(figurePhoto);
        });
    }

    affichageworks(works);

    /*************** Fonctions de gestion de la modale ***********/
    let modal = null;
    const modaleSuppressionProjet = document.getElementById("modale-delete");
    const modaleAjoutProjet = document.getElementById("modale-add");

    const boutonsFermetureModale = document.querySelectorAll(".modale-close");
    const stoppeursPropagationModale = document.querySelectorAll(".modale-stop");

    const openModal = function(e) {
        e.preventDefault();
        modal = document.querySelector(".modale");
        modal.style.display = "flex";
        modal.removeAttribute("aria-hidden");
        modal.setAttribute("aria-modal", "true");
        modal.addEventListener("click", closeModal);

        boutonsFermetureModale.forEach(btn => btn.addEventListener("click", closeModal));
        stoppeursPropagationModale.forEach(btn => btn.addEventListener("click", stopPropagation));
    }

    const closeModal = function(e) {
        if (modal === null) {
            return;
        }
        e.preventDefault();
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        modal.removeAttribute("aria-modal");
        modal.removeEventListener("click", closeModal);
        boutonsFermetureModale.forEach(btn => btn.removeEventListener("click", closeModal));
        stoppeursPropagationModale.forEach(btn => btn.removeEventListener("click", stopPropagation));

        modal = null;
        modaleSuppressionProjet.style.display = "flex";
        modaleAjoutProjet.style.display = "none";
    }

    const stopPropagation = function(e) {
        e.stopPropagation();
    }

    /*************** Gestion du formulaire d'ajout de projets ***********/
    const Formulaire = document.querySelector("#Form-send-img");
    const BoutonValidationFormulaire = document.createElement("input");
    BoutonValidationFormulaire.setAttribute("type", "button");
    BoutonValidationFormulaire.setAttribute("value", "Valider");
    BoutonValidationFormulaire.classList.add("button-form", "button-form-inactive");

    const ZoneImage = document.getElementById("add-image");
    const ZoneTitre = document.getElementById("titreImg");
    const ZoneCategorie = document.getElementById("categorie");
    const LabelZoneImg = document.getElementById("image_Label");
    const ImagePrevisualisée = document.createElement("img");

    /* Prévisualisation image */
    ZoneImage.onchange = function() {
        let LectureFichier = new FileReader();
        LectureFichier.readAsDataURL(ZoneImage.files[0]);

        LectureFichier.onload = function() {
            LabelZoneImg.innerHTML = "";
            ImagePrevisualisée.setAttribute("src", LectureFichier.result);
            LabelZoneImg.appendChild(ImagePrevisualisée);
        }
    }

    /* Récupération des catégories depuis la base de données et ajout des options au formulaire */
    categories.forEach(category => {
        let OptionCategorie = document.createElement("option");
        OptionCategorie.setAttribute("value", category.id);
        OptionCategorie.innerText = category.name;
        ZoneCategorie.appendChild(OptionCategorie);
    });

    /* Validation du formulaire */
    function VerificationChampFormulaire(balise) {
        if (balise.value === "") {
            balise.classList.add("champ-formulaire_incorrect");
        } else {
            balise.classList.remove("champ-formulaire_incorrect");
        }
    }

    function VerificationFichier(balise) {
        if (balise.files[0].type == "image/png" || balise.files[0].type == "image/jpg" || balise.files[0].type == "image/jpeg" || balise.files[0].size < 4000000) {
            balise.classList.remove("champ-formulaire_incorrect");
        } else {
            balise.classList.add("champ-formulaire_incorrect");
            alert("Fichier de type incorrect ou taille supérieure à 4 Mo");
        }
    }

    function ValidationBoutonEnvoiFormulaire(bouton) {
        if (ZoneTitre.classList.contains("champ-formulaire_incorrect") || ZoneCategorie.classList.contains("champ-formulaire_incorrect") || ZoneImage.classList.contains("champ-formulaire_incorrect")) {
            bouton.classList.add("button-form-inactive");
            bouton.setAttribute("disabled", "");
        } else {
            bouton.classList.remove("button-form-inactive");
            bouton.classList.add("button-form-active");
            bouton.removeAttribute("disabled");
        }
    }

    [ZoneTitre, ZoneCategorie].forEach(zone => {
        zone.addEventListener("change", () => {
            VerificationChampFormulaire(zone);
            ValidationBoutonEnvoiFormulaire(BoutonValidationFormulaire);
        });
    });

    ZoneImage.addEventListener("change", () => {
        VerificationFichier(ZoneImage);
        ValidationBoutonEnvoiFormulaire(BoutonValidationFormulaire);
    });

    /* Envoi du formulaire pour requête POST */
    BoutonValidationFormulaire.addEventListener("click", async function(event) {
        event.preventDefault();
        let formData = new FormData();
        formData.append("image", ZoneImage.files[0]);
        formData.append("title", ZoneTitre.value);
        formData.append("category", ZoneCategorie.value);

        for (const value of formData.values()) {
            console.log(value);
        }

        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${Token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Erreur HTTP: ${response.status} - ${errorMessage}`);
            }

            const ReponseWorksUpdated = await fetch("http://localhost:5678/api/works");
            const worksUpdated = await ReponseWorksUpdated.json();
            document.querySelector(".gallery").innerHTML = "";
            affichageworks(worksUpdated);
            document.querySelector(".modale-gallery").innerHTML = "";
            affichageEtSuppressionworks(worksUpdated);
            alert("L'ajout du projet est réussi");

        } catch (error) {
            alert(`Échec de l'ajout du projet : ${error.message}`);
        }
    });

    Formulaire.appendChild(BoutonValidationFormulaire);

    /*************** Affichage des projets dans la modale et suppression ***********/
    function affichageEtSuppressionworks(works) {
        const GallerieModale = document.querySelector(".modale-gallery");
        GallerieModale.innerHTML = "";

        works.forEach(work => {
            const figureModale = document.createElement("figure");
            const worksModale = document.createElement("img");
            const DivSuppression = document.createElement("div");
            const IconeCorbeille = document.createElement("i");
            IconeCorbeille.classList.add("fa-solid", "fa-trash-can");
            DivSuppression.classList.add("button-delete-modale");
            worksModale.src = work.imageUrl;
            worksModale.alt = work.title;

            figureModale.appendChild(worksModale);
            DivSuppression.appendChild(IconeCorbeille);
            figureModale.appendChild(DivSuppression);
            GallerieModale.appendChild(figureModale);

            DivSuppression.addEventListener("click", async function(event) {
                event.preventDefault();
                event.stopPropagation();
                const IDSuppression = work.id;

                try {
                    const response = await fetch(`http://localhost:5678/api/works/${IDSuppression}`, {
                        method: "DELETE",
                        headers: {
                            accept: "*/*",
                            Authorization: `Bearer ${Token}`,
                        }
                    });

                    if (!response.ok) {
                        const errorMessage = await response.text();
                        throw new Error(`Erreur HTTP: ${response.status} - ${errorMessage}`);
                    }

                    const ReponseWorksUpdated = await fetch("http://localhost:5678/api/works");
                    const worksUpdated = await ReponseWorksUpdated.json();
                    document.querySelector(".gallery").innerHTML = "";
                    affichageworks(worksUpdated);
                    GallerieModale.innerHTML = "";
                    affichageEtSuppressionworks(worksUpdated);

                } catch (error) {
                    alert(`Échec de la suppression du projet : ${error.message}`);
                }
            });
        });
    }

    /*************** Gestion de l'affichage selon l'état de connexion ***********/
    const divHeader = document.getElementById("header_div");
    const divProjets = document.querySelector(".Project");
    const iconeEdition = document.createElement("i");
    const iconeEdition2 = document.createElement("i");
    const texteHeader = document.createElement("p");
    const divModificationProjet = document.createElement("div");
    const texteProjets = document.createElement("p");
    const LienLoginLogout = document.getElementById("Login_Logout");

    if (userIsLoggedIn) {
        filtresPhoto.innerHTML = "";

        divHeader.classList.remove("display_none");
        divHeader.classList.add("header-edition");
        iconeEdition.classList.add("fa-regular", "fa-pen-to-square");
        iconeEdition2.classList.add("fa-regular", "fa-pen-to-square");
        texteHeader.innerText = "Mode édition";
        texteProjets.innerText = "modifier";

        divHeader.appendChild(iconeEdition);
        divHeader.appendChild(texteHeader);

        divProjets.appendChild(divModificationProjet);
        divModificationProjet.appendChild(iconeEdition2);
        divModificationProjet.appendChild(texteProjets);

        LienLoginLogout.href = "";
        LienLoginLogout.innerText = "logout";
        /* Suppression du token au click sur le logout et rechargement de la page */
        LienLoginLogout.addEventListener("click", function() {
            window.localStorage.removeItem("tokenSophieBluel01");
            document.location.href = "index.html";
        });

        /* Event Listener pour ouverture modale sur la div */
        divModificationProjet.addEventListener("click", openModal);

        /* Appel de la fonction d'affichage des éléments et de suppression des projets dans la modale */
        affichageEtSuppressionworks(works);

        /* Ajout du bouton pour accéder à la seconde modale et fonctionnement */
        const boutonChangementModale = document.createElement("button");
        boutonChangementModale.classList.add("button_active");
        boutonChangementModale.innerText = "Ajouter une photo";

        modaleSuppressionProjet.appendChild(boutonChangementModale);

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

        /* Ajout du bouton de validation du formulaire d'ajout de projet par javascript pour sécuriser davantage */
        Formulaire.appendChild(BoutonValidationFormulaire);
    } else {
        renderFilterButtons();
    }
});
