/*
 ___________
< Variables >
 -----------
   \
    \
     \
                '-.
      .---._     \ \.--'
    /       `-..__)  ,-'
   |    0           /
    \--.__,   .__.,`
     `-.___'._\_.'

*/

// const competition_id = 10087; // testing
const competition_id = 11769; // live

const competition_url = `https://api.wiseoldman.net/competitions/${competition_id}`;
const metric_url = `https://api.wiseoldman.net/competitions/${competition_id}?metric=`;
const all_skills = {
  magic: "combat_fast",
  ranged: "combat_fast",
  prayer: "combat_fast",
  attack: "combat_slow",
  strength: "combat_slow",
  defence: "combat_slow",
  hitpoints: "combat_slow",
  construction: "skilling_buyable",
  farming: "skilling_buyable",
  fletching: "skilling_buyable",
  cooking: "skilling_fast",
  herblore: "skilling_fast",
  crafting: "skilling_fast",
  smithing: "skilling_fast",
  firemaking: "skilling_fast",
  thieving: "skilling_fast",
  hunter: "skilling_fast",
  agility: "skilling_slow",
  mining: "skilling_slow",
  fishing: "skilling_slow",
  slayer: "skilling_slow",
  runecrafting: "skilling_slow",
  woodcutting: "skilling_slow",
};
// manually update
const player_pets = {
  vonzlex: {
    pvm: "Prince_black_dragon",
  },
};
const player_page = window.location.href.includes("player");
let category, column;
let apiReqCount = 0;

/*
 ___________________________
< Functions - Data Handling >
 ---------------------------
   \
    \
     \
                '-.
      .---._     \ \.--'
    /       `-..__)  ,-'
   |    0           /
    \--.__,   .__.,`
     `-.___'._\_.'
*/

// Function to hide the loader
showLoader = () => {
  document.getElementById("loading").style.display = "block";
};
hideLoader = () => {
  document.getElementById("loading").style.display = "none";
};

// Async function for competition data
getData = async (url) => {
  // Storing response
  const response = await fetch(url);
  showLoader();
  // Storing data in form of JSON
  var data = await response.json();
  apiReqCount++;
  createPlayerArray(data);
};

// Create player array
createPlayerArray = (data) => {
  let playerArray = [];
  for (var i = 0; i < data.participants.length; i++) {
    if (data.participants[i].progress.gained > 0) {
      playerArray.push({
        name: data.participants[i].displayName,
        totalXP: data.participants[i].progress.gained,
        combatXP: 0,
        skillingXP: 0,
        combat_fast: 0,
        combat_slow: 0,
        skilling_buyable: 0,
        skilling_fast: 0,
        skilling_slow: 0,
        skills: {},
      });
    }
  }
  window.PLAYER_ARRAY = playerArray;

  for (skill in all_skills) {
    getSkillXP(metric_url + skill, skill, all_skills[skill]);
  }
};

