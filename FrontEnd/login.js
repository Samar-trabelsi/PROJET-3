const boutonConnection = document.getElementById("login_Button")
const ZoneMail = document.getElementById("email")
const ZonePassword = document.getElementById("password")

const ZoneErreur= document.querySelector(".login_error")
const ErreurLogin = document.createElement("p")

function Redirection(){
    document.location.href="index.html"
}


function Login(){
    boutonConnection.addEventListener("click", async function(event){
        event.preventDefault()
        const InfosLogin = {
            email : ZoneMail.value,
            password : ZonePassword.value
        }

        const chargeUtile = JSON.stringify(InfosLogin)
        
        await fetch("http://localhost:5678/api/users/login",{
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body:chargeUtile
        }).then (function(response){
            if(response.status===200){
                ErreurLogin.innerText=""
                
                return response.json()
                
                .then(function(reponseConvertie){
                    window.localStorage.setItem("tokenSophieBluel01", reponseConvertie.token);
                    Redirection();
                })
                
            }else{
                
                ErreurLogin.innerText="Erreur dans l'identifiant ou le mot de passe"
                ErreurLogin.classList.add("Message-Login_incorrect")
                ZoneErreur.appendChild(ErreurLogin)
            }
        })
        console.log (boutonConnection)
    })
}

Login()