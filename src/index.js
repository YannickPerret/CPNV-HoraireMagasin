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


*/

"use strict";
import './style/_settings.scss'


//Start by Sunday !
const weekday = [["Sunday","Sun"],["Monday", "Mon"],["Tuesday", "Tues"],["Wednesday", "Wed"],["Thursday", "Thurs"],["Friday", "Fri"],["Saturday", "Sat"]]; 
const date = new Date()

let shopOpening = [
    [weekday[0], 0.00, 0.00, 0.00, 0.00], //Sunday
    [weekday[1], 8.00, 0.00, 0.00, 16.00], //Monday
    [weekday[2], 8.00, 12.00, 14.00, 18.00], //Tuesday
    [weekday[3], 8.00, 0.00, 0.00, 16.00], //Wednesday
    [weekday[4], 8.00, 12.00, 14.00, 18.00], //Thursday
    [weekday[5], 8.00, 0.00, 0.00, 16.00], //Friday
    [weekday[6], 8.00, 12.00, 0.00, 0.00], //Saturday
]


//test value
let wednesday = new Date('2016-05-11T12:22:11.824') //True
let thursday = new Date('2016-05-12T12:22:11.824') //false
let saturday = new Date('2016-05-14T09:15:00.000') //True
let sunday = new Date('2016-05-15T09:15:00.000')  //false
let friday_morning = new Date('2016-05-13T08:00:00.000') //true
let monday_morning = new Date('2016-05-16T08:00:00.000') //true
let thursday_afternoon = new Date('2016-05-12T14:00:00.000') //true



//test value success
window.IsOpenOn = (_dateTime) =>{
    _dateTime = new Date(_dateTime)
    const day = _dateTime.getDay()
    const hoursMin = _dateTime.getHours()+"."+_dateTime.getMinutes()
    

    //console.log(hoursMin, ["shop", shopOpening[_dateTime.getDay()][1], shopOpening[_dateTime.getDay()][2],shopOpening[_dateTime.getDay()][3], shopOpening[_dateTime.getDay()][4]])

    console.log(hoursMin, shopOpening[day][1])
    if((hoursMin >= shopOpening[day][1] && hoursMin <= shopOpening[day][2]) || (hoursMin >= shopOpening[day][3] && hoursMin <= shopOpening[day][4])){
        console.log("OUVERT")
        document.getElementById("textIsOpen").innerHTML = "<span style='color : green;'>Ouvert</span>"
        return true
    }
    else{
        console.log("FERME")
        document.getElementById("textIsOpen").innerHTML = "<span style='color : red;'>Fermé</span>"
        return false
    }
}



const NextOpeningDate = (_dateTime) => {
   //dimanche 09:15 -> next lundi 08.00
    let day = _dateTime.getDay()
    let hoursMin = _dateTime.getHours()+"."+_dateTime.getMinutes() 

    let nextAvailableDayOfTheWeek  = 0;


    if(hoursMin > shopOpening[day][1] || hoursMin > shopOpening[day][3])
    {
        for (let i = 0; i < 14; i++){
            if(nextAvailableDayOfTheWeek === 7){
                nextAvailableDayOfTheWeek = 0
            }

            if(shopOpening[nextAvailableDayOfTheWeek][1] > hoursMin){ //test si l'horaire du matin est le plus grand
                console.log("oui")
                return ["prochaine ouverture :", weekday[nextAvailableDayOfTheWeek][0], " à ", shopOpening[nextAvailableDayOfTheWeek][1]]
            }
        
            else if(shopOpening[nextAvailableDayOfTheWeek][3] > hoursMin){ //Sinon si l'après midi est plus grand
                console.log("oui2")

                return["prochaine ouverture :", weekday[nextAvailableDayOfTheWeek][0], " à ", shopOpening[nextAvailableDayOfTheWeek][3]]
            }
            

            hoursMin = 0.00
            nextAvailableDayOfTheWeek++;
        }
    }
    else{
        return ["prochaine ouverture : ", "Today", " at ", ]
        
        //Dans la même journée la prochaine heure d'ouverture        
    }
}

console.log(NextOpeningDate(wednesday))


const formSchedule = () => {

    let form = document.querySelector("form.openShopForm");

    shopOpening.map((element) => {
        form.innerHTML += `<input type="text" value="${element[0][1]}" class="inputDay" />`
        form.innerHTML += `<label>Ouverture matin </label><input type="text" value="${element[1] === 0 ? "" : element[1]}" />`
        form.innerHTML += `<label>Fermture midi</label><input type="text" value="${element[2] === 0 ? "" : element[2]}" />`
        form.innerHTML += `<label>Ouverture après midi</label><input type="text" value="${element[3] === 0 ? "" : element[3]}" />`
        form.innerHTML += `<label>Fermeture après midi</label><input type="text" value="${element[4] === 0 ? "" : element[4]}" /><br>`
    })
}

formSchedule()
IsOpenOn(new Date())