#!/usr/bin/env python3
"""
Check user public keys in database
"""

import asyncio
import sys
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

async def check_keys():
    """Check what keys users have"""
    
    try:
        from database import get_db
        from models import User as UserModel
        from sqlalchemy import select
        
        async for db in get_db():
            # Get all users and their keys
            result = await db.execute(
                select(UserModel.id, UserModel.username, UserModel.role, 
                       UserModel.public_key_hex, UserModel.private_key_hex, UserModel.key_seed_hex)
                .order_by(UserModel.id)
            )
            users = result.all()
            
            print(f"Found {len(users)} users:")
            print("-" * 80)
            
            for user in users:
                print(f"User ID: {user.id}")
                print(f"  Username: {user.username}")
                print(f"  Role: {user.role}")
                print(f"  Public Key: {user.public_key_hex[:32] + '...' if user.public_key_hex else 'None'}")
                print(f"  Private Key: {user.private_key_hex[:32] + '...' if user.private_key_hex else 'None'}")
                print(f"  Seed: {user.key_seed_hex[:32] + '...' if user.key_seed_hex else 'None'}")
                print()
            
            # Check crypto service status
            print("Crypto Service Status:")
            print("-" * 40)
            try:
                from crypto_service import get_crypto_service, CRYPTO_AVAILABLE
                print(f"CRYPTO_AVAILABLE: {CRYPTO_AVAILABLE}")
                
                crypto_service = get_crypto_service()
                if crypto_service:
                    print("Crypto service: Available")
                    # Try to generate a test keypair
                    try:
                        seed_hex, private_key_hex, public_key_hex = crypto_service.generate_keypair()
                        print(f"Test key generation: SUCCESS")
                        print(f"  Sample public key: {public_key_hex[:32]}...")
                    except Exception as e:
                        print(f"Test key generation: FAILED - {e}")
                else:
                    print("Crypto service: Not available")
            except Exception as e:
                print(f"Crypto service check failed: {e}")
            
            break
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(check_keys())
