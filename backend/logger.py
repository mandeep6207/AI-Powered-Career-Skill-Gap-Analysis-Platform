import sys
import datetime
import os

LOG_DIR = os.path.join(os.path.dirname(__file__), 'logs')
os.makedirs(LOG_DIR, exist_ok=True)

class Logger:
    def __init__(self, name='app'):
        self.name = name
        self.log_file = os.path.join(LOG_DIR, f'{name}.log')

    def log(self, level, message, **kwargs):
        timestamp = datetime.datetime.utcnow().isoformat()
        extra = ' | '.join([f'{k}={v}' for k, v in kwargs.items()]) if kwargs else ''
        log_line = f'[{timestamp}] [{level.upper()}] {message} {extra}'
        print(log_line, file=sys.stdout)
        
        # Also write to file
        try:
            with open(self.log_file, 'a') as f:
                f.write(log_line + '\n')
        except Exception as e:
            print(f'Failed to write to log file: {e}')

    def info(self, msg, **kw):
        self.log('info', msg, **kw)

    def error(self, msg, **kw):
        self.log('error', msg, **kw)

    def debug(self, msg, **kw):
        self.log('debug', msg, **kw)

    def warning(self, msg, **kw):
        self.log('warning', msg, **kw)
