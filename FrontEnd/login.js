const boutonConnection = document.getElementById("login_Button")
const ZoneMail = document.getElementById("email")
const ZonePassword = document.getElementById("password")

// Sélectionne l'élément qui affichera les messages d'erreur de connexion
const ZoneErreur = document.querySelector(".login_error");

// Crée un nouvel élément <p> pour afficher les erreurs de connexion
const ErreurLogin = document.createElement("p");

// Fonction pour rediriger l'utilisateur vers la page d'index
function Redirection() {
    document.location.href = "index.html";
}

// Fonction principale de gestion de la connexion
function Login() {
    // Ajoute un écouteur d'événement sur le bouton de connexion pour le clic
    boutonConnection.addEventListener("click", async function(event) {
        // Empêche le comportement par défaut du formulaire (rechargement de la page)
        event.preventDefault();
        
        // Récupère les valeurs des champs email et mot de passe
        const InfosLogin = {
            email: ZoneMail.value,
            password: ZonePassword.value
        };

        // Convertit les informations de connexion en chaîne JSON
        const chargeUtile = JSON.stringify(InfosLogin);
        
        // Envoie une requête POST à l'API de connexion
        await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: chargeUtile
        }).then(function(response) {
            // Vérifie si le statut de la réponse est 200 (succès)
            if (response.status === 200) {
                // Efface tout message d'erreur précédent
                ErreurLogin.innerText = "";
                
                // Convertit la réponse en JSON
                return response.json()
                .then(function(reponseConvertie) {
                    // Stocke le token dans le localStorage du navigateur
                    window.localStorage.setItem("tokenSophieBluel01", reponseConvertie.token);
                    // Redirige l'utilisateur vers la page d'index
                    Redirection();
                });
            } else {
                // Affiche un message d'erreur en cas d'échec de la connexion
                ErreurLogin.innerText = "Erreur dans l'identifiant ou le mot de passe";
                ErreurLogin.classList.add("Message-Login_incorrect");
                ZoneErreur.appendChild(ErreurLogin);
            }
        });
        // Log du bouton de connexion (probablement pour des fins de débogage)
        console.log(boutonConnection);
    });
}

// Appelle la fonction Login pour initialiser l'écouteur d'événement
Login();
