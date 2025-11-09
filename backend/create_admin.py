#!/usr/bin/env python3
"""
Create Admin User Script
Run this to create an admin user for ProofPals
"""

import asyncio
import sys
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

async def create_admin():
    """Create admin user"""
    
    print("=" * 60)
    print("ProofPals Admin User Creation")
    print("=" * 60)
    
    try:
        from database import get_db
        from auth_service import get_auth_service, UserCreate
        
        # Get user input
        username = input("\nEnter admin username (default: admin): ").strip() or "admin"
        email = input("Enter admin email (default: admin@proofpals.com): ").strip() or "admin@proofpals.com"
        password = input("Enter admin password (default: admin123): ").strip() or "admin123"
        
        print(f"\nCreating admin user:")
        print(f"  Username: {username}")
        print(f"  Email: {email}")
        print(f"  Role: admin")
        
        # Create the user data object
        user_data = UserCreate(
            username=username,
            email=email,
            password=password,
            role="admin"
        )
        
        # Create the user
        auth_service = get_auth_service()
        
        async for db in get_db():
            success, user_id, error = await auth_service.create_user(
                user_data=user_data,
                db=db
            )
            
            if success:
                print(f"\n✅ Admin user created successfully!")
                print(f"   User ID: {user_id}")
                print(f"\nYou can now login with:")
                print(f"   Username: {username}")
                print(f"   Password: {password}")
                print(f"\nLogin endpoint: POST /api/v1/auth/login")
            else:
                print(f"\n❌ Failed to create admin user: {error}")
                return 1
            
            break
            
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    try:
        exit_code = asyncio.run(create_admin())
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n\nCancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nFatal error: {e}")
        sys.exit(1)
