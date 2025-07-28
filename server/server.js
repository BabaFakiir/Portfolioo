const express = require('express');

// server.js
const { createClient } = require('@supabase/supabase-js');

// Replace with your actual Supabase URL and service role key (found in Supabase dashboard under Project Settings → API)
const supabaseUrl = 'https://fbcequeftvgcysbrjuma.supabase.co';
const supabaseKey = 'sb_publishable_rJ5YVabMqPb2wI67qM-YSQ_qe89-muU'; // Keep this secret, don’t expose to frontend

const supabase = createClient(supabaseUrl, supabaseKey);


const app = express();
const PORT = 5050;

app.use(express.json());

// ✅ Get all users
app.get('/api/users', async (req, res) => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json({ users: data });
});

// Add user
app.post('/api/users', async (req, res) => {
    const { name, email } = req.body;
    const { data, error } = await supabase
        .from('users')
        .insert([{ name, email }])
        .select()
        .single();

    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to insert user' });
    }

    res.json({ user: data });
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to delete user' });
    }

    res.status(204).send();
});


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});