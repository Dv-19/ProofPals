#!/usr/bin/env python3
"""
Update published_pubkeys.json with current database users
"""

import asyncio
import json
import sys
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

async def update_published_keys():
    """Update published_pubkeys.json with current database users"""
    
    try:
        from database import get_db
        from models import User as UserModel
        from sqlalchemy import select
        
        async for db in get_db():
            # Get all users with public keys
            result = await db.execute(
                select(UserModel.id, UserModel.username, UserModel.role, UserModel.public_key_hex)
                .where(UserModel.public_key_hex.is_not(None))
                .order_by(UserModel.id)
            )
            users = result.all()
            
            # Create the published keys data
            published_keys = []
            for user in users:
                published_keys.append({
                    "reviewer_id": user.id,
                    "username": user.username,
                    "role": user.role,
                    "public_key_hex": user.public_key_hex
                })
            
            # Write to published_pubkeys.json
            json_path = Path(__file__).parent / "published_pubkeys.json"
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(published_keys, f, indent=2)
            
            print(f"✅ Updated published_pubkeys.json with {len(published_keys)} users:")
            for user in published_keys:
                print(f"   - {user['username']} ({user['role']}): {user['public_key_hex'][:32]}...")
            
            break
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    asyncio.run(update_published_keys())
