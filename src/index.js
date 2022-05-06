/************************************************
 * 
 *  Title : CPNV - Gestion des heures d'ouverture d'un magasin
 * 
 *  Date : 05/05/2022
 * 
 *  Author : Yannick Perret  : https://github.com/tchoune/ 
 *
 *************************************************/

/*
    listes des améliorations : 
        - N'afficher qu'un seul input et faire un traitement du text via splice pour ne récupérer que la première et dernière date pour ensuite la transformer en class Date()
        - Faire un design et responsive design
        - Tester les valeurs retourné par l'utilisateur (dates)
        - Prochain jour ouvré, s'il tombe sur 0.00 il l'utilisera comme prochain jour d'ouverture. -> faire une exéception
*/

import './style/_settings.scss'


// VARIABLES 
//Start by Sunday !
const weekday = [["Sunday","Sun"],["Monday", "Mon"],["Tuesday", "Tues"],["Wednesday", "Wed"],["Thursday", "Thurs"],["Friday", "Fri"],["Saturday", "Sat"]]; 


let shopOpening = [
    [weekday[0], 0.00, 0.00, 0.00, 0.00], //Sunday
    [weekday[1], 8.00, 0.00, 0.00, 16.00], //Monday
    [weekday[2], 8.00, 12.00, 14.00, 18.00], //Tuesday
    [weekday[3], 8.00, 0.00, 0.00, 16.00], //Wednesday
    [weekday[4], 8.00, 12.00, 14.00, 18.00], //Thursday
    [weekday[5], 8.00, 0.00, 0.00, 16.00], //Friday
    [weekday[6], 8.00, 12.00, 0.00, 0.00], //Saturday
]



//FUNCTION STATUS OPEN SHOP
window.IsOpenOn = (_dateTime) =>{
    
    //Date récupérer de l'interface au bon format
    const newDateTime = new Date(_dateTime)
    const day = newDateTime.getDay()
    const hoursMin = newDateTime.getHours()+"."+newDateTime.getMinutes()
        
    //Est-ce qu'il est ouvert le matin ( >= que ouverture matin, plus <= que fermerture matin)
    if((hoursMin >= shopOpening[day][1] && hoursMin <= shopOpening[day][2])){

        console.log("IsOpen : ", "OUVERT Matin")
        document.getElementById("textIsOpen").innerHTML = "<span style='color : green;'>Ouvert</span>"
        return true //ou 1 ouvert matin
    }

    //Est-ce qu'il est ouvert en après midi (>= que ouverture après midi, plus <= que fermeture soir et en dehors des heures du matin)
    if(hoursMin >= shopOpening[day][3] && hoursMin <= shopOpening[day][4] && hoursMin >= shopOpening[day][1] && hoursMin >= shopOpening[day][2]){

        console.log("IsOpen : ", "OUVERT après midi")
        document.getElementById("textIsOpen").innerHTML = "<span style='color : green;'>Ouvert</span>"
        return true // ou 2 ouvert après midi
    }


    //Sinon le magasin est fermé
    else{
        console.log("IsOpen : ", "FERME")
        document.getElementById("textIsOpen").innerHTML = "<span style='color : red;'>Fermé</span>"
        return false //ou 3 fermé
    }
}


//Demande une date et retourne le prochain jours d'heure d'ouverture
const NextOpeningDate = (_dateTime) => {

    //Extraction en jour, heure , minutes
    let day = _dateTime.getDay()
    let hoursMin = _dateTime.getHours()+"."+_dateTime.getMinutes() 

    let nextAvailableDayOfTheWeek  = 0;
    //variable texte d'affichage
    let textToShow = ""

    //Est-ce qu'aujoud'hui le magasin est encore ouvert, test du matin 
    if(hoursMin > shopOpening[day][1] && hoursMin <= shopOpening[day][2]){
        textToShow = weekday[day][0]+ " le matin à "+ shopOpening[day][1]
    }
    // test si l'après midi
    else if(hoursMin > shopOpening[day][3] && hoursMin <= shopOpening[day][4]){
        textToShow = weekday[day][0]+ " l'après-midi à "+ shopOpening[day][3]
    }
    else{
        hoursMin = 0.00
        nextAvailableDayOfTheWeek = day + 1

        //Pour n'oublier aucun jour, nous parcourons deux fois les jours de la semaine.
        for (let i = 0; i < 14; i++){
            if(nextAvailableDayOfTheWeek === 7){
                nextAvailableDayOfTheWeek = 0
            }

            //Si le prochain jour ouvert matinale à une heure d'ouverture est plus grande que 00.00
            if(hoursMin <= shopOpening[nextAvailableDayOfTheWeek][1] ){
                textToShow = weekday[nextAvailableDayOfTheWeek][0]+ " à "+ shopOpening[nextAvailableDayOfTheWeek][1]
            }
        
            //Si le prochain jour après midi d'ouverture est plus grand que 00.00
            else if(hoursMin <= shopOpening[nextAvailableDayOfTheWeek][3]){
                textToShow = weekday[nextAvailableDayOfTheWeek][0]+ " à "+ shopOpening[nextAvailableDayOfTheWeek][3]
            }
            
            nextAvailableDayOfTheWeek++;
        }
    }
    document.getElementById('nextShopOpen').innerHTML = "( Prochaine ouverture : "+textToShow +" h )"
}


//AFFICHAGE DES INFORMATIONS 

const formSchedule = () => {

    let form = document.querySelector("form.openShopForm");

    shopOpening.map((element) => {
        form.innerHTML += `<input type="text" value="${element[0][1]}" class="inputDay" disabled/>`
        form.innerHTML += `<label>Ouverture matin </label><input type="text" value="${element[1] === 0 ? "" : Number(element[1])+" h"} " disabled />`
        form.innerHTML += `<label>Fermture midi</label><input type="text" value="${element[2] === 0 ? "" : Number(element[2])+" h"} " disabled/>`
        form.innerHTML += `<label>Ouverture après midi</label><input type="text" value="${element[3] === 0 ? "" : Number(element[3])+" h"} " disabled/>`
        form.innerHTML += `<label>Fermeture après midi</label><input type="text" value="${element[4] === 0 ? "" : Number(element[4])+" h"} " disabled/><br>`
    })
}

formSchedule()




//Pool variable pour tester les valeurs
let wednesday = new Date('2016-05-11T12:22:11.824') //True
let wednesday2 = new Date('2016-05-11T07:22:11.824') //True
let thursday = new Date('2016-05-12T12:22:11.824') //false
let saturday = new Date('2016-05-14T09:15:00.000') //True
let sunday = new Date('2016-05-15T09:15:00.000')  //false
let friday_morning = new Date('2016-05-13T08:00:00.000') //true
let monday_morning = new Date('2016-05-16T08:00:00.000') //true
let thursday_afternoon = new Date('2016-05-12T14:00:00.000') //true


// Affectez une nouvelle valeur pour tester la fonction
IsOpenOn(new Date())

//Malheureusement quelques bugs subsistent
console.log(NextOpeningDate(new Date()))