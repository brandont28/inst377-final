//Fetches Agents
function getAgents () {
    fetch(`https://valorant-api.com/v1/agents`)
        .then((resp) => resp.json())
        .then((data) => {
            const agents = data.data;
            //Removes duplicate Sova agent as recommended by API
            const filteredAgents = agents.filter(agent => agent.isPlayableCharacter);
            const agentSlides = document.getElementById('agentSlides');

            filteredAgents.forEach(agent => {
                const div = document.createElement("div");
                const img = document.createElement("img");
                const name = document.createElement("h2");
                name.textContent = agent.displayName;
                img.src = agent.fullPortraitV2;
                div.appendChild(name);
                div.appendChild(img);
                agentSlides.appendChild(div);
            });

            const slider = simpleslider.getSlider( {
                container: agentSlides,
                delay: 4
            });

            document.getElementById('previousAgent').addEventListener('click', () => {
                slider.prev();
            });

            document.getElementById('nextAgent').addEventListener('click', () => {
                slider.next();
            });
        });
}

//Fetches Maps
function getMaps () {
    fetch(`https://valorant-api.com/v1/maps`)
        .then((resp) => resp.json())
        .then((data) => {
            const maps = data.data;
            //Filters out maps that are currently not in the competitive rotation (AS OF APRIL 2025)
            const allowedMaps = [
                'Ascent',
                'Icebox',
                'Sunset',
                'Haven',
                'Lotus',
                'Pearl',
                'Split'
            ];
            const filteredMaps = maps.filter(map => allowedMaps.includes(map.displayName));
            const mapSlides = document.getElementById('mapSlides');

            filteredMaps.forEach(map => {
                const div = document.createElement("div");
                const img = document.createElement("img");
                const name = document.createElement("h2");
                name.textContent = map.displayName;
                img.src = map.splash;
                div.appendChild(name);
                div.appendChild(img);
                mapSlides.appendChild(div);
            });

            const slider = simpleslider.getSlider({
                container: mapSlides,
                delay: 6
            });

            document.getElementById('previousMap').addEventListener('click', () => {
                slider.prev();
            });

            document.getElementById('nextMap').addEventListener('click', () => {
                slider.next();
            });
        });
}

function populateFavMap() {
    fetch(`https://valorant-api.com/v1/maps`)
        .then((resp) => resp.json())
        .then((data) => {
            const maps = data.data;
            //Filters out maps that are currently not in the competitive rotation (AS OF APRIL 2025)
            const allowedMaps = [
                'Ascent',
                'Icebox',
                'Sunset',
                'Haven',
                'Lotus',
                'Pearl',
                'Split'
            ];
            const filteredMaps = maps.filter(map => allowedMaps.includes(map.displayName));

            const mapsForm = document.getElementById('fav_map');

            filteredMaps.forEach(map => {
                const option = document.createElement('option');
                option.value = map.displayName;
                option.textContent = map.displayName;
                mapsForm.appendChild(option);
            })
        });
}

//Fetch Weapons
function getTopWeapons () {
    fetch(`https://valorant-api.com/v1/weapons`)
    .then((resp) => resp.json())
    .then((data) => {
        const vandal = "9c82e19d-4575-0200-1a81-3eacf00cf872";
        const phantom = "ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a";
        const operator = "a03b24d3-4319-996d-0f8c-94bbfba1dfc7";
        const weaponsList = document.getElementById('weapons');

        //Only selects these 3 weapons as they are the most known/used
        const top3Weapons = data.data.filter(weapon =>
        [vandal, phantom, operator].includes(weapon.uuid)
        );

        top3Weapons.forEach(weapon => {
            const div = document.createElement("div");
            const img = document.createElement("img");
            img.src = weapon.displayIcon;
            const name = document.createElement("span");

            name.textContent = weapon.displayName;
            div.appendChild(img);
            div.appendChild(name);
            weaponsList.appendChild(div);

        })
    });
}

//Fetch Competitive Ranks API
function getRanks () {
    fetch(`https://valorant-api.com/v1/competitivetiers`)
    .then((resp) => resp.json())
    .then((data) => {
        //Removes first 3 as they are non-ranks
        const tiers = data.data[data.data.length - 1].tiers;
        const tierNames = tiers.slice(3);
        const ranks = document.getElementById('ranks');

        //Creates elements to display rank names and their icons
        tierNames.forEach(tier => {
            const div = document.createElement('div');
            const rankName = tier.tierName;
            const img = document.createElement('img');
            const rankIcon = tier.smallIcon;

            img.src = rankIcon;

            const text = document.createElement('span');
            text.textContent = rankName;

            //Appends to sidebar
            div.appendChild(img);
            div.appendChild(text);
            ranks.appendChild(div);
        });
    });
}

//Specifies Function load based on what webpage currently on
window.onload = () => {
  if (document.body.dataset.page === 'home') {
    getAgents();
    getMaps();
    getTopWeapons();
    getRanks();
  }
  if (document.body.dataset.page === 'matcher') {
    populateFavMap();
  }
};

async function addUserInfo(event) {
    event.preventDefault();
    const form = event.target;

    const first_name = form.elements['first_name'].value;
    const last_name = form.elements['last_name'].value;
    const main_role = form.elements['main_role'].value;
    const fav_map = form.elements['fav_map'].value;

    try {
        const response = await fetch('/submit-user-info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ first_name, last_name, main_role, fav_map })
        });

        const result = await response.json();

        if (!result.success) {
        Toastify({
            text: "Failed to Submit Data!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#ff4655",
        }).showToast();
        return;
        }

        Toastify({
        text: "Data Submitted!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#a1bd48",
        }).showToast();

        // Show suggested agent
        displayAgentMatch(main_role, fav_map, result.suggestedAgent);

        form.reset();

    } catch (error) {
        Toastify({
        text: "Network or Server Error!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#ff4655",
        }).showToast();
    }
}

function displayAgentMatch(role, map, suggestedAgentName) {
    const selectedRole = document.getElementById('selectedRole');
    const selectedMap = document.getElementById('selectedMap');
    const suggestedAgent = document.getElementById('suggestedAgent');
    const matcherContent = document.getElementById('matcher-content');

    selectedRole.textContent = 'Your Main Role Is: ' + role;
    selectedMap.textContent = 'Your Favorite Map Is: ' + map;
    suggestedAgent.textContent = 'Your Suggested Agent: ' + suggestedAgentName;

    fetch(`https://valorant-api.com/v1/agents`)
        .then(resp => resp.json())
        .then(data => {
        const agents = data.data;
        const filteredAgents = agents.filter(agent => agent.isPlayableCharacter);
        const filteredAgent = filteredAgents.find(agent => agent.displayName === suggestedAgentName);

        if (filteredAgent) {
            const img = document.createElement("img");
            img.src = filteredAgent.fullPortraitV2;
            matcherContent.appendChild(img);
        }
        });
}

    // Attach event listener to form after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    form.addEventListener('submit', addUserInfo);
});