// Async function for player combat xp data
getSkillXP = async (url, skillName, skillCategory) => {
  // Storing response
  const response = await fetch(url);
  var data = await response.json();
  apiReqCount++;
  for (var i = 0; i < data.participants.length; i++) {
    for (var j = 0; j < window.PLAYER_ARRAY.length; j++) {
      if (data.participants[i].displayName == window.PLAYER_ARRAY[j].name) {
        if (skillCategory == "combat_fast") {
          if (data.participants[i].progress.gained <= 2500000) {
            window.PLAYER_ARRAY[j].skills[skillName] =
              data.participants[i].progress.gained;
            window.PLAYER_ARRAY[j].combat_fast +=
              data.participants[i].progress.gained;
          } else {
            window.PLAYER_ARRAY[j].skills[skillName] = 2500000;
            window.PLAYER_ARRAY[j].combat_fast += 2500000;
          }
        } else if (skillCategory == "skilling_buyable") {
          if (data.participants[i].progress.gained <= 2500000) {
            window.PLAYER_ARRAY[j].skills[skillName] =
              data.participants[i].progress.gained;
            window.PLAYER_ARRAY[j].skilling_buyable +=
              data.participants[i].progress.gained;
          } else {
            window.PLAYER_ARRAY[j].skills[skillName] = 2500000;
            window.PLAYER_ARRAY[j].skilling_buyable += 2500000;
          }
        } else if (skillCategory == "combat_slow") {
          if (data.participants[i].progress.gained <= 5000000) {
            window.PLAYER_ARRAY[j].skills[skillName] =
              data.participants[i].progress.gained;
            window.PLAYER_ARRAY[j].combat_slow +=
              data.participants[i].progress.gained;
          } else {
            window.PLAYER_ARRAY[j].skills[skillName] = 5000000;
            window.PLAYER_ARRAY[j].combat_slow += 5000000;
          }
        } else if (skillCategory == "skilling_fast") {
          if (data.participants[i].progress.gained <= 5000000) {
            window.PLAYER_ARRAY[j].skills[skillName] =
              data.participants[i].progress.gained;
            window.PLAYER_ARRAY[j].skilling_fast +=
              data.participants[i].progress.gained;
          } else {
            window.PLAYER_ARRAY[j].skills[skillName] = 5000000;
            window.PLAYER_ARRAY[j].skilling_fast += 5000000;
          }
        } else {
          window.PLAYER_ARRAY[j].skills[skillName] = Math.ceil(
            data.participants[i].progress.gained * 2.5
          );
          window.PLAYER_ARRAY[j].skilling_slow += Math.ceil(
            data.participants[i].progress.gained * 2.5
          );
        }
      }
    }
  }
  if (apiReqCount == 24) {
    checkPets();
  }
};

checkPets = () => {
  for (var i = 0; i < window.PLAYER_ARRAY.length; i++) {
    const currentPlayer = window.PLAYER_ARRAY[i].name.toLowerCase();
    if (currentPlayer in player_pets) {
      if (player_pets[currentPlayer].pvm) {
        window.PLAYER_ARRAY[i].skills.hitpoints += 1000000;
        window.PLAYER_ARRAY[i].combat_slow += 1000000;
      }
      if (player_pets[currentPlayer].farming) {
        window.PLAYER_ARRAY[i].skills.farming += 1000000;
        window.PLAYER_ARRAY[i].skilling_buyable += 1000000;
      }
      if (player_pets[currentPlayer].thieving) {
        window.PLAYER_ARRAY[i].skills.thieving += 1000000;
        window.PLAYER_ARRAY[i].skilling_fast += 1000000;
      }
      if (player_pets[currentPlayer].hunter) {
        window.PLAYER_ARRAY[i].skills.hunter += 1000000;
        window.PLAYER_ARRAY[i].skilling_fast += 1000000;
      }
      if (player_pets[currentPlayer].agility) {
        window.PLAYER_ARRAY[i].skills.agility += 1000000;
        window.PLAYER_ARRAY[i].skilling_slow += 1000000;
      }
      if (player_pets[currentPlayer].mining) {
        window.PLAYER_ARRAY[i].skills.mining += 1000000;
        window.PLAYER_ARRAY[i].skilling_slow += 1000000;
      }
      if (player_pets[currentPlayer].fishing) {
        window.PLAYER_ARRAY[i].skills.fishing += 1000000;
        window.PLAYER_ARRAY[i].skilling_slow += 1000000;
      }
      if (player_pets[currentPlayer].slayer) {
        window.PLAYER_ARRAY[i].skills.slayer += 1000000;
        window.PLAYER_ARRAY[i].skilling_slow += 1000000;
      }
      if (player_pets[currentPlayer].runecrafting) {
        window.PLAYER_ARRAY[i].skills.runecrafting += 1000000;
        window.PLAYER_ARRAY[i].skilling_slow += 1000000;
      }
      if (player_pets[currentPlayer].woodcutting) {
        window.PLAYER_ARRAY[i].skills.woodcutting += 1000000;
        window.PLAYER_ARRAY[i].skilling_slow += 1000000;
      }
    }
  }
  calcTotalXP();
};

