#!/usr/bin/env python3
"""
Fix user keys - generate crypto keys for users who don't have them
"""

import asyncio
import sys
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

async def fix_user_keys():
    """Generate crypto keys for users who don't have them"""
    
    print("=" * 60)
    print("ProofPals User Key Generation Fix")
    print("=" * 60)
    
    try:
        from database import get_db
        from models import User as UserModel
        from crypto_service import get_crypto_service
        from sqlalchemy import select, update
        
        crypto_service = get_crypto_service()
        if not crypto_service:
            print("❌ Crypto service not available")
            return 1
        
        async for db in get_db():
            # Get all users without keys
            result = await db.execute(
                select(UserModel)
                .where(UserModel.public_key_hex.is_(None))
                .order_by(UserModel.id)
            )
            users_without_keys = result.scalars().all()
            
            if not users_without_keys:
                print("✅ All users already have crypto keys!")
                return 0
            
            print(f"Found {len(users_without_keys)} users without crypto keys:")
            
            for user in users_without_keys:
                print(f"\n🔑 Generating keys for user: {user.username} (ID: {user.id}, Role: {user.role})")
                
                try:
                    # Generate new keypair
                    seed_hex, private_key_hex, public_key_hex = crypto_service.generate_keypair()
                    
                    # Update user with new keys
                    await db.execute(
                        update(UserModel)
                        .where(UserModel.id == user.id)
                        .values(
                            public_key_hex=public_key_hex,
                            private_key_hex=private_key_hex,
                            key_seed_hex=seed_hex
                        )
                    )
                    
                    print(f"   ✅ Generated keys for {user.username}")
                    print(f"      Public key: {public_key_hex[:32]}...")
                    
                except Exception as e:
                    print(f"   ❌ Failed to generate keys for {user.username}: {e}")
            
            # Commit all changes
            await db.commit()
            print(f"\n✅ Successfully generated keys for {len(users_without_keys)} users!")
            
            # Verify the fix
            print("\n📋 Verification - Users with keys:")
            result = await db.execute(
                select(UserModel.username, UserModel.role, UserModel.public_key_hex)
                .where(UserModel.public_key_hex.is_not(None))
                .order_by(UserModel.username)
            )
            users_with_keys = result.all()
            
            for user in users_with_keys:
                print(f"   ✓ {user.username} ({user.role}): {user.public_key_hex[:32]}...")
            
            print(f"\n🎉 Total users with keys: {len(users_with_keys)}")
            print("\nNow you can create rings using these public keys!")
            
            break
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    try:
        exit_code = asyncio.run(fix_user_keys())
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n\nCancelled by user")
        sys.exit(1)
