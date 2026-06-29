import sqlite3

try:
    conn = sqlite3.connect('c:/Users/user/Desktop/daraja-project/server/daraja.db')
    cursor = conn.cursor()
    cursor.execute("ALTER TABLE users ADD COLUMN institutionId INTEGER")
    cursor.execute("ALTER TABLE users ADD COLUMN uic VARCHAR(191)")
    conn.commit()
    print("Successfully added institutionId and uic columns to daraja.db")
except Exception as e:
    print(f"Error: {e}")
finally:
    conn.close()