// Array to calculate skilling XP
calcTotalXP = () => {
  for (var i = 0; i < window.PLAYER_ARRAY.length; i++) {
    window.PLAYER_ARRAY[i].combatXP =
      window.PLAYER_ARRAY[i].combat_fast + window.PLAYER_ARRAY[i].combat_slow;
    window.PLAYER_ARRAY[i].skillingXP =
      window.PLAYER_ARRAY[i].skilling_buyable +
      window.PLAYER_ARRAY[i].skilling_fast +
      window.PLAYER_ARRAY[i].skilling_slow;
    window.PLAYER_ARRAY[i].totalXP =
      window.PLAYER_ARRAY[i].combatXP + window.PLAYER_ARRAY[i].skillingXP;
  }
  hideLoader();
  if (player_page) {
    window.showPlayerData();
  } else {
    showExperienceData();
  }
};

/*
 ___________________________
< Functions - Tables & Sums >
 ---------------------------
   \
    \
     \
                '-.
      .---._     \ \.--'
    /       `-..__)  ,-'
   |    0           /
    \--.__,   .__.,`
     `-.___'._\_.'
*/

// Function to define innerHTML for HTML table
showExperienceData = (category, column) => {
  const table = document.getElementById("players");
  let tab = "<tr><th class='clickable' onclick='sortTable(0)'>Player Name</th>";
  if (category == "overall" || !category) {
    tab += "<th class='clickable' onclick='sortTable(1)'>Total XP</th>";
    tab += "<th class='clickable' onclick='sortTable(2)'>Combat XP</th>";
    tab += "<th class='clickable' onclick='sortTable(3)'>Skilling XP</th>";
  } else if (category == "combat_fast") {
    tab +=
      "<th class='clickable' onclick='sortTable(1)'><em>Combat - Big XP</em></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(2)'>Magic XP<br /><img src='./images/Magic_icon.png' class='skillIcon'></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(3)'>Ranged XP<br /><img src='./images/Ranged_icon.png' class='skillIcon'></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(4)'>Prayer XP<br /><img src='./images/Prayer_icon.png' class='skillIcon'></th>";
  } else if (category == "combat_slow") {
    tab +=
      "<th class='clickable' onclick='sortTable(1)'><em>Combat - Melee</em></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(2)'>Attack XP<br /><img src='./images/Attack_icon.png' class='skillIcon'></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(3)'>Strength XP<br /><img src='./images/Strength_icon.png' class='skillIcon'></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(4)'>Defence XP<br /><img src='./images/Defence_icon.png' class='skillIcon'></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(5)'>Hitpoints XP<br /><img src='./images/Hitpoints_icon.png' class='skillIcon'></th>";
  } else if (category == "skilling_buyable") {
    tab +=
      "<th class='clickable' onclick='sortTable(1)'><em>Skilling - Big XP Buyables</em></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(2)'>Construction XP<br /><img src='./images/Construction_icon.png' class='skillIcon'></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(3)'>Farming XP<br /><img src='./images/Farming_icon.png' class='skillIcon'></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(4)'>Fletching XP<br /><img src='./images/Fletching_icon.png' class='skillIcon'></th>";
  } else if (category == "skilling_fast") {
    tab +=
      "<th class='clickable' onclick='sortTable(1)'><em>Skilling - Fast Gains</em></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(2)'>Cooking XP<br /><img src='./images/Cooking_icon.png' class='skillIcon'></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(3)'>Herblore XP<br /><img src='./images/Herblore_icon.png' class='skillIcon'></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(4)'>Crafting XP<br /><img src='./images/Crafting_icon.png' class='skillIcon'></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(5)'>Smithing XP<br /><img src='./images/Smithing_icon.png' class='skillIcon'></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(6)'>Firemaking XP<br /><img src='./images/Firemaking_icon.png' class='skillIcon'></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(7)'>Thieving XP<br /><img src='./images/Thieving_icon.png' class='skillIcon'></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(8)'>Hunter XP<br /><img src='./images/Hunter_icon.png' class='skillIcon'></th>";
  } else if (category == "skilling_slow") {
    tab +=
      "<th class='clickable' onclick='sortTable(1)'><em>Skilling - Slow Gains</em></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(2)'>Agility XP<br /><img src='./images/Agility_icon.png' class='skillIcon'></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(3)'>Mining XP<br /><img src='./images/Mining_icon.png' class='skillIcon'></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(4)'>Fishing XP<br /><img src='./images/Fishing_icon.png' class='skillIcon'></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(5)'>Slayer XP<br /><img src='./images/Slayer_icon.png' class='skillIcon'></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(6)'>Runecrafting XP<br /><img src='./images/Runecraft_icon.png' class='skillIcon'></th>";
    tab +=
      "<th class='clickable' onclick='sortTable(7)'>Woodcutting XP<br /><img src='./images/Woodcutting_icon.png' class='skillIcon'></th>";
  }
  tab += "</tr>";
  for (let p of window.PLAYER_ARRAY) {
    if (category == "overall" || !category) {
      tab += `<tr>
        <td><a href="./player.html?player=${p.name}" class="player-link">${
        p.name
      }</a></td>
        <td>${p.totalXP.toLocaleString("en-US")} </td>
        <td>${p.combatXP.toLocaleString("en-US")} </td>
        <td>${p.skillingXP.toLocaleString("en-US")} </td>
        </tr>`;
    } else if (category == "combat_fast") {
      tab += `<tr>
        <td><a href="./player.html?player=${p.name}" class="player-link">${
        p.name
      }</a></td>
        <td>${p.combat_fast.toLocaleString("en-US")} </td>
        <td>${p.skills.magic.toLocaleString("en-US")} </td>
        <td>${p.skills.ranged.toLocaleString("en-US")} </td>
        <td>${p.skills.prayer.toLocaleString("en-US")} </td>
        </tr>`;
    } else if (category == "combat_slow") {
      tab += `<tr>
        <td><a href="./player.html?player=${p.name}" class="player-link">${
        p.name
      }</a></td>
        <td>${p.combat_slow.toLocaleString("en-US")} </td>
        <td>${p.skills.attack.toLocaleString("en-US")} </td>
        <td>${p.skills.strength.toLocaleString("en-US")} </td>
        <td>${p.skills.defence.toLocaleString("en-US")} </td>
        <td>${p.skills.hitpoints.toLocaleString("en-US")} </td>
        </tr>`;
    } else if (category == "skilling_buyable") {
      tab += `<tr>
        <td><a href="./player.html?player=${p.name}" class="player-link">${
        p.name
      }</a></td>
        <td>${p.skilling_buyable.toLocaleString("en-US")} </td>
        <td>${p.skills.construction.toLocaleString("en-US")} </td>
        <td>${p.skills.farming.toLocaleString("en-US")} </td>
        <td>${p.skills.fletching.toLocaleString("en-US")} </td>
        </tr>`;
    } else if (category == "skilling_fast") {
      tab += `<tr>
        <td><a href="./player.html?player=${p.name}" class="player-link">${
        p.name
      }</a></td>
        <td>${p.skilling_fast.toLocaleString("en-US")} </td>
        <td>${p.skills.cooking.toLocaleString("en-US")} </td>
        <td>${p.skills.herblore.toLocaleString("en-US")} </td>
        <td>${p.skills.crafting.toLocaleString("en-US")} </td>
        <td>${p.skills.smithing.toLocaleString("en-US")} </td>
        <td>${p.skills.firemaking.toLocaleString("en-US")} </td>
        <td>${p.skills.thieving.toLocaleString("en-US")} </td>
        <td>${p.skills.hunter.toLocaleString("en-US")} </td>
        </tr>`;
    } else if (category == "skilling_slow") {
      tab += `<tr>
        <td><a href="./player.html?player=${p.name}" class="player-link">${
        p.name
      }</a></td>
        <td>${p.skilling_slow.toLocaleString("en-US")} </td>
        <td>${p.skills.agility.toLocaleString("en-US")} </td>
        <td>${p.skills.mining.toLocaleString("en-US")} </td>
        <td>${p.skills.fishing.toLocaleString("en-US")} </td>
        <td>${p.skills.slayer.toLocaleString("en-US")} </td>
        <td>${p.skills.runecrafting.toLocaleString("en-US")} </td>
        <td>${p.skills.woodcutting.toLocaleString("en-US")} </td>
        </tr>`;
    }
  }
  table.innerHTML = tab;
  if (category == "overall" || !category) {
    sumXP();
    removeActiveCategoryFilter();
    addActiveCategoryFilter("c1");
  } else {
    removeActiveCategoryFilter();
    addActiveCategoryFilter(column);
    addPetIcons(category);
  }
  document.getElementById("searchField").value = "";
  sortTable(1);
  colorCells(category);
};

