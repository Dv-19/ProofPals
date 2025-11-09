#!/usr/bin/env python3
"""
Debug what API calls the frontend is making
"""

import asyncio
import sys
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

async def debug_frontend_calls():
    """Check all possible escalation-related endpoints"""
    
    print("=" * 70)
    print("DEBUGGING FRONTEND ESCALATION CALLS")
    print("=" * 70)
    
    try:
        from httpx import AsyncClient
        from main import app
        
        # Login as admin first
        async with AsyncClient(app=app, base_url="http://test") as client:
            
            # Login
            login_response = await client.post("/api/v1/auth/login", json={
                "username": "Yoman",
                "password": "Yoma1234"
            })
            
            if login_response.status_code != 200:
                print(f"❌ Login failed: {login_response.text}")
                return
            
            token = login_response.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}
            
            print("✅ Admin logged in successfully")
            
            # Test all possible escalation endpoints
            endpoints_to_test = [
                "/api/v1/admin/escalations",
                "/api/v1/escalations", 
                "/api/v1/admin/submissions",
                "/api/v1/submissions",
                "/api/v1/admin/flagged"
            ]
            
            for endpoint in endpoints_to_test:
                print(f"\n🔍 Testing: {endpoint}")
                
                try:
                    response = await client.get(endpoint, headers=headers)
                    print(f"   Status: {response.status_code}")
                    
                    if response.status_code == 200:
                        data = response.json()
                        
                        # Check for escalated content
                        escalated_count = 0
                        
                        if "escalated_submissions" in data:
                            escalated_count = len(data["escalated_submissions"])
                            print(f"   ✅ Found {escalated_count} escalated submissions")
                            
                            if escalated_count > 0:
                                for sub in data["escalated_submissions"]:
                                    print(f"      - ID {sub['id']}: {sub['genre']} ({sub['status']})")
                        
                        elif "submissions" in data:
                            submissions = data["submissions"]
                            escalated = [s for s in submissions if s.get("status") == "escalated"]
                            escalated_count = len(escalated)
                            print(f"   ✅ Found {escalated_count} escalated in submissions list")
                            
                            if escalated_count > 0:
                                for sub in escalated:
                                    print(f"      - ID {sub['id']}: {sub['genre']} ({sub['status']})")
                        
                        elif isinstance(data, list):
                            escalated = [s for s in data if s.get("status") == "escalated"]
                            escalated_count = len(escalated)
                            print(f"   ✅ Found {escalated_count} escalated in list response")
                        
                        else:
                            print(f"   📋 Response keys: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")
                        
                        if escalated_count == 0:
                            print(f"   ⚠️  No escalated content found in this endpoint")
                    
                    elif response.status_code == 401:
                        print(f"   🔒 Requires authentication")
                    elif response.status_code == 403:
                        print(f"   🚫 Access forbidden")
                    elif response.status_code == 404:
                        print(f"   ❌ Endpoint not found")
                    else:
                        print(f"   ❌ Error: {response.text[:100]}...")
                        
                except Exception as e:
                    print(f"   ❌ Request failed: {e}")
            
            # Check what the frontend might be calling incorrectly
            print(f"\n🔍 Testing potential frontend issues:")
            
            # Test without proper headers
            print(f"\n   Testing without Authorization header:")
            response = await client.get("/api/v1/admin/escalations")
            print(f"   Status: {response.status_code} (should be 401)")
            
            # Test with wrong token
            print(f"\n   Testing with wrong token:")
            wrong_headers = {"Authorization": "Bearer invalid_token"}
            response = await client.get("/api/v1/admin/escalations", headers=wrong_headers)
            print(f"   Status: {response.status_code} (should be 401)")
            
            # Test the exact working call
            print(f"\n   Testing the working call:")
            response = await client.get("/api/v1/admin/escalations", headers=headers)
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Success: {data['count']} escalated submissions")
                print(f"   📋 Response: {data}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug_frontend_calls())
