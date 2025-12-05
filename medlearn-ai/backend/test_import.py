import sys
import traceback

print("Testing imports...")

try:
    print("1. Importing FastAPI...")
    from fastapi import FastAPI
    print("   ✓ FastAPI OK")
    
    print("2. Importing api.routes...")
    from api.routes import router
    print("   ✓ api.routes OK")
    
    print("3. Importing database.db...")
    from database.db import init_db
    print("   ✓ database.db OK")
    
    print("4. Importing main...")
    import main
    print("   ✓ main imported")
    print("   Main attributes:", [x for x in dir(main) if not x.startswith('_')])
    
    if hasattr(main, 'app'):
        print("   ✓ app found in main!")
        print("   App type:", type(main.app))
    else:
        print("   ✗ app NOT found in main")
        
except Exception as e:
    print(f"\n❌ Error: {e}")
    traceback.print_exc()