sumXP = () => {
  const table = document.getElementById("players");

  if (!document.getElementById("totals")) {
    table.innerHTML += `
    <tr id="totals">
    <th>TOTALS</th>
    <th>Total XP: <br />0</th>
    <th>Combat XP: <br />0</th>
    <th>Skilling XP: <br />0</th>
    </tr>
    `;
  }

  let totalXP = 0;
  let combatXP = 0;
  let skillingXP = 0;
  for (var i = 1; i < table.rows.length - 1; i++) {
    if (!table.rows[i].classList.contains("hide")) {
      totalXP += parseFloat(table.rows[i].cells[1].innerHTML.replace(/,/g, ""));
      combatXP += parseFloat(
        table.rows[i].cells[2].innerHTML.replace(/,/g, "")
      );
      skillingXP += parseFloat(
        table.rows[i].cells[3].innerHTML.replace(/,/g, "")
      );
    }
  }
  totalXP = totalXP.toLocaleString("en-US");
  combatXP = combatXP.toLocaleString("en-US");
  skillingXP = skillingXP.toLocaleString("en-US");

  let tab = `<tr id="totals">
    <th>TOTALS</th>
    <th>Total XP: <br />${totalXP}</th>
    <th>Combat XP: <br />${combatXP}</th>
    <th>Skilling XP: <br />${skillingXP}</th>
  </tr>`;
  document.getElementById("totals").innerHTML = tab;
};

