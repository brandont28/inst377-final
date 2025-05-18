const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.post('/submit-user-info', async (req, res) => {
  const { first_name, last_name, main_role, fav_map } = req.body;

  // Insert user info
  const { data, error } = await supabase.from('user_info').insert([
    { first_name, last_name, main_role, fav_map }
  ]);

  if (error) {
    return res.status(500).json({ success: false, message: 'Insert failed', error });
  }

  // Lookup agent suggestion
  const { data: matchData, error: matchError } = await supabase
    .from('agent_map_matcher')
    .select(main_role.toLowerCase())
    .eq('map_name', fav_map)
    .single();

  if (matchError) {
    return res.status(500).json({ success: false, message: 'Match lookup failed', error: matchError });
  }

  const suggestedAgentName = matchData[main_role.toLowerCase()];

  res.json({
    success: true,
    suggestedAgent: suggestedAgentName
  });
});

app.listen(port, () => {
  console.log(`App is Alive ${port}`);
});