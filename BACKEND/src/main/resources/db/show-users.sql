-- Connect to the database
\c mira_textile_db;

-- Show all users in the database
SELECT 
    user_id,
    username,
    full_name,
    email,
    role,
    is_active,
    created_at,
    last_login
FROM users
ORDER BY created_at DESC; 