addPetIcons = (category) => {
  const table = document.getElementById("players");
  for (var i = 1; i < table.rows.length - 1; i++) {
    const currentPlayer = table.rows[i].cells[0].innerHTML
      .replace(/(<([^>]+)>)/gi, "")
      .toLowerCase();
    if (currentPlayer in player_pets) {
      if (player_pets[currentPlayer].pvm && category == "combat_slow") {
        table.rows[
          i
        ].cells[5].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].pvm}.png" class="pet-icon" title="${player_pets[currentPlayer].pvm}" />`;
      }
      if (
        player_pets[currentPlayer].farming &&
        category == "skilling_buyable"
      ) {
        table.rows[
          i
        ].cells[3].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].farming}.png" class="pet-icon" title="${player_pets[currentPlayer].farming}" />`;
      }
      if (player_pets[currentPlayer].thieving && category == "skilling_fast") {
        table.rows[
          i
        ].cells[7].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].thieving}.png" class="pet-icon" title="${player_pets[currentPlayer].thieving}" />`;
      }
      if (player_pets[currentPlayer].hunter && category == "skilling_fast") {
        table.rows[
          i
        ].cells[8].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].hunter}.png" class="pet-icon" title="${player_pets[currentPlayer].hunter}" />`;
      }
      if (player_pets[currentPlayer].agility && category == "skilling_slow") {
        table.rows[
          i
        ].cells[2].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].agility}.png" class="pet-icon" title="${player_pets[currentPlayer].agility}" />`;
      }
      if (player_pets[currentPlayer].mining && category == "skilling_slow") {
        table.rows[
          i
        ].cells[3].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].mining}.png" class="pet-icon" title="${player_pets[currentPlayer].mining}" />`;
      }
      if (player_pets[currentPlayer].fishing && category == "skilling_slow") {
        table.rows[
          i
        ].cells[4].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].fishing}.png" class="pet-icon" title="${player_pets[currentPlayer].fishing}" />`;
      }
      if (player_pets[currentPlayer].slayer && category == "skilling_slow") {
        table.rows[
          i
        ].cells[5].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].slayer}.png" class="pet-icon" title="${player_pets[currentPlayer].slayer}" />`;
      }
      if (
        player_pets[currentPlayer].runecrafting &&
        category == "skilling_slow"
      ) {
        table.rows[
          i
        ].cells[6].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].runecrafting}.png" class="pet-icon" title="${player_pets[currentPlayer].runecrafting}" />`;
      }
      if (
        player_pets[currentPlayer].woodcutting &&
        category == "skilling_slow"
      ) {
        table.rows[
          i
        ].cells[7].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].woodcutting}.png" class="pet-icon" title="${player_pets[currentPlayer].woodcutting}" />`;
      }
    }
  }
};

