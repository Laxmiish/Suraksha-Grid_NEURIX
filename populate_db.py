import sqlite3
import os

db_path = r'f:\Projects\Suraksha Grid\Suraksha Grid\suraksha.db'
sql_path = r'f:\Projects\Suraksha Grid\Suraksha Grid\Backend\sql_scripts\init_db.sql'

if os.path.exists(db_path):
    os.remove(db_path)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

with open(sql_path, 'r', encoding='utf-8') as f:
    sql_script = f.read()

# Fix MySQL to SQLite syntax
sql_script = sql_script.replace('INT AUTO_INCREMENT PRIMARY KEY', 'INTEGER PRIMARY KEY AUTOINCREMENT')
sql_script = sql_script.replace('UNIQUE KEY unique_attendance', 'UNIQUE')

try:
    cursor.executescript(sql_script)
    conn.commit()
    print("Database populated successfully.")
except Exception as e:
    print("Error:", e)
finally:
    conn.close()
