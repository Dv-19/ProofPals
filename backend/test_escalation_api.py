#!/usr/bin/env python3
"""
Test the escalation API endpoint
"""

import asyncio
import sys
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

async def test_escalation_api():
    """Test the admin escalation API endpoint"""
    
    print("=" * 60)
    print("TESTING ESCALATION API ENDPOINT")
    print("=" * 60)
    
    try:
        from httpx import AsyncClient
        from main import app
        
        async with AsyncClient(app=app, base_url="http://test") as client:
            
            # Test without authentication (should fail)
            print("\n1. Testing without authentication:")
            response = await client.get("/api/v1/admin/escalations")
            print(f"   Status: {response.status_code}")
            if response.status_code == 401:
                print("   ✅ Correctly requires authentication")
            else:
                print(f"   ❌ Unexpected response: {response.text}")
            
            # Test with admin authentication
            print("\n2. Testing with admin authentication:")
            
            # First login as admin with the correct password
            login_response = await client.post("/api/v1/auth/login", json={
                "username": "Yoman",
                "password": "Yoma1234"
            })
            
            login_success = False
            token = None
            
            if login_response.status_code == 200:
                login_data = login_response.json()
                token = login_data["access_token"]
                print(f"   ✅ Admin login successful")
                login_success = True
            else:
                print(f"   ❌ Admin login failed: {login_response.text}")
            
            if login_success:
                # Now test escalations endpoint with token
                headers = {"Authorization": f"Bearer {token}"}
                escalation_response = await client.get("/api/v1/admin/escalations", headers=headers)
                
                print(f"   Escalations API Status: {escalation_response.status_code}")
                
                if escalation_response.status_code == 200:
                    data = escalation_response.json()
                    print(f"   ✅ API call successful!")
                    print(f"   Response: {data}")
                    
                    if data.get("escalated_submissions"):
                        escalated = data["escalated_submissions"]
                        print(f"\n   📋 Found {len(escalated)} escalated submissions:")
                        for sub in escalated:
                            print(f"   - ID {sub['id']}: {sub['genre']}")
                            print(f"     Status: {sub['status']}")
                            print(f"     Content: {sub['content_ref'][:50]}...")
                            print(f"     Created: {sub['created_at']}")
                    else:
                        print("   ❌ No escalated submissions in API response")
                        
                else:
                    print(f"   ❌ API call failed: {escalation_response.text}")
                    
            else:
                print(f"   ❌ Admin login failed: {login_response.text}")
                
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_escalation_api())
