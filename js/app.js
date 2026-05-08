const supabaseUrl = "https://xmmdsneqlmiemkywaeoo.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtbWRzbmVxbG1pZW1reXdhZW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNTc3MjMsImV4cCI6MjA5MzgzMzcyM30.I6NW9iXRjhrjpol3JIKOqwyTFfMT9rUyis12Kreuwg4";

window.supabaseClient = supabase.createClient(
  supabaseUrl,
  supabaseKey
);