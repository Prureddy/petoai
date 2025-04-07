// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bnjmjhhxekimqxueyqzu.supabase.co'; // 🔁 Replace with your Supabase project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuam1qaGh4ZWtpbXF4dWV5cXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2MDQyNTIsImV4cCI6MjA1NTE4MDI1Mn0.47no5sOG4UHwyIymZDdVoS3Yc27wSQItLoF70POCSHk'; 

export const supabase = createClient(supabaseUrl, supabaseKey);
