import {gmailSecretkey} from '../secret-key'

/**
 * Application entry point
 */

// Load application styles
import 'styles/index.scss';

// ================================
// START YOUR APP HERE
// ================================

document.addEventListener("DOMContentLoaded", () => {

    const searchBut = document.getElementById("startButton");
    searchBut.addEventListener("click", handleZipRequest)
    // below works
    // searchBut.addEventListener("click", function(){console.log('buttonpressed1')})
})

function handleZipRequest(){
    return loadGmailClient()
}
function loadGmailClient() {
    gapi.client.setApiKey(`${gmailSecretkey}`)
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/civicinfo/v2/rest")
        .then( res => {
            console.log('response gotten')
            return executeGmailAddressFetch();
        },
        function(err) { console.error("Error loading GAPI client for API", err); })
}

function executeGmailAddressFetch(){
    console.log('executed')
    let zipCodeReq = document.getElementById('zipcode_request').value
    return gapi.client.civicinfo.representatives.representativeInfoByAddress({
        "address": `${zipCodeReq}`,
        "includeOffices": false,
        "levels": [
          "country"
        ]
      })
          .then(function(response) {
                  // Handle the results here (response.result has the parsed body).
                  console.log("Results", response.result);
                  console.log("Divisions", response.result.divisions);
                //   debugger
                solvePeopleResults(response.result.divisions)
                },
                function(err) { console.error("Execute error", err); });  
}

function solvePeopleResults(response){
    // console.log(response)
    let stateDistrict = Object.keys(response)
    let state = "";
    let districts = [];
    for(let i = 0; i < stateDistrict.length; i++){
        let stateName = stateDistrict[i].slice(0, 30)
        let districtName = stateDistrict[i].slice(0, 36)
        if (stateName === 'ocd-division/country:us/state:' && state === ""){
            state = stateDistrict[i].slice(30, 32)
        } else if (districtName == 'ocd-division/country:us/state:ca/cd:'){
            districts.push(stateDistrict[i].slice(36, 39))
        }
    }
    return getPotentialReps(state, districts)
    console.log(state)
    console.log(districts)
    // if (response.hasOwnProperty('ocd-division/country:us/state'))
    // console.log(stateDistrict)
}

function getPotentialReps(state, districts){
    
}
