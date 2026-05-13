import os
import sqlite3
import json
from datetime import datetime

MIGRATIONS_DIR = os.path.join(os.path.dirname(__file__), 'migrations')
os.makedirs(MIGRATIONS_DIR, exist_ok=True)

class DatabaseMigration:
    def __init__(self, db_path):
        self.db_path = db_path
        self.migrations = []
        self._init_migrations_table()
    
    def _init_migrations_table(self):
        """Create migrations tracking table if it doesn't exist"""
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute('''
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                migration_name TEXT UNIQUE,
                executed_at TEXT
            )
        ''')
        conn.commit()
        conn.close()
    
    def register_migration(self, name, sql_commands):
        """Register a migration"""
        self.migrations.append({
            'name': name,
            'commands': sql_commands if isinstance(sql_commands, list) else [sql_commands]
        })
    
    def run_migrations(self):
        """Execute all pending migrations"""
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        
        for migration in self.migrations:
            # Check if migration already run
            cur.execute('SELECT id FROM schema_migrations WHERE migration_name = ?', (migration['name'],))
            if cur.fetchone():
                continue
            
            print(f"Running migration: {migration['name']}")
            try:
                for command in migration['commands']:
                    cur.execute(command)
                
                # Record migration
                cur.execute(
                    'INSERT INTO schema_migrations (migration_name, executed_at) VALUES (?, ?)',
                    (migration['name'], datetime.utcnow().isoformat())
                )
                conn.commit()
                print(f"✓ Migration completed: {migration['name']}")
            except Exception as e:
                conn.rollback()
                print(f"✗ Migration failed: {migration['name']} - {str(e)}")
                raise
        
        conn.close()
    
    def get_migration_status(self):
        """Get status of all migrations"""
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute('SELECT migration_name, executed_at FROM schema_migrations ORDER BY executed_at')
        return cur.fetchall()

# Migration definitions
def get_migrations():
    migration_handler = DatabaseMigration(':memory:')
    
    migration_handler.register_migration(
        '001_add_user_preferences',
        '''
        ALTER TABLE users ADD COLUMN preferences TEXT DEFAULT '{}';
        UPDATE users SET preferences = '{}' WHERE preferences IS NULL;
        '''
    )
    
    migration_handler.register_migration(
        '002_add_assessment_tags',
        '''
        ALTER TABLE assessments ADD COLUMN tags TEXT DEFAULT '';
        UPDATE assessments SET tags = '' WHERE tags IS NULL;
        '''
    )
    
    migration_handler.register_migration(
        '003_add_skill_tracking',
        '''
        CREATE TABLE IF NOT EXISTS user_skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            skill_name TEXT NOT NULL,
            proficiency TEXT DEFAULT 'Beginner',
            last_updated TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id),
            UNIQUE(user_id, skill_name)
        );
        '''
    )
    
    migration_handler.register_migration(
        '004_add_learning_goals',
        '''
        CREATE TABLE IF NOT EXISTS learning_goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            goal_name TEXT NOT NULL,
            target_role TEXT,
            deadline TEXT,
            status TEXT DEFAULT 'active',
            created_at TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        '''
    )
    
    return migration_handler