window.addPetIconsIndividual = (currentPlayer) => {
  const table = document.getElementById("individual");
  if (currentPlayer in player_pets) {
    if (player_pets[currentPlayer].pvm) {
      table.rows[9].cells[1].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].pvm}.png" class="pet-icon" title="${player_pets[currentPlayer].pvm}" />`;
    }
    if (player_pets[currentPlayer].farming) {
      table.rows[23].cells[1].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].farming}.png" class="pet-icon" title="${player_pets[currentPlayer].farming}" />`;
    }
    if (player_pets[currentPlayer].thieving) {
      table.rows[12].cells[1].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].thieving}.png" class="pet-icon" title="${player_pets[currentPlayer].thieving}" />`;
    }
    if (player_pets[currentPlayer].hunter) {
      table.rows[16].cells[1].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].hunter}.png" class="pet-icon" title="${player_pets[currentPlayer].hunter}" />`;
    }
    if (player_pets[currentPlayer].agility) {
      table.rows[10].cells[1].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].agility}.png" class="pet-icon" title="${player_pets[currentPlayer].agility}" />`;
    }
    if (player_pets[currentPlayer].mining) {
      table.rows[17].cells[1].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].mining}.png" class="pet-icon" title="${player_pets[currentPlayer].mining}" />`;
    }
    if (player_pets[currentPlayer].fishing) {
      table.rows[19].cells[1].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].fishing}.png" class="pet-icon" title="${player_pets[currentPlayer].fishing}" />`;
    }
    if (player_pets[currentPlayer].slayer) {
      table.rows[15].cells[1].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].slayer}.png" class="pet-icon" title="${player_pets[currentPlayer].slayer}" />`;
    }
    if (player_pets[currentPlayer].runecrafting) {
      table.rows[7].cells[1].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].runecrafting}.png" class="pet-icon" title="${player_pets[currentPlayer].runecrafting}" />`;
    }
    if (player_pets[currentPlayer].woodcutting) {
      table.rows[22].cells[1].innerHTML += `  <img src="./images/pets/${player_pets[currentPlayer].woodcutting}.png" class="pet-icon" title="${player_pets[currentPlayer].woodcutting}" />`;
    }
  }
};

window.onerror = () => {
  showErrorMessage(
    "Oops, something went wrong! Please wait a few seconds for the data to populate."
  );
};

showErrorMessage = (msg) => {
  const errorDiv = document.getElementById("errorMessage");
  errorDiv.innerHTML = msg;
  errorDiv.classList.add("show");
  setTimeout(() => {
    errorDiv.classList.remove("show");
  }, 3000);
  setTimeout(() => {
    errorDiv.innerHTML = "";
  }, 5000);
};

/*
 __________________________________
< Functions - Search, Filter, Sort >
 ----------------------------------
   \
    \
     \
                '-.
      .---._     \ \.--'
    /       `-..__)  ,-'
   |    0           /
    \--.__,   .__.,`
     `-.___'._\_.'

*/

