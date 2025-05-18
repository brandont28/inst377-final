# inst377-final

Name: Brandon Truong

# Vercel Link:

https://inst377-final-one.vercel.app/

# Project Title:

Valorant Beginner Guide

# Project Description

This is a web based application for the final project of INST377 at the University of Maryland. This app uses API calls from the unofficial Valorant API, vaorant-api.com to pull data such as agents, maps, top weapons, and competitive rankings. The main functionality of the website allows users to input their own data which is then submitted to a SUPABASE database and in turn retrieves information on what the most viable agent is based on information pulled manually from tracker.gg and inputted into another database.

# Target Browsers

This application is targeted towards predominately desktop users such as Windows and Mac. Compatibility with mobile devices such as iOS and Android may be possible but is not guranteed as the application was not developed with those browsers in mind.

# Developer Manual

This portion covers instructions for future developers on how to install the application for their own use or extend it beyond the current scope.

1. Cloning the Repository
   In a terminal in the desired folder, run:

   - git clone git@github.com:brandont28/inst377-final.git

2. Installing Dependencies
   Ensure that node.js is installed on your system and enter this in the terminal:

   - npm install
   - npm init

   Install supabase as this is the backend database that is used for the agent matcher functionality:

   - npm install @supabase/supabase-js

   Install express in order to allow for this application to be a web app:

   - npm install express

   Install nodemon as well to assist in node.js development. It automatically restarts your node application when changes are detected:

   - npm install nodemon

Additional dependencies such as Javascript libraries of Simple-Slider and Toastify are already linked in the html files but more libraries can be added at any time.

3. SUPABASE Integration
   If it is desired that the application uses a different database, one can create a new project on supabase.com. Current table names are user_info and agent_map_matcher so any reference to these supabase tables must be changed if using alternative names. Additionally, a new supabase URL and supabase key will need to be generated and implemented.

4. Running The Applcation
   The application is able to be run locally as well as through the Vercel link. To run the application locally, input this into the terminal:

   - npm start

   This should return 'App is Alive 3000' meaning that the application is now running on http://localhost:3000. Input this URL into a desktop web browser and the application should be working.
   NOTE: Do not double click on an HTML file and attempt to run it in that manner, the application will not work.

5. API Documentation
   This application utilizes multiple fetch API calls in the public javascript file as well as a POST to the supabase databse. API endpoints include:

   Fetches all agent information from the API and returns agent names and display images. Javascript code filters out a duplicate 'Sova' object. Used on the home slider page as well as when displaying the matched agent on the agent matcher page.

   - https://valorant-api.com/v1/agents

   Fetches all map information from the API and returns map names and splash screen images. Javascript code filters out only maps in active competitive rotation currently. This is used twice to populate the map slider as well as populating the favorite map selection form.

   - https://valorant-api.com/v1/maps

   Fetches all weapon information from the API and returns the name and display icon. Javascript code filters for only the Vandal, Phantom, and Operator specifically as those are the most used and popular weapons.

   - https://valorant-api.com/v1/weapons

   Fetches all competitive tier information from the API and returns the tier name and icon. Javascript code filters out the first 3 objects as they are either unused or considered unranked.

   - https://valorant-api.com/v1/competitivetiers

   Post to the supabase table called user-info when user inputs information and submits the userForm located in the INST377_final_agentMatcher.html file.

   - app.post('/submit-user-info', async (req, res) {
     ...
     const { data, error } = await supabase.from('user_info').insert([
     { first_name, last_name, main_role, fav_map }
     ]);
     ...
     })

   Fetches the posted information from the previous post method and returns a singular agent from the agent_map_matcher table using user inputted role and favorite map.

   - const { data: matchData, error: matchError } = await supabase
     .from('agent_map_matcher')
     .select(main_role.toLowerCase())
     .eq('map_name', fav_map)
     .single();

6. Possible Extensions
   Current implementation is reliant on a static elements such as the current competitive map rotation pool as well as the agent_map_matcher table. Additional future development could automatically retrieve data from tracker.gg if an API is available or another source to retrieve information such as win rate. More visual statistics may also be added as well as React.JS implementation to give the application a more professional look.