// Search Functionality
let searchInput;
let timeout = null;

addSearch = () => {
  searchInput = document.getElementById("searchField");
  searchInput.addEventListener("keyup", function (e) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      var input, filter, table, tr, td, i;
      input = document.getElementById("searchField");
      filter = input.value.toUpperCase();

      table = document.getElementById("players");
      tr = table.getElementsByTagName("tr");
      if (filter) {
        try {
          document.getElementById("totals").classList.add("hide");
        } catch (e) {}
        for (var i = 1; i < tr.length; i++) {
          // Hide the row initially.
          tr[i].classList.add("hide");
          td = tr[i].getElementsByTagName("td");
          for (var j = 0; j < 2; j++) {
            cell = tr[i].getElementsByTagName("td")[j];
            if (cell) {
              if (cell.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].classList.remove("hide");
                break;
              }
            }
          }
        }
        sortTable(2);
      } else {
        showExperienceData();
      }
      // Loop through all table rows, and hide those who don't match the search query
    }, 2500);
  });
};

removeActiveCategoryFilter = () => {
  for (
    var i = 0;
    i < document.getElementsByClassName("categorySelect").length;
    i++
  ) {
    document
      .getElementsByClassName("categorySelect")
      [i].classList.remove("currentCategory");
  }
};

addActiveCategoryFilter = (column) => {
  if (!column) {
    showExperienceData("overall", "c1");
  } else {
    document.getElementsByClassName(column)[0].classList.add("currentCategory");
  }
};

sortTable = (column) => {
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    tableHeight,
    switchcount = 0;
  table = document.getElementById("players");
  switching = true;
  dir = "desc";
  while (switching) {
    switching = false;
    rows = table.rows;
    if (document.getElementsByClassName("c1 currentCategory")) {
      tableHeight = 2;
    } else {
      tableHeight = 1;
    }
    for (i = 1; i < rows.length - tableHeight; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[column];
      y = rows[i + 1].getElementsByTagName("TD")[column];
      if (column > 0) {
        x = parseInt(x.innerHTML.replace(/\,/g, ""), 10);
        y = parseInt(y.innerHTML.replace(/\,/g, ""), 10);
      }
      if (dir == "desc" && column == 0) {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc" && column > 0) {
        if (x < y) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "asc" && column == 0) {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "asc" && column > 0) {
        if (x > y) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "desc") {
        dir = "asc";
        switching = true;
      }
    }
  }
};

colorCells = (category) => {
  const table = document.getElementById("players");
  for (var i = 1; i < table.rows.length - 1; i++) {
    for (var j = 2; j < table.rows[i].cells.length; j++) {
      if (
        category == "combat_fast" &&
        table.rows[i].cells[j].innerHTML.replace(/,/g, "") == 2500000
      ) {
        table.rows[i].cells[j].style.backgroundColor = "rgb(255, 0, 0, 0.4)";
      } else if (
        category == "skilling_buyable" &&
        table.rows[i].cells[j].innerHTML.replace(/,/g, "") == 2500000
      ) {
        table.rows[i].cells[j].style.backgroundColor = "rgb(0, 204, 0, 0.4)";
      } else if (
        category == "combat_slow" &&
        table.rows[i].cells[j].innerHTML.replace(/,/g, "") >= 5000000
      ) {
        table.rows[i].cells[j].style.backgroundColor = "rgb(0, 176, 240, 0.4)";
      } else if (
        category == "skilling_fast" &&
        table.rows[i].cells[j].innerHTML.replace(/,/g, "") >= 5000000
      ) {
        table.rows[i].cells[j].style.backgroundColor = "rgb(255, 102, 0, 0.4)";
      }
    }
  }
};

/*
 _______
< Start >
 -------
   \
    \
     \
                '-.
      .---._     \ \.--'
    /       `-..__)  ,-'
   |    0           /
    \--.__,   .__.,`
     `-.___'._\_.'
*/

// Add event listeners and run functions
if (!player_page) {
  addSearch();
}
getData(competition_url